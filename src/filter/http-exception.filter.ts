import { R } from '@/class'
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common'
import type { Response } from 'express'

//过滤http相应
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse()
    if (typeof exceptionResponse === 'string') {
      response.status(status).json(new R({ msg: exceptionResponse, code: status }))
    } else {
      const { message } = exceptionResponse as Record<string, any>
      response.status(status).json(new R({ msg: message, code: status }))
    }
  }
}
