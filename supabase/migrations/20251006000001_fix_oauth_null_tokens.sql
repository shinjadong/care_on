-- Fix OAuth NULL token issue
-- GitHub Discussion #17106 solution: Convert NULL to empty string for OAuth users
-- These columns don't support NULL in Supabase Auth but OAuth users don't need them

-- Create trigger function to handle NULL tokens
CREATE OR REPLACE FUNCTION auth.handle_oauth_null_tokens()
RETURNS TRIGGER AS $$
BEGIN
  -- Convert NULL to empty string for confirmation_token
  IF NEW.confirmation_token IS NULL THEN
    NEW.confirmation_token := '';
  END IF;

  -- Convert NULL to empty string for email_change
  IF NEW.email_change IS NULL THEN
    NEW.email_change := '';
  END IF;

  -- Convert NULL to empty string for email_change_token_new
  IF NEW.email_change_token_new IS NULL THEN
    NEW.email_change_token_new := '';
  END IF;

  -- Convert NULL to empty string for recovery_token
  IF NEW.recovery_token IS NULL THEN
    NEW.recovery_token := '';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table
DROP TRIGGER IF EXISTS oauth_null_tokens_trigger ON auth.users;
CREATE TRIGGER oauth_null_tokens_trigger
  BEFORE INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auth.handle_oauth_null_tokens();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION auth.handle_oauth_null_tokens() TO postgres;
GRANT EXECUTE ON FUNCTION auth.handle_oauth_null_tokens() TO authenticated;
