import { Column, Entity } from "typeorm";
import type { PmApplyRequestDto } from "../dto";
import { ApplyBase } from "./apply-base.entity";

@Entity("pm_apply")
export class PmApplyEntity extends ApplyBase {
  @Column({ name: "본인을 자유롭게 소개해주세요.", type: "text" })
  answer1!: string;

  @Column({
    name: "본인이 어떤 문제를 주도적으로 해결해 본 경험, 또는 어떤 일에 몰입해서 참여한 경험에 대해 서술해주세요. 그 과정에서 본인의 역할 및 배운 점을 서술해주세요.",
    type: "text",
  })
  answer2!: string;

  @Column({
    name: "협업해 본 경험(특히 개발자와 디자이너), 그리고 그 과정에서 있던 갈등 관리 경험에 대해 서술해주세요.",
    type: "text",
  })
  answer3!: string;

  @Column({
    name: "DevKor에서 얻어가고 싶은 것들, 하고 싶은 활동들에 대해 서술해주세요.",
    type: "text",
  })
  answer4!: string;

  @Column({
    nullable: true,
    name: "포트폴리오가 있다면, 첨부해주세요!",
    type: "text",
  })
  answer5?: string;
  constructor(dto?: PmApplyRequestDto) {
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
  }
}
