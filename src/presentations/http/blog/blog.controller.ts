import { BlogService } from "@applications/blog/blog.service";
import { WeeklyILearnedPaginationQuery } from "@applications/blog/weeklyILearned/weeklyILearned.types";
import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

@Controller("blog")
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @ApiOperation({ summary: "주간 배운 것 페이지네이션 조회" })
  @Get("weekly-i-learned")
  async getWeeklyILearnedPaginated(
    @Query() query: WeeklyILearnedPaginationQuery
  ) {
    return this.blogService.getWeeklyILearnedPaginated(query);
  }
}
