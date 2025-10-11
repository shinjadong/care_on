# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🎯 Project Overview

**CareOn Clean Architecture** - Next.js 기반 창업자 종합 비즈니스 플랫폼

This is a **greenfield project built from scratch** using Clean Architecture principles, Domain-Driven Design (DDD), and modern TypeScript practices. The legacy `care_on` repository serves only as reference; this project implements everything cleanly from the ground up.

### Core Philosophy

- **Clean Architecture**: Strict layer separation (Entities → Use Cases → Adapters → Framework)
- **Domain-Driven Design**: Business domains as first-class modules
- **SOLID Principles**: Applied rigorously across all layers
- **Type Safety**: End-to-end type safety with TypeScript, Prisma, tRPC, Zod
- **No Compromises**: No technical debt from day one

---

## 🏗️ Clean Architecture Structure

```
┌─────────────────────────────────────────────────────────┐
│  Framework Layer (Next.js, React, UI)                  │
│  - app/ (pages, layouts, Server/Client Components)     │
│  - components/ (presentational React components)        │
└────────────────────┬────────────────────────────────────┘
                     │ depends on ↓
┌────────────────────▼────────────────────────────────────┐
│  Interface Adapters (Controllers, Presenters)          │
│  - app/api/ (tRPC route handlers)                      │
│  - lib/presentation/ (API controllers, DTOs)            │
└────────────────────┬────────────────────────────────────┘
                     │ depends on ↓
┌────────────────────▼────────────────────────────────────┐
│  Use Cases (Application Business Logic)                │
│  - lib/application/ (orchestration layer)               │
│  - Coordinates domain entities and repositories         │
└────────────────────┬────────────────────────────────────┘
                     │ depends on ↓
┌────────────────────▼────────────────────────────────────┐
│  Entities (Domain Models & Business Rules)             │
│  - lib/domain/ (pure TypeScript, no dependencies)       │
│  - Core business objects and domain logic               │
└─────────────────────────────────────────────────────────┘
```

### Dependency Rule

**CRITICAL**: Dependencies ONLY point inward. Inner layers NEVER import from outer layers.

✅ **Allowed**: Framework → Adapters → Use Cases → Entities
❌ **Forbidden**: Entities → Use Cases, Use Cases → Adapters, etc.

---

## 📂 Project Structure

```
care_on_clean/
├── app/                          # Next.js 15 App Router (Framework Layer)
│   ├── (routes)/
│   │   ├── enrollment/          # Merchant enrollment pages
│   │   ├── products/            # Product catalog pages
│   │   ├── admin/               # Admin dashboard
│   │   └── my/                  # User dashboard
│   ├── api/
│   │   └── trpc/
│   │       └── [trpc]/          # tRPC HTTP handler
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
│
├── components/                   # Presentation Components
│   ├── ui/                      # Base UI components (shadcn/ui)
│   ├── enrollment/              # Enrollment-specific UI
│   ├── product/                 # Product-specific UI
│   └── common/                  # Shared components
│
├── lib/                         # Core Application Code
│   ├── domain/                  # 🎯 DOMAIN LAYER (Core)
│   │   ├── enrollment/
│   │   │   ├── entities/
│   │   │   │   ├── EnrollmentApplication.ts
│   │   │   │   └── types.ts
│   │   │   ├── repositories/
│   │   │   │   └── IEnrollmentRepository.ts  # Interface only
│   │   │   ├── usecases/
│   │   │   │   ├── CreateEnrollment.ts
│   │   │   │   ├── SubmitEnrollment.ts
│   │   │   │   └── ApproveEnrollment.ts
│   │   │   └── validation/
│   │   │       └── enrollmentSchema.ts       # Zod schemas
│   │   ├── product/
│   │   │   ├── entities/
│   │   │   │   ├── Product.ts
│   │   │   │   └── Package.ts
│   │   │   ├── repositories/
│   │   │   │   └── IProductRepository.ts
│   │   │   └── usecases/
│   │   ├── customer/
│   │   ├── contract/
│   │   └── review/
│   │
│   ├── application/             # 🎯 USE CASES LAYER
│   │   └── services/            # Cross-domain orchestration
│   │
│   ├── infrastructure/          # 🎯 INFRASTRUCTURE LAYER
│   │   ├── database/
│   │   │   ├── prisma/
│   │   │   │   └── client.ts   # Prisma client singleton
│   │   │   └── repositories/
│   │   │       ├── PrismaEnrollmentRepository.ts
│   │   │       └── PrismaProductRepository.ts
│   │   ├── storage/
│   │   │   └── VercelBlobStorage.ts
│   │   └── external/
│   │       ├── ppurio/          # SMS service
│   │       └── tosspay/         # Payment gateway
│   │
│   ├── presentation/            # 🎯 ADAPTERS LAYER
│   │   ├── api/
│   │   │   └── trpc/
│   │   │       ├── context.ts   # tRPC context
│   │   │       └── routers/
│   │   │           ├── enrollment.ts
│   │   │           ├── product.ts
│   │   │           └── _app.ts  # Root router
│   │   └── dto/                 # Data Transfer Objects
│   │
│   └── shared/                  # Shared Utilities
│       ├── utils/
│       ├── types/
│       └── constants/
│
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Database migrations
│
├── public/                      # Static assets
├── types/                       # Global TypeScript types
├── .env.local                   # Environment variables
├── package.json
└── tsconfig.json
```

