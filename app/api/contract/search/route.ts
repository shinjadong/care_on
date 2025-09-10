import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 고객 정보 포맷팅 함수
function formatCustomerInfo(contractData: any) {
  return {
    id: contractData.id, // contract ID 추가
    customer_number: contractData.customer_number,
    name: contractData.owner_name,
    phone: contractData.phone,
    business_name: contractData.business_name,
    address: contractData.address,
    email: contractData.email,
    business_registration: contractData.business_registration,
    bank_name: contractData.bank_name,
    account_number: contractData.account_number,
    account_holder: contractData.account_holder,
    documents: {
      bank_account_image: contractData.bank_account_image ? '업로드됨' : '미업로드',
      id_card_image: contractData.id_card_image ? '업로드됨' : '미업로드',
      business_registration_image: contractData.business_registration_image ? '업로드됨' : '미업로드'
    },
    contract_number: 'CT' + contractData.customer_number.slice(2),
    created_at: contractData.created_at,
    status: contractData.status,
    // 견적 정보도 포함
    internet_plan: contractData.internet_plan,
    internet_monthly_fee: contractData.internet_monthly_fee,
    cctv_count: contractData.cctv_count,
    cctv_monthly_fee: contractData.cctv_monthly_fee,
    total_monthly_fee: contractData.total_monthly_fee
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, phone, customer_number } = await request.json()
    
    // customer_number로 검색하는 경우
    if (customer_number) {
      const supabase = createClient(
        'https://pkehcfbjotctvneordob.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrZWhjZmJqb3RjdHZuZW9yZG9iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzE5MjY4MSwiZXhwIjoyMDY4NzY4NjgxfQ.fn1IxRxjJZ6gihy_SCvyQrT6Vx3xb1yMaVzztOsLeyk'
      )

      const { data: contractData, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('customer_number', customer_number)
        .single()

      if (error || !contractData) {
        console.log('[Manager Search] No customer found by customer_number:', customer_number)
        return NextResponse.json({ customer: null })
      }

      const customerInfo = formatCustomerInfo(contractData)
      console.log('[Manager Search] Customer found by customer_number:', customerInfo)
      return NextResponse.json({ customer: customerInfo })
    }
    
    // 이름과 전화번호로 검색하는 경우
    if (!name || !phone) {
      return NextResponse.json(
        { error: '이름과 전화번호가 필요합니다.' },
        { status: 400 }
      )
    }

    // Supabase 클라이언트 직접 생성
    const supabase = createClient(
      'https://pkehcfbjotctvneordob.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrZWhjZmJqb3RjdHZuZW9yZG9iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzE5MjY4MSwiZXhwIjoyMDY4NzY4NjgxfQ.fn1IxRxjJZ6gihy_SCvyQrT6Vx3xb1yMaVzztOsLeyk'
    )

    const normalizedPhone = phone.replace(/[^0-9]/g, '')

    // contracts 테이블에서 고객 정보 검색
    const { data: contractData, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('owner_name', name)
      .eq('phone', normalizedPhone)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !contractData) {
      console.log('[Manager Search] No customer found:', { name, phone: normalizedPhone })
      return NextResponse.json({ customer: null })
    }

    // contracts 테이블 데이터를 직접 사용
    const customerInfo = formatCustomerInfo(contractData)

    console.log('[Manager Search] Customer found:', customerInfo)

    return NextResponse.json({ customer: customerInfo })

  } catch (error) {
    console.error('[Manager Search] Error:', error)
    return NextResponse.json(
      { error: '검색 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}