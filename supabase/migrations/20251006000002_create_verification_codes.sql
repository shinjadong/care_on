-- 인증 코드 테이블 생성
CREATE TABLE IF NOT EXISTS public.verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP WITH TIME ZONE,
  attempts INTEGER DEFAULT 0,
  
  -- 인덱스
  CONSTRAINT verification_codes_phone_number_idx UNIQUE (phone_number, created_at)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_verification_codes_phone ON public.verification_codes(phone_number);
CREATE INDEX IF NOT EXISTS idx_verification_codes_expires ON public.verification_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_verification_codes_verified ON public.verification_codes(verified);

-- RLS 비활성화 (개발 중)
ALTER TABLE public.verification_codes DISABLE ROW LEVEL SECURITY;

-- 만료된 인증 코드 자동 삭제 함수
CREATE OR REPLACE FUNCTION delete_expired_verification_codes()
RETURNS void AS $$
BEGIN
  DELETE FROM public.verification_codes
  WHERE expires_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

-- 주기적으로 만료된 코드 삭제 (매 시간)
-- 참고: pg_cron 확장이 설치되어 있어야 함
-- SELECT cron.schedule('delete-expired-codes', '0 * * * *', 'SELECT delete_expired_verification_codes()');
