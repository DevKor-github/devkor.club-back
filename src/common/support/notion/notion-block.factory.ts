import { Injectable } from "@nestjs/common";

@Injectable()
export class NotionBlockFactory {
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

  createBulletedListBlock(content: string) {
    return {
      object: "block",
      type: "bulleted_list_item",
      bulleted_list_item: {
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

  createNumberedListBlock(content: string) {
    return {
      object: "block",
      type: "numbered_list_item",
      numbered_list_item: {
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

  createToggleBlock(content: string, children: any[] = []) {
    return {
      object: "block",
      type: "toggle",
      toggle: {
        rich_text: [
          {
            type: "text",
            text: {
              content,
            },
          },
        ],
        children,
      },
    };
  }

  createCodeBlock(content: string, language = "javascript") {
    return {
      object: "block",
      type: "code",
      code: {
        rich_text: [
          {
            type: "text",
            text: {
              content,
            },
          },
        ],
        language,
      },
    };
  }

  createQuoteBlock(content: string) {
    return {
      object: "block",
      type: "quote",
      quote: {
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

  createCalloutBlock(content: string, icon = "💡") {
    return {
      object: "block",
      type: "callout",
      callout: {
        rich_text: [
          {
            type: "text",
            text: {
              content,
            },
          },
        ],
        icon: {
          type: "emoji",
          emoji: icon,
        },
      },
    };
  }

  createDividerBlock() {
    return {
      object: "block",
      type: "divider",
      divider: {},
    };
  }
}
