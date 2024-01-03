import { HttpException, HttpStatus } from '@nestjs/common'

export class UnLoginException extends HttpException {
  message: string
  constructor(message?: string) {
    super(message || 'token过期', HttpStatus.UNAUTHORIZED)
  }
}
