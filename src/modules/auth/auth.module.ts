import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserModule } from '../user/user.module'
import { PassportModule } from '@nestjs/passport'
import { PrismaService } from '@/shared/prisma/prisma.service'
import { UserService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { LocalStrategy } from './strategies'

@Module({
  imports: [UserModule, PassportModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, UserService, JwtService, ConfigService, LocalStrategy],
  exports: [AuthService]
})
export class AuthModule {}
