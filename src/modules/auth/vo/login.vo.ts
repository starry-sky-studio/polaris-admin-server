import { ApiProperty } from '@nestjs/swagger'

import { TokenVo } from './token.vo'
import { UserVo } from '@/modules/user/vo'

export class LoginVo extends TokenVo {
  @ApiProperty({ description: '用户信息' })
  user: UserVo
  constructor(LoginVo?: Partial<LoginVo>) {
    const { accessToken, refreshToken, user } = LoginVo ?? {}
    super({ accessToken, refreshToken })
    Object.assign(this, { user })
  }
}
