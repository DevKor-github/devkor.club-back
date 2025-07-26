import { RecruitService } from "@applications/recruit/recruit.service";
import { ApiResponseType } from "@common/shared/response/apiResponse.decorator";
import { ControllerResponse } from "@common/shared/response/controller.response";
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiParam } from "@nestjs/swagger";
import { ApplyDto } from "@presentations/http/recruit/dtos/apply.dto";
import { RecruitConfigResponseDto } from "@presentations/http/recruit/dtos/recruit-config.response-dto";
import { QuestionsResponseDto } from "@presentations/http/recruit/dtos/questions.response-dto";
import { Position } from "@common/shared/enums/position.enum";

@Controller("recruit")
export class RecruitController {
  constructor(private readonly recruitService: RecruitService) {}

  @ApiOperation({ summary: "지원 기간 확인" })
  @ApiResponseType(Boolean)
  @Get("/application/period")
  async getApplicationPeriod(): Promise<ControllerResponse<boolean>> {
    return ControllerResponse.success(
      await this.recruitService.getApplicationPeriod()
    );
  }

  @ApiOperation({ summary: "리크루팅 설정 정보 조회" })
  @ApiResponseType(RecruitConfigResponseDto)
  @Get("/config")
  async getRecruitConfig(): Promise<
    ControllerResponse<RecruitConfigResponseDto>
  > {
    return ControllerResponse.success(
      await this.recruitService.getRecruitConfig()
    );
  }

  @ApiOperation({ summary: "포지션별 질문 조회" })
  @ApiParam({
    name: "position",
    description: "지원 포지션",
    enum: Position,
    example: Position.FE,
  })
  @ApiResponseType(QuestionsResponseDto)
  @Get("/questions/:position")
  async getQuestionsByPosition(
    @Param("position") position: Position
  ): Promise<ControllerResponse<QuestionsResponseDto>> {
    const questions = await this.recruitService.getQuestionsByPosition(
      position
    );
    return ControllerResponse.success({ questions });
  }

  @ApiOperation({ summary: "지원하기" })
  @ApiResponseType(Boolean)
  @Post("/application")
  async apply(@Body() body: ApplyDto): Promise<ControllerResponse<boolean>> {
    await this.recruitService.apply(body);
    return ControllerResponse.success(true);
  }
}
