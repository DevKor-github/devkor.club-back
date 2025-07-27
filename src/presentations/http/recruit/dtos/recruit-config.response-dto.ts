import { ApiProperty } from "@nestjs/swagger";

export class RecruitPeriodDto {
  @ApiProperty({
    description: "시작 날짜 (ISO 8601 형식)",
    example: "2025-08-01T00:00:00.000Z",
  })
  start: string;

  @ApiProperty({
    description: "종료 날짜 (ISO 8601 형식)",
    example: "2025-08-14T23:59:59.999Z",
  })
  end: string;
}

export class InterviewDto {
  @ApiProperty({
    description: "면접 시작 날짜 (ISO 8601 형식)",
    example: "2025-08-01T00:00:00.000Z",
  })
  start: string;

  @ApiProperty({
    description: "면접 종료 날짜 (ISO 8601 형식)",
    example: "2025-08-14T23:59:59.999Z",
  })
  end: string;

  @ApiProperty({
    description: "면접 시간 목록",
    example: ["10:00", "11:00", "12:00"],
  })
  timeSlots: string[];
}

export class RecruitConfigResponseDto {
  @ApiProperty({
    description: "지원 기간",
    type: RecruitPeriodDto,
  })
  applicationPeriod: RecruitPeriodDto;

  @ApiProperty({
    description: "서류 합격자 발표 날짜 (ISO 8601 형식)",
    example: "2025-08-16T00:00:00.000Z",
  })
  documentResultAnnouncement: string;

  @ApiProperty({
    description: "면접 기간",
    type: InterviewDto,
  })
  interview: InterviewDto;

  @ApiProperty({
    description: "최종 합격자 발표 날짜 (ISO 8601 형식)",
    example: "2025-08-21T00:00:00.000Z",
  })
  finalResultAnnouncement: string;

  @ApiProperty({
    description: "현재 지원 기간 여부",
    example: true,
  })
  isApplicationPeriodOpen: boolean;

  @ApiProperty({
    description: "현재 면접 기간 여부",
    example: false,
  })
  isInterviewPeriodOpen: boolean;
}
