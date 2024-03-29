import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import { HttpExceptionFilter } from './filter/http-exception.filter'
import { FormatResponseInterceptor, InvokeRecordInterceptor } from './interceptor'
import { PrismaExceptionFilter } from './filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true
  })

  app.useGlobalPipes(new ValidationPipe())

  // 全局拦截器 - 响应格式化
  app.useGlobalInterceptors(new FormatResponseInterceptor())

  // 全局拦截器 - 响应格式日志显示
  app.useGlobalInterceptors(new InvokeRecordInterceptor())

  // 全局过滤器 - 异常处理
  app.useGlobalFilters(new HttpExceptionFilter())

  // 全局过滤器 - prisma 异常处理
  app.useGlobalFilters(new PrismaExceptionFilter())

  // 全局拦截器 - 日志
  //app.useGlobalInterceptors(new LoggingInterceptor())

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

  //app.useLogger(app.get(WINSTON_LOGGER_TOKEN))
  app.enableCors()

  await app.listen(3000)
}
bootstrap()
