import { z } from "zod";

export const CONFIG_DATABASE_ID = "23c1a845ed3e80c08df4d2f8ade23763";

export const CONFIG_SCHEMA = z.object({
  applicationPeriod: z.object({
    start: z.string(),
    end: z.string(),
  }),
  documentResultAnnouncement: z.string(),
  interview: z.object({
    start: z.string(),
    end: z.string(),
    timeSlots: z.string().array(),
  }),
  finalResultAnnouncement: z.string(),
  feQuestions: z.string().array(),
  beQuestions: z.string().array(),
  pmQuestions: z.string().array(),
  pdQuestions: z.string().array(),
});

export type Config = z.infer<typeof CONFIG_SCHEMA>;

// Notion 데이터베이스의 원본 한국어 속성명과 매핑
export const CONFIG_PROPERTY_MAPPING = {
  applicationPeriod: "서류접수기간",
  interview: "면접심사기간",
  documentResultAnnouncement: "서류합격자발표",
  finalResultAnnouncement: "최종합격자발표",
  feQuestions: "FE 질문",
  beQuestions: "BE 질문",
  pmQuestions: "PM 질문",
  pdQuestions: "PD 질문",
} as const;
