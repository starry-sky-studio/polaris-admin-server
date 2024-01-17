import { Inject, Injectable } from '@nestjs/common'
import { RedisClientType } from 'redis'

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType

  async get(key: string) {
    return await this.redisClient.get(key)
  }

  async set(key: string, value: string | number, ttl?: number) {
    await this.redisClient.set(key, value)

    if (ttl) {
      await this.redisClient.expire(key, ttl)
    }
  }

  // hGetAll 哈希表命令 用于获取指定哈希表中的所有字段和对应的值
  async hashGet(key: string) {
    return await this.redisClient.hGetAll(key)
  }

  async hashSet(key: string, obj: Record<string, any>, ttl?: number) {
    for (const name in obj) {
      await this.redisClient.hSet(key, name, obj[name])
    }

    if (ttl) {
      await this.redisClient.expire(key, ttl)
    }
  }

  async keys(pattern: string) {
    return await this.redisClient.keys(pattern)
  }
}
