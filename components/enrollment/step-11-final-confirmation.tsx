"use client"

import { useState } from "react"
import { CareonContainer } from "@/components/ui/careon-container"
import { CareonButton } from "@/components/ui/careon-button"
import { BackButton } from "@/components/ui/back-button"
import type { FormData } from "@/app/enrollment/page"
import { CheckCircle, AlertCircle } from "lucide-react"

interface StepFinalConfirmationProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: any) => void
  onNext: () => void
  onBack: () => void
}

export default function StepFinalConfirmation({ formData, onNext, onBack }: StepFinalConfirmationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [applicationId, setApplicationId] = useState<string | null>(null)

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

          // Category
          business_category: formData.businessCategory,
          business_subcategory: formData.businessSubcategory || null,
          business_keywords: formData.businessKeywords || [],

          // Sales info (임시 데이터 - 실제로는 다른 스텝에서 수집해야 함)
          monthly_sales: formData.monthlySales || "1000만원 이하",
          card_sales_ratio: formData.cardSalesRatio || 70,
          main_product: formData.mainProduct || formData.businessCategory,
          unit_price: formData.unitPrice || "10000원",

          // Settlement (임시 데이터 - 실제로는 다른 스텝에서 수집해야 함)
          bank_name: formData.bankName || "국민은행",
          account_holder: formData.accountHolder || formData.ownerName,
          account_number: formData.accountNumber || "000-0000-0000",
          settlement_date: formData.settlementDate || "D+2",

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

      // Success! Move to completion
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

      <div className="flex-1 flex flex-col justify-start pt-8 px-6 overflow-y-auto">
        <h1 className="text-2xl font-semibold text-black leading-relaxed mb-6">
          마지막으로<br />
          입력 정보를 확인해주세요
        </h1>

        {/* Summary Sections */}
        <div className="space-y-4 mb-8">
          {/* Business Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-sm text-gray-600 mb-2">사업자 정보</h3>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="text-gray-500">상호명:</span> {formData.businessName}
              </p>
              <p className="text-sm">
                <span className="text-gray-500">사업자번호:</span> {formData.businessNumber}
              </p>
              <p className="text-sm">
                <span className="text-gray-500">대표자:</span> {formData.ownerName}
              </p>
              <p className="text-sm">
                <span className="text-gray-500">연락처:</span> {formData.phoneNumber}
              </p>
            </div>
          </div>

          {/* Sales Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-sm text-gray-600 mb-2">매출 정보</h3>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="text-gray-500">월매출:</span> {formData.monthlySales || "1000만원 이하"}
              </p>
              <p className="text-sm">
                <span className="text-gray-500">카드매출 비율:</span> {formData.cardSalesRatio || 70}%
              </p>
              <p className="text-sm">
                <span className="text-gray-500">주력상품:</span> {formData.mainProduct || formData.businessCategory}
              </p>
            </div>
          </div>

          {/* Settlement Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-sm text-gray-600 mb-2">정산 정보</h3>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="text-gray-500">은행명:</span> {formData.bankName || "국민은행"}
              </p>
              <p className="text-sm">
                <span className="text-gray-500">예금주:</span> {formData.accountHolder || formData.ownerName}
              </p>
              <p className="text-sm">
                <span className="text-gray-500">계좌번호:</span> {formData.accountNumber || "000-0000-0000"}
              </p>
              <p className="text-sm">
                <span className="text-gray-500">정산일:</span> {formData.settlementDate || "D+2"}
              </p>
            </div>
          </div>

          {/* Documents Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-sm text-gray-600 mb-2">제출 서류</h3>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-sm text-green-600">모든 필수 서류가 업로드되었습니다</span>
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
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-sm mb-2">최종 확인</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• 입력하신 정보는 가맹 심사에 사용됩니다</li>
            <li>• 제출 후에는 수정이 불가능합니다</li>
            <li>• 심사 결과는 영업일 기준 3-5일 내 안내됩니다</li>
            <li>• 추가 서류가 필요한 경우 별도 연락드립니다</li>
          </ul>
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