---

## 🎨 Domain-Driven Design

### Core Domains

1. **Enrollment** - 가맹점 신청 및 승인 워크플로우
   - 11단계 가입 프로세스
   - 카드사 약관 동의 관리
   - 서류 업로드 및 검증
   - **중요**: Canvas 도메인의 Single Source of Truth

2. **Product** - 상품 카탈로그 관리
   - 제품 및 패키지 관리
   - 공급업체 관계
   - 가격 및 재고 정책

3. **Customer** - 고객 정보 관리
   - 사업자 정보 관리
   - 고객 라이프사이클
   - 인증 및 권한

4. **Contract** - 계약 관리
   - 서비스 계약 생성
   - 결제 및 정산
   - 계약 갱신

5. **Review** - 리뷰 시스템
   - 리뷰 작성 및 승인
   - 평점 집계
   - 리뷰 분석

6. **Canvas (Blog Editor)** - AI 기반 블로그 원고 생성 시스템 ⭐ NEW
   - Vision AI 기반 이미지 분석
   - Enrollment 정보 기반 맥락화된 원고 생성
   - 실시간 원고 편집 및 관리
   - **핵심 원칙**: Enrollment Use Cases 재사용, 별도 사용자 정보 스키마 없음

### Ubiquitous Language

**CRITICAL**: Use consistent terminology across code, docs, and conversations:

| Term | Korean | Usage |
|------|--------|-------|
| Enrollment Application | 가입 신청서 | NOT "form" or "submission" |
| Merchant | 가맹점 | Business customer, NOT "user" |
| Customer | 고객 | End customer using merchant's service |
| Package | 패키지 | Bundle of products, NOT "bundle" |
| Agreement | 약관 | Legal terms document |
| Contract | 계약 | Service agreement |

---

## 🎯 Canvas Domain: Cross-Domain Architecture Pattern ⭐

### Background & Design Decision

Canvas (Blog Editor) 도메인은 **도메인 간 Use Case 재사용**의 모범 사례입니다. 기존 Enrollment 엔티티를 Single Source of Truth로 활용하여, 중복 데이터 스키마 없이 사용자 맥락화된 AI 원고 생성을 구현합니다.

### Old Workflow (Legacy canvas-editor)
```
Entry Page → /canvas → Manual Writing or Chat → AI Request → Content Generation
```

### New Workflow (Clean Architecture)
```
Start → Image Upload → Vision AI Analysis → Enrollment Context Retrieval → Auto Content Generation
```

### Architecture Pattern: Application Service Layer

Canvas 도메인은 **Application Service**를 통해 여러 도메인을 조율합니다:

