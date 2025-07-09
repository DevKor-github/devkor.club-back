import { Module } from "@nestjs/common";
import { NotionBlockFactory } from "./notion-block.factory";
import { NotionDatabaseService } from "./notion-database.service";
import { NotionPropertyFactory } from "./notion-property.factory";
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
