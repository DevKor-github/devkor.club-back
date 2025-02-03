import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RecruitController } from "./recruit.controller";
import { RecruitService } from "./recruit.service";
import { NotionModule } from "@/notion/notion.module";

@Module({
  imports: [NotionModule],
  providers: [RecruitService],
  controllers: [RecruitController],
})
export class RecruitModule {}
