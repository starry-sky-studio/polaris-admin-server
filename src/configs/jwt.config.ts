import { env } from "node:process";

import { registerAs } from "@nestjs/config";

// JWT 配置
export const JwtConfig = registerAs("jwt", () => {
  return Object.freeze({
    accessTokenSecret: env.JWT_ACCESS_TOKEN_SECRET,
    accessTokenExp: env.JWT_ACCESS_TOKEN_EXP,
    refreshTokenSecret: env.JWT_REFRESH_TOKEN_SECRET,
    refreshTokenExp: env.JWT_REFRESH_TOKEN_EXP,
  });
});
