-- Supabase Database Webhook 설정
-- careon_applications 테이블에 새 신청이 들어오면 Edge Function 호출

-- 1. Database Webhook 생성 (Supabase 대시보드에서 실행)
-- Database > Webhooks 메뉴에서 다음 설정으로 생성:
-- 
-- Name: sms_notification
-- Table: careon_applications  
-- Events: INSERT
-- Type: Supabase Edge Function
-- Edge Function: sms-to-slack
-- HTTP Headers: (기본값 사용)

-- 또는 pg_net 확장을 사용한 HTTP 호출 (선택사항)
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 트리거 함수 생성
CREATE OR REPLACE FUNCTION notify_sms_on_insert()
RETURNS TRIGGER AS $$
BEGIN
  -- Edge Function 호출
  PERFORM net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/sms-to-slack',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.supabase_anon_key')
    ),
    body := jsonb_build_object(
      'type', 'INSERT',
      'table', 'careon_applications',
      'record', row_to_json(NEW)
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
DROP TRIGGER IF EXISTS on_careon_application_insert ON careon_applications;
CREATE TRIGGER on_careon_application_insert
  AFTER INSERT ON careon_applications
  FOR EACH ROW
  EXECUTE FUNCTION notify_sms_on_insert();

-- 권한 설정
GRANT EXECUTE ON FUNCTION notify_sms_on_insert() TO authenticated;
GRANT EXECUTE ON FUNCTION notify_sms_on_insert() TO anon;