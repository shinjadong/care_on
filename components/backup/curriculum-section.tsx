import Image from "next/image"

const steps = [
  {
    title: "사업 마케팅 정밀진단",
    description:
      "현재 사장님 사업장의 모든 마케팅 요소를 철저히 분석합니다. 모든 강점, 약점, 기회, 위협 요소를 도출하고 핵심 개선점을 발견합니다.",
    points: [
      "사업장 핵심 강점 및 차별화 요소 분석",
      "현재 마케팅 채널 효율성 평가",
      "지역 경쟁 환경 및 기회 요소 분석",
      "타겟 고객 여정 도출",
      "콘텐츠 품질 및 메시지 일관성 검토",
    ],
    imgSrc: "/placeholder.svg?height=806&width=1200",
  },
  {
    title: "맞춤형 전략 처방",
    description:
      "정밀 진단 결과를 바탕으로 사업장 맞춤형 마케팅 전략을 설계합니다. 가장 효과적인 차별화 포인트와 환자 타겟팅 방안을 제시합니다.",
    points: [
      "핵심 전문성 정의 및 브랜딩 전략",
      "타겟 고객 획득을 위한 채널별 접근법",
      "고수익 상품/서비스 전환율 향상을 위한 콘텐츠 기획",
      "마케팅 실행 캘린더 및 우선순위 설정",
    ],
    imgSrc: "/placeholder.svg?height=780&width=1200",
  },
  {
    title: "실행 지원 및 최적화",
    description: "이론에서 그치지 않고, 실제 결과가 나올 때까지 함께합니다. 결과를 측정하고 지속적으로 최적화합니다.",
    points: [
      "대면 컨설팅 총 3회",
      "주 3회 온라인 피드백 및 질의응답",
      "콘텐츠 기획 및 제작 실시간 피드백",
      "마케팅 성과 데이터 분석 및 전략 최적화",
      "발생하는 문제에 대한 즉각적 해결책 제시",
    ],
    imgSrc: "/placeholder.svg?height=806&width=1200",
  },
]

export function CurriculumSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-teal-600 font-semibold">케어온 아카데미 1:1 맞춤 교육</p>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            사업의 성장을 위한 <br />
            전문가의 맞춤 처방이 필요합니다
          </h2>
        </div>
        <div className="space-y-12 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-lg shadow-xl overflow-hidden">
              <Image
                src={step.imgSrc || "/placeholder.svg"}
                alt={step.title}
                width={1200}
                height={800}
                className="w-full h-auto"
              />
              <div className="p-8 md:p-12">
                <h3 className="text-2xl font-bold">{step.title}</h3>
                <div className="mt-4 text-gray-600">
                  <p className="font-semibold">{step.description}</p>
                  <p className="mt-4 font-semibold">[{index === 1 ? "전략 요소" : "지원 내용"}]</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {step.points.map((point, pIndex) => (
                      <li key={pIndex}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
