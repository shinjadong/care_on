"use client"

import { useState, useEffect } from "react"
import { CareonContainer } from "@/components/ui/careon-container"
import { CareonButton } from "@/components/ui/careon-button"
import { BackButton } from "@/components/ui/back-button"
import type { FormData } from "@/app/enrollment/page"

interface StepInternetCCTVCheckProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string | boolean) => void
  onNext: () => void
  onBack: () => void
}

export default function StepInternetCCTVCheck({ formData, updateFormData, onNext, onBack }: StepInternetCCTVCheckProps) {
  const [hasInternet, setHasInternet] = useState<boolean>(
    formData.hasInternet === "yes" || formData.hasInternet === true
  )
  const [hasCCTV, setHasCCTV] = useState<boolean>(
    formData.hasCCTV === "yes" || formData.hasCCTV === true
  )

  const handleNext = () => {
    updateFormData("hasInternet", hasInternet)
    updateFormData("hasCCTV", hasCCTV)
    onNext()
  }

  return (
    <CareonContainer>
      <div className="flex items-center justify-start p-4 pb-0">
        <BackButton onClick={onBack} />
      </div>
      <div className="flex-1 flex flex-col justify-start pt-12 px-6">
        <h1 className="text-2xl font-semibold text-black leading-relaxed mb-8">
          매장 시설 현황을<br />
          확인하겠습니다
        </h1>

        <div className="space-y-6">
          {/* 인터넷 설치 여부 */}
          <div>
            <h3 className="text-base font-medium mb-3">현재 매장에 인터넷이 설치되어 있나요?</h3>
            <div className="space-y-3">
              <button
                onClick={() => setHasInternet(true)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                  hasInternet
                    ? "border-[#009DA2] bg-[#009DA2]/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="font-medium">네, 설치되어 있어요</p>
                    <p className="text-sm text-gray-600 mt-1">현재 인터넷을 사용 중입니다</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 ${
                    hasInternet
                      ? "border-[#009DA2] bg-[#009DA2]"
                      : "border-gray-300"
                  }`}>
                    {hasInternet && (
                      <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>

              <button
                onClick={() => setHasInternet(false)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                  !hasInternet
                    ? "border-[#009DA2] bg-[#009DA2]/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="font-medium">아니요, 없어요</p>
                    <p className="text-sm text-gray-600 mt-1">인터넷이 필요합니다</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 ${
                    !hasInternet
                      ? "border-[#009DA2] bg-[#009DA2]"
                      : "border-gray-300"
                  }`}>
                    {!hasInternet && (
                      <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* CCTV 설치 여부 */}
          <div>
            <h3 className="text-base font-medium mb-3">현재 매장에 CCTV가 설치되어 있나요?</h3>
            <div className="space-y-3">
              <button
                onClick={() => setHasCCTV(true)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                  hasCCTV
                    ? "border-[#009DA2] bg-[#009DA2]/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="font-medium">네, 설치되어 있어요</p>
                    <p className="text-sm text-gray-600 mt-1">CCTV를 운영 중입니다</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 ${
                    hasCCTV
                      ? "border-[#009DA2] bg-[#009DA2]"
                      : "border-gray-300"
                  }`}>
                    {hasCCTV && (
                      <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>

              <button
                onClick={() => setHasCCTV(false)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                  !hasCCTV
                    ? "border-[#009DA2] bg-[#009DA2]/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="font-medium">아니요, 없어요</p>
                    <p className="text-sm text-gray-600 mt-1">보안이 필요할 수 있습니다</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 ${
                    !hasCCTV
                      ? "border-[#009DA2] bg-[#009DA2]"
                      : "border-gray-300"
                  }`}>
                    {!hasCCTV && (
                      <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 pt-0">
        <CareonButton onClick={handleNext} variant="teal">
          다음
        </CareonButton>
      </div>
    </CareonContainer>
  )
}