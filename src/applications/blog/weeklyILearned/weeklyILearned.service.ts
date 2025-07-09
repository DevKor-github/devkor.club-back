import { NotionService } from "@common/support/notion/notion.service";
import { Injectable } from "@nestjs/common";
import {
  WeeklyILearnedPage,
  WeeklyILearnedPaginationQuery,
} from "@applications/blog/weeklyILearned/models/weeklyILearned.dto";
import {
  WeeklyILearnedSimplePaginationResult,
  WeeklyILearnedSimple,
  WeeklyILearnedPaginationInfo,
  WeeklyILearnedPaginationResult,
  WeeklyILearnedContentResult,
} from "@applications/blog/weeklyILearned/models/weeklyILearned.types";

@Injectable()
export class WeeklyILearnedService {
  constructor(private readonly notionService: NotionService) {}

  private readonly WEEKLY_I_LEARNED_DATABASE_ID =
    "1a11a845ed3e805c9a29de70277bdc1d";

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

  async getWeeklyILearnedContent(pageId: string): Promise<WeeklyILearnedContentResult> {
    const { results } = await this.notionService.retrieveBlockChildren(pageId);
    let coverImage: string | null = null;
    const content = results.map((block: any) => {
      const markdown = this.blockToMarkdown(block);
      if (block.type === 'image' && !coverImage) {
        if (block.image.type === 'external') {
          coverImage = block.image.external.url;
        } else if (block.image.type === 'file') {
          coverImage = block.image.file.url;
        }
      }
      return markdown;
    }).join("\n");

    return { content, coverImage };
  }

  private blockToMarkdown(block: any): string {
    const blockType = block.type;

    switch (blockType) {
      case "paragraph":
        return this.getRichTextContent(block.paragraph.rich_text);
      case "heading_1":
        return `# ${this.getRichTextContent(block.heading_1.rich_text)}`;
      case "heading_2":
        return `## ${this.getRichTextContent(block.heading_2.rich_text)}`;
      case "heading_3":
        return `### ${this.getRichTextContent(block.heading_3.rich_text)}`;
      case "bulleted_list_item":
        return `* ${this.getRichTextContent(block.bulleted_list_item.rich_text)}`;
      case "numbered_list_item":
        return `1. ${this.getRichTextContent(block.numbered_list_item.rich_text)}`;
      case "quote":
        return `> ${this.getRichTextContent(block.quote.rich_text)}`;
      case "code":
        return `\`\`\`${block.code.language}\n${this.getRichTextContent(block.code.rich_text)}\n\`\`\``;
      case "image":
        const imageUrl = block.image.type === 'external' ? block.image.external.url : block.image.file.url;
        return `![image](${imageUrl})`;
      default:
        return "";
    }
  }

  private getRichTextContent(richText: any[]): string {
    if (!richText) {
      return "";
    }
    return richText.map((t: any) => t.plain_text).join("");
  }

  async getPaginatedWeeklyILearned(
    query: WeeklyILearnedPaginationQuery
  ): Promise<WeeklyILearnedPaginationResult> {
    const {
      page = 1,
      limit = 10,
      team,
      week,
      position,
      keyword,
      author,
      sortBy = "created_time",
      sortOrder = "descending",
      startDate,
    } = query;

    // 필터 생성
    const filters = this.createFilters({
      team,
      week,
      position,
      keyword,
      author,
      startDate,
    });

    // 정렬 설정 - 시스템 속성과 일반 속성 구분
    const sorts = [this.createSortConfig(sortBy, sortOrder)];

    // 페이징 조회
    const result = await this.notionService.getPaginatedPages(
      this.WEEKLY_I_LEARNED_DATABASE_ID,
      page,
      limit,
      { filter: filters, sorts }
    );

    // 상세한 페이징 정보 생성
    const paginationInfo = this.createPaginationInfo(
      result.totalCount,
      result.currentPage,
      limit
    );

    return {
      pages: result.pages as WeeklyILearnedPage[],
      pagination: paginationInfo,
      filters: { team, week, position, keyword, author },
    };
  }

  async getPaginatedWeeklyILearnedSimple(
    query: WeeklyILearnedPaginationQuery
  ): Promise<WeeklyILearnedSimplePaginationResult> {
    const result = await this.getPaginatedWeeklyILearned(query);

    const items = result.pages.map((page) => this.convertToSimple(page));

    return {
      items,
      pagination: result.pagination,
      filters: result.filters,
    };
  }

