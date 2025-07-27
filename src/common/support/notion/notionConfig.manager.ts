import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Config, CONFIG_PROPERTY_MAPPING } from "@common/support/notion/config";
import {
  convertToISOString,
  convertToEndOfDayISOString,
  parseISODateToKoreanTime,
} from "@common/shared/util/dateConverter";
import dayjs from "dayjs";

@Injectable()
export class NotionConfigManager {
  /**
   * Notion 페이지에서 Config 객체로 파싱
   */
  parseConfigFromNotionPage(configPage: any, pageContent: string): Config {
    try {
      const config: Partial<Config> = {};

      this.parseNotionProperties(configPage.properties, config);
      this.parseQuestionsFromContent(pageContent, config);
      this.parseInterviewTimesFromContent(pageContent, config);
      this.validateRequiredProperties(config);

      return config as Config;
    } catch (error) {
      console.error("Config 파싱 중 오류 발생:", error);
      throw new InternalServerErrorException(
        `설정을 파싱할 수 없습니다: ${error.message}`
      );
    }
  }

  /**
   * 포지션별 질문 조회
   */
  getQuestionsByPosition(config: Config, position: string): string[] {
    const positionMap: Record<string, string[]> = {
      FE: config.feQuestions,
      BE: config.beQuestions,
      PM: config.pmQuestions,
      PD: config.pdQuestions,
    };

    const questions = positionMap[position.toUpperCase()];
    if (!questions) {
      throw new InternalServerErrorException(
        `지원하지 않는 포지션입니다: ${position}`
      );
    }

    return questions;
  }

  /**
   * 지원 기간 확인
   */
  isApplicationPeriodOpen(config: Config): boolean {
    return this.isPeriodOpen(config.applicationPeriod);
  }

  /**
   * 면접 기간 확인
   */
  isInterviewOpen(config: Config): boolean {
    return this.isPeriodOpen(config.interview);
  }

  // Private Methods

  private parseNotionProperties(
    properties: any,
    config: Partial<Config>
  ): void {
    for (const [englishKey, koreanKey] of Object.entries(
      CONFIG_PROPERTY_MAPPING
    )) {
      const property = properties[koreanKey];

      if (!property) {
        this.handleMissingProperty(koreanKey);
        continue;
      }

      this.parsePropertyByType(englishKey, property, config);
    }
  }

  private parsePropertyByType(
    englishKey: string,
    property: any,
    config: Partial<Config>
  ): void {
    const propertyParsers = {
      date: () => this.parseDateProperty(englishKey, property, config),
      rich_text: () => this.parseTextProperty(englishKey, property, config),
      title: () => this.parseTitleProperty(englishKey, property, config),
      multi_select: () =>
        this.parseMultiSelectProperty(englishKey, property, config),
    };

    const parser =
      propertyParsers[property.type as keyof typeof propertyParsers];
    if (parser) {
      parser();
    } else {
      console.warn(`지원하지 않는 속성 타입입니다: ${property.type}`);
    }
  }

  private parseDateProperty(
    englishKey: string,
    property: any,
    config: Partial<Config>
  ): void {
    if (!property.date) return;

    if (this.isDateRangeProperty(englishKey)) {
      const value = {
        start: convertToISOString(property.date.start),
        end: convertToEndOfDayISOString(
          property.date.end || property.date.start
        ),
      };

      if (englishKey === "interview") {
        config.interview = { ...value, timeSlots: [] };
      } else {
        config[englishKey as "applicationPeriod"] = value;
      }
    } else {
      config[englishKey as keyof Config] = convertToISOString(
        property.date.start
      ) as any;
    }
  }

  private parseTextProperty(
    englishKey: string,
    property: any,
    config: Partial<Config>
  ): void {
    if (property.rich_text?.length > 0) {
      config[englishKey as keyof Config] = property.rich_text[0]
        .plain_text as any;
    }
  }

  private parseTitleProperty(
    englishKey: string,
    property: any,
    config: Partial<Config>
  ): void {
    if (property.title?.length > 0) {
      config[englishKey as keyof Config] = property.title[0].plain_text as any;
    }
  }

  private parseMultiSelectProperty(
    englishKey: string,
    property: any,
    config: Partial<Config>
  ): void {
    config[englishKey as keyof Config] = property.multi_select.map(
      (item: any) => item.name
    ) as any;
  }

  private parseInterviewTimesFromContent(
    pageContent: string,
    config: Partial<Config>
  ): void {
    const lines = pageContent.split("\n");
    let isInsideBlock = false;
    let jsonBlockContent = "";

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (trimmedLine.includes("<면접 시간>")) {
        isInsideBlock = true;
        continue;
      }

      if (trimmedLine.includes("</면접 시간>")) {
        isInsideBlock = false;
        break; // End of block
      }

      if (isInsideBlock) {
        jsonBlockContent += `${line}\n`;
      }
    }

