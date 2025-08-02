"use client"

import { useState, useMemo } from "react"

const questions = [
  { id: "anxiety1", text: "최근 사소한 일에도 걱정이 많아지고 불안감을 느끼나요?" },
  { id: "anxiety2", text: "어떤 일이든 최악의 결과를 상상하며 미리 걱정하는 편인가요?" },
  { id: "anxiety3", text: "불안감 때문에 집중하기 어렵거나 마음이 항상 초조한가요?" },
  { id: "anxiety4", text: "스스로 긴장을 풀고 쉬는 것이 어렵다고 느끼나요?" },
  { id: "anxiety5", text: "사소한 자극에도 쉽게 놀라거나 예민하게 반응하나요?" },
]

const scoreInfo = [
  {
    range: [20, 40],
    title: "높은 불안 단계",
    description:
      "일상 생활에 영향을 줄 수 있는 높은 수준의 불안을 경험하고 있습니다. 전문가의 도움이 필요할 수 있습니다.",
    isWarning: true,
  },
  {
    range: [41, 60],
    title: "주의 단계",
    description:
      "일상적인 스트레스 이상의 불안을 느끼고 있습니다. 스트레스 관리와 이완 기법을 연습하는 것이 도움이 될 수 있습니다.",
    isWarning: true,
  },
  {
    range: [61, 80],
    title: "보통 단계",
    description:
      "약간의 불안감을 느끼고 있지만, 일상 생활에 큰 지장은 없는 상태입니다. 현재의 마음 상태를 잘 관찰해보세요.",
    isWarning: false,
  },
  {
    range: [81, 100],
    title: "안정 단계",
    description: "축하드립니다! 정서적으로 매우 안정적인 상태를 유지하고 있습니다. 지금처럼 꾸준히 관리해주세요.",
    isWarning: false,
  },
]

export function TestSafety() {
  const [scores, setScores] = useState<Record<string, number>>({})

  const totalScore = useMemo(() => {
    if (Object.keys(scores).length !== questions.length) {
      return 0
    }
    const rawTotal = Object.values(scores).reduce((sum, score) => sum + score, 0)
    return Math.round((rawTotal / (questions.length * 5)) * 100)
  }, [scores])

  const handleScoreChange = (id: string, value: number) => {
    setScores((prev) => ({ ...prev, [id]: value }))
  }

  return (
    <>
      <section className="pb-16 md:pb-24 bg-black">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="space-y-8">
              {questions.map((q) => (
                <div key={q.id}>
                  <strong className="text-lg text-gray-800">{q.text}</strong>
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
                        <i className="block w-10 h-10 rounded-full bg-gray-200 text-gray-800 peer-checked:bg-teal-600 peer-checked:text-white flex items-center justify-center font-bold not-italic transition-colors">
                          {value}
                        </i>
                      </label>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-2 px-1">
                    <span>전혀 그렇지 않다</span>
                    <span>매우 그렇다</span>
                  </div>
                </div>
              ))}
            </div>
            {Object.keys(scores).length === questions.length && (
              <div className="mt-12 text-center bg-teal-50 p-6 rounded-lg">
                <strong className="text-lg text-gray-800">나의 불안 지수</strong>
                <p className="text-6xl font-extrabold text-teal-600 my-2">{totalScore}</p>
                <p className="text-lg font-semibold text-gray-700">점 / 100점</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {Object.keys(scores).length === questions.length && (
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">진단 결과</h2>
              <p className="mt-4 text-gray-600">나의 현재 마음 상태를 확인해보세요.</p>
            </div>
            <ul className="grid md:grid-cols-2 gap-8">
              {scoreInfo.map((info, index) => (
                <li
                  key={index}
                  className={`rounded-lg p-6 border ${
                    info.isWarning ? "bg-red-50 border-red-200" : "bg-teal-50 border-teal-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <strong className="text-xl font-bold text-gray-800">
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
      )}
    </>
  )
}
