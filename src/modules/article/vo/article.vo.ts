import { ApiProperty } from '@nestjs/swagger'
import { BaseResource } from '@/class'

export class ArticleVo extends BaseResource {
  @ApiProperty({ description: '作者名' })
  author: string

  @ApiProperty({ description: '标题' })
  title: string

  @ApiProperty({ description: '内容' })
  content: string

  @ApiProperty({ description: '点赞量', example: 1, default: 1 })
  viewCount: number = 1

  @ApiProperty({ description: '点赞量', example: 1, default: 1 })
  likeCount: number = 1

  @ApiProperty({ description: '收藏量', example: 1, default: 1 })
  collectCount: number = 1

  @ApiProperty({ description: '正在观看人数', example: 1, default: 1 })
  watchCount: number = 1
}
