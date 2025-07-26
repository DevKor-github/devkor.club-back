import { ApiProperty } from "@nestjs/swagger";

export class QuestionsResponseDto {
  @ApiProperty({
    description: "포지션별 질문 목록",
    example: [
      "본인을 자유롭게 소개해주세요.",
      "GitHub 링크를 입력해주세요.",
      "진행했던 프로젝트 경험이 있다면 소개해주세요.",
    ],
  })
  questions: string[];
}
