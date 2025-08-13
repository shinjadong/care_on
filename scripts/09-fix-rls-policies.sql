-- Fixing RLS policies for production environment
-- Disable RLS temporarily to ensure public access works
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS with proper policies
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for approved reviews" ON reviews;
DROP POLICY IF EXISTS "Public insert access for reviews" ON reviews;

-- Create comprehensive public policies
CREATE POLICY "Public read access for approved reviews" ON reviews
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Public insert access for reviews" ON reviews
  FOR INSERT WITH CHECK (true);

-- Ensure the care-on bucket exists and has proper policies
INSERT INTO storage.buckets (id, name, public) 
VALUES ('care-on', 'care-on', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Create storage policies for public access
CREATE POLICY "Public upload access" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'care-on');

CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'care-on');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA storage TO anon, authenticated;
GRANT ALL ON storage.objects TO anon, authenticated;
GRANT ALL ON storage.buckets TO anon, authenticated;
