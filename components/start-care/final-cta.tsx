import { Button } from "@/components/ui/button"

const choices = [
  {
    title: "# 01 그냥 현상 유지하기",
    points: ["현재 상황 계속 유지", "경쟁업체와 격차 벌어짐", "마케팅 업체에 계속 비용 지출"],
  },
  {
    title: "# 02 혼자 해결책 찾아보기",
    points: ["수많은 정보 속에서 길 잃기", "몇 년간 시행착오 겪기", "효과적인 시스템 구축 실패"],
  },
  {
    title: "# 03 케어온 아카데미 참여하기",
    points: [
      "7년간 검증된 노하우 바로 적용하기",
      "효율적인 마케팅 시스템 갖추기",
      "평생 써먹는 마케팅 노하우 습득하기",
    ],
  },
]

export function FinalCta() {
  return (
    <section className="py-16 md:py-24 bg-teal-800 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-teal-600 font-semibold">케어온 아카데미 1:1 맞춤 교육</p>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">최종 선택의 시간입니다</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {choices.map((choice, index) => (
            <div key={index} className="bg-teal-700 p-8 rounded-lg">
              <p className="font-bold text-xl mb-4">{choice.title}</p>
              <ul className="space-y-2 text-teal-200">
                {choice.points.map((point, pIndex) => (
                  <li key={pIndex} className="flex items-start">
                    <span className="mr-2 mt-1">-</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="text-center">
          <a href="https://forms.gle/xUcRxNYcFnYGZjga7" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-white text-teal-800 hover:bg-gray-200 h-14 px-10 text-lg font-bold">
              케어온 아카데미 지금 바로 신청하기!
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}
