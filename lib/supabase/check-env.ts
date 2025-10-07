/**
 * Supabase 환경변수 체크 유틸리티
 */
export function checkSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    const missingVars = []
    if (!url) missingVars.push('NEXT_PUBLIC_SUPABASE_URL')
    if (!anonKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
    
    console.error('Missing Supabase environment variables:', missingVars)
    
    // 개발 환경에서는 더 자세한 정보 제공
    if (process.env.NODE_ENV === 'development') {
      console.error(`
환경변수 설정 방법:
1. .env.local 파일 생성
2. 다음 내용 추가:
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
3. 개발 서버 재시작
      `)
    }
    
    return false
  }
  
  return true
}

// 환경변수 정보 출력 (디버깅용)
export function logSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  console.log('Supabase Configuration:')
  console.log('- URL:', url || 'NOT SET')
  console.log('- Anon Key:', hasAnonKey ? 'SET' : 'NOT SET')
  console.log('- Environment:', process.env.NODE_ENV)
}
