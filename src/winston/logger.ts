import { ConsoleLogger, Inject, LoggerService, LogLevel } from "@nestjs/common";
import * as chalk from "chalk";
import * as dayjs from "dayjs";
import { createLogger, format, Logger, transports } from "winston";
import { WINSTON_LOGGER_TOKEN } from "./winston.module";

export class MyLogger implements LoggerService {
  @Inject(WINSTON_LOGGER_TOKEN)
  private logger;
  constructor(options) {
    this.logger = createLogger(options);
  }

  log(message: string, context: string) {
    const time = dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss");
    this.logger.log("info", message, { context, time });
  }

  error(message: string, context: string) {
    const time = dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss");
    this.logger.log("info", message, { context, time });
  }

  warn(message: string, context: string) {
    const time = dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss");
    this.logger.log("info", message, { context, time });
  }
}
