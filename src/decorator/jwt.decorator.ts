import { JwtPayload } from '@/interface'
import type { ExecutionContext } from '@nestjs/common'
import { createParamDecorator } from '@nestjs/common'

/**
 * jwt 信息装饰器
 * @description 用于获取当前请求执行上下文中的 jwtPayload
 */
export const Jwt = createParamDecorator<keyof JwtPayload>((key, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request & { user: JwtPayload }>()
  if (!request?.user) {
    return null
  }
  return key ? request?.user[key] : request.user
})
