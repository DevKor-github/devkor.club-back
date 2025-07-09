import { WeeklyILearnedPage } from "@applications/blog/weeklyILearned/models/weeklyILearned.dto";

export interface WeeklyILearnedPaginationInfo {
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

export interface WeeklyILearnedPaginationResult {
  pages: WeeklyILearnedPage[];
  pagination: WeeklyILearnedPaginationInfo;
  filters?: {
    team?: string;
    week?: string;
    position?: string;
    keyword?: string;
    author?: string;
  };
}

export interface WeeklyILearnedSimplePaginationResult {
  items: WeeklyILearnedSimple[];
  pagination: WeeklyILearnedPaginationInfo;
  filters?: {
    team?: string;
    week?: string;
    position?: string;
    keyword?: string;
    author?: string;
  };
}

export interface WeeklyILearnedSimple {
  id: string;
  title: string;
  author: string;
  team: string | null;
  week: string | null;
  position: string | null;
  keywords: string[];
  createdTime: string;
  lastEditedTime: string;
  url: string;
}
