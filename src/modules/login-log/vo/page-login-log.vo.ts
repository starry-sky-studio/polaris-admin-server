import { Type } from 'class-transformer'

import { Page } from '@/class'
import { LoginLogVo } from './login-log.vo'

export class PageLoginLogVo extends Page {
  @Type(() => LoginLogVo)
  records: LoginLogVo[]
}
