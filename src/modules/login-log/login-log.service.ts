import { Injectable } from '@nestjs/common'
import { PageLoginLogDto } from './dto'
import type { Prisma } from '@prisma/client'
import _ from 'lodash'
import { PrismaService } from '@/shared/prisma/prisma.service'
import { PageLoginLogVo } from './vo'
import { plainToClass } from 'class-transformer'

@Injectable()
export class LoginLogService {
  constructor(private readonly prismaService: PrismaService) {}
  async findMany(pageLoginLogDto: PageLoginLogDto) {
    const { page, pageSize, keywords, id, authType } = pageLoginLogDto

    const where: Prisma.LoginLogWhereInput = {
      deletedAt: null,
      AND: [
        {
          id: {
            ...(id && { equals: id })
          },
          authType: {
            ...(authType && { equals: authType })
          }
        }
      ],
      OR: keywords
        ? [
            { id: { equals: _.toNumber(keywords) < 100000 ? _.toNumber(keywords) : 0 } },
            { username: { contains: keywords } },
            { os: { contains: keywords } },
            { address: { contains: keywords } },
            { ip: { contains: keywords } },
            { browser: { contains: keywords } },
            { message: { contains: keywords } }
          ]
        : undefined
    }

    const records = await this.prismaService.loginLog.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize
    })
    const total = await this.prismaService.loginLog.count({ where })
    return plainToClass(PageLoginLogVo, {
      records,
      total,
      page,
      pageSize
    })
  }
}
