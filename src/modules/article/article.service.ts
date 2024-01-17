import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateArticleDto } from './dto/create-article.dto'
import { UpdateArticleDto } from './dto/update-article.dto'
import { PrismaService } from '@/shared/prisma/prisma.service'
import { ArticleVo } from './vo'
import { plainToClass } from 'class-transformer'
import { PatchArticleDto } from './dto'
import { RedisService } from '@/shared/redis/redis.service'

@Injectable()
export class ArticleService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService
  ) {}
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

  async view(id: number, userId: number) {
    const res = await this.redisService.hashGet(`article_${id}`)

    if (res.viewCount === undefined) {
      const article = await this.prismaService.article.update({
        where: {
          id,
          deletedAt: null
        },
        data: {
          viewCount: {
            increment: 1
          }
        }
      })
      await this.redisService.hashSet(`article_${id}`, {
        viewCount: article.viewCount,
        likeCount: article.likeCount,
        collectCount: article.collectCount
      })

      await this.redisService.set(`user_${userId}_article_${id}`, 1, 10)

      return article.viewCount
    } else {
      const flag = await this.redisService.get(`user_${userId}_article_${id}`)
      if (flag) {
        return res.viewCount
      }

      await this.redisService.hashSet(`article_${id}`, {
        ...res,
        viewCount: +res.viewCount + 1
      })
      await this.redisService.set(`user_${userId}_article_${id}`, 1, 10)
      return +res.viewCount + 1
    }
  }

  async flushRedisToDB() {
    const keys = await this.redisService.keys(`article_*`)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]

      const res = await this.redisService.hashGet(key)

      const [, id] = key.split('_')

      await this.prismaService.article.update({
        where: { id: Number(id), deletedBy: null },
        data: { viewCount: +res.viewCount }
      })
    }
  }
}
