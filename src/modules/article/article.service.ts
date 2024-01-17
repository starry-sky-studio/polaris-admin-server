import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateArticleDto } from './dto/create-article.dto'
import { UpdateArticleDto } from './dto/update-article.dto'
import { PrismaService } from '@/shared/prisma/prisma.service'
import { ArticleVo } from './vo'
import { plainToClass } from 'class-transformer'
import { PatchArticleDto } from './dto'

@Injectable()
export class ArticleService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createArticleDto: CreateArticleDto, createdBy: number) {
    const article = await this.prismaService.article.create({
      data: {
        ...createArticleDto,
        createdBy
      }
    })
    return plainToClass(ArticleVo, article)
  }

  findAll() {
    return `This action returns all article`
  }

  async findOne(id: number) {
    const article = await this.prismaService.article.findUnique({
      where: {
        id,
        deletedBy: null
      }
    })
    if (!article) {
      throw new NotFoundException('文章不存在', { cause: new Error(), description: '资源不存在' })
    }
    return plainToClass(ArticleVo, article)
  }

  async update(id: number, updateArticleDto: UpdateArticleDto, updatedBy: number) {
    const article = await this.prismaService.article.update({
      where: {
        id,
        deletedBy: null
      },
      data: {
        ...updateArticleDto,
        updatedBy
      }
    })
    return plainToClass(ArticleVo, article)
  }

  async patch(id: number, patchArticleDto: PatchArticleDto, updatedBy: number) {
    const article = await this.prismaService.article.update({
      where: {
        id,
        deletedBy: null
      },
      data: {
        ...patchArticleDto,
        updatedBy
      }
    })
    return plainToClass(ArticleVo, article)
  }

  async remove(id: number, deletedBy: number) {
    await this.prismaService.article.update({
      where: {
        id
      },
      data: {
        deletedBy
      }
    })
    return `删除成功`
  }

  async view(id: number) {
    this.prismaService.article.update({
      where: {
        id
      },
      data: {
        viewCount: {
          increment: 1
        }
      }
    })
  }
}
