import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { hash } from '@node-rs/bcrypt'
import { plainToClass } from 'class-transformer'
import { UserVo } from './vo'
import { PrismaService } from '@/shared/prisma/prisma.service'
import { PatchUserDto } from './dto'

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto
    const findUser = await this.prismaService.user.findFirst({
      where: {
        username,
        deletedAt: null
      }
    })
    if (findUser) throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST)

    const passwordHash = await hash(password, 12)

    const user = await this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: passwordHash
      }
    })
    return plainToClass(UserVo, user)
  }

  async findUserById(id: number) {
    const findUser = await this.prismaService.user.findUnique({
      where: {
        id,
        deletedAt: null
      }
    })

    return plainToClass(UserVo, findUser)
  }

  async findUserByUsername(username: string) {
    const findUser = await this.prismaService.user.findUnique({
      where: {
        username,
        deletedAt: null
      }
    })

    return plainToClass(UserVo, findUser)
  }

  findAll() {
    return `This action returns all user`
  }

  async patch(id: number, patch: PatchUserDto, updatedBy?: number) {
    const userVo = plainToClass(
      UserVo,
      await this.prismaService.user.update({
        where: {
          id,
          deletedAt: null
        },
        data: {
          ...PatchUserDto,
          updatedBy
        }
      })
    )
    return userVo
  }

  async update(id: number, updateUserDto: UpdateUserDto, updatedBy?: number) {
    const userVo = plainToClass(
      UserVo,
      await this.prismaService.user.update({
        where: {
          id,
          deletedAt: null
        },
        data: {
          ...updateUserDto,
          updatedBy
        }
      })
    )
    return userVo
  }

  async remove(id: number, deletedBy: number) {
    await this.prismaService.user.update({
      where: {
        id,
        deletedAt: null
      },
      data: {
        deletedAt: new Date().toISOString(),
        deletedBy
      }
    })
    return '删除成功'
  }
}
