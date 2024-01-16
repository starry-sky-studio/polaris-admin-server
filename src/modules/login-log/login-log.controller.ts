import { Controller, Get, Query } from '@nestjs/common'
import { LoginLogService } from './login-log.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { PageLoginLogDto } from './dto'
import { SkipAuth } from '@/decorator'

@ApiTags('登录日志')
@Controller('login-log')
export class LoginLogController {
  constructor(private readonly loginLogService: LoginLogService) {}

  @ApiOperation({ summary: '获取登录信息' })
  @SkipAuth()
  @Get()
  findMany(@Query() pageLoginLogDto: PageLoginLogDto) {
    console.log(pageLoginLogDto, 'pageLoginLogDto')
    return this.loginLogService.findMany(pageLoginLogDto)
  }
}
