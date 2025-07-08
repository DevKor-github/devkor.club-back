import {
  type position,
  createAnswerMap,
  deriveName,
} from "@/common/shared/util/question";
import { Injectable } from "@nestjs/common";
import { Client } from "@notionhq/client";
@Injectable()
export class NotionService {
  notion = new Client({
    auth: process.env.NOTION_API_KEY,
  });

  dbIdMap: Record<position, string> = {
    PD: "18f156c7df6280ae85b0d2e34d7a7503",
    "FE 개발자": "18f156c7df6280179eb9e0a11254b904",
    "BE 개발자": "18f156c7df6280bcb196c510b26d9c0a",
    PM: "18f156c7df6280afaec3e96c09200464",
  };

  async saveAnswer(type: position, answer: Array<string>) {
    return await this.notion.pages.create({
      parent: { database_id: this.dbIdMap[type] },
      properties: this.createProperties(type, answer),
      children: this.createChildren(type, answer),
    });
  }

  createProperties(type: position, answer: Array<string>) {
    const result = {
      page: {
        title: [
          {
            text: { content: deriveName(answer) },
          },
        ],
      },
    };

    const answerMap = createAnswerMap(type, answer);
    for (const [key, value] of Object.entries(answerMap)) {
      result[key] = {
        type: "rich_text",
        rich_text: [
          {
            type: "text",
            text: {
              content: value,
            },
          },
        ],
      };
    }
    return result;
  }

  createChildren(type: position, answer: Array<string>) {
    const result = [];
    const answerMap = createAnswerMap(type, answer);
    for (const [key, value] of Object.entries(answerMap)) {
      result.push(
        {
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [{ type: "text", text: { content: key } }],
          },
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: value,
                },
              },
            ],
          },
        }
      );
    }
    return result;
  }
}
