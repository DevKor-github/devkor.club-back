import { Post } from "../../models/post";
import { PostEntity } from "./post.entity";
import { PostId } from "@common/shared/identifiers/postId";
import dayjs from "dayjs";

export class PostMapper {
  static toDomain(entity: PostEntity): Post {
    return Post.create(
      {
        title: entity.title,
        content: entity.content,
        authorId: entity.authorId,
        createdAt: dayjs(entity.createdAt),
        updatedAt: dayjs(entity.updatedAt),
        deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
      },
      new PostId(entity.id)
    );
  }

  static toPersistence(domain: Post): PostEntity {
    const entity = new PostEntity();
    entity.id = domain.id.getString();
    entity.title = domain.title;
    entity.content = domain.content;
    entity.authorId = domain.authorId;
    entity.createdAt = domain.createdAt.toDate();
    entity.updatedAt = domain.updatedAt.toDate();
    entity.deletedAt = domain.deletedAt?.toDate();
    return entity;
  }
}
