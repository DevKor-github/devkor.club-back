import { Controller, Post, Body } from "@nestjs/common";
import { CreateFileUploadPresignedUrlDto } from "./dto";
import { S3Service } from "./s3.service";
@Controller("s3")
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}
  /*
  @Post("/upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.s3Service.upload(file);
  }
    */

  @Post("/presigned-url")
  // parse fileName from request body
  async createFileUploadPresignedUrl(
    @Body() createFileUploadPresignedUrlDto: CreateFileUploadPresignedUrlDto
  ) {
    const { fileName } = createFileUploadPresignedUrlDto;
    return await this.s3Service.createFileUploadPresignedUrl(fileName);
  }
}
