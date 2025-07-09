import { BlogFacade } from "@applications/blog/blog.facade";
import { PostId } from "@common/shared/identifiers/postId";
import { ApiDoc } from "@common/shared/response/apiResponse.decorator";
import { ControllerResponse } from "@common/shared/response/controller.response";
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Ip,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { PostResponseModel } from "@presentations/http/blog/dtos/models/post.response-model";
import { SyncBlogPostRequest } from "@presentations/http/blog/dtos/synchronizeBlogPost.dto";
import { GetPostsDto } from "./dtos/getPosts.dto";
import { PostPageResponseModel } from "./dtos/models/post-page.response-model";

@Controller("blog")
export class BlogController {
  constructor(private readonly blogFacade: BlogFacade) {}

  @ApiDoc({
    summary: "게시물 페이지네이션 조회",
    description: "게시물 목록을 페이지네이션으로 조회합니다.",
    successType: PostPageResponseModel,
  })
  @Get("posts")
  async getPosts(
    @Query() getPostsDto: GetPostsDto
  ): Promise<ControllerResponse<PostPageResponseModel>> {
    const { page, size, position, tags, sortBy } = getPostsDto;
    const postPage = await this.blogFacade.getPosts(
      page ?? 1,
      size ?? 10,
      position,
      tags,
      sortBy
    );
    const postResponsePage = new PostPageResponseModel(
      postPage.items.map(PostResponseModel.fromPostInfo),
      postPage.total,
      postPage.page,
      postPage.size
    );
    return ControllerResponse.success(postResponsePage);
  }

  @ApiDoc({
    summary: "게시물 단일 조회",
    description:
      "ID로 게시물을 조회합니다. 조회수가 증가합니다. (동일 IP당 시간 제한)",
    successType: PostResponseModel,
    errorResponses: [
      { status: HttpStatus.NOT_FOUND, description: "게시물을 찾을 수 없음" },
    ],
  })
  @Get("posts/:id")
  async getPost(
    @Param("id") id: string,
    @Ip() clientIp: string
  ): Promise<ControllerResponse<PostResponseModel>> {
    const postInfo = await this.blogFacade.viewPost(new PostId(id), clientIp);
    return ControllerResponse.success(PostResponseModel.fromPostInfo(postInfo));
  }

  @ApiDoc({
    summary: "외부 소스 데이터 동기화",
    description: "외부 소스 데이터를 가져와 블로그에 게시물로 동기화합니다.",
    successType: [PostResponseModel],
    errorResponses: [
      { status: HttpStatus.NOT_FOUND, description: "데이터를 찾을 수 없음" },
      { status: HttpStatus.CONFLICT, description: "중복된 데이터" },
    ],
  })
  @Post("posts/sync")
  async syncBlogPost(
    @Body() body: SyncBlogPostRequest
  ): Promise<ControllerResponse<PostResponseModel[]>> {
    const postInfos = await this.blogFacade.syncBlogPost(
      body.startDate,
      body.type
    );
    return ControllerResponse.success(
      PostResponseModel.fromPostInfoList(postInfos)
    );
  }
}
