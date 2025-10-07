-- SMS 발송을 위한 데이터베이스 트리거 설정

-- 1. HTTP 확장 활성화 (Edge Function 호출용)
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. SMS 발송 함수 생성
CREATE OR REPLACE FUNCTION send_application_sms()
RETURNS TRIGGER AS $$
DECLARE
  request_id bigint;
  edge_function_url text;
BEGIN
  -- Edge Function URL 설정 (환경에 맞게 수정 필요)
  edge_function_url := 'https://pkehcfbjotctvneordob.supabase.co/functions/v1/send-sms-twilio';
  
  -- Edge Function 호출
  SELECT net.http_post(
    url := edge_function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := jsonb_build_object(
      'record', row_to_json(NEW)
    )
  ) INTO request_id;
  
  -- 로그 기록 (선택사항)
  INSERT INTO public.sms_logs (
    application_id,
    phone_number,
    status,
    created_at
  ) VALUES (
    NEW.id,
    NEW.phone_number,
    'pending',
    NOW()
  ) ON CONFLICT DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. 트리거 생성 (새 신청 추가시 SMS 발송)
DROP TRIGGER IF EXISTS send_sms_on_application ON public.careon_applications;

CREATE TRIGGER send_sms_on_application
  AFTER INSERT ON public.careon_applications
  FOR EACH ROW
  EXECUTE FUNCTION send_application_sms();

-- 4. SMS 로그 테이블 생성 (선택사항)
CREATE TABLE IF NOT EXISTS public.sms_logs (
  id BIGSERIAL PRIMARY KEY,
  application_id BIGINT REFERENCES public.careon_applications(id),
  phone_number TEXT,
  message_id TEXT,
  status TEXT, -- pending, sent, failed
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ
);

-- 5. 환경변수 설정 안내
COMMENT ON FUNCTION send_application_sms() IS '
SMS 발송을 위해 다음 환경변수를 Supabase Dashboard에서 설정해야 합니다:
1. Settings > Edge Functions > Environment Variables
2. 추가할 변수들:
   - TWILIO_ACCOUNT_SID: Twilio 계정 SID
   - TWILIO_AUTH_TOKEN: Twilio Auth Token
   - TWILIO_PHONE_NUMBER: Twilio에서 구매한 발신번호
   
또는 Solapi 사용시:
   - SOLAPI_API_KEY: Solapi API 키
   - SOLAPI_API_SECRET: Solapi API Secret
   - SENDER_PHONE: 사전등록된 발신번호
';
