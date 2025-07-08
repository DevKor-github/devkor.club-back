import { PostId } from "@common/shared/identifiers/postId";
import { PostEntity } from "@domains/post/infrastructures/mikro-orm/post.entity";
import { PostMapper } from "@domains/post/infrastructures/mikro-orm/post.mapper";
import { PostRepository } from "@domains/post/infrastructures/post.repository";
import { Post } from "@domains/post/models/post";
import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";

export class PostRepositoryImplement implements PostRepository {
  constructor(
    @InjectRepository(PostEntity)
    private readonly repository: EntityRepository<PostEntity>
  ) {}

  async save(post: Post): Promise<void> {
    const entity = PostMapper.toPersistence(post);
    await this.repository.getEntityManager().persistAndFlush(entity);
  }

  async findById(id: PostId): Promise<Post | null> {
    const entity = await this.repository.findOne({ id: id.getString() });
    return entity ? PostMapper.toDomain(entity) : null;
  }
}
