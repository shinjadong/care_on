import { FormData } from '@/app/enrollment/page'

/**
 * FormData 초기값 정의
 * 모든 필드의 기본값을 한 곳에서 관리
 */
export const initialFormData: FormData = {
  // Agreement fields
  agreeTerms: false,
  agreePrivacy: false,
  agreeMarketing: false,
  agreeTosspay: false as string | boolean,  // string | boolean 지원
  agreedCardCompanies: "",

  // Step 1 - 대표자 정보
  ownerName: "",
  representativeName: "",
  birthDate: "",
  birthGender: "",
  gender: undefined,
  carrier: "",
  mvnoCarrier: "",

  // Step 2 - 연락처 & 사업자 정보
  phoneNumber: "",
  businessName: "",
  businessNumber: "",
  email: "",
  businessAddress: "",
  businessDetailAddress: "",

  // Step 3 - 매장 정보
  storeName: "",
  storeAddress: "",
  storePostcode: "",
  storeArea: "",
  needLocalData: false,

  // Step 4 - 신청 유형
  applicationType: "",

  // Step 4.5 - 배달앱
  needDeliveryApp: false as string | boolean,  // string | boolean 지원

  // Step 5 - 사업자 형태
  businessType: "",

  // Step 6 - 대표자 구성
  ownershipType: "",

  // Step 7 - 인허가 업종
  licenseType: "",

  // Step 8 - 직종
  businessCategory: "",
  businessSubcategory: "",
  businessKeywords: [],

  // Step 8.3 - 인터넷/CCTV 현황
  hasInternet: false as string | boolean,  // string | boolean 지원
  hasCCTV: false as string | boolean,  // string | boolean 지원

  // Step 8.5 - 무료 서비스
  wantFreeService: false as string | boolean,  // string | boolean 지원

  // Sales information
  monthlySales: "",
  cardSalesRatio: 50,
  mainProduct: "",
  unitPrice: "",

  // Settlement information
  bankName: "",
  accountHolder: "",
  accountNumber: "",

  // Additional services
  additionalServices: [],
  referralCode: "",

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
}

/**
 * 새로운 FormData 인스턴스 생성
 * 초기값의 복사본을 반환하여 불변성 유지
 */
export function createFormData(): FormData {
  return { ...initialFormData }
}

/**
 * FormData를 초기 상태로 리셋
 */
export function resetFormData(): FormData {
  return createFormData()
}

/**
 * FormData의 특정 필드 그룹만 리셋
 */
export function resetFormDataGroup(current: FormData, group: 'agreements' | 'documents' | 'all'): FormData {
  switch (group) {
    case 'agreements':
      return {
        ...current,
        agreeTerms: false,
        agreePrivacy: false,
        agreeMarketing: false,
        agreeTosspay: false,
        agreedCardCompanies: "",
      }
    case 'documents':
      return {
        ...current,
        businessRegistrationUrl: null,
        idCardFrontUrl: null,
        idCardBackUrl: null,
        bankbookUrl: null,
        businessLicenseUrl: null,
        signPhotoUrl: null,
        doorClosedUrl: null,
        doorOpenUrl: null,
        interiorUrl: null,
        productUrl: null,
        businessCardUrl: null,
        corporateRegistrationUrl: null,
        shareholderListUrl: null,
        sealCertificateUrl: null,
        sealUsageUrl: null,
      }
    case 'all':
    default:
      return resetFormData()
  }
}
