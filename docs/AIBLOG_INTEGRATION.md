# AI 블로그 생성기 통합 문서

## 개요
기존 JadongAI YouTube 분석 프로젝트의 블로그 생성 기능을 CareOn 프로젝트에 통합했습니다.

## 통합된 기능

### 1. 데이터베이스 스키마
**위치**: `supabase/migrations/20251007000001_create_aiblog_tables.sql`

생성된 테이블:
- `ai_blog_posts` - AI 생성 블로그 포스트 저장
- `ai_blog_generation_history` - 생성 요청 히스토리 및 메트릭
- `ai_blog_templates` - 블로그 템플릿 관리

### 2. 컴포넌트
**위치**: `components/aiblog/` 및 `components/aiblog-landing/`

주요 컴포넌트:
- `BlogGeneratorContainer.tsx` - 블로그 생성 메인 컨테이너
- `BlogGeneratorContext.tsx` - 상태 관리 Context
- `BlogGeneratorForm.tsx` - 키워드 입력 폼
- `BlogPreview.tsx` - 생성된 블로그 미리보기
- `TogetherBlogGenerator.tsx` - Together AI 통합 생성기
- `ImageUploader.tsx` - 이미지 업로드 컴포넌트

랜딩 페이지:
- `hero.tsx` - 히어로 섹션
- `sparkles.tsx` - 파티클 애니메이션
- `navbar.tsx` - 네비게이션 바

### 3. 페이지 라우팅
- `/aiblog` - 블로그 생성기 랜딩 페이지
- `/aiblog/generator` - 실제 블로그 생성 페이지

### 4. API 라우트
**위치**: `app/api/aiblog/generate/route.ts`

엔드포인트:
- `POST /api/aiblog/generate` - 블로그 생성
  - Request: `{ keyword: string, model?: string, temperature?: number }`
  - Response: `{ success: boolean, data: { id, title, content, ... } }`

- `GET /api/aiblog/generate` - 블로그 목록 조회
  - Query Params: `limit`, `offset`, `status`
  - Response: `{ success: boolean, data: [...], total, limit, offset }`

## 환경 변수 설정

`.env.local`에 다음 변수를 추가하세요:

\`\`\`bash
# AI 블로그 생성 (OpenAI)
OPENAI_API_KEY=sk-proj-...

# 선택사항: Together AI (미래 확장용)
TOGETHER_API_KEY=your-together-api-key
\`\`\`

## 데이터베이스 마이그레이션

\`\`\`bash
# Supabase 마이그레이션 적용
npx supabase db reset

# 또는 특정 마이그레이션만 적용
npx supabase db push
\`\`\`

## 사용 방법

### 1. 블로그 생성 API 호출 예시

\`\`\`typescript
const response = await fetch('/api/aiblog/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    keyword: '건강한 식습관',
    model: 'gpt-4',
    temperature: 0.7
  })
});

const result = await response.json();
console.log(result.data); // { id, title, content, ... }
\`\`\`

### 2. 컴포넌트 사용 예시

\`\`\`tsx
import { BlogGeneratorProvider } from '@/components/aiblog/BlogGeneratorContext';
import { BlogGeneratorContainer } from '@/components/aiblog/BlogGeneratorContainer';

export default function MyPage() {
  return (
    <BlogGeneratorProvider>
      <BlogGeneratorContainer />
    </BlogGeneratorProvider>
  );
}
\`\`\`

### 3. Supabase 직접 쿼리

\`\`\`typescript
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

// 블로그 포스트 조회
const { data, error } = await supabase
  .from('ai_blog_posts')
  .select('*')
  .eq('status', 'published')
  .order('created_at', { ascending: false });
\`\`\`

## 주요 변경사항

### MongoDB → Supabase 전환
- 원본: MongoDB + Mongoose
- 현재: Supabase PostgreSQL + Row Level Security (RLS)

### 인증 시스템
- 원본: NextAuth.js
- 현재: Supabase Auth (Google OAuth 지원)

### 디자인 시스템
- 원본: 독립적인 다크 테마 디자인
- 현재: 랜딩 페이지는 원본 유지, 생성기는 CareOn 디자인 통합

## 설치된 npm 패키지

\`\`\`json
{
  "openai": "^6.2.0",
  "react-type-animation": "^3.2.0"
}
\`\`\`

## 향후 개선 사항

1. **이미지 생성 통합**
   - DALL-E API 연동으로 블로그 이미지 자동 생성
   - Vercel Blob Storage에 이미지 저장

2. **템플릿 시스템 확장**
   - 다양한 블로그 스타일 템플릿 추가
   - 사용자 커스텀 템플릿 생성 기능

3. **SEO 최적화**
   - 자동 메타 태그 생성
   - Open Graph 이미지 생성
   - sitemap.xml 자동 생성

4. **다국어 지원**
   - 영어, 일본어 등 다국어 블로그 생성
   - 자동 번역 기능

5. **분석 대시보드**
   - 블로그 성능 메트릭 시각화
   - 키워드별 생성 통계
   - 비용 추적 대시보드

## 트러블슈팅

### 1. OpenAI API 오류
\`\`\`
Error: API 키가 설정되지 않았습니다
\`\`\`
**해결**: `.env.local`에 `OPENAI_API_KEY` 설정 확인

### 2. Supabase 인증 오류
\`\`\`
Error: 인증이 필요합니다
\`\`\`
**해결**: 로그인 후 API 호출, 또는 RLS 정책 확인

### 3. 마이그레이션 실패
\`\`\`
Error: relation "ai_blog_posts" does not exist
\`\`\`
**해결**: `npx supabase db reset` 실행하여 모든 마이그레이션 재적용

## 참고 자료

- [OpenAI API 문서](https://platform.openai.com/docs)
- [Supabase 문서](https://supabase.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [원본 프로젝트](docs/aijadongyoutube-main/)

## 작성자
- 통합일: 2025-10-07
- 통합 버전: 1.0.0
