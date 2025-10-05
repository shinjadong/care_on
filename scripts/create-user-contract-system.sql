-- Create comprehensive user and contract system for CareOn

-- 1. Create customers table (users with phone + name authentication)
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 고객 기본 정보 (인증 기준)
  phone VARCHAR(20) UNIQUE NOT NULL,        -- 전화번호 (로그인 ID 역할)
  name VARCHAR(100) NOT NULL,               -- 본명 (인증 기준)
  
  -- 고객 번호 (자동 생성 고정값)
  customer_number VARCHAR(20) UNIQUE NOT NULL DEFAULT ('CO' || LPAD(EXTRACT(EPOCH FROM NOW())::TEXT, 10, '0')),
  
  -- 추가 정보
  email VARCHAR(255),
  address TEXT,
  business_name VARCHAR(200),
  business_registration VARCHAR(20),
  
  -- 상태 관리
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  
  -- 타임스탬프
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- 2. Create contracts table (updated with customer relationship)
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 고객 연결
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  customer_number VARCHAR(20) NOT NULL,     -- 중복 저장으로 빠른 조회
  
  -- 계약 기본 정보
  contract_number VARCHAR(30) UNIQUE NOT NULL DEFAULT ('CT' || TO_CHAR(NOW(), 'YYMMDD') || LPAD(EXTRACT(EPOCH FROM NOW())::TEXT, 6, '0')),
  
  -- 사업자 정보 (customers 테이블과 연동하되 계약별로 별도 저장 가능)
  business_name VARCHAR(200) NOT NULL,
  owner_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  address TEXT NOT NULL,
  business_registration VARCHAR(20),
  
  -- 서비스 정보
  internet_plan VARCHAR(50) NOT NULL,
  internet_monthly_fee INTEGER DEFAULT 0,   -- 월 요금 (첫 1년 0원)
  cctv_count VARCHAR(20) NOT NULL,
  cctv_monthly_fee INTEGER DEFAULT 0,      -- 월 요금 (첫 1년 0원)
  installation_address TEXT,
  
  -- 결제 정보
  bank_name VARCHAR(50) NOT NULL,
  account_number VARCHAR(50) NOT NULL,
  account_holder VARCHAR(100) NOT NULL,
  
  -- 계약 조건
  contract_period INTEGER DEFAULT 3,       -- 계약 기간 (년)
  free_period INTEGER DEFAULT 1,          -- 무료 기간 (년)
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE DEFAULT (CURRENT_DATE + INTERVAL '3 years'),
  
  -- 추가 정보
  additional_requests TEXT,
  
  -- 서류 이미지 URLs
  bank_account_image TEXT,              -- 통장 사본 이미지
  id_card_image TEXT,                   -- 신분증 이미지
  business_registration_image TEXT,      -- 사업자등록증 이미지
  
  -- 동의 정보
  terms_agreed BOOLEAN DEFAULT false,
  info_agreed BOOLEAN DEFAULT false,
  
  -- 처리 상태
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'active', 'suspended', 'terminated', 'completed')),
  admin_notes TEXT,
  
  -- 타임스탬프
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- 처리자 정보
  processed_by VARCHAR(100),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- 3. Create customer authentication sessions table (simple phone + name auth)
CREATE TABLE IF NOT EXISTS customer_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  phone VARCHAR(20) NOT NULL,
  name VARCHAR(100) NOT NULL,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '30 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for customers table (with IF NOT EXISTS equivalent)
DO $$ BEGIN
  CREATE POLICY "Customers can view own data" ON customers
    FOR SELECT USING (phone = current_setting('app.current_phone', true));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Allow customer registration" ON customers
    FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Customers can update own data" ON customers
    FOR UPDATE USING (phone = current_setting('app.current_phone', true));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Policies for contracts table
DO $$ BEGIN
  CREATE POLICY "Customers can view own contracts" ON contracts
    FOR SELECT USING (phone = current_setting('app.current_phone', true));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Allow contract submission" ON contracts
    FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admin can view all contracts" ON contracts
    FOR SELECT USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admin can update contracts" ON contracts
    FOR UPDATE USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Policies for sessions table
DO $$ BEGIN
  CREATE POLICY "Allow session creation" ON customer_sessions
    FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can view own sessions" ON customer_sessions
    FOR SELECT USING (phone = current_setting('app.current_phone', true));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers (phone);
CREATE INDEX IF NOT EXISTS idx_customers_customer_number ON customers (customer_number);
CREATE INDEX IF NOT EXISTS idx_contracts_customer_id ON contracts (customer_id);
CREATE INDEX IF NOT EXISTS idx_contracts_contract_number ON contracts (contract_number);
CREATE INDEX IF NOT EXISTS idx_customer_sessions_token ON customer_sessions (session_token);
CREATE INDEX IF NOT EXISTS idx_customer_sessions_expires ON customer_sessions (expires_at);

-- Create function to generate next customer number
CREATE OR REPLACE FUNCTION generate_customer_number()
RETURNS TEXT AS $$
DECLARE
  next_num INTEGER;
  customer_num TEXT;
