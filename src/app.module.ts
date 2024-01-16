import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { WinstonModule } from './winston/winston.module'
import { transports, format } from 'winston'
import * as chalk from 'chalk'

import { JwtModule } from '@nestjs/jwt'
import { AuthModule } from './modules/auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { JwtConfig, RedisConfig, LoginConfig } from '@/configs'
import { PrismaModule } from './shared/prisma/prisma.module'
import { UserModule } from './modules/user/user.module'
import { APP_GUARD } from '@nestjs/core'
import { LocalAuthGuard } from './guard'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { GatewayModule } from './modules/gateway/gateway.module'
import { FilesModule } from './modules/files/files.module'
import { LoginLogModule } from './modules/login-log/login-log.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [JwtConfig, RedisConfig, LoginConfig],
      cache: true,
      expandVariables: true
    }),
    // 限流模块
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 5 }, // 每秒调用不超过 5 次
      { name: 'medium', ttl: 10000, limit: 50 }, // 每 10 秒调用不超过 50 次
      { name: 'long', ttl: 60000, limit: 300 } // 每分钟调用不超过 300 次
    ]),
    WinstonModule.forRoot({
      level: 'debug',
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(({ context, level, message, time }) => {
              const appStr = chalk.green('[NEST]')
              const contextStr = chalk.yellow(`[${context}]`)
              return `${appStr} ${time} ${level} ${contextStr} ${message} `
            })
          )
        }),
        new transports.File({
          format: format.combine(format.timestamp(), format.json()),
          filename: '111.log',
          dirname: 'log'
        })
      ]
    }),

    AuthModule,
    PrismaModule,
    UserModule,
    JwtModule.register({
      global: true
    }),
    GatewayModule,
    FilesModule,
    LoginLogModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: LocalAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule {}
