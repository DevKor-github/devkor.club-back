import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger("HTTP");

  use(request: Request, response: Response, next: NextFunction): void {
    const { body, method, originalUrl, path, query, headers } = request;
    const startTime = Date.now();
    const now = new Date().toLocaleDateString("ko-KR", {
      timeZone: "Asia/Seoul",
    });

    response.on("close", () => {
      const { statusCode } = response;
      const processingTime = Date.now() - startTime;
      const logMessage = [
        `[${method}] ${originalUrl} - ${statusCode} (${processingTime}ms)`,
        `Time: ${now}`,
        `Path: ${path}`,
        `Query: ${JSON.stringify(query)}`,
        `Body: ${JSON.stringify(body)}`,
        `User-Agent: ${headers["user-agent"] || "Unknown"}`,
      ].join(" | ");

      this.logger.log(logMessage);
    });

    next();
  }
}
