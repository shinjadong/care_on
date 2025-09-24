"use client"

import { useState } from "react"
import { CareonContainer } from "@/components/ui/careon-container"
import { CareonButton } from "@/components/ui/careon-button"
import { BackButton } from "@/components/ui/back-button"
import type { FormData } from "@/app/enrollment/page"

interface StepWelcomeTosspayProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string | boolean) => void
  onNext: () => void
  onBack: () => void
}

export default function StepWelcomeTosspay({ updateFormData, onNext, onBack }: StepWelcomeTosspayProps) {
  const [agreePrivacy, setAgreePrivacy] = useState(false)

  const handleNext = () => {
    updateFormData("agreeTosspay", agreePrivacy)
    onNext()
  }

  return (
    <CareonContainer>
      <div className="flex items-center justify-start p-4 pb-0">
        <BackButton onClick={onBack} />
      </div>
      <div className="flex-1 flex flex-col justify-start pt-8 px-6">
        <div className="text-4xl mb-6">🎉</div>
        <h1 className="text-2xl font-semibold text-black leading-relaxed mb-6">
          토스페이 가맹점 신청을<br />
          환영합니다!
        </h1>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700 mb-4">
            비대면 카드 가맹 신청 전 아래 안내사항을 확인해 주세요.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">✨ 특별 혜택</h2>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-[#009DA2] mr-2">•</span>
                <div>
                  <span className="font-medium">인터넷 1년 무료</span>
                  <span className="text-sm text-gray-600 ml-2">(500Mbps 초고속)</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-[#009DA2] mr-2">•</span>
                <div>
                  <span className="font-medium">AI CCTV 1년 무료</span>
                  <span className="text-sm text-gray-600 ml-2">(4대 설치)</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-[#009DA2] mr-2">•</span>
                <div>
                  <span className="font-medium">배달앱 가입 대행</span>
                  <span className="text-sm text-gray-600 ml-2">(배민/요기요/쿠팡이츠)</span>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">📋 준비할 서류</h2>
            <ul className="space-y-2 text-gray-700">
              <li>• 사업자등록증</li>
              <li>• 신분증</li>
              <li>• 통장사본</li>
              <li>• 매장 사진</li>
            </ul>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">🔒 필수 동의사항</h2>
            <label className="flex items-start">
              <input
                type="checkbox"
                checked={agreePrivacy}
                onChange={(e) => setAgreePrivacy(e.target.checked)}
                className="mr-3 mt-1 w-5 h-5"
              />
              <div>
                <span className="font-medium">
                  비대면 서비스 이용을 위한 개인정보 수집 및 이용동의
                </span>
                <span className="text-red-500 ml-1">(필수)</span>
                <p className="text-sm text-gray-600 mt-1">
                  토스페이 가맹점 가입 대행을 위한 법적 동의입니다
                </p>
              </div>
            </label>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <span className="text-2xl">🕐</span>
            <p className="text-lg font-semibold mt-2">단 3분이면 완료!</p>
          </div>
        </div>
      </div>
      <div className="p-6 pt-0">
        <CareonButton onClick={handleNext} variant="teal" disabled={!agreePrivacy}>
          동의하고 시작하기
        </CareonButton>
      </div>
    </CareonContainer>
  )
}