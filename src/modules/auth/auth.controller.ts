import {
  Body,
  Controller,
  NotImplementedException,
  ParseEnumPipe,
  Post,
  Query,
  UnauthorizedException,
  Get,
  Req
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto'
import { AuthType } from '@prisma/client'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from '../user/dto/create-user.dto'
import { RefreshToken } from '@/interface'
import { SkipAuth } from '@/decorator'
import { Request } from 'express'

@ApiTags('权限认证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '登录' })
  @SkipAuth()
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Query(
      'type',
      new ParseEnumPipe(AuthType, {
        exceptionFactory: () => {
          throw new NotImplementedException('请选择正确的登录类型')
        }
      })
    )
    type: string,

    @Req() request: Request
  ) {
    //console.log(request, 'request')
    // console.log(request.ip, 'request.ip')

    // const userAgent = request.headers['user-agent']
    // console.log(userAgent, 'userAgent')
    // const parser = new UAParser()
    // const result = parser.setUA(userAgent).getResult()
    // console.log(result, 'parser')
    // console.log(result.browser.name, result.browser.os)
    // // const ip = request.ip
    // const userName = 'userName'
    // const browser = result.browser.name
    // const os =
    // const status = true
    // const address = ''

    // const query = new IP2Region()
    // const res = query.search('192.168.10.105')
    // console.log(res, 'res')
    const a = await this.authService.login(type, loginDto, '', request)
    console.log(a, 'a')
    //return [res.province, res.city].join(' ')
    return a
  }

  @ApiOperation({ summary: '注册' })
  @SkipAuth()
  @Post('signup')
  signup(@Body() signupDto: CreateUserDto) {
    return this.authService.signup(signupDto)
  }

  @ApiOperation({ summary: '刷新token' })
  @SkipAuth()
  @ApiBody({})
  @Post('refresh')
  async refresh(@Body() refreshToken: RefreshToken) {
    return this.authService.refreshToken(refreshToken)
  }

  @Get('/github')
  @SkipAuth()
  async githubLogin(
    @Query('code')
    code: string,
    @Query(
      'type',
      new ParseEnumPipe(AuthType, {
        exceptionFactory: () => {
          throw new NotImplementedException('请选择正确的登录类型')
        }
      })
    )
    type: AuthType
  ) {
    if (!code) {
      throw new UnauthorizedException('github授权失败', {
        cause: new Error(),
        description: '没有授权'
      })
    }
    const user = await this.authService.login(type, undefined, code)
    return user
  }
}
