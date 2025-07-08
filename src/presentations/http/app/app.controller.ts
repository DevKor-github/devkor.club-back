import { Body, Controller, Get, Post } from "@nestjs/common";

import { CreateFileUploadPresignedUrlDto } from "@presentations/http/app/dto/presignedUrl.dto";
import { S3Service } from "@common/support/s3/s3.service";

@Controller()
export class AppController {
  constructor(private readonly s3Service: S3Service) {}

  @Get()
  getHello(): string {
    return new Date().toISOString().substring(0, 10);
  }

  @Post("/presigned-url")
  async createFileUploadPresignedUrl(
    @Body() createFileUploadPresignedUrlDto: CreateFileUploadPresignedUrlDto
  ) {
    const { fileName } = createFileUploadPresignedUrlDto;
    return await this.s3Service.createFileUploadPresignedUrl(fileName);
  }
}
