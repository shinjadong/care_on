-- Create enrollment applications table
CREATE TABLE IF NOT EXISTS public.enrollment_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Step 1: Agreement flags
  agree_terms BOOLEAN DEFAULT FALSE,
  agree_privacy BOOLEAN DEFAULT FALSE,
  agree_marketing BOOLEAN DEFAULT FALSE,
  agree_tosspay BOOLEAN DEFAULT FALSE,
  agreed_card_companies TEXT,

  -- Step 2: Business type
  business_type TEXT CHECK (business_type IN ('개인사업자', '법인사업자')),

  -- Step 3: Representative information
  representative_name TEXT,
  phone_number TEXT,
  birth_date TEXT,
  gender TEXT CHECK (gender IN ('male', 'female')),

  -- Step 4: Business information
  business_name TEXT,
  business_number TEXT UNIQUE,
  business_address TEXT,
  business_detail_address TEXT,

  -- Step 5: Business category
  business_category TEXT,
  business_subcategory TEXT,
  business_keywords TEXT[],

  -- Step 6: Sales information
  monthly_sales TEXT,
  card_sales_ratio INTEGER,
  main_product TEXT,
  unit_price TEXT,

  -- Step 7: Settlement account
  bank_name TEXT,
  account_holder TEXT,
  account_number TEXT,
  settlement_date TEXT,

  -- Step 8: Additional services
  additional_services TEXT[],

  -- Step 9: Referral
  referral_code TEXT,

  -- Step 10: Document URLs (Vercel Blob)
  business_registration_url TEXT,
  id_card_front_url TEXT,
  id_card_back_url TEXT,
  bankbook_url TEXT,
  business_license_url TEXT,
  sign_photo_url TEXT,
  door_closed_url TEXT,
  door_open_url TEXT,
  interior_url TEXT,
  product_url TEXT,
  business_card_url TEXT,

  -- Corporate documents (for 법인사업자)
  corporate_registration_url TEXT,
  shareholder_list_url TEXT,
  seal_certificate_url TEXT,
  seal_usage_url TEXT,

  -- Step 11: Final confirmation
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'reviewing', 'approved', 'rejected')),
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  reviewer_notes TEXT,

  -- User tracking
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT
);

-- Create indexes
CREATE INDEX idx_enrollment_status ON public.enrollment_applications(status);
CREATE INDEX idx_enrollment_business_number ON public.enrollment_applications(business_number);
CREATE INDEX idx_enrollment_user_id ON public.enrollment_applications(user_id);
CREATE INDEX idx_enrollment_created_at ON public.enrollment_applications(created_at DESC);

-- Create RLS policies
ALTER TABLE public.enrollment_applications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own applications
CREATE POLICY "Users can insert own enrollment" ON public.enrollment_applications
  FOR INSERT
  WITH CHECK (true);

-- Policy: Users can view their own applications
CREATE POLICY "Users can view own enrollments" ON public.enrollment_applications
  FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- Policy: Users can update their own draft applications
CREATE POLICY "Users can update own draft enrollments" ON public.enrollment_applications
  FOR UPDATE
  USING (auth.uid() = user_id AND status = 'draft')
  WITH CHECK (auth.uid() = user_id AND status = 'draft');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_enrollment_updated_at
  BEFORE UPDATE ON public.enrollment_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create enrollment notes table for admin communication
CREATE TABLE IF NOT EXISTS public.enrollment_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  enrollment_id UUID REFERENCES public.enrollment_applications(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  author_name TEXT,
  note TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT FALSE
);

-- Create indexes for notes
CREATE INDEX idx_enrollment_notes_enrollment_id ON public.enrollment_notes(enrollment_id);
CREATE INDEX idx_enrollment_notes_created_at ON public.enrollment_notes(created_at DESC);

-- RLS for notes
ALTER TABLE public.enrollment_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view notes for their enrollments" ON public.enrollment_notes
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollment_applications
      WHERE id = enrollment_notes.enrollment_id
      AND user_id = auth.uid()
    )
    AND is_internal = FALSE
  );