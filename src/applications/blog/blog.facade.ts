import { WeeklyILearnedService } from "@applications/blog/weeklyILearned/weeklyILearned.service";
import { Page } from "@common/shared/core/page";
import { Position } from "@common/shared/enums/position.enum";
import { PostId } from "@common/shared/identifiers/postId";
import { PostInfo } from "@domains/post/models/post.info";
import { PostService } from "@domains/post/post.service";
import { EntityManager } from "@mikro-orm/core";
import { BadRequestException, Injectable } from "@nestjs/common";

import { BlogPostSynchronizer } from "@applications/blog/blogPost.synchronizer";
import { ViewCountCacheManager } from "@applications/blog/viewCountCache.manager";
import { OuterSource } from "@common/shared/enums/outerSource.enum";
import { PostSortBy } from "@domains/post/models/postSortBy.enum";

@Injectable()
export class BlogFacade {
  constructor(
    private readonly weeklyILearnedService: WeeklyILearnedService,
    private readonly postService: PostService,
    private readonly em: EntityManager,
    private readonly viewCountCacheManager: ViewCountCacheManager,
    private readonly blogPostSynchronizer: BlogPostSynchronizer
  ) {}

  async getPosts(
    page: number,
    size: number,
    position?: Position,
    tags?: string[],
    sortBy?: PostSortBy
  ): Promise<Page<PostInfo>> {
    return this.postService.getPosts(page, size, position, tags, sortBy);
  }

  async viewPost(id: PostId, clientIp: string): Promise<PostInfo> {
    const shouldIncreaseViewCount =
      this.viewCountCacheManager.shouldIncreaseViewCount(clientIp, id);
    if (shouldIncreaseViewCount) {
      this.viewCountCacheManager.recordView(clientIp, id);
      return await this.postService.viewPost(id);
    }

    return this.postService.getPostById(id);
  }

  async syncBlogPost(
    startDate: string,
    type: OuterSource
  ): Promise<PostInfo[]> {
    switch (type) {
      case OuterSource.WEEKLY_I_LEARNED:
        return this.blogPostSynchronizer.synchronizeWeeklyILearned(startDate);
      default:
        throw new BadRequestException("Invalid type");
    }
  }
}
