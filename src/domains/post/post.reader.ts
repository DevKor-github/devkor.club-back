import { Page } from "@common/shared/core/page";
import { Position } from "@common/shared/enums/position.enum";
import { PostSortBy } from "@domains/post/models/postSortBy.enum";
import { PostId } from "@common/shared/identifiers/postId";
import { Post } from "@domains/post/models/post";

export const POST_READER = Symbol("POST_READER");

export interface PostReader {
  findAll(): Promise<Post[]>;

  findPaginated(
    page: number,
    limit: number,
    position?: Position,
    tags?: string[],
    sortBy?: PostSortBy
  ): Promise<Page<Post>>;
  findById(id: PostId): Promise<Post | null>;
  view(id: PostId): Promise<void>;
  findByTitle(title: string): Promise<Post | null>;
}
