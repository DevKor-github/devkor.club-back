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

      this.logger.log(
        `[${method}] ${originalUrl} - ${statusCode} (${processingTime}ms)`
      );
      this.logger.log(`Time: ${now}`);
      this.logger.log(`Path: ${path}`);
      this.logger.log(`Query: ${JSON.stringify(query)}`);
      this.logger.log(`Body: ${JSON.stringify(body)}`);
      this.logger.log(`User-Agent: ${headers["user-agent"] || "Unknown"}`);
      this.logger.log(`IP: ${request.ip || "Unknown"}`);
    });

    next();
  }
}
