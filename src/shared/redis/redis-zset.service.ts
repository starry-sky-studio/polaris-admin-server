import { Inject, Injectable } from '@nestjs/common'
import { RedisClientType } from 'redis'
@Injectable()
export class RedisZsetService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType

  async zRankingList(key: string, start: number = 0, end: number = -1) {
    // 使用await关键字等待zRange方法的结果
    console.log(start, end, 'start, end', key, 'keys')
    const keys = await this.redisClient.zRange(key, start, end, {
      REV: true
    })
    console.log(keys, 'keys')
    const rankingList = {}
    for (let i = 0; i < keys.length; i++) {
      rankingList[keys[i]] = await this.zScore(key, keys[i])
    }
    console.log(rankingList, 'rankingList')
    return rankingList
  }

  async zAdd(key: string, members: Record<string, number>) {
    console.log(key, members, 'key, members')
    const mems = []
    for (const key in members) {
      mems.push({
        value: key,
        score: members[key]
      })
    }

    return await this.redisClient.zAdd(key, mems)
  }

  async zScore(key: string, member: string) {
    return await this.redisClient.zScore(key, member)
  }

  async zRank(key: string, member: string) {
    return await this.redisClient.zRank(key, member)
  }

  async zIncr(key: string, member: string, increment: number) {
    return await this.redisClient.zIncrBy(key, increment, member)
  }

  async zUnion(newKey: string, keys: string[]) {
    console.log(newKey, keys, 'newKey, keys')
    if (!keys.length) {
      return []
    }
    if (keys.length === 1) {
      return this.zRankingList(keys[0])
    }

    await this.redisClient.zUnionStore(newKey, keys)

    return this.zRankingList(newKey)
  }

  async keys(pattern: string) {
    return this.redisClient.keys(pattern)
  }
}
