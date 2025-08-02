"use client"

import { cn } from "@/lib/utils"

const scoreData = [
  {
    scoreRange: "6-12점",
    stage: "심각한 위기 단계",
    description:
      "마케팅에 대한 통제력을 \n상실한 상태입니다. \n\n매달 비용만 지출하고 방향성 없이 \n표류하고 있을 가능성이 높습니다. \n\n즉각적인 개선이 필요합니다.",
    isWarning: true,
  },
  {
    scoreRange: "13-18점",
    stage: "위기 주의 단계",
    description:
      "기본적인 마케팅은 진행 중이지만 \n효율성과 방향성의 점검이 \n필요합니다. \n\n마케팅 주도권 확보와 체계적인 \n접근이 필요합니다.",
    isWarning: true,
  },
  {
    scoreRange: "19-24점",
    stage: "안정 단계",
    description:
      "마케팅이 비교적 잘 관리되고 \n있지만, 최적화할 여지가 있습니다. \n\n확장 가능한 범위를 설정하고 \n다음 단계를 위한 액션이\n필요합니다.",
    isWarning: false,
  },
  {
    scoreRange: "25-30점",
    stage: "최적화 단계",
    description: "축하드립니다! \n\n마케팅이 매우 효과적으로\n운영되고 있습니다. \n\n이 페이지를 떠나주셔도 좋습니다.",
    isWarning: false,
  },
]

export function ScoreExplanation() {
  return (
    <section className="bg-[#030303] py-24 text-center">
      <div className="container mx-auto px-4">
        <p className="text-2xl font-medium text-gray-400 md:text-4xl">60점 이하라면,</p>
        <strong className="my-4 block text-5xl font-bold text-white md:my-6 md:text-7xl">1년 내 폐업</strong>
        <p className="text-2xl font-medium text-gray-400 md:text-4xl">
          <span className="font-bold text-white">위험</span>에 <span className="font-bold text-white">대비</span>해야
          합니다.
        </p>
      </div>
      <div className="container mx-auto px-4 mt-24">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {scoreData.map((item, index) => (
            <li
              key={index}
              className={cn(
                "bg-white rounded-xl p-8 shadow-md transition-shadow hover:shadow-xl",
                item.isWarning && "border-2 border-red-500/50",
              )}
            >
              <div className="mb-6">
                <strong className="block text-2xl font-bold text-[#916C1E]">{item.scoreRange}</strong>
                <p className="text-lg font-semibold mt-1 text-gray-800">{item.stage}</p>
              </div>
              <div>
                <p className="text-gray-600 whitespace-pre-line leading-relaxed">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
