# 🚀 CareOn 관리자 시스템 개선 기획서

> 작성일: 2025-01-26
> 작성자: CareOn 개발팀
> 버전: 1.0.0

## 📋 목차

1. [개요](#개요)
2. [현황 분석](#현황-분석)
3. [개선 목표](#개선-목표)
4. [개선 로드맵](#개선-로드맵)
5. [상세 구현 계획](#상세-구현-계획)
6. [기대 효과](#기대-효과)

## 개요

### 프로젝트 배경

CareOn 관리자 시스템은 현재 기본적인 CRUD 기능은 구현되어 있으나, 실제 운영에 필요한 핵심 기능들이 부족한 상태입니다. 이를 체계적으로 개선하여 운영 효율성을 극대화하고자 합니다.

### 프로젝트 목적

- 실시간 데이터 기반 의사결정 지원
- 업무 자동화를 통한 운영 효율성 향상
- 체계적인 권한 관리로 보안성 강화
- 데이터 기반 비즈니스 인사이트 제공

## 현황 분석

### 📊 현재 구조

\`\`\`
app/admin/
├── dashboard/        ✅ 기본 구현 (하드코딩 데이터)
├── customers/        ✅ 기본 CRUD
├── enrollments/      ✅ 목록 조회 (승인 프로세스 미구현)
├── billing/          ⚠️ 미구현
├── cs-tickets/       ⚠️ 미구현
├── products/         ⚠️ 미구현
├── quotes/           ⚠️ 미구현
└── reviews/          ✅ 기본 구현
\`\`\`

### 🔴 주요 문제점

1. **데이터 연동 부재**: API 미연결, 하드코딩된 데이터
2. **인증/권한 없음**: 누구나 접근 가능한 보안 취약점
3. **워크플로우 미완성**: 승인, 정산 등 핵심 프로세스 부재
4. **모니터링 불가**: 실시간 알림, 경고 시스템 없음

## 개선 목표

### 🎯 핵심 목표

- **30일 내**: 핵심 기능 구현 완료
- **60일 내**: 자동화 시스템 구축
- **90일 내**: 분석/리포트 기능 완성

### 📈 KPI

- 관리 업무 처리 시간 50% 단축
- 데이터 정확도 99% 이상 유지
- 시스템 가용성 99.9% 달성

## 개선 로드맵

### 🔥 Phase 1: 긴급 개선 (1-2주)

#### 1단계: API 연결 및 데이터 플로우 구축

- [ ]  Dashboard Stats API 구현
- [ ]  Customer CRUD API 완성
- [ ]  Enrollment 승인 API 구현
- [ ]  Billing Summary API 구축

#### 2단계: 인증 시스템 구축

- [ ]  Supabase Auth 관리자 로그인
- [ ]  역할 기반 권한 관리 (RBAC)
- [ ]  Protected Routes 구현
- [ ]  Session 관리

### ⚡ Phase 2: 중요 개선 (3-4주)

#### 3단계: 핵심 워크플로우 자동화

- [ ]  가입 신청 → 검토 → 승인 프로세스
- [ ]  청구서 생성 → 발송 → 수금 관리
- [ ]  CS 티켓 접수 → 처리 → 종결

#### 4단계: 대시보드 고도화

- [ ]  실시간 차트/그래프 (Chart.js)
- [ ]  알림 시스템 구현
- [ ]  커스터마이징 위젯

### 💎 Phase 3: 선택적 개선 (5-8주)

#### 5단계: CRM 고도화

- [ ]  고객 세그먼트 관리
- [ ]  고객 히스토리 통합 뷰
- [ ]  자동 케어 스케줄링
- [ ]  대량 커뮤니케이션

#### 6단계: 분석 및 리포트

- [ ]  자동 리포트 생성
- [ ]  데이터 내보내기
- [ ]  BI 대시보드

## 상세 구현 계획

### 1단계: API 연결 및 데이터 플로우 구축 (즉시 시작)

#### 1.1 Dashboard Stats API

\`\`\`typescript
// app/api/dashboard/stats/route.ts
export async function GET() {
  const supabase = createClient()

  // 실시간 통계 조회
  const [customers, contracts, tickets, billing] = await Promise.all([
    supabase.from('customers').select('*', { count: 'exact' }),
    supabase.from('contracts').select('*', { count: 'exact' }),
    supabase.from('cs_tickets').select('*', { count: 'exact' }),
    supabase.from('billing').select('amount').gte('date', startOfMonth)
  ])

  return NextResponse.json({ stats: { ... } })
}
\`\`\`

#### 1.2 Customer Management API

\`\`\`typescript
// app/api/admin/customers/route.ts
- GET: 고객 목록 조회 (페이지네이션, 필터, 검색)
- POST: 신규 고객 등록
- PUT: 고객 정보 수정
- DELETE: 고객 삭제 (soft delete)
\`\`\`

#### 1.3 Enrollment Approval API

\`\`\`typescript
// app/api/admin/enrollments/[id]/approve/route.ts
export async function POST(request, { params }) {
  // 1. 신청 정보 검증
  // 2. 필수 서류 확인
  // 3. 승인 처리
  // 4. 고객 계정 생성
  // 5. 환영 이메일/SMS 발송
}
\`\`\`

#### 1.4 Billing Summary API

\`\`\`typescript
// app/api/admin/billing/summary/route.ts
- 월별 청구 요약
- 연체 현황
- 수금 예정
- 정산 대기
\`\`\`

### 2단계: 인증 시스템 구축

#### 2.1 관리자 역할 정의

\`\`\`sql
-- supabase/migrations/admin_roles.sql
CREATE TYPE admin_role AS ENUM ('super_admin', 'admin', 'cs_manager', 'viewer');

CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role admin_role NOT NULL DEFAULT 'viewer',
  department TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

#### 2.2 RLS 정책 설정

\`\`\`sql
-- Row Level Security 정책
CREATE POLICY "Super admin can do everything" ON admin_users
  FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "Admin can manage customers" ON customers
  FOR ALL USING (auth.jwt() ->> 'role' IN ('super_admin', 'admin'));

CREATE POLICY "CS manager can view and update tickets" ON cs_tickets
  FOR SELECT, UPDATE USING (auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'cs_manager'));
\`\`\`

#### 2.3 Protected Route Middleware

\`\`\`typescript
// app/admin/middleware.ts
export function middleware(request: NextRequest) {
  const session = await getSession()

  if (!session || !session.user.role) {
    return NextResponse.redirect('/admin/login')
  }

  // 역할별 접근 제어
  const path = request.nextUrl.pathname
  const role = session.user.role

  if (path.startsWith('/admin/billing') && role === 'viewer') {
    return NextResponse.redirect('/admin/unauthorized')
  }
}
\`\`\`

### 3단계: 핵심 워크플로우 자동화

#### 3.1 가입 신청 워크플로우

\`\`\`mermaid
graph LR
    A[신청 접수] --> B[서류 검토]
    B --> C{승인 여부}
    C -->|승인| D[계정 생성]
    C -->|거절| E[거절 통지]
    D --> F[온보딩 시작]
    F --> G[서비스 활성화]
\`\`\`

#### 3.2 청구/정산 워크플로우

\`\`\`mermaid
graph LR
    A[월초 청구서 생성] --> B[자동 발송]
    B --> C[결제 대기]
    C --> D{결제 완료?}
    D -->|Yes| E[정산 처리]
    D -->|No| F[연체 알림]
    F --> G[수금 활동]
\`\`\`

### 데이터베이스 스키마 개선

#### 필요한 새 테이블

\`\`\`sql
-- 대시보드 캐시 테이블
CREATE TABLE dashboard_cache (
  id SERIAL PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value JSONB,
  calculated_at TIMESTAMP DEFAULT NOW()
);

-- 활동 로그 테이블
CREATE TABLE activity_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 알림 테이블
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

## 기대 효과

### 📊 정량적 효과

- **업무 처리 시간**: 50% 단축 (8시간 → 4시간)
- **데이터 정확도**: 99% 이상 유지
- **고객 응대 시간**: 30% 개선
- **월간 운영 비용**: 20% 절감

### 💡 정성적 효과

- 실시간 의사결정 지원
- 체계적인 고객 관리
- 투명한 업무 프로세스
- 직원 만족도 향상

## 구현 일정

### Week 1-2: Phase 1 (긴급 개선)

- [ ]  Day 1-3: API 설계 및 구현
- [ ]  Day 4-6: 데이터베이스 마이그레이션
- [ ]  Day 7-9: 인증 시스템 구축
- [ ]  Day 10-12: 테스트 및 디버깅

### Week 3-4: Phase 2 (중요 개선)

- [ ]  Week 3: 워크플로우 자동화
- [ ]  Week 4: 대시보드 고도화

### Week 5-8: Phase 3 (선택적 개선)

- [ ]  Week 5-6: CRM 기능 고도화
- [ ]  Week 7-8: 분석/리포트 시스템

## 기술 스택

### Frontend

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- ShadcnUI
- Chart.js / Recharts
- Tanstack Query

### Backend

- Supabase (PostgreSQL)
- Edge Functions
- Real-time Subscriptions
- Row Level Security

### DevOps

- Vercel (Hosting)
- GitHub Actions (CI/CD)
- Sentry (Error Tracking)
- Posthog (Analytics)

## 리스크 관리

### 잠재 리스크

1. **데이터 마이그레이션 실패**: 백업 및 롤백 계획 수립
2. **성능 저하**: 캐싱 전략 및 최적화
3. **보안 취약점**: 정기적인 보안 감사
4. **사용자 저항**: 단계적 전환 및 교육

### 대응 방안


- 단계적 배포 (Staged Rollout)
- A/B 테스팅
- 실시간 모니터링
- 정기적인 백업

## 다음 단계

1. **즉시 시작**: Dashboard Stats API 구현
2. **내일**: Customer Management API 완성
3. **이번 주**: 인증 시스템 기본 구축
4. **다음 주**: 워크플로우 자동화 시작

---

*이 문서는 지속적으로 업데이트됩니다.*
*최종 수정: 2025-01-26*
