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
import { ConfigService } from '@nestjs/config'

@Injectable()
@Dependencies(Reflector)
export class LocalAuthGuard implements CanActivate {
  @Inject()
  private reflector: Reflector

  @Inject(JwtService)
  private jwtService: JwtService

  @Inject(ConfigService)
  private configService: ConfigService

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isSkipAuth = this.reflector.get(SKIP_AUTH, context.getHandler())
    if (isSkipAuth) {
      return true
    }

    const request: Request & { user: RequestUser } = context.switchToHttp().getRequest()
    const authorization = request.headers.authorization
    if (!authorization) {
      throw new UnauthorizedException('用户未登录')
    }
    try {
      const token = authorization.split(' ')[1]
      const data = this.jwtService.verify<JwtPayload>(token, {
        secret: this.configService.get('jwt.accessTokenSecret')
      })
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
