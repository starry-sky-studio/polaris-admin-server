import { BadRequestException, Injectable } from '@nestjs/common'
import { LoginDto } from './dto'
import { PrismaService } from 'src/shared/prisma/prisma.service'
import { UserService } from '../user/user.service'
import { compare, hash } from '@node-rs/bcrypt'
import { LoginType } from 'src/enums'
import { UserVo } from '../user/vo'
import { plainToClass } from 'class-transformer'
import { JwtPayload, RefreshToken } from '@/interface'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { LoginVo, TokenVo } from './vo'
import { CreateUserDto } from '../user/dto/create-user.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async login(loginDto: LoginDto, type: string) {
    let user: UserVo
    switch (type) {
      case LoginType.USERNAME:
        user = await this.loginByUsername(loginDto)
        break
      default:
        break
    }

    const { id, username } = user

    const token = this.generateTokens({
      sub: id,
      username
    })

    const loginVo = new LoginVo({
      user,
      ...token
    })

    return loginVo
  }

  async loginByUsername(loginDto: LoginDto) {
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
    if (!user) {
      throw new BadRequestException('用户不存在')
    }

    if (!(await compare(loginDto.password, user.password ?? ''))) {
      throw new BadRequestException('密码错误')
    }
    return plainToClass(UserVo, user)
  }

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

  async signup(signupDto: CreateUserDto) {
    try {
      await this.userService.create(signupDto)
      return '注册成功'
    } catch {
      return '注册失败'
    }
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
}
