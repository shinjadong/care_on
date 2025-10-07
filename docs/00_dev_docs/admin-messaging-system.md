# 관리자 메시지 발송 시스템 구현 가이드

## 📋 개요

케어온 관리자 메시지 발송 시스템은 SMS와 카카오 알림톡을 통합 관리하는 종합 메시징 플랫폼입니다.

## 🚀 주요 기능

### 1. 통합 메시지 발송
- **SMS/LMS 발송**: 개별 및 대량 발송 지원
- **카카오 알림톡**: 템플릿 기반 발송
- **고객 데이터베이스 연동**: 등록된 고객 선택 발송
- **메시지 이력 추적**: 모든 발송 내역 저장 및 조회

### 2. 고객 선택 기능
- **그룹별 선택**: 전체 고객, 활성 고객, 가입 신청자 등
- **수동 선택**: 개별 고객 선택
- **검색 기능**: 이름, 전화번호, 업체명으로 검색
- **중복 제거**: 자동 중복 전화번호 필터링

### 3. 메시지 이력 관리
- **발송 상태 추적**: 발송, 전달, 실패 상태 관리
- **통계 대시보드**: 발송 통계 실시간 확인
- **필터링 검색**: 날짜, 상태, 메시지 유형별 조회
- **오류 추적**: 실패 원인 저장 및 표시

### 4. 템플릿 관리
- **사전 정의 템플릿**: 자주 사용하는 메시지 저장
- **변수 지원**: 동적 내용 치환
- **승인 상태 관리**: 카카오 알림톡 템플릿 승인 추적

## 📁 시스템 구조

