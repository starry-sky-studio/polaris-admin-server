import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, NotContains, IsPositive, IsString, MaxLength } from 'class-validator'

export class CreateArticleDto {
  @ApiProperty({ description: '作者名' })
  @MaxLength(50, { message: '作者名最大长度50' })
  @IsString({ message: '作者名应该为字符串' })
  @NotContains(' ', { message: '作者名不能包含空格' })
  @IsNotEmpty({ message: '作者名不能为空' })
  author: string

  @ApiProperty({ description: '标题' })
  @MaxLength(50, { message: '标题最大长度50' })
  @IsString({ message: '标题应该为字符串' })
  @NotContains(' ', { message: '标题不能包含空格' })
  @IsNotEmpty({ message: '标题不能为空' })
  title: string

  @ApiProperty({ description: '内容' })
  @MaxLength(50, { message: '内容最大长度500' })
  @IsString({ message: '内容应该为字符串' })
  @NotContains(' ', { message: '内容不能包含空格' })
  @IsNotEmpty({ message: '内容不能为空' })
  content: string

  @ApiProperty({ description: '点赞量', example: 1, default: 1 })
  @IsPositive({ message: '阅读量必须大于 0' })
  viewCount: number = 1

  @ApiProperty({ description: '点赞量', example: 1, default: 1 })
  @IsPositive({ message: '阅读量必须大于 0' })
  likeCount: number = 1

  @ApiProperty({ description: '收藏量', example: 1, default: 1 })
  @IsPositive({ message: '收藏量必须大于 0' })
  collectCount: number = 1

  @ApiProperty({ description: '正在观看人数', example: 1, default: 1 })
  @IsPositive({ message: '正在观看人数必须大于 0' })
  watchCount: number = 1
}
