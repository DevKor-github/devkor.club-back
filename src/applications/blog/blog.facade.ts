import { WeeklyILearnedService } from "@applications/blog/weeklyILearned/weeklyILearned.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { Position } from "@common/shared/enums/position.enum";
import { PostInfo } from "@domains/post/models/post.info";
import { EntityManager, Transactional } from "@mikro-orm/core";
import { PostService } from "@domains/post/post.service";
import { Page } from "@common/shared/core/page";
import { PostId } from "@common/shared/identifiers/postId";
import dayjs from "dayjs";

@Injectable()
export class BlogFacade {
  constructor(
    private readonly weeklyILearnedService: WeeklyILearnedService,
    private readonly postService: PostService,
    private readonly em: EntityManager
  ) {}

  async getPosts(
    page: number,
    size: number,
    position?: Position,
    tags?: string[]
  ): Promise<Page<PostInfo>> {
    return this.postService.getPosts(page, size, position, tags);
  }

  async getPost(id: string): Promise<PostInfo> {
    const postId = new PostId(id);
    return this.postService.getPostById(postId);
  }

  @Transactional()
  async synchronizeWeeklyILearned(startDate: string): Promise<PostInfo[]> {
    const weeklyILearneds =
      await this.weeklyILearnedService.getAllWeeklyILearnedSimple(startDate);

    const results: PostInfo[] = [];

    for (const weekly of weeklyILearneds) {
      const { content, coverImage } = await this.weeklyILearnedService.getWeeklyILearnedContent(
        weekly.id
      );

      let position: Position;
      try {
        position = this.toPosition(weekly.position);
      } catch (error) {
        console.error(error);
        // Position 변환 실패시 값 무시
        continue;
      }

      const post = await this.postService.findPostByTitle(weekly.title);

      if (post) {
        try {
          const updatedPost = await this.postService.update(post.id, {
            title: weekly.title,
            content,
            position,
            tags: weekly.keywords,
            coverImageUrl: coverImage,
          });
          results.push(updatedPost);
        } catch (error) {
          // 업데이트 실패시 값 무시
          console.error(error);
          continue;
        }
      } else {
        try {
          const newPost = await this.postService.create({
            title: weekly.title,
            content,
            author: weekly.author,
            position,
            tags: weekly.keywords,
            createdAt: dayjs(weekly.createdTime).tz("Asia/Seoul"),
            updatedAt: dayjs(weekly.lastEditedTime).tz("Asia/Seoul"),
            coverImageUrl: coverImage,
          });
          results.push(newPost);
        } catch (error) {
          // 생성 실패시 값 무시
          console.error(error);
          continue;
        }
      }
    }

    return results;
  }

  private toPosition(positionString: string | null): Position {
    if (!positionString) {
      throw new BadRequestException("Position is required");
    }

    const positionMap: Record<string, Position> = {
      BE: Position.BE,
      FE: Position.FE,
      PM: Position.PM,
      PD: Position.PD,
      DevOps: Position.DevOps,
    };

    const position = positionMap[positionString];

    if (!position) {
      throw new BadRequestException(`Invalid position: ${positionString}`);
    }

    return position;
  }
}
