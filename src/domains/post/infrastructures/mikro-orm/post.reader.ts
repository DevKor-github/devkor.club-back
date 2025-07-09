import { PostReader } from "@domains/post/post.reader";
import { Post } from "@domains/post/models/post";
import { PostId } from "@common/shared/identifiers/postId";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/core";
import { Page } from "@common/shared/core/page";
import { PostEntity } from "@domains/post/infrastructures/mikro-orm/post.entity";
import { PostMapper } from "@domains/post/infrastructures/mikro-orm/post.mapper";

export class MikroOrmPostReader implements PostReader {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: EntityRepository<PostEntity>
  ) {}

  async findByTitle(title: string): Promise<Post | null> {
    const entity = await this.postRepository.findOne({ title });
    return entity ? PostMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<Post[]> {
    const entities = await this.postRepository.findAll();
    return entities.map((entity) => PostMapper.toDomain(entity));
  }

  async findPaginated(page: number, limit: number): Promise<Page<Post>> {
    const [entities, total] = await this.postRepository.findAndCount(
      {},
      {
        offset: (page - 1) * limit,
        limit: limit,
        orderBy: { createdAt: "DESC" },
      }
    );
    const posts = entities.map((entity) => PostMapper.toDomain(entity));
    return new Page(posts, total, page, limit);
  }

  async findById(id: PostId): Promise<Post | null> {
    const entity = await this.postRepository.findOne({ id: id.getString() });
    return entity ? PostMapper.toDomain(entity) : null;
  }
}