```typescript
// lib/application/services/BlogGenerationService.ts

import { GetEnrollmentUseCase } from '@/lib/domain/enrollment/usecases/GetEnrollment'
import { AnalyzeImagesUseCase } from '@/lib/domain/canvas/usecases/AnalyzeImages'
import { GenerateBlogUseCase } from '@/lib/domain/canvas/usecases/GenerateBlog'

export class BlogGenerationService {
  constructor(
    private getEnrollment: GetEnrollmentUseCase,
    private analyzeImages: AnalyzeImagesUseCase,
    private generateBlog: GenerateBlogUseCase
  ) {}

  async generateContextualBlog(input: {
    userId: string
    images: File[]
  }): Promise<BlogPost> {
    // 1. Enrollment 도메인에서 사용자 정보 가져오기
    const enrollment = await this.getEnrollment.execute({ userId: input.userId })

    // 2. Canvas 도메인의 Vision AI로 이미지 분석
    const imageAnalysis = await this.analyzeImages.execute({ images: input.images })

    // 3. 사용자 맥락 + 이미지 분석 결과로 블로그 생성
    const blog = await this.generateBlog.execute({
      businessContext: {
        businessName: enrollment.businessName,
        businessCategory: enrollment.businessCategory,
        businessType: enrollment.businessType,
        representativeName: enrollment.representativeName,
      },
      imageAnalysis
    })

    return blog
  }
}
```

### Key Principles

#### 1. Single Source of Truth
- **Enrollment 엔티티가 유일한 사용자 정보 소스**
- Canvas 도메인은 별도의 사용자 정보 테이블을 만들지 않음
- `GetEnrollmentUseCase`를 재사용하여 필요한 정보만 가져옴

#### 2. Use Case Reusability
```typescript
// ✅ GOOD: Canvas가 Enrollment Use Case를 재사용
const enrollmentRepo = new PrismaEnrollmentRepository(prisma)
const getEnrollment = new GetEnrollmentUseCase(enrollmentRepo)
const blogService = new BlogGenerationService(getEnrollment, ...)

// ❌ BAD: Canvas가 Enrollment 데이터를 직접 조회
const enrollment = await prisma.enrollment.findUnique({ where: { userId } })
```

#### 3. Domain Separation
```
lib/domain/
├── enrollment/           # 사용자 정보 관리
│   └── usecases/
│       └── GetEnrollment.ts
├── canvas/               # 블로그 생성 로직
│   └── usecases/
│       ├── AnalyzeImages.ts
│       └── GenerateBlog.ts
└── (각 도메인은 독립적)

lib/application/
└── services/
    └── BlogGenerationService.ts  # 도메인 간 조율
```

#### 4. No Data Duplication
```typescript
// ❌ BAD: Canvas 도메인에 중복 사용자 정보
model BlogUser {
  id            String
  businessName  String  // Enrollment과 중복!
  businessType  String  // Enrollment과 중복!
}

// ✅ GOOD: Enrollment 데이터를 참조
model BlogPost {
  id           String
  userId       String  // Enrollment.userId 참조
  content      String
  images       String[]
}
```

### Implementation Checklist

Canvas 도메인 구현 시:

- [ ] **NO separate user info schema** - Enrollment 엔티티 재사용
- [ ] **Application Service** 생성 - 도메인 간 조율
- [ ] **Vision AI integration** - Anthropic Claude Vision API
- [ ] **Enrollment Use Case 의존성 주입** - GetEnrollmentUseCase
- [ ] **Canvas Use Cases** - AnalyzeImages, GenerateBlog
- [ ] **tRPC router** - Canvas API 엔드포인트
- [ ] **UI Components** - 이미지 업로드 → 자동 원고 생성

### Vision AI Integration Pattern

Canvas 도메인은 **Multi-Provider AI 지원**을 구현합니다:

#### Supported Providers
- **Anthropic Claude**: Vision AI (claude-3-5-sonnet) + Text Generation
- **OpenAI GPT**: Vision AI (gpt-4.1-mini) + Text Generation (gpt-5)

#### Provider Selection Pattern

