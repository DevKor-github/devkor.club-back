import { PostEntity } from "@domains/post/infrastructures/mikro-orm/post.entity";
import { PostMapper } from "@domains/post/infrastructures/mikro-orm/post.mapper";
import { Post } from "@domains/post/models/post";
import { PostStore } from "@domains/post/post.store";
import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";

export class MikroOrmPostStore implements PostStore {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: EntityRepository<PostEntity>,
  ) {}

  async save(post: Post): Promise<void> {
    const entity = PostMapper.toPersistence(post);
    const existing = await this.postRepository.findOne({
      id: post.id.getString(),
    });
    if (existing) {
      this.postRepository.assign(existing, entity);
      await this.postRepository.getEntityManager().flush();
    } else {
      await this.postRepository.getEntityManager().persistAndFlush(entity);
    }
  }

  async saveMany(posts: Post[]): Promise<void> {
    const em = this.postRepository.getEntityManager();
    const postIds = posts.map((post) => post.id.getString());

    const existingMap = new Map(
      (await this.postRepository.find({ id: { $in: postIds } })).map((e) => [
        e.id,
        e,
      ]),
    );

    for (const post of posts) {
      const entity = PostMapper.toPersistence(post);
      const existing = existingMap.get(post.id.getString());

      if (existing) {
        this.postRepository.assign(existing, entity);
      } else {
        em.persist(entity);
      }
    }

    await em.flush();
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
