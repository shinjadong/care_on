"use client"

import { CareonContainer } from "@/components/ui/careon-container"
import { CareonButton } from "@/components/ui/careon-button"
import { BackButton } from "@/components/ui/back-button"
import type { FormData } from "@/app/enrollment/page"

interface StepConfirmationProps {
  formData: FormData
  onNext: () => void
  onBack: () => void
}

export default function StepConfirmation({ formData, onNext, onBack }: StepConfirmationProps) {
  const getDisplayValue = (field: string, value: string) => {
    const displayMap: Record<string, Record<string, string>> = {
      applicationType: {
        new: "신규",
        multiple: "복수",
      },
      businessType: {
        individual: "개인",
        corporation: "법인",
      },
      ownershipType: {
        single: "단독",
        joint: "공동",
      },
      licenseType: {
        food: "요식 업종(영업신고증 보유)",
        other: "기타 업종(영업신고증 보유)",
        none: "인허가 대상 아님",
      },
      businessCategory: {
        accommodation_food: "숙박 및 음식업",
        wholesale_retail: "도소매업",
        manufacturing: "제조업",
        other: "기타",
      },
    }
    return displayMap[field]?.[value] || value
  }

  return (
    <CareonContainer>
      <div className="flex items-center justify-start p-4 pb-0">
        <BackButton onClick={onBack} />
      </div>
      <div className="flex-1 flex flex-col justify-start pt-16 px-6">
        <h1 className="text-2xl font-semibold text-black leading-relaxed mb-10">
          입력하신 정보를<br />
          확인해 주세요
        </h1>

        <div className="space-y-6 text-base">
          <div>
            <p className="mb-4">
              대표님(실제 소유자)은{" "}
              <span className="font-bold">
                {getDisplayValue("applicationType", formData.applicationType)} &gt;{" "}
                {getDisplayValue("businessType", formData.businessType)} &gt;{" "}
                {getDisplayValue("ownershipType", formData.ownershipType)}
              </span>{" "}
              사업자이며,{" "}
              <span className="font-bold">대한민국 국적자</span>입니다.
            </p>

            <p className="mb-4">
              인허가 업종은{" "}
              <span className="font-bold">
                {getDisplayValue("licenseType", formData.licenseType)}
              </span>이며,
            </p>

            <p className="mb-4">
              직종은{" "}
              <span className="font-bold">
                {getDisplayValue("businessCategory", formData.businessCategory)}
              </span>입니다.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h2 className="font-bold mb-3">입력 정보</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex">
                <dt className="text-gray-600 w-28">대표자명:</dt>
                <dd className="font-medium">{formData.ownerName}</dd>
              </div>
              <div className="flex">
                <dt className="text-gray-600 w-28">상호명:</dt>
                <dd className="font-medium">{formData.businessName}</dd>
              </div>
              <div className="flex">
                <dt className="text-gray-600 w-28">사업자번호:</dt>
                <dd className="font-medium">{formData.businessNumber}</dd>
              </div>
              <div className="flex">
                <dt className="text-gray-600 w-28">매장명:</dt>
                <dd className="font-medium">{formData.storeName}</dd>
              </div>
              <div className="flex">
                <dt className="text-gray-600 w-28">연락처:</dt>
                <dd className="font-medium">{formData.phoneNumber}</dd>
              </div>
            </dl>
          </div>

          <p className="text-lg font-semibold pt-4">위 내용이 맞나요?</p>
        </div>
      </div>
      <div className="p-6 pt-0">
        <CareonButton onClick={onNext} variant="teal">
          완료
        </CareonButton>
      </div>
    </CareonContainer>
  )
}