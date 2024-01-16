import { Controller, Get, Query } from '@nestjs/common'
import { LoginLogService } from './login-log.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { PageDto } from '@/class'

@ApiTags('登录日志')
@Controller('login-log')
export class LoginLogController {
  constructor(private readonly loginLogService: LoginLogService) {}

  @ApiOperation({ summary: '获取登录信息' })
  @Get()
  findAll(@Query() pageDto: PageDto) {
    return this.loginLogService.findMany(pageDto)
  }
}
