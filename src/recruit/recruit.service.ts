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
  messageService = new coolsms(
    process.env.MESSAGE_API_KEY,
    process.env.MESSAGE_API_SECRET,
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
      subject: "[DevKor 2024-2 리크루팅 지원 완료 안내]",
      text: content,
      type: "LMS" as MessageType,
      autoTypeDetect: false,
    };

    await this.messageService.sendOne(body);
  }

  async applyFrontend(dto: FrontendApplyRequestDto) {
    const entity = new FrontApplyEntity(dto);
    await this.frontApplyRepository.save(entity);
    const num = await this.frontApplyRepository.count();
    this.notificationToChannel(`FE 지원자 총 ${num}명`);
    const message = `
안녕하세요, ${dto.name}님! DevKor에 지원해주셔서 감사합니다.
FE 개발자 지원서가 성공적으로 제출되었습니다.

앞으로의 DevKor 일정은 다음과 같습니다.

- 서류 발표: 7월 28일 (일)
- 면접: 7월 29일 (월) - 7월 31일 (수) (비대면)
- 최종 결과 발표: 8월 1일 (목)
- 합격자 OT: 8월 2일 (금)
- 정기 세션: 8월 5일 (월)부터 매주 월요일 19:00-21:00

면접은 서류 발표와 함께 안내될 예정이며, 10분 정도의 비대면 면접으로 진행됩니다.

다시 한 번 지원해주셔서 감사하다는 말씀 드리며, 면접 일정 안내를 기다려주세요!

DevKor 운영진 드림
`;
    this.sendSMS(dto.phone.split("-").join(""), message);
  }

  async applyBackend(dto: BackendApplyRequestDto) {
    const entity = new BackendApplyEntity(dto);
    await this.backendApplyRepository.save(entity);
    const num = await this.backendApplyRepository.count();
    this.notificationToChannel(`BE 지원자 총 ${num}명`);

    const message = `
안녕하세요, ${dto.name}님! DevKor에 지원해주셔서 감사합니다.
BE 개발자 지원서가 성공적으로 제출되었습니다.

앞으로의 DevKor 일정은 다음과 같습니다.

- 서류 발표: 7월 28일 (일)
- 면접: 7월 29일 (월) - 7월 31일 (수) (비대면)
- 최종 결과 발표: 8월 1일 (목)
- 합격자 OT: 8월 2일 (금)
- 정기 세션: 8월 5일 (월)부터 매주 월요일 19:00-21:00

면접은 서류 발표와 함께 안내될 예정이며, 10분 정도의 비대면 면접으로 진행됩니다.

다시 한 번 지원해주셔서 감사하다는 말씀 드리며, 면접 일정 안내를 기다려주세요!

DevKor 운영진 드림
`;
    this.sendSMS(dto.phone.split("-").join(""), message);
  }

  async applyPm(dto: PmApplyRequestDto) {
    const entity = new PmApplyEntity(dto);
    await this.pmApplyRepository.save(entity);
    const num = await this.pmApplyRepository.count();
    this.notificationToChannel(`PM 지원자 총 ${num}명`);

    const message = `
안녕하세요, ${dto.name}님! DevKor에 지원해주셔서 감사합니다.
프로젝트 매니저 지원서가 성공적으로 제출되었습니다.

앞으로의 DevKor 일정은 다음과 같습니다.

- 서류 발표: 7월 28일 (일)
- 면접: 7월 29일 (월) - 7월 31일 (수) (비대면)
- 최종 결과 발표: 8월 1일 (목)
- 합격자 OT: 8월 2일 (금)
- 정기 세션: 8월 5일 (월)부터 매주 월요일 19:00-21:00

면접은 서류 발표와 함께 안내될 예정이며, 10분 정도의 비대면 면접으로 진행됩니다.

다시 한 번 지원해주셔서 감사하다는 말씀 드리며, 면접 일정 안내를 기다려주세요!

DevKor 운영진 드림
`;
    this.sendSMS(dto.phone.split("-").join(""), message);
  }

  async applyDesigner(dto: DesignerApplyRequestDto) {
    const entity = new DesignerApplyEntity(dto);
    await this.designerApplyRepository.save(entity);
    const num = await this.designerApplyRepository.count();
    this.notificationToChannel(`DE 지원자 총 ${num}명`);

    const message = `
안녕하세요, ${dto.name}님! DevKor에 지원해주셔서 감사합니다.
디자이너 지원서가 성공적으로 제출되었습니다.

앞으로의 DevKor 일정은 다음과 같습니다.

- 서류 발표: 7월 28일 (일)
- 면접: 7월 29일 (월) - 7월 31일 (수) (비대면)
- 최종 결과 발표: 8월 1일 (목)
- 합격자 OT: 8월 2일 (금)
- 정기 세션: 8월 5일 (월)부터 매주 월요일 19:00-21:00

면접은 서류 발표와 함께 안내될 예정이며, 10분 정도의 비대면 면접으로 진행됩니다.

다시 한 번 지원해주셔서 감사하다는 말씀 드리며, 면접 일정 안내를 기다려주세요!

DevKor 운영진 드림
`;
    this.sendSMS(dto.phone.split("-").join(""), message);
  }
}
