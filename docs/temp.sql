-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.careon_applications (
  id bigint NOT NULL DEFAULT nextval('careon_applications_id_seq'::regclass),
  company_name text,
  name text NOT NULL,
  phone_number text NOT NULL,
  birth_date text NOT NULL,
  business_address text NOT NULL,
  startup_period text NOT NULL,
  business_status text NOT NULL,
  open_date date,
  existing_services jsonb DEFAULT '{"cctv": false, "internet": false, "insurance": false}'::jsonb,
  business_type integer NOT NULL,
  call_datetime text NOT NULL,
  agree_privacy boolean NOT NULL DEFAULT false,
  agree_marketing boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT careon_applications_pkey PRIMARY KEY (id)
);
CREATE TABLE public.contracts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  customer_id uuid,
  customer_number character varying NOT NULL DEFAULT generate_customer_number(),
  contract_number character varying NOT NULL DEFAULT generate_contract_number() UNIQUE,
  business_name character varying NOT NULL,
  owner_name character varying NOT NULL,
  phone character varying NOT NULL,
  email character varying,
  address text NOT NULL,
  business_registration character varying,
  internet_plan character varying NOT NULL,
  internet_monthly_fee integer DEFAULT 0,
  cctv_count character varying NOT NULL,
  cctv_monthly_fee integer DEFAULT 0,
  installation_address text,
  bank_name character varying NOT NULL,
  account_number character varying NOT NULL,
  account_holder character varying NOT NULL,
  contract_period integer DEFAULT 3,
  free_period integer DEFAULT 1,
  start_date date DEFAULT CURRENT_DATE,
  end_date date DEFAULT (CURRENT_DATE + '3 years'::interval),
  additional_requests text,
  terms_agreed boolean DEFAULT false,
  info_agreed boolean DEFAULT false,
  status character varying DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying::text, 'quoted'::character varying::text, 'approved'::character varying::text, 'active'::character varying::text, 'suspended'::character varying::text, 'terminated'::character varying::text, 'completed'::character varying::text])),
  admin_notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  processed_by character varying,
  processed_at timestamp with time zone,
  bank_account_image text,
  id_card_image text,
  business_registration_image text,
  total_monthly_fee integer DEFAULT 0,
  CONSTRAINT contracts_pkey PRIMARY KEY (id)
);
CREATE TABLE public.customer_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  customer_id uuid,
  phone character varying NOT NULL,
  name character varying NOT NULL,
  session_token character varying NOT NULL UNIQUE,
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + '30 days'::interval),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT customer_sessions_pkey PRIMARY KEY (id)
);
CREATE TABLE public.employees (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL,
  phone_number text NOT NULL,
  department text NOT NULL,
  position text,
  email text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT employees_pkey PRIMARY KEY (id)
);
CREATE TABLE public.faq (
  id bigint NOT NULL DEFAULT nextval('faq_id_seq'::regclass),
  question text NOT NULL,
  answer text NOT NULL,
  visible boolean DEFAULT true,
  order_index integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT faq_pkey PRIMARY KEY (id)
);
CREATE TABLE public.legal_documents (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  document_type character varying NOT NULL UNIQUE,
  title character varying NOT NULL,
  content text NOT NULL,
  version integer DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_by character varying,
  CONSTRAINT legal_documents_pkey PRIMARY KEY (id)
);
CREATE TABLE public.legal_documents_history (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  document_id uuid,
  document_type character varying NOT NULL,
  title character varying NOT NULL,
  content text NOT NULL,
  version integer NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  created_by character varying,
  CONSTRAINT legal_documents_history_pkey PRIMARY KEY (id),
  CONSTRAINT legal_documents_history_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.legal_documents(id)
);
CREATE TABLE public.media (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  filename character varying NOT NULL,
  original_filename character varying NOT NULL,
  file_path character varying NOT NULL,
  file_size integer NOT NULL,
  mime_type character varying NOT NULL,
  alt_text character varying,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT media_pkey PRIMARY KEY (id)
);
CREATE TABLE public.pages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug character varying NOT NULL UNIQUE,
  title character varying NOT NULL,
  blocks jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT pages_pkey PRIMARY KEY (id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text UNIQUE,
  full_name text,
  role text DEFAULT 'user'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.quick_applications (
  id bigint NOT NULL DEFAULT nextval('careon_applications_id_seq'::regclass),
  company_name text,
  name text NOT NULL,
  phone_number text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT quick_applications_pkey PRIMARY KEY (id)
);
CREATE TABLE public.review_pre (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  category character varying NOT NULL,
  business character varying NOT NULL,
  title character varying,
  content text NOT NULL,
  highlight character varying,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  period character varying,
  author_name character varying,
  author_email character varying,
  is_approved boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  images ARRAY,
  videos ARRAY,
  youtube_urls ARRAY,
  business_experience character varying CHECK (business_experience::text = ANY (ARRAY['신규창업'::character varying, '1년 이상'::character varying, '3년 이상'::character varying]::text[])),
  package_name character varying,
  trial_period character varying DEFAULT '체험 중'::character varying,
  trial_type character varying DEFAULT '무료 체험'::character varying,
  CONSTRAINT review_pre_pkey PRIMARY KEY (id)
);
CREATE TABLE public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  category character varying NOT NULL,
  business character varying NOT NULL,
  content text NOT NULL,
  highlight ARRAY,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  period character varying,
  author_name character varying,
  author_email character varying,
  is_approved boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  images ARRAY,
  videos ARRAY,
  youtube_urls ARRAY,
  title character varying,
  CONSTRAINT reviews_pkey PRIMARY KEY (id)
);