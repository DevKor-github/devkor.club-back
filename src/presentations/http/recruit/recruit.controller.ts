import { RecruitService } from "@applications/recruit/recruit.service";
import { ApiResponseType } from "@common/shared/response/apiResponse.decorator";
import { ControllerResponse } from "@common/shared/response/controller.response";
import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import {
  BackendApplyRequestDto,
  DesignerApplyRequestDto,
  FrontendApplyRequestDto,
  PmApplyRequestDto,
} from "@presentations/http/recruit/dtos";

@Controller("recruit")
export class RecruitController {
  constructor(private readonly recruitService: RecruitService) {}
  startAt = new Date("2025-02-09T15:00:00Z").getTime(); // 2025-02-10 00:00 KST
  endAt = new Date("2025-02-21T15:00:00Z").getTime(); // 2025-02-22 00:00 KST

  blockExpiredApplication() {
    // const now = new Date().getTime();
    // if (!(this.startAt <= now && now < this.endAt))
    //   throw new BadRequestException("지원 기간이 아닙니다.");
  }
  @ApiOperation({ summary: "FE 지원" })
  @ApiResponseType(undefined)
  @Post("/apply/fe")
  @HttpCode(HttpStatus.OK)
  async applyFrontend(
    @Body() body: FrontendApplyRequestDto
  ): Promise<ControllerResponse<void>> {
    this.blockExpiredApplication();
    return ControllerResponse.success(
      await this.recruitService.applyFrontend(body)
    );
  }

  @ApiOperation({ summary: "BE 지원" })
  @ApiResponseType(undefined)
  @Post("/apply/be")
  async applyBackend(
    @Body() body: BackendApplyRequestDto
  ): Promise<ControllerResponse<void>> {
    this.blockExpiredApplication();
    return ControllerResponse.success(
      await this.recruitService.applyBackend(body)
    );
  }

  @ApiOperation({ summary: "PM 지원" })
  @ApiResponseType(undefined)
  @Post("/apply/pm")
  async applyPm(
    @Body() body: PmApplyRequestDto
  ): Promise<ControllerResponse<void>> {
    this.blockExpiredApplication();
    return ControllerResponse.success(await this.recruitService.applyPm(body));
  }

  @ApiOperation({ summary: "디자이너 지원" })
  @ApiResponseType(undefined)
  @Post("/apply/de")
  async applyDesigner(
    @Body() body: DesignerApplyRequestDto
  ): Promise<ControllerResponse<void>> {
    this.blockExpiredApplication();
    return ControllerResponse.success(
      await this.recruitService.applyDesigner(body)
    );
  }
}
