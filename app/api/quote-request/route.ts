import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('careon_session')

    if (!sessionCookie) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      )
    }

    const customerId = sessionCookie.value
    const { selected_products, total_amount } = await request.json()

    // 입력값 검증
    if (!selected_products || selected_products.length === 0) {
      return NextResponse.json(
        { error: '선택된 상품이 없습니다.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 사용자 정보 조회
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('customer_id, phone, business_name')
      .eq('customer_id', customerId)
      .single()

    if (customerError || !customer) {
      return NextResponse.json(
        { error: '사용자 정보를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 견적 요청 저장 (quotes 테이블이 있다고 가정)
    // 테이블이 없다면 임시로 로그만 남김
    console.log('Quote Request:', {
      customer_id: customerId,
      customer_phone: customer.phone,
      selected_products,
      total_amount,
      timestamp: new Date().toISOString(),
    })

    // TODO: 실제 견적 요청 테이블에 저장
    // const { data: quote, error: quoteError } = await supabase
    //   .from('quote_requests')
    //   .insert({
    //     customer_id: customerId,
    //     products: selected_products,
    //     total_amount: total_amount,
    //     status: 'pending',
    //   })
    //   .select()
    //   .single()

    return NextResponse.json({
      success: true,
      message: '견적 요청이 접수되었습니다.',
    })
  } catch (error) {
    console.error('Quote request error:', error)
    return NextResponse.json(
      { error: '견적 요청 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
