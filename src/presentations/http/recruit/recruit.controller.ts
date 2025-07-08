import { RecruitService } from "@applications/recruit/recruit.service";
import { Body, Controller, Post } from "@nestjs/common";
import {
  BackendApplyRequestDto,
  DesignerApplyRequestDto,
  FrontendApplyRequestDto,
  PmApplyRequestDto,
} from "@presentations/http/recruit/dto";

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
  @Post("/apply/fe")
  async applyFrontend(@Body() body: FrontendApplyRequestDto) {
    this.blockExpiredApplication();
    return await this.recruitService.applyFrontend(body);
  }

  @Post("/apply/be")
  async applyBackend(@Body() body: BackendApplyRequestDto) {
    this.blockExpiredApplication();
    return await this.recruitService.applyBackend(body);
  }

  @Post("/apply/pm")
  async applyPm(@Body() body: PmApplyRequestDto) {
    this.blockExpiredApplication();
    return await this.recruitService.applyPm(body);
  }

  @Post("/apply/de")
  async applyDesigner(@Body() body: DesignerApplyRequestDto) {
    this.blockExpiredApplication();
    return await this.recruitService.applyDesigner(body);
  }
}
