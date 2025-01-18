import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  BackendApplyEntity,
  DesignerApplyEntity,
  FrontApplyEntity,
  PmApplyEntity,
} from "./entity";
import { RecruitController } from "./recruit.controller";
import { RecruitService } from "./recruit.service";
import { NotionModule } from "@/notion/notion.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PmApplyEntity,
      FrontApplyEntity,
      BackendApplyEntity,
      DesignerApplyEntity,
    ]),
    NotionModule,
  ],
  providers: [RecruitService],
  controllers: [RecruitController],
})
export class RecruitModule {}
