"use client"

import { useState, useEffect } from "react"
import { CareonContainer } from "./ui/careon-container"
import { CareonButton } from "./ui/careon-button"
import { CareonInput } from "./ui/careon-input"
import { BackButton } from "@/components/ui/back-button"
import type { FormData } from "@/app/enrollment/page"

interface StepSettlementInfoProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: any) => void
  onNext: () => void
  onBack: () => void
}

const banks = [
  "선택해주세요",
  "국민은행",
  "신한은행",
  "우리은행",
  "하나은행",
  "기업은행",
  "농협은행",
  "수협은행",
  "SC제일은행",
  "씨티은행",
  "케이뱅크",
  "카카오뱅크",
  "토스뱅크",
  "새마을금고",
  "신협",
  "우체국",
]

export default function StepSettlementInfo({ formData, updateFormData, onNext, onBack }: StepSettlementInfoProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // 초기값 설정 - 예금주를 대표자명으로
  useEffect(() => {
    if (!formData.accountHolder && formData.ownerName) {
      updateFormData('accountHolder', formData.ownerName)
    }
  }, [formData.ownerName])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.bankName || formData.bankName === "선택해주세요") {
      newErrors.bankName = "은행을 선택해주세요"
    }

    if (!formData.accountHolder || formData.accountHolder.length < 2) {
      newErrors.accountHolder = "예금주명을 2자 이상 입력해주세요"
    }

    if (!formData.accountNumber || formData.accountNumber.length < 10) {
      newErrors.accountNumber = "올바른 계좌번호를 입력해주세요"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext()
    }
  }

  const formatAccountNumber = (value: string) => {
    // Remove all non-numeric characters except hyphens
    const cleanValue = value.replace(/[^\d-]/g, '')

    // If no hyphens, auto-format common patterns
    if (!cleanValue.includes('-') && cleanValue.length > 3) {
      // Simple auto-formatting (can be improved based on bank-specific patterns)
      const nums = cleanValue.replace(/-/g, '')
      if (nums.length <= 13) {
        // Format as XXX-XXXX-XXXX or similar
        let formatted = ''
        for (let i = 0; i < nums.length; i++) {
          if ((i === 3 || i === 7) && i < nums.length - 1) {
            formatted += '-'
          }
          formatted += nums[i]
        }
        return formatted
      }
    }

    return cleanValue
  }

  const handleAccountNumberChange = (value: string) => {
    // 숫자만 남기기
    const cleaned = value.replace(/[^0-9]/g, '')
    updateFormData('accountNumber', cleaned)
  }

  return (
    <CareonContainer>
      <div className="flex items-center justify-start p-4 pb-0">
        <BackButton onClick={onBack} />
      </div>

      <div className="p-6">
        <h1 className="text-2xl font-semibold text-black leading-relaxed mb-2">
          정산 정보를<br />
          입력해주세요
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          카드 매출 대금이 입금될 계좌 정보입니다
        </p>

        <div className="space-y-6">
          {/* 은행 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              은행명
            </label>
            <select
              value={formData.bankName || "선택해주세요"}
              onChange={(e) => updateFormData('bankName', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.bankName ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-[#148777] focus:border-transparent`}
            >
              {banks.map(bank => (
                <option key={bank} value={bank}>{bank}</option>
              ))}
            </select>
            {errors.bankName && (
              <p className="mt-1 text-xs text-red-500">{errors.bankName}</p>
            )}
          </div>

          {/* 예금주 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              예금주
            </label>
            <CareonInput
              placeholder="예금주명을 입력해주세요"
              value={formData.accountHolder || ""}
              onChange={(value) => updateFormData('accountHolder', value)}
              error={errors.accountHolder}
            />
            {errors.accountHolder && (
              <p className="mt-1 text-xs text-red-500">{errors.accountHolder}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              통장에 표시된 예금주명과 동일하게 입력해주세요
            </p>
          </div>

          {/* 계좌번호 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              계좌번호
            </label>
            <CareonInput
              placeholder="00000000000"
              value={formData.accountNumber || ""}
              onChange={(value) => handleAccountNumberChange(value)}
              inputMode="numeric"
              error={errors.accountNumber}
            />
            {errors.accountNumber && (
              <p className="mt-1 text-xs text-red-500">{errors.accountNumber}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              숫자만 입력해주세요 (하이픈 제외)
            </p>
          </div>

        </div>
      </div>

      <div className="p-6 pt-0">
        <CareonButton onClick={handleNext} variant="teal">
          다음으로
        </CareonButton>
      </div>
    </CareonContainer>
  )
}