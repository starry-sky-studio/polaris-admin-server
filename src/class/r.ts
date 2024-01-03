import { ApiPropertyOptional } from '@nestjs/swagger'

export class R<T = any> {
  @ApiPropertyOptional({ description: '提示信息', example: '请求成功', nullable: true })
  msg?: string

  @ApiPropertyOptional({ description: '响应数据', type: () => Object, nullable: true })
  data?: T

  @ApiPropertyOptional({ description: '响应状态码', example: '200', nullable: true })
  code: number

  constructor(r?: R<T>) {
    Object.assign(this, r)
  }
}
