import { Page } from "@common/shared/core/page";
import { Position } from "@common/shared/enums/position.enum";
import { PostSortBy } from "@domains/post/models/postSortBy.enum";
import { PostId } from "@common/shared/identifiers/postId";
import { PostEntity } from "@domains/post/infrastructures/mikro-orm/post.entity";
import { PostMapper } from "@domains/post/infrastructures/mikro-orm/post.mapper";
import { Post } from "@domains/post/models/post";
import { PostReader } from "@domains/post/post.reader";
import { EntityRepository, FilterQuery, raw } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";

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

  async findPaginated(
    page: number,
    limit: number,
    position?: Position,
    tags?: string[],
    sortBy: PostSortBy = PostSortBy.CREATED_AT
  ): Promise<Page<Post>> {
    const where: FilterQuery<PostEntity> = {};

    if (position) {
      where.position = position;
    }

    if (tags) {
      where.tags = { $overlap: tags };
    }

    const [entities, total] = await this.postRepository.findAndCount(where, {
      offset: (page - 1) * limit,
      limit: limit,
      orderBy: { [sortBy]: "DESC" },
    });
    const posts = entities.map((entity) => PostMapper.toDomain(entity));
    return new Page(posts, total, page, limit);
  }

  async findById(id: PostId): Promise<Post | null> {
    const entity = await this.postRepository.findOne({ id: id.getString() });
    return entity ? PostMapper.toDomain(entity) : null;
  }

  async view(id: PostId): Promise<void> {
    await this.postRepository.nativeUpdate(
      { id: id.getString() },
      { viewCount: raw("view_count + 1") }
    );
  }
}
