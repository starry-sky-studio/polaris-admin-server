import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { hash } from '@node-rs/bcrypt'
import { plainToClass } from 'class-transformer'
import { UserVo } from './vo'
import { PrismaService } from '@/shared/prisma/prisma.service'

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

  findOne(id: number) {
    return `This action returns a #${id} user`
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} ${updateUserDto}user`
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }
}
