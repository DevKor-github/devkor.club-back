import { ApiProperty } from "@nestjs/swagger";
import { PostInfo } from "@domains/post/models/post.info";
import { Position } from "@common/shared/enums/position.enum";

export class PostResponseModel {
  @ApiProperty({
    description: "포스트 고유 ID",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  id: string;

  @ApiProperty({
    description: "포스트 제목",
    example: "React Hooks 사용법",
  })
  title: string;

  @ApiProperty({
    description: "작성자 이름",
    example: "김개발",
  })
  author: string;

  @ApiProperty({
    description: "작성자 포지션",
    enum: Position,
    example: Position.FE,
  })
  position: Position;

  @ApiProperty({
    description: "포스트 태그 목록",
    type: [String],
    example: ["React", "JavaScript", "Frontend"],
  })
  tags: string[];

  @ApiProperty({
    description: "포스트 내용",
    example:
      "React Hooks는 함수형 컴포넌트에서 상태와 생명주기 기능을 사용할 수 있게 해주는 기능입니다...",
  })
  content: string;

  @ApiProperty({
    description: "포스트 커버 이미지 URL",
    example: "https://example.com/cover.jpg",
    nullable: true,
    type: String,
  })
  coverImageUrl: string | null;

  @ApiProperty({
    description: "포스트 조회수",
    example: 100,
  })
  viewCount: number;

  @ApiProperty({
    description: "생성 일시 (ISO 8601 형식)",
    example: "2024-01-15T10:30:00.000Z",
  })
  createdAt: string;

  @ApiProperty({
    description: "수정 일시 (ISO 8601 형식)",
    example: "2024-01-15T14:45:00.000Z",
  })
  updatedAt: string;

  constructor(
    id: string,
    title: string,
    author: string,
    position: Position,
    tags: string[],
    content: string,
    coverImageUrl: string | null,
    viewCount: number,
    createdAt: string,
    updatedAt: string
  ) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.position = position;
    this.tags = tags;
    this.content = content;
    this.coverImageUrl = coverImageUrl;
    this.viewCount = viewCount;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromPostInfo(postInfo: PostInfo): PostResponseModel {
    return new PostResponseModel(
      postInfo.id.getString(),
      postInfo.title,
      postInfo.author,
      postInfo.position,
      postInfo.tags,
      postInfo.content,
      postInfo.coverImageUrl,
      postInfo.viewCount,
      postInfo.createdAt.toISOString(),
      postInfo.updatedAt.toISOString()
    );
  }

  static fromPostInfoList(postInfoList: PostInfo[]): PostResponseModel[] {
    return postInfoList.map((postInfo) => this.fromPostInfo(postInfo));
  }
}
