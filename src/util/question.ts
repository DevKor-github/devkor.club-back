const PM_QUESTIONS = ["질문1"];

export type position = "PM" | "FE 개발자" | "BE 개발자" | "디자이너";

export const QUESTION_MAP: Record<position, Array<string>> = {
  PM: PM_QUESTIONS,
  "BE 개발자": [],
  "FE 개발자": [],
  디자이너: [],
};

export function createAnswerMap(position: position, answers: Array<string>) {
  const result: Record<string, string> = {};
  const questions = QUESTION_MAP[position];

  if (questions.length !== answers.length) {
    throw new Error("질문과 답변의 개수가 일치하지 않습니다.");
  }

  questions.forEach((question, index) => {
    result[question] = answers[index];
  });

  return result;
}

export function deriveName(answers: Array<string>) {
  return answers[0];
}
