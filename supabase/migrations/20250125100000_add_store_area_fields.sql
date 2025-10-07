-- Add store_area and need_local_data fields to enrollment_applications table
ALTER TABLE public.enrollment_applications
ADD COLUMN IF NOT EXISTS store_area TEXT,
ADD COLUMN IF NOT EXISTS need_local_data BOOLEAN DEFAULT FALSE;

-- Add comment for clarity
COMMENT ON COLUMN public.enrollment_applications.store_area IS '매장 면적 (평)';
COMMENT ON COLUMN public.enrollment_applications.need_local_data IS '매장 면적을 모르는 경우 TRUE';
