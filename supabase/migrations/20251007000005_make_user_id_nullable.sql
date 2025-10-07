-- AI 블로그 테이블 user_id를 nullable로 변경 (개발 중)
-- Created: 2025-10-07

-- Foreign key 제약 제거
ALTER TABLE ai_blog_posts 
  DROP CONSTRAINT IF EXISTS ai_blog_posts_user_id_fkey;

ALTER TABLE ai_blog_generation_history 
  DROP CONSTRAINT IF EXISTS ai_blog_generation_history_user_id_fkey;

ALTER TABLE ai_blog_templates 
  DROP CONSTRAINT IF EXISTS ai_blog_templates_user_id_fkey;

-- user_id를 nullable로 변경
ALTER TABLE ai_blog_posts 
  ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE ai_blog_generation_history 
  ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE ai_blog_templates 
  ALTER COLUMN user_id DROP NOT NULL;

-- 개발 중에는 foreign key 없이 진행
-- 나중에 프로덕션에서는 다시 추가할 수 있음
