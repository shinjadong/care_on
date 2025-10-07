import { NextRequest, NextResponse } from 'next/server'
import { login } from '@/lib/auth/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    
    const success = await login(username, password)
    
    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ 
        error: '아이디 또는 비밀번호가 올바르지 않습니다.' 
      }, { status: 401 })
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ 
      error: '로그인 처리 중 오류가 발생했습니다.' 
    }, { status: 500 })
  }
}
