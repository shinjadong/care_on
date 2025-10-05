import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase 환경변수 누락:', {
      url: supabaseUrl ? '설정됨' : '누락',
      key: supabaseAnonKey ? '설정됨' : '누락'
    })
    throw new Error(
      '환경변수가 설정되지 않았습니다. NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 확인해주세요.'
    )
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
