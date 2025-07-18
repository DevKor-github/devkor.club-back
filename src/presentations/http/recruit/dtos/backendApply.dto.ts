import { ApplyBaseDto } from "@presentations/http/recruit/dtos/applyBase.dto";
import { IsOptional, IsString } from "class-validator";

export class BackendApplyRequestDto extends ApplyBaseDto {
  @IsString()
  answer1!: string;
  @IsOptional()
  @IsString()
  answer2?: string;

  @IsString()
  answer3!: string;
  @IsString()
  answer4!: string;
  @IsString()
  answer5!: string;
}
