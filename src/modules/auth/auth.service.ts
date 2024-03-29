import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { LoginDto, LoginLogDto } from './dto'
import { PrismaService } from 'src/shared/prisma/prisma.service'
import { UserService } from '../user/user.service'
import { compare, hash } from '@node-rs/bcrypt'
import { UserVo } from '../user/vo'
import { plainToClass } from 'class-transformer'
import { JwtPayload, RefreshToken } from '@/interface'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { LoginVo, TokenVo } from './vo'
import { CreateUserDto } from '../user/dto/create-user.dto'
import axios from 'axios'
import { AuthType } from '@prisma/client'
import { generateRandomString, getAddressByIp, getbrowserOs } from '@/utils'
import { Request } from 'express'

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async login(type: string, loginDto?: LoginDto, code?: string, req?: Request) {
    console.log(loginDto, 'loginDto')
    let user: UserVo
    let authType: AuthType
    switch (type) {
      case AuthType.USERNAME:
        authType = AuthType.USERNAME
        user = await this.loginByUsername(loginDto, req)

        break
      case AuthType.GITHUB:
        authType = AuthType.GITHUB
        user = await this.loginByGithub(code)
        break
      default:
        break
    }

    const { id, username } = user
    console.log(user, 'user')

    const token = this.generateTokens({
      sub: id,
      username
    })

    const loginVo = new LoginVo({
      user,
      ...token
    })

    const loginLog = this.getLoginLog(req, true, loginDto.username, '登录成功', authType)
    await this.loginLog(loginLog)

    return loginVo
  }

  async loginByUsername(loginDto: LoginDto, req?: Request) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: loginDto.username,
        deletedAt: null
      },
      include: {
        userRoles: {
          select: {
            role: true
          }
        }
      }
    })

    let errorMsg = ''

    if (!user) {
      errorMsg = '用户不存在'
    } else if (!(await compare(loginDto.password, user.password ?? ''))) {
      errorMsg = '密码错误'
    }

    if (errorMsg) {
      const loginLog = this.getLoginLog(req, false, loginDto.username, errorMsg, AuthType.USERNAME)
      await this.loginLog(loginLog)
      throw new BadRequestException(errorMsg)
    }

    return plainToClass(UserVo, user)
  }

  async signup(signupDto: CreateUserDto) {
    await this.userService.create(signupDto)
    return '创建成功'
  }

  async refreshToken(refreshToken: RefreshToken) {
    const data = this.jwtService.verify(refreshToken.refreshToken, {
      secret: this.configService.get('jwt.refreshTokenSecret')
    })
    const user = await this.userService.findUserById(data.sub)
    const { id, username } = user ?? {}
    const tokens = this.generateTokens({
      sub: id,
      username
    })
    return new TokenVo({ ...tokens })
  }

  async validateUser(username: string, password: string) {
    const user = await this.userService.findUserByUsername(username)
    const passwordHash = await hash(password, 12)
    if (user && user.password === passwordHash) {
      return user
    }
    return null
  }

  // github 登录
  async loginByGithub(code: string) {
    console.log(this.configService.get('login.client_id'), 'clientID')
    console.log(code, 'code')
    console.log(this.configService.get('login.client_secret'))
    let resultData: any
    let accessToken: string

    try {
      const tokenResponse = await axios({
        method: 'post',
        url:
          'https://github.com/login/oauth/access_token?' +
          `client_id=${this.configService.get('login.client_id')}&` +
          `client_secret=${this.configService.get('login.client_secret')}&` +
          `code=${code}`,
        headers: {
          accept: 'application/json'
        }
      })
      console.log(tokenResponse.data, 'tokenResponse')
      const { access_token } = tokenResponse.data ?? {}
      accessToken = access_token
      const result = await axios({
        method: 'get',
        url: `https://api.github.com/user`,
        headers: {
          accept: 'application/json',
          Authorization: `token ${access_token}`
        }
      })
      console.log(result.data, 'result')
      resultData = result.data
    } catch (e) {
      console.log(e, '获取失败哦')
      throw new UnauthorizedException('Github没有授权', {
        cause: new Error(),
        description: 'Github没有授权'
      })
    }

    console.log(resultData)
    console.log(accessToken)

    const { login, id, avatar_url, name, bio, location } = resultData

    const githubUserData = {
      id,
      login,
      name,
      avatarUrl: avatar_url,
      bio,
      location
    }
    if (!githubUserData || !githubUserData.id) {
      throw new UnauthorizedException('获取github信息失败', {
        cause: new Error(),
        description: '获取github信息失败'
      })
    }
    const authUser = await this.prismaService.auth.findFirst({
      include: {
        user: true
      },
      where: {
        authType: AuthType.GITHUB,
        openId: githubUserData.id.toString()
      }
    })

    console.log(authUser, 'authUser')

    //情况1: 本地未登录，第一次登录第三方 创建用户 将 github 信息写入 user 表
    if (!authUser) {
      const user = this.prismaService.user.create({
        data: {
          username: `User-${generateRandomString(8)}`,
          password: await hash('123456', 10),
          nickName: githubUserData.name ?? githubUserData.login,
          avatarUrl: githubUserData.avatarUrl,
          biography: githubUserData.bio,
          address: githubUserData.location,
          enabled: true,
          auths: {
            create: {
              authType: AuthType.GITHUB,
              accessToken: accessToken,
              openId: githubUserData.id.toString()
            }
          }
        }
      })
      // const userGithub = this.prismaService.userGithub.create({
      //   data: {
      //     ...resultData,
      //     userId: (await user).id
      //   }
      // })

      console.log([user])
      await this.prismaService.$transaction([user])

      return plainToClass(UserVo, user)
    } else {
      const user = await this.prismaService.user.findFirst({
        where: {
          id: authUser.userId
        }
      })

      // await this.prismaService.userGithub.update({
      //   where: {
      //     login
      //   },
      //   data: {
      //     ...resultData
      //   }
      // })

      return plainToClass(UserVo, user)
    }

    //2.2 情况2：本地未登录，再次登录第三方

    //2.3 情况3：本地登录，并绑定第三方
  }

  //生成双token
  generateTokens(jwtPayload: JwtPayload) {
    return {
      accessToken: this.jwtService.sign(jwtPayload, {
        secret: this.configService.get('jwt.accessTokenSecret'),
        expiresIn: this.configService.get('jwt.accessTokenExp')
      }),
      refreshToken: this.jwtService.sign(jwtPayload, {
        secret: this.configService.get('jwt.refreshTokenSecret'),
        expiresIn: this.configService.get('jwt.refreshTokenExp')
      })
    }
  }

  /**
   * @description 得到登录日志信息
   * @date 2024/01/16
   * @returns LoginLogDto
   */
  getLoginLog(
    request: Request,
    status: boolean,
    username: string,
    message: string,
    authType: AuthType
  ): LoginLogDto {
    const ip = request.ip ?? ''
    const address = getAddressByIp(ip)
    const { browser, os } = getbrowserOs(request) ?? {}
    return {
      ip,
      status,
      address,
      browser,
      os,
      username,
      message,
      authType
    }
  }

  /**
   * @description 设置登录日志信息
   * @date 2024/01/16
   * @returns
   */
  async loginLog(loginLogDto: LoginLogDto) {
    await this.prismaService.loginLog.create({
      data: {
        ...loginLogDto
      }
    })
  }
}
