import { Body, Controller, Get, Inject, Post } from "@nestjs/common";

import { ApiDoc } from "@common/shared/response/apiResponse.decorator";
import { ControllerResponse } from "@common/shared/response/controller.response";
import { S3Service } from "@common/support/s3/s3.service";
import { CreateFileUploadPresignedUrlDto } from "@presentations/http/app/dtos/presignedUrl.dto";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Controller()
export class AppController {
  constructor(
    private readonly s3Service: S3Service,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  @ApiDoc({
    summary: "헬스체크",
    description: "서버 상태를 확인합니다",
    successType: String,
  })
  @Get()
  getHello(): ControllerResponse<string> {
    return ControllerResponse.success(
      new Date().toISOString().substring(0, 10)
    );
  }

  @ApiDoc({
    summary: "presigned url 생성",
    description: "파일 업로드를 위한 presigned URL을 생성합니다",
    successType: String,
  })
  @Post("/presigned-url")
  async createFileUploadPresignedUrl(
    @Body() createFileUploadPresignedUrlDto: CreateFileUploadPresignedUrlDto
  ): Promise<ControllerResponse<string>> {
    const { fileName } = createFileUploadPresignedUrlDto;
    return ControllerResponse.success(
      await this.s3Service.createFileUploadPresignedUrl(fileName)
    );
  }

  @ApiDoc({
    summary: "캐시 삭제",
    description: "캐시를 삭제합니다",
    successType: String,
  })
  @Get("/clear-cache")
  async clearCache(): Promise<ControllerResponse<string>> {
    await this.cacheManager.clear();
    return ControllerResponse.success("캐시 삭제 완료");
  }
}
