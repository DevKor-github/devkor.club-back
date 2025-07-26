import { Position } from "@common/shared/enums/position.enum";
import { deriveCompleteMessage } from "@common/shared/util/sms";
import { NotionService } from "@common/support/notion/notion.service";
import { Injectable } from "@nestjs/common";
import { ApplyDto } from "@presentations/http/recruit/dtos/apply.dto";

import axios from "axios";
import coolsms, { MessageType } from "coolsms-node-sdk";
import dayjs from "dayjs";

@Injectable()
export class RecruitService {
  constructor(private readonly notionService: NotionService) {}

  BASE_QUESTIONS = [
    "이름",
    "이메일",
    "휴대폰 번호",
    "학과",
    "학번",
    "면접 일정",
  ];

  messageService = new coolsms(
    process.env.MESSAGE_API_KEY!,
    process.env.MESSAGE_API_SECRET!
  );

  client = axios.create({
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
    },
    baseURL: "https://discord.com/api",
  });

  private readonly APPLICANT_DATABASE_ID = "2361a845ed3e80ebb039d4717d9e6124";

  allChannelPath = "/channels/1212765451558461551/messages";
  async notificationToChannel(content: string) {
    await this.client.post(this.allChannelPath, { content });
  }

  async sendSMS(to: string, content: string) {
    const body = {
      from: "01052196349",
      to,
      subject: "[DevKor 2025-2 리크루팅 지원 완료 안내]",
      text: content,
      type: "LMS" as MessageType,
      autoTypeDetect: false,
    };

    await this.messageService.sendOne(body);
  }

  async apply(dto: ApplyDto) {
    const result = await this.saveRecruitAnswer(dto.position, dto);

    this.notificationToChannel(
      `${
        dto.position
      } 지원 https://www.notion.so/devkor-official/${result.id.replace(
        /-/g,
        ""
      )}`
    );
    const message = deriveCompleteMessage(dto.position, dto.name);
    this.sendSMS(dto.phone.split("-").join(""), message);
  }

  private async saveRecruitAnswer(type: Position, dto: ApplyDto) {
    // 프로퍼티 생성 - Notion 데이터베이스 속성에 맞게 수정
    const properties: Record<string, any> = {
      이름: this.notionService.createTitleProperty(dto.name),
      이메일: this.notionService.createEmailProperty(dto.email),
      "휴대폰 번호": this.notionService.createPhoneNumberProperty(dto.phone),
      학과: this.notionService.createTextProperty(dto.major),
      학번: this.notionService.createTextProperty(dto.studentId),
      "면접 일정": this.notionService.createMultiSelectProperty(
        dto.interviewTime.map((time) =>
          dayjs.tz(time, "Asia/Seoul").format("YYYY-MM-DD HH:mm")
        )
      ),
    };

    // 페이지 내용 생성 (질의응답을 body로)
    const children: Array<any> = [];

    // 질의응답 섹션
    children.push(this.notionService.createHeadingBlock("질의응답", 2));
    for (const [question, answer] of Object.entries(dto.answer)) {
      children.push(
        this.notionService.createHeadingBlock(question, 3),
        this.notionService.createParagraphBlock(answer)
      );
    }

    return await this.notionService.createPage(
      this.APPLICANT_DATABASE_ID,
      properties,
      children
    );
  }
}
