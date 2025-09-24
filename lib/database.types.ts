export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      enrollment_applications: {
        Row: {
          id: string
          created_at: string
          updated_at: string

          // Agreement fields
          agree_terms: boolean | null
          agree_privacy: boolean | null
          agree_marketing: boolean | null
          agree_tosspay: boolean | null
          agreed_card_companies: string | null

          // Business info
          business_type: '개인사업자' | '법인사업자' | null
          representative_name: string | null
          phone_number: string | null
          birth_date: string | null
          gender: 'male' | 'female' | null

          business_name: string | null
          business_number: string | null
          business_address: string | null
          business_detail_address: string | null

          // Category
          business_category: string | null
          business_subcategory: string | null
          business_keywords: string[] | null

          // Sales info
          monthly_sales: string | null
          card_sales_ratio: number | null
          main_product: string | null
          unit_price: string | null

          // Settlement
          bank_name: string | null
          account_holder: string | null
          account_number: string | null
          settlement_date: string | null

          // Services & Referral
          additional_services: string[] | null
          referral_code: string | null

          // Document URLs
          business_registration_url: string | null
          id_card_front_url: string | null
          id_card_back_url: string | null
          bankbook_url: string | null
          business_license_url: string | null
          sign_photo_url: string | null
          door_closed_url: string | null
          door_open_url: string | null
          interior_url: string | null
          product_url: string | null
          business_card_url: string | null

          // Corporate documents
          corporate_registration_url: string | null
          shareholder_list_url: string | null
          seal_certificate_url: string | null
          seal_usage_url: string | null

          // Status
          status: 'draft' | 'submitted' | 'reviewing' | 'approved' | 'rejected' | null
          submitted_at: string | null
          reviewed_at: string | null
          reviewer_notes: string | null

          // User tracking
          user_id: string | null
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string

          agree_terms?: boolean | null
          agree_privacy?: boolean | null
          agree_marketing?: boolean | null
          agree_tosspay?: boolean | null
          agreed_card_companies?: string | null

          business_type?: '개인사업자' | '법인사업자' | null
          representative_name?: string | null
          phone_number?: string | null
          birth_date?: string | null
          gender?: 'male' | 'female' | null

          business_name?: string | null
          business_number?: string | null
          business_address?: string | null
          business_detail_address?: string | null

          business_category?: string | null
          business_subcategory?: string | null
          business_keywords?: string[] | null

          monthly_sales?: string | null
          card_sales_ratio?: number | null
          main_product?: string | null
          unit_price?: string | null

          bank_name?: string | null
          account_holder?: string | null
          account_number?: string | null
          settlement_date?: string | null

          additional_services?: string[] | null
          referral_code?: string | null

          business_registration_url?: string | null
          id_card_front_url?: string | null
          id_card_back_url?: string | null
          bankbook_url?: string | null
          business_license_url?: string | null
          sign_photo_url?: string | null
          door_closed_url?: string | null
          door_open_url?: string | null
          interior_url?: string | null
          product_url?: string | null
          business_card_url?: string | null

          corporate_registration_url?: string | null
          shareholder_list_url?: string | null
          seal_certificate_url?: string | null
          seal_usage_url?: string | null

          status?: 'draft' | 'submitted' | 'reviewing' | 'approved' | 'rejected' | null
          submitted_at?: string | null
          reviewed_at?: string | null
          reviewer_notes?: string | null

          user_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string

          agree_terms?: boolean | null
          agree_privacy?: boolean | null
          agree_marketing?: boolean | null
          agree_tosspay?: boolean | null
          agreed_card_companies?: string | null

          business_type?: '개인사업자' | '법인사업자' | null
          representative_name?: string | null
          phone_number?: string | null
          birth_date?: string | null
          gender?: 'male' | 'female' | null

          business_name?: string | null
          business_number?: string | null
          business_address?: string | null
          business_detail_address?: string | null

          business_category?: string | null
          business_subcategory?: string | null
          business_keywords?: string[] | null

          monthly_sales?: string | null
          card_sales_ratio?: number | null
          main_product?: string | null
          unit_price?: string | null

          bank_name?: string | null
          account_holder?: string | null
          account_number?: string | null
          settlement_date?: string | null

          additional_services?: string[] | null
          referral_code?: string | null

          business_registration_url?: string | null
          id_card_front_url?: string | null
          id_card_back_url?: string | null
          bankbook_url?: string | null
          business_license_url?: string | null
          sign_photo_url?: string | null
          door_closed_url?: string | null
          door_open_url?: string | null
          interior_url?: string | null
          product_url?: string | null
          business_card_url?: string | null

          corporate_registration_url?: string | null
          shareholder_list_url?: string | null
          seal_certificate_url?: string | null
          seal_usage_url?: string | null

          status?: 'draft' | 'submitted' | 'reviewing' | 'approved' | 'rejected' | null
          submitted_at?: string | null
          reviewed_at?: string | null
          reviewer_notes?: string | null

          user_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
        }
      }
      enrollment_notes: {
        Row: {
          id: string
          enrollment_id: string | null
          created_at: string
          author_id: string | null
          author_name: string | null
          note: string
          is_internal: boolean | null
        }
        Insert: {
          id?: string
          enrollment_id?: string | null
          created_at?: string
          author_id?: string | null
          author_name?: string | null
          note: string
          is_internal?: boolean | null
        }
        Update: {
          id?: string
          enrollment_id?: string | null
          created_at?: string
          author_id?: string | null
          author_name?: string | null
          note?: string
          is_internal?: boolean | null
        }
      }
    }
  }
}