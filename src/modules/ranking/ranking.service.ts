import { RedisZsetService } from '@/shared/redis/redis-zset.service'
import { Inject, Injectable } from '@nestjs/common'
import * as dayjs from 'dayjs'

@Injectable()
export class RankingService {
  // @Inject(RedisZsetService)
  // redisService: RedisZsetService

  constructor(
    @Inject(RedisZsetService)
    private readonly redisService: RedisZsetService
  ) {}

  //private关键字可以定义私有成员。私有成员只能在类的内部访问，无法在类外部或子类中直接访问
  private getMonthKey() {
    const dateStr = dayjs().format('YYYY-MM')
    return `learning-ranking-month:${dateStr}`
  }

  private getYearKey() {
    const dateStr = dayjs().format('YYYY')
    return `learning-ranking-year:${dateStr}`
  }

  async join(name: string) {
    await this.redisService.zAdd(this.getMonthKey(), { [name]: 0 })
  }

  async addLearnTime(name: string, time: number) {
    await this.redisService.zIncr(this.getMonthKey(), name, time)
  }

  async getMonthRanking() {
    return this.redisService.zRankingList(this.getMonthKey(), 0, 10)
  }

  async getYearRanking() {
    const dateStr = dayjs().format('YYYY')
    const keys = await this.redisService.keys(`learning-ranking-month:${dateStr}-*`)
    console.log(keys, 'keys')
    return this.redisService.zUnion(this.getYearKey(), keys)
  }
}
