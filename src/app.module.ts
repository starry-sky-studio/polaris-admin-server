import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { WinstonModule } from './winston/winston.module'
import { transports, format } from 'winston'
import * as chalk from 'chalk'

import { JwtModule } from '@nestjs/jwt'
import { AuthModule } from './auth/auth.module';
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
      secret: 'guang',
      signOptions: {
        expiresIn: '7d'
      }
    }),

    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
