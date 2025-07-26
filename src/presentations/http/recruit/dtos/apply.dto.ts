import { Position } from "@common/shared/enums/position.enum";
import { IsPhoneNumber } from "@common/shared/util/isPhoneNumber";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsArray,
  IsObject,
  IsString,
  Length,
  MinLength,
  Validate,
  IsISO8601,
} from "class-validator";

export class ApplyDto {
  @ApiProperty({
    description: "지원자 이름 (최소 2자 이상)",
    example: "홍길동",
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    description: "지원자 이메일 (이메일 형식)",
    example: "test@test.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "지원자 전화번호 ( /^01d-d{3,4}-d{4}$/ 형식)",
    example: "010-3335-7862",
  })
  @Validate(IsPhoneNumber)
  phone: string;

  @ApiProperty({
    description: "지원자 학과",
    example: "컴퓨터공학과",
  })
  @IsString()
  major: string;

  @ApiProperty({
    description: "지원자 포지션",
    example: Position.BE,
    enum: Position,
  })
  @IsString()
  position: Position;

  @ApiProperty({
    description: "지원자 학번 (10자리 숫자)",
    example: "2020123456",
  })
  @IsString()
  @Length(10, 10)
  studentId: string;

  @ApiProperty({
    description: "지원자 면접 일정 (ISO 8601 형식, 예: 2025-08-01T10:00:00Z)",
    example: ["2025-08-01T10:00:00Z", "2025-08-02T10:00:00Z"],
  })
  @IsArray()
  @IsISO8601({ strict: true }, { each: true })
  interviewTime: string[];

  @ApiProperty({
    description: "지원자 질의 응답",
    example: {
      "본인을 자유롭게 소개해주세요. (300자 내외)":
        "저는 컴퓨터공학과에서 다양한 프로젝트를 경험한 홍길동입니다.",
      "GitHub 링크를 입력해주세요.": "https://github.com/example",
      "진행했던 프로젝트 경험이 있다면 소개해주세요. 또, 그 프로젝트를 통해 무엇을 경험했는지 설명해주세요. 성능 개선이나 문제 해결과 관련된 경험이면 더 좋습니다.":
        "팀 프로젝트에서 성능 개선을 위해 코드 리팩토링을 진행한 경험이 있습니다.",
      "개발을 공부하고, DevKor에 지원한 계기에 대해서 서술해주세요.":
        "개발 역량을 키우고 싶어 DevKor에 지원하게 되었습니다.",
      "DevKor에서 성장하고 싶은 점에 대해서 작성해주세요":
        "협업과 실무 경험을 쌓으며 성장하고 싶습니다.",
    },
  })
  @IsObject()
  answer: Record<string, string>;
}
