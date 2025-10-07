import { createBrowserClient } from "@supabase/ssr"

// Vercel 환경변수 폴백 처리
const SUPABASE_URL = 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  'https://pkehcfbjotctvneordob.supabase.co'

const SUPABASE_ANON_KEY = 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrZWhjZmJqb3RjdHZuZW9yZG9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxOTI2ODEsImV4cCI6MjA2ODc2ODY4MX0.jX3JE0uKyeE_nEm7EcecUwtWd23oHkBrggLhntVHVjc'

export function createClient() {
  // Development 환경에서만 로그 출력
  if (process.env.NODE_ENV === 'development') {
    console.log('Supabase 클라이언트 생성 중...', {
      hasEnvUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasEnvKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      usingFallback: !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    })
  }
  
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}
