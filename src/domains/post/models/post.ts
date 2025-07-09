import { AggregateRoot } from "@common/shared/core/domains/aggregateRoot";
import { Result } from "@common/shared/core/domains/result";
import { Position } from "@common/shared/enums/position.enum";
import { PostId } from "@common/shared/identifiers/postId";
import dayjs, { Dayjs } from "dayjs";

export interface PostNewProps {
  title: string;
  author: string;
  position: Position;
  coverImageUrl: string | null;
  tags: string[];
  content: string;
  createdAt?: Dayjs;
  updatedAt?: Dayjs;
}

export interface PostProps extends PostNewProps {
  viewCount: number;
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
        viewCount: 0,
        createdAt: dayjs(),
        updatedAt: dayjs(),
        deletedAt: null,
      },
      new PostId()
    );
  }

  public validate(): Result<Post> {
    if (this.props.title.length < 2) {
      return Result.fail("Title must be at least 1 character long");
    }

    if (this.props.content.length < 2) {
      return Result.fail("Content must be at least 1 character long");
    }

    if (this.props.tags.length > 10) {
      return Result.fail("Maximum 10 tags are allowed");
    }

    return Result.ok(this);
  }

  public addTag(tag: string): Result<Post> {
    if (this.hasTag(tag)) {
      return Result.fail("Tag already exists");
    }

    this.props.tags.push(tag);
    return this.validate();
  }

  public removeTag(tag: string): Result<Post> {
    if (!this.hasTag(tag)) {
      return Result.fail("Tag not found");
    }

    this.props.tags = this.props.tags.filter((t) => t !== tag);
    return this.validate();
  }

  public hasTag(tag: string): boolean {
    return this.props.tags.includes(tag);
  }

  public overwriteTags(tags: string[]): Result<Post> {
    this.props.tags = tags;
    return this.validate();
  }

  public updateTitle(title: string): Result<Post> {
    this.props.title = title;
    return this.validate();
  }

  public updateContent(content: string): Result<Post> {
    this.props.content = content;
    return this.validate();
  }

  public updatePosition(position: Position): Result<Post> {
    this.props.position = position;
    return this.validate();
  }

  public updateCoverImageUrl(coverImageUrl: string | null): Result<Post> {
    this.props.coverImageUrl = coverImageUrl;
    return this.validate();
  }

  public updateAuthor(author: string): Result<Post> {
    this.props.author = author;
    return this.validate();
  }

  override get id(): PostId {
    return this._id as PostId;
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

  get coverImageUrl(): string | null {
    return this.props.coverImageUrl;
  }

  /**
   * 도메인 외부에서 관리되는 값이므로 조회만 가능
   */
  get viewCount(): number {
    return this.props.viewCount;
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
