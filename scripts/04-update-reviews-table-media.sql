-- Add media columns to reviews table
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS images TEXT[], -- Array of image URLs
ADD COLUMN IF NOT EXISTS videos TEXT[], -- Array of video URLs  
ADD COLUMN IF NOT EXISTS youtube_urls TEXT[]; -- Array of YouTube URLs
