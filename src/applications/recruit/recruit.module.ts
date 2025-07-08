import { RecruitService } from "@applications/recruit/recruit.service";
import { NotionModule } from "@common/support/notion/notion.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [NotionModule],
  providers: [RecruitService],
  exports: [RecruitService],
})
export class RecruitModule {}
