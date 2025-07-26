import { RecruitService } from "@applications/recruit/recruit.service";
import { ApiResponseType } from "@common/shared/response/apiResponse.decorator";
import { ControllerResponse } from "@common/shared/response/controller.response";
import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { ApplyDto } from "@presentations/http/recruit/dtos/apply.dto";

@Controller("recruit")
export class RecruitController {
  constructor(private readonly recruitService: RecruitService) {}
  startAt = new Date("2025-02-09T15:00:00Z").getTime(); // 2025-02-10 00:00 KST
  endAt = new Date("202 5-02-21T15:00:00Z").getTime(); // 2025-02-22 00:00 KST

  blockExpiredApplication() {
    // const now = new Date().getTime();
    // if (!(this.startAt <= now && now < this.endAt))
    //   throw new BadRequestException("지원 기간이 아닙니다.");
  }

  @ApiOperation({ summary: "지원하기" })
  @ApiResponseType(undefined)
  @Post("/application")
  async apply(@Body() body: ApplyDto): Promise<ControllerResponse<void>> {
    this.blockExpiredApplication();
    return ControllerResponse.success(await this.recruitService.apply(body));
  }
}
