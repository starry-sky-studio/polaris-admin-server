import { Global, Module } from '@nestjs/common'
import { RedisService } from './redis.service'
import { createClient } from 'redis'
import { ConfigService } from '@nestjs/config'

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory(configService: ConfigService) {
        const client = createClient({
          socket: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT')
          },
          database: configService.get('REDIS_DATABASE')
        })
        await client.connect()
        return client
      }
    }
  ]
})
export class RedisModule {}
