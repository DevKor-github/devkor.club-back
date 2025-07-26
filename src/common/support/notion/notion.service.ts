import { Config, CONFIG_DATABASE_ID } from "@common/support/notion/config";
import { NotionBlockFactory } from "@common/support/notion/notionBlock.factory";
import { NotionConfigManager } from "@common/support/notion/notionConfig.manager";
import {
  NotionDatabaseService,
  NotionDatabaseQueryResult,
} from "@common/support/notion/notionDatabase.service";
import { NotionPropertyFactory } from "@common/support/notion/notionProperty.factory";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";

import {
  Client,
  CreatePageResponse,
  GetPageResponse,
  UpdatePageResponse,
} from "@notionhq/client";
import { Cache } from "cache-manager";

import { NotionToMarkdown } from "notion-to-md";

@Injectable()
export class NotionService {
  notion = new Client({
    auth: process.env.NOTION_API_KEY,
  });

  constructor(
    private readonly propertyFactory: NotionPropertyFactory,
    private readonly blockFactory: NotionBlockFactory,
    private readonly databaseService: NotionDatabaseService,
    private readonly configManager: NotionConfigManager,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async getPageContentAsMarkdown(
    pageId: string
  ): Promise<{ content: string; coverImage: string | null }> {
    const n2m = new NotionToMarkdown({
      notionClient: this.notion,
    });

    n2m.setCustomTransformer("image", async (block: any) => {
      const { id, image } = block;
      if (!image) {
        return "";
      }

      let imageUrl = "";
      if (image.type === "external") {
        imageUrl = image.external.url;
      }

      if (image.type === "file") {
        const workspaceDomain = "devkor-official.notion.site";
        const url = image.file.url.split("?")[0];
        imageUrl = `https://${workspaceDomain}/image/${encodeURIComponent(
          url
        )}?table=block&id=${id}&cache=v2`;
      }

      if (imageUrl) {
        return `![image](${imageUrl})`;
      }
      return "";
    });

    const mdBlocks = await n2m.pageToMarkdown(pageId);

    let coverImage: string | null = null;
    const firstImageBlock = mdBlocks.find((block) => block.type === "image");
    if (firstImageBlock) {
      const imageUrlMatch = firstImageBlock.parent.match(/\(([^)]+)\)/);
      if (imageUrlMatch && imageUrlMatch[1]) {
        coverImage = imageUrlMatch[1];
      }
    }

    const content = n2m.toMarkdownString(mdBlocks).parent;

    return { content, coverImage };
  }

  async createPage(
    databaseId: string,
    properties: Record<string, any>,
    children?: Array<any>
  ): Promise<CreatePageResponse> {
    return await this.notion.pages.create({
      parent: { database_id: databaseId },
      properties,
      children: children || [],
    });
  }

  async updatePage(pageId: string, properties: Record<string, any>) {
    return await this.notion.pages.update({
      page_id: pageId,
      properties,
    });
  }

  async getPage(pageId: string): Promise<GetPageResponse> {
    return await this.notion.pages.retrieve({ page_id: pageId });
  }

  async deletePage(pageId: string): Promise<UpdatePageResponse> {
    return await this.notion.pages.update({
      page_id: pageId,
      archived: true,
    });
  }

  async retrieveBlockChildren(blockId: string) {
    return await this.notion.blocks.children.list({ block_id: blockId });
  }

  // Property factory methods delegation
  createTextProperty(content: string) {
    return this.propertyFactory.createTextProperty(content);
  }

  createTitleProperty(content: string) {
    return this.propertyFactory.createTitleProperty(content);
  }

  createNumberProperty(number: number) {
    return this.propertyFactory.createNumberProperty(number);
  }

  createSelectProperty(name: string) {
    return this.propertyFactory.createSelectProperty(name);
  }

  createMultiSelectProperty(names: string[]) {
    return this.propertyFactory.createMultiSelectProperty(names);
  }

  createCheckboxProperty(checked: boolean) {
    return this.propertyFactory.createCheckboxProperty(checked);
  }

  createDateProperty(start: string, end?: string) {
    return this.propertyFactory.createDateProperty(start, end);
  }

  createUrlProperty(url: string) {
    return this.propertyFactory.createUrlProperty(url);
  }

  createEmailProperty(email: string) {
    return this.propertyFactory.createEmailProperty(email);
  }

  createPhoneNumberProperty(phoneNumber: string) {
    return this.propertyFactory.createPhoneNumberProperty(phoneNumber);
  }

