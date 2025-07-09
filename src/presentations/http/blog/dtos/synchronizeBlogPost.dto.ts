import { OuterSource } from "@common/shared/enums/outerSource.enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsISO8601, IsString } from "class-validator";

export class SyncBlogPostRequest {
  @ApiProperty({
    description: "The start date of the weekly i learned (ISO 8601 format)",
    example: "2025-01-01T00:00:00.000Z",
  })
  @IsISO8601()
  @IsString()
  startDate: string;

  @ApiProperty({
    description: "The type of the blog post",
    example: OuterSource.WEEKLY_I_LEARNED,
    enum: OuterSource,
  })
  @IsEnum(OuterSource)
  type: OuterSource;
}
