import { Module } from "@nestjs/common";
import { BlogService } from "./blog.service";
import { WeeklyILearnedModule } from "@applications/blog/weeklyILearned/weeklyILearned.module";

@Module({
  imports: [WeeklyILearnedModule],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
