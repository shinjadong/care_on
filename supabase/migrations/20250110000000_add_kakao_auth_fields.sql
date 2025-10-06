-- Add Kakao OAuth fields to customers table
ALTER TABLE customers
ADD COLUMN IF NOT EXISTS kakao_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS kakao_access_token TEXT,
ADD COLUMN IF NOT EXISTS kakao_refresh_token TEXT,
ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

-- Create index for faster kakao_id lookups
CREATE INDEX IF NOT EXISTS idx_customers_kakao_id ON customers(kakao_id);

-- Add comment
COMMENT ON COLUMN customers.kakao_id IS 'Kakao user ID for OAuth authentication';
COMMENT ON COLUMN customers.kakao_access_token IS 'Kakao OAuth access token';
COMMENT ON COLUMN customers.kakao_refresh_token IS 'Kakao OAuth refresh token';
COMMENT ON COLUMN customers.profile_image_url IS 'User profile image URL from Kakao';
COMMENT ON COLUMN customers.last_login_at IS 'Last login timestamp';
