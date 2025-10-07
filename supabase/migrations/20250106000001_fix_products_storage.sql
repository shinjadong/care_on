-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;

-- Ensure products bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- Create more permissive storage policies for products bucket
-- 1. Allow public read access
CREATE POLICY "Public read access for product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

-- 2. Allow any upload (for admin APIs using service role)
CREATE POLICY "Anyone can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'products');

-- 3. Allow any update
CREATE POLICY "Anyone can update product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'products')
WITH CHECK (bucket_id = 'products');

-- 4. Allow any delete
CREATE POLICY "Anyone can delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'products');

-- Ensure image_url column exists in products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Ensure image_url column exists in packages table
ALTER TABLE packages ADD COLUMN IF NOT EXISTS image_url TEXT;
