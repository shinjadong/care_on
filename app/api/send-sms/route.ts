import { NextRequest, NextResponse } from 'next/server'

// 뿌리오 API 설정
const PPURIO_API_URL = 'https://message.ppurio.com'
const PPURIO_USERNAME = process.env.PPURIO_USERNAME || ''
const PPURIO_API_KEY = process.env.PPURIO_API_KEY || ''
const SENDER_PHONE = process.env.SENDER_PHONE || '15880000'

/**
 * 뿌리오 액세스 토큰 발급
 */
async function getPpurioAccessToken(): Promise<string | null> {
  try {
    const basicAuth = Buffer.from(`${PPURIO_USERNAME}:${PPURIO_API_KEY}`).toString('base64')
    
    const response = await fetch(`${PPURIO_API_URL}/v1/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      console.error('토큰 발급 실패:', response.status)
      return null
    }

    const data = await response.json()
    return data.token
  } catch (error) {
    console.error('토큰 발급 오류:', error)
    return null
  }
}

/**
 * 뿌리오 SMS 발송
 */
async function sendPpurioSMS(token: string, phoneNumber: string, message: string) {
  try {
    const cleanPhone = phoneNumber.replace(/-/g, '')
    
    const payload = {
      account: PPURIO_USERNAME,
      messageType: 'SMS',
      content: message,
      from: SENDER_PHONE.replace(/-/g, ''),
      duplicateFlag: 'N',
      rejectType: 'AD',
      targetCount: 1,
      targets: [{
        to: cleanPhone,
        name: '고객',
        changeWord: ''
      }]
    }

    const response = await fetch(`${PPURIO_API_URL}/v1/message`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('SMS 발송 실패:', errorData)
      return null
    }

    const data = await response.json()
    return data.messageKey
  } catch (error) {
    console.error('SMS 발송 오류:', error)
    return null
  }
}

/**
 * 업종 이름 반환
 */
function getBusinessTypeName(typeId: number): string {
  const types: Record<number, string> = {
    1: '음식·외식',
    2: '카페·베이커리',
    3: '뷰티·미용',
    4: '의료·건강',
    5: '교육·학원',
    6: '소매·판매',
    7: '운동·스포츠',
    8: '숙박·호텔',
    9: '자동차',
    10: '부동산',
    11: '세탁·수선',
    12: '애견·반려',
    13: '엔터테인먼트',
    14: '사무·서비스',
    15: '제조·도매',
    16: '기타'
  }
  return types[typeId] || '기타'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone_number, company_name, business_type } = body

    if (!name || !phone_number) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다' },
        { status: 400 }
      )
    }

    // 개발 환경에서는 콘솔 로그만
    if (process.env.NODE_ENV === 'development' || !PPURIO_USERNAME || !PPURIO_API_KEY) {
      console.log('SMS 발송 (개발모드):', {
        to: phone_number,
        name,
        company_name,
        business_type: getBusinessTypeName(business_type)
      })
      return NextResponse.json({
        success: true,
        mode: 'development',
        message: '개발 모드 - SMS 미발송'
      })
    }

    // 메시지 내용 생성
    const message = `[케어온] ${name}님, 무료체험단 신청이 완료되었습니다.
${company_name ? `업체: ${company_name}` : ''}
담당자가 곧 연락드립니다.
문의: ${SENDER_PHONE}`

    // 뿌리오 토큰 발급
    const token = await getPpurioAccessToken()
    if (!token) {
      console.error('뿌리오 토큰 발급 실패')
      return NextResponse.json({
        success: false,
        error: 'SMS 서비스 인증 실패'
      }, { status: 500 })
    }

    // SMS 발송
    const messageKey = await sendPpurioSMS(token, phone_number, message.trim())
    
    if (!messageKey) {
      console.error('뿌리오 SMS 발송 실패')
      return NextResponse.json({
        success: false,
        error: 'SMS 발송 실패'
      }, { status: 500 })
    }

    console.log(`SMS 발송 성공: ${phone_number}, messageKey: ${messageKey}`)

    return NextResponse.json({
      success: true,
      provider: 'ppurio',
      messageKey
    })

  } catch (error) {
    console.error('SMS API 오류:', error)
    return NextResponse.json(
      { error: '메시지 발송 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}