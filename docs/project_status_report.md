# Care On 프로젝트 현황 보고서

## 📋 프로젝트 개요

**프로젝트명**: Care On  
**버전**: 0.1.1  
**타입**: 케어 서비스를 위한 Next.js 기반 웹 애플리케이션  
**최종 업데이트**: 2025-09-10

## 🏗️ 기술 스택

### 프론트엔드
- **Framework**: Next.js 15.2.4 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4.17
- **UI Components**: 
  - ShadcnUI (Radix UI 기반)
  - Lucide React (아이콘)
  - Framer Motion (애니메이션)
- **Forms**: React Hook Form + Zod (유효성 검사)

### 백엔드 & 데이터베이스
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth + 카카오 OAuth
- **File Storage**: Vercel Blob

### 배포 & 개발 환경
- **Deployment**: Vercel
- **Package Manager**: NPM
- **Development**: Next.js Dev Server

## 📁 프로젝트 구조

\`\`\`
care_on/
├── app/                    # Next.js App Router 페이지
│   ├── admin/             # 관리자 페이지
│   ├── api/               # API 라우트
│   ├── auth/              # 인증 관련 페이지
│   ├── contract/          # 계약 관리
│   ├── manager/           # 매니저 시스템
│   ├── services/          # 서비스 페이지
│   └── ...
├── components/            # 재사용 가능한 컴포넌트
│   ├── ui/               # shadcn/ui 컴포넌트
│   ├── auth/             # 인증 관련 컴포넌트
│   ├── contract/         # 계약 관련 컴포넌트
│   └── ...
├── lib/                  # 유틸리티 라이브러리
├── hooks/                # 커스텀 React 훅
├── docs/                 # 문서
├── supabase/            # Supabase 설정
└── types/               # TypeScript 타입 정의
\`\`\`

## 🚀 주요 기능

### 1. 사용자 기능
- **랜딩 페이지**: 동적 페이지 빌더 기반
- **서비스 소개**: CCTV, 인터넷, 보험 서비스
- **견적 신청**: 실시간 견적 요청
- **리뷰 시스템**: 고객 후기 관리
- **FAQ**: 자주 묻는 질문

### 2. 관리자 기능
- **관리자 대시보드**: `/admin`
- **FAQ 관리**: 질문/답변 CRUD
- **리뷰 관리**: 고객 후기 승인/관리
- **페이지 빌더**: 동적 페이지 편집

### 3. 매니저 시스템
- **견적 관리**: 고객 견적 처리
- **계약 관리**: 계약서 작성 및 관리
- **고객 세션**: 임시 인증 시스템

### 4. 인증 시스템
- **카카오 OAuth**: 소셜 로그인
- **세션 관리**: Supabase Auth
- **권한 관리**: 역할 기반 접근 제어

## 🗄️ 데이터베이스 스키마

### 주요 테이블
1. **careon_applications**: 서비스 신청 정보
2. **contracts**: 계약 정보 및 상태 관리
3. **customer_sessions**: 고객 임시 세션
4. **employees**: 직원 정보
5. **faq**: FAQ 데이터
6. **legal_documents**: 약관 및 법적 문서
7. **media**: 미디어 파일 관리
8. **pages**: 동적 페이지 빌더 데이터
9. **profiles**: 사용자 프로필
10. **reviews**: 고객 리뷰
11. **review_pre**: 승인 대기 리뷰

### 특징
- **RLS (Row Level Security)** 적용
- **UUID 기반 기본 키** 사용
- **JSONB 필드** 활용 (동적 데이터)
- **자동 타임스탬프** 관리

## 📱 페이지 구성

### 공개 페이지
- `/` - 랜딩 페이지
- `/services` - 서비스 소개
- `/products` - 상품 안내
- `/review` - 고객 후기
- `/faq` - 자주 묻는 질문
- `/terms` - 이용약관
- `/privacy` - 개인정보처리방침

### 인증 페이지
- `/auth/login` - 로그인
- `/auth/signup` - 회원가입

### 관리자 페이지
- `/admin` - 관리자 대시보드
- `/admin/faq` - FAQ 관리
- `/admin/reviews` - 리뷰 관리

### 매니저 페이지
- `/manager` - 매니저 대시보드
- `/contract` - 계약 관리

## 🔧 개발 환경 설정

### 필수 환경 변수
\`\`\`bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# 카카오 OAuth
NEXT_PUBLIC_KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=

# Vercel Blob
BLOB_READ_WRITE_TOKEN=
\`\`\`

### 개발 명령어
\`\`\`bash
npm install        # 의존성 설치
npm run dev        # 개발 서버 실행
npm run build      # 프로덕션 빌드
npm run start      # 프로덕션 서버 실행
npm run lint       # ESLint 실행
\`\`\`

## 📊 최근 업데이트 (Git 커밋 이력)

1. **6139f88** - feat: 매니저 견적 시스템 대폭 개선
2. **d4c047b** - fix: 모바일 계약 신청 DB 오류 해결
3. **7f663f3** - fix: useSearchParams를 Suspense boundary로 감싸서 Next.js 15 빌드 에러 해결
4. **6d3c979** - feat: 계약 관리 시스템 통합 - 고객 가입과 매니저 견적 시스템 연동
5. **b019c06** - feat: 계약 시스템 및 매니저 견적 페이지 완성

## 🎯 핵심 특징

### 1. 모던 개발 환경
- Next.js 15 App Router 사용
- TypeScript로 타입 안정성 확보
- Tailwind CSS로 반응형 디자인
- ESLint로 코드 품질 관리

### 2. 확장 가능한 아키텍처
- 컴포넌트 기반 설계
- 재사용 가능한 UI 라이브러리
- API 라우트 분리
- 데이터베이스 RLS 보안

### 3. 사용자 경험
- 반응형 웹 디자인
- 모바일 최적화
- 실시간 견적 시스템
- 직관적인 관리자 인터페이스

### 4. 보안 및 성능
- Supabase RLS 정책 적용
- OAuth 인증 통합
- 이미지 최적화
- SSR/SSG 활용

## 📈 개발 현황

**현재 상태**: 활발히 개발 중  
**주요 개발 영역**: 매니저 견적 시스템, 계약 관리  
**브랜치**: main (메인 브랜치)  
**최종 빌드**: 성공

## 🚀 향후 계획

이 문서는 프로젝트의 현재 상태를 기반으로 작성되었으며, 지속적으로 업데이트될 예정입니다.

---

**문서 생성일**: 2025-09-10  
**생성자**: Claude Code AI Assistant
