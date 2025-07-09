import { Page } from "@common/shared/core/page";
import { ApiProperty } from "@nestjs/swagger";
import { PostResponseModel } from "./post.response-model";

export class PostPageResponseModel extends Page<PostResponseModel> {
  @ApiProperty({ type: [PostResponseModel] })
  items: PostResponseModel[];

  @ApiProperty({ description: "전체 항목 수", example: 100 })
  total: number;

  @ApiProperty({ description: "현재 페이지 번호", example: 1 })
  page: number;

  @ApiProperty({ description: "페이지당 항목 수", example: 10 })
  size: number;
}
