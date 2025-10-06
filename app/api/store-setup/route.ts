import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

interface StoreSetupRequest {
  store_name: string
  business_type: string
  address: string
  address_detail: string
  phone: string
  email: string
  description: string
  selected_products: Array<{
    product_id: string
    product_name: string
    quantity: number
    price: number
  }>
  total_amount: number
}

export async function POST(request: NextRequest) {
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
    const body: StoreSetupRequest = await request.json()

    const {
      store_name,
      business_type,
      address,
      address_detail,
      phone,
      email,
      description,
      selected_products,
      total_amount,
    } = body

    const supabase = await createClient()

    // 1. 매장 정보 생성 (contracts 테이블에 저장)
    const { data: contract, error: contractError } = await supabase
      .from('contracts')
      .insert({
        customer_id: customerId,
        store_name,
        business_type,
        address: `${address} ${address_detail}`.trim(),
        phone,
        email,
        description,
        status: 'pending', // 초기 상태는 대기중
        total_amount,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (contractError) {
      console.error('Contract creation error:', contractError)
      return NextResponse.json(
        { error: '매장 정보 저장 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    // 2. 선택한 상품 정보 저장 (별도 테이블이 있다면)
    // 현재는 contract에 메타데이터로 저장
    if (selected_products && selected_products.length > 0) {
      const { error: updateError } = await supabase
        .from('contracts')
        .update({
          metadata: {
            selected_products,
            total_amount,
          },
        })
        .eq('contract_id', contract.contract_id)

      if (updateError) {
        console.error('Contract update error:', updateError)
      }
    }

    // 3. 고객 정보 업데이트 (매장 정보 연동)
    await supabase
      .from('customers')
      .update({
        phone_number: phone,
        email,
      })
      .eq('customer_id', customerId)

    return NextResponse.json({
      success: true,
      contract_id: contract.contract_id,
      message: '매장 세팅이 완료되었습니다.',
    })
  } catch (error) {
    console.error('Store setup error:', error)
    return NextResponse.json(
      { error: '매장 세팅 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
