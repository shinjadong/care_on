-- Add likes functionality to reviews table
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;

-- Create likes table for tracking individual likes
CREATE TABLE IF NOT EXISTS review_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_identifier VARCHAR(255) NOT NULL, -- IP address or user ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(review_id, user_identifier)
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_review_likes_review_id ON review_likes(review_id);
CREATE INDEX IF NOT EXISTS idx_review_likes_user ON review_likes(user_identifier);

-- Enable RLS
ALTER TABLE review_likes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read likes
CREATE POLICY "Anyone can read likes" ON review_likes
  FOR SELECT USING (true);

-- Policy: Anyone can insert likes
CREATE POLICY "Anyone can insert likes" ON review_likes
  FOR INSERT WITH CHECK (true);

-- Policy: Users can delete their own likes
CREATE POLICY "Users can delete own likes" ON review_likes
  FOR DELETE USING (true);

-- Function to update likes count
CREATE OR REPLACE FUNCTION update_review_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE reviews
    SET likes_count = likes_count + 1
    WHERE id = NEW.review_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE reviews
    SET likes_count = GREATEST(likes_count - 1, 0)
    WHERE id = OLD.review_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update likes count
DROP TRIGGER IF EXISTS trigger_update_review_likes_count ON review_likes;
CREATE TRIGGER trigger_update_review_likes_count
  AFTER INSERT OR DELETE ON review_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_review_likes_count();