-- Create contracts table for customer contract management
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 고객 기본 정보
  customer_number VARCHAR(20) UNIQUE NOT NULL DEFAULT ('CO' || LPAD(EXTRACT(EPOCH FROM NOW())::TEXT, 8, '0')),
  business_name VARCHAR(200) NOT NULL,
  owner_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  address TEXT NOT NULL,
  business_registration VARCHAR(20),
  
  -- 결제 정보
  bank_name VARCHAR(50) NOT NULL,
  account_number VARCHAR(50) NOT NULL,
  account_holder VARCHAR(100) NOT NULL,
  
  -- 추가 요청사항
  additional_requests TEXT,
  
  -- 서류 이미지 URLs
  bank_account_image TEXT,
  id_card_image TEXT,
  business_registration_image TEXT,
  
  -- 동의 정보
  terms_agreed BOOLEAN DEFAULT false,
  info_agreed BOOLEAN DEFAULT false,
  
  -- 계약 상태
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'quoted', 'approved', 'active', 'completed', 'cancelled')),
  
  -- 견적 정보 (매니저가 나중에 입력)
  internet_plan VARCHAR(50),
  internet_monthly_fee INTEGER DEFAULT 0,
  cctv_count VARCHAR(20),
  cctv_monthly_fee INTEGER DEFAULT 0,
  pos_needed BOOLEAN DEFAULT false,
  pos_monthly_fee INTEGER DEFAULT 0,
  tv_needed BOOLEAN DEFAULT false,
  tv_monthly_fee INTEGER DEFAULT 0,
  insurance_needed BOOLEAN DEFAULT false,
  insurance_monthly_fee INTEGER DEFAULT 0,
  
  -- 계약 조건
  free_period INTEGER DEFAULT 12,        -- 무료 기간 (개월)
  contract_period INTEGER DEFAULT 36,    -- 계약 기간 (개월)
  discount_rate INTEGER DEFAULT 0,      -- 할인율 (%)
  total_monthly_fee INTEGER DEFAULT 0,  -- 총 월 요금
  
  -- 특별 조건
  special_conditions TEXT,
  manager_notes TEXT,
  
  -- 처리 정보
  processed_by VARCHAR(100),
  processed_at TIMESTAMP WITH TIME ZONE,
  quote_sent_at TIMESTAMP WITH TIME ZONE,
  
  -- 타임스탬프
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- Create policies (모든 접근 허용)
CREATE POLICY "Allow all access to contracts" ON contracts
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_contracts_customer_number ON contracts (customer_number);
CREATE INDEX IF NOT EXISTS idx_contracts_phone ON contracts (phone);
CREATE INDEX IF NOT EXISTS idx_contracts_owner_name ON contracts (owner_name);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts (status);
CREATE INDEX IF NOT EXISTS idx_contracts_created_at ON contracts (created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_contracts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_contracts_updated_at_trigger ON contracts;
CREATE TRIGGER update_contracts_updated_at_trigger
  BEFORE UPDATE ON contracts 
  FOR EACH ROW EXECUTE FUNCTION update_contracts_updated_at();

-- Add table comments
COMMENT ON TABLE contracts IS '고객 계약 관리 테이블 - 카카오톡 링크를 통한 고객 신청 및 매니저 견적 관리';
COMMENT ON COLUMN contracts.customer_number IS '자동 생성 고객번호 (CO + 숫자)';
COMMENT ON COLUMN contracts.status IS 'pending: 신청접수, quoted: 견적완료, approved: 승인, active: 활성, completed: 완료, cancelled: 취소';
COMMENT ON COLUMN contracts.free_period IS '무료 서비스 제공 기간 (개월)';
COMMENT ON COLUMN contracts.contract_period IS '총 계약 기간 (개월)';
