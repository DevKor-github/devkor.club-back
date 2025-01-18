import { Body, Controller, Get, Post } from "@nestjs/common";
import {
  BackendApplyRequestDto,
  DesignerApplyRequestDto,
  FrontendApplyRequestDto,
  PmApplyRequestDto,
} from "./dto";
import { RecruitService } from "./recruit.service";

@Controller("recruit")
export class RecruitController {
  constructor(private readonly recruitService: RecruitService) {}
  @Post("/apply/fe")
  async applyFrontend(@Body() body: FrontendApplyRequestDto) {
    return await this.recruitService.applyFrontend(body);
  }

  @Post("/apply/be")
  async applyBackend(@Body() body: BackendApplyRequestDto) {
    return await this.recruitService.applyBackend(body);
  }

  @Post("/apply/pm")
  async applyPm(@Body() body: PmApplyRequestDto) {
    return await this.recruitService.applyPm(body);
  }

  @Post("/apply/de")
  async applyDesigner(@Body() body: DesignerApplyRequestDto) {
    return await this.recruitService.applyDesigner(body);
  }
}
