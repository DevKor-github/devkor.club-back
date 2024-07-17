import { IsOptional, IsString, IsUrl } from "class-validator";
import { ApplyBaseDto } from "./applyBase.dto";

export class BackendApplyRequestDto extends ApplyBaseDto {
  @IsString()
  answer1!: string;
  @IsUrl({ require_protocol: true })
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
  @IsString()
  answer8!: string;
  @IsOptional()
  @IsUrl()
  answer9?: string;
}
