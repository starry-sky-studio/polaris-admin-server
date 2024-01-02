import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Length, Matches, NotContains } from 'class-validator'

export class CreateUserDto {
  @ApiProperty({ description: '用户名' })
  @Length(1, 16, { message: '用户名长度1-16位' })
  @NotContains(' ', { message: '用户名不能包含空格' })
  @IsString({ message: '用户名必须包含字符串' })
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string

  @ApiProperty({ description: '密码' })
  @Matches(/[0-9]/, { message: '用户名必须包含数字' })
  //@Matches(/[a-zA-Z]/, { message: '密码必须包含大小写字母' })
  @Length(6, 16, { message: '密码长度必须为6-16位' })
  @NotContains(' ', { message: '密码不能包含空格' })
  @IsString({ message: '密码必须为字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string
}
