import { BlogPostSynchronizer } from "@applications/blog/blogPost.synchronizer";
import { ViewCountCacheManager } from "@applications/blog/viewCountCache.manager";
import { WeeklyILearnedModule } from "@applications/blog/weeklyILearned/weeklyILearned.module";
import { PostModule } from "@domains/post/post.module";
import { Module } from "@nestjs/common";
import { BlogFacade } from "./blog.facade";

@Module({
  imports: [WeeklyILearnedModule, PostModule],
  providers: [BlogFacade, ViewCountCacheManager, BlogPostSynchronizer],
  exports: [BlogFacade],
})
export class BlogModule {}
