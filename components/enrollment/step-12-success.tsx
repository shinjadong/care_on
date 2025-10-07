"use client"

import { useEffect, useState } from "react"
import { CareonContainer } from "./ui/careon-container"
import { CareonButton } from "./ui/careon-button"
import type { FormData } from "@/app/enrollment/page"
import { CheckCircle, Calendar, Phone, Mail, FileText } from "lucide-react"
import confetti from "canvas-confetti"

interface StepSuccessProps {
  formData: FormData
  onNext: () => void
}

export default function StepSuccess({ formData, onNext }: StepSuccessProps) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Trigger confetti animation
    const duration = 2000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min
    }

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)

    // Show content after a short delay
    setTimeout(() => setShowContent(true), 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <CareonContainer>
      <div className="p-6">
        {/* Success Icon */}
        <div className={`mb-6 transform transition-all duration-700 ${showContent ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-green-400 to-green-600 rounded-full p-8">
              <CheckCircle className="w-16 h-16 text-white" strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className={`text-center mb-8 transition-all duration-700 delay-200 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            신청이 완료되었습니다! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            {formData.ownerName}사장님! 가입 신청이 성공적으로 접수되었습니다.
          </p>
        </div>

        {/* Application Number */}
        <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 w-full max-w-md transition-all duration-700 delay-300 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">신청 번호</p>
            <p className="text-2xl font-bold text-gray-900">
              #2025{Math.floor(Math.random() * 9000 + 1000)}
            </p>
          </div>
        </div>

        {/* What's Next */}
        <div className={`bg-white rounded-xl border border-gray-200 p-6 mb-8 w-full max-w-md transition-all duration-700 delay-400 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <h3 className="font-semibold text-lg text-gray-900 mb-4">다음 단계 안내</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">심사 기간</p>
                <p className="text-sm text-gray-600">영업일 기준 1~2일 소요</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Phone className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">연락 예정</p>
                <p className="text-sm text-gray-600">{formData.phoneNumber}로 연락드립니다</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Mail className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">이메일 확인</p>
                <p className="text-sm text-gray-600">심사 진행 상황을 이메일로 안내드립니다</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FileText className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">추가 서류</p>
                <p className="text-sm text-gray-600">필요시 별도 요청드릴 예정입니다</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className={`bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 mb-8 w-full max-w-md border border-gray-100 transition-all duration-700 delay-500 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <h3 className="font-medium text-sm text-gray-600 mb-3">문의하기</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-700">
              <span className="font-medium">고객센터:</span> 1866-1845
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">운영시간:</span> 평일 09:00 - 18:00
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">이메일:</span> siwwyy1012@gmail.com
            </p>
          </div>
        </div>
      </div>

      <div className={`p-6 transition-all duration-700 delay-600 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <CareonButton onClick={onNext} variant="teal" className="mb-3">
          처음으로 돌아가기
        </CareonButton>
        <p className="text-xs text-center text-gray-500">
          신청 내역은 마이페이지에서 확인하실 수 있습니다
        </p>
      </div>
    </CareonContainer>
  )
}