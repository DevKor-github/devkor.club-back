import { WeeklyILearnedPage } from "@applications/blog/weeklyILearned/models/weeklyILearned.dto";
import { WeeklyILearnedSimple } from "@applications/blog/weeklyILearned/models/weeklyILearned.types";
import { Injectable } from "@nestjs/common";

@Injectable()
export class WeeklyILearnedMapper {
  pageToSimple(page: WeeklyILearnedPage): WeeklyILearnedSimple {
    let coverImage: string | null = null;
    if (page.cover) {
      if (page.cover.type === "external") {
        coverImage = page.cover.external.url;
      } else if (page.cover.type === "file") {
        coverImage = page.cover.file.url;
      }
    }

    return {
      id: page.id,
      title: page.properties.제목.title[0]?.plain_text || "제목 없음",
      author: page.properties.작성자.rich_text[0]?.plain_text || "작성자 없음",
      team: page.properties["팀 이름"].select?.name || null,
      week: page.properties.주차.select?.name || null,
      position: page.properties.직군.select?.name || null,
      keywords: page.properties.키워드.multi_select.map((item) => item.name),
      createdTime: page.created_time,
      lastEditedTime: page.last_edited_time,
      url: page.url,
      coverImage,
    };
  }
}
