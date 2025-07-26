import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Config, CONFIG_PROPERTY_MAPPING } from "./config";
import dayjs from "dayjs";

@Injectable()
export class NotionConfigManager {
  parseConfigFromNotionPage(configPage: any, pageContent: string): Config {
    try {
      const properties = configPage.properties;

      // Notion 속성을 영어 속성명으로 변환
      const config: Partial<Config> = {};

      for (const [englishKey, koreanKey] of Object.entries(
        CONFIG_PROPERTY_MAPPING
      )) {
        const property = properties[koreanKey];

        if (!property) {
          // 질문 속성은 페이지 내용에서 파싱하므로 경고하지 않음
          if (!koreanKey.includes("질문")) {
            console.warn(`속성을 찾을 수 없습니다: ${koreanKey}`);
          }
          continue;
        }

        // 속성 타입에 따라 값 추출
        if (property.type === "date" && property.date) {
          config[englishKey as keyof Config] = property.date.start;
        } else if (
          property.type === "rich_text" &&
          property.rich_text.length > 0
        ) {
          config[englishKey as keyof Config] = property.rich_text[0].plain_text;
        } else if (property.type === "title" && property.title.length > 0) {
          config[englishKey as keyof Config] = property.title[0].plain_text;
        } else if (property.type === "multi_select") {
          config[englishKey as keyof Config] = property.multi_select.map(
            (item) => item.name
          );
        } else {
          console.warn(`지원하지 않는 속성 타입입니다: ${property.type}`);
        }
      }

      // 질문 데이터는 페이지 내용에서 파싱
      const questions = this.parseQuestionsFromContent(pageContent);

      config.feQuestions = questions.fe;
      config.beQuestions = questions.be;
      config.pmQuestions = questions.pm;
      config.pdQuestions = questions.pd;

      // 필수 속성 검증 (질문 제외)
      const requiredKeys = Object.keys(CONFIG_PROPERTY_MAPPING).filter(
        (key) => !key.includes("Questions")
      );
      const missingKeys = requiredKeys.filter((key) => !(key in config));

      if (missingKeys.length > 0) {
        throw new InternalServerErrorException(
          `필수 설정이 누락되었습니다: ${missingKeys.join(", ")}`
        );
      }

      return config as Config;
    } catch (error) {
      console.error("Config 파싱 중 오류 발생:", error);
      throw new InternalServerErrorException(
        `설정을 파싱할 수 없습니다: ${error.message}`
      );
    }
  }

  private parseQuestionsFromContent(content: string): {
    fe: string[];
    be: string[];
    pm: string[];
    pd: string[];
  } {
    const questions = {
      fe: [] as string[],
      be: [] as string[],
      pm: [] as string[],
      pd: [] as string[],
    };

    const lines = content.split("\n");
    let currentSection = "";
    let currentQuestions: string[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();

      // 섹션 헤더 확인
      if (trimmedLine.includes("<FE 질문>")) {
        if (currentSection && currentQuestions.length > 0) {
          this.assignQuestionsToSection(
            questions,
            currentSection,
            currentQuestions
          );
        }
        currentSection = "fe";
        currentQuestions = [];
      } else if (trimmedLine.includes("<BE 질문>")) {
        if (currentSection && currentQuestions.length > 0) {
          this.assignQuestionsToSection(
            questions,
            currentSection,
            currentQuestions
          );
        }
        currentSection = "be";
        currentQuestions = [];
      } else if (trimmedLine.includes("<PM 질문>")) {
        if (currentSection && currentQuestions.length > 0) {
          this.assignQuestionsToSection(
            questions,
            currentSection,
            currentQuestions
          );
        }
        currentSection = "pm";
        currentQuestions = [];
      } else if (trimmedLine.includes("<PD 질문>")) {
        if (currentSection && currentQuestions.length > 0) {
          this.assignQuestionsToSection(
            questions,
            currentSection,
            currentQuestions
          );
        }
        currentSection = "pd";
        currentQuestions = [];
      } else if (trimmedLine.includes("</") && trimmedLine.includes("질문>")) {
        // 섹션 종료
        if (currentSection && currentQuestions.length > 0) {
          this.assignQuestionsToSection(
            questions,
            currentSection,
            currentQuestions
          );
        }
        currentSection = "";
        currentQuestions = [];
      } else if (currentSection && trimmedLine.match(/^\d+\./)) {
        // 번호가 매겨진 질문 라인
        const question = trimmedLine.replace(/^\d+\.\s*/, "").trim();
        if (question) {
          currentQuestions.push(question);
        }
      }
    }

    // 마지막 섹션 처리
    if (currentSection && currentQuestions.length > 0) {
      this.assignQuestionsToSection(
        questions,
        currentSection,
        currentQuestions
      );
    }

    return questions;
  }

  private assignQuestionsToSection(
    questions: any,
    section: string,
    questionList: string[]
  ) {
    if (section === "fe") {
      questions.fe = [...questionList];
    } else if (section === "be") {
      questions.be = [...questionList];
    } else if (section === "pm") {
      questions.pm = [...questionList];
    } else if (section === "pd") {
      questions.pd = [...questionList];
    }
  }

  getQuestionsByPosition(config: Config, position: string): string[] {
    switch (position.toUpperCase()) {
      case "FE":
        return config.feQuestions;
      case "BE":
        return config.beQuestions;
      case "PM":
        return config.pmQuestions;
      case "PD":
        return config.pdQuestions;
      default:
        throw new InternalServerErrorException(
          `지원하지 않는 포지션입니다: ${position}`
        );
    }
  }

  isApplicationPeriodOpen(config: Config): boolean {
    try {
      const now = dayjs();
      const fromDate = this.parseDate(config.applicationPeriodFrom);
      const toDate = this.parseDate(config.applicationPeriodTo);

      return now >= fromDate && now <= toDate;
    } catch (error) {
      console.error("지원 기간 확인 중 오류:", error);
      return false;
    }
  }

  isInterviewPeriodOpen(config: Config): boolean {
    try {
      const now = dayjs();
      const fromDate = this.parseDate(config.interviewPeriodFrom);
      const toDate = this.parseDate(config.interviewPeriodTo);

      return now >= fromDate && now <= toDate;
    } catch (error) {
      console.error("면접 기간 확인 중 오류:", error);
      return false;
    }
  }

  private parseDate(dateString: string): dayjs.Dayjs {
    // Notion에서 오는 날짜 형식 처리 (YYYY-MM-DD)
    if (dateString && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dayjs(dateString);
    }

    // ISO 형식 처리
    if (dateString && dateString.includes("T")) {
      return dayjs(dateString);
    }

    throw new InternalServerErrorException(
      `잘못된 날짜 형식입니다: ${dateString}`
    );
  }
}
