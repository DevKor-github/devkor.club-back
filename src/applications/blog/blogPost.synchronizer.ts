import { BlogMapper } from "@applications/blog/blog.mapper";
import { WeeklyILearnedService } from "@applications/blog/weeklyILearned/weeklyILearned.service";
import { PostInfo } from "@domains/post/models/post.info";
import { PostService } from "@domains/post/post.service";
import { Transactional } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import dayjs from "dayjs";

@Injectable()
export class BlogPostSynchronizer {
  constructor(
    private readonly postService: PostService,
    private readonly weeklyILearnedService: WeeklyILearnedService,
  ) {}

  @Transactional()
  async synchronizeWeeklyILearned(startDate: string): Promise<PostInfo[]> {
    const weeklyILearneds =
      await this.weeklyILearnedService.getAllWeeklyILearnedSimple(startDate);

    const promises = weeklyILearneds.map(async (weekly) => {
      try {
        const { content, coverImage } =
          await this.weeklyILearnedService.getWeeklyILearnedContent(weekly.id);

        const position = BlogMapper.toPosition(weekly.position);
        const post = await this.postService.findPostByTitle(weekly.title);

        if (post) {
          return this.postService.update(post.id, {
            title: weekly.title,
            content,
            position,
            tags: weekly.keywords,
            coverImageUrl: coverImage,
            createdAt: dayjs(weekly.createdTime).tz("Asia/Seoul"),
          });
        }
        return this.postService.create({
          title: weekly.title,
          content,
          author: weekly.author,
          position,
          tags: weekly.keywords,
          createdAt: dayjs(weekly.createdTime).tz("Asia/Seoul"),
          updatedAt: dayjs(weekly.lastEditedTime).tz("Asia/Seoul"),
          coverImageUrl: coverImage,
        });
      } catch (error) {
        // Position 변환, 게시글 생성, 업데이트 실패시 값 무시
        console.error(error);
        return null;
      }
    });

    const results = await Promise.all(promises);

    return results.filter((result): result is PostInfo => result !== null);
  }
}
