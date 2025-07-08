import { WeeklyILearnedService } from "@applications/blog/weeklyILearned/weeklyILearned.service";
import {
  WeeklyILearnedPaginationQuery,
  WeeklyILearnedSimplePaginationResult,
} from "@applications/blog/weeklyILearned/weeklyILearned.types";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BlogService {
  constructor(private readonly weeklyILearnedService: WeeklyILearnedService) {}

  async getWeeklyILearnedPaginated(
    query: WeeklyILearnedPaginationQuery
  ): Promise<WeeklyILearnedSimplePaginationResult> {
    return this.weeklyILearnedService.getPaginatedWeeklyILearnedSimple(query);
  }
}
