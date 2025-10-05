-- Create contracts table for franchise agreements
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 사업자 기본 정보
  business_name VARCHAR(200) NOT NULL,
  owner_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  address TEXT NOT NULL,
  business_registration VARCHAR(20),
  
  -- 서비스 정보
  internet_plan VARCHAR(50) NOT NULL,
  cctv_count VARCHAR(20) NOT NULL,
  installation_address TEXT,
  
  -- 결제 정보
  bank_name VARCHAR(50) NOT NULL,
  account_number VARCHAR(50) NOT NULL,
  account_holder VARCHAR(100) NOT NULL,
  
  -- 추가 정보
  additional_requests TEXT,
  
  -- 동의 정보
  terms_agreed BOOLEAN DEFAULT false,
  info_agreed BOOLEAN DEFAULT false,
  
  -- 처리 상태
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  admin_notes TEXT,
  
  -- 타임스탬프
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- 처리자 정보
  processed_by VARCHAR(100),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- Create policies for public insert (customers can submit)
CREATE POLICY "Allow public insert" ON contracts
  FOR INSERT WITH CHECK (true);

-- Create policies for authenticated read/update (admin only)
CREATE POLICY "Allow authenticated read" ON contracts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON contracts
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_contracts_status_created 
  ON contracts (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contracts_phone 
  ON contracts (phone);

CREATE INDEX IF NOT EXISTS idx_contracts_business_name 
  ON contracts (business_name);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_contracts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_contracts_updated_at_trigger
  BEFORE UPDATE ON contracts 
  FOR EACH ROW EXECUTE FUNCTION update_contracts_updated_at();

-- Add comments for documentation
COMMENT ON TABLE contracts IS '가맹점 계약 정보 테이블';
COMMENT ON COLUMN contracts.status IS 'pending: 접수, approved: 승인, rejected: 거부, completed: 완료';
COMMENT ON COLUMN contracts.trial_period IS '첫 1년 무료, 3년 약정 조건';
COMMENT ON COLUMN contracts.installation_address IS '설치 주소 (비어있으면 사업장 주소와 동일)';
COMMENT ON COLUMN contracts.admin_notes IS '관리자 메모 및 처리 내역';