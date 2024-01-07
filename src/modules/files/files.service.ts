import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/shared/prisma/prisma.service'

@Injectable()
export class FilesService {
  constructor(private readonly prismaService: PrismaService) {}

  async saveAvatar(avatarUrl: string, id: number) {
    await this.prismaService.user.update({
      where: {
        id,
        deletedAt: null
      },
      data: {
        avatarUrl
      }
    })
    return '修改成功'
  }
}
