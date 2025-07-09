import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { Position } from "@common/shared/enums/position.enum";

export class GetPostsDto {
  @ApiProperty({
    description: "페이지 번호",
    example: 1,
    required: false,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({
    description: "페이지 크기",
    example: 10,
    required: false,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  size?: number;

  @ApiProperty({
    description: "포지션 필터",
    enum: Position,
    example: Position.BE,
    required: false,
  })
  @IsOptional()
  @IsEnum(Position)
  position?: Position;

  @ApiProperty({
    description:
      "태그 필터 (복수 입력, 하나라도 포함되면 조회) ex: ?tags=NestJS&tags=React or tags=NestJS,React",
    required: false,
    example: ["Spring", "Kotlin", "NestJS"],
  })
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (value === null || value === undefined || value === "") {
      return undefined;
    }
    if (typeof value === "string") {
      return value.split(",");
    }
    return value;
  })
  tags?: string[];
}
