import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 고객 정보 포맷팅 함수 (패키지 및 상품 정보 포함)
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
    contract_number: contractData.contract_number || ('CT' + contractData.customer_number.slice(2)),
    created_at: contractData.created_at,
    status: contractData.status,
    // 견적 정보도 포함
    internet_plan: contractData.internet_plan,
    internet_monthly_fee: contractData.internet_monthly_fee,
    cctv_count: contractData.cctv_count,
    cctv_monthly_fee: contractData.cctv_monthly_fee,
    total_monthly_fee: contractData.total_monthly_fee,
    
    // 패키지 정보 추가
    package: contractData.package,
    
    // 계약 상품 정보 추가  
    contract_items: contractData.contract_items || [],
    
    // 계약 조건 정보
    contract_period: contractData.contract_period,
    free_period: contractData.free_period,
    start_date: contractData.start_date,
    end_date: contractData.end_date
  }
}

// GET: URL 파라미터로 고객 정보 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customer_number = searchParams.get('customer_number')
    const contract_number = searchParams.get('contract_number')
    
    if (!customer_number && !contract_number) {
      return NextResponse.json({ customer: null })
    }

    const supabase = createClient(
      'https://pkehcfbjotctvneordob.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrZWhjZmJqb3RjdHZuZW9yZG9iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzE5MjY4MSwiZXhwIjoyMDY4NzY4NjgxfQ.fn1IxRxjJZ6gihy_SCvyQrT6Vx3xb1yMaVzztOsLeyk'
    )

    let query = supabase
      .from('contracts')
      .select(`
        *,
        customer:customers!contracts_customer_id_fkey(
          customer_code,
          business_name,
          owner_name,
          phone,
          care_status
        ),
        package:packages!contracts_package_id_fkey(
          name,
          monthly_fee,
          contract_period,
          free_period,
          closure_refund_rate,
          included_services
        ),
        contract_items:contract_items(
          quantity,
          fee,
          product:products!contract_items_product_id_fkey(
            name,
            category,
            provider,
            description
          )
        )
      `)

    if (customer_number) {
      query = query.eq('customer_number', customer_number)
    } else {
      query = query.eq('contract_number', contract_number)
    }

    const { data: contractData, error } = await query.single()

    if (error || !contractData) {
      return NextResponse.json({ customer: null })
    }

    const customerInfo = formatCustomerInfo(contractData)
    return NextResponse.json({ customer: customerInfo })

  } catch (error) {
    console.error('[Contract Search GET] Error:', error)
    return NextResponse.json({ customer: null })
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

    // 새로운 DB 구조: customers + contracts 조인으로 검색
    const { data: contractData, error } = await supabase
      .from('contracts')
      .select(`
        *,
        customer:customers!customer_id(
          customer_code,
          business_name,
          owner_name,
          phone,
          care_status
        ),
        package:packages!package_id(
          name,
          monthly_fee,
          contract_period,
          free_period
        )
      `)
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