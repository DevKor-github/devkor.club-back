const PM_QUESTIONS = ["질문1"];

export type position = "PM";

export const QUESTION_MAP: Record<position, Array<string>> = {
  PM: PM_QUESTIONS,
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
