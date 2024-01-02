import {
  Body,
  Controller,
  NotImplementedException,
  ParseEnumPipe,
  Post,
  Query,
  UseGuards
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto, SignupDto } from './dto'
import { LoginType } from '@/enums'
import { LocalAuthGuard } from '@/guard'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('权限认证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '登录' })
  @UseGuards(LocalAuthGuard)
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
  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto)
  }
}
