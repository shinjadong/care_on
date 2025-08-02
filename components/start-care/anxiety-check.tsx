"use client"

import { useState, useMemo } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const questions = [
  { id: "anxiety1", text: "지난 2주 동안, 걱정을 멈출 수 없거나 조절할 수 없다고 느낀 적이 얼마나 자주 있었나요?" },
  { id: "anxiety2", text: "지난 2주 동안, 안절부절못하거나, 초조하거나, 긴장된 느낌이 든 적이 얼마나 자주 있었나요?" },
  { id: "anxiety3", text: "지난 2주 동안, 너무 쉽게 짜증이 나거나 화를 낸 적이 얼마나 자주 있었나요?" },
]

export function AnxietyCheck() {
  const [scores, setScores] = useState<Record<string, number>>({})

  const totalScore = useMemo(() => {
    const values = Object.values(scores)
    if (values.length !== questions.length) return null
    return values.reduce((sum, score) => sum + score, 0)
  }, [scores])

  const handleScoreChange = (id: string, value: string) => {
    setScores((prev) => ({ ...prev, [id]: Number(value) }))
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>불안 증상 자가 진단 (GAD-7)</CardTitle>
            <CardDescription>지난 2주간의 상태에 따라 점수를 매겨주세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {questions.map((q, index) => (
                <div key={q.id}>
                  <p className="font-semibold">{`${index + 1}. ${q.text}`}</p>
                  <RadioGroup
                    onValueChange={(value) => handleScoreChange(q.id, value)}
                    className="flex justify-between mt-2"
                  >
                    {[
                      { value: 0, label: "전혀 없음" },
                      { value: 1, label: "며칠" },
                      { value: 2, label: "일주일 이상" },
                      { value: 3, label: "거의 매일" },
                    ].map((option) => (
                      <div key={option.value} className="flex flex-col items-center space-y-1">
                        <RadioGroupItem value={String(option.value)} id={`${q.id}-${option.value}`} />
                        <Label htmlFor={`${q.id}-${option.value}`} className="text-xs text-center">
                          {option.label}
                          <br />({option.value}점)
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </div>
            {totalScore !== null && (
              <div className="mt-8 text-center p-4 bg-gray-100 rounded-lg">
                <p className="text-lg font-bold">총점: {totalScore}점</p>
                <p className="mt-2 text-sm text-gray-600">5점 이상: 전문가 상담 권장, 10점 이상: 적극적인 치료 고려</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
