import { IsOptional, IsString, IsUrl } from "class-validator";
import { ApplyBaseDto } from "./applyBase.dto";

export class FrontendApplyRequestDto extends ApplyBaseDto {
  @IsString()
  answer1!: string;
  @IsUrl()
  answer2!: string;
  @IsString()
  answer3!: string;
  @IsString()
  answer4!: string;
  @IsString()
  answer5!: string;
  @IsString()
  answer6!: string;
  @IsString()
  answer7!: string;
  @IsOptional()
  @IsUrl()
  answer8?: string;
}
