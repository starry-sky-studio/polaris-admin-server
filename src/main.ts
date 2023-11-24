import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { MyLogger } from './logger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useLogger(new MyLogger())

  await app.listen(3000)
}
bootstrap()
