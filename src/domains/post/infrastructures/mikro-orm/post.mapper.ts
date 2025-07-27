import { PostId } from "@common/shared/identifiers/postId";
import { PostEntity } from "@domains/post/infrastructures/mikro-orm/post.entity";
import { Post } from "@domains/post/models/post";
import { InternalServerErrorException } from "@nestjs/common";
import dayjs from "dayjs";

export class PostMapper {
  static toDomain(entity: PostEntity): Post {
    const result = Post.create(
      {
        title: entity.title,
        content: entity.content,
        author: entity.author,
        position: entity.position,
        coverImageUrl: entity.coverImageUrl,
        viewCount: entity.viewCount,
        tags: entity.tags,
        token: entity.token,
        createdAt: dayjs(entity.createdAt),
        updatedAt: dayjs(entity.updatedAt),
        deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
      },
      new PostId(entity.id)
    );

    if (result.isFailure) {
      throw new InternalServerErrorException(result.error);
    }

    return result.value;
  }

  static toPersistence(domain: Post): PostEntity {
    const entity = new PostEntity();
    entity.id = domain.id.getString();
    entity.title = domain.title;
    entity.content = domain.content;
    entity.author = domain.author;
    entity.position = domain.position;
    entity.coverImageUrl = domain.coverImageUrl;
    entity.viewCount = domain.viewCount;
    entity.tags = domain.tags;
    entity.token = domain.token;
    entity.createdAt = domain.createdAt.toDate();
    entity.updatedAt = domain.updatedAt.toDate();
    entity.deletedAt = domain.deletedAt?.toDate() ?? null;
    return entity;
  }
}
