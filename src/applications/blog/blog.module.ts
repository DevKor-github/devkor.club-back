import { Module } from "@nestjs/common";
import { BlogFacade } from "./blog.facade";
import { WeeklyILearnedModule } from "@applications/blog/weeklyILearned/weeklyILearned.module";
import { PostModule } from "@domains/post/post.module";
import { ViewCountCacheManager } from "@applications/blog/viewCountCache.manager";
import { BlogPostSynchronizer } from "@applications/blog/blogPost.synchronizer";

@Module({
  imports: [WeeklyILearnedModule, PostModule],
  providers: [BlogFacade, ViewCountCacheManager, BlogPostSynchronizer],
  exports: [BlogFacade],
})
export class BlogModule {}
