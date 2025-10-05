"use client"

import { useState } from "react"
import { CareonContainer } from "@/components/ui/careon-container"
import { CareonButton } from "@/components/ui/careon-button"
import type { FormData } from "@/app/enrollment/page"
import { Check, ChevronRight } from "lucide-react"

interface StepAgreementsProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: any) => void
  onNext: () => void
  onBack: () => void
}

export default function StepAgreements({ formData, updateFormData, onNext }: StepAgreementsProps) {
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)

  const handleAgreeAll = () => {
    const newValue = !(formData.agreeTerms && formData.agreePrivacy && formData.agreeMarketing)
    updateFormData('agreeTerms', newValue)
    updateFormData('agreePrivacy', newValue)
    updateFormData('agreeMarketing', newValue)
  }

  const handleToggleAgreement = (field: keyof FormData, currentValue: any) => {
    const newValue = !currentValue
    updateFormData(field, newValue)
  }

  const handleNext = () => {
    if (!formData.agreeTerms || !formData.agreePrivacy) {
      alert("필수 약관에 동의해주세요.")
      return
    }
    onNext()
  }

  const allAgreed = formData.agreeTerms && formData.agreePrivacy && formData.agreeMarketing

  return (
    <CareonContainer>
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-black leading-relaxed mb-2">
          케어온 가입을 위한<br />
          약관 동의가 필요해요
        </h1>
        <p className="text-sm text-gray-600 mb-8">
          서비스 이용을 위해 아래 약관에 동의해주세요
        </p>

        {/* 전체 동의 */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleAgreeAll()
          }}
          className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all mb-4 ${
            allAgreed
              ? 'bg-teal-50 border-teal-500'
              : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center">
            <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
              allAgreed
                ? 'bg-teal-500 border-teal-500'
                : 'border-gray-300'
            }`}>
              {allAgreed && (
                <Check className="w-4 h-4 text-white" />
              )}
            </div>
            <span className={`text-base font-medium ${allAgreed ? 'text-teal-700' : 'text-gray-900'}`}>
              전체 동의합니다
            </span>
          </div>
        </button>

        <div className="h-px bg-gray-200 my-4" />

        {/* 개별 약관 */}
        <div className="space-y-3">
          {/* 서비스 이용약관 */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleToggleAgreement('agreeTerms', formData.agreeTerms)
              }}
              className="flex items-center flex-1"
            >
              <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                formData.agreeTerms
                  ? 'bg-teal-500 border-teal-500'
                  : 'border-gray-300'
              }`}>
                {formData.agreeTerms && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
              <span className="text-sm">
                <span className="text-red-500">(필수)</span> 서비스 이용약관
              </span>
            </button>
            <button
              onClick={() => setShowTerms(!showTerms)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <ChevronRight className={`w-4 h-4 transition-transform ${showTerms ? 'rotate-90' : ''}`} />
            </button>
          </div>

          {showTerms && (
            <div className="ml-8 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 max-h-40 overflow-y-auto">
              케어온 서비스 이용약관 내용...
            </div>
          )}

          {/* 개인정보 처리방침 */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleToggleAgreement('agreePrivacy', formData.agreePrivacy)
              }}
              className="flex items-center flex-1"
            >
              <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                formData.agreePrivacy
                  ? 'bg-teal-500 border-teal-500'
                  : 'border-gray-300'
              }`}>
                {formData.agreePrivacy && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
              <span className="text-sm">
                <span className="text-red-500">(필수)</span> 개인정보 수집 및 이용
              </span>
            </button>
            <button
              onClick={() => setShowPrivacy(!showPrivacy)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <ChevronRight className={`w-4 h-4 transition-transform ${showPrivacy ? 'rotate-90' : ''}`} />
            </button>
          </div>

          {showPrivacy && (
            <div className="ml-8 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 max-h-40 overflow-y-auto">
              개인정보 수집 및 이용 동의 내용...
            </div>
          )}

          {/* 마케팅 정보 수신 */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleToggleAgreement('agreeMarketing', formData.agreeMarketing)
              }}
              className="flex items-center flex-1"
            >
              <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                formData.agreeMarketing
                  ? 'bg-teal-500 border-teal-500'
                  : 'border-gray-300'
              }`}>
                {formData.agreeMarketing && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
              <span className="text-sm">
                <span className="text-gray-500">(선택)</span> 마케팅 정보 수신 동의
              </span>
            </button>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-600">
            • 필수 항목에 동의하지 않으면 서비스를 이용할 수 없습니다<br />
            • 선택 항목은 동의하지 않아도 서비스 이용이 가능합니다<br />
            • 약관 내용은 언제든지 확인하실 수 있습니다
          </p>
        </div>
      </div>

      <div className="p-6">
        <CareonButton
          onClick={handleNext}
          variant="teal"
          disabled={!formData.agreeTerms || !formData.agreePrivacy}
          className={(!formData.agreeTerms || !formData.agreePrivacy) ? "opacity-50" : ""}
        >
          다음
        </CareonButton>
      </div>
    </CareonContainer>
  )
}