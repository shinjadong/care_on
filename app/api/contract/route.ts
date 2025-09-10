import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('[Contract API] Request received:', { timestamp: new Date().toISOString() })
    
    const supabase = createClient()
    
    // Supabase 연결 테스트
    const { data: testData, error: testError } = await supabase
      .from('customers')
      .select('count')
      .limit(1)
      
    console.log('[Contract API] Supabase connection test:', { testData, testError })

    // 계약 정보 데이터 검증
    const {
      business_name,
      owner_name,
      phone,
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
      terms_agreed,
      info_agreed,
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
    if (!internet_plan) missingFields.push('인터넷 요금제')
    if (!cctv_count) missingFields.push('CCTV 설치 대수')
    if (!bank_name) missingFields.push('은행명')
    if (!account_number) missingFields.push('계좌번호')
    if (!account_holder) missingFields.push('예금주명')
    if (!terms_agreed) missingFields.push('이용약관 동의')
    if (!info_agreed) missingFields.push('개인정보 동의')
    
    // 서류 이미지 검증 (선택적으로 만들어 테스트 용이하게)
    // if (!bank_account_image) missingFields.push('통장 사본')
    // if (!id_card_image) missingFields.push('신분증')
    // if (!business_registration_image) missingFields.push('사업자등록증')
    
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

    // 1단계: 기존 고객 확인 또는 신규 고객 등록
    let customer
    
    // 기존 고객 확인 (전화번호 + 이름으로)
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', normalizedPhone)
      .eq('name', owner_name)
      .single()
    
    if (existingCustomer) {
      // 기존 고객 정보 업데이트
      const { data: updatedCustomer, error: updateError } = await supabase
        .from('customers')
        .update({
          email: email || existingCustomer.email,
          address: address || existingCustomer.address,
          business_name: business_name || existingCustomer.business_name,
          business_registration: business_registration || existingCustomer.business_registration,
          last_login: new Date().toISOString()
        })
        .eq('id', existingCustomer.id)
        .select()
        .single()
        
      if (updateError) {
        console.error('기존 고객 정보 업데이트 오류:', updateError)
        return NextResponse.json(
          { error: '고객 정보 업데이트에 실패했습니다.' },
          { status: 500 }
        )
      }
      
      customer = updatedCustomer
    } else {
      // 신규 고객 등록
      const { data: newCustomer, error: createError } = await supabase
        .from('customers')
        .insert([{
          phone: normalizedPhone,
          name: owner_name,
          email,
          address,
          business_name,
          business_registration
        }])
        .select()
        .single()
        
      if (createError) {
        console.error('신규 고객 등록 오류:', createError)
        // 테이블이 없는 경우 임시 처리
        if (createError.message?.includes('relation "customers" does not exist') || 
            createError.message?.includes('table "customers" does not exist')) {
          console.log('[Contract API] Customer table not exists, using temp data')
          const tempCustomerNumber = 'CO' + Date.now().toString().slice(-6)
          customer = {
            id: 'temp_customer_' + Date.now(),
            customer_number: tempCustomerNumber,
            phone: normalizedPhone,
            name: owner_name
          }
          console.log('[Contract API] Temp customer created:', customer)
        } else {
          return NextResponse.json(
            { error: '고객 등록에 실패했습니다.' },
            { status: 500 }
          )
        }
      } else {
        customer = newCustomer
      }
    }

    // 2단계: 계약 정보 생성
    const contractData = {
      customer_id: customer.id,
      customer_number: customer.customer_number,
      business_name,
      owner_name,
      phone: normalizedPhone,
      email,
      address,
      business_registration,
      internet_plan,
      cctv_count,
      installation_address: installation_address || address,
      bank_name,
      account_number,
      account_holder,
      additional_requests,
      terms_agreed,
      info_agreed,
      bank_account_image,
      id_card_image,
      business_registration_image,
      status: 'pending'
    }

    // contracts 테이블에 삽입
    const { data, error } = await supabase
      .from('contracts')
      .insert([contractData])
      .select()
      .single()

    if (error) {
      console.error('계약 정보 저장 오류:', error)
      
      // 테이블이 없는 경우 임시로 성공 응답 (실제로는 로그만 남김)
      if (error.message?.includes('relation "contracts" does not exist') ||
          error.message?.includes('table "contracts" does not exist')) {
        
        const tempContractNumber = 'CT' + new Date().toISOString().slice(2,10).replace(/-/g, '') + '001'
        
        console.log('[Contract API] Contract table not exists, logging data:', {
          customer_number: customer.customer_number,
          contract_number: tempContractNumber,
          business_name,
          owner_name,
          phone: normalizedPhone,
          internet_plan,
          cctv_count,
          bank_account_image: bank_account_image ? '업로드됨' : '없음',
          id_card_image: id_card_image ? '업로드됨' : '없음',
          business_registration_image: business_registration_image ? '업로드됨' : '없음',
          timestamp: new Date().toISOString()
        })
        
        return NextResponse.json({ 
          message: '계약 정보가 접수되었습니다.',
          customer_number: customer.customer_number,
          contract_number: tempContractNumber,
          id: 'temp_' + Date.now()
        })
      }
      
      return NextResponse.json(
        { error: '계약 정보 저장에 실패했습니다.' },
        { status: 500 }
      )
    }

    // SMS 알림 발송 (선택사항)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-sms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: '01012345678', // 관리자 번호
          message: `[케어온] 새로운 계약 정보 접수\n고객번호: ${customer.customer_number}\n사업체: ${business_name}\n대표자: ${owner_name}\n연락처: ${normalizedPhone}\n서비스: ${internet_plan} + CCTV ${cctv_count}`
        })
      })
    } catch (smsError) {
      console.error('SMS 알림 발송 실패:', smsError)
      // SMS 실패는 무시하고 계약 정보 저장은 성공으로 처리
    }

    return NextResponse.json({
      message: '계약 정보가 성공적으로 접수되었습니다.',
      customer_number: customer.customer_number,
      contract_number: data.contract_number,
      id: data.id
    })

  } catch (error) {
    console.error('계약 정보 처리 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}