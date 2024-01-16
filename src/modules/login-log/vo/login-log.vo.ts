import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

import { BaseResource } from '@/class'
import { AuthType } from '@prisma/client'

export class LoginLogVo extends BaseResource {
  @ApiProperty({ description: 'ID' })
  id: number

  @ApiProperty({ description: '用户名' })
  username: string

  @ApiProperty({ description: '登录类型' })
  @IsOptional()
  authType: AuthType

  @ApiProperty({ description: '操作系统' })
  os: string

  @ApiProperty({ description: '地址' })
  address: string

  @ApiProperty({ description: '名' })
  browser: string

  @ApiPropertyOptional({ description: '登录信息' })
  message?: string
}
