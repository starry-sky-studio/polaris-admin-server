import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class SignupDto {
  @ApiProperty({ describe: '用户名' })
  @IsNotEmpty({
    message: '用户名不能为空'
  })
  username: string

  @ApiProperty({ describe: '用户名' })
  @IsNotEmpty({
    message: '密码不能为空'
  })
  password: string
}
