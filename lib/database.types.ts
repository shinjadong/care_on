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
      products: {
        Row: {
          product_id: string
          name: string
          category: string
          provider: string | null
          monthly_fee: number | null
          description: string | null
          available: boolean | null
          closure_refund_rate: number | null
          max_discount_rate: number | null
          discount_tiers: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          product_id?: string
          name: string
          category: string
          provider?: string | null
          monthly_fee?: number | null
          description?: string | null
          available?: boolean | null
          closure_refund_rate?: number | null
          max_discount_rate?: number | null
          discount_tiers?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          product_id?: string
          name?: string
          category?: string
          provider?: string | null
          monthly_fee?: number | null
          description?: string | null
          available?: boolean | null
          closure_refund_rate?: number | null
          max_discount_rate?: number | null
          discount_tiers?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          id: string
          title: string | null
          category: string | null
          business: string | null
          content: string | null
          author_name: string | null
          author_email: string | null
          rating: number | null
          period: string | null
          highlight: Json | null
          images: Json | null
          videos: Json | null
          youtube_urls: Json | null
          is_approved: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title?: string | null
          category?: string | null
          business?: string | null
          content?: string | null
          author_name?: string | null
          author_email?: string | null
          rating?: number | null
          period?: string | null
          highlight?: Json | null
          images?: Json | null
          videos?: Json | null
          youtube_urls?: Json | null
          is_approved?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string | null
          category?: string | null
          business?: string | null
          content?: string | null
          author_name?: string | null
          author_email?: string | null
          rating?: number | null
          period?: string | null
          highlight?: Json | null
          images?: Json | null
          videos?: Json | null
          youtube_urls?: Json | null
          is_approved?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          customer_id: string
          customer_code: string
          business_name: string | null
          owner_name: string | null
          business_registration: string | null
          phone: string | null
          email: string | null
          address: string | null
          status: string | null
          care_status: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          customer_id?: string
          customer_code: string
          business_name?: string | null
          owner_name?: string | null
          business_registration?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          status?: string | null
          care_status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          customer_id?: string
          customer_code?: string
          business_name?: string | null
          owner_name?: string | null
          business_registration?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          status?: string | null
          care_status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      contracts: {
        Row: {
          id: string
          customer_id: string | null
          customer_number: string | null
          contract_number: string | null
          business_name: string | null
          owner_name: string | null
          phone: string | null
          email: string | null
          address: string | null
          business_registration: string | null
          internet_plan: string | null
          internet_monthly_fee: number | null
          cctv_count: number | null
          cctv_monthly_fee: number | null
          installation_address: string | null
          bank_name: string | null
          account_number: string | null
          account_holder: string | null
          additional_requests: string | null
          bank_account_image: string | null
          id_card_image: string | null
          business_registration_image: string | null
          terms_agreed: boolean | null
          info_agreed: boolean | null
          status: string | null
          billing_day: number | null
          remittance_day: number | null
          admin_notes: Json | null
          contract_period: number | null
          free_period: number | null
          total_monthly_fee: number | null
          package_id: string | null
          package: string | null
          customer_signature_agreed: boolean | null
          customer_signed_at: string | null
          start_date: string | null
          end_date: string | null
          processed_by: string | null
          processed_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          customer_id?: string | null
          customer_number?: string | null
          contract_number?: string | null
          business_name?: string | null
          owner_name?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          business_registration?: string | null
          internet_plan?: string | null
          internet_monthly_fee?: number | null
          cctv_count?: number | null
          cctv_monthly_fee?: number | null
          installation_address?: string | null
          bank_name?: string | null
          account_number?: string | null
          account_holder?: string | null
          additional_requests?: string | null
          bank_account_image?: string | null
          id_card_image?: string | null
          business_registration_image?: string | null
          terms_agreed?: boolean | null
          info_agreed?: boolean | null
          status?: string | null
          billing_day?: number | null
          remittance_day?: number | null
          admin_notes?: Json | null
          contract_period?: number | null
          free_period?: number | null
          total_monthly_fee?: number | null
          package_id?: string | null
          package?: string | null
          customer_signature_agreed?: boolean | null
          customer_signed_at?: string | null
          start_date?: string | null
          end_date?: string | null
          processed_by?: string | null
          processed_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          customer_id?: string | null
          customer_number?: string | null
          contract_number?: string | null
          business_name?: string | null
          owner_name?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          business_registration?: string | null
          internet_plan?: string | null
          internet_monthly_fee?: number | null
          cctv_count?: number | null
          cctv_monthly_fee?: number | null
          installation_address?: string | null
          bank_name?: string | null
          account_number?: string | null
          account_holder?: string | null
          additional_requests?: string | null
          bank_account_image?: string | null
          id_card_image?: string | null
          business_registration_image?: string | null
          terms_agreed?: boolean | null
          info_agreed?: boolean | null
          status?: string | null
          billing_day?: number | null
          remittance_day?: number | null
          admin_notes?: Json | null
          contract_period?: number | null
          free_period?: number | null
          total_monthly_fee?: number | null
          package_id?: string | null
          package?: string | null
          customer_signature_agreed?: boolean | null
          customer_signed_at?: string | null
          start_date?: string | null
          end_date?: string | null
          processed_by?: string | null
          processed_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      contract_items: {
        Row: {
          id: string
          contract_id: string | null
          product_id: string | null
          quantity: number | null
          fee: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          contract_id?: string | null
          product_id?: string | null
          quantity?: number | null
          fee?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          contract_id?: string | null
          product_id?: string | null
          quantity?: number | null
          fee?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      packages: {
        Row: {
          package_id: string
          name: string
          monthly_fee: number | null
          contract_period: number | null
          free_period: number | null
          closure_refund_rate: number | null
          included_services: Json | null
          description: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          package_id?: string
          name: string
          monthly_fee?: number | null
          contract_period?: number | null
          free_period?: number | null
          closure_refund_rate?: number | null
          included_services?: Json | null
          description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          package_id?: string
          name?: string
          monthly_fee?: number | null
          contract_period?: number | null
          free_period?: number | null
          closure_refund_rate?: number | null
          included_services?: Json | null
          description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      customer_activities: {
        Row: {
          id: string
          customer_id: string | null
          activity_type: string | null
          title: string | null
          description: string | null
          activity_data: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          customer_id?: string | null
          activity_type?: string | null
          title?: string | null
          description?: string | null
          activity_data?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          customer_id?: string | null
          activity_type?: string | null
          title?: string | null
          description?: string | null
          activity_data?: Json | null
          created_at?: string | null
        }
        Relationships: []
      }
      enrollment_applications: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          agree_terms: boolean | null
          agree_privacy: boolean | null
          agree_marketing: boolean | null
          agree_tosspay: boolean | null
          agreed_card_companies: string | null
          business_type: "개인사업자" | "법인사업자" | null
          representative_name: string | null
          phone_number: string | null
          birth_date: string | null
          gender: "male" | "female" | null
          business_name: string | null
          business_number: string | null
          business_address: string | null
          business_detail_address: string | null
          business_category: string | null
          business_subcategory: string | null
          business_keywords: string[] | null
          monthly_sales: string | null
          card_sales_ratio: number | null
          main_product: string | null
          unit_price: string | null
          bank_name: string | null
          account_holder: string | null
          account_number: string | null
          settlement_date: string | null
          additional_services: string[] | null
          referral_code: string | null
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
          corporate_registration_url: string | null
          shareholder_list_url: string | null
          seal_certificate_url: string | null
          seal_usage_url: string | null
          status: "draft" | "submitted" | "reviewing" | "approved" | "rejected" | null
          submitted_at: string | null
          reviewed_at: string | null
          reviewer_notes: string | null
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
          business_type?: "개인사업자" | "법인사업자" | null
          representative_name?: string | null
          phone_number?: string | null
          birth_date?: string | null
          gender?: "male" | "female" | null
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
          status?: "draft" | "submitted" | "reviewing" | "approved" | "rejected" | null
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
          business_type?: "개인사업자" | "법인사업자" | null
          representative_name?: string | null
          phone_number?: string | null
          birth_date?: string | null
          gender?: "male" | "female" | null
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
          status?: "draft" | "submitted" | "reviewing" | "approved" | "rejected" | null
          submitted_at?: string | null
          reviewed_at?: string | null
          reviewer_notes?: string | null
          user_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
        }
        Relationships: []
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
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type PublicSchema = Database["public"]

export type Tables<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Row"]
export type TablesInsert<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Update"]

export type Enums<T extends keyof PublicSchema["Enums"]> = PublicSchema["Enums"][T]
