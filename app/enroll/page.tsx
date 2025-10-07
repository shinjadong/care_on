"use client"

// Customer enrollment form
import { useState, useEffect, useRef } from "react"
import StepAgreements from "@/components/enrollment/step-0-agreements"
import StepOwnerInfo from "@/components/enrollment/step-1-owner-info"
import StepCardAgreements from "@/components/enrollment/step-1.5-card-agreements-v2"
import StepContactBusiness from "@/components/enrollment/step-2-contact-business"
import StepStoreInfo from "@/components/enrollment/step-3-store-info"
import StepApplicationType from "@/components/enrollment/step-4-application-type"
import StepDeliveryApp from "@/components/enrollment/step-4.5-delivery-app"
import StepBusinessType from "@/components/enrollment/step-5-business-type"
import StepOwnershipType from "@/components/enrollment/step-6-ownership-type"
import StepLicenseType from "@/components/enrollment/step-7-license-type"
import StepBusinessCategory from "@/components/enrollment/step-8-business-category"
import StepSalesInfo from "@/components/enrollment/step-8.7-sales-info"
import StepInternetCCTVCheck from "@/components/enrollment/step-8.3-internet-cctv-check"
import StepFreeService from "@/components/enrollment/step-8.5-free-service"
import StepSettlementInfo from "@/components/enrollment/step-9.3-settlement-info"
import StepFirstCompletion from "@/components/enrollment/step-9.5-first-completion"
import StepDocumentUpload from "@/components/enrollment/step-10-document-upload"
import StepFinalConfirmation from "@/components/enrollment/step-11-final-confirmation"
import StepSuccess from "@/components/enrollment/step-12-success"
import { useAutoSave } from "@/hooks/useAutoSave"

export type FormData = {
  // Agreement fields
  agreeTerms?: boolean
  agreePrivacy?: boolean
  agreeMarketing?: boolean
  agreeTosspay: string | boolean
  agreedCardCompanies?: string

  // Step 1 - 대표자 정보
  ownerName: string
  representativeName?: string  // alias for ownerName
  birthDate: string
  birthGender: string
  gender?: 'male' | 'female'  // formatted gender
  carrier?: string  // 통신사
  mvnoCarrier?: string  // 알뜰폰 통신사

  // Step 2 - 연락처 & 사업자 정보
  phoneNumber: string
  businessName: string
  businessNumber: string
  email: string
  businessAddress?: string  // alias for storeAddress
  businessDetailAddress?: string  // additional address detail

  // Step 3 - 매장 정보
  storeName: string
  storeAddress: string
  storePostcode: string
  storeArea: string
  needLocalData?: boolean  // 매장 면적을 모르는 경우

  // Step 4 - 신청 유형
  applicationType: string

  // Step 4.5 - 배달앱
  needDeliveryApp: string | boolean

  // Step 5 - 사업자 형태
  businessType: string

  // Step 6 - 대표자 구성
  ownershipType: string

  // Step 7 - 인허가 업종
  licenseType: string

  // Step 8 - 직종
  businessCategory: string
  businessSubcategory?: string
  businessKeywords?: string[]

  // Step 8.3 - 인터넷/CCTV 현황
  hasInternet: string | boolean
  hasCCTV: string | boolean

  // Step 8.5 - 무료 서비스
  wantFreeService: string | boolean

  // Sales information
  monthlySales: string
  cardSalesRatio: number
  mainProduct: string
  unitPrice: string

  // Settlement information
  bankName: string
  accountHolder: string
  accountNumber: string

  // Additional services
  additionalServices?: string[]
  referralCode?: string

  // Step 10 - 서류 업로드
  // 기본 서류
  businessRegistrationUrl: string | null
  idCardFrontUrl: string | null
  idCardBackUrl: string | null
  bankbookUrl: string | null
  businessLicenseUrl: string | null

  // 사업장 사진
  signPhotoUrl: string | null
  doorClosedUrl: string | null
  doorOpenUrl: string | null
  interiorUrl: string | null
  productUrl: string | null
  businessCardUrl: string | null

  // 법인 추가 서류
  corporateRegistrationUrl: string | null
  shareholderListUrl: string | null
  sealCertificateUrl: string | null
  sealUsageUrl: string | null
}

