import { Inject, Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { ArticleService } from '../article/article.service'
@Injectable()
export class ScheduleTasksService {
  @Inject(ArticleService)
  private articleService: ArticleService

  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async handleCron() {
    await this.articleService.flushRedisToDB()
  }
}
