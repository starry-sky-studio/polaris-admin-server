import { Controller, Get, Logger } from '@nestjs/common'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private logger = new Logger()

  @Get()
  getHello(): string {
    this.logger.log('hello', AppController.name)
    return this.appService.getHello()
  }
}
