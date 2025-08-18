-- 법률 문서 테이블 생성
CREATE TABLE IF NOT EXISTS legal_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_type VARCHAR(50) NOT NULL UNIQUE, -- 'privacy-policy' or 'terms-of-service'
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_by VARCHAR(100)
);

-- 문서 변경 이력 테이블
CREATE TABLE IF NOT EXISTS legal_documents_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID REFERENCES legal_documents(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  version INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(100)
);

-- 업데이트 시간 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_legal_documents_updated_at 
  BEFORE UPDATE ON legal_documents 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 문서 변경 시 히스토리 저장 트리거
CREATE OR REPLACE FUNCTION save_legal_document_history()
RETURNS TRIGGER AS $$
BEGIN
  -- 버전 증가
  NEW.version = OLD.version + 1;
  
  -- 히스토리 저장
  INSERT INTO legal_documents_history (
    document_id,
    document_type,
    title,
    content,
    version,
    created_by
  ) VALUES (
    OLD.id,
    OLD.document_type,
    OLD.title,
    OLD.content,
    OLD.version,
    OLD.updated_by
  );
  
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER save_legal_document_history_trigger
  BEFORE UPDATE ON legal_documents
  FOR EACH ROW
  WHEN (OLD.content IS DISTINCT FROM NEW.content)
  EXECUTE FUNCTION save_legal_document_history();

-- 초기 데이터 삽입 (기존 마크다운 파일 내용을 여기에 넣어야 함)
INSERT INTO legal_documents (document_type, title, content, updated_by) 
VALUES 
  ('privacy-policy', '개인정보 처리방침', '# 개인정보 처리방침

**시행일: 2025년 1월 18일**

케어온(이하 ''회사'')은 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고...', 'system'),
  ('terms-of-service', '이용약관', '# 이용약관

**시행일: 2025년 1월 18일**

## 제1조 (목적)

본 약관은 케어온(이하 "회사")이 제공하는...', 'system')
ON CONFLICT (document_type) DO NOTHING;

-- RLS (Row Level Security) 정책
ALTER TABLE legal_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_documents_history ENABLE ROW LEVEL SECURITY;

-- 읽기는 모두 가능
CREATE POLICY "Legal documents are viewable by everyone" 
  ON legal_documents FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Legal documents history is viewable by everyone" 
  ON legal_documents_history FOR SELECT 
  USING (true);

-- 쓰기는 인증된 관리자만 (실제로는 서버 사이드에서 처리)
-- 여기서는 service_role 키를 사용할 것이므로 별도 정책 불필요