```typescript
// lib/infrastructure/ai/AIServiceFactory.ts

export type AIProvider = 'anthropic' | 'openai'

export class AIServiceFactory {
  static createVisionService(config: AIServiceConfig): IVisionAIService {
    switch (config.provider) {
      case 'anthropic':
        return new AnthropicVisionAIService(config.apiKey)
      case 'openai':
        return new OpenAIVisionAIService(config.apiKey)
    }
  }

  static createBlogService(config: AIServiceConfig): IAIBlogService {
    switch (config.provider) {
      case 'anthropic':
        return new AnthropicBlogService(config.apiKey)
      case 'openai':
        return new OpenAIBlogService(config.apiKey)
    }
  }
}

// Usage in tRPC router
const aiConfig = getAIServiceConfig() // Reads AI_PROVIDER from env
const visionService = AIServiceFactory.createVisionService(aiConfig)
const blogService = AIServiceFactory.createBlogService(aiConfig)
```

#### Implementation: Anthropic Provider

```typescript
// lib/infrastructure/ai/AnthropicVisionAIService.ts

export class AnthropicVisionAIService implements IVisionAIService {
  private anthropic: Anthropic

  async analyzeImages(images: File[], context?: BusinessContext) {
    const base64Images = await Promise.all(
      images.map(img => this.fileToBase64(img))
    )

    const response = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      messages: [{
        role: 'user',
        content: [
          ...base64Images.map(data => ({
            type: 'image',
            source: { type: 'base64', media_type: 'image/jpeg', data },
          })),
          { type: 'text', text: '이미지 분석...' },
        ],
      }],
    })

    return this.parseResponse(response)
  }
}
```

#### Implementation: OpenAI Provider

```typescript
// lib/infrastructure/ai/OpenAIVisionAIService.ts

export class OpenAIVisionAIService implements IVisionAIService {
  private openai: OpenAI

  async analyzeImages(images: File[], context?: BusinessContext) {
    const base64Images = await Promise.all(
      images.map(img => this.fileToBase64(img))
    )

    const response = await this.openai.responses.create({
      model: 'gpt-4.1-mini',
      input: [{
        role: 'user',
        content: [
          { type: 'input_text', text: '이미지 분석...' },
          ...base64Images.map(data => ({
            type: 'input_image',
            image_url: `data:image/jpeg;base64,${data}`,
          })),
        ],
      }],
    })

    return this.parseResponse(response)
  }
}
```

### Benefits of This Pattern

1. **No Data Duplication** - 하나의 Enrollment 엔티티만 관리
2. **Clear Boundaries** - 각 도메인의 책임이 명확
3. **Testability** - Use Case를 독립적으로 테스트
4. **Flexibility** - 새로운 도메인 추가 시 기존 Use Case 재사용
5. **Maintainability** - 사용자 정보 변경 시 한 곳만 수정

---

## 🛠️ Tech Stack

### Core Technologies
- **Framework**: Next.js 15.2.4 (App Router, Server Components)
- **Language**: TypeScript 5.x (strict mode)
- **Runtime**: Node.js 20+

### Data Layer
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma 5.x (type-safe queries, migrations)
- **Validation**: Zod 3.x (runtime validation + type inference)

### API Layer
- **tRPC**: End-to-end type safety (React Query integration)
- **Authentication**: Supabase Auth (Google OAuth, Kakao OAuth)

### UI Layer
- **Framework**: React 19
- **Styling**: Tailwind CSS 3.x
- **Components**: shadcn/ui (Radix UI primitives)
- **State**: Zustand (client state), tRPC (server state)

### Infrastructure
- **Storage**: Vercel Blob (file uploads)
- **SMS**: Ppurio API
- **Payment**: TossPay integration
- **Hosting**: Vercel (recommended)

---

## 🚀 Development Commands

```bash
# Setup
npm install                    # Install dependencies
npx prisma generate           # Generate Prisma Client
npx prisma db push            # Push schema to database (dev)
npx prisma migrate dev        # Create and apply migration

# Development
npm run dev                   # Start dev server (http://localhost:3000)
npm run build                 # Build for production
npm start                     # Start production server

# Database
npx prisma studio             # Visual database editor
npx prisma migrate deploy     # Deploy migrations (production)

# Code Quality
npm run lint                  # Run ESLint
npm run type-check            # TypeScript type checking
```

