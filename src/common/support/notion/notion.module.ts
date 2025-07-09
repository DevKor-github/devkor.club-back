import { Module } from "@nestjs/common";
import { NotionBlockFactory } from "./notionBlock.factory";
import { NotionDatabaseService } from "./notionDatabase.service";
import { NotionPropertyFactory } from "./notionProperty.factory";
import { NotionService } from "./notion.service";

@Module({
  providers: [
    NotionService,
    NotionPropertyFactory,
    NotionBlockFactory,
    NotionDatabaseService,
  ],
  exports: [NotionService],
})
export class NotionModule {}