  private createPaginationInfo(
    totalCount: number,
    currentPage: number,
    pageSize: number
  ): WeeklyILearnedPaginationInfo {
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNext = currentPage < totalPages;
    const hasPrev = currentPage > 1;
    const nextPage = hasNext ? currentPage + 1 : null;
    const prevPage = hasPrev ? currentPage - 1 : null;

    // 페이지 네비게이션 번호들 생성 (현재 페이지 주변 5개씩)
    const pageNumbers = this.generatePageNumbers(currentPage, totalPages);

    // 현재 페이지의 데이터 범위
    const startIndex = (currentPage - 1) * pageSize + 1;
    const endIndex = Math.min(currentPage * pageSize, totalCount);

    return {
      totalCount,
      currentPage,
      totalPages,
      hasNext,
      hasPrev,
      nextPage,
      prevPage,
      pageNumbers,
      pageSize,
      startIndex,
      endIndex,
    };
  }

  private generatePageNumbers(
    currentPage: number,
    totalPages: number
  ): number[] {
    const delta = 2; // 현재 페이지 좌우로 보여줄 페이지 수
    const range = [];
    const rangeWithDots = [];

    // 시작과 끝 페이지 계산
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);

    // 1부터 시작 페이지까지
    if (start > 1) {
      range.push(1);
      if (start > 2) {
        range.push(-1); // -1은 "..." 을 의미
      }
    }

    // 현재 페이지 주변
    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    // 끝 페이지부터 마지막까지
    if (end < totalPages) {
      if (end < totalPages - 1) {
        range.push(-1); // -1은 "..." 을 의미
      }
      range.push(totalPages);
    }

    // -1 (dots) 제거하고 실제 페이지 번호만 반환
    return range.filter((page) => page > 0);
  }

  private createSortConfig(
    sortBy: "created_time" | "last_edited_time" | "제목",
    sortOrder: "ascending" | "descending"
  ) {
    // 시스템 속성들은 timestamp로 정렬
    if (sortBy === "created_time" || sortBy === "last_edited_time") {
      return {
        timestamp: sortBy,
        direction: sortOrder,
      };
    }

    // 일반 속성들은 property로 정렬
    return {
      property: sortBy,
      direction: sortOrder,
    };
  }

  private createFilters(filters: {
    team?: string;
    week?: string;
    position?: string;
    keyword?: string;
    author?: string;
    startDate?: string;
  }) {
    const filterConditions = [];

    if (filters.team) {
      filterConditions.push(
        this.notionService.createSelectFilter("팀 이름", filters.team)
      );
    }

    if (filters.week) {
      filterConditions.push(
        this.notionService.createSelectFilter("주차", filters.week)
      );
    }

    if (filters.position) {
      filterConditions.push(
        this.notionService.createSelectFilter("직군", filters.position)
      );
    }

    if (filters.keyword) {
      filterConditions.push(
        this.notionService.createMultiSelectFilter("키워드", filters.keyword)
      );
    }

    if (filters.author) {
      filterConditions.push({
        property: "작성자",
        rich_text: {
          contains: filters.author,
        },
      });
    }

    if (filters.startDate) {
      filterConditions.push({
        timestamp: "last_edited_time",
        last_edited_time: {
          on_or_after: filters.startDate,
        },
      });
    }

    // 여러 필터가 있을 경우 AND 조건으로 결합
    if (filterConditions.length === 0) {
      return undefined;
    } else if (filterConditions.length === 1) {
      return filterConditions[0];
    } else {
      return {
        and: filterConditions,
      };
    }
  }

  private convertToSimple(page: WeeklyILearnedPage): WeeklyILearnedSimple {
    let coverImage: string | null = null;
    if (page.cover) {
      if (page.cover.type === "external") {
        coverImage = page.cover.external.url;
      } else if (page.cover.type === "file") {
        coverImage = page.cover.file.url;
      }
    }

    return {
      id: page.id,
      title: page.properties["제목"].title[0]?.plain_text || "제목 없음",
      author:
        page.properties["작성자"].rich_text[0]?.plain_text || "작성자 없음",
      team: page.properties["팀 이름"].select?.name || null,
      week: page.properties["주차"].select?.name || null,
      position: page.properties["직군"].select?.name || null,
      keywords: page.properties["키워드"].multi_select.map((item) => item.name),
      createdTime: page.created_time,
      lastEditedTime: page.last_edited_time,
      url: page.url,
      coverImage,
    };
  }
}
