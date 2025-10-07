-- Add card company status tracking columns to enrollment_applications
ALTER TABLE enrollment_applications
ADD COLUMN IF NOT EXISTS kb_card_status VARCHAR(50) DEFAULT NULL CHECK (kb_card_status IN ('pending', 'submitted', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS bc_card_status VARCHAR(50) DEFAULT NULL CHECK (bc_card_status IN ('pending', 'submitted', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS samsung_card_status VARCHAR(50) DEFAULT NULL CHECK (samsung_card_status IN ('pending', 'submitted', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS woori_card_status VARCHAR(50) DEFAULT NULL CHECK (woori_card_status IN ('pending', 'submitted', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS hana_card_status VARCHAR(50) DEFAULT NULL CHECK (hana_card_status IN ('pending', 'submitted', 'approved', 'rejected'));

-- Add merchant numbers for each card company
ALTER TABLE enrollment_applications
ADD COLUMN IF NOT EXISTS kb_merchant_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS bc_merchant_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS samsung_merchant_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS woori_merchant_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS hana_merchant_number VARCHAR(50);

-- Add onboarding status column for tracking checklist
ALTER TABLE enrollment_applications
ADD COLUMN IF NOT EXISTS onboarding_status JSONB DEFAULT NULL;

-- Add card approval dates
ALTER TABLE enrollment_applications
ADD COLUMN IF NOT EXISTS kb_card_approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS bc_card_approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS samsung_card_approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS woori_card_approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS hana_card_approved_at TIMESTAMP WITH TIME ZONE;

-- Add comments for documentation
COMMENT ON COLUMN enrollment_applications.kb_card_status IS 'KB카드 가맹 신청 상태';
COMMENT ON COLUMN enrollment_applications.bc_card_status IS 'BC카드 가맹 신청 상태';
COMMENT ON COLUMN enrollment_applications.samsung_card_status IS '삼성카드 가맹 신청 상태';
COMMENT ON COLUMN enrollment_applications.woori_card_status IS '우리카드 가맹 신청 상태';
COMMENT ON COLUMN enrollment_applications.hana_card_status IS '하나카드 가맹 신청 상태';

COMMENT ON COLUMN enrollment_applications.kb_merchant_number IS 'KB카드 가맹점 번호';
COMMENT ON COLUMN enrollment_applications.bc_merchant_number IS 'BC카드 가맹점 번호';
COMMENT ON COLUMN enrollment_applications.samsung_merchant_number IS '삼성카드 가맹점 번호';
COMMENT ON COLUMN enrollment_applications.woori_merchant_number IS '우리카드 가맹점 번호';
COMMENT ON COLUMN enrollment_applications.hana_merchant_number IS '하나카드 가맹점 번호';

COMMENT ON COLUMN enrollment_applications.onboarding_status IS '온보딩 체크리스트 상태 (JSON: tasks, notes, completed_at)';

-- Update existing approved applications to set card status to pending if card was requested
UPDATE enrollment_applications
SET
  kb_card_status = CASE WHEN kb_card = true THEN 'pending' ELSE NULL END,
  bc_card_status = CASE WHEN bc_card = true THEN 'pending' ELSE NULL END,
  samsung_card_status = CASE WHEN samsung_card = true THEN 'pending' ELSE NULL END,
  woori_card_status = CASE WHEN woori_card = true THEN 'pending' ELSE NULL END,
  hana_card_status = CASE WHEN hana_card = true THEN 'pending' ELSE NULL END
WHERE status = 'approved';
