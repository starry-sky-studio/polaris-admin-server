import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { WinstonModule } from './winston/winston.module'
import { transports, format } from 'winston'
import * as chalk from 'chalk'

import { JwtModule } from '@nestjs/jwt'
import { AuthModule } from './modules/auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { JwtConfig } from '@/configs'
import { PrismaModule } from './shared/prisma/prisma.module'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [
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

    JwtModule.register({
      secret: '',
      signOptions: {
        expiresIn: '7d'
      }
    }),
    AuthModule,
    PrismaModule,
    UserModule,
    ConfigModule.forRoot({
      load: [JwtConfig]
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
