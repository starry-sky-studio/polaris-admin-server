import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Length,
  MaxLength,
  NotContains
} from 'class-validator'

export class UpdateUserDto {
  @ApiProperty({ description: '用户名' })
  @Length(1, 16, { message: '用户名长度1-16位' })
  @NotContains(' ', { message: '用户名不能包含空格' })
  @IsString({ message: '用户名必须包含字符串' })
  @IsNotEmpty({ message: '用户名不能为空' })
  username?: string

  @ApiPropertyOptional({ description: '昵称' })
  @MaxLength(16, { message: '昵称最大长度16位' })
  @IsString({ message: '昵称必须为字符串' })
  @IsOptional()
  nickName?: string

  @ApiPropertyOptional({ description: '邮箱' })
  @MaxLength(50, { message: '邮箱最大长度50' })
  @IsEmail(undefined, { message: '邮箱必须符合邮箱格式' })
  @IsOptional()
  email?: string

  @ApiPropertyOptional({ description: '手机号' })
  @MaxLength(25, { message: '手机号的最大长度25' })
  @IsPhoneNumber(undefined, { message: '手机号不符合规范' })
  @IsOptional()
  phoneNumber?: string

  @ApiPropertyOptional({ description: '头像' })
  @MaxLength(100, { message: '头像的最大长度100' })
  @IsUrl(undefined, { message: '头像必须为url' })
  @IsOptional()
  avatarUrl?: string

  @ApiPropertyOptional({ description: '性别' })
  @MaxLength(10, { message: '性别最大长度为10' })
  @IsString({ message: '性别必须为字符串' })
  @IsOptional()
  gender?: string

  @ApiPropertyOptional({ description: '国家' })
  @MaxLength(25, { message: '国家最大长度25' })
  @IsString({ message: '国家为字符串' })
  @IsOptional()
  country?: string

  @ApiPropertyOptional({ description: '省份' })
  @MaxLength(25, { message: '省份最大长度25' })
  @IsString({ message: '省份为字符串' })
  @IsOptional()
  province?: string

  @ApiPropertyOptional({ description: '城市' })
  @MaxLength(25, { message: '城市最大长度25' })
  @IsString({ message: '城市为字符串' })
  @IsOptional()
  city?: string

  @ApiPropertyOptional({ description: '个人简介' })
  @MaxLength(500, { message: '个人简介最大长度500' })
  @IsString({ message: '个人简介为字符串' })
  @IsOptional()
  biography?: string

  @ApiPropertyOptional({ description: '个人网站' })
  @MaxLength(50, { message: '个人网站最大长度50' })
  @IsUrl(undefined, { message: '个人网站应为url地址' })
  @IsOptional()
  website?: string

  @ApiPropertyOptional({ description: '出生日期' })
  @IsDate({ message: '出生日期必须为日期格式' })
  @IsOptional()
  birthDate?: Date

  @ApiPropertyOptional({ description: '是否启用' })
  @IsBoolean({ message: '是否启用为布尔值' })
  @IsOptional()
  enabled?: boolean
}
