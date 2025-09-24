"use client"

import { useState, useEffect } from "react"
import { CareonContainer } from "@/components/ui/careon-container"
import { CareonButton } from "@/components/ui/careon-button"
import type { FormData } from "@/app/enrollment/page"

interface StepFirstCompletionProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string | boolean) => void
  onNext: () => void
  onBack: () => void
}

export default function StepFirstCompletion({ onNext }: StepFirstCompletionProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // 페이지 로드시 축하 애니메이션 시작
    setShowConfetti(true)
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <CareonContainer>
      <div className="flex-1 flex flex-col justify-center items-center px-6">
        <div className="text-center max-w-sm">
          {/* 축하 애니메이션 */}
          <div className={`text-6xl mb-6 ${showConfetti ? "animate-bounce" : ""}`}>
            🎉
          </div>

          <h1 className="text-3xl font-bold text-black mb-4">
            훌륭해요!
          </h1>

          <p className="text-xl text-gray-700 mb-8">
            3장만 있으면 끝나요
          </p>

          {/* 중요 안내 */}
          <div className="bg-yellow-50 rounded-xl p-6 mb-8 border-2 border-yellow-200">
            <div className="flex items-center justify-center mb-3">
              <span className="text-2xl">📍</span>
            </div>
            <p className="font-semibold text-gray-800 mb-2">중요 안내</p>
            <p className="text-sm text-gray-700">
              매장과 가까이 있어야 해요
            </p>
          </div>

          {/* 체크리스트 */}
          <div className="bg-white rounded-xl border-2 border-gray-100 p-6 mb-8 text-left">
            <h2 className="font-semibold mb-4 text-center">준비할 서류</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <span className="font-medium">사업자등록증</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <span className="font-medium">신분증</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <span className="font-medium">통장</span>
              </div>
            </div>
          </div>

          {/* 안내 메시지 */}
          <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-700">
            <p className="flex items-center justify-center">
              <span className="mr-2">📸</span>
              사진으로 찍어 올리셔도 돼요
            </p>
            <p className="mt-2 text-xs text-gray-600">
              큰 파일도 괜찮아요 (최대 100MB)
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <CareonButton onClick={onNext} variant="teal">
          서류 업로드 하러가기
        </CareonButton>
      </div>
    </CareonContainer>
  )
}