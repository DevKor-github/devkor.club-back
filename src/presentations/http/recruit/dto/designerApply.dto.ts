import { ApplyBaseDto } from "@presentations/http/recruit/dto/applyBase.dto";
import { IsString } from "class-validator";

export class DesignerApplyRequestDto extends ApplyBaseDto {
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
  @IsString()
  answer6!: string;
  @IsString()
  answer7!: string;
}
