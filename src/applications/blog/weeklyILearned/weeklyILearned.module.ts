import { WeeklyILearnedService } from "@applications/blog/weeklyILearned/weeklyILearned.service";
import { NotionModule } from "@common/support/notion/notion.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [NotionModule],
  providers: [WeeklyILearnedService],
  exports: [WeeklyILearnedService],
})
export class WeeklyILearnedModule {}
