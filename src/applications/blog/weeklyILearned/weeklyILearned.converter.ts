import { WeeklyILearnedContentResult } from "@applications/blog/weeklyILearned/models/weeklyILearned.types";
import { Injectable } from "@nestjs/common";

@Injectable()
export class WeeklyILearnedMarkdownConverter {
  convertToContentResult(blocks: any[]): WeeklyILearnedContentResult {
    let coverImage: string | null = null;
    const content = blocks
      .map((block) => {
        const markdown = this.blockToMarkdown(block);
        if (!coverImage && block.type === "image") {
          const urlMatch = markdown.match(/\(([^)]+)\)/);
          if (urlMatch && urlMatch[1]) {
            coverImage = urlMatch[1];
          }
        }
        return markdown;
      })
      .join("\n\n");

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
        return `* ${this.getRichTextContent(
          block.bulleted_list_item.rich_text
        )}`;
      case "numbered_list_item":
        return `1. ${this.getRichTextContent(
          block.numbered_list_item.rich_text
        )}`;
      case "quote":
        return `> ${this.getRichTextContent(block.quote.rich_text)}`;
      case "code":
        return `\`\`\`${block.code.language}\n${this.getRichTextContent(
          block.code.rich_text
        )}\n\`\`\``;
      case "image": {
        const { id, image } = block;
        if (!image) {
          return "";
        }

        if (image.type === "external") {
          return `![image](${this.removeQueryParameters(image.external.url)})`;
        }

        if (image.type === "file") {
          const imageUrl = `https://www.notion.so/image/${encodeURIComponent(
            this.removeQueryParameters(image.file.url)
          )}?table=block&id=${id}&cache=v2`;
          return `![image](${imageUrl})`;
        }

        return "";
      }
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

  private removeQueryParameters(url: string): string {
    if (!url) {
      return "";
    }
    return url.split("?")[0];
  }
}
