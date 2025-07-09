import { BlogModule } from "@applications/blog/blog.module";
import { RecruitModule } from "@applications/recruit/recruit.module";
import { S3Module } from "@common/support/s3/s3.module";
import { SystemModule } from "@common/system/system.module";
import { Module } from "@nestjs/common";
import { controllers } from "@presentations/http";

@Module({
  imports: [SystemModule, S3Module, RecruitModule, BlogModule],
  controllers: controllers,
  providers: [],
})
export class AppModule {}
