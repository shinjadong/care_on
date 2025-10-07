-- AI 블로그 포스트에 이미지 URL 배열 컬럼 추가
ALTER TABLE ai_blog_posts
ADD COLUMN IF NOT EXISTS image_urls TEXT[] DEFAULT '{}';

COMMENT ON COLUMN ai_blog_posts.image_urls IS '블로그 생성 시 사용된 이미지 URL 배열';
