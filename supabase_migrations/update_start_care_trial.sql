-- careon_applications 테이블 스키마 업데이트
-- 기존 테이블이 있다면 백업 후 수정

-- 1. 테이블이 없다면 생성
CREATE TABLE IF NOT EXISTS public.careon_applications (
  id BIGSERIAL PRIMARY KEY,
  
  -- 기본 정보
  company_name TEXT, -- 업체명 (선택)
  name TEXT NOT NULL, -- 가입자 성함
  phone_number TEXT NOT NULL, -- 연락처 (010-xxxx-xxxx)
  birth_date TEXT NOT NULL, -- 생년월일+성별 (7자리)
  
  -- 사업장 정보
  business_address TEXT NOT NULL, -- 사업장 주소 (상세주소 포함)
  startup_period TEXT NOT NULL, -- 창업 시기: preparing, within_1_year, 1_to_3_years, over_3_years
  business_status TEXT NOT NULL, -- 사업장 상태: immediate(5일내), interior(5일후), preparing(준비중)
  open_date DATE, -- 원하시는 일정 (business_status가 interior일 때)
  existing_services JSONB DEFAULT '{"cctv": false, "internet": false, "insurance": false}'::jsonb, -- 기존 서비스
  business_type INTEGER NOT NULL, -- 업종 ID (1-16)
  
  -- 통화 정보
  call_datetime TEXT NOT NULL, -- 통화 가능 시간 (ASAP-시간대 또는 날짜T시간:00)
  
  -- 동의 정보
  agree_privacy BOOLEAN NOT NULL DEFAULT false, -- 개인정보 동의
  agree_marketing BOOLEAN DEFAULT false, -- 마케팅 동의
  
  -- 메타 정보
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. 기존 테이블이 있다면 컬럼 추가/수정
-- 컬럼이 없다면 추가
ALTER TABLE public.careon_applications 
ADD COLUMN IF NOT EXISTS birth_date TEXT;

ALTER TABLE public.careon_applications 
ADD COLUMN IF NOT EXISTS business_address TEXT;

ALTER TABLE public.careon_applications 
ADD COLUMN IF NOT EXISTS business_status TEXT;

ALTER TABLE public.careon_applications 
ADD COLUMN IF NOT EXISTS open_date DATE;

ALTER TABLE public.careon_applications 
ADD COLUMN IF NOT EXISTS existing_services JSONB DEFAULT '{"cctv": false, "internet": false, "insurance": false}'::jsonb;

ALTER TABLE public.careon_applications 
ADD COLUMN IF NOT EXISTS call_datetime TEXT;

-- 3. 불필요한 컬럼 제거 (주의: 데이터 손실 가능)
-- ALTER TABLE public.careon_applications 
-- DROP COLUMN IF EXISTS agree_review;

-- ALTER TABLE public.careon_applications 
-- DROP COLUMN IF EXISTS agree_photo;

-- ALTER TABLE public.careon_applications 
-- DROP COLUMN IF EXISTS on_site_estimate_datetime;

-- 4. RLS (Row Level Security) 설정
ALTER TABLE public.careon_applications ENABLE ROW LEVEL SECURITY;

-- 5. 정책 추가 (누구나 삽입 가능, 관리자만 읽기/수정/삭제 가능)
CREATE POLICY "Anyone can insert" ON public.careon_applications
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only authenticated can select" ON public.careon_applications
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- 6. 인덱스 추가 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_careon_applications_created_at ON public.careon_applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_careon_applications_business_status ON public.careon_applications(business_status);
CREATE INDEX IF NOT EXISTS idx_careon_applications_phone_number ON public.careon_applications(phone_number);

-- 7. 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_careon_applications_updated_at ON public.careon_applications;

CREATE TRIGGER update_careon_applications_updated_at 
  BEFORE UPDATE ON public.careon_applications 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 8. 코멘트 추가
COMMENT ON TABLE public.careon_applications IS '케어온 무료체험단 신청 정보';
COMMENT ON COLUMN public.careon_applications.company_name IS '업체명';
COMMENT ON COLUMN public.careon_applications.name IS '가입자 성함';
COMMENT ON COLUMN public.careon_applications.phone_number IS '연락처 (예: 010-1234-5678)';
COMMENT ON COLUMN public.careon_applications.birth_date IS '생년월일+성별 (7자리, 예: 9401011)';
COMMENT ON COLUMN public.careon_applications.business_address IS '사업장 주소 (상세주소 포함)';
COMMENT ON COLUMN public.careon_applications.startup_period IS '창업 시기: preparing(준비중), within_1_year(1년이내), 1_to_3_years(1-3년), over_3_years(3년이상)';
COMMENT ON COLUMN public.careon_applications.business_status IS '사업장 상태: immediate(5일내 설치), interior(5일후 설치), preparing(창업준비중)';
COMMENT ON COLUMN public.careon_applications.open_date IS '원하시는 설치 일정 (business_status가 interior일 때)';
COMMENT ON COLUMN public.careon_applications.existing_services IS '기존 서비스 가입 상태 {cctv, internet, insurance}';
COMMENT ON COLUMN public.careon_applications.business_type IS '업종 ID (1-16)';
COMMENT ON COLUMN public.careon_applications.call_datetime IS '통화 가능 시간 (ASAP-09:00-12:00 또는 2024-01-15T14:00:00)';
COMMENT ON COLUMN public.careon_applications.agree_privacy IS '개인정보 수집 동의';
COMMENT ON COLUMN public.careon_applications.agree_marketing IS '마케팅 정보 수신 동의';
