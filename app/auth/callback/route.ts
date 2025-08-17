import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getServerRedirectUrl } from '@/lib/utils/get-redirect-url'

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
      // 환경에 맞는 리다이렉트 URL 생성
      const redirectUrl = getServerRedirectUrl(request, next)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // return the user to an error page with instructions
  const errorUrl = getServerRedirectUrl(request, '/auth/auth-code-error')
  return NextResponse.redirect(errorUrl)
}
