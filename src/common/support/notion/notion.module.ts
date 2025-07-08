import { NotionService } from "@common/support/notion/notion.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [NotionService],
  exports: [NotionService],
})
export class NotionModule {}
