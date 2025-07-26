import { NotionService } from "@common/support/notion/notion.service";
import { NotionBlockFactory } from "@common/support/notion/notionBlock.factory";
import { NotionDatabaseService } from "@common/support/notion/notionDatabase.service";
import { NotionPropertyFactory } from "@common/support/notion/notionProperty.factory";
import { NotionConfigManager } from "@common/support/notion/notionConfig.manager";
import { Module } from "@nestjs/common";

@Module({
  providers: [
    NotionService,
    NotionPropertyFactory,
    NotionBlockFactory,
    NotionDatabaseService,
    NotionConfigManager,
  ],
  exports: [NotionService],
})
export class NotionModule {}
