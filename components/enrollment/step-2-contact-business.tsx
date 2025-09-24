"use client"

import { CareonContainer } from "@/components/ui/careon-container"
import { CareonButton } from "@/components/ui/careon-button"
import { CareonInput } from "@/components/ui/careon-input"
import { BackButton } from "@/components/ui/back-button"
import type { FormData } from "@/app/enrollment/page"

interface StepContactBusinessProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string) => void
  onNext: () => void
  onBack: () => void
}

export default function StepContactBusiness({ formData, updateFormData, onNext, onBack }: StepContactBusinessProps) {
  const isValid =
    formData.businessName.trim() !== "" &&
    formData.businessNumber.length === 10 &&
    formData.email?.includes("@")

  return (
    <CareonContainer>
      <div className="flex items-center justify-start p-4 pb-0">
        <BackButton onClick={onBack} />
      </div>
      <div className="flex-1 flex flex-col justify-start pt-16 px-6">
        <h1 className="text-2xl font-semibold text-black leading-relaxed mb-10">
          사업자 정보를<br />
          입력해 주세요
        </h1>

        <div className="space-y-4">
          <CareonInput
            label="상호명"
            placeholder="사업자등록증상 상호명을 입력해 주세요"
            value={formData.businessName}
            onChange={(value) => updateFormData("businessName", value)}
          />
          <CareonInput
            label="사업자 등록번호"
            placeholder="123-45-67890"
            value={formData.businessNumber}
            onChange={(value) => {
              // Remove non-numeric characters
              const cleaned = value.replace(/[^0-9]/g, "")
              updateFormData("businessNumber", cleaned)
            }}
            maxLength={10}
            inputMode="numeric"
          />
          <p className="text-sm text-gray-500 mb-4">10자리 숫자를 입력해 주세요</p>
          <CareonInput
            label="이메일 주소"
            placeholder="example@email.com"
            value={formData.email || ""}
            onChange={(value) => updateFormData("email", value)}
            type="text"
            inputMode="email"
          />
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