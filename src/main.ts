import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { WINSTON_LOGGER_TOKEN } from './winston/winston.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true
  })

  const config = new DocumentBuilder()
    .setTitle('Text example')
    .setDescription('The API')
    .setVersion('1.0')
    .addTag('test')
    .addBasicAuth({
      type: 'http',
      name: 'basic',
      description: '用户名 + 密码'
    })
    .addCookieAuth('sid', {
      type: 'apiKey',
      name: 'cookie',
      description: '基于 cookie 的认证'
    })
    .addBearerAuth({
      type: 'http',
      description: '基于 jwt 的认证',
      name: 'bearer'
    })
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('doc', app, document)

  app.useLogger(app.get(WINSTON_LOGGER_TOKEN))
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors()

  await app.listen(3000)
}
bootstrap()