BEGIN
  -- Get the next sequence number based on existing customers
  SELECT COALESCE(MAX(CAST(SUBSTRING(customer_number FROM 3) AS INTEGER)), 0) + 1 
  INTO next_num
  FROM customers 
  WHERE customer_number ~ '^CO[0-9]+$';
  
  -- Format as CO + 6-digit number
  customer_num := 'CO' || LPAD(next_num::TEXT, 6, '0');
  
  RETURN customer_num;
END;
$$ LANGUAGE plpgsql;

-- Update customers table to use the function
ALTER TABLE customers ALTER COLUMN customer_number SET DEFAULT generate_customer_number();

-- Create function to generate contract number
CREATE OR REPLACE FUNCTION generate_contract_number()
RETURNS TEXT AS $$
DECLARE
  next_num INTEGER;
  contract_num TEXT;
  date_part TEXT;
BEGIN
  date_part := TO_CHAR(NOW(), 'YYMMDD');
  
  -- Get today's contract count + 1
  SELECT COALESCE(COUNT(*), 0) + 1 
  INTO next_num
  FROM contracts 
  WHERE contract_number LIKE 'CT' || date_part || '%';
  
  -- Format as CT + YYMMDD + 3-digit sequence
  contract_num := 'CT' || date_part || LPAD(next_num::TEXT, 3, '0');
  
  RETURN contract_num;
END;
$$ LANGUAGE plpgsql;

-- Update contracts table to use the function  
ALTER TABLE contracts ALTER COLUMN contract_number SET DEFAULT generate_contract_number();

-- Create RPC functions to bypass RLS for contract system

-- Function to get customer by phone and name (bypasses RLS)
CREATE OR REPLACE FUNCTION get_customer_by_phone_name(
  input_phone VARCHAR,
  input_name VARCHAR
)
RETURNS SETOF customers
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM customers 
  WHERE phone = input_phone AND name = input_name;
END;
$$;

-- Function to create new customer (bypasses RLS)
CREATE OR REPLACE FUNCTION create_new_customer(
  input_phone VARCHAR,
  input_name VARCHAR,
  input_email VARCHAR DEFAULT NULL,
  input_address TEXT DEFAULT NULL,
  input_business_name VARCHAR DEFAULT NULL,
  input_business_registration VARCHAR DEFAULT NULL
)
RETURNS customers
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  new_customer customers;
BEGIN
  INSERT INTO customers (
    phone, 
    name, 
    email, 
    address, 
    business_name, 
    business_registration
  ) VALUES (
    input_phone,
    input_name,
    input_email,
    input_address,
    input_business_name,
    input_business_registration
  ) RETURNING * INTO new_customer;
  
  RETURN new_customer;
END;
$$;

-- Function to create new contract (bypasses RLS)
CREATE OR REPLACE FUNCTION create_new_contract(
  contract_data JSONB
)
RETURNS contracts
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  new_contract contracts;
BEGIN
  INSERT INTO contracts (
    customer_id,
    customer_number,
    business_name,
    owner_name,
    phone,
    email,
    address,
    business_registration,
    internet_plan,
    cctv_count,
    installation_address,
    bank_name,
    account_number,
    account_holder,
    additional_requests,
    terms_agreed,
    info_agreed,
    bank_account_image,
    id_card_image,
    business_registration_image,
    status
  ) VALUES (
    (contract_data->>'customer_id')::UUID,
    contract_data->>'customer_number',
    contract_data->>'business_name',
    contract_data->>'owner_name',
    contract_data->>'phone',
    contract_data->>'email',
    contract_data->>'address',
    contract_data->>'business_registration',
    contract_data->>'internet_plan',
    contract_data->>'cctv_count',
    contract_data->>'installation_address',
    contract_data->>'bank_name',
    contract_data->>'account_number',
    contract_data->>'account_holder',
    contract_data->>'additional_requests',
    (contract_data->>'terms_agreed')::BOOLEAN,
    (contract_data->>'info_agreed')::BOOLEAN,
    contract_data->>'bank_account_image',
    contract_data->>'id_card_image',
    contract_data->>'business_registration_image',
    contract_data->>'status'
  ) RETURNING * INTO new_contract;
  
  RETURN new_contract;
END;
$$;

-- Grant execute permissions on RPC functions
GRANT EXECUTE ON FUNCTION get_customer_by_phone_name(VARCHAR, VARCHAR) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION create_new_customer(VARCHAR, VARCHAR, VARCHAR, TEXT, VARCHAR, VARCHAR) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION create_new_contract(JSONB) TO anon, authenticated, service_role;

-- Add sample data comments
COMMENT ON FUNCTION generate_customer_number() IS '고객번호 자동 생성: CO000001, CO000002, ...';
COMMENT ON FUNCTION generate_contract_number() IS '계약번호 자동 생성: CT240910001, CT240910002, ...';

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers (DROP IF EXISTS to avoid conflicts)
DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at 
  BEFORE UPDATE ON customers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contracts_updated_at ON contracts;
CREATE TRIGGER update_contracts_updated_at 
  BEFORE UPDATE ON contracts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();