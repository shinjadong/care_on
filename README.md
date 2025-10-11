# CareOn Clean Architecture

처음부터 올바르게 구축된 Next.js 비즈니스 플랫폼

## 🎯 프로젝트 개요

**CareOn Clean**은 Clean Architecture와 Domain-Driven Design 원칙을 엄격히 준수하여 처음부터 올바르게 구축된 창업자 종합 비즈니스 플랫폼입니다.

### 핵심 특징

- ✅ **Clean Architecture**: 계층 분리와 의존성 규칙을 엄격히 준수
- ✅ **Domain-Driven Design**: 비즈니스 도메인을 중심으로 한 설계
- ✅ **Type Safety**: TypeScript + Prisma + tRPC로 완전한 타입 안전성
- ✅ **Zero Technical Debt**: 첫날부터 프로덕션 품질 코드

## 🏗️ 아키텍처

```
Framework (Next.js, React)
    ↓
Adapters (tRPC, Controllers)
    ↓
Use Cases (비즈니스 로직)
    ↓
Entities (도메인 모델)
```

## 🚀 빠른 시작

### 1. 환경 설정

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일을 열어 실제 값으로 수정
```

### 2. 데이터베이스 설정

```bash
# Prisma Client 생성
npx prisma generate

# 데이터베이스에 스키마 푸시 (개발 환경)
npx prisma db push

# 또는 마이그레이션 생성 (프로덕션 권장)
npx prisma migrate dev --name init
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

## 📂 프로젝트 구조

```
care_on_clean/
├── app/                          # Next.js App Router
│   ├── api/trpc/                # tRPC HTTP handler
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
│
├── components/                   # React Components
│   ├── ui/                      # Base UI components
│   └── providers/               # React providers (tRPC, etc.)
│
├── lib/                         # Core Application Code
│   ├── domain/                  # 도메인 계층
│   │   ├── enrollment/          # Enrollment domain
│   │   ├── product/             # Product domain
│   │   ├── customer/            # Customer domain
│   │   ├── contract/            # Contract domain
│   │   └── review/              # Review domain
│   │
│   ├── application/             # Use Cases 계층
│   ├── infrastructure/          # Infrastructure 계층
│   │   ├── database/            # Prisma repositories
│   │   ├── storage/             # Vercel Blob
│   │   └── external/            # External services
│   │
│   └── presentation/            # Presentation 계층
│       └── api/trpc/            # tRPC setup
│           ├── context.ts       # tRPC context
│           ├── trpc.ts          # tRPC instance
│           └── routers/         # tRPC routers
│
├── prisma/
│   └── schema.prisma            # Database schema
│
├── CLAUDE.md                    # AI 개발 가이드
└── package.json
```

## 🎨 도메인 모듈

### 1. Enrollment (가맹점 신청)
- 11단계 가입 프로세스
- 카드사 약관 동의 관리
- 서류 업로드 및 검증

### 2. Product (상품 관리)
- 제품 및 패키지 관리
- 공급업체 관계
- 가격 및 재고 정책

### 3. Customer (고객 관리)
- 사업자 정보 관리
- 고객 라이프사이클
- 인증 및 권한

### 4. Contract (계약 관리)
- 서비스 계약 생성
- 결제 및 정산
- 계약 갱신

### 5. Review (리뷰 시스템)
- 리뷰 작성 및 승인
- 평점 집계
- 리뷰 분석

## 🛠️ 기술 스택

### Core
- **Next.js 15** - App Router, Server Components
- **TypeScript 5** - Strict mode
- **React 19** - Latest features

### Data Layer
- **PostgreSQL** - Relational database
- **Prisma 5** - Type-safe ORM
- **Zod** - Runtime validation

### API Layer
- **tRPC** - End-to-end type safety
- **React Query** - Server state management

### UI
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Component library
- **Radix UI** - Headless primitives

### Infrastructure
- **Vercel Blob** - File storage
- **Supabase Auth** - Authentication
- **Ppurio** - SMS service (Korean)
- **TossPay** - Payment gateway

## 📝 개발 명령어

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Database
npx prisma studio        # Visual database editor
npx prisma generate      # Generate Prisma Client
npx prisma db push       # Push schema (dev)
npx prisma migrate dev   # Create migration
npx prisma migrate deploy # Deploy migration (prod)

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript type checking
```

## 🎓 개발 가이드

### 새 기능 추가하기

1. **Domain Entity 정의** (`lib/domain/[domain]/entities/`)
2. **Repository Interface 생성** (`lib/domain/[domain]/repositories/`)
3. **Use Case 구현** (`lib/domain/[domain]/usecases/`)
4. **Repository 구현** (`lib/infrastructure/database/repositories/`)
5. **tRPC Router 생성** (`lib/presentation/api/trpc/routers/`)
6. **UI Component 작성** (`components/`, `app/`)

자세한 가이드는 [CLAUDE.md](./CLAUDE.md) 참조

### SOLID 원칙

- **S**ingle Responsibility: 각 클래스/함수는 하나의 책임만
- **O**pen/Closed: 확장에는 열려있고 수정에는 닫혀있게
- **L**iskov Substitution: 인터페이스 계약 준수
- **I**nterface Segregation: 필요한 인터페이스만 의존
- **D**ependency Inversion: 추상화에 의존

## 🔐 환경 변수

필수 환경 변수는 `.env.example` 파일 참조

```bash
# Database
DATABASE_URL="postgresql://..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."

# Storage
BLOB_READ_WRITE_TOKEN="..."

# External Services
PPURIO_API_KEY="..."
TOSSPAY_CLIENT_ID="..."
```

## 📚 참고 문서

- [CLAUDE.md](./CLAUDE.md) - AI 개발 가이드 (필독!)
- [아키텍쳐/care_on 핵심 도메인 모듈 구현 명세서.md](./아키텍쳐/care_on%20핵심%20도메인%20모듈%20구현%20명세서.md) - 상세 구현 명세
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [tRPC Documentation](https://trpc.io/docs)

## 🚨 중요 규칙

1. **NO direct Prisma in use cases** - 항상 repository interface 사용
2. **NO business logic in components** - 오직 presentation 로직만
3. **NO skipping validation** - 모든 입력은 Zod로 검증
4. **NO mixing Korean/English** - Ubiquitous Language 준수
5. **NO shortcuts** - Clean Architecture 엄격히 준수

## 📖 License

MIT

## 👥 Contributing

이 프로젝트는 Clean Architecture 교육 및 참조 목적으로 만들어졌습니다.
