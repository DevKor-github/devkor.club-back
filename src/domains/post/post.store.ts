import { Post } from "@domains/post/models/post";

export const POST_STORE = Symbol("POST_STORE");

export interface PostStore {
  save(post: Post): Promise<void>;
  saveMany(posts: Post[]): Promise<void>;
  delete(post: Post): Promise<void>;
  deleteMany(posts: Post[]): Promise<void>;
}
