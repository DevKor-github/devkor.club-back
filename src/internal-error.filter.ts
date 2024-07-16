import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
} from "@nestjs/common";
import axios from "axios";
import type { Response } from "express";
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

    response.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}
