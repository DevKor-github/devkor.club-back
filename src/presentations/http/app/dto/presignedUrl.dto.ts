import { IsString } from "class-validator";
export abstract class CreateFileUploadPresignedUrlDto {
  @IsString()
  fileName!: string;
}
