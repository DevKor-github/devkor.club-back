import { Column, Entity } from "typeorm";
import type { DesignerApplyRequestDto } from "../dto";
import { ApplyBase } from "./apply-base.entity";

@Entity("designer_apply")
export class DesignerApplyEntity extends ApplyBase {
  @Column({ name: "본인을 자유롭게 소개해주세요.", type: "text" })
  answer1!: string;

  @Column({
    name: "과거에 디자인했던 프로젝트나 경험에 대해서 자세히 서술해주세요.",
    type: "text",
  })
  answer2!: string;

  @Column({
    name: "가장 뛰어나다고 생각하는 본인의 능력을 서술해주세요.",
    type: "text",
  })
  answer3!: string;

  @Column({
    name: "새로운 프로젝트를 시작할 때 어떤 절차로 진행하는지 디자인 프로세스를 서술해주세요.",
    type: "text",
  })
  answer4!: string;

  @Column({
    name: "개발자, 프로젝트 매니저 등 다른 팀원과 협업할 때 중요하게 생각하는 가치와 갈등 상황에서 본인의 대처 방안을 서술해주세요.",
    type: "text",
  })
  answer5!: string;

  @Column({
    name: "DevKor에서 얻고 싶은 것과 하고 싶은 활동에 대해 서술해주세요.",
    type: "text",
  })
  answer6!: string;

  @Column({
    nullable: true,
    name: "포트폴리오가 있다면, 첨부해주세요!",
    type: "text",
  })
  answer7?: string;
  constructor(dto: DesignerApplyRequestDto) {
    super(dto);

    this.answer1 = dto.answer1;
    this.answer2 = dto.answer2;
    this.answer3 = dto.answer3;
    this.answer4 = dto.answer4;
    this.answer5 = dto.answer5;
    this.answer6 = dto.answer6;
    this.answer7 = dto.answer7;
  }
}
