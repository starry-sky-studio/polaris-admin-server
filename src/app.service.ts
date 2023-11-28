import { Inject, Injectable } from '@nestjs/common'
import { RedisClientType } from 'redis'

@Injectable()
export class AppService {
  // @Inject('REDIS_CLIENT')
  // private redisClient: RedisClientType

  getHello() {
    // const value = await this.redisClient.keys('*')
    // console.log(value)
    return 'Hello 1111'
  }
  test(): string {
    return 'test'
  }
}
