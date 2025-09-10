# 케어온 계약 관리 시스템 흐름

## 시스템 개요
케어온 서비스의 고객 가입부터 견적 확정까지의 전체 프로세스를 관리하는 시스템입니다.

## 주요 구성 요소

### 1. 데이터베이스 구조 (Supabase)
- **contracts 테이블**: 모든 계약 정보를 저장하는 핵심 테이블
  - 고객 정보: business_name, owner_name, phone, email, address 등
  - 서비스 정보: internet_plan, cctv_count, installation_address 등
  - 결제 정보: bank_name, account_number, account_holder
  - 이미지 정보: bank_account_image, id_card_image, business_registration_image
  - 계약 정보: contract_period, free_period, status
  - 시스템 정보: customer_number (자동생성), contract_number, created_at, updated_at

### 2. 상태 관리 (Status)
- **pending**: 신청접수 (초기 상태)
- **quoted**: 견적완료 (매니저가 견적 확정 후)
- **approved**: 승인
- **active**: 활성
- **suspended**: 일시중지
- **terminated**: 해지
- **completed**: 완료

## 전체 프로세스 흐름

### 1단계: 고객 간편 가입
**페이지**: `/app/contract/page.tsx`
**API**: `/api/contract/route.ts`

1. 고객이 카카오톡 링크를 통해 계약 페이지 접속
2. 필수 정보 입력:
   - 사업자 기본 정보
   - 서비스 선택 (인터넷 요금제, CCTV 대수)
   - 결제 정보
   - 필수 서류 업로드
3. 약관 동의 후 제출
4. 시스템이 자동으로 고객번호 생성 (예: CO123456)
5. contracts 테이블에 'pending' 상태로 저장

### 2단계: 매니저 계약 관리
**페이지**: `/app/manager/contracts/page.tsx`
**API**: `/api/manager/contracts/route.ts`

1. 매니저가 전체 계약 목록 확인
2. 상태별 필터링 가능 (pending, quoted, active 등)
3. 검색 기능 (사업체명, 대표자명, 전화번호, 고객번호)
4. 'pending' 상태의 계약에 대해 "견적 작성" 버튼 표시

### 3단계: 매니저 견적 작성
**페이지**: `/app/manager/quote/page.tsx`
**API**: 
- 검색: `/api/contract/search/route.ts`
- 업데이트: `/api/contract/update/route.ts`

1. 고객 검색:
   - 이름 + 전화번호로 검색
   - 또는 고객번호로 직접 검색 (계약 목록에서 링크 클릭 시)
2. 고객 정보 및 제출 서류 확인
3. 맞춤 견적 작성:
   - 인터넷 서비스 요금 확정
   - CCTV 서비스 요금 확정
   - 추가 서비스 (POS 등) 선택
   - 계약 조건 설정 (무료 기간, 계약 기간, 할인율)
4. 견적서 전송 버튼 클릭
5. contracts 테이블 업데이트:
   - 서비스 정보 및 요금 저장
   - status를 'quoted'로 변경
   - processed_by, processed_at 기록

### 4단계: 고객 견적 확인 및 확정
(향후 구현 예정)
1. 고객에게 카카오톡으로 견적서 발송
2. 고객이 견적 확인 및 승인
3. status를 'approved'로 변경
4. 실제 서비스 설치 후 'active'로 변경

## API 엔드포인트 정리

### 1. `/api/contract` (POST)
- 고객 계약 정보 신규 등록
- 고객번호 자동 생성
- pending 상태로 저장

### 2. `/api/contract/search` (POST)
- 고객 정보 검색
- 검색 조건: 이름+전화번호 또는 고객번호
- 계약 정보 및 견적 정보 반환

### 3. `/api/contract/update` (POST)
- 매니저가 견적 정보 업데이트
- 서비스 요금 및 조건 저장
- status를 'quoted'로 변경

### 4. `/api/contract/update` (GET)
- 계약 정보 단일 조회
- contract_id 또는 customer_number로 조회

### 5. `/api/manager/contracts` (GET)
- 전체 계약 목록 조회
- 필터링: status, search
- 페이지네이션 지원

## 주요 특징

1. **자동 번호 생성**
   - customer_number: 수파베이스 함수로 자동 생성
   - contract_number: customer_number 기반으로 생성

2. **이미지 관리**
   - 필수 서류 3종 URL 저장
   - 향후 스토리지 연동 필요

3. **견적 세부사항**
   - admin_notes 필드에 JSON 형태로 추가 정보 저장
   - 매니저 메모, 할인 정보, 추가 서비스 등

4. **상태 추적**
   - 각 단계별 상태 관리
   - 처리자 및 처리 시간 기록

## 향후 개선사항

1. **고객 포털**
   - 고객이 자신의 계약 상태 확인
   - 견적서 온라인 확인 및 승인

2. **알림 시스템**
   - 카카오톡 API 연동
   - 상태 변경 시 자동 알림

3. **문서 관리**
   - Supabase Storage 연동
   - 파일 업로드 및 관리 개선

4. **권한 관리**
   - 매니저 로그인 시스템
   - 역할별 접근 권한 설정

5. **리포팅**
   - 계약 통계 대시보드
   - 매출 분석 기능