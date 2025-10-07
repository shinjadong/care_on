-- AI 블로그 테이블 RLS 비활성화 (개발 중)
-- Created: 2025-10-07

-- RLS 비활성화
ALTER TABLE ai_blog_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE ai_blog_generation_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE ai_blog_templates DISABLE ROW LEVEL SECURITY;

-- 기존 RLS 정책 제거
DROP POLICY IF EXISTS "Users can view their own blog posts" ON ai_blog_posts;
DROP POLICY IF EXISTS "Users can create their own blog posts" ON ai_blog_posts;
DROP POLICY IF EXISTS "Users can update their own blog posts" ON ai_blog_posts;
DROP POLICY IF EXISTS "Users can delete their own blog posts" ON ai_blog_posts;

DROP POLICY IF EXISTS "Users can view their own generation history" ON ai_blog_generation_history;
DROP POLICY IF EXISTS "Users can create their own generation history" ON ai_blog_generation_history;

DROP POLICY IF EXISTS "Users can view public templates and their own" ON ai_blog_templates;
DROP POLICY IF EXISTS "Users can create their own templates" ON ai_blog_templates;
DROP POLICY IF EXISTS "Users can update their own templates" ON ai_blog_templates;
DROP POLICY IF EXISTS "Users can delete their own templates" ON ai_blog_templates;
