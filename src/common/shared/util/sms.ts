import type { position } from "./question";

export function deriveCompleteMessage(type: position, name: string) {
  return `안녕하세요, ${name}님! DevKor에 지원해주셔서 감사합니다.
${type} 지원서가 성공적으로 제출되었습니다.

앞으로의 DevKor 리크루팅 일정은 다음과 같습니다.

- 서류 발표: 2월 23일 (일)
- 면접: 2월 24일 (월) - 2월 26일 (수) (비대면)
- 최종 결과 발표: 2월 28일 (목)

면접은 서류 발표와 함께 안내될 예정이며, 선택하신 시간대내에서 10분 정도의 비대면 면접으로 진행됩니다.

다시 한 번 지원해주셔서 감사하다는 말씀 드리며, 면접 일정 안내를 기다려주세요!

DevKor 운영진 드림`;
}
