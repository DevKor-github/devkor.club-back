import { Body, Controller, Get, Post } from "@nestjs/common";
import { AppService } from "../../../app.service";
import { S3Service } from "@/common/support/s3/s3.service";
import { CreateFileUploadPresignedUrlDto } from "@/presentations/http/app/dto/presignedUrl.dto";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly s3Service: S3Service
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("/presigned-url")
  async createFileUploadPresignedUrl(
    @Body() createFileUploadPresignedUrlDto: CreateFileUploadPresignedUrlDto
  ) {
    const { fileName } = createFileUploadPresignedUrlDto;
    return await this.s3Service.createFileUploadPresignedUrl(fileName);
  }
}
