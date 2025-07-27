import { Position } from "@common/shared/enums/position.enum";
import { PostId } from "@common/shared/identifiers/postId";
import { Dayjs } from "dayjs";
import { Post } from "./post";

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
    public readonly updatedAt: Dayjs,
    public readonly token: string | null
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
      post.updatedAt,
      post.token
    );
  }
}
