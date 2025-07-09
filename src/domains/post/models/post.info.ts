import { PostId } from "@common/shared/identifiers/postId";
import { Post } from "./post";
import { Dayjs } from "dayjs";
import { Position } from "@common/shared/enums/position.enum";

export class PostInfo {
  constructor(
    public readonly id: PostId,
    public readonly title: string,
    public readonly author: string,
    public readonly position: Position,
    public readonly tags: string[],
    public readonly content: string,
    public readonly coverImageUrl: string | null,
    public readonly viewCount: number,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs
  ) {}

  static from(post: Post): PostInfo {
    return new PostInfo(
      post.id,
      post.title,
      post.author,
      post.position,
      post.tags,
      post.content,
      post.coverImageUrl,
      post.viewCount,
      post.createdAt,
      post.updatedAt
    );
  }
}
