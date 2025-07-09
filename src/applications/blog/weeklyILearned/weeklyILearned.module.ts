import { Module } from "@nestjs/common";
import { WeeklyILearnedService } from "./weeklyILearned.service";
import { NotionModule } from "@common/support/notion/notion.module";
import { WeeklyILearnedMarkdownConverter } from "./weeklyILearned.converter";
import { WeeklyILearnedMapper } from "./weeklyILearned.mapper";
import { WeeklyILearnedPaginator } from "@applications/blog/weeklyILearned/weeklyILearned.paginator";

@Module({
  imports: [NotionModule],
  providers: [
    WeeklyILearnedService,
    WeeklyILearnedMarkdownConverter,
    WeeklyILearnedMapper,
    WeeklyILearnedPaginator,
  ],
  exports: [WeeklyILearnedService],
})
export class WeeklyILearnedModule {}
