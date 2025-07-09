import { AggregateRoot } from "@common/shared/core/domains/aggregateRoot";
import { Result } from "@common/shared/core/domains/result";
import { Position } from "@common/shared/enums/position.enum";
import { PostId } from "@common/shared/identifiers/postId";
import dayjs, { Dayjs } from "dayjs";

export interface PostNewProps {
  title: string;
  author: string;
  position: Position;
  tags: string[];
  content: string;
}

export interface PostProps extends PostNewProps {
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class Post extends AggregateRoot<PostProps> {
  private constructor(props: PostProps, id: PostId) {
    super(props, id);
  }

  static create(props: PostProps, id: PostId): Result<Post> {
    return new Post(props, id).validate();
  }

  static createNew(props: PostNewProps): Result<Post> {
    return this.create(
      {
        ...props,
        createdAt: dayjs(),
        updatedAt: dayjs(),
        deletedAt: null,
      },
      new PostId()
    );
  }

  public validate(): Result<Post> {
    if (this.props.title.length < 3) {
      return Result.fail("Title must be at least 3 characters long");
    }

    if (this.props.content.length < 3) {
      return Result.fail("Content must be at least 3 characters long");
    }

    if (this.props.tags.length < 1) {
      return Result.fail("At least one tag is required");
    }

    if (this.props.tags.length > 10) {
      return Result.fail("Maximum 10 tags are allowed");
    }

    return Result.ok(this);
  }

  public addTag(tag: string): Result<string[]> {
    if (this.hasTag(tag)) {
      return Result.fail("Tag already exists");
    }

    this.props.tags.push(tag);
    return Result.ok(this.props.tags);
  }

  public removeTag(tag: string): Result<string[]> {
    if (!this.hasTag(tag)) {
      return Result.fail("Tag not found");
    }

    this.props.tags = this.props.tags.filter((t) => t !== tag);
    return Result.ok(this.props.tags);
  }

  public hasTag(tag: string): boolean {
    return this.props.tags.includes(tag);
  }

  public overwriteTags(tags: string[]): Result<string[]> {
    this.props.tags = tags;
    return Result.ok(this.props.tags);
  }

  public updateTitle(title: string): Result<string> {
    this.props.title = title;
    return Result.ok(this.props.title);
  }

  public updateContent(content: string): Result<string> {
    this.props.content = content;
    return Result.ok(this.props.content);
  }

  public updatePosition(position: Position): Result<Position> {
    this.props.position = position;
    return Result.ok(this.props.position);
  }

  public updateAuthor(author: string): Result<string> {
    this.props.author = author;
    return Result.ok(this.props.author);
  }

  override get id(): PostId {
    return this.id;
  }

  get title(): string {
    return this.props.title;
  }

  get content(): string {
    return this.props.content;
  }

  get author(): string {
    return this.props.author;
  }

  get position(): Position {
    return this.props.position;
  }

  get tags(): string[] {
    return this.props.tags;
  }

  get createdAt(): Dayjs {
    return this.props.createdAt;
  }

  get updatedAt(): Dayjs {
    return this.props.updatedAt;
  }

  get deletedAt(): Dayjs | null {
    return this.props.deletedAt;
  }
}
