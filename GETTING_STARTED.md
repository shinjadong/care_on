# Getting Started Guide

CareOn Clean Architecture 프로젝트 시작 가이드

## 📋 사전 준비

### 필수 설치

1. **Node.js 20+**
   ```bash
   node --version  # v20.0.0 이상
   ```

2. **npm 또는 pnpm**
   ```bash
   npm --version
   ```

3. **PostgreSQL 데이터베이스**
   - Supabase (권장)
   - 로컬 PostgreSQL
   - Docker PostgreSQL

## 🚀 첫 설정

### Step 1: 저장소 클론 (이미 완료)

이 프로젝트는 이미 설정되어 있습니다.

### Step 2: 의존성 설치

```bash
npm install
```

### Step 3: 환경 변수 설정

```bash
# 예제 파일 복사
cp .env.example .env.local
```

`.env.local` 파일을 열어 다음 값들을 설정하세요:

#### 필수 환경 변수

```bash
# 1. DATABASE_URL
# Supabase 프로젝트의 Connection String
# Settings > Database > Connection String > URI
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# 2. Supabase Keys
# Settings > API > Project URL & anon key
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."
```

#### 선택적 환경 변수 (나중에 설정 가능)

```bash
# Storage (파일 업로드 기능 필요 시)
BLOB_READ_WRITE_TOKEN="vercel_blob_..."

# SMS (문자 발송 기능 필요 시)
PPURIO_API_KEY="..."

# Payment (결제 기능 필요 시)
TOSSPAY_CLIENT_ID="..."
```

### Step 4: 데이터베이스 설정

#### 옵션 A: 개발 환경 (빠른 시작)

```bash
# Prisma Client 생성
npx prisma generate

# 스키마를 데이터베이스에 푸시
npx prisma db push
```

#### 옵션 B: 프로덕션 환경 (권장)

```bash
# Prisma Client 생성
npx prisma generate

# 첫 마이그레이션 생성
npx prisma migrate dev --name init

# 마이그레이션 적용 확인
npx prisma migrate status
```

### Step 5: 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 열기

## ✅ 설정 확인

### 1. 데이터베이스 연결 확인

```bash
# Prisma Studio 실행 (데이터베이스 GUI)
npx prisma studio
```

브라우저에서 http://localhost:5555 열림
- 테이블들이 보이면 성공!

### 2. tRPC 작동 확인

개발 서버가 실행 중일 때:
- http://localhost:3000/api/trpc 접속
- JSON 응답이 보이면 성공!

## 🎨 첫 번째 개발 작업

### 1. Enrollment 페이지 만들기

```bash
# 파일 생성
mkdir -p app/enrollment
touch app/enrollment/page.tsx
```

```typescript
// app/enrollment/page.tsx
'use client'

import { trpc } from '@/lib/presentation/api/trpc/client'

export default function EnrollmentPage() {
  const { data, isLoading } = trpc.enrollment.getMyApplications.useQuery()

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">가맹점 신청</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
```

### 2. 브라우저에서 확인

http://localhost:3000/enrollment 접속

## 🐛 문제 해결

### 데이터베이스 연결 오류

```bash
Error: Can't reach database server
```

**해결 방법:**
1. DATABASE_URL이 올바른지 확인
2. Supabase 프로젝트가 활성 상태인지 확인
3. 네트워크 연결 확인

### Prisma Client 오류

```bash
Error: @prisma/client did not initialize yet
```

**해결 방법:**
```bash
npx prisma generate
npm run dev
```

### tRPC 오류

```bash
TRPCClientError: fetch failed
```

**해결 방법:**
1. 개발 서버가 실행 중인지 확인
2. http://localhost:3000/api/trpc 접속 확인
3. 브라우저 콘솔에서 에러 메시지 확인

## 📚 다음 단계

### 1. Clean Architecture 이해하기

[CLAUDE.md](./CLAUDE.md) 파일 정독 (필수!)

### 2. 도메인 모듈 구현하기

[아키텍쳐/care_on 핵심 도메인 모듈 구현 명세서.md](./아키텍쳐/care_on%20핵심%20도메인%20모듈%20구현%20명세서.md) 참조

### 3. 첫 Use Case 작성하기

```typescript
// lib/domain/enrollment/usecases/CreateEnrollment.ts
export class CreateEnrollmentUseCase {
  // ... 구현
}
```

### 4. UI Component 연결하기

```typescript
// components/enrollment/EnrollmentForm.tsx
'use client'

export function EnrollmentForm() {
  const createEnrollment = trpc.enrollment.create.useMutation()
  // ... 구현
}
```

## 💡 유용한 명령어

```bash
# 데이터베이스 GUI 열기
npx prisma studio

# 타입 체크
npm run type-check

# 린트 검사
npm run lint

# 프로덕션 빌드
npm run build
npm start
```

## 🆘 도움이 필요하신가요?

1. [CLAUDE.md](./CLAUDE.md) - AI 개발 가이드
2. [README.md](./README.md) - 프로젝트 개요
3. [아키텍쳐/](./아키텍쳐/) - 상세 설계 문서

---

**준비 완료!** 🎉

이제 Clean Architecture로 비즈니스 로직을 구현할 준비가 되었습니다.
