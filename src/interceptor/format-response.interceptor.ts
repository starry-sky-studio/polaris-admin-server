import { R } from '@/class'
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'

import { Response } from 'express'
import { map, Observable } from 'rxjs'

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>()
    return next.handle().pipe(
      map((data) => {
        return new R({
          code: response.statusCode,
          msg: 'success',
          data
        })
      })
    )
  }
}
