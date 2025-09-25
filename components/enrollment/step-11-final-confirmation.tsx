"use client"

import { useState } from "react"
import { CareonContainer } from "@/components/ui/careon-container"
import { CareonButton } from "@/components/ui/careon-button"
import { BackButton } from "@/components/ui/back-button"
import type { FormData } from "@/app/enrollment/page"
import { useAutoSave } from "@/hooks/useAutoSave"
import {
  CheckCircle,
  AlertCircle,
  Building2,
  TrendingUp,
  FileCheck,
  Banknote
} from "lucide-react"

interface StepFinalConfirmationProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: any) => void
  onNext: () => void
  onBack: () => void
}

export default function StepFinalConfirmation({ formData, onNext, onBack }: StepFinalConfirmationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [, setApplicationId] = useState<string | null>(null)

  // Clear auto-saved draft when successful submission
  const { clearDraft } = useAutoSave(formData, false) // false to prevent saving on this step

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // First, save the application
      const response = await fetch('/api/enrollment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Agreement data
          agree_terms: formData.agreeTerms || false,
          agree_privacy: formData.agreePrivacy || false,
          agree_marketing: formData.agreeMarketing || false,
          agree_tosspay: Boolean(formData.agreeTosspay),
          agreed_card_companies: formData.agreedCardCompanies,

          // Business type
          business_type: formData.businessType,

          // Representative info
          representative_name: formData.ownerName,
          phone_number: formData.phoneNumber,
          birth_date: formData.birthDate,
          gender: formData.birthGender === 'male' ? 'male' : formData.birthGender === 'female' ? 'female' : null,

          // Business info
          business_name: formData.businessName,
          business_number: formData.businessNumber,
          business_address: formData.storeAddress,
          business_detail_address: formData.storeArea,
          store_area: formData.storeArea,
          need_local_data: formData.needLocalData || false,

          // Category
          business_category: formData.businessCategory,
          business_subcategory: formData.businessSubcategory || null,
          business_keywords: formData.businessKeywords || [],

          // Sales info
          monthly_sales: formData.monthlySales,
          card_sales_ratio: formData.cardSalesRatio,
          main_product: formData.mainProduct,
          unit_price: formData.unitPrice,

          // Settlement
          bank_name: formData.bankName,
          account_holder: formData.accountHolder,
          account_number: formData.accountNumber,

          // Services
          additional_services: formData.additionalServices || [],
          referral_code: formData.referralCode || null,

          // Document URLs
          business_registration_url: formData.businessRegistrationUrl,
          id_card_front_url: formData.idCardFrontUrl,
          id_card_back_url: formData.idCardBackUrl,
          bankbook_url: formData.bankbookUrl,
          business_license_url: formData.businessLicenseUrl,
          sign_photo_url: formData.signPhotoUrl,
          door_closed_url: formData.doorClosedUrl,
          door_open_url: formData.doorOpenUrl,
          interior_url: formData.interiorUrl,
          product_url: formData.productUrl,
          business_card_url: formData.businessCardUrl,

          // Corporate documents (if applicable)
          corporate_registration_url: formData.corporateRegistrationUrl,
          shareholder_list_url: formData.shareholderListUrl,
          seal_certificate_url: formData.sealCertificateUrl,
          seal_usage_url: formData.sealUsageUrl,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '신청서 저장에 실패했습니다.')
      }

      const result = await response.json()
      setApplicationId(result.data.id)

      // Now submit the application for review
      const submitResponse = await fetch('/api/enrollment/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: result.data.id }),
      })

      if (!submitResponse.ok) {
        const error = await submitResponse.json()
        throw new Error(error.error || '신청서 제출에 실패했습니다.')
      }

      // Success! Clear draft and move to success screen
      clearDraft()
      onNext()
    } catch (error) {
      console.error('Submit error:', error)
      setSubmitError(error instanceof Error ? error.message : '신청서 제출 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <CareonContainer>
      <div className="flex items-center justify-start p-4 pb-0">
        <BackButton onClick={onBack} />
      </div>

      <div className="p-6">
        <h1 className="text-2xl font-semibold text-black leading-relaxed mb-6">
          마지막으로<br />
          입력 정보를 확인해주세요
        </h1>

        {/* Summary Sections */}
        <div className="space-y-4 mb-8">
          {/* Business Info */}
          <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl p-5 border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base text-gray-900 mb-3">사업자 정보</h3>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 min-w-20">상호명</span>
                    <span className="text-sm font-medium text-gray-900">{formData.businessName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 min-w-20">사업자번호</span>
                    <span className="text-sm font-medium text-gray-900">{formData.businessNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 min-w-20">대표자</span>
                    <span className="text-sm font-medium text-gray-900">{formData.ownerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 min-w-20">연락처</span>
                    <span className="text-sm font-medium text-gray-900">{formData.phoneNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sales Info */}
          <div className="bg-gradient-to-r from-green-50 to-white rounded-xl p-5 border border-green-100">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base text-gray-900 mb-3">매출 정보</h3>
                <div className="grid grid-cols-1 gap-2">
                  {formData.monthlySales === "신규사업자" ? (
                    <div className="bg-blue-50 rounded-lg px-3 py-2">
                      <p className="text-sm font-medium text-blue-700">
                        🆕 신규 사업자 (매출 실적 없음)
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 min-w-20">월매출</span>
                        <span className="text-sm font-medium text-gray-900">{formData.monthlySales}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 min-w-20">카드비율</span>
                        <span className="text-sm font-medium text-gray-900">{formData.cardSalesRatio}%</span>
                      </div>
                    </>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 min-w-20">주력상품</span>
                    <span className="text-sm font-medium text-gray-900">{formData.mainProduct}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 min-w-20">평균단가</span>
                    <span className="text-sm font-medium text-gray-900">{formData.unitPrice}원</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Settlement Info */}
          <div className="bg-gradient-to-r from-purple-50 to-white rounded-xl p-5 border border-purple-100">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Banknote className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base text-gray-900 mb-3">정산 정보</h3>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 min-w-20">은행명</span>
                    <span className="text-sm font-medium text-gray-900">{formData.bankName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 min-w-20">예금주</span>
                    <span className="text-sm font-medium text-gray-900">{formData.accountHolder}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 min-w-20">계좌번호</span>
                    <span className="text-sm font-medium text-gray-900">{formData.accountNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Status */}
          <div className="bg-gradient-to-r from-emerald-50 to-white rounded-xl p-5 border border-emerald-100">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <FileCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base text-gray-900 mb-3">제출 서류</h3>
                <div className="bg-emerald-50 rounded-lg px-4 py-3 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-emerald-800">모든 필수 서류가 준비되었습니다</p>
                    <p className="text-xs text-emerald-600 mt-0.5">사업자등록증, 신분증, 통장사본 등</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {submitError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{submitError}</p>
          </div>
        )}

        {/* Terms Agreement */}
        <div className="mb-8 bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-xl p-6 border border-indigo-100">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-base text-gray-900">최종 확인 사항</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <span className="text-indigo-500 mt-0.5">✓</span>
              <p className="text-sm text-gray-700">입력하신 정보는 <span className="font-medium">가맹 심사</span>에 사용됩니다</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-indigo-500 mt-0.5">✓</span>
              <p className="text-sm text-gray-700">제출 후에는 <span className="font-medium">수정이 불가능</span>합니다</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-indigo-500 mt-0.5">✓</span>
              <p className="text-sm text-gray-700">심사 결과는 <span className="font-medium">영업일 기준 3-5일</span> 내 안내됩니다</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-indigo-500 mt-0.5">✓</span>
              <p className="text-sm text-gray-700">추가 서류가 필요한 경우 <span className="font-medium">별도 연락</span>드립니다</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 pt-0">
        <CareonButton
          onClick={handleSubmit}
          variant="teal"
          disabled={isSubmitting}
          className={isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              제출 중...
            </div>
          ) : (
            "신청서 제출하기"
          )}
        </CareonButton>

        <p className="text-xs text-center text-gray-500 mt-3">
          제출하기를 누르면 약관에 동의하는 것으로 간주됩니다
        </p>
      </div>
    </CareonContainer>
  )
}