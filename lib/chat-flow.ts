export type QuestionId = "locationType" | "serviceType" | "cameraCount" | "area" | "schedule" | "internet"

export type AnswerPayload = string | { indoor: number; outdoor: number }

export interface Question {
  id: QuestionId
  text: string
  type: "buttons" | "camera_count"
  options?: { label: string; value: string }[]
  next?: (value: AnswerPayload, answers: Record<string, any>) => QuestionId | null
}

export const questions: { id: QuestionId }[] = [
  { id: "locationType" },
  { id: "serviceType" },
  { id: "cameraCount" },
  { id: "area" },
  { id: "schedule" },
  { id: "internet" },
]

export const chatFlow: Record<QuestionId, Question> = {
  locationType: {
    id: "locationType",
    text: "어떤 장소에 CCTV 설치가 필요하세요?",
    type: "buttons",
    options: [
      { label: "소매점/매장", value: "소매점/매장" },
      { label: "주거시설", value: "주거시설" },
      { label: "사무실/업무시설", value: "사무실/업무시설" },
      { label: "교육시설", value: "교육시설" },
      { label: "의료시설", value: "의료시설" },
      { label: "공장/창고", value: "공장/창고" },
      { label: "주차장", value: "주차장" },
      { label: "기타", value: "기타" },
    ],
    next: () => "serviceType",
  },
  serviceType: {
    id: "serviceType",
    text: "어떤 서비스를 원하시나요?",
    type: "buttons",
    options: [
      { label: "구매 + 설치", value: "구매 + 설치" },
      { label: "설치만 (장비 보유)", value: "설치만" },
      { label: "기존 장비 수리/교체", value: "수리/교체" },
      { label: "상담 후 결정", value: "상담 후 결정" },
    ],
    next: () => "cameraCount",
  },
  cameraCount: {
    id: "cameraCount",
    text: "설치를 원하시는 카메라 수량을 알려주세요.",
    type: "camera_count",
    next: () => "area",
  },
  area: {
    id: "area",
    text: "설치할 장소의 면적이 어떻게 되나요?",
    type: "buttons",
    options: [
      { label: "10평 이하", value: "10평 이하" },
      { label: "10~30평", value: "10~30평" },
      { label: "30~50평", value: "30~50평" },
      { label: "51평 이상", value: "51평 이상" },
    ],
    next: () => "schedule",
  },
  schedule: {
    id: "schedule",
    text: "서비스 희망일을 선택해주세요.",
    type: "buttons",
    options: [
      { label: "가능한 빨리", value: "가능한 빨리" },
      { label: "날짜 지정 원해요", value: "날짜 지정" },
      { label: "상담 후 결정", value: "상담 후 결정" },
    ],
    next: () => "internet",
  },
  internet: {
    id: "internet",
    text: "설치 장소에 인터넷 사용이 가능한가요?\n(KT 결합 시 추가 할인이 제공됩니다)",
    type: "buttons",
    options: [
      { label: "예, 가능해요", value: "예" },
      { label: "아니요, 불가능해요", value: "아니요" },
      { label: "잘 모르겠어요", value: "모름" },
    ],
    next: () => null, // End of flow
  },
}
