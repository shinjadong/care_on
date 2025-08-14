-- Create storage bucket and policies for care-on
-- This allows public access for file uploads without authentication

-- Create the care-on bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('care-on', 'care-on', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public uploads to the care-on bucket
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'care-on');

-- Allow public reads from the care-on bucket
CREATE POLICY "Allow public reads" ON storage.objects
FOR SELECT USING (bucket_id = 'care-on');

-- Allow public updates to the care-on bucket
CREATE POLICY "Allow public updates" ON storage.objects
FOR UPDATE USING (bucket_id = 'care-on');

-- Allow public deletes from the care-on bucket
CREATE POLICY "Allow public deletes" ON storage.objects
FOR DELETE USING (bucket_id = 'care-on');