---

## 📝 Development Workflow

### Adding a New Feature (Domain-Driven Approach)

#### Step 1: Define Domain Entity

```typescript
// lib/domain/enrollment/entities/EnrollmentApplication.ts
export class EnrollmentApplication {
  private constructor(
    public readonly id: string,
    public representativeName: string,
    public businessNumber: string,
    public status: EnrollmentStatus,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(input: CreateEnrollmentInput): EnrollmentApplication {
    // Business rule: Validate business number format
    if (!this.isValidBusinessNumber(input.businessNumber)) {
      throw new DomainError('Invalid business number format')
    }

    return new EnrollmentApplication(
      generateId(),
      input.representativeName,
      input.businessNumber,
      'draft',
      new Date(),
      new Date()
    )
  }

  submit(): void {
    // Business rule: Can only submit draft applications
    if (this.status !== 'draft') {
      throw new DomainError('Only draft applications can be submitted')
    }
    this.status = 'submitted'
    this.updatedAt = new Date()
  }

  private static isValidBusinessNumber(number: string): boolean {
    // Korean business number: XXX-XX-XXXXX
    return /^\d{3}-\d{2}-\d{5}$/.test(number)
  }
}

export type EnrollmentStatus = 'draft' | 'submitted' | 'reviewing' | 'approved' | 'rejected'
```

#### Step 2: Define Repository Interface

```typescript
// lib/domain/enrollment/repositories/IEnrollmentRepository.ts
import { EnrollmentApplication } from '../entities/EnrollmentApplication'

export interface IEnrollmentRepository {
  findById(id: string): Promise<EnrollmentApplication | null>
  findAll(filters?: EnrollmentFilters): Promise<EnrollmentApplication[]>
  save(application: EnrollmentApplication): Promise<void>
  delete(id: string): Promise<void>
}

export interface EnrollmentFilters {
  status?: EnrollmentStatus
  search?: string
  userId?: string
}
```

#### Step 3: Create Use Case

```typescript
// lib/domain/enrollment/usecases/CreateEnrollment.ts
import { EnrollmentApplication } from '../entities/EnrollmentApplication'
import { IEnrollmentRepository } from '../repositories/IEnrollmentRepository'
import { enrollmentSchema } from '../validation/enrollmentSchema'

export class CreateEnrollmentUseCase {
  constructor(private repository: IEnrollmentRepository) {}

  async execute(input: unknown): Promise<EnrollmentApplication> {
    // 1. Validate input with Zod
    const validated = enrollmentSchema.parse(input)

    // 2. Check business rule: No duplicate business numbers
    const existing = await this.repository.findByBusinessNumber(
      validated.businessNumber
    )
    if (existing) {
      throw new BusinessRuleError('Business number already registered')
    }

    // 3. Create domain entity (encapsulates business logic)
    const enrollment = EnrollmentApplication.create(validated)

    // 4. Persist via repository
    await this.repository.save(enrollment)

    return enrollment
  }
}
```

#### Step 4: Implement Repository (Infrastructure)

```typescript
// lib/infrastructure/database/repositories/PrismaEnrollmentRepository.ts
import { PrismaClient } from '@prisma/client'
import {
  EnrollmentApplication,
  IEnrollmentRepository
} from '@/lib/domain/enrollment'

export class PrismaEnrollmentRepository implements IEnrollmentRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<EnrollmentApplication | null> {
    const row = await this.prisma.enrollmentApplication.findUnique({
      where: { id }
    })

    return row ? this.toDomain(row) : null
  }

  async save(application: EnrollmentApplication): Promise<void> {
    await this.prisma.enrollmentApplication.upsert({
      where: { id: application.id },
      create: this.toPersistence(application),
      update: this.toPersistence(application)
    })
  }

  // Map database row to domain entity
  private toDomain(row: any): EnrollmentApplication {
    return new EnrollmentApplication(
      row.id,
      row.representativeName,
      row.businessNumber,
      row.status,
      row.createdAt,
      row.updatedAt
    )
  }

  // Map domain entity to database row
  private toPersistence(app: EnrollmentApplication) {
    return {
      id: app.id,
      representativeName: app.representativeName,
      businessNumber: app.businessNumber,
      status: app.status,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt
    }
  }
}
```

