export interface WeeklyILearnedUser {
  object: "user";
  id: string;
}

export interface WeeklyILearnedRichText {
  type: "text";
  text: {
    content: string;
    link: string | null;
  };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  plain_text: string;
  href: string | null;
}

export interface WeeklyILearnedSelect {
  id: string;
  name: string;
  color: string;
}

export interface WeeklyILearnedMultiSelect {
  id: string;
  name: string;
  color: string;
}

export interface WeeklyILearnedIcon {
  type: "emoji";
  emoji: string;
}

export interface WeeklyILearnedParent {
  type: "database_id";
  database_id: string;
}

export interface WeeklyILearnedProperties {
  작성자: {
    id: string;
    type: "rich_text";
    rich_text: WeeklyILearnedRichText[];
  };
  "팀 이름": {
    id: string;
    type: "select";
    select: WeeklyILearnedSelect | null;
  };
  주차: {
    id: string;
    type: "select";
    select: WeeklyILearnedSelect | null;
  };
  직군: {
    id: string;
    type: "select";
    select: WeeklyILearnedSelect | null;
  };
  키워드: {
    id: string;
    type: "multi_select";
    multi_select: WeeklyILearnedMultiSelect[];
  };
  제목: {
    id: "title";
    type: "title";
    title: WeeklyILearnedRichText[];
  };
}

export interface WeeklyILearnedPage {
  object: "page";
  id: string;
  created_time: string;
  last_edited_time: string;
  created_by: WeeklyILearnedUser;
  last_edited_by: WeeklyILearnedUser;
  cover: any | null;
  icon: WeeklyILearnedIcon | null;
  parent: WeeklyILearnedParent;
  archived: boolean;
  in_trash: boolean;
  properties: WeeklyILearnedProperties;
  url: string;
  public_url: string | null;
}

export interface WeeklyILearnedPaginationQuery {
  page?: number;
  limit?: number;
  team?: string;
  week?: string;
  position?: string;
  keyword?: string;
  author?: string;
  sortBy?: "created_time" | "last_edited_time" | "제목";
  sortOrder?: "ascending" | "descending";
}

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

// 클라이언트용 간소화된 데이터 타입
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