\`\`\`
app/admin/messages/
├── page.tsx                    # 메인 메시지 발송 페이지
├── api/
│   └── admin/
│       └── messages/
│           ├── send/           # 통합 메시지 발송 API
│           ├── history/        # 발송 이력 조회 API
│           ├── batch/          # 대량 발송 API
│           ├── templates/      # 템플릿 관리 API
│           └── customers/      # 고객 조회 API
│
components/admin/messages/
├── MessageHistory.tsx          # 발송 이력 컴포넌트
├── CustomerSelector.tsx        # 고객 선택 컴포넌트
└── TemplateManager.tsx         # 템플릿 관리 컴포넌트
│
lib/ppurio/
├── sms-v2.ts                   # SMS 발송 라이브러리
└── kakao-alimtalk.ts          # 알림톡 발송 라이브러리
│
supabase/migrations/
└── 20250126_create_message_history.sql  # 메시지 이력 테이블
\`\`\`

## 💾 데이터베이스 스키마

### message_history 테이블
\`\`\`sql
- id: 고유 ID
- message_type: SMS/LMS/ALIMTALK
- recipient_phone: 수신자 전화번호
- recipient_name: 수신자 이름
- customer_id: 고객 ID (참조)
- enrollment_id: 가입신청 ID (참조)
- message_content: 메시지 내용
- status: pending/sent/delivered/failed
- error_message: 오류 메시지
- sent_at: 발송 시간
- created_at: 생성 시간
\`\`\`

### message_templates 테이블
\`\`\`sql
- id: 고유 ID
- name: 템플릿 이름
- code: 템플릿 코드
- message_type: SMS/LMS/ALIMTALK
- content: 템플릿 내용
- variables: 변수 정의 (JSON)
- is_active: 활성 상태
- approval_status: 승인 상태
\`\`\`

### message_batch_jobs 테이블
\`\`\`sql
- id: 고유 ID
- job_name: 작업명
- message_type: 메시지 유형
- template_id: 템플릿 ID
- total_recipients: 전체 수신자 수
- sent_count: 발송 성공 수
- failed_count: 발송 실패 수
- status: pending/processing/completed/failed
\`\`\`

## 🔧 설치 및 설정

### 1. 환경 변수 설정
`.env.local` 파일에 다음 환경 변수 추가:

\`\`\`bash
# 뿌리오 SMS/알림톡 API
PPURIO_USERNAME=your_username
PPURIO_API_KEY=your_api_key
PPURIO_SENDER_PROFILE=@your_profile  # 카카오 발신프로필

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

### 2. 데이터베이스 마이그레이션 적용

#### 방법 1: 스크립트 실행
\`\`\`bash
node scripts/apply-message-history-migration.js
\`\`\`

#### 방법 2: Supabase Dashboard SQL Editor
1. Supabase Dashboard > SQL Editor 접속
2. `supabase/migrations/20250126_create_message_history.sql` 파일 내용 복사
3. SQL Editor에 붙여넣기 및 실행

### 3. 카카오 알림톡 템플릿 설정
1. 카카오 비즈니스 채널 관리자 접속
2. 알림톡 템플릿 신청
3. 승인 후 템플릿 코드를 `lib/ppurio/kakao-alimtalk.ts`에 업데이트

## 📱 사용 방법

### 관리자 페이지 접속
\`\`\`
http://localhost:3000/admin/messages
\`\`\`

### SMS 개별 발송
1. "메시지 발송" 탭 선택
2. "SMS 문자" 탭 선택
3. "개별 발송" 선택
4. 수신번호와 메시지 입력
5. "SMS 발송" 버튼 클릭

### SMS 대량 발송
1. "대량 발송" 선택
2. 수신자 선택 방법 선택:
   - 고객 데이터베이스에서 선택
   - 직접 입력
3. 메시지 내용 입력
4. "대량 발송" 버튼 클릭

### 알림톡 발송
1. "카카오 알림톡" 탭 선택
2. 템플릿 유형 선택:
   - 가입 완료
   - 승인 완료
   - 고객 공지
3. 필수 정보 입력
4. "알림톡 발송" 버튼 클릭

### 발송 이력 조회
1. "발송 이력" 탭 선택
2. 필터 옵션 사용:
   - 메시지 유형
   - 상태
   - 날짜 범위
   - 전화번호 검색

## 🔌 API 엔드포인트

### 통합 메시지 발송
\`\`\`typescript
POST /api/admin/messages/send
{
  messageType: "SMS" | "LMS" | "ALIMTALK",
  recipients: [{
    phone: string,
    name?: string,
    customerId?: number,
    variables?: object
  }],
  content: string,
  templateType?: string,
  templateCode?: string,
  variables?: object,
  saveHistory?: boolean
}
\`\`\`

### 발송 이력 조회
\`\`\`typescript
GET /api/admin/messages/history?page=1&limit=20&type=SMS&status=sent
\`\`\`

### 대량 발송 작업 생성
\`\`\`typescript
POST /api/admin/messages/batch
{
  job_name: string,
  message_type: string,
  recipients: array,
  content: string,
  scheduled_at?: string
}
\`\`\`

### 고객 목록 조회
\`\`\`typescript
GET /api/admin/messages/customers?search=홍길동&page=1

POST /api/admin/messages/customers
{
  groupType: "all_customers" | "active_customers" | "pending_enrollments",
  filters: object
}
\`\`\`

### 템플릿 관리
\`\`\`typescript
GET /api/admin/messages/templates?type=ALIMTALK&active=true

POST /api/admin/messages/templates
{
  name: string,
  code?: string,
  message_type: string,
  content: string,
  variables?: object
}
\`\`\`

## 🎨 UI 컴포넌트

### CustomerSelector
고객 선택을 위한 컴포넌트:

\`\`\`tsx
import CustomerSelector from '@/components/admin/messages/CustomerSelector'

<CustomerSelector
  onSelectionChange={(customers) => console.log(customers)}
  selectedCustomers={[]}
/>
\`\`\`

### MessageHistory
발송 이력 표시 컴포넌트:

\`\`\`tsx
import MessageHistory from '@/components/admin/messages/MessageHistory'

<MessageHistory />
\`\`\`

## 🐛 문제 해결

### 메시지 발송 실패
1. 환경 변수 확인 (PPURIO_API_KEY, PPURIO_USERNAME)
2. 전화번호 형식 확인 (하이픈 포함 가능)
3. 메시지 길이 확인 (SMS: 90바이트, LMS: 2000바이트)

### 알림톡 발송 실패
1. 템플릿 승인 상태 확인
2. 발신프로필 설정 확인 (PPURIO_SENDER_PROFILE)
3. 템플릿 변수 매핑 확인

### 데이터베이스 오류
1. Supabase 연결 확인
2. RLS 정책 확인 (현재 비활성화됨)
3. 마이그레이션 적용 상태 확인

## 📊 모니터링

### 발송 통계 확인
- 관리자 페이지에서 실시간 통계 확인
- 전체 발송, 성공, 실패 건수 표시
- 일별/월별 통계 조회 가능

### 오류 추적
- message_history 테이블의 error_message 필드 확인
- 실패한 메시지 재발송 기능
- 오류 패턴 분석 및 개선

## 🔒 보안 고려사항

1. **API 인증**: 모든 API는 관리자 인증 필요
2. **데이터 암호화**: 전화번호 등 개인정보 보호
3. **발송 제한**: 대량 발송 시 레이트 리밋 적용
4. **로그 관리**: 모든 발송 내역 추적 가능

## 📈 향후 개선 사항

1. **예약 발송**: 특정 시간에 자동 발송
2. **MMS 지원**: 이미지 포함 메시지
3. **A/B 테스트**: 메시지 효과 측정
4. **웹훅 연동**: 발송 결과 실시간 알림
5. **대시보드 강화**: 상세 분석 리포트

## 📞 지원

문제 발생 시 다음 경로로 문의:
- GitHub Issues: https://github.com/careon/care_on/issues
- 기술 지원: dev@careon.co.kr
