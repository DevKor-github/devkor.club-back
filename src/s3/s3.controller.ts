import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
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

  @Get("/presigned-url")
  async getPresignedUrl() {
    return await this.s3Service.getPresignedUrl();
  }
}
