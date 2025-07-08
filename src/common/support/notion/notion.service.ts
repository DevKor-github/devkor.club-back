import { Injectable } from "@nestjs/common";
import { Client } from "@notionhq/client";

@Injectable()
export class NotionService {
  notion = new Client({
    auth: process.env.NOTION_API_KEY,
  });

  async createPage(
    databaseId: string,
    properties: Record<string, any>,
    children?: Array<any>
  ) {
    return await this.notion.pages.create({
      parent: { database_id: databaseId },
      properties,
      children: children || [],
    });
  }

  createTextProperty(content: string) {
    return {
      type: "rich_text",
      rich_text: [
        {
          type: "text",
          text: {
            content,
          },
        },
      ],
    };
  }

  createTitleProperty(content: string) {
    return {
      title: [
        {
          text: { content },
        },
      ],
    };
  }

  createHeadingBlock(content: string, level: 1 | 2 | 3 = 2) {
    return {
      object: "block",
      type: `heading_${level}`,
      [`heading_${level}`]: {
        rich_text: [{ type: "text", text: { content } }],
      },
    };
  }

  createParagraphBlock(content: string) {
    return {
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            type: "text",
            text: {
              content,
            },
          },
        ],
      },
    };
  }
}