  // Block factory methods delegation
  createHeadingBlock(content: string, level: 1 | 2 | 3 = 2) {
    return this.blockFactory.createHeadingBlock(content, level);
  }

  createParagraphBlock(content: string) {
    return this.blockFactory.createParagraphBlock(content);
  }

  createBulletedListBlock(content: string) {
    return this.blockFactory.createBulletedListBlock(content);
  }

  createNumberedListBlock(content: string) {
    return this.blockFactory.createNumberedListBlock(content);
  }

  createToggleBlock(content: string, children: any[] = []) {
    return this.blockFactory.createToggleBlock(content, children);
  }

  createCodeBlock(content: string, language = "javascript") {
    return this.blockFactory.createCodeBlock(content, language);
  }

  createQuoteBlock(content: string) {
    return this.blockFactory.createQuoteBlock(content);
  }

  createCalloutBlock(content: string, icon = "💡") {
    return this.blockFactory.createCalloutBlock(content, icon);
  }

  createDividerBlock() {
    return this.blockFactory.createDividerBlock();
  }

  // Database service methods delegation
  async queryDatabase(
    databaseId: string,
    options: any = {}
  ): Promise<NotionDatabaseQueryResult> {
    return this.databaseService.queryDatabase(databaseId, options);
  }

  async getAllPages(databaseId: string, options: any = {}) {
    return this.databaseService.getAllPages(databaseId, options);
  }

  async getPagesByProperty(
    databaseId: string,
    propertyName: string,
    value: string | number | boolean,
    options: any = {}
  ) {
    return this.databaseService.getPagesByProperty(
      databaseId,
      propertyName,
      value,
      options
    );
  }

  async searchPages(
    databaseId: string,
    searchQuery: string,
    options: any = {}
  ) {
    return this.databaseService.searchPages(databaseId, searchQuery, options);
  }

  async getPageCount(databaseId: string, filter?: any) {
    return this.databaseService.getPageCount(databaseId, filter);
  }

  async getPaginatedPages(
    databaseId: string,
    page: number,
    limit: number,
    options: any = {}
  ) {
    return this.databaseService.getPaginatedPages(
      databaseId,
      page,
      limit,
      options
    );
  }

  createSortConfig(
    propertyName: string,
    direction: "ascending" | "descending" = "ascending"
  ) {
    return this.databaseService.createSortConfig(propertyName, direction);
  }

  createDateFilter(
    propertyName: string,
    operator: "equals" | "before" | "after" | "on_or_before" | "on_or_after",
    date: string
  ) {
    return this.databaseService.createDateFilter(propertyName, operator, date);
  }

  createSelectFilter(propertyName: string, value: string) {
    return this.databaseService.createSelectFilter(propertyName, value);
  }

  createMultiSelectFilter(propertyName: string, value: string) {
    return this.databaseService.createMultiSelectFilter(propertyName, value);
  }

  // Config service facade methods
  async getConfig(): Promise<Config> {
    const cachedConfig = await this.cacheManager.get<Config>("config");

    if (cachedConfig) {
      return cachedConfig;
    }

    try {
      // Config 데이터베이스에서 첫 번째 페이지 가져오기
      const pages = await this.getAllPages(CONFIG_DATABASE_ID);

      if (!pages || pages.length === 0) {
        throw new InternalServerErrorException(
          "Config 페이지를 찾을 수 없습니다."
        );
      }

      const configPage = pages[0];
      const pageContent = await this.getPageContentAsMarkdown(configPage.id);

      const config = this.configManager.parseConfigFromNotionPage(
        configPage,
        pageContent.content
      );

      await this.cacheManager.set("config", config, 60 * 60 * 1000);
      return config;
    } catch (error) {
      console.error("Config 로딩 중 오류 발생:", error);
      throw new InternalServerErrorException(
        `설정을 로드할 수 없습니다: ${error.message}`
      );
    }
  }

  async getQuestionsByPosition(position: string): Promise<string[]> {
    const config = await this.getConfig();
    return this.configManager.getQuestionsByPosition(config, position);
  }

  async isApplicationPeriodOpen(): Promise<boolean> {
    const config = await this.getConfig();
    return this.configManager.isApplicationPeriodOpen(config);
  }

  async isInterviewPeriodOpen(): Promise<boolean> {
    const config = await this.getConfig();
    return this.configManager.isInterviewPeriodOpen(config);
  }
}
