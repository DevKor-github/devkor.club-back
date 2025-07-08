import { Module } from "@nestjs/common";
import { NotionService } from "./notion.service";
import { NotionPropertyFactory } from "./notion-property.factory";
import { NotionBlockFactory } from "./notion-block.factory";
import { NotionDatabaseService } from "./notion-database.service";

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
