import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export const convertToISOString = (dateString: string): string => {
  if (!dateString) return "";

  // YYYY-MM-DD 형식을 한국시간 기준으로 ISO 문자열로 변환
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dayjs.tz(dateString, "Asia/Seoul").startOf("day").toISOString();
  }

  // 이미 ISO 형식이면 그대로 반환
  if (dateString.includes("T")) {
    return dateString;
  }

  return dateString;
};

export const convertToEndOfDayISOString = (dateString: string): string => {
  if (!dateString) return "";

  // YYYY-MM-DD 형식을 한국시간 기준 23:59:59로 ISO 문자열로 변환
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dayjs.tz(dateString, "Asia/Seoul").endOf("day").toISOString();
  }

  // 이미 ISO 형식이면 그대로 반환
  if (dateString.includes("T")) {
    return dateString;
  }

  return dateString;
};

export const parseISODateToKoreanTime = (
  dateString: string,
  type: "start" | "end"
): dayjs.Dayjs => {
  // ISO 형식 처리
  if (dateString && dateString.includes("T")) {
    return dayjs(dateString);
  }

  // YYYY-MM-DD 형식 처리 (fallback)
  if (dateString && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const parsed = dayjs.tz(dateString, "Asia/Seoul");
    return type === "end" ? parsed.endOf("day") : parsed.startOf("day");
  }

  throw new Error(`잘못된 날짜 형식입니다: ${dateString}`);
};
