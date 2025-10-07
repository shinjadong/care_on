import { FormData } from '@/app/enrollment/page'

/**
 * 스텝 옵션 타입 정의
 */
export interface StepOption {
  value: string
  title: string
  description?: string
}

/**
 * 스텝 설정 타입
 */
export interface StepConfig {
  id: string
  name: string
  title: string
  subtitle?: string
  type: 'selection' | 'form' | 'agreement' | 'upload' | 'confirmation' | 'custom'
  component?: string  // 커스텀 컴포넌트 경로 (custom 타입인 경우)
  field?: keyof FormData  // FormData의 필드명
  options?: StepOption[]  // selection 타입인 경우
  validation?: (formData: FormData) => boolean  // validation 함수
  conditional?: (formData: FormData) => boolean  // 조건부 스텝 표시
}

/**
 * Enrollment 전체 스텝 설정
 *
 * 주의사항:
 * - 이 배열의 순서가 실제 스텝 순서입니다
 * - 스텝 추가/삭제/순서 변경은 이 배열만 수정하면 됩니다
 * - type이 'custom'인 경우 component 필드에 경로를 지정해야 합니다
 */
export const enrollmentSteps: StepConfig[] = [
  // Step 0: 약관 동의
  {
    id: 'agreements',
    name: '약관 동의',
    title: '케어온 가입을 위한\n약관 동의가 필요해요',
    subtitle: '서비스 이용을 위해 아래 약관에 동의해주세요',
    type: 'custom',
    component: 'step-0-agreements',
    validation: (formData) => Boolean(formData.agreeTerms && formData.agreePrivacy),
  },

  // Step 1: 대표자 정보
  {
    id: 'owner-info',
    name: '대표자 정보',
    title: '대표자 본인 정보를\n입력해 주세요',
    type: 'custom',
    component: 'step-1-owner-info',
    validation: (formData) => {
      return (
        formData.ownerName.trim() !== "" &&
        formData.birthDate.length === 6 &&
        formData.birthGender.length === 1 &&
        (formData.carrier || "") !== "" &&
        // MVNO(알뜰폰) 선택 시 mvnoCarrier도 필수
        (formData.carrier !== "mvno" || (formData.mvnoCarrier || "") !== "") &&
        formData.phoneNumber.length >= 10
      )
    },
  },

  // Step 1.5: 카드사 동의
  {
    id: 'card-agreements',
    name: '카드사 동의',
    title: '카드사 가맹점 신청 동의',
    type: 'custom',
    component: 'step-1.5-card-agreements-v2',
    validation: (formData) => Boolean(formData.agreeTosspay),
  },

  // Step 2: 연락처 & 사업자 정보
  {
    id: 'contact-business',
    name: '사업자 정보',
    title: '사업자 정보를\n입력해주세요',
    type: 'custom',
    component: 'step-2-contact-business',
    validation: (formData) => {
      return (
        formData.businessName.trim() !== "" &&
        formData.businessNumber.length === 10 &&  // 사업자번호는 정확히 10자리
        formData.email.includes("@")
      )
    },
  },

  // Step 3: 매장 정보
  {
    id: 'store-info',
    name: '매장 정보',
    title: '매장 정보를\n입력해주세요',
    type: 'custom',
    component: 'step-3-store-info',
    validation: (formData) => {
      return (
        formData.storeName.trim() !== "" &&
        formData.storeAddress.trim() !== "" &&
        (formData.storeArea.trim() !== "" || formData.needLocalData === true)
      )
    },
  },

  // Step 4: 신청 유형
  {
    id: 'application-type',
    name: '신청 유형',
    title: '신청 유형을\n선택해 주세요',
    type: 'selection',
    field: 'applicationType',
    options: [
      {
        value: 'new',
        title: '신규 가맹점 가입',
        description: '',
      },
      {
        value: 'multiple',
        title: '복수 가맹점 가입',
        description: '하나의 사업자번호로 여러개 사업장을 운영하려는 경우 신청합니다.',
      },
    ],
    validation: (formData) => formData.applicationType !== '',
  },

  // Step 4.5: 배달앱 서비스
  {
    id: 'delivery-app',
    name: '배달앱 서비스',
    title: '배달앱 신청',
    type: 'custom',
    component: 'step-4.5-delivery-app',
    validation: (formData) => formData.needDeliveryApp !== undefined,
  },

  // Step 5: 사업자 형태
  {
    id: 'business-type',
    name: '사업자 형태',
    title: '사업자 형태 확인이\n필요해요',
    type: 'selection',
    field: 'businessType',
    options: [
      {
        value: '개인사업자',
        title: '개인 사업자 입니다',
      },
      {
        value: '법인사업자',
        title: '법인 사업자 입니다',
      },
    ],
    validation: (formData) => formData.businessType !== '',
  },

  // Step 6: 대표자 구성
  {
    id: 'ownership-type',
    name: '대표자 구성',
    title: '공동 대표자 여부 확인이\n필요해요',
    type: 'selection',
    field: 'ownershipType',
    options: [
      {
        value: 'single',
        title: '단독 대표자입니다',
      },
      {
        value: 'joint',
        title: '공동 대표자 입니다',
      },
    ],
    validation: (formData) => formData.ownershipType !== '',
  },

  // Step 7: 인허가 업종
  {
    id: 'license-type',
    name: '인허가 업종',
    title: '해당하는 인허가 업종 유형을\n알려주세요',
    type: 'selection',
    field: 'licenseType',
    options: [
      {
        value: 'food',
        title: '요식 업종(영업신고증 보유)',
      },
      {
        value: 'other',
        title: '기타 업종(영업신고증 보유)',
      },
      {
        value: 'none',
        title: '인허가 대상 업종이 아니에요',
      },
    ],
    validation: (formData) => formData.licenseType !== '',
  },

  // Step 8: 직종
  {
    id: 'business-category',
    name: '직종',
    title: '직종이\n무엇인가요?',
    type: 'selection',
    field: 'businessCategory',
    options: [
      {
        value: 'accommodation_food',
        title: '숙박 및 음식업',
      },
      {
        value: 'wholesale_retail',
        title: '도소매업',
      },
      {
        value: 'manufacturing',
        title: '제조업',
      },
      {
        value: 'other',
        title: '기타',
      },
    ],
    validation: (formData) => formData.businessCategory !== '',
  },

  // Step 8.7: 매출 정보
  {
    id: 'sales-info',
    name: '매출 정보',
    title: '매출 정보',
    type: 'custom',
    component: 'step-8.7-sales-info',
    validation: (formData) => {
      return (
        formData.monthlySales !== '' &&
        formData.mainProduct.trim() !== '' &&
        formData.unitPrice !== ''
      )
    },
  },

  // Step 8.3: 인터넷/CCTV 현황
  {
    id: 'internet-cctv-check',
    name: '시설 현황',
    title: '인터넷/CCTV 현황',
    type: 'custom',
    component: 'step-8.3-internet-cctv-check',
    validation: (formData) => {
      return (
        formData.hasInternet !== undefined &&
        formData.hasCCTV !== undefined
      )
    },
  },

  // Step 8.5: 무료 서비스
  {
    id: 'free-service',
    name: '무료 서비스',
    title: '무료 서비스 신청',
    type: 'custom',
    component: 'step-8.5-free-service',
    validation: (formData) => formData.wantFreeService !== undefined,
  },

  // Step 9.5: 1차 완료
  {
    id: 'first-completion',
    name: '1차 완료',
    title: '1차 정보 입력 완료',
    type: 'custom',
    component: 'step-9.5-first-completion',
    validation: () => true,
  },

  // Step 9.3: 정산 정보
  {
    id: 'settlement-info',
    name: '정산 정보',
    title: '정산 계좌 정보를\n입력해주세요',
    type: 'custom',
    component: 'step-9.3-settlement-info',
    validation: (formData) => {
      return (
        formData.bankName !== '' &&
        formData.accountHolder.trim() !== '' &&
        formData.accountNumber.trim() !== ''
      )
    },
  },

  // Step 10: 서류 업로드
  {
    id: 'document-upload',
    name: '서류 업로드',
    title: '필요 서류를\n업로드해주세요',
    type: 'custom',
    component: 'step-10-document-upload',
    validation: (formData) => {
      // 기본 서류 (필수)
      const hasBasicDocs =
        formData.businessRegistrationUrl !== null &&
        formData.idCardFrontUrl !== null &&
        formData.idCardBackUrl !== null &&
        formData.bankbookUrl !== null

      // 법인사업자인 경우 추가 서류 필요
      if (formData.businessType === '법인사업자') {
        return hasBasicDocs &&
          formData.corporateRegistrationUrl !== null &&
          formData.shareholderListUrl !== null
      }

      return hasBasicDocs
    },
  },

  // Step 11: 최종 확인
  {
    id: 'final-confirmation',
    name: '최종 확인',
    title: '입력하신 정보를\n최종 확인해주세요',
    type: 'custom',
    component: 'step-11-final-confirmation',
    validation: () => true,
  },

  // Step 12: 완료
  {
    id: 'success',
    name: '완료',
    title: '신청이 완료되었습니다',
    type: 'custom',
    component: 'step-12-success',
    validation: () => true,
  },
]

/**
 * 스텝 ID로 스텝 설정 찾기
 */
export function getStepById(id: string): StepConfig | undefined {
  return enrollmentSteps.find(step => step.id === id)
}

/**
 * 현재 스텝의 다음 스텝 찾기 (조건부 스텝 고려)
 */
export function getNextStep(currentIndex: number, formData: FormData): number {
  let nextIndex = currentIndex + 1

  while (nextIndex < enrollmentSteps.length) {
    const nextStep = enrollmentSteps[nextIndex]

    // 조건부 스텝인 경우 조건 확인
    if (nextStep.conditional && !nextStep.conditional(formData)) {
      nextIndex++
      continue
    }

    return nextIndex
  }

  return currentIndex // 마지막 스텝
}

/**
 * 전체 스텝 수 반환 (조건부 스텝 제외)
 */
export function getTotalSteps(formData: FormData): number {
  return enrollmentSteps.filter(step =>
    !step.conditional || step.conditional(formData)
  ).length
}

/**
 * 현재 스텝의 진행률 계산
 */
export function getProgress(currentIndex: number, formData: FormData): number {
  const totalSteps = getTotalSteps(formData)
  const currentStep = currentIndex + 1
  return Math.round((currentStep / totalSteps) * 100)
}
