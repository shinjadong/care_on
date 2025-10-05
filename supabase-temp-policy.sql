-- 임시로 모든 사용자가 페이지를 수정할 수 있도록 허용 (테스트용)

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Authenticated users can insert pages" ON pages;
DROP POLICY IF EXISTS "Authenticated users can update pages" ON pages; 
DROP POLICY IF EXISTS "Authenticated users can delete pages" ON pages;

-- 임시 정책 생성 (모든 사용자 허용)
CREATE POLICY "Anyone can insert pages" ON pages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update pages" ON pages  
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can delete pages" ON pages
  FOR DELETE USING (true);

-- 미디어 테이블도 동일하게 처리
DROP POLICY IF EXISTS "Authenticated users can upload media" ON media;
DROP POLICY IF EXISTS "Authenticated users can delete media" ON media;

CREATE POLICY "Anyone can upload media" ON media
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can delete media" ON media
  FOR DELETE USING (true);