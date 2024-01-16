import { Module } from '@nestjs/common'
import { LoginLogService } from './login-log.service'
import { LoginLogController } from './login-log.controller'

@Module({
  controllers: [LoginLogController],
  providers: [LoginLogService]
})
export class LoginLogModule {}
