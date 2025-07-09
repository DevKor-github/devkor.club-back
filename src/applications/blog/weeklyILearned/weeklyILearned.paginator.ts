import { Injectable } from "@nestjs/common";

export interface PaginationInfo {
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextPage: number | null;
  prevPage: number | null;
  pageNumbers: number[];
  pageSize: number;
  startIndex: number;
  endIndex: number;
}

@Injectable()
export class WeeklyILearnedPaginator {
  createPaginationInfo(
    totalCount: number,
    currentPage: number,
    pageSize: number
  ): PaginationInfo {
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNext = currentPage < totalPages;
    const hasPrev = currentPage > 1;
    const nextPage = hasNext ? currentPage + 1 : null;
    const prevPage = hasPrev ? currentPage - 1 : null;
    const pageNumbers = this.generatePageNumbers(currentPage, totalPages);
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
    const range: number[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift(-1); // "..."
    }
    if (currentPage + delta < totalPages - 1) {
      range.push(-1); // "..."
    }

    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return [...new Set(range)].filter((page) => page > 0);
  }
}