#### Step 5: Create tRPC Router (API Layer)

```typescript
// lib/presentation/api/trpc/routers/enrollment.ts
import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../trpc'
import { CreateEnrollmentUseCase } from '@/lib/domain/enrollment/usecases/CreateEnrollment'
import { PrismaEnrollmentRepository } from '@/lib/infrastructure/database/repositories/PrismaEnrollmentRepository'
import { prisma } from '@/lib/infrastructure/database/prisma/client'

export const enrollmentRouter = router({
  create: publicProcedure
    .input(z.object({
      representativeName: z.string().min(1),
      businessNumber: z.string().regex(/^\d{3}-\d{2}-\d{5}$/),
      // ... other fields
    }))
    .mutation(async ({ input }) => {
      // Dependency injection
      const repository = new PrismaEnrollmentRepository(prisma)
      const useCase = new CreateEnrollmentUseCase(repository)

      return await useCase.execute(input)
    }),

  list: protectedProcedure
    .input(z.object({
      status: z.enum(['draft', 'submitted', 'approved', 'rejected']).optional(),
      search: z.string().optional()
    }))
    .query(async ({ input, ctx }) => {
      const repository = new PrismaEnrollmentRepository(prisma)
      return await repository.findAll({
        ...input,
        userId: ctx.user.id // From auth context
      })
    })
})
```

#### Step 6: Use in UI Component

```typescript
// app/enrollment/page.tsx
'use client'

import { trpc } from '@/lib/presentation/api/trpc/client'

export default function EnrollmentPage() {
  const createEnrollment = trpc.enrollment.create.useMutation({
    onSuccess: () => {
      alert('Enrollment created successfully!')
    },
    onError: (error) => {
      alert(`Error: ${error.message}`)
    }
  })

  const handleSubmit = (data: any) => {
    createEnrollment.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  )
}
```

---

## 🎯 SOLID Principles in Practice

### Single Responsibility Principle (SRP)
- **One reason to change**: Each class/module has one job
- ✅ **Good**: `CreateEnrollmentUseCase` only creates enrollments
- ❌ **Bad**: API route handler doing validation + business logic + database access

### Open/Closed Principle (OCP)
- **Open for extension, closed for modification**
- Use interfaces and dependency injection
- Example: Add new payment processor without modifying existing code

### Liskov Substitution Principle (LSP)
- **Subtypes must be substitutable for base types**
- All repository implementations must fulfill interface contract
- Example: `PrismaEnrollmentRepository` can replace any `IEnrollmentRepository`

### Interface Segregation Principle (ISP)
- **Don't force clients to depend on unused methods**
- Create specific interfaces, not one large interface
- Example: `IEnrollmentReader` vs `IEnrollmentWriter` vs `IEnrollmentRepository`

### Dependency Inversion Principle (DIP)
- **Depend on abstractions, not concretions**
- Use Cases depend on repository interfaces, not Prisma
- Example: `CreateEnrollmentUseCase(repository: IEnrollmentRepository)`

---

## ❌ Anti-Patterns to Avoid

### 1. Mixing Layers

```typescript
// ❌ BAD: API route accessing database directly
export async function POST(request: Request) {
  const prisma = new PrismaClient()
  const data = await prisma.enrollment.create(...)
  return Response.json(data)
}

// ✅ GOOD: API route using use case
export async function POST(request: Request) {
  const repository = new PrismaEnrollmentRepository(prisma)
  const useCase = new CreateEnrollmentUseCase(repository)
  const result = await useCase.execute(await request.json())
  return Response.json(result)
}
```

### 2. Business Logic in UI