export default function EnrollmentPage() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [initialLoad, setInitialLoad] = useState(true)
  const [formData, setFormData] = useState<FormData>({
    // Agreements
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false,
    agreeTosspay: false,
    // Step 1
    ownerName: "",
    birthDate: "",
    birthGender: "",
    // Step 2
    phoneNumber: "",
    businessName: "",
    businessNumber: "",
    email: "",
    // Step 3
    storeName: "",
    storeAddress: "",
    storePostcode: "",
    storeArea: "",
    // Step 4
    applicationType: "",
    // Step 4.5
    needDeliveryApp: false,
    // Step 5
    businessType: "",
    // Step 6
    ownershipType: "",
    // Step 7
    licenseType: "",
    // Step 8
    businessCategory: "",
    // Step 8.5
    hasInternet: false,
    hasCCTV: false,
    wantFreeService: false,
    // Sales information
    monthlySales: "",
    cardSalesRatio: 50,
    mainProduct: "",
    unitPrice: "",
    // Settlement information
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    // Step 10 - 기본 서류
    businessRegistrationUrl: null,
    idCardFrontUrl: null,
    idCardBackUrl: null,
    bankbookUrl: null,
    businessLicenseUrl: null,
    // 사업장 사진
    signPhotoUrl: null,
    doorClosedUrl: null,
    doorOpenUrl: null,
    interiorUrl: null,
    productUrl: null,
    businessCardUrl: null,
    // 법인 추가 서류
    corporateRegistrationUrl: null,
    shareholderListUrl: null,
    sealCertificateUrl: null,
    sealUsageUrl: null,
  })

  // Auto-save functionality
  const { lastSaved, isSaving, loadDraft, clearDraft } = useAutoSave(formData, true)

  // Load saved draft on mount
  useEffect(() => {
    if (initialLoad) {
      const savedDraft = loadDraft()
      if (savedDraft) {
        // Check if user wants to restore
        const shouldRestore = window.confirm(
          "이전에 작성하던 내용이 있습니다. 불러오시겠습니까?"
        )
        if (shouldRestore) {
          setFormData(savedDraft)
        } else {
          clearDraft()
        }
      }
      setInitialLoad(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLoad])

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // 스텝 컴포넌트 배열 - 순서를 쉽게 변경할 수 있음
  const stepComponents = [
    { component: StepAgreements, name: "약관 동의" },
    { component: StepOwnerInfo, name: "대표자 정보" },
    { component: StepCardAgreements, name: "카드사 동의" },
    { component: StepContactBusiness, name: "사업자 정보" },
    { component: StepStoreInfo, name: "매장 정보" },
    { component: StepApplicationType, name: "신청 유형" },
    { component: StepDeliveryApp, name: "배달앱 서비스" },
    { component: StepBusinessType, name: "사업자 형태" },
    { component: StepOwnershipType, name: "대표자 구성" },
    { component: StepLicenseType, name: "인허가 업종" },
    { component: StepBusinessCategory, name: "직종" },
    { component: StepSalesInfo, name: "매출 정보" },
    { component: StepInternetCCTVCheck, name: "시설 현황" },
    { component: StepFreeService, name: "무료 서비스" },
    { component: StepFirstCompletion, name: "1차 완료" },
    { component: StepSettlementInfo, name: "정산 정보" },
    { component: StepDocumentUpload, name: "서류 업로드" },
    { component: StepFinalConfirmation, name: "최종 확인" },
    { component: StepSuccess, name: "완료" },
  ]

  const handleNext = () => {
    if (currentStepIndex < stepComponents.length - 1) {
      setCurrentStepIndex((prev) => prev + 1)
      // 페이지 최상단으로 스크롤
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1)
      // 페이지 최상단으로 스크롤
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleReset = () => {
    // Clear auto-saved draft when resetting
    clearDraft()
    setCurrentStepIndex(0)
    setFormData({
      // Agreements
      agreeTerms: false,
      agreePrivacy: false,
      agreeMarketing: false,
      agreeTosspay: false,
      ownerName: "",
      birthDate: "",
      birthGender: "",
      phoneNumber: "",
      businessName: "",
      businessNumber: "",
      email: "",
      storeName: "",
      storeAddress: "",
      storePostcode: "",
      storeArea: "",
      applicationType: "",
      needDeliveryApp: false,
      businessType: "",
      ownershipType: "",
      licenseType: "",
      businessCategory: "",
      hasInternet: false,
      hasCCTV: false,
      wantFreeService: false,
      // Sales information
      monthlySales: "",
      cardSalesRatio: 50,
      mainProduct: "",
      unitPrice: "",
      // Settlement information
      bankName: "",
      accountHolder: "",
      accountNumber: "",
      // 기본 서류
      businessRegistrationUrl: null,
      idCardFrontUrl: null,
      idCardBackUrl: null,
      bankbookUrl: null,
      businessLicenseUrl: null,
      // 사업장 사진
      signPhotoUrl: null,
      doorClosedUrl: null,
      doorOpenUrl: null,
      interiorUrl: null,
      productUrl: null,
      businessCardUrl: null,
      // 법인 추가 서류
      corporateRegistrationUrl: null,
      shareholderListUrl: null,
      sealCertificateUrl: null,
      sealUsageUrl: null,
    })
  }

  const CurrentStep = stepComponents[currentStepIndex].component

  return (
    <>
      <CurrentStep
        formData={formData}
        updateFormData={updateFormData}
        onNext={currentStepIndex === stepComponents.length - 1 ? handleReset : handleNext}
        onBack={handleBack}
      />
      {/* Auto-save indicator */}
      {lastSaved && (
        <div className="fixed bottom-4 right-4 z-50 bg-gray-800/90 text-white px-3 py-1.5 rounded-lg text-xs backdrop-blur-sm">
          {isSaving ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              저장 중...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              저장됨
            </div>
          )}
        </div>
      )}
    </>
  )
}
