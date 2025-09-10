import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('[Contract API] Request received:', { timestamp: new Date().toISOString() })

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

    // 고객번호 및 계약번호 생성
    const tempCustomerNumber = 'CO' + Date.now().toString().slice(-6)
    const tempContractNumber = 'CT' + new Date().toISOString().slice(2,10).replace(/-/g, '') + String(Math.floor(Math.random() * 900) + 100)
    
    const customer = {
      id: 'temp_customer_' + Date.now(),
      customer_number: tempCustomerNumber,
      phone: normalizedPhone,
      name: owner_name,
      email,
      address,
      business_name,
      business_registration
    }
    
    // 계약 정보 로깅 (데이터베이스 대신 서버 로그에 저장)
    const contractData = {
      customer_number: customer.customer_number,
      contract_number: tempContractNumber,
      business_info: {
        business_name,
        owner_name,
        phone: normalizedPhone,
        email,
        address,
        business_registration
      },
      service_info: {
        internet_plan,
        cctv_count,
        installation_address: installation_address || address
      },
      payment_info: {
        bank_name,
        account_number: account_number.replace(/(.{3})(.*)(.{4})/, '$1****$3'), // 계좌번호 마스킹
        account_holder
      },
      documents: {
        bank_account_image: bank_account_image ? '업로드됨' : '미업로드',
        id_card_image: id_card_image ? '업로드됨' : '미업로드',
        business_registration_image: business_registration_image ? '업로드됨' : '미업로드'
      },
      agreements: {
        terms_agreed,
        info_agreed
      },
      additional_requests,
      status: 'pending',
      timestamp: new Date().toISOString()
    }
    
    console.log('[Contract API] Contract data logged successfully:', contractData)

    // SMS 알림 발송 (선택사항)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-sms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: '01012345678', // 관리자 번호
          message: `[케어온] 새로운 계약 정보 접수\n고객번호: ${customer.customer_number}\n계약번호: ${tempContractNumber}\n사업체: ${business_name}\n대표자: ${owner_name}\n연락처: ${normalizedPhone}\n서비스: ${internet_plan} + CCTV ${cctv_count}`
        })
      })
    } catch (smsError) {
      console.error('SMS 알림 발송 실패:', smsError)
      // SMS 실패는 무시하고 계약 정보 저장은 성공으로 처리
    }

    return NextResponse.json({
      message: '계약 정보가 성공적으로 접수되었습니다.',
      customer_number: customer.customer_number,
      contract_number: tempContractNumber,
      id: 'contract_' + Date.now()
    })

  } catch (error) {
    console.error('[Contract API] Unexpected error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}