import { IsOptional, IsString, IsUrl } from "class-validator";
import { ApplyBaseDto } from "./applyBase.dto";

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
