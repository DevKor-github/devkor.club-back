import {
  QUESTION_MAP,
  type position,
  createAnswerMap,
  deriveName,
} from "@/util/question";
import { Injectable, NotAcceptableException } from "@nestjs/common";
import { Client } from "@notionhq/client";
@Injectable()
export class NotionService {
  notion = new Client({
    auth: process.env.NOTION_API_KEY,
  });

  async saveAnswer(type: position, answer: Array<string>) {
    return await this.notion.pages.create({
      parent: { database_id: "17f156c7df62803db9ace70a8566ef1c" },
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
