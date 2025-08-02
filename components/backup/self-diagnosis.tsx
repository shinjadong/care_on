"use client"

import { useState, useMemo } from "react"

const questions = [
  { id: "price", text: "현재 마케팅 비용이 성과로 연결되고 있나요?" },
  { id: "what", text: "대행사가 무엇을 하는지 정확히 알고 계시나요?" },
  { id: "check", text: "마케팅 성과를 객관적으로 측정할 수 있나요?" },
  {
    id: "dir",
    text: "마케팅 방향에 대한 주도권을 갖고 계시나요?",
    subtext: "(마케팅의 주도권은 가지고 있지만, 방향을 모른다면 1점입니다.)",
  },
  { id: "enter", text: "원하는 고수익 상품/서비스를 선호하는 고객이 꾸준히 유입되나요?" },
  { id: "differ", text: "경쟁 업체와의 차별점이 고객들에게 명확히 전달되고 있나요?" },
]

const scoreInfo = [
  {
    range: [20, 40],
    title: "심각한 위기 단계",
    description:
      "마케팅에 대한 통제력을 상실한 상태입니다. 매달 비용만 지출하고 방향성 없이 표류하고 있을 가능성이 높습니다. 즉각적인 개선이 필요합니다.",
    isWarning: true,
  },
  {
    range: [41, 60],
    title: "위기 주의 단계",
    description:
      "기본적인 마케팅은 진행 중이지만 효율성과 방향성의 ���검이 필요합니다. 마케팅 주도권 확보와 체계적인 접근이 필요합니다.",
    isWarning: true,
  },
  {
    range: [61, 80],
    title: "안정 단계",
    description:
      "마케팅이 비교적 잘 관리되고 있지만, 최적화할 여지가 있습니다. 확장 가능한 범위를 설정하고 다음 단계를 위한 액션이 필요합니다.",
    isWarning: false,
  },
  {
    range: [81, 100],
    title: "최적화 단계",
    description: "축하드립니다! 마케팅이 매우 효과적으로 운영되고 있습니다. 이 페이지를 떠나주셔도 좋습니다.",
    isWarning: false,
  },
]

export function SelfDiagnosis() {
  const [scores, setScores] = useState<Record<string, number>>({})
  
  // 100점 만점으로 변환: (총합 / 30) * 100
  const totalScore = useMemo(() => {
    const rawTotal = Object.values(scores).reduce((sum, score) => sum + score, 0)
    return Math.round((rawTotal / 30) * 100)
  }, [scores])

  const handleScoreChange = (id: string, value: number) => {
    setScores((prev) => ({ ...prev, [id]: value }))
  }

  return (
    <>
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-teal-600 font-semibold">사업 마케팅 자가진단</p>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              사장님의 사업은 <br />
              안전하신가요?
            </h2>
            <p className="mt-4 text-gray-600">직접 체크해보세요.</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="space-y-8">
              {questions.map((q) => (
                <div key={q.id}>
                  <strong className="text-lg">{q.text}</strong>
                  {q.subtext && <em className="block text-sm text-gray-500 not-italic">{q.subtext}</em>}
                  <div className="flex justify-between items-center mt-4">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <label key={value} className="cursor-pointer text-center">
                        <input
                          type="radio"
                          name={q.id}
                          value={value}
                          className="sr-only peer"
                          onChange={() => handleScoreChange(q.id, value)}
                        />
                        <i className="block w-10 h-10 rounded-full bg-gray-200 peer-checked:bg-teal-600 peer-checked:text-white flex items-center justify-center font-bold not-italic transition-colors">
                          {value}
                        </i>
                      </label>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-2 px-1">
                    <span>그렇지 않다</span>
                    <span>매우 그렇다</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center bg-teal-50 p-6 rounded-lg">
              <strong className="text-lg">현재 점수</strong>
              <p className="text-6xl font-extrabold text-teal-600 my-2">{totalScore}</p>
              <p className="text-lg font-semibold">점 / 100점</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              60점 이하라면, <br />
              매달 수백만 원을 <br className="sm:hidden" />
              버리고 있는 것과 같습니다.
            </h2>
          </div>
          <ul className="grid md:grid-cols-2 gap-8">
            {scoreInfo.map((info, index) => (
              <li
                key={index}
                className={`rounded-lg p-6 ${info.isWarning ? "bg-red-50 border-red-200" : "bg-teal-50 border-teal-200"} border`}
              >
                <div className="flex items-center justify-between mb-4">
                  <strong className="text-xl font-bold">
                    {info.range[0]}-{info.range[1]}점
                  </strong>
                  <p className={`font-semibold ${info.isWarning ? "text-red-600" : "text-teal-700"}`}>{info.title}</p>
                </div>
                <p className="text-gray-600">{info.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
