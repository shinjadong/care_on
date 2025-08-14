import { NextResponse } from 'next/server'

export async function GET() {
  // 보안상 실제 값은 숨기고 설정 여부만 확인
  const env = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 
      '✅ 설정됨 (' + process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 20) + '...)' : 
      '❌ 설정 안됨',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
      '✅ 설정됨' : 
      '❌ 설정 안됨',
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
  }

  return NextResponse.json({
    message: '환경변수 체크',
    timestamp: new Date().toISOString(),
    environment: env,
    buildTime: process.env.NEXT_PUBLIC_BUILD_TIME || 'unknown'
  })
}