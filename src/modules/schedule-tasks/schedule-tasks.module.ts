import { Module } from '@nestjs/common'
import { ArticleModule } from '../article/article.module'
import { ScheduleTasksService } from './schedule-tasks.service'

@Module({
  imports: [ArticleModule],
  providers: [ScheduleTasksService]
})
export class ScheduleTasksModule {}
