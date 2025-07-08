import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity({ tableName: 'posts' })
export class PostEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id!: string;

  @Property()
  title!: string;

  @Property()
  content!: string;

  @Property()
  authorId!: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ nullable: true })
  deletedAt?: Date;
}
