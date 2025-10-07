# AI 블로그 생성기 - 빠른 시작 가이드

## 🚀 5분 안에 시작하기

### 1단계: 데이터베이스 마이그레이션 적용

\`\`\`bash
# Supabase 마이그레이션 실행
npx supabase db reset

# 또는 개발 환경에서
npx supabase db push
\`\`\`

### 2단계: OpenAI API 키 설정

`.env.local` 파일에서 OpenAI API 키를 설정하세요:

\`\`\`bash
OPENAI_API_KEY=sk-proj-your-actual-api-key-here
\`\`\`

### 3단계: 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

### 4단계: 브라우저에서 확인

1. **랜딩 페이지**: http://localhost:3000/aiblog
2. **블로그 생성기**: http://localhost:3000/aiblog/generator

---

## 📍 주요 페이지 경로

| 경로 | 설명 |
|------|------|
| `/aiblog` | AI 블로그 생성기 랜딩 페이지 (파티클 애니메이션) |
| `/aiblog/generator` | 실제 블로그 생성 인터페이스 |

---

## 🔌 API 엔드포인트

### POST /api/aiblog/generate
블로그 포스트 생성

**Request:**
\`\`\`json
{
  "keyword": "건강한 식습관",
  "model": "gpt-4",
  "temperature": 0.7
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "건강한 식습관을 위한 완벽 가이드",
    "content": "<title>...</title>...",
    "keyword": "건강한 식습관",
    "slug": "1728...-건강한-식습관",
    "seo_keywords": ["건강", "식습관", "영양"],
    "processing_time_ms": 12000,
    "token_count": 3500
  }
}
\`\`\`

### GET /api/aiblog/generate
블로그 포스트 목록 조회

**Query Parameters:**
- `limit`: 결과 개수 (기본: 10)
- `offset`: 시작 위치 (기본: 0)
- `status`: 상태 필터 ('draft', 'published', 'archived')

**Response:**
\`\`\`json
{
  "success": true,
  "data": [...],
  "total": 50,
  "limit": 10,
  "offset": 0
}
\`\`\`

---

## 🗄️ 데이터베이스 구조

### ai_blog_posts
AI 생성 블로그 포스트 저장

주요 필드:
- `id`: UUID (Primary Key)
- `user_id`: 작성자 (auth.users 참조)
- `title`: 블로그 제목
- `content`: HTML 본문
- `keyword`: 원본 키워드
- `slug`: URL 친화적 제목
- `seo_keywords`: SEO 키워드 배열
- `status`: 'draft' | 'published' | 'archived'
- `generation_status`: 'pending' | 'processing' | 'completed' | 'failed'

### ai_blog_generation_history
생성 요청 히스토리 및 메트릭

주요 필드:
- `id`: UUID
- `user_id`: 요청자
- `blog_post_id`: 생성된 블로그 포스트 참조
- `keyword`: 요청 키워드
- `status`: 생성 상태
- `processing_time_ms`: 처리 시간
- `token_count`: 사용된 토큰 수

### ai_blog_templates
블로그 생성 템플릿

주요 필드:
- `id`: UUID
- `name`: 템플릿 이름
- `system_prompt`: AI 시스템 프롬프트
- `structure_rules`: 구조 규칙 (JSON)
- `is_default`: 기본 템플릿 여부
- `is_public`: 공개 템플릿 여부

---

## 🎨 컴포넌트 사용법

### BlogGeneratorContainer

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

### BlogPreview

\`\`\`tsx
import { BlogPreview } from '@/components/aiblog/BlogPreview';

export default function PreviewPage() {
  const blogContent = '<title>제목</title>...';

  return (
    <BlogPreview content={blogContent} />
  );
}
\`\`\`

---

## 💡 사용 예시

### 1. 프로그래밍 방식으로 블로그 생성

\`\`\`typescript
async function generateBlog(keyword: string) {
  const response = await fetch('/api/aiblog/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      keyword,
      model: 'gpt-4',
      temperature: 0.7
    })
  });

  const result = await response.json();

  if (result.success) {
    console.log('블로그 생성 성공!', result.data);
    // result.data.id로 블로그 포스트 참조
  }
}

generateBlog('인공지능의 미래');
\`\`\`

### 2. Supabase 직접 쿼리

\`\`\`typescript
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

// 내 블로그 포스트 조회
const { data: myPosts } = await supabase
  .from('ai_blog_posts')
  .select('*')
  .order('created_at', { ascending: false });

// 특정 블로그 포스트 발행
const { error } = await supabase
  .from('ai_blog_posts')
  .update({
    status: 'published',
    published_at: new Date().toISOString()
  })
  .eq('id', blogId);

// 생성 히스토리 조회
const { data: history } = await supabase
  .from('ai_blog_generation_history')
  .select('*')
  .eq('status', 'completed')
  .order('created_at', { ascending: false })
  .limit(10);
\`\`\`

### 3. 템플릿 사용

\`\`\`typescript
// 공개 템플릿 조회
const { data: templates } = await supabase
  .from('ai_blog_templates')
  .select('*')
  .eq('is_public', true);

// 커스텀 템플릿 생성
const { data: customTemplate } = await supabase
  .from('ai_blog_templates')
  .insert({
    name: '마케팅 블로그 템플릿',
    description: 'SEO 최적화된 마케팅 콘텐츠 생성',
    system_prompt: 'You are a marketing content specialist...',
    structure_rules: {
      min_length: 2000,
      max_length: 3000,
      min_headings: 7
    },
    is_public: false
  });
\`\`\`

---

## ⚠️ 문제 해결

### OpenAI API 오류
**증상**: "API 키가 설정되지 않았습니다"
**해결**: `.env.local`에서 `OPENAI_API_KEY` 설정 확인

### 인증 오류
**증상**: "인증이 필요합니다"
**해결**: 로그인 후 API 호출, RLS 정책 확인

### 마이그레이션 오류
**증상**: "relation does not exist"
**해결**: `npx supabase db reset` 실행

### 컴포넌트 import 오류
**증상**: "Module not found"
**해결**: `@/` 경로 별칭 확인, 컴포넌트 경로 확인

---

## 📚 추가 리소스

- [통합 문서](./AIBLOG_INTEGRATION.md) - 상세한 통합 가이드
- [OpenAI API](https://platform.openai.com/docs)
- [Supabase 문서](https://supabase.com/docs)
- [원본 프로젝트](../docs/aijadongyoutube-main/)

---

## 🎯 다음 단계

1. OpenAI API 키 발급 및 설정
2. 마이그레이션 적용
3. 랜딩 페이지 확인
4. 첫 블로그 생성 테스트
5. 생성된 블로그 Supabase에서 확인

**시작 준비 완료!** 🚀
