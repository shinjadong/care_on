# care_on 프로젝트 개요

## 프로젝트 타입
B2B 서비스 플랫폼 - 통합 매장 관리 솔루션

## 기술 스택

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.7
- **UI Library**: React 19
- **State Management**: Zustand + TanStack Query (React Query)
- **Form**: React Hook Form
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS + Framer Motion

### Backend
- **API Layer**: tRPC 11
- **ORM**: Prisma 5.22
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage / Vercel Blob
- **Validation**: Zod

### Architecture
- **Pattern**: Clean Architecture
- **Structure**: Monorepo (Turborepo 고려)
- **Separation**: apps/ + packages/

## 핵심 도메인 모듈

### 1. Enrollment (고객 등록)
- 12단계 다단계 폼 (Wizard)
- 자동 임시저장 (useAutoSave)
- 관리자 승인/반려 워크플로우
- 서류 업로드 (Supabase Storage)

### 2. Product / Supplier (상품 및 공급업체)
- 상품 CRUD
- 패키지 구성 (여러 상품 묶음)
- 할인 정책 관리
- 카테고리 필터링

### 3. Estimate / Contract (견적 및 계약)
- 견적 산출
- 전자서명
- 계약 상태 관리 (pending → quoted → approved → active)
- 이름/전화번호 기반 본인 인증

### 4. Payment (결제 및 구독)
- 월별 청구서 자동 생성
- 벤더 송금 관리
- 미납 추적
- 영수증 발행

### 5. AI Blog (AI 컨텐츠 생성)
- OpenAI API 연동
- 블로그 포스트 자동 생성
- 이미지 업로드
- 생성 히스토리

## 주요 디렉토리 구조

```
care_on-clean/
├── app/                    # Next.js App Router
│   ├── enrollment/        # 고객 등록
│   ├── products/          # 상품 목록/상세
│   ├── my/                # 고객 포털 (견적 확인)
│   ├── admin/             # 관리자 페이지
│   └── api/               # API Routes
├── components/            # React 컴포넌트
│   ├── enrollment/
│   ├── ui/                # Radix UI 래퍼
│   └── providers/         # Context Providers
├── lib/                   # 유틸리티
│   └── supabase/         # Supabase 클라이언트
├── prisma/                # Prisma 스키마
├── docs/                  # 문서
└── scripts/               # 유틸리티 스크립트
```

## 데이터베이스 주요 테이블

- `enrollment_applications` - 고객 신청서
- `customers` - 고객 정보
- `contracts` - 계약/견적
- `products` - 상품
- `packages` - 패키지 상품
- `contract_items` - 계약 상품 구성
- `billing_records` - 청구 기록
- `remittance_records` - 송금 기록
- `ai_blog_posts` - AI 블로그 포스트

## 개발 가이드

### 클린 아키텍처 원칙
1. **단일 책임** - 각 모듈/컴포넌트는 하나의 책임만
2. **계층 분리** - UI / 비즈니스 로직 / 인프라 분리
3. **느슨한 결합** - 도메인 간 의존성 최소화
4. **의존성 역전** - 추상화에 의존

### 컴포넌트 설계
- **Server Components**: 초기 데이터 로딩, SEO 최적화
- **Client Components**: 인터랙션, 상태 관리
- **Props 기반**: 재사용성 극대화
- **단일 책임**: 한 컴포넌트 = 한 가지 역할

### API 설계
- RESTful 경로 구조
- tRPC 절차: 타입 안전성
- 에러 처리: 적절한 HTTP 상태 코드
- 권한 검증: 사용자/관리자 분리

### 상태 관리
- **Server State**: TanStack Query (캐싱)
- **Client State**: Zustand (전역) / useState (로컬)
- **Form State**: React Hook Form
- **URL State**: Next.js useSearchParams

## 배포 환경
- Vercel (예상)
- Supabase Cloud
- Environment Variables 필수
