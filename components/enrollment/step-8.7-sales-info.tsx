"use client"

import { useState, useEffect } from "react"
import { CareonContainer } from "@/components/ui/careon-container"
import { CareonButton } from "@/components/ui/careon-button"
import { CareonInput } from "@/components/ui/careon-input"
import { BackButton } from "@/components/ui/back-button"
import type { FormData } from "@/app/enrollment/page"
import { AlertCircle } from "lucide-react"

interface StepSalesInfoProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: any) => void
  onNext: () => void
  onBack: () => void
}

export default function StepSalesInfo({ formData, updateFormData, onNext, onBack }: StepSalesInfoProps) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isNewBusiness, setIsNewBusiness] = useState(false)

  // 초기값 설정
  useEffect(() => {
    if (!formData.cardSalesRatio && formData.cardSalesRatio !== 0) {
      updateFormData('cardSalesRatio', 50)
    }
    // Check if it's a new business from previous steps
    if (formData.monthlySales === "신규사업자") {
      setIsNewBusiness(true)
    }
  }, [])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    // Skip validation for monthly sales if new business
    if (!isNewBusiness && !formData.monthlySales) {
      newErrors.monthlySales = "월매출을 선택해주세요"
    }

    if (!formData.mainProduct || formData.mainProduct.length < 2) {
      newErrors.mainProduct = "주력 상품/서비스를 2자 이상 입력해주세요"
    }

    if (!formData.unitPrice || formData.unitPrice === "0") {
      newErrors.unitPrice = "평균 단가를 입력해주세요"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    // Set default values for new businesses
    if (isNewBusiness) {
      updateFormData('monthlySales', '신규사업자')
    }

    if (validateForm()) {
      onNext()
    }
  }

  const handleNewBusinessToggle = () => {
    setIsNewBusiness(!isNewBusiness)
    if (!isNewBusiness) {
      // Setting as new business
      updateFormData('monthlySales', '신규사업자')
      updateFormData('cardSalesRatio', 0)
    } else {
      // Unsetting new business
      updateFormData('monthlySales', '')
      updateFormData('cardSalesRatio', 50)
    }
  }

  const formatNumber = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^\d]/g, '')
    // Add comma separators
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const handlePriceChange = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '')
    updateFormData('unitPrice', numericValue)
  }

  return (
    <CareonContainer>
      <div className="flex items-center justify-start p-4 pb-0">
        <BackButton onClick={onBack} />
      </div>

      <div className="flex-1 flex flex-col justify-start pt-8 px-6 overflow-y-auto">
        <h1 className="text-2xl font-semibold text-black leading-relaxed mb-2">
          매출 정보를<br />
          입력해주세요
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          정확한 카드 수수료 산정을 위해 필요합니다
        </p>

        <div className="space-y-6">
          {/* 신규 사업자 체크박스 */}
          <div className="bg-blue-50 rounded-lg p-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isNewBusiness}
                onChange={handleNewBusinessToggle}
                className="mr-3 w-5 h-5 text-[#148777] border-gray-300 rounded focus:ring-[#148777]"
              />
              <div className="flex-1">
                <span className="font-medium text-gray-900">신규 사업자입니다</span>
                <p className="text-xs text-gray-600 mt-0.5">
                  아직 영업을 시작하지 않은 경우 선택해주세요
                </p>
              </div>
            </label>
          </div>

          {/* 월매출 선택 */}
          <div className={isNewBusiness ? 'opacity-50 pointer-events-none' : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              월평균 매출액
            </label>
            <select
              value={formData.monthlySales || ""}
              onChange={(e) => updateFormData('monthlySales', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.monthlySales ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-[#148777] focus:border-transparent`}
            >
              <option value="">선택해주세요</option>
              <option value="1000만원 이하">1000만원 이하</option>
              <option value="1000-3000만원">1000만원 ~ 3000만원</option>
              <option value="3000-5000만원">3000만원 ~ 5000만원</option>
              <option value="5000만원-1억원">5000만원 ~ 1억원</option>
              <option value="1억원 이상">1억원 이상</option>
            </select>
            {errors.monthlySales && (
              <p className="mt-1 text-xs text-red-500">{errors.monthlySales}</p>
            )}
            {isNewBusiness && (
              <p className="mt-1 text-xs text-blue-600 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                신규 사업자는 매출 정보를 입력하지 않아도 됩니다
              </p>
            )}
          </div>

          {/* 카드매출 비율 */}
          <div className={isNewBusiness ? 'opacity-50 pointer-events-none' : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카드 매출 비율
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="100"
                value={formData.cardSalesRatio || 50}
                onChange={(e) => updateFormData('cardSalesRatio', Number(e.target.value))}
                className="flex-1 accent-[#148777]"
              />
              <span className="text-lg font-semibold text-[#148777] w-16 text-right">
                {formData.cardSalesRatio || 50}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              전체 매출 중 카드 결제 비율
            </p>
          </div>

          {/* 주력 상품/서비스 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              주력 상품/서비스
            </label>
            <CareonInput
              placeholder="예: 커피, 베이커리"
              value={formData.mainProduct || ""}
              onChange={(value) => updateFormData('mainProduct', value)}
              error={errors.mainProduct}
            />
            {errors.mainProduct && (
              <p className="mt-1 text-xs text-red-500">{errors.mainProduct}</p>
            )}
          </div>

          {/* 평균 단가 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              평균 단가
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="10,000"
                value={formatNumber(formData.unitPrice || "")}
                onChange={(e) => handlePriceChange(e.target.value)}
                className={`w-full py-4 px-0 border-0 border-b ${
                  errors.unitPrice ? 'border-red-500' : 'border-gray-200'
                } bg-transparent text-base text-black placeholder-gray-400 focus:border-[#148777] focus:outline-none transition-colors duration-200`}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                원
              </span>
            </div>
            {errors.unitPrice && (
              <p className="mt-1 text-xs text-red-500">{errors.unitPrice}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              고객 1인당 평균 결제 금액
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