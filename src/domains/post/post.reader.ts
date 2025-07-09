import { PostId } from "@common/shared/identifiers/postId";
import { Post } from "@domains/post/models/post";
import { Page } from "@common/shared/core/page";
import { Position } from "@common/shared/enums/position.enum";

export const POST_READER = Symbol("POST_READER");

export interface PostReader {
  findAll(): Promise<Post[]>;
  findPaginated(
    page: number,
    limit: number,
    position?: Position,
    tags?: string[]
  ): Promise<Page<Post>>;
  findById(id: PostId): Promise<Post | null>;
  findByTitle(title: string): Promise<Post | null>;
}
