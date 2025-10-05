"use client"

import { CareonContainer } from "@/components/ui/careon-container"
import { CareonButton } from "@/components/ui/careon-button"
import { BackButton } from "@/components/ui/back-button"
import type { FormData } from "@/app/enrollment/page"

interface StepBusinessTypeProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string) => void
  onNext: () => void
  onBack: () => void
}

export default function StepBusinessType({ formData, updateFormData, onNext, onBack }: StepBusinessTypeProps) {
  const options = [
    {
      value: "개인사업자",
      title: "개인 사업자 입니다",
    },
    {
      value: "법인사업자",
      title: "법인 사업자 입니다",
    },
  ]

  const handleSelect = (value: string) => {
    updateFormData("businessType", value)
  }

  const isValid = formData.businessType !== ""

  return (
    <CareonContainer>
      <div className="flex items-center justify-start p-4 pb-0">
        <BackButton onClick={onBack} />
      </div>
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-black leading-relaxed mb-10">
          사업자 형태 확인이<br />
          필요해요
        </h1>

        <div className="space-y-4">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                formData.businessType === option.value
                  ? "border-[#009DA2] bg-[#009DA2]/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="font-medium text-base">{option.title}</div>
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