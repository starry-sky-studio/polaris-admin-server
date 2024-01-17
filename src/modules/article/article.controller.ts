import { Controller, Get, Put, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { ArticleService } from './article.service'
import { CreateArticleDto, PatchArticleDto, UpdateArticleDto } from './dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { UserInfo } from '@/decorator'

@ApiTags('文章管理')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({ summary: '创建文章' })
  @Post()
  create(@Body() createArticleDto: CreateArticleDto, @UserInfo('userId') userId: number) {
    return this.articleService.create(createArticleDto, userId)
  }

  @ApiOperation({ summary: '查找文章列表' })
  @Get()
  findAll() {
    return this.articleService.findAll()
  }

  @ApiOperation({ summary: '得到文章详情' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id)
  }

  @ApiOperation({ summary: '部分更新文章' })
  @Patch(':id')
  patch(
    @Param('id') id: string,
    @Body() patchArticleDto: PatchArticleDto,
    @UserInfo('userId') userId: number
  ) {
    return this.articleService.patch(+id, patchArticleDto, userId)
  }

  @ApiOperation({ summary: '全部更新文章' })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @UserInfo('userId') userId: number
  ) {
    return this.articleService.update(+id, updateArticleDto, userId)
  }

  @ApiOperation({ summary: '删除文章' })
  @Delete(':id')
  remove(@Param('id') id: string, @UserInfo('userId') userId: number) {
    return this.articleService.remove(+id, userId)
  }

  @ApiOperation({ summary: '阅读量统计' })
  @Get(':id/view')
  async view(@Param('id') id: string) {
    return await this.articleService.view(+id)
  }
}
