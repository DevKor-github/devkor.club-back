import { Column, Entity } from "typeorm";
import type { FrontendApplyRequestDto } from "../dto";
import { ApplyBase } from "./apply-base.entity";

@Entity("front_apply")
export class FrontApplyEntity extends ApplyBase {
  @Column({ name: "본인을 자유롭게 소개해주세요.", type: "text" })
  answer1!: string;

  @Column({ nullable: true, name: "Github/개인 블로그 링크", type: "text" })
  answer2?: string;

  @Column({
    name: "과거에 본인이 수행했던 프로젝트나 설계했던 프로그램, 공부했던 경험에 대해 자세히 서술해주세요.",
    type: "text",
  })
  answer3!: string;

  @Column({
    name: "본인의 개발 실력을 평가하고 평가에 대한 이유도 함께 서술해주세요.",
    type: "text",
  })
  answer4!: string;

  @Column({
    name: "본인이 생각하는 잘하는 FE 개발자는 어떤 개발자인지 서술해주세요.",
    type: "text",
  })
  answer5!: string;

  @Column({
    name: "DevKor에서 얻어가고 싶은 것들, 하고 싶은 활동들에 대해 서술해주세요.",
    type: "text",
  })
  answer6!: string;
  constructor(dto?: FrontendApplyRequestDto) {
    super(dto);
    if (!dto)
      dto = {
        answer1: "",
        answer2: "",
        answer3: "",
        answer4: "",
        answer5: "",
        answer6: "",
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
  }
}
