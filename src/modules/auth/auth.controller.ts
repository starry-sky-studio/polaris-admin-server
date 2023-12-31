import {
  Body,
  Controller,
  NotImplementedException,
  ParseEnumPipe,
  Post,
  Query
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto'
import { LoginType } from '@/enums'

import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from '../user/dto/create-user.dto'
import { RefreshToken } from '@/interface'
import { SkipAuth } from '@/decorator'

@ApiTags('权限认证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '登录' })
  @SkipAuth()
  @Post('login')
  login(
    @Body() loginDto: LoginDto,
    @Query(
      'type',
      new ParseEnumPipe(LoginType, {
        exceptionFactory: () => {
          throw new NotImplementedException('请选择正确的登录类型')
        }
      })
    )
    type: string
  ) {
    return this.authService.login(loginDto, type)
  }

  @ApiOperation({ summary: '注册' })
  @SkipAuth()
  @Post('signup')
  signup(@Body() signupDto: CreateUserDto) {
    return this.authService.signup(signupDto)
  }

  @ApiOperation({ summary: '刷新token' })
  @ApiBody({})
  @Post('refresh')
  async refresh(@Body() refreshToken: RefreshToken) {
    return this.authService.refreshToken(refreshToken)
  }
}
