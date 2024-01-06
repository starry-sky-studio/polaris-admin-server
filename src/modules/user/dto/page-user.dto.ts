import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsNumber, IsOptional } from 'class-validator'

import { PageDto } from '@/class'

export class PageUserDto extends PageDto {
  @ApiPropertyOptional({ description: 'ID' })
  @IsNumber({}, { message: 'id应该为数字' })
  @IsOptional()
  id?: number

  @ApiPropertyOptional({ description: '是否启用' })
  @IsBoolean({ message: '启用禁用为布尔值' })
  @IsOptional()
  enabled?: boolean
}
