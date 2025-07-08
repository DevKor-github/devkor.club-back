import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import type { Response } from "express";
import { ControllerResponse } from "@common/shared/response/controller.response";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const message = exception.message;
    const name = exception.name;

    const errorResponse = ControllerResponse.error(
      {
        name,
        details: exception.getResponse(),
      },
      message,
      status
    );

    response.status(status).json(errorResponse);
  }
}
