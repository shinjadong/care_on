"use client"

import { useState } from "react"
import { CareonContainer } from "@/components/ui/careon-container"
import { CareonButton } from "@/components/ui/careon-button"
import { BackButton } from "@/components/ui/back-button"
import type { FormData } from "@/app/enrollment/page"

interface StepDeliveryAppProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string | boolean) => void
  onNext: () => void
  onBack: () => void
}

export default function StepDeliveryApp({ formData, updateFormData, onNext, onBack }: StepDeliveryAppProps) {
  const [needDeliveryApp, setNeedDeliveryApp] = useState<boolean>(
    formData.needDeliveryApp === "true" || formData.needDeliveryApp === true
  )

  const handleNext = () => {
    updateFormData("needDeliveryApp", needDeliveryApp)
    onNext()
  }

  const deliveryApps = [
    {
      name: "배달의민족",
      logo: "https://pkehcfbjotctvneordob.supabase.co/storage/v1/object/public/care-on/1.jpg",
      color: "#3AC5C9"
    },
    {
      name: "요기요",
      logo: "https://pkehcfbjotctvneordob.supabase.co/storage/v1/object/public/care-on/2.jpg",
      color: "#FA0050"
    },
    {
      name: "쿠팡이츠",
      logo: "https://pkehcfbjotctvneordob.supabase.co/storage/v1/object/public/care-on/3.jpg",
      color: "#5B32FF"
    }
  ]

  return (
    <CareonContainer>
      <div className="flex items-center justify-start p-4 pb-0">
        <BackButton onClick={onBack} />
      </div>
      <div className="flex-1 flex flex-col justify-start pt-12 px-6">
        <h1 className="text-2xl font-semibold text-black leading-relaxed mb-8">
          배달앱 가입 대행이<br />
          필요하신가요?
        </h1>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">📱 주요 배달앱 가입 대행</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {deliveryApps.map((app) => (
              <div key={app.name} className="bg-white rounded-lg p-3 text-center">
                <img
                  src={app.logo}
                  alt={app.name}
                  className="w-16 h-16 mx-auto mb-2 object-contain"
                />
                <p className="text-xs font-medium">{app.name}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-700">
            복잡한 가입 절차를 대신 처리해 드립니다
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-base font-medium mb-4">무료로 제공되는 서비스</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-[#009DA2] mr-2">✓</span>
                <span>사업자 정보 등록 대행</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#009DA2] mr-2">✓</span>
                <span>메뉴 사진 촬영 및 등록</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#009DA2] mr-2">✓</span>
                <span>초기 설정 및 최적화</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#009DA2] mr-2">✓</span>
                <span>운영 교육 및 가이드</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setNeedDeliveryApp(true)}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                needDeliveryApp
                  ? "border-[#009DA2] bg-[#009DA2]/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="font-medium">필요해요</p>
                  <p className="text-sm text-gray-600 mt-1">바로 가입 대행을 진행할게요</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 ${
                  needDeliveryApp
                    ? "border-[#009DA2] bg-[#009DA2]"
                    : "border-gray-300"
                }`}>
                  {needDeliveryApp && (
                    <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </button>

            <button
              onClick={() => setNeedDeliveryApp(false)}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                !needDeliveryApp
                  ? "border-[#009DA2] bg-[#009DA2]/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="font-medium">지금은 아니에요</p>
                  <p className="text-sm text-gray-600 mt-1">나중에 필요하면 연락드릴게요</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 ${
                  !needDeliveryApp
                    ? "border-[#009DA2] bg-[#009DA2]"
                    : "border-gray-300"
                }`}>
                  {!needDeliveryApp && (
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
      <div className="p-6 pt-0">
        <CareonButton onClick={handleNext} variant="teal">
          다음
        </CareonButton>
      </div>
    </CareonContainer>
  )
}