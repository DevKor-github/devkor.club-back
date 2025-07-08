import { Post } from "../models/post";
import { PostId } from "@common/shared/identifiers/postId";

export const POST_REPOSITORY = Symbol("POST_REPOSITORY");

export interface PostRepository {
  save(post: Post): Promise<void>;
  findById(id: PostId): Promise<Post | null>;
}
