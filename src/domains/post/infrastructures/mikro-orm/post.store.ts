import { Post } from "@domains/post/models/post";
import { PostStore } from "@domains/post/post.store";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/core";
import { PostEntity } from "@domains/post/infrastructures/mikro-orm/post.entity";
import { PostMapper } from "@domains/post/infrastructures/mikro-orm/post.mapper";

export class MikroPostStore implements PostStore {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: EntityRepository<PostEntity>
  ) {}

  async save(post: Post): Promise<void> {
    const entity = PostMapper.toPersistence(post);
    await this.postRepository.getEntityManager().persistAndFlush(entity);
  }

  async saveMany(posts: Post[]): Promise<void> {
    const entities = posts.map((post) => PostMapper.toPersistence(post));
    await this.postRepository.getEntityManager().persistAndFlush(entities);
  }

  async delete(post: Post): Promise<void> {
    const entity = PostMapper.toPersistence(post);
    await this.postRepository.getEntityManager().removeAndFlush(entity);
  }

  async deleteMany(posts: Post[]): Promise<void> {
    const entities = posts.map((post) => PostMapper.toPersistence(post));
    await this.postRepository.getEntityManager().removeAndFlush(entities);
  }
}
