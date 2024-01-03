import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { WinstonModule } from './winston/winston.module'
import { transports, format } from 'winston'
import * as chalk from 'chalk'

import { JwtModule } from '@nestjs/jwt'
import { AuthModule } from './modules/auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { JwtConfig, RedisConfig } from '@/configs'
import { PrismaModule } from './shared/prisma/prisma.module'
import { UserModule } from './modules/user/user.module'
import { APP_GUARD } from '@nestjs/core'
import { LocalAuthGuard } from './guard'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [JwtConfig, RedisConfig],
      cache: true,
      expandVariables: true
    }),
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
    })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: LocalAuthGuard
    }
  ]
})
export class AppModule {}
