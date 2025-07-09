const BASE_QUESTIONS = [
  "이름",
  "이메일",
  "휴대폰 번호",
  "학과",
  "학번",
  "면접 시간",
];

const FE_QUESTIONS = [
  "본인을 자유롭게 소개해주세요",
  "GitHub 링크를 입력해주세요.",
  "진행했던 프로젝트 경험이 있다면 소개해주세요. 또, 그 프로젝트를 통해 무엇을 경험했는지 설명해주세요.",
  "지원자분이 개발을 하는 이유와 본인이 생각하는 뛰어난 FE 개발자는 어떤 개발자인지 설명해주세요",
  "DevKor에서 성장하고 싶은 점에 대해서 작성해주세요",
];

const BE_QUESTIONS = [
  "본인을 자유롭게 소개해주세요.",

  "GitHub 링크를 입력해주세요",

  "진행했던 프로젝트 경험이 있다면 소개해주세요. 또, 그 프로젝트를 통해 무엇을 경험했는지 설명해주세요. 성능 개선이나 문제 해결과 관련된 경험이면 더 좋습니다.",

  "개발을 공부하고, DevKor에 지원한 계기에 대해서 서술해주세요.",

  "DevKor에서 어떤 백엔드 개발자로 성장하고싶은지 작성해주세요.",
];
const PD_QUESTIONS = [
  "본인을 자유롭게 소개해주세요",
  "과거에 디자인 했던 프로젝트나 경험에서 얻은 점 또는 아쉬웠던 점, 기억에 남는 점들을 위주로 서술해주세요",
  "가장 뛰어나다고 생각하는 본인의 능력을 서술해주세요",
  "새로운 프로젝트를 시작할 때 어떤 절차로 진행하는지 디자인 프로세스를 서술해주세요",
  "개발자, 프로젝트 매니저 등 다른 팀원과 협업할 때 중요하게 생각하는 가치와 갈등 상황에서 본인의 대처 방안을 서술해주세요",
  "DevKor에서 얻어가고 싶은 것들, 하고 싶은 활동들에 대해 서술해주세요",
  "포트폴리오를 첨부해주세요",
];
const PM_QUESTIONS = [
  "본인을 자유롭게 소개해주세요",
  "소프트웨어로 해결할 수 있는(또는 해결해야 하는) 세상의 문제가 무엇인지 이유와 함께 서술해주세요.",
  "협업 경험(특히 개발자와 디자이너)과 그 과정에서의 갈등관리 경험에 대해 서술해주세요.",
  "아이디어 구상부터 서비스 런칭, 그리고 서비스 개선까지의 전 과정에서 PM은 어떤 역할을 수행하는지 작성하고, 그 역할을 효과적으로 수행하기 위해 본인이 가진 경험, 강점, 능력을 구체적으로 적어주세요.",
  "DevKor 학회 활동을 통해 얻어가고자 하는 것들에 대해 서술해주세요.",
];

export type position = "PM" | "FE 개발자" | "BE 개발자" | "PD";

export const QUESTION_MAP: Record<position, Array<string>> = {
  PM: PM_QUESTIONS,
  "BE 개발자": BE_QUESTIONS,
  "FE 개발자": FE_QUESTIONS,
  PD: PD_QUESTIONS,
};

export function createAnswerMap(position: position, answers: Array<string>) {
  const result: Record<string, string> = {};
  const questions = BASE_QUESTIONS.concat(...QUESTION_MAP[position]);

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
