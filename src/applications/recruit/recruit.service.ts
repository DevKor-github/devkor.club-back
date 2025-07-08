import {
  position,
  createAnswerMap,
  deriveName,
} from "@common/shared/util/question";
import { deriveCompleteMessage } from "@common/shared/util/sms";
import { NotionService } from "@common/support/notion/notion.service";
import { Injectable } from "@nestjs/common";
import {
  FrontendApplyRequestDto,
  BackendApplyRequestDto,
  PmApplyRequestDto,
  DesignerApplyRequestDto,
} from "@presentations/http/recruit/dto";

import axios from "axios";
import coolsms, { MessageType } from "coolsms-node-sdk";

@Injectable()
export class RecruitService {
  constructor(private readonly notionService: NotionService) {}

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

  private readonly dbIdMap: Record<position, string> = {
    PD: "18f156c7df6280ae85b0d2e34d7a7503",
    "FE 개발자": "18f156c7df6280179eb9e0a11254b904",
    "BE 개발자": "18f156c7df6280bcb196c510b26d9c0a",
    PM: "18f156c7df6280afaec3e96c09200464",
  };

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

  async applyFrontend(dto: FrontendApplyRequestDto) {
    const result = await this.saveRecruitAnswer("FE 개발자", [
      dto.name,
      dto.email,
      dto.phone,
      dto.major,
      dto.studentId,
      dto.interviewTime.toString(),
      dto.answer1,
      dto.answer2,
      dto.answer3,
      dto.answer4,
      dto.answer5,
    ]);

    this.notificationToChannel(
      `FE 지원 https://www.notion.so/overthestream/${result.id.replace(
        /-/g,
        ""
      )}`
    );
    const message = deriveCompleteMessage("FE 개발자", dto.name);
    this.sendSMS(dto.phone.split("-").join(""), message);
  }

  async applyBackend(dto: BackendApplyRequestDto) {
    const result = await this.saveRecruitAnswer("BE 개발자", [
      dto.name,
      dto.email,
      dto.phone,
      dto.major,
      dto.studentId,
      dto.interviewTime.toString(),
      dto.answer1,
      dto.answer2,
      dto.answer3,
      dto.answer4,
      dto.answer5,
    ]);

    this.notificationToChannel(
      `BE 지원 https://www.notion.so/overthestream/${result.id.replace(
        /-/g,
        ""
      )}`
    );
    const message = deriveCompleteMessage("BE 개발자", dto.name);
    this.sendSMS(dto.phone.split("-").join(""), message);
  }

  async applyPm(dto: PmApplyRequestDto) {
    const result = await this.saveRecruitAnswer("PM", [
      dto.name,
      dto.email,
      dto.phone,
      dto.major,
      dto.studentId,
      dto.interviewTime.toString(),
      dto.answer1,
      dto.answer2,
      dto.answer3,
      dto.answer4,
      dto.answer5,
    ]);

    this.notificationToChannel(
      `PM 지원 https://www.notion.so/overthestream/${result.id.replace(
        /-/g,
        ""
      )}`
    );
    const message = deriveCompleteMessage("PM", dto.name);
    this.sendSMS(dto.phone.split("-").join(""), message);
  }

  async applyDesigner(dto: DesignerApplyRequestDto) {
    const result = await this.saveRecruitAnswer("PD", [
      dto.name,
      dto.email,
      dto.phone,
      dto.major,
      dto.studentId,
      dto.interviewTime.toString(),
      dto.answer1,
      dto.answer2,
      dto.answer3,
      dto.answer4,
      dto.answer5,
      dto.answer6,
      dto.answer7,
    ]);

    this.notificationToChannel(
      `PD 지원 https://www.notion.so/overthestream/${result.id.replace(
        /-/g,
        ""
      )}`
    );
    const message = deriveCompleteMessage("PD", dto.name);
    this.sendSMS(dto.phone.split("-").join(""), message);
  }

  private async saveRecruitAnswer(type: position, answerList: Array<string>) {
    const answerMap = createAnswerMap(type, answerList);
    const name = deriveName(answerList);

    // 프로퍼티 생성
    const properties = {
      page: this.notionService.createTitleProperty(name),
    };

    for (const [key, value] of Object.entries(answerMap)) {
      properties[key] = this.notionService.createTextProperty(value);
    }

    // 페이지 내용 생성
    const children = [];
    for (const [key, value] of Object.entries(answerMap)) {
      children.push(
        this.notionService.createHeadingBlock(key, 2),
        this.notionService.createParagraphBlock(value)
      );
    }

    return await this.notionService.createPage(
      this.dbIdMap[type],
      properties,
      children
    );
  }

  //   async arrangeInterviewTime() {
  //     const frontList = (await this.frontApplyRepository.find()).map((app) => {
  //       return { type: "fe", ...app };
  //     });
  //     const backList = (await this.backendApplyRepository.find()).map((app) => {
  //       return { type: "be", ...app };
  //     });
  //     const pmList = (await this.pmApplyRepository.find()).map((app) => {
  //       return { type: "pm", ...app };
  //     });
  //     const designerList = (await this.designerApplyRepository.find()).map(
  //       (app) => {
  //         return { type: "de", ...app };
  //       }
  //     );

  //     const allList = [...frontList, ...backList, ...pmList, ...designerList];
  //     const interviewMap = {
  //       1: "월 1시",
  //       2: "월 2시",
  //       4: "월 3시",
  //       8: "월 4시",
  //       16: "월 5시",
  //       32: "월 9시",
  //       64: "월 10시",

  //       128: "화 1시",
  //       256: "화 2시",
  //       512: "화 3시",
  //       1024: "화 4시",
  //       2048: "화 5시",
  //       4096: "화 9시",
  //       8192: "화 10시",

  //       16384: "수 1시",
  //       32768: "수 2시",
  //       65536: "수 3시",
  //       131072: "수 4시",
  //       262144: "수 5시",
  //       524288: "수 9시",
  //       1048576: "수 10시",
  //     };
  //   }

  //   async sendInterviewTime() {
  //     const list: { time: string; name: string; phoneNumber: string }[] = [];
  //     for (const i of list) {
  //       const { name } = i;
  //       const message = `안녕하세요, DevKor에 지원해 주셔서 감사합니다.
  // 아쉽게도 최종 면접에서, 불합격되었음을 안내드립니다.
  // DevKor에 관심 가져주셔서 감사하다는 말씀 드리며, 향후 기회를 기대하겠습니다.`;
  //       await this.sendSMS(i.phoneNumber, message);
  //     }
  //   }
}
