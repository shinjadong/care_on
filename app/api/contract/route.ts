import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('[Contract API] Request received:', { timestamp: new Date().toISOString() })

    // Supabase 클라이언트 직접 생성 (서비스 키 하드코딩 + RLS 우회)
    const supabase = createClient(
      'https://pkehcfbjotctvneordob.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrZWhjZmJqb3RjdHZuZW9yZG9iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzE5MjY4MSwiZXhwIjoyMDY4NzY4NjgxfQ.fn1IxRxjJZ6gihy_SCvyQrT6Vx3xb1yMaVzztOsLeyk',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        },
        db: {
          schema: 'public'
        }
      }
    )

    // 계약 정보 데이터 검증
    const {
      business_name,
      owner_name,
      phone,
      email,
      address,
      business_registration,
      // 서비스 정보
      internet_plan,
      cctv_count,
      installation_address,
      // 결제 정보
      bank_name,
      account_number,
      account_holder,
      additional_requests,
      terms_agreed,
      info_agreed,
      // 이미지 URL들
      bank_account_image,
      id_card_image,
      business_registration_image
    } = body

    // 필수 필드 검증
    const missingFields = []
    if (!business_name) missingFields.push('사업체명')
    if (!owner_name) missingFields.push('대표자명')
    if (!phone) missingFields.push('전화번호')
    if (!address) missingFields.push('주소')
    if (!bank_name) missingFields.push('은행명')
    if (!account_number) missingFields.push('계좌번호')
    if (!account_holder) missingFields.push('예금주명')
    if (!terms_agreed) missingFields.push('이용약관 동의')
    if (!info_agreed) missingFields.push('개인정보 동의')
    
    if (missingFields.length > 0) {
      console.log('[Contract API] Missing fields:', missingFields)
      return NextResponse.json(
        { 
          error: `다음 필수 정보가 누락되었습니다: ${missingFields.join(', ')}`,
          missing_fields: missingFields
        },
        { status: 400 }
      )
    }
    
    // 전화번호 정규화
    const normalizedPhone = phone.replace(/[^0-9]/g, '')
    if (normalizedPhone.length < 10 || normalizedPhone.length > 11) {
      return NextResponse.json(
        { error: '올바른 전화번호를 입력해주세요.' },
        { status: 400 }
      )
    }

    // 1. 먼저 고객(customer) 생성 또는 조회
    let customerId = null
    try {
      // 기존 고객 확인 (전화번호와 사업자명으로)
      const { data: existingCustomer, error: customerSearchError } = await supabase
        .from('customers')
        .select('customer_id')
        .eq('phone', normalizedPhone)
        .eq('business_name', business_name)
        .maybeSingle()

      if (existingCustomer) {
        customerId = existingCustomer.customer_id
        console.log('[Contract API] Using existing customer:', customerId)
      } else {
        // 고객번호 생성
        const { data: existingCustomers } = await supabase
          .from('customers')
          .select('customer_code')
          .like('customer_code', 'CO%')
          .order('customer_code', { ascending: false })
          .limit(1)

        let nextNumber = 1
        if (existingCustomers && existingCustomers.length > 0) {
          const lastCode = existingCustomers[0].customer_code
          const lastNumber = parseInt(lastCode.substring(2)) || 0
          nextNumber = lastNumber + 1
        }

        const customerCode = 'CO' + nextNumber.toString().padStart(6, '0')

        // 새 고객 생성
        const { data: newCustomer, error: customerInsertError } = await supabase
          .from('customers')
          .insert([{
            customer_code: customerCode,
            business_name,
            owner_name,
            business_registration,
            phone: normalizedPhone,
            email,
            address,
            status: 'active'
          }])
          .select('customer_id')
          .single()

        if (customerInsertError) throw customerInsertError
        customerId = newCustomer.customer_id
        console.log('[Contract API] Created new customer:', customerId)
      }
    } catch (customerError) {
      console.error('[Contract API] Customer creation/lookup error:', customerError)
      return NextResponse.json(
        { error: '고객 정보 처리 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    // 2. 계약번호 생성
    const { data: existingContracts } = await supabase
      .from('contracts')
      .select('customer_number')
      .like('customer_number', 'CO%')
      .order('customer_number', { ascending: false })
      .limit(1)

    let customerNumber = 'CO000001'
    if (existingContracts && existingContracts.length > 0) {
      const lastNumber = parseInt(existingContracts[0].customer_number.substring(2)) || 0
      const nextNumber = lastNumber + 1
      customerNumber = 'CO' + nextNumber.toString().padStart(6, '0')
    }

    // 3. contracts 테이블에 정보 저장
    try {
      const { data, error } = await supabase
        .from('contracts')
        .insert([{
          customer_id: customerId,
          customer_number: customerNumber,
          business_name,
          owner_name,
          phone: normalizedPhone,
          email,
          address,
          business_registration,
          internet_plan,
          cctv_count,
          installation_address,
          bank_name,
          account_number,
          account_holder,
          additional_requests,
          bank_account_image,
          id_card_image,
          business_registration_image,
          terms_agreed,
          info_agreed,
          status: 'pending',
          billing_day: 1,
          remittance_day: 25
        }])
        .select()
        .single()
        
      if (error) {
        console.error('[Contract API] Database insert error:', error)
        throw error
      }
      
      if (!data) {
        console.error('[Contract API] No data returned after insert')
        throw new Error('데이터 저장 후 결과를 받지 못했습니다.')
      }
      
      console.log('[Contract API] Successfully saved to contracts table:', {
        id: data.id,
        customer_number: data.customer_number,
        owner_name: data.owner_name,
        business_name: data.business_name,
        status: data.status
      })
      
      // 성공 응답
      return NextResponse.json({
        message: '계약 정보가 성공적으로 접수되었습니다.',
        customer_number: data.customer_number || 'CO' + Date.now().toString().slice(-6),
        contract_number: data.contract_number || 'CT' + Date.now().toString().slice(-6),
        id: data.id
      })
      
    } catch (dbError) {
      console.error('[Contract API] Database error:', dbError)
      
      // 더 구체적인 에러 메시지 제공
      const errorMessage = dbError instanceof Error 
        ? dbError.message 
        : '데이터베이스 연결 오류가 발생했습니다. 다시 시도해주세요.'
        
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('[Contract API] Unexpected error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}