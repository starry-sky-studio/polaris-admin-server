import { Controller, Get, Inject, Query } from '@nestjs/common'
import { RankingService } from './ranking.service'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('排行榜')
@Controller('ranking')
export class RankingController {
  @Inject(RankingService)
  rankingService: RankingService

  @ApiOperation({ summary: '添加人员' })
  @Get('join')
  async join(@Query('name') name: string) {
    await this.rankingService.join(name)
    return 'success'
  }

  @ApiOperation({ summary: '加学习时长' })
  @Get('learn')
  async addLearnTime(@Query('name') name: string, @Query('time') time: string) {
    await this.rankingService.addLearnTime(name, parseFloat(time))
    return 'success'
  }

  @ApiOperation({ summary: '获取月排行榜' })
  @Get('monthRanking')
  async getMonthRanking() {
    return this.rankingService.getMonthRanking()
  }

  @ApiOperation({ summary: '获取年排行榜' })
  @Get('yearRanking')
  async getYearRanking() {
    return this.rankingService.getYearRanking()
  }
}
