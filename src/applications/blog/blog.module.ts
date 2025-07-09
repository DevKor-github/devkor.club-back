import { Module } from "@nestjs/common";
import { BlogFacade } from "./blog.facade";
import { WeeklyILearnedModule } from "@applications/blog/weeklyILearned/weeklyILearned.module";
import { PostModule } from "@domains/post/post.module";

@Module({
  imports: [WeeklyILearnedModule, PostModule],
  providers: [BlogFacade],
  exports: [BlogFacade],
})
export class BlogModule {}
