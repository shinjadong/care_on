import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // 'redirect' 파라미터로 리다이렉트 URL 결정
  let next = searchParams.get('redirect') ?? '/store-setup'
  
  // 상대 URL인지 확인
  if (!next.startsWith('/')) {
    next = '/store-setup'
  }

  if (code) {
    const supabase = await createClient()
    
    console.log('🔐 OAuth Callback - Exchanging code for session...')
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('❌ OAuth Error Details:', {
        message: error.message,
        status: error.status,
        name: error.name,
        stack: error.stack,
        code: code.substring(0, 20) + '...'
      })
    } else {
      console.log('✅ OAuth Success:', {
        user: data.user?.email,
        provider: data.user?.app_metadata?.provider
      })
    }

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // 에러 발생 시 로그인 페이지로 리다이렉트
  return NextResponse.redirect(`${origin}/auth/login?error=callback_failed`)
}
