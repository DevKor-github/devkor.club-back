import { Injectable, Logger } from "@nestjs/common";
import { Client } from "@notionhq/client";

export interface NotionDatabaseQueryOptions {
  filter?: any;
  sorts?: any[];
  startCursor?: string;
  pageSize?: number;
}

export interface NotionDatabaseQueryResult {
  results: any[];
  nextCursor: string | null;
  hasMore: boolean;
  totalCount?: number;
}

@Injectable()
export class NotionDatabaseService {
  private readonly notion = new Client({
    auth: process.env.NOTION_API_KEY,
  });
  private readonly logger = new Logger(this.constructor.name);

  async queryDatabase(
    databaseId: string,
    options: NotionDatabaseQueryOptions = {},
  ): Promise<NotionDatabaseQueryResult> {
    const { filter, sorts, startCursor, pageSize = 100 } = options;

    this.logger.log(`queryDatabase: ${databaseId}`);
    this.logger.log(`options: ${JSON.stringify(options)}`);

    const response = await this.notion.databases.query({
      database_id: databaseId,
      filter,
      sorts,
      start_cursor: startCursor,
      page_size: pageSize,
    });

    this.logger.log(`response: ${JSON.stringify(response)}`);

    return {
      results: response.results,
      nextCursor: response.next_cursor,
      hasMore: response.has_more,
    };
  }

  async getAllPages(
    databaseId: string,
    options: Omit<NotionDatabaseQueryOptions, "startCursor" | "pageSize"> = {},
  ): Promise<any[]> {
    const allPages = [];
    let startCursor: string | undefined;
    let hasMore = true;

    while (hasMore) {
      const response = await this.queryDatabase(databaseId, {
        ...options,
        startCursor,
        pageSize: 100,
      });

      allPages.push(...response.results);
      hasMore = response.hasMore;
      startCursor = response.nextCursor || undefined;
    }

    return allPages;
  }

  async getPagesByProperty(
    databaseId: string,
    propertyName: string,
    value: string | number | boolean,
    options: Omit<NotionDatabaseQueryOptions, "filter"> = {},
  ): Promise<NotionDatabaseQueryResult> {
    const filter = this.createPropertyFilter(propertyName, value);
    return this.queryDatabase(databaseId, { ...options, filter });
  }

  async searchPages(
    databaseId: string,
    searchQuery: string,
    options: Omit<NotionDatabaseQueryOptions, "filter"> = {},
  ): Promise<NotionDatabaseQueryResult> {
    const filter = {
      or: [
        {
          property: "title",
          title: {
            contains: searchQuery,
          },
        },
        {
          property: "Name",
          title: {
            contains: searchQuery,
          },
        },
      ],
    };

    return this.queryDatabase(databaseId, { ...options, filter });
  }

  async getPageCount(databaseId: string, filter?: any): Promise<number> {
    const allPages = await this.getAllPages(databaseId, { filter });
    return allPages.length;
  }

  async getPaginatedPages(
    databaseId: string,
    page: number,
    limit: number,
    options: Omit<NotionDatabaseQueryOptions, "startCursor" | "pageSize"> = {},
  ): Promise<{
    pages: any[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    const startTime = Date.now();
    const allPages = await this.getAllPages(databaseId, options);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPages = allPages.slice(startIndex, endIndex);

    const totalCount = allPages.length;
    const totalPages = Math.ceil(totalCount / limit);

    const processingTime = Date.now() - startTime;
    this.logger.log(`getPaginatedPages: ${processingTime}ms`);

    return {
      pages: paginatedPages,
      totalCount,
      currentPage: page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  private createPropertyFilter(
    propertyName: string,
    value: string | number | boolean,
  ) {
    if (typeof value === "string") {
      return {
        property: propertyName,
        rich_text: {
          contains: value,
        },
      };
    }

    if (typeof value === "number") {
      return {
        property: propertyName,
        number: {
          equals: value,
        },
      };
    }

    if (typeof value === "boolean") {
      return {
        property: propertyName,
        checkbox: {
          equals: value,
        },
      };
    }

    throw new Error(`Unsupported property type for value: ${value}`);
  }

  createSortConfig(
    propertyName: string,
    direction: "ascending" | "descending" = "ascending",
  ) {
    return {
      property: propertyName,
      direction,
    };
  }

  createDateFilter(
    propertyName: string,
    operator: "equals" | "before" | "after" | "on_or_before" | "on_or_after",
    date: string,
  ) {
    return {
      property: propertyName,
      date: {
        [operator]: date,
      },
    };
  }

  createSelectFilter(propertyName: string, value: string) {
    return {
      property: propertyName,
      select: {
        equals: value,
      },
    };
  }

  createMultiSelectFilter(propertyName: string, value: string) {
    return {
      property: propertyName,
      multi_select: {
        contains: value,
      },
    };
  }
}
