-- Adding RLS policies for public read access to reviews
-- Enable RLS on reviews table
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access to approved reviews
CREATE POLICY "Public can read approved reviews" ON reviews
  FOR SELECT USING (is_approved = true);

-- Allow public insert for new reviews (they will be unapproved by default)
CREATE POLICY "Public can insert reviews" ON reviews
  FOR INSERT WITH CHECK (true);

-- Check if policies were created successfully
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'reviews';
