import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // CORS 처리
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { record } = await req.json()
    
    if (!record || !record.phone_number || !record.name) {
      throw new Error('필수 정보가 없습니다')
    }

    // Solapi API 키 (환경변수로 관리)
    const apiKey = Deno.env.get('SOLAPI_API_KEY')
    const apiSecret = Deno.env.get('SOLAPI_API_SECRET')
    const senderPhone = Deno.env.get('SENDER_PHONE') || '1588-0000' // 발신번호

    if (!apiKey || !apiSecret) {
      throw new Error('SMS API 키가 설정되지 않았습니다')
    }

    // 메시지 내용 구성
    const message = `[케어온] ${record.name}님, 무료체험단 신청이 완료되었습니다.

▶ 신청정보
- 업체명: ${record.company_name || '미입력'}
- 업종: ${getBusinessTypeName(record.business_type)}
- 상태: ${getStatusName(record.business_status)}

빠른 시일 내에 연락드리겠습니다.
문의: 1588-0000`

    // Solapi API 호출
    const url = 'https://api.solapi.com/messages/v4/send'
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `HMAC-SHA256 apiKey=${apiKey}, date=${new Date().toISOString()}, salt=${generateSalt()}, signature=${generateSignature(apiSecret)}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: {
          to: record.phone_number.replace(/-/g, ''),
          from: senderPhone.replace(/-/g, ''),
          text: message,
          type: 'SMS'
        }
      })
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(`SMS 발송 실패: ${result.message}`)
    }

    return new Response(
      JSON.stringify({ success: true, messageId: result.groupId }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('SMS 발송 오류:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

// 업종 이름 반환
function getBusinessTypeName(typeId: number): string {
  const types = {
    1: '음식·외식·배달',
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
    12: '애견·반려동물',
    13: '엔터테인먼트',
    14: '사무·서비스',
    15: '제조·도매',
    16: '기타'
  }
  return types[typeId] || '기타'
}

// 상태 이름 반환
function getStatusName(status: string): string {
  const statuses = {
    'immediate': '5일내 설치필요',
    'interior': '5일후 설치가능',
    'preparing': '창업준비중'
  }
  return statuses[status] || status
}

// Salt 생성 (Solapi 인증용)
function generateSalt(): string {
  return Math.random().toString(36).substring(2, 15)
}

// Signature 생성 (실제 구현시 HMAC-SHA256 필요)
function generateSignature(secret: string): string {
  // 실제로는 HMAC-SHA256으로 서명 생성 필요
  // Deno crypto API 사용
  return 'dummy-signature'
}