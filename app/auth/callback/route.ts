import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? '/'
  
  if (!next.startsWith('/')) {
    // if "next" is not a relative URL, use the default
    next = '/'
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // 프로덕션 환경에서는 careon.ai.kr로, 로컬에서는 origin 사용
      const baseUrl = origin.includes('localhost') ? origin : 'https://careon.ai.kr'
      return NextResponse.redirect(`${baseUrl}${next}`)
    }
  }

  // return the user to an error page with instructions
  // 에러 페이지도 동일한 도메인으로
  const baseUrl = origin.includes('localhost') ? origin : 'https://careon.ai.kr'
  return NextResponse.redirect(`${baseUrl}/auth/auth-code-error`)
}
