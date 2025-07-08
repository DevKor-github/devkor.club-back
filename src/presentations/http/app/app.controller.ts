import { Body, Controller, Get, Post } from "@nestjs/common";

import { CreateFileUploadPresignedUrlDto } from "@presentations/http/app/dto/presignedUrl.dto";
import { S3Service } from "@common/support/s3/s3.service";
import { ControllerResponse } from "@common/shared/response/controller.response";
import { ApiResponseType } from "@common/shared/response/apiResponse.decorator";
import { ApiOperation } from "@nestjs/swagger";

@Controller()
export class AppController {
  constructor(private readonly s3Service: S3Service) {}

  @ApiOperation({ summary: "헬스체크" })
  @ApiResponseType(String)
  @Get()
  getHello(): ControllerResponse<string> {
    return ControllerResponse.success(
      new Date().toISOString().substring(0, 10)
    );
  }

  @ApiOperation({ summary: "presigned url 생성" })
  @ApiResponseType(String)
  @Post("/presigned-url")
  async createFileUploadPresignedUrl(
    @Body() createFileUploadPresignedUrlDto: CreateFileUploadPresignedUrlDto
  ): Promise<ControllerResponse<string>> {
    const { fileName } = createFileUploadPresignedUrlDto;
    return ControllerResponse.success(
      await this.s3Service.createFileUploadPresignedUrl(fileName)
    );
  }
}
