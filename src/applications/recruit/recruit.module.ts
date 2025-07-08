import { Module } from "@nestjs/common";
import { RecruitController } from "../../presentations/http/recruit/recruit.controller";
import { RecruitService } from "./recruit.service";
import { NotionModule } from "@/common/support/notion/notion.module";

@Module({
  imports: [NotionModule],
  providers: [RecruitService],
  controllers: [RecruitController],
})
export class RecruitModule {}
