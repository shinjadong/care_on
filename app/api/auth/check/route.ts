import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('careon_session')

    if (!sessionCookie) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      )
    }

    const customerId = sessionCookie.value
    const supabase = await createClient()

    // 사용자 정보 확인
    const { data: customer, error } = await supabase
      .from('customers')
      .select('customer_id, name, email, profile_image_url')
      .eq('customer_id', customerId)
      .single()

    if (error || !customer) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user: customer,
    })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { error: '인증 확인 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
