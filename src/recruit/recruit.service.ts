import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import coolsms, { type MessageType } from "coolsms-node-sdk";
import { Repository } from "typeorm";
import {
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
import { NotionService } from "@/notion/notion.service";
import { deriveCompleteMessage } from "@/util/sms";
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
    private readonly notionService: NotionService
  ) {}
  messageService = new coolsms(
    process.env.MESSAGE_API_KEY,
    process.env.MESSAGE_API_SECRET
  );
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

  async sendSMS(to: string, content: string) {
    const body = {
      from: "01052196349",
      to,
      subject: "[DevKor 2025-1 리크루팅 지원 완료 안내]",
      text: content,
      type: "LMS" as MessageType,
      autoTypeDetect: false,
    };

    await this.messageService.sendOne(body);
  }
  // TODO: 문자 내용 변경
  async applyFrontend(dto: FrontendApplyRequestDto) {
    const entity = new FrontApplyEntity(dto);
    await this.frontApplyRepository.save(entity);
    const num = await this.frontApplyRepository.count();
    this.notificationToChannel(`FE 지원자 총 ${num}명`);
    const message = deriveCompleteMessage("FE 개발자", dto.name);
    this.sendSMS(dto.phone.split("-").join(""), message);
  }

  async applyBackend(dto: BackendApplyRequestDto) {
    const entity = new BackendApplyEntity(dto);
    await this.backendApplyRepository.save(entity);
    const num = await this.backendApplyRepository.count();
    this.notificationToChannel(`BE 지원자 총 ${num}명`);

    const message = deriveCompleteMessage("BE 개발자", dto.name);
    this.sendSMS(dto.phone.split("-").join(""), message);
  }

  async applyPm(dto: PmApplyRequestDto) {
    const entity = new PmApplyEntity(dto);
    await this.pmApplyRepository.save(entity);
    const num = await this.pmApplyRepository.count();
    this.notificationToChannel(`PM 지원자 총 ${num}명`);

    const message = deriveCompleteMessage("PM", dto.name);
    this.sendSMS(dto.phone.split("-").join(""), message);
  }

  async applyDesigner(dto: DesignerApplyRequestDto) {
    const entity = new DesignerApplyEntity(dto);
    await this.designerApplyRepository.save(entity);
    const num = await this.designerApplyRepository.count();
    this.notificationToChannel(`DE 지원자 총 ${num}명`);

    const message = deriveCompleteMessage("디자이너", dto.name);
    this.sendSMS(dto.phone.split("-").join(""), message);
  }

  async arrangeInterviewTime() {
    const frontList = (await this.frontApplyRepository.find()).map((app) => {
      return { type: "fe", ...app };
    });
    const backList = (await this.backendApplyRepository.find()).map((app) => {
      return { type: "be", ...app };
    });
    const pmList = (await this.pmApplyRepository.find()).map((app) => {
      return { type: "pm", ...app };
    });
    const designerList = (await this.designerApplyRepository.find()).map(
      (app) => {
        return { type: "de", ...app };
      }
    );

    const allList = [...frontList, ...backList, ...pmList, ...designerList];
    const interviewMap = {
      1: "월 1시",
      2: "월 2시",
      4: "월 3시",
      8: "월 4시",
      16: "월 5시",

      32: "화 1시",
      64: "화 2시",
      128: "화 3시",
      256: "화 4시",
      512: "화 5시",

      1024: "수 1시",
      2048: "수 2시",
      4096: "수 3시",
      8192: "수 4시",
      16384: "수 5시",
    };
    const map = {};
    for (const apply of allList) {
      const { interviewTime } = apply;
      const obj = {
        name: apply.name,
        phone: apply.phone,
        type: apply.type,
        time: [],
      };
      for (let i = 0; i < 16; i++) {
        const val = 1 << i;
        if (interviewTime & val) {
          const time = interviewMap[val];

          map[time] = map[time] ? [...map[time], obj] : [obj];
          obj.time.push(time);
        }
      }
      console.log(obj);
    }
    //console.log(map);
  }

  async sendInterviewTime() {
    const list: { time: string; name: string; phoneNumber: string }[] = [];
    for (const i of list) {
      const { name } = i;
      const message = `안녕하세요, DevKor에 지원해 주셔서 감사합니다. 
아쉽게도 최종 면접에서, 불합격되었음을 안내드립니다. 
DevKor에 관심 가져주셔서 감사하다는 말씀 드리며, 향후 기회를 기대하겠습니다.`;
      await this.sendSMS(i.phoneNumber, message);
    }
  }
}
