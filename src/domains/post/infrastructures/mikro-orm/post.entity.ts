import { Position } from "@common/shared/enums/position.enum";
import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity({ tableName: "posts" })
export class PostEntity {
  @PrimaryKey()
  id: string;

  @Property()
  title: string;

  @Property({ nullable: true, type: "text" })
  coverImageUrl: string | null;

  @Property()
  viewCount: number;

  @Property({ type: "text" })
  content: string;

  @Property()
  author: string;

  @Property()
  position: Position;

  @Property()
  tags: string[];

  @Property()
  createdAt: Date;

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date;

  @Property({ nullable: true })
  deletedAt: Date | null;
}
