import { ApiProperty } from "@nestjs/swagger";
import { IsISO8601, IsString } from "class-validator";

export class SynchronizeWeeklyILearnedRequest {
  @ApiProperty({
    description: "The start date of the weekly i learned (ISO 8601 format)",
    example: "2025-01-01T00:00:00.000Z",
  })
  @IsISO8601()
  @IsString()
  startDate: string;
}
