import type { position } from "./question";

export function deriveCompleteMessage(type: position, name: string) {
  return `안녕하세요, ${name}님! DevKor에 지원해주셔서 감사합니다.
${type} 지원서가 성공적으로 제출되었습니다.

앞으로의 DevKor 일정은 다음과 같습니다.

- 서류 발표: 7월 28일 (일)
- 면접: 7월 29일 (월) - 7월 31일 (수) (비대면)
- 최종 결과 발표: 8월 1일 (목)
- 합격자 OT: 8월 2일 (금)
- 정기 세션: 8월 5일 (월)부터 매주 월요일 19:00-21:00

면접은 서류 발표와 함께 안내될 예정이며, 10분 정도의 비대면 면접으로 진행됩니다.

다시 한 번 지원해주셔서 감사하다는 말씀 드리며, 면접 일정 안내를 기다려주세요!

DevKor 운영진 드림`;
}
