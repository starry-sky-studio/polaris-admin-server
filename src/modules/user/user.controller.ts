import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Jwt } from '@/decorator'
import { PageUserDto } from './dto'

@ApiTags('用户管理')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '创建用户' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @ApiOperation({ summary: '用户列表' })
  @Get()
  findAll(@Query() pageUserDto: PageUserDto) {
    return this.userService.findAll(pageUserDto)
  }

  @ApiOperation({ summary: '获取用户信息 [id]' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findUserById(+id)
  }

  @ApiOperation({ summary: '更新用户信息' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto)
  }

  @ApiOperation({ summary: '修改用户信息' })
  @Patch(':id')
  patch(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto)
  }

  @ApiOperation({ summary: '删除用户信息' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Jwt('sub') userId: number) {
    return this.userService.remove(+id, userId)
  }
}