```typescript
// ❌ BAD: Business rules in component
function EnrollmentForm() {
  const handleSubmit = (data) => {
    if (data.businessNumber.length !== 12) { // Business rule!
      setError('Invalid number')
    }
  }
}

// ✅ GOOD: Business rules in domain entity
class EnrollmentApplication {
  static create(input) {
    if (!this.isValidBusinessNumber(input.businessNumber)) {
      throw new DomainError('Invalid business number')
    }
    // ...
  }
}
```

### 3. Concrete Dependencies in Use Cases

```typescript
// ❌ BAD: Use case depending on Prisma
class CreateEnrollmentUseCase {
  async execute(input) {
    const prisma = new PrismaClient() // Direct dependency!
    await prisma.enrollment.create(...)
  }
}

// ✅ GOOD: Use case depending on interface
class CreateEnrollmentUseCase {
  constructor(private repository: IEnrollmentRepository) {} // Abstraction!

  async execute(input) {
    await this.repository.save(...)
  }
}
```

---

## 📋 Domain Module Checklist

When implementing a new domain, ensure:

- [ ] **Entities** defined with business rules
- [ ] **Repository interface** created (in domain layer)
- [ ] **Use cases** implemented (orchestration logic)
- [ ] **Validation schemas** (Zod) for all inputs
- [ ] **Repository implementation** (Prisma, in infrastructure)
- [ ] **tRPC router** created with procedures
- [ ] **UI components** consuming tRPC hooks
- [ ] **Unit tests** for use cases (with mocked repositories)
- [ ] **Integration tests** for API endpoints
- [ ] **Prisma schema** updated and migrated

---

## 🗄️ Database Schema (Prisma)

### Example: Enrollment Domain

```prisma
// prisma/schema.prisma

model EnrollmentApplication {
  id                 String   @id @default(uuid())
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  // Step 1: Agreements
  agreeTerms         Boolean  @default(false)
  agreePrivacy       Boolean  @default(false)
  agreeMarketing     Boolean  @default(false)
  agreeTosspay       Boolean  @default(false)

  // Step 2: Business Type
  businessType       String   // '개인사업자' or '법인사업자'

  // Step 3: Representative Info
  representativeName String
  phoneNumber        String
  birthDate          String
  gender             String

  // Step 4-10: Business info, documents, etc.
  businessName       String?
  businessNumber     String   @unique
  businessAddress    String?

  // Document URLs (Vercel Blob Storage)
  businessRegistrationUrl String?
  idCardFrontUrl          String?
  idCardBackUrl           String?
  bankbookUrl             String?

  // Step 11: Status
  status             EnrollmentStatus @default(draft)
  submittedAt        DateTime?
  reviewedAt         DateTime?
  reviewerNotes      String?

  // Relations
  userId             String?
  notes              EnrollmentNote[]

  @@index([status])
  @@index([userId])
  @@index([businessNumber])
}

enum EnrollmentStatus {
  draft
  submitted
  reviewing
  approved
  rejected
}

model EnrollmentNote {
  id             String   @id @default(uuid())
  createdAt      DateTime @default(now())

  enrollmentId   String
  enrollment     EnrollmentApplication @relation(fields: [enrollmentId], references: [id], onDelete: Cascade)

  authorId       String   // Admin user ID
  note           String
  isInternal     Boolean  @default(false)

  @@index([enrollmentId])
}
```

---

## 🔐 Environment Variables

```bash
# .env.local

# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJxxx..."
SUPABASE_SERVICE_ROLE_KEY="eyJxxx..."

# Storage
BLOB_READ_WRITE_TOKEN="vercel_blob_xxx"

# AI Provider Configuration
# Choose between 'anthropic' or 'openai' (default: 'anthropic')
AI_PROVIDER="anthropic"

# Anthropic Claude AI API
# Get from: https://console.anthropic.com/
# Required when AI_PROVIDER=anthropic
ANTHROPIC_API_KEY="sk-ant-xxx"

# OpenAI API
# Get from: https://platform.openai.com/api-keys
# Required when AI_PROVIDER=openai
OPENAI_API_KEY="sk-xxx"

# OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxx"

# SMS (Korean)
PPURIO_API_KEY="xxx"

# Payment
TOSSPAY_CLIENT_ID="xxx"
TOSSPAY_SECRET_KEY="xxx"
```

