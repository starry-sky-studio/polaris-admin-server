import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsOptional } from 'class-validator'

import { PageDto } from '@/class'
import { AuthType } from '@prisma/client'

export class PageLoginLogDto extends PageDto {
  @ApiPropertyOptional({ description: 'ID' })
  @IsNumber({}, { message: 'id为数字类型' })
  @IsOptional()
  id?: number

  @ApiPropertyOptional({ description: '登录类型' })
  @IsOptional()
  authType?: AuthType
}
