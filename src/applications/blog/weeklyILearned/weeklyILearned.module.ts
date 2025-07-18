import { Module } from "@nestjs/common";
import { WeeklyILearnedService } from "./weeklyILearned.service";
import { NotionModule } from "@common/support/notion/notion.module";

import { WeeklyILearnedPaginator } from "@applications/blog/weeklyILearned/weeklyILearned.paginator";
import { WeeklyILearnedMapper } from "@applications/blog/weeklyILearned/weeklyILearned.mapper";

@Module({
  imports: [NotionModule],
  providers: [
    WeeklyILearnedService,
    WeeklyILearnedMapper,
    WeeklyILearnedPaginator,
  ],
  exports: [WeeklyILearnedService],
})
export class WeeklyILearnedModule {}
