import { AggregateRoot } from "@common/shared/core/domains/aggregateRoot";
import { PostId } from "@common/shared/identifiers/postId";
import dayjs, { Dayjs } from "dayjs";

export interface PostNewProps {
  title: string;
  content: string;
  authorId: string;
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

  static create(props: PostProps, id: PostId): Post {
    return new Post(props, id);
  }

  static createNew(props: PostNewProps): Post {
    const post = new Post(
      {
        ...props,
        createdAt: dayjs(),
        updatedAt: dayjs(),
        deletedAt: null,
      },
      new PostId()
    );

    return post;
  }

  get title(): string {
    return this.props.title;
  }

  get content(): string {
    return this.props.content;
  }

  get authorId(): string {
    return this.props.authorId;
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
