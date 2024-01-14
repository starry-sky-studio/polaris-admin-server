import { env } from 'node:process'

import { registerAs } from '@nestjs/config'

// Redis 配置
export const LoginConfig = registerAs('login', () => {
  return Object.freeze({
    client_secret: env.CLIENT_SECRET,
    client_id: env.CLIENT_ID
  })
})
