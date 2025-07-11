import { IsPhoneNumber } from "@common/shared/util/isPhoneNumber";
import {
  IsEmail,
  IsInt,
  IsString,
  Length,
  MinLength,
  Validate,
} from "class-validator";
export abstract class ApplyBaseDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsEmail()
  email!: string;

  @Validate(IsPhoneNumber)
  phone!: string;

  @IsString()
  major!: string;

  @IsString()
  @Length(10, 10)
  studentId!: string;

  @IsInt()
  interviewTime!: number;
}
