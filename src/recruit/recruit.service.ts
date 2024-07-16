import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import  { Repository } from "typeorm";
import  {
  BackendApplyRequestDto,
  DesignerApplyRequestDto,
  FrontendApplyRequestDto,
  PmApplyRequestDto,
} from "./dto";
import {
  BackendApplyEntity,
  DesignerApplyEntity,
  FrontApplyEntity,
  PmApplyEntity,
} from "./entity";
@Injectable()
export class RecruitService {
  constructor(
    @InjectRepository(FrontApplyEntity)
    private readonly frontApplyRepository: Repository<FrontApplyEntity>,
    @InjectRepository(BackendApplyEntity)
    private readonly backendApplyRepository: Repository<BackendApplyEntity>,
    @InjectRepository(PmApplyEntity)
    private readonly pmApplyRepository: Repository<PmApplyEntity>,
    @InjectRepository(DesignerApplyEntity)
    private readonly designerApplyRepository: Repository<DesignerApplyEntity>,
  ) {}
  client = axios.create({
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
    },
    baseURL: "https://discord.com/api",
  });

  allChannelPath = "/channels/1212765451558461551/messages";
  async notificationToChannel(content: string) {
    await this.client.post(this.allChannelPath, { content });
  }
  async applyFrontend(dto: FrontendApplyRequestDto) {
    const entity = new FrontApplyEntity(dto);
    await this.frontApplyRepository.save(entity);
    const num = await this.frontApplyRepository.count();
    this.notificationToChannel(`FE 지원자 총 ${num}명`);
  }

  async applyBackend(dto: BackendApplyRequestDto) {
    const entity = new BackendApplyEntity(dto);
    await this.backendApplyRepository.save(entity);
    const num = await this.backendApplyRepository.count();
    this.notificationToChannel(`BE 지원자 총 ${num}명`);
  }

  async applyPm(dto: PmApplyRequestDto) {
    const entity = new PmApplyEntity(dto);
    await this.pmApplyRepository.save(entity);
    const num = await this.pmApplyRepository.count();
    this.notificationToChannel(`PM 지원자 총 ${num}명`);
  }

  async applyDesigner(dto: DesignerApplyRequestDto) {
    const entity = new DesignerApplyEntity(dto);
    await this.designerApplyRepository.save(entity);
    const num = await this.designerApplyRepository.count();
    this.notificationToChannel(`DE 지원자 총 ${num}명`);
  }
}
