import { RecruitService } from "@applications/recruit/recruit.service";
import { ApiDoc } from "@common/shared/response/apiResponse.decorator";
import { ControllerResponse } from "@common/shared/response/controller.response";
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiParam } from "@nestjs/swagger";
import { ApplyDto } from "@presentations/http/recruit/dtos/apply.dto";
import { RecruitConfigResponseDto } from "@presentations/http/recruit/dtos/recruit-config.response-dto";
import { QuestionsResponseDto } from "@presentations/http/recruit/dtos/questions.response-dto";
import { Position } from "@common/shared/enums/position.enum";

@Controller("recruit")
export class RecruitController {
  constructor(private readonly recruitService: RecruitService) {}

  @ApiDoc({
    summary: "지원 기간 확인",
    description: `지원 기간을 조회합니다. 노션 페이지에 작성된 값을 파싱합니다.\n
설정은 1시간 캐싱되며 캐시를 삭제하려면 /clear-cache 엔드포인트를 호출해주세요.\n
<https://www.notion.so/devkor-official/23c1a845ed3e80c08df4d2f8ade23763?v=23c1a845ed3e80d68e23000c6391a1d1&source=copy_link>
`,
    successType: Boolean,
  })
  @Get("/application/period")
  async getApplicationPeriod(): Promise<ControllerResponse<boolean>> {
    return ControllerResponse.success(
      await this.recruitService.getApplicationPeriod()
    );
  }

  @ApiDoc({
    summary: "리크루팅 설정 정보 조회",
    description: `리크루팅 설정 정보를 조회합니다. 노션 페이지에 작성된 값을 파싱합니다.\n
설정은 1시간 캐싱되며 캐시를 삭제하려면 /clear-cache 엔드포인트를 호출해주세요.\n
<https://www.notion.so/devkor-official/23c1a845ed3e80c08df4d2f8ade23763?v=23c1a845ed3e80d68e23000c6391a1d1&source=copy_link>
`,
    successType: RecruitConfigResponseDto,
  })
  @Get("/config")
  async getRecruitConfig(): Promise<
    ControllerResponse<RecruitConfigResponseDto>
  > {
    return ControllerResponse.success(
      await this.recruitService.getRecruitConfig()
    );
  }

  @ApiDoc({
    summary: "포지션별 질문 조회",
    description: `포지션별 질문을 조회합니다. 노션 페이지에 작성된 값을 파싱합니다.\n
설정은 1시간 캐싱되며 캐시를 삭제하려면 /clear-cache 엔드포인트를 호출해주세요.\n
<https://www.notion.so/devkor-official/23c1a845ed3e80c08df4d2f8ade23763?v=23c1a845ed3e80d68e23000c6391a1d1&source=copy_link>
`,
    successType: QuestionsResponseDto,
  })
  @ApiParam({
    name: "position",
    description: "지원 포지션",
    enum: Position,
    example: Position.FE,
  })
  @Get("/questions/:position")
  async getQuestionsByPosition(
    @Param("position") position: Position
  ): Promise<ControllerResponse<QuestionsResponseDto>> {
    const questions = await this.recruitService.getQuestionsByPosition(
      position
    );
    return ControllerResponse.success({ questions });
  }

  @ApiDoc({
    summary: "지원하기",
    description: "지원하기",
    successType: Boolean,
  })
  @Post("/application")
  async apply(@Body() body: ApplyDto): Promise<ControllerResponse<boolean>> {
    await this.recruitService.apply(body);
    return ControllerResponse.success(true);
  }
}
