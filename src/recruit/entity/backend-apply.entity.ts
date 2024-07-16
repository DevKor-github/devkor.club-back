import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import type { BackendApplyRequestDto } from "../dto";
import { ApplyBase } from "./apply-base.entity";

@Entity("backend_apply")
export class BackendApplyEntity extends ApplyBase {
  @Column({ name: "Github 프로필 링크를 입력해주세요.", type: "text" })
  answer1!: string;

  @Column({
    name: "본인의 Github 저장소 중 지원자가 생각하기에 가장 코드 퀄리티가 높은 저장소가 무엇인지, 그리고 어떤 저장소인지 간략하게 설명해주세요.",
    type: "text",
  })
  answer2!: string;

  @Column({
    name: "특정 서비스 기능을 구현하는 것에서 더 나아가 서비스를 모니터링하고 성능을 개선해본 경험이 있다면, 작성해주세요.",
    type: "text",
  })
  answer3!: string;

  @Column({
    name: "지원자분이 개발자로서 성장하기 위해 하고 있는 노력과, 어떤 개발자가 되고 싶은지 작성해주세요.",
    type: "text",
  })
  answer4!: string;

  @Column({
    name: "지원자 분이 개발을 하는 이유, DevKor에서 성장하고 싶은 점에 대해서 작성해주세요.",
    type: "text",
  })
  answer5!: string;

  @Column({
    nullable: true,
    name: "개인 개발 블로그가 있다면 링크를 입력해주세요.",
    type: "text",
  })
  answer6?: string;

  @Column({
    nullable: true,
    name: "포트폴리오가 있다면, 첨부해주세요!",
    type: "text",
  })
  answer7?: string;

  constructor(dto?: BackendApplyRequestDto) {
    super(dto);

    if (!dto)
      dto = {
        answer1: "",
        answer2: "",
        answer3: "",
        answer4: "",
        answer5: "",
        name: "",
        email: "",
        phone: "",
        major: "",
        studentId: "2020320094",
        interviewTime: 3,
      };
    this.answer1 = dto.answer1;
    this.answer2 = dto.answer2;
    this.answer3 = dto.answer3;
    this.answer4 = dto.answer4;
    this.answer5 = dto.answer5;
    this.answer6 = dto.answer6;
    this.answer7 = dto.answer7;
  }
}
