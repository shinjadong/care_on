import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
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
      // 항상 프로덕션 도메인(careon.ai.kr)으로 리다이렉트
      return NextResponse.redirect(`https://careon.ai.kr${next}`)
    }
  }

  // return the user to an error page with instructions
  // 에러 페이지도 프로덕션 도메인으로
  return NextResponse.redirect('https://careon.ai.kr/auth/auth-code-error')
}
