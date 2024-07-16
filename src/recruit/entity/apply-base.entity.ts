import { Column,  PrimaryGeneratedColumn } from "typeorm";
import type { ApplyBaseDto } from "../dto/applyBase.dto";

export abstract class ApplyBase {
  @PrimaryGeneratedColumn({ name: "id" })
  id!: number;

  @Column({ name: "name" })
  name!: string;

  @Column({ name: "email" })
  email!: string;

  @Column({ name: "phone" })
  phone!: string;

  @Column({ name: "major" })
  major!: string;

  @Column({ name: "student_id" })
  studentId!: string;

  // bit
  // 01234 월
  // 56789 화
  // 10 11 12 13 14 수
  @Column({ name: "interview_time" })
  interviewTime!: number;

  constructor(dto: ApplyBaseDto) {
    this.name = dto.name;
    this.email = dto.email;
    this.phone = dto.phone;
    this.major = dto.major;
    this.studentId = dto.studentId;
    this.interviewTime = dto.interviewTime;
  }
}