    if (jsonBlockContent) {
      const jsonMatch = jsonBlockContent.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          const interviewTimes: { date: string; times: string[] }[] =
            JSON.parse(jsonMatch[1]);
          if (config.interview) {
            config.interview.timeSlots = interviewTimes.flatMap(
              ({ date, times }) =>
                times.map((time) => {
                  const [hour, minute] = time.split(":").map(Number);
                  return dayjs
                    .tz(date.replace(/\./g, "-"), "Asia/Seoul")
                    .hour(hour)
                    .minute(minute)
                    .second(0)
                    .millisecond(0)
                    .utc()
                    .toISOString();
                })
            );
          }
        } catch (error) {
          console.error("면접 시간 JSON 파싱 중 오류 발생:", error);
          throw new InternalServerErrorException(
            "면접 시간 정보를 파싱할 수 없습니다."
          );
        }
      }
    }
  }

  private parseQuestionsFromContent(
    pageContent: string,
    config: Partial<Config>
  ): void {
    const questions = this.extractQuestionsFromMarkdown(pageContent);

    config.feQuestions = questions.fe;
    config.beQuestions = questions.be;
    config.pmQuestions = questions.pm;
    config.pdQuestions = questions.pd;
  }

  private extractQuestionsFromMarkdown(content: string) {
    const questions = { fe: [], be: [], pm: [], pd: [] };
    const lines = content.split("\n");
    let currentSection = "";
    let currentQuestions: string[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (this.isSectionHeader(trimmedLine)) {
        this.saveCurrentSection(questions, currentSection, currentQuestions);
        currentSection = this.extractSectionType(trimmedLine);
        currentQuestions = [];
      } else if (this.isSectionEnd(trimmedLine)) {
        this.saveCurrentSection(questions, currentSection, currentQuestions);
        currentSection = "";
        currentQuestions = [];
      } else if (this.isQuestionLine(trimmedLine, currentSection)) {
        const question = this.extractQuestionText(trimmedLine);
        if (question) currentQuestions.push(question);
      }
    }

    this.saveCurrentSection(questions, currentSection, currentQuestions);
    return questions;
  }

  private isPeriodOpen(period: { start: string; end: string }): boolean {
    try {
      const now = dayjs();
      const fromDate = parseISODateToKoreanTime(period.start, "start");
      const toDate = parseISODateToKoreanTime(period.end, "end");

      return now.isAfter(fromDate) && now.isBefore(toDate);
    } catch (error) {
      console.error("기간 확인 중 오류:", error);
      return false;
    }
  }

  // Utility Methods

  private isDateRangeProperty(englishKey: string): boolean {
    return englishKey === "applicationPeriod" || englishKey === "interview";
  }

  private handleMissingProperty(koreanKey: string): void {
    if (!koreanKey.includes("질문")) {
      console.warn(`속성을 찾을 수 없습니다: ${koreanKey}`);
    }
  }

  private isSectionHeader(line: string): boolean {
    return ["<FE 질문>", "<BE 질문>", "<PM 질문>", "<PD 질문>"].some((header) =>
      line.includes(header)
    );
  }

  private isSectionEnd(line: string): boolean {
    return line.includes("</") && line.includes("질문>");
  }

  private isQuestionLine(line: string, currentSection: string): boolean {
    return !!currentSection && !!line.match(/^\d+\./);
  }

  private extractSectionType(line: string): string {
    const sectionMap: Record<string, string> = {
      "<FE 질문>": "fe",
      "<BE 질문>": "be",
      "<PM 질문>": "pm",
      "<PD 질문>": "pd",
    };

    for (const [header, type] of Object.entries(sectionMap)) {
      if (line.includes(header)) return type;
    }
    return "";
  }

  private extractQuestionText(line: string): string {
    return line.replace(/^\d+\.\s*/, "").trim();
  }

  private saveCurrentSection(
    questions: any,
    section: string,
    questionList: string[]
  ): void {
    if (section && questionList.length > 0) {
      questions[section] = [...questionList];
    }
  }

  private validateRequiredProperties(config: Partial<Config>): void {
    const requiredKeys = Object.keys(CONFIG_PROPERTY_MAPPING).filter(
      (key) => !key.includes("Questions")
    );
    const missingKeys = requiredKeys.filter((key) => !(key in config));

    if (missingKeys.length > 0) {
      throw new InternalServerErrorException(
        `필수 설정이 누락되었습니다: ${missingKeys.join(", ")}`
      );
    }
  }
}
