import { BlogFacade } from "@applications/blog/blog.facade";
import {
  Body,
  Controller,
  Post,
  HttpStatus,
  Get,
  Query,
  Param,
  ParseUUIDPipe,
} from "@nestjs/common";
import { SynchronizeWeeklyILearnedRequest } from "@presentations/http/blog/dtos/synchronizeWeeklyILearned.dto";
import { PostResponseModel } from "@presentations/http/blog/dtos/models/post.response-model";
import { ApiDoc } from "@common/shared/response/apiResponse.decorator";
import { ControllerResponse } from "@common/shared/response/controller.response";
import { GetPostsDto } from "./dtos/getPosts.dto";
import { PostPageResponseModel } from "./dtos/models/post-page.response-model";

@Controller("blog")
export class BlogController {
  constructor(private readonly blogService: BlogFacade) {}

  @ApiDoc({
    summary: "게시물 페이지네이션 조회",
    description: "게시물 목록을 페이지네이션으로 조회합니다.",
    successType: PostPageResponseModel,
  })
  @Get("posts")
  async getPosts(
    @Query() getPostsDto: GetPostsDto
  ): Promise<ControllerResponse<PostPageResponseModel>> {
    const { page, size } = getPostsDto;
    const postPage = await this.blogService.getPosts(page ?? 1, size ?? 10);
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
    description: "ID로 게시물을 조회합니다.",
    successType: PostResponseModel,
    errorResponses: [
      { status: HttpStatus.NOT_FOUND, description: "게시물을 찾을 수 없음" },
    ],
  })
  @Get("posts/:id")
  async getPost(
    @Param("id", ParseUUIDPipe) id: string
  ): Promise<ControllerResponse<PostResponseModel>> {
    const postInfo = await this.blogService.getPost(id);
    return ControllerResponse.success(PostResponseModel.fromPostInfo(postInfo));
  }

  @ApiDoc({
    summary: "Weekly I Learned 동기화",
    description:
      "Notion에서 Weekly I Learned 데이터를 가져와 블로그 포스트로 동기화합니다",
    successType: [PostResponseModel],
    errorResponses: [
      { status: HttpStatus.NOT_FOUND, description: "데이터를 찾을 수 없음" },
      { status: HttpStatus.CONFLICT, description: "중복된 데이터" },
    ],
  })
  @Post("posts/sync/weekly-i-learned")
  async synchronizeWeeklyILearned(
    @Body() body: SynchronizeWeeklyILearnedRequest
  ): Promise<ControllerResponse<PostResponseModel[]>> {
    const postInfos = await this.blogService.synchronizeWeeklyILearned(
      body.startDate
    );
    return ControllerResponse.success(
      PostResponseModel.fromPostInfoList(postInfos)
    );
  }
}
