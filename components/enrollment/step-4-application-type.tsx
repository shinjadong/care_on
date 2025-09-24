"use client"

import { CareonContainer } from "@/components/ui/careon-container"
import { CareonButton } from "@/components/ui/careon-button"
import { BackButton } from "@/components/ui/back-button"
import type { FormData } from "@/app/enrollment/page"

interface StepApplicationTypeProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string) => void
  onNext: () => void
  onBack: () => void
}

export default function StepApplicationType({ formData, updateFormData, onNext, onBack }: StepApplicationTypeProps) {
  const options = [
    {
      value: "new",
      title: "신규 가맹점 가입",
      description: "",
    },
    {
      value: "multiple",
      title: "복수 가맹점 가입",
      description: "하나의 사업자번호로 여러개 사업장을 운영하려는 경우 신청합니다.",
    },
  ]

  const handleSelect = (value: string) => {
    updateFormData("applicationType", value)
  }

  const isValid = formData.applicationType !== ""

  return (
    <CareonContainer>
      <div className="flex items-center justify-start p-4 pb-0">
        <BackButton onClick={onBack} />
      </div>
      <div className="flex-1 flex flex-col justify-start pt-16 px-6">
        <h1 className="text-2xl font-semibold text-black leading-relaxed mb-10">
          신청 유형을<br />
          선택해 주세요
        </h1>

        <div className="space-y-4">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                formData.applicationType === option.value
                  ? "border-[#009DA2] bg-[#009DA2]/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="font-medium text-base">{option.title}</div>
              {option.description && (
                <div className="text-sm text-gray-500 mt-1">{option.description}</div>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="p-6 pt-0">
        <CareonButton onClick={onNext} variant="teal" disabled={!isValid}>
          다음
        </CareonButton>
      </div>
    </CareonContainer>
  )
}