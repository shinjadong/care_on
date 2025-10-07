-- FAQ 테이블 생성
CREATE TABLE IF NOT EXISTS public.faq (
  id BIGSERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  visible BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS 설정
ALTER TABLE public.faq ENABLE ROW LEVEL SECURITY;

-- 정책: 누구나 visible=true인 FAQ 읽기 가능
CREATE POLICY "Anyone can read visible FAQs" ON public.faq
  FOR SELECT
  USING (visible = true);

-- 정책: 인증된 사용자만 모든 FAQ 관리 가능
CREATE POLICY "Authenticated users can manage FAQs" ON public.faq
  FOR ALL
  USING (auth.role() = 'authenticated');

-- 업데이트 트리거
CREATE OR REPLACE FUNCTION update_faq_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_faq_updated_at
  BEFORE UPDATE ON public.faq
  FOR EACH ROW
  EXECUTE FUNCTION update_faq_updated_at();

-- 초기 데이터 삽입
INSERT INTO public.faq (question, answer, visible, order_index) VALUES
('케어온은 어떤 서비스인가요?', '케어온은 창업자를 위한 통합 지원 서비스입니다. CCTV, 인터넷, 화재보험 등 사업에 필요한 모든 것을 한 번에 해결해드립니다.', true, 1),
('비용은 얼마나 되나요?', '업종과 규모에 따라 다르지만, 개별 가입 대비 평균 30-40% 절감됩니다. 무료 상담을 통해 정확한 견적을 받아보세요.', true, 2),
('설치 기간은 얼마나 걸리나요?', '신청 후 3-5일 이내 설치 완료됩니다. 긴급한 경우 당일 설치도 가능합니다.', true, 3),
('폐업 시 위약금이 있나요?', '케어온은 폐업 시 위약금이 없습니다. 100% 환급 보장 프로그램을 운영하고 있습니다.', true, 4),
('A/S는 어떻게 받나요?', '24시간 콜센터 운영으로 즉시 대응합니다. 평균 2시간 이내 현장 출동이 가능합니다.', true, 5),
('다른 지역도 가능한가요?', '전국 모든 지역에서 서비스 이용이 가능합니다. 도서산간 지역도 추가 비용 없이 동일하게 제공됩니다.', true, 6);

-- 인덱스 생성
CREATE INDEX idx_faq_visible ON public.faq(visible);
CREATE INDEX idx_faq_order ON public.faq(order_index);
