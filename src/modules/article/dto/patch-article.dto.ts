import { ApiPropertyOptional } from '@nestjs/swagger'

import { MaxLength, IsOptional, IsPositive, IsNotEmpty, IsString } from 'class-validator'

export class PatchArticleDto {
  @ApiPropertyOptional({ description: '作者名' })
  @MaxLength(50, { message: '作者名最大长度50' })
  @IsString({ message: '作者名应该为字符串' })
  @IsOptional()
  author?: string

  @ApiPropertyOptional({ description: '标题' })
  @MaxLength(50, { message: '标题的最大长度50' })
  @IsString({ message: '标题应该为字符串' })
  @IsOptional()
  title?: string

  @ApiPropertyOptional({ description: '内容' })
  @MaxLength(50, { message: '内容的最大长度50' })
  @IsString({ message: '内容应该为字符串' })
  @IsNotEmpty({ message: '内容不能为空' })
  content?: string

  @ApiPropertyOptional({ description: '点赞量', example: 1, default: 1 })
  @IsPositive({ message: '阅读量必须大于 0' })
  @IsOptional()
  viewCount?: number = 1

  @ApiPropertyOptional({ description: '点赞量', example: 1, default: 1 })
  @IsPositive({ message: '阅读量必须大于 0' })
  @IsOptional()
  likeCount?: number = 1

  @ApiPropertyOptional({ description: '收藏量', example: 1, default: 1 })
  @IsPositive({ message: '收藏量必须大于 0' })
  @IsOptional()
  collectCount?: number = 1

  @ApiPropertyOptional({ description: '正在观看人数', example: 1, default: 1 })
  @IsPositive({ message: '正在观看人数必须大于 0' })
  @IsOptional()
  watchCount?: number = 1
}
