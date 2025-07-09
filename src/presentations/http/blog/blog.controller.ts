import { BlogFacade } from "@applications/blog/blog.facade";
import { Body, Controller, Post, HttpStatus } from "@nestjs/common";
import { SynchronizeWeeklyILearnedRequest } from "@presentations/http/blog/dtos/synchronizeWeeklyILearned.dto";
import { PostResponseModel } from "@presentations/http/blog/dtos/models/post.response-model";
import { ApiDoc } from "@common/shared/response/apiResponse.decorator";
import { ControllerResponse } from "@common/shared/response/controller.response";

@Controller("blog")
export class BlogController {
  constructor(private readonly blogService: BlogFacade) {}

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
  @Post("sync/weekly-i-learned")
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
