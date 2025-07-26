import {
  WeeklyILearnedPage,
  WeeklyILearnedPaginationQuery,
} from "@applications/blog/weeklyILearned/models/weeklyILearned.dto";
import {
  WeeklyILearnedContentResult,
  WeeklyILearnedPaginationResult,
  WeeklyILearnedSimple,
  WeeklyILearnedSimplePaginationResult,
} from "@applications/blog/weeklyILearned/models/weeklyILearned.types";
import { NotionService } from "@common/support/notion/notion.service";
import { Injectable } from "@nestjs/common";

import { WeeklyILearnedMapper } from "@applications/blog/weeklyILearned/weeklyILearned.mapper";
import { WeeklyILearnedPaginator } from "@applications/blog/weeklyILearned/weeklyILearned.paginator";
@Injectable()
export class WeeklyILearnedService {
  constructor(
    private readonly notionService: NotionService,
    private readonly mapper: WeeklyILearnedMapper,
    private readonly paginator: WeeklyILearnedPaginator
  ) {}

  private readonly WEEKLY_I_LEARNED_DATABASE_ID =
    "1c61a845ed3e802b8435c96614262b82";

  async getAllWeeklyILearned(startDate: string): Promise<WeeklyILearnedPage[]> {
    let allPages: WeeklyILearnedPage[] = [];
    let hasMore = true;
    let page = 1;
    const limit = 100;

    while (hasMore) {
      const result = await this.getPaginatedWeeklyILearned({
        page,
        limit,
        startDate,
        sortBy: "last_edited_time",
        sortOrder: "ascending",
      });

      allPages = allPages.concat(result.pages);
      hasMore = result.pagination.hasNext;
      page++;
    }

    return allPages;
  }

  async getAllWeeklyILearnedSimple(
    startDate: string
  ): Promise<WeeklyILearnedSimple[]> {
    let allItems: WeeklyILearnedSimple[] = [];
    let hasMore = true;
    let page = 1;
    const limit = 100;

    while (hasMore) {
      const result = await this.getPaginatedWeeklyILearnedSimple({
        page,
        limit,
        startDate,
        sortBy: "last_edited_time",
        sortOrder: "ascending",
      });
      allItems = allItems.concat(result.items);
      hasMore = result.pagination.hasNext;
      page++;
    }

    return allItems;
  }

  async getPaginatedWeeklyILearned(
    query: WeeklyILearnedPaginationQuery
  ): Promise<WeeklyILearnedPaginationResult> {
    const {
      page = 1,
      limit = 10,
      sortBy = "created_time",
      sortOrder = "descending",
      ...filters
    } = query;

    const notionFilters = this.createFilters(filters);
    const sorts = [this.createSortConfig(sortBy, sortOrder)];
    const result = await this.notionService.getPaginatedPages(
      this.WEEKLY_I_LEARNED_DATABASE_ID,
      page,
      limit,
      { filter: notionFilters, sorts }
    );

    const paginationInfo = this.paginator.createPaginationInfo(
      result.totalCount,
      result.currentPage,
      limit
    );

    return {
      pages: result.pages as WeeklyILearnedPage[],
      pagination: paginationInfo,
      filters: filters,
    };
  }

  async getPaginatedWeeklyILearnedSimple(
    query: WeeklyILearnedPaginationQuery
  ): Promise<WeeklyILearnedSimplePaginationResult> {
    const result = await this.getPaginatedWeeklyILearned(query);
    const items = result.pages.map((page) => this.mapper.pageToSimple(page));

    return {
      items,
      pagination: result.pagination,
      filters: result.filters,
    };
  }

  async getWeeklyILearnedContent(
    pageId: string
  ): Promise<WeeklyILearnedContentResult> {
    return this.notionService.getPageContentAsMarkdown(pageId);
  }

  private createSortConfig(
    sortBy: "created_time" | "last_edited_time" | "제목",
    sortOrder: "ascending" | "descending"
  ) {
    if (sortBy === "created_time" || sortBy === "last_edited_time") {
      return { timestamp: sortBy, direction: sortOrder };
    }
    return { property: sortBy, direction: sortOrder };
  }

  private createFilters(filters: {
    team?: string;
    week?: string;
    position?: string;
    keyword?: string;
    author?: string;
    startDate?: string;
  }) {
    const filterConditions: any[] = [];
    if (filters.team)
      filterConditions.push(
        this.notionService.createSelectFilter("팀 이름", filters.team)
      );
    if (filters.week)
      filterConditions.push(
        this.notionService.createSelectFilter("주차", filters.week)
      );
    if (filters.position)
      filterConditions.push(
        this.notionService.createSelectFilter("직군", filters.position)
      );
    if (filters.keyword)
      filterConditions.push(
        this.notionService.createMultiSelectFilter("키워드", filters.keyword)
      );
    if (filters.author)
      filterConditions.push({
        property: "작성자",
        rich_text: { contains: filters.author },
      });
    if (filters.startDate)
      filterConditions.push({
        timestamp: "last_edited_time",
        last_edited_time: { on_or_after: filters.startDate },
      });

    if (filterConditions.length === 0) return undefined;
    if (filterConditions.length === 1) return filterConditions[0];
    return { and: filterConditions };
  }
}
