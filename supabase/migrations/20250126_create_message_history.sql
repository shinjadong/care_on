-- 메시지 발송 이력 테이블 생성
CREATE TABLE IF NOT EXISTS message_history (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  message_type VARCHAR(20) NOT NULL CHECK (message_type IN ('SMS', 'LMS', 'MMS', 'ALIMTALK')),
  recipient_phone VARCHAR(20) NOT NULL,
  recipient_name VARCHAR(100),
  customer_id BIGINT REFERENCES customers(id),
  enrollment_id BIGINT REFERENCES enrollment_applications(id),
  sender_type VARCHAR(20) DEFAULT 'admin' CHECK (sender_type IN ('admin', 'system', 'auto')),
  sender_id VARCHAR(100), -- admin username or system process name
  template_code VARCHAR(100), -- 알림톡 템플릿 코드
  message_content TEXT NOT NULL,
  variables JSONB, -- 템플릿 변수들
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'read')),
  error_message TEXT,
  message_key VARCHAR(100), -- 외부 서비스 메시지 키
  ref_key VARCHAR(100), -- 참조 키
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB -- 추가 데이터 저장용
);

-- 인덱스 생성
CREATE INDEX idx_message_history_recipient_phone ON message_history(recipient_phone);
CREATE INDEX idx_message_history_customer_id ON message_history(customer_id);
CREATE INDEX idx_message_history_enrollment_id ON message_history(enrollment_id);
CREATE INDEX idx_message_history_status ON message_history(status);
CREATE INDEX idx_message_history_created_at ON message_history(created_at DESC);
CREATE INDEX idx_message_history_message_type ON message_history(message_type);
CREATE INDEX idx_message_history_sender_type ON message_history(sender_type);

-- 메시지 템플릿 테이블 생성
CREATE TABLE IF NOT EXISTS message_templates (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(200) NOT NULL,
  code VARCHAR(100) UNIQUE,
  message_type VARCHAR(20) NOT NULL CHECK (message_type IN ('SMS', 'LMS', 'ALIMTALK')),
  category VARCHAR(100),
  title VARCHAR(200),
  content TEXT NOT NULL,
  variables JSONB, -- 템플릿에 사용되는 변수 정의
  is_active BOOLEAN DEFAULT true,
  approval_status VARCHAR(20) DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  approval_date TIMESTAMPTZ,
  created_by VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

-- 인덱스 생성
CREATE INDEX idx_message_templates_code ON message_templates(code);
CREATE INDEX idx_message_templates_category ON message_templates(category);
CREATE INDEX idx_message_templates_is_active ON message_templates(is_active);
CREATE INDEX idx_message_templates_message_type ON message_templates(message_type);

-- 대량 발송 작업 테이블
CREATE TABLE IF NOT EXISTS message_batch_jobs (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  job_name VARCHAR(200),
  message_type VARCHAR(20) NOT NULL CHECK (message_type IN ('SMS', 'LMS', 'ALIMTALK')),
  template_id BIGINT REFERENCES message_templates(id),
  content TEXT,
  variables JSONB,
  total_recipients INT DEFAULT 0,
  sent_count INT DEFAULT 0,
  failed_count INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_by VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

-- 인덱스 생성
CREATE INDEX idx_message_batch_jobs_status ON message_batch_jobs(status);
CREATE INDEX idx_message_batch_jobs_created_at ON message_batch_jobs(created_at DESC);

-- 대량 발송 수신자 테이블
CREATE TABLE IF NOT EXISTS message_batch_recipients (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  batch_job_id BIGINT REFERENCES message_batch_jobs(id) ON DELETE CASCADE,
  recipient_phone VARCHAR(20) NOT NULL,
  recipient_name VARCHAR(100),
  customer_id BIGINT REFERENCES customers(id),
  variables JSONB, -- 개별 수신자별 변수
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed')),
  error_message TEXT,
  message_history_id BIGINT REFERENCES message_history(id),
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_message_batch_recipients_batch_job_id ON message_batch_recipients(batch_job_id);
CREATE INDEX idx_message_batch_recipients_status ON message_batch_recipients(status);
CREATE INDEX idx_message_batch_recipients_customer_id ON message_batch_recipients(customer_id);

-- 트리거: message_history 업데이트 시간 자동 갱신
CREATE OR REPLACE FUNCTION update_message_history_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_message_history_updated_at_trigger
  BEFORE UPDATE ON message_history
  FOR EACH ROW
  EXECUTE FUNCTION update_message_history_updated_at();

-- 트리거: message_templates 업데이트 시간 자동 갱신
CREATE OR REPLACE FUNCTION update_message_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_message_templates_updated_at_trigger
  BEFORE UPDATE ON message_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_message_templates_updated_at();

-- 기본 템플릿 데이터 삽입
INSERT INTO message_templates (name, code, message_type, category, content, variables, is_active, approval_status, created_by)
VALUES
  ('가입 신청 완료', 'careon_enrollment_001', 'ALIMTALK', 'enrollment',
   '[케어온] 가입 신청 완료\n\n안녕하세요, #{이름}님!\n케어온 가맹점 가입 신청이 정상적으로 접수되었습니다.\n\n▶ 신청업종: #{업종}\n▶ 신청일시: #{신청일시}\n▶ 처리상태: 검토중\n\n담당자가 영업일 기준 1-2일 내에 연락드릴 예정입니다.\n\n문의: 1866-1845',
   '{"이름": "string", "업종": "string", "신청일시": "string"}',
   true, 'approved', 'system'),

  ('가입 승인 완료', 'careon_approval_001', 'ALIMTALK', 'approval',
   '[케어온] 가맹점 승인 완료\n\n안녕하세요, #{이름}님!\n축하합니다! 케어온 가맹점 가입이 승인되었습니다.\n\n▶ 가맹점명: #{가맹점명}\n▶ 승인일시: #{승인일시}\n▶ 담당자: #{담당자명}\n\n서비스 이용 안내를 위해 담당자가 곧 연락드리겠습니다.\n\n케어온 관리자 페이지: https://careon.co.kr/admin\n문의: 1866-1845',
   '{"이름": "string", "가맹점명": "string", "승인일시": "string", "담당자명": "string"}',
   true, 'approved', 'system'),

  ('고객 공지', 'careon_notice_001', 'ALIMTALK', 'notice',
   '[케어온] 공지사항\n\n안녕하세요, #{이름}님!\n\n#{내용}\n\n자세한 사항은 케어온 앱에서 확인해주세요.\n\n문의: 1866-1845',
   '{"이름": "string", "내용": "string"}',
   true, 'approved', 'system'),

  ('일반 안내 SMS', null, 'SMS', 'general',
   '안녕하세요, #{이름}님. #{내용}',
   '{"이름": "string", "내용": "string"}',
   true, 'approved', 'system'),

  ('긴 안내 LMS', null, 'LMS', 'general',
   '[케어온] 안내\n\n안녕하세요, #{이름}님.\n\n#{내용}\n\n감사합니다.\n케어온 드림',
   '{"이름": "string", "내용": "string"}',
   true, 'approved', 'system');

-- 권한 설정
GRANT ALL ON message_history TO authenticated;
GRANT ALL ON message_templates TO authenticated;
GRANT ALL ON message_batch_jobs TO authenticated;
GRANT ALL ON message_batch_recipients TO authenticated;

-- RLS 정책 (필요시 활성화)
-- ALTER TABLE message_history ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE message_batch_jobs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE message_batch_recipients ENABLE ROW LEVEL SECURITY;
