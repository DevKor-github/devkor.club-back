import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import axios from "axios";
import type { Response } from "express";
import { ControllerResponse } from "@common/shared/response/controller.response";

@Catch()
export class InternalErrorFilter implements ExceptionFilter {
  client = axios.create({
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
    },
    baseURL: "https://discord.com/api",
  });

  allChannelPath = "/channels/1212765451558461551/messages";

  async notificationToChannel(content: string) {
    await this.client.post(this.allChannelPath, { content });
  }

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Discord 알림 전송
    this.notificationToChannel("internal error report : ")
      .then(async () => {
        exception.name &&
          (await this.notificationToChannel(`name : ${exception.name}`));
      })
      .then(async () => {
        exception.message &&
          (await this.notificationToChannel(`message : ${exception.message}`));
      })
      .then(async () => {
        exception.stack &&
          (await this.notificationToChannel(`stack : ${exception.stack}`));
      });

    const errorResponse = ControllerResponse.error(
      {
        name: exception.name || "UnknownError",
        timestamp: new Date().toISOString(),
      },
      "Internal Server Error",
      HttpStatus.INTERNAL_SERVER_ERROR
    );

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
}
