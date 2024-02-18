import { Global, Module } from '@nestjs/common'
import { RedisService } from './redis.service'
import { createClient } from 'redis'
import { ConfigService } from '@nestjs/config'
import { RedisZsetService } from './redis-zset.service'
@Global()
@Module({
  providers: [
    RedisService,
    RedisZsetService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory(configService: ConfigService) {
        const client = createClient({
          socket: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT')
          },
          database: configService.get('REDIS_DATABASE'),
          password: configService.get('REDIS_PASSWORD')
        })
        client.on('error', (err) => console.log(err, 'redis连接失败'))
        await client.connect()
        return client
      },
      inject: [ConfigService]
    }
  ],
  exports: [RedisService, RedisZsetService]
})
export class RedisModule {}
