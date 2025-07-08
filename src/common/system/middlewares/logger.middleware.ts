import { Injectable, Logger, NestMiddleware } from "@nestjs/common";

import { NextFunction, Request, Response } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger("HTTP");

  use(request: Request, response: Response, next: NextFunction): void {
    const { body, path: url } = request;
    const now = new Date().toLocaleDateString("ko-KR", {
      timeZone: "Asia/Seoul",
    });
    response.on("close", () => {
      const { statusCode } = response;

      this.logger.log(`time: ${now}`);
      this.logger.log(`url: ${url}`);
      this.logger.log(`body: ${JSON.stringify(body)}`);
      this.logger.log(`statusCode: ${statusCode}`);
    });

    next();
  }
}
