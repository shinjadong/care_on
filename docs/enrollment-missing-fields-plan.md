# 가입 신청서 누락 필드 추가 기획서

## 1. 현황 분석

### 누락된 필드 목록
현재 최종 확인 페이지에는 표시되지만 실제 입력받지 않아 하드코딩된 더미 데이터로 처리되는 필드들:

#### 매출 정보
- `monthlySales`: 월매출 (현재 기본값: "1000만원 이하")
- `cardSalesRatio`: 카드매출 비율 (현재 기본값: 70%)
- `mainProduct`: 주력상품 (현재 기본값: businessCategory로 대체)
- `unitPrice`: 평균 단가 (현재 기본값: "10000원")

#### 정산 정보
- `bankName`: 은행명 (현재 기본값: "국민은행")
- `accountHolder`: 예금주 (현재 기본값: ownerName으로 대체)
- `accountNumber`: 계좌번호 (현재 기본값: "000-0000-0000")
- `settlementDate`: 정산일 (현재 기본값: "D+2")

## 2. 구현 계획

### 2.1 새로운 스텝 컴포넌트 추가

#### Step 8.7: 매출 정보 입력 (step-8.7-sales-info.tsx)
- **위치**: 직종 선택(step-8) 후, 시설 현황(step-8.3) 전
- **입력 필드**:
  1. 월평균 매출액 (드롭다운)
     - 1000만원 이하
     - 1000만원 ~ 3000만원
     - 3000만원 ~ 5000만원
     - 5000만원 ~ 1억원
     - 1억원 이상
  2. 카드 매출 비율 (슬라이더: 0~100%)
  3. 주력 상품/서비스 (텍스트 입력)
  4. 평균 단가 (숫자 입력 + 원 단위)

#### Step 9.3: 정산 정보 입력 (step-9.3-settlement-info.tsx)
- **위치**: 1차 완료(step-9.5) 후, 서류 업로드(step-10) 전
- **입력 필드**:
  1. 은행명 (드롭다운)
     - 국민은행, 신한은행, 우리은행, 하나은행, 기업은행
     - 농협은행, 수협은행, SC제일은행, 케이뱅크, 카카오뱅크, 토스뱅크 등
  2. 예금주 (텍스트 입력, 기본값: ownerName)
  3. 계좌번호 (텍스트 입력 with 하이픈 자동 포맷팅)
  4. 정산 주기 선택 (라디오 버튼)
     - D+1 (익영업일)
     - D+2 (2영업일)
     - D+3 (3영업일)
     - 주간 정산
     - 월간 정산

### 2.2 파일 구조

```
components/enrollment/
├── step-8.7-sales-info.tsx       # 매출 정보 입력
├── step-9.3-settlement-info.tsx  # 정산 정보 입력
└── ... (기존 파일들)
```

### 2.3 FormData 타입 업데이트

```typescript
// 기존 optional 필드를 required로 변경
export type FormData = {
  // ... 기존 필드들 ...

  // Sales information (required)
  monthlySales: string
  cardSalesRatio: number
  mainProduct: string
  unitPrice: string

  // Settlement information (required)
  bankName: string
  accountHolder: string
  accountNumber: string
  settlementDate: string

  // ... 기존 필드들 ...
}
```

### 2.4 스텝 순서 업데이트

```typescript
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
  { component: StepSalesInfo, name: "매출 정보" },        // NEW
  { component: StepInternetCCTVCheck, name: "시설 현황" },
  { component: StepFreeService, name: "무료 서비스" },
  { component: StepFirstCompletion, name: "1차 완료" },
  { component: StepSettlementInfo, name: "정산 정보" },   // NEW
  { component: StepDocumentUpload, name: "서류 업로드" },
  { component: StepFinalConfirmation, name: "최종 확인" },
  { component: StepConfirmation, name: "완료" },
]
```

## 3. API 업데이트

### 3.1 step-11-final-confirmation.tsx 수정
- 61-71번 라인의 임시 데이터 처리 부분 제거
- formData에서 실제 입력받은 값 사용

```typescript
// Before (임시 데이터)
monthly_sales: formData.monthlySales || "1000만원 이하",
card_sales_ratio: formData.cardSalesRatio || 70,

// After (실제 데이터)
monthly_sales: formData.monthlySales,
card_sales_ratio: formData.cardSalesRatio,
```

### 3.2 초기값 설정
app/enrollment/page.tsx의 초기 formData에 새 필드 추가:

```typescript
const [formData, setFormData] = useState<FormData>({
  // ... 기존 필드들 ...

  // 매출 정보
  monthlySales: "",
  cardSalesRatio: 50, // 기본값 50%
  mainProduct: "",
  unitPrice: "",

  // 정산 정보
  bankName: "",
  accountHolder: "",
  accountNumber: "",
  settlementDate: "D+2", // 기본값 D+2

  // ... 기존 필드들 ...
})
```

## 4. 유효성 검증

### 4.1 매출 정보 검증
- monthlySales: 필수 선택
- cardSalesRatio: 0-100 범위
- mainProduct: 최소 2자 이상
- unitPrice: 숫자만 허용, 0보다 큰 값

### 4.2 정산 정보 검증
- bankName: 필수 선택
- accountHolder: 최소 2자 이상
- accountNumber: 계좌번호 포맷 검증 (숫자와 하이픈만)
- settlementDate: 필수 선택

## 5. UX 개선사항

### 5.1 자동 입력 기능
- 예금주는 기본적으로 대표자명으로 자동 입력
- 주력상품은 선택한 업종 카테고리를 기반으로 예시 제공

### 5.2 입력 도움말
- 각 필드마다 적절한 플레이스홀더와 도움말 제공
- 카드 매출 비율 슬라이더에 현재 값 표시
- 계좌번호 입력 시 하이픈 자동 포맷팅

### 5.3 진행 표시
- 전체 스텝 중 현재 위치 표시 (예: 12/19)
- 진행률 바 추가

## 6. 구현 우선순위

1. **Phase 1**: 매출 정보 스텝 구현 (step-8.7-sales-info.tsx)
2. **Phase 2**: 정산 정보 스텝 구현 (step-9.3-settlement-info.tsx)
3. **Phase 3**: FormData 타입 및 초기값 업데이트
4. **Phase 4**: step-11-final-confirmation.tsx 수정
5. **Phase 5**: 유효성 검증 및 UX 개선

## 7. 테스트 시나리오

1. 새로운 스텝들이 올바른 순서로 표시되는지 확인
2. 입력 필드 유효성 검증 동작 확인
3. 최종 확인 페이지에 실제 입력값이 표시되는지 확인
4. API 제출 시 모든 필드가 정상적으로 전송되는지 확인
5. 뒤로가기 시 입력값이 유지되는지 확인

## 8. 예상 소요 시간

- 컴포넌트 개발: 2시간
- FormData 및 API 연동: 1시간
- 테스트 및 디버깅: 1시간
- **총 예상 시간: 4시간**