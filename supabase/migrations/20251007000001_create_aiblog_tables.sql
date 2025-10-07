-- AI 블로그 생성 시스템 테이블 생성
-- Created: 2025-10-07

-- 1. 블로그 포스트 테이블
CREATE TABLE IF NOT EXISTS ai_blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- 블로그 기본 정보
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  format TEXT NOT NULL DEFAULT 'html', -- 'html' | 'markdown'

  -- SEO 관련
  seo_keywords TEXT[], -- 검색 키워드 배열
  meta_description TEXT,
  slug TEXT UNIQUE, -- URL 친화적 제목

  -- 생성 정보
  keyword TEXT NOT NULL, -- 원본 키워드
  prompt TEXT, -- 사용된 프롬프트
  model TEXT DEFAULT 'gpt-4', -- 사용된 AI 모델

  -- 상태 관리
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft' | 'published' | 'archived'
  generation_status TEXT DEFAULT 'completed', -- 'pending' | 'processing' | 'completed' | 'failed'
  error_message TEXT,

  -- 이미지 관리
  thumbnail_url TEXT,
  image_urls TEXT[], -- 본문 이미지 URL 배열

  -- 통계
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,

  -- 타임스탬프
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- 2. 블로그 생성 히스토리 테이블
CREATE TABLE IF NOT EXISTS ai_blog_generation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  blog_post_id UUID REFERENCES ai_blog_posts(id) ON DELETE SET NULL,

  -- 생성 요청 정보
  keyword TEXT NOT NULL,
  prompt TEXT,
  model TEXT DEFAULT 'gpt-4',

  -- 생성 결과
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'processing' | 'completed' | 'failed'
  error_message TEXT,

  -- 성능 메트릭
  processing_time_ms INTEGER, -- 처리 시간 (밀리초)
  token_count INTEGER, -- 사용된 토큰 수

  -- 비용 추적
  cost_amount DECIMAL(10, 6), -- API 호출 비용

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 블로그 템플릿 테이블
CREATE TABLE IF NOT EXISTS ai_blog_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- 템플릿 정보
  name TEXT NOT NULL,
  description TEXT,

  -- 템플릿 설정
  system_prompt TEXT NOT NULL, -- AI 시스템 프롬프트
  structure_rules JSONB, -- 구조 규칙 (JSON 형태)
  style_preferences JSONB, -- 스타일 선호도

  -- 메타데이터
  is_default BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 인덱스 생성
CREATE INDEX idx_ai_blog_posts_user_id ON ai_blog_posts(user_id);
CREATE INDEX idx_ai_blog_posts_status ON ai_blog_posts(status);
CREATE INDEX idx_ai_blog_posts_created_at ON ai_blog_posts(created_at DESC);
CREATE INDEX idx_ai_blog_posts_slug ON ai_blog_posts(slug);

CREATE INDEX idx_ai_blog_generation_history_user_id ON ai_blog_generation_history(user_id);
CREATE INDEX idx_ai_blog_generation_history_created_at ON ai_blog_generation_history(created_at DESC);

CREATE INDEX idx_ai_blog_templates_user_id ON ai_blog_templates(user_id);
CREATE INDEX idx_ai_blog_templates_is_public ON ai_blog_templates(is_public) WHERE is_public = TRUE;

-- 5. Updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ai_blog_posts_updated_at
  BEFORE UPDATE ON ai_blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_blog_templates_updated_at
  BEFORE UPDATE ON ai_blog_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6. 기본 템플릿 데이터 삽입
INSERT INTO ai_blog_templates (name, description, system_prompt, is_default, is_public, structure_rules)
VALUES (
  '네이버 블로그 기본 템플릿',
  'SEO 최적화된 네이버 블로그 스타일 템플릿',
  '당신은 네이버 블로그 전문 작성 AI입니다. 주어진 키워드에 대해 SEO 최적화된 고품질 블로그 포스트를 작성하는 것이 주요 임무입니다.',
  TRUE,
  TRUE,
  '{
    "min_length": 1500,
    "max_length": 1800,
    "min_headings": 5,
    "paragraphs_per_heading": 3,
    "min_paragraph_length": 400
  }'::jsonb
);

-- 7. RLS (Row Level Security) 정책 설정
ALTER TABLE ai_blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_blog_generation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_blog_templates ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 블로그 포스트만 조회 가능
CREATE POLICY "Users can view their own blog posts"
  ON ai_blog_posts FOR SELECT
  USING (auth.uid() = user_id);

-- 사용자는 자신의 블로그 포스트만 생성 가능
CREATE POLICY "Users can create their own blog posts"
  ON ai_blog_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 블로그 포스트만 수정 가능
CREATE POLICY "Users can update their own blog posts"
  ON ai_blog_posts FOR UPDATE
  USING (auth.uid() = user_id);

-- 사용자는 자신의 블로그 포스트만 삭제 가능
CREATE POLICY "Users can delete their own blog posts"
  ON ai_blog_posts FOR DELETE
  USING (auth.uid() = user_id);

-- 생성 히스토리 정책
CREATE POLICY "Users can view their own generation history"
  ON ai_blog_generation_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own generation history"
  ON ai_blog_generation_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 템플릿 정책
CREATE POLICY "Users can view public templates and their own"
  ON ai_blog_templates FOR SELECT
  USING (is_public = TRUE OR auth.uid() = user_id);

CREATE POLICY "Users can create their own templates"
  ON ai_blog_templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates"
  ON ai_blog_templates FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates"
  ON ai_blog_templates FOR DELETE
  USING (auth.uid() = user_id);

-- 8. 댓글 기능을 위한 코멘트 추가
COMMENT ON TABLE ai_blog_posts IS 'AI 생성 블로그 포스트 저장';
COMMENT ON TABLE ai_blog_generation_history IS 'AI 블로그 생성 요청 히스토리';
COMMENT ON TABLE ai_blog_templates IS 'AI 블로그 생성 템플릿';
