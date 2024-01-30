import { Inject, Injectable } from '@nestjs/common'
import { RedisClientType } from 'redis'

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType

  // 在线用户缓存时间
  readonly ONLINE_USER_TTL = 60 * 5

  async get(key: string) {
    return await this.redisClient.get(key)
  }

  async set(key: string, value: string | number, ttl?: number) {
    await this.redisClient.set(key, value)

    if (ttl) {
      await this.redisClient.expire(key, ttl)
    }
  }

  // 是否存在缓存
  async exists(key: string) {
    return !!(await this.redisClient.exists(key))
  }

  // 设置 TTL
  async expire(key: string, ttl: number) {
    await this.redisClient.expire(key, ttl)
  }

  // 删除缓存
  async del(key: string | string[]) {
    await this.redisClient.del(key)
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
