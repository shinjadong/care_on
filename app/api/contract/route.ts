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

    // contracts 테이블에 정보 저장
    try {
      const { data, error } = await supabase
        .from('contracts')
        .insert([{
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
          status: 'pending'
        }])
        .select()
        .single()
        
      if (error) {
        console.error('[Contract API] Database insert error:', error)
        throw error
      }
      
      console.log('[Contract API] Successfully saved to contracts table:', {
        id: data.id,
        customer_number: data.customer_number,
        owner_name: data.owner_name,
        business_name: data.business_name,
        status: data.status
      })
      
    } catch (dbError) {
      console.error('[Contract API] Database error:', dbError)
      return NextResponse.json(
        { error: '데이터베이스 연결 오류가 발생했습니다. 다시 시도해주세요.' },
        { status: 500 }
      )
    }
    
    const contractResult = data


    return NextResponse.json({
      message: '계약 정보가 성공적으로 접수되었습니다.',
      customer_number: data.customer_number,
      contract_number: 'CT' + data.customer_number.slice(2), // 고객번호 기반 계약번호
      id: data.id
    })

  } catch (error) {
    console.error('[Contract API] Unexpected error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}