import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Page } from "@common/shared/core/page";
import { PostId } from "@common/shared/identifiers/postId";
import { Post, PostNewProps } from "@domains/post/models/post";
import { PostInfo } from "@domains/post/models/post.info";
import { POST_READER, PostReader } from "@domains/post/post.reader";
import { POST_STORE, PostStore } from "@domains/post/post.store";
import { Position } from "@common/shared/enums/position.enum";
import { Result } from "@common/shared/core/domains/result";

@Injectable()
export class PostService {
  constructor(
    @Inject(POST_READER) private readonly postReader: PostReader,
    @Inject(POST_STORE) private readonly postStore: PostStore
  ) {}

  async create(props: PostNewProps): Promise<PostInfo> {
    const post = await this.postReader.findByTitle(props.title);
    if (post) {
      throw new BadRequestException("Post already exists");
    }
    const result = Post.createNew(props);
    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }
    await this.postStore.save(result.value);
    return PostInfo.from(result.value);
  }

  async update(
    id: PostId,
    props: {
      title: string;
      content: string;
      position: Position;
      tags: string[];
    }
  ): Promise<PostInfo> {
    const post = await this.postReader.findById(id);
    if (!post) {
      throw new NotFoundException("Post not found");
    }
    const results = [
      post.updateTitle(props.title),
      post.updateContent(props.content),
      post.updatePosition(props.position),
      post.overwriteTags(props.tags),
    ];
    if (Result.getFailResultIfExist(results)) {
      throw new BadRequestException(
        Result.getFailResultIfExist(results)?.error
      );
    }
    await this.postStore.save(post);
    return PostInfo.from(post);
  }

  async getPostById(id: PostId): Promise<PostInfo> {
    const post = await this.postReader.findById(id);
    if (!post) {
      throw new NotFoundException("Post not found");
    }
    return PostInfo.from(post);
  }

  async findPostById(id: PostId): Promise<PostInfo | null> {
    const post = await this.postReader.findById(id);
    return post ? PostInfo.from(post) : null;
  }

  async getPostByTitle(title: string): Promise<PostInfo> {
    const post = await this.postReader.findByTitle(title);
    if (!post) {
      throw new NotFoundException("Post not found");
    }
    return PostInfo.from(post);
  }

  async findPostByTitle(title: string): Promise<PostInfo | null> {
    const post = await this.postReader.findByTitle(title);
    return post ? PostInfo.from(post) : null;
  }

  async getPosts(
    page: number,
    size: number,
    position?: Position,
    tags?: string[]
  ): Promise<Page<PostInfo>> {
    const postPage = await this.postReader.findPaginated(
      page,
      size,
      position,
      tags
    );
    const postInfos = postPage.items.map(PostInfo.from);
    return new Page(postInfos, postPage.total, page, size);
  }
}
