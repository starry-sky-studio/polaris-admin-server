import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { AuthType } from '@prisma/client'

export class LoginLogDto {
  @ApiProperty({ description: '用户名' })
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string

  @ApiProperty({ description: 'ip' })
  ip: string

  @ApiProperty({ description: '地址' })
  address: string

  @ApiProperty({ description: '操作系统' })
  os: string

  @ApiProperty({ description: '浏览器' })
  browser: string

  @ApiProperty({ description: '是否在线' })
  status: boolean

  @ApiPropertyOptional({ description: '登录信息' })
  message?: string

  @ApiProperty({ description: '认证类型' })
  authType: AuthType
}
