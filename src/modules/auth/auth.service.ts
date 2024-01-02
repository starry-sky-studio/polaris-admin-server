import { BadRequestException, Injectable } from '@nestjs/common'
import { LoginDto } from './dto'
import { PrismaService } from 'src/shared/prisma/prisma.service'
import { UserService } from '../user/user.service'
import { compare } from '@node-rs/bcrypt'
import { LoginType } from 'src/enums'
import { UserVo } from '../user/vo'
import { plainToClass } from 'class-transformer'
import { JwtPayload } from '@/interceptors'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { LoginVo } from './vo'
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
        secret: this.configService.get('accessTokenSecret'),
        expiresIn: this.configService.get('accessTokenExp')
      }),
      refreshToken: this.jwtService.sign(jwtPayload, {
        secret: this.configService.get('refreshTokenSecret'),
        expiresIn: this.configService.get('refreshTokenExp')
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
}
