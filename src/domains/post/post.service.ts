import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { Page } from "@common/shared/core/page";
import { PostId } from "@common/shared/identifiers/postId";
import { Post, PostNewProps } from "@domains/post/models/post";
import { PostInfo } from "@domains/post/models/post.info";
import { POST_READER, PostReader } from "@domains/post/post.reader";
import { POST_STORE, PostStore } from "@domains/post/post.store";

@Injectable()
export class PostService {
  constructor(
    @Inject(POST_READER) private readonly postReader: PostReader,
    @Inject(POST_STORE) private readonly postStore: PostStore
  ) {}

  async create(props: PostNewProps): Promise<PostInfo> {
    const result = Post.createNew(props);
    if (result.isFailure) {
      throw new BadRequestException(result.error);
    }
    await this.postStore.save(result.value);
    return PostInfo.from(result.value);
  }

  async getPost(id: PostId): Promise<PostInfo | null> {
    const post = await this.postReader.findById(id);
    return post ? PostInfo.from(post) : null;
  }

  async getPosts(page: number, size: number): Promise<Page<PostInfo>> {
    const postPage = await this.postReader.findPaginated(page, size);
    const postInfos = postPage.items.map(PostInfo.from);
    return new Page(postInfos, postPage.total, page, size);
  }
}