---

## 📚 Reference Documents

Key architectural documents in `아키텍쳐/`:

1. **care_on 핵심 도메인 모듈 구현 명세서.md** - Primary implementation spec
2. **Chat log.md** - Clean Architecture discussion and principles
3. **Next.js 클린 코드 빅테크 원칙.md** - Coding standards
4. **프로젝트.md** - Project overview and migration plan

**Legacy Reference**: `/care_on` directory contains legacy implementation for reference only. **Do NOT copy code directly** - use as architectural reference only.

---

## 🎓 Learning Resources

### Clean Architecture
- *Clean Architecture* by Robert C. Martin
- Focus on: Dependency Rule, Use Cases, Entities

### Domain-Driven Design
- *Domain-Driven Design* by Eric Evans
- Focus on: Ubiquitous Language, Bounded Contexts, Entities

### TypeScript Patterns
- Use discriminated unions for domain states
- Leverage `readonly` for immutability
- Avoid `any` - use `unknown` when type is truly unknown

---

## ✅ Code Quality Standards

### TypeScript
- **Strict mode**: Always enabled
- **No `any`**: Use `unknown` or proper types
- **Explicit types**: For public APIs and domain entities
- **No `!` operator**: Use proper null checks

### Testing
- **Unit tests**: For all use cases (with mocked repositories)
- **Integration tests**: For tRPC endpoints
- **E2E tests**: For critical user flows (Playwright)

### Naming Conventions
- **Files**: PascalCase for classes, camelCase for utilities
- **Entities**: PascalCase (e.g., `EnrollmentApplication`)
- **Use Cases**: PascalCase with `UseCase` suffix (e.g., `CreateEnrollmentUseCase`)
- **Repositories**: `I` prefix for interfaces, provider prefix for implementations
  - Interface: `IEnrollmentRepository`
  - Implementation: `PrismaEnrollmentRepository`

### Import Conventions

```typescript
// Use @/ alias for all imports
import { EnrollmentApplication } from '@/lib/domain/enrollment/entities/EnrollmentApplication'
import { IEnrollmentRepository } from '@/lib/domain/enrollment/repositories/IEnrollmentRepository'
import { PrismaEnrollmentRepository } from '@/lib/infrastructure/database/repositories/PrismaEnrollmentRepository'
```

---

## 🚨 Critical Rules

1. **NO direct Prisma calls in use cases** - Always use repository interfaces
2. **NO business logic in components** - Only presentation logic
3. **NO skipping validation** - Always validate with Zod before use cases
4. **NO mixing Korean/English** - Use ubiquitous language consistently
5. **NO shortcuts** - Follow Clean Architecture strictly, no compromises

---

## 📖 Getting Started

### For New Development

1. **Identify the domain** (Enrollment, Product, Customer, Contract, Review)
2. **Define the entity** with business rules
3. **Create repository interface** in domain layer
4. **Implement use case** with validation
5. **Implement repository** in infrastructure layer
6. **Create tRPC router** in presentation layer
7. **Build UI components** consuming tRPC
8. **Write tests** at all layers

### For Debugging

1. Check **domain entity** - Is business rule enforced?
2. Check **use case** - Is orchestration correct?
3. Check **repository** - Is data mapping correct?
4. Check **tRPC router** - Is input validation working?
5. Check **UI component** - Is tRPC hook configured correctly?

---

## 💡 Tips

- **Start with domain entities** - They drive everything else
- **Use Zod for everything** - Input validation, config, environment variables
- **Write use cases first** - Before implementing UI
- **Test use cases in isolation** - With mocked repositories
- **Keep components dumb** - Only UI logic, no business rules
- **Think in bounded contexts** - Each domain is independent
- **Favor composition over inheritance** - Use interfaces and dependency injection

---

**Remember**: This is a clean slate. Build it right from the start. No technical debt, no shortcuts, no compromises.

Every line of code should follow Clean Architecture principles. If you're unsure, refer back to this document or the implementation specifications in `아키텍쳐/`.
