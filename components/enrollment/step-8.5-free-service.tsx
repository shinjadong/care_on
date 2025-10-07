"use client"

import { useState, useEffect } from "react"
import { CareonContainer } from "./ui/careon-container"
import { CareonButton } from "./ui/careon-button"
import { BackButton } from "@/components/ui/back-button"
import type { FormData } from "@/app/enrollment/page"
import { addDays, setHours, setMinutes, setSeconds, differenceInSeconds, format } from "date-fns"
import { ko } from "date-fns/locale"

interface StepFreeServiceProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string | boolean) => void
  onNext: () => void
  onBack: () => void
}

export default function StepFreeService({ formData, updateFormData, onNext, onBack }: StepFreeServiceProps) {
  const [wantFreeService, setWantFreeService] = useState<boolean>(true)
  const [timeLeft, setTimeLeft] = useState("")
  const [endDateStr, setEndDateStr] = useState("")

  useEffect(() => {
    // 2일 후 12시로 정확히 설정 (D+2 이벤트)
    const now = new Date()
    let endDate = addDays(now, 2) // 2일 후
    endDate = setHours(endDate, 12) // 12시로 설정
    endDate = setMinutes(endDate, 0)
    endDate = setSeconds(endDate, 0)

    // 날짜 표시 설정 (예: "1월 27일 월요일 12시")
    setEndDateStr(format(endDate, "M월 d일 EEEE HH시", { locale: ko }))

    const updateTimer = () => {
      const currentTime = new Date()
      const secondsLeft = differenceInSeconds(endDate, currentTime)

      if (secondsLeft > 0) {
        const days = Math.floor(secondsLeft / (60 * 60 * 24))
        const hours = Math.floor((secondsLeft % (60 * 60 * 24)) / (60 * 60))
        const minutes = Math.floor((secondsLeft % (60 * 60)) / 60)
        const seconds = secondsLeft % 60

        if (days > 0) {
          setTimeLeft(`${days}일 ${hours}시간 ${minutes}분 ${seconds}초`)
        } else if (hours > 0) {
          setTimeLeft(`${hours}시간 ${minutes}분 ${seconds}초`)
        } else if (minutes > 0) {
          setTimeLeft(`${minutes}분 ${seconds}초`)
        } else {
          setTimeLeft(`${seconds}초`)
        }
      } else {
        setTimeLeft("마감됨")
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000) // 1초마다 업데이트

    return () => clearInterval(interval)
  }, [])

  // 조건부 렌더링: 인터넷이나 CCTV가 없는 경우에만 표시
  const hasInternet = formData.hasInternet === "yes" || formData.hasInternet === true
  const hasCCTV = formData.hasCCTV === "yes" || formData.hasCCTV === true

  // 둘 다 있으면 이 단계를 건너뜀 - useEffect로 자동 이동
  useEffect(() => {
    if (hasInternet && hasCCTV) {
      onNext()
    }
  }, [hasInternet, hasCCTV])

  const handleNext = () => {
    updateFormData("wantFreeService", wantFreeService)
    onNext()
  }

  // 둘 다 있으면 렌더링하지 않음
  if (hasInternet && hasCCTV) {
    return null
  }

  const showInternetOffer = !hasInternet
  const showCCTVOffer = !hasCCTV

  return (
    <CareonContainer>
      <div className="flex items-center justify-start p-4 pb-0">
        <BackButton onClick={onBack} />
      </div>
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-black leading-relaxed mb-8">
          {showInternetOffer && showCCTVOffer && (
            <>필요하신 서비스를<br />무료로 제공해드립니다</>
          )}
          {showInternetOffer && !showCCTVOffer && (
            <>매장 인터넷을<br />무료로 설치해드립니다</>
          )}
          {!showInternetOffer && showCCTVOffer && (
            <>AI CCTV를<br />무료로 설치해드립니다</>
          )}
        </h1>

        <div className="bg-gray-50 rounded-xl p-5 mb-6">
          <h3 className="font-semibold mb-4 flex items-center">
            <span className="text-[#009DA2] mr-2">●</span>
            1년 무료 제공 서비스
          </h3>
          <div className="space-y-3">
            {showInternetOffer && (
              <div className="flex items-start">
                <span className="text-lg mr-3">🌐</span>
                <div>
                  <p className="font-medium">초고속 인터넷 (500M 기가라이트)</p>
                  <p className="text-sm text-gray-600">안정적인 비즈니스 인터넷 환경 구축</p>
                </div>
              </div>
            )}
            {showCCTVOffer && (
              <div className="flex items-start">
                <span className="text-lg mr-3">📹</span>
                <div>
                  <p className="font-medium">AI 지능형 CCTV 4대 (KT)</p>
                  <p className="text-sm text-gray-600">24시간 매장 보안 및 이상감지 시스템</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 mb-8 border border-blue-100">
          <div className="flex items-center mb-2">
            <span className="text-lg mr-2">⏰</span>
            <p className="font-medium text-gray-700">신청 가능 기간</p>
          </div>
          <p className="text-lg font-semibold text-gray-900">{timeLeft} 남음</p>
          <p className="text-sm text-gray-600 mt-1">마감: {endDateStr}</p>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-medium mb-3">바로 혜택 안내 받아보실까요?</h3>

          <button
            onClick={() => setWantFreeService(true)}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
              wantFreeService
                ? "border-[#009DA2] bg-[#009DA2]/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="font-medium">좋아요! 🎉</p>
                <p className="text-sm text-gray-600 mt-1">1년 무료 혜택 받을게요</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 ${
                wantFreeService
                  ? "border-[#009DA2] bg-[#009DA2]"
                  : "border-gray-300"
              }`}>
                {wantFreeService && (
                  <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
          </button>

          <button
            onClick={() => setWantFreeService(false)}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
              !wantFreeService
                ? "border-gray-400 bg-gray-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="font-medium text-gray-600">싫어요</p>
                <p className="text-sm text-gray-500 mt-1">혜택이 필요 없어요</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 ${
                !wantFreeService
                  ? "border-gray-400 bg-gray-400"
                  : "border-gray-300"
              }`}>
                {!wantFreeService && (
                  <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
          </button>
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
