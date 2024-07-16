import { IsOptional, IsString, IsUrl } from "class-validator";
import { ApplyBaseDto } from "./applyBase.dto";

export class BackendApplyRequestDto extends ApplyBaseDto {
  @IsUrl({ protocols: ["https"], host_whitelist: ["github.com"] })
  answer1!: string;
  @IsString()
  answer2!: string;
  @IsString()
  answer3!: string;
  @IsString()
  answer4!: string;
  @IsString()
  answer5!: string;
  @IsOptional()
  @IsUrl({ require_protocol: true })
  answer6?: string;
  @IsOptional()
  @IsUrl({ require_protocol: true })
  answer7?: string;
}
