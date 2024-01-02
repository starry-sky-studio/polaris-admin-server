import { env } from 'node:process'

import { registerAs } from '@nestjs/config'

// Redis 配置
export const RedisConfig = registerAs('redis', () => {
  return Object.freeze({
    username: env.REDIS_USERNAME,
    password: env.REDIS_PASSWORD,
    db: env.REDIS_DATABASE,
    host: env.REDIS_HOST,
    port: parseInt(env.REDIS_PORT, 10)
  })
})
