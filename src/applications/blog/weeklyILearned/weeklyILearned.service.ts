import { NotionService } from "@common/support/notion/notion.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class WeeklyILearnedService {
  constructor(private readonly notionService: NotionService) {}
}
