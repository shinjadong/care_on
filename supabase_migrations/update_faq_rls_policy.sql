-- 기존 정책 삭제
DROP POLICY IF EXISTS "Anyone can read visible FAQs" ON public.faq;
DROP POLICY IF EXISTS "Authenticated users can manage FAQs" ON public.faq;

-- 새로운 정책: 누구나 visible=true인 FAQ 읽기 가능
CREATE POLICY "Anyone can read visible FAQs" ON public.faq
  FOR SELECT
  USING (visible = true);

-- 새로운 정책: ANON 키로도 FAQ 관리 가능 (임시)
CREATE POLICY "Allow all operations with anon key" ON public.faq
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 또는 더 안전하게 하려면 아래 정책 사용
-- CREATE POLICY "Admin can manage FAQs" ON public.faq
--   FOR ALL
--   USING (
--     auth.jwt() ->> 'role' = 'authenticated' OR 
--     auth.jwt() ->> 'role' = 'anon'
--   );