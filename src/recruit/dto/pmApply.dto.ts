import { IsOptional, IsString, IsUrl } from "class-validator";
import { ApplyBaseDto } from "./applyBase.dto";

export class PmApplyRequestDto extends ApplyBaseDto {
  @IsString()
  answer1!: string;
  @IsString()
  answer2!: string;
  @IsString()
  answer3!: string;
  @IsString()
  answer4!: string;
  @IsString()
  answer5!: string;
}
