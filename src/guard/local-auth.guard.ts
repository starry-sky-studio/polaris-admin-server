import { SKIP_AUTH } from '@/constants'
import { UnLoginException } from '@/filter'
import { JwtPayload, RequestUser } from '@/interface'
import {
  Injectable,
  Dependencies,
  Inject,
  ExecutionContext,
  CanActivate,
  UnauthorizedException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Observable } from 'rxjs'
import type { Request } from 'express'

@Injectable()
@Dependencies(Reflector)
export class LoginGuard implements CanActivate {
  @Inject()
  private reflector: Reflector

  @Inject(JwtService)
  private jwtService: JwtService

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isSkipAuth = this.reflector.get(SKIP_AUTH, context.getHandler())
    if (isSkipAuth) {
      return true
    }

    const request: Request & { user: RequestUser } = context.switchToHttp().getRequest()
    const authorization = request.headers.authorization
    if (!authorization) {
      console.log(authorization, '用户未登录')
      throw new UnauthorizedException('用户未登录')
    }
    try {
      const token = authorization.split(' ')[1]
      const data = this.jwtService.verify<JwtPayload>(token)
      const { sub, username } = data ?? {}
      request.user = {
        userId: sub,
        username
      }
      return true
    } catch (e) {
      throw new UnLoginException('token过期')
    }
  }
}
