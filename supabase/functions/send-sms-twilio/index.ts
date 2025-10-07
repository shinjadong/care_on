import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

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

    // Twilio 설정 (환경변수로 관리)
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER') // Twilio에서 구매한 번호

    if (!accountSid || !authToken || !fromNumber) {
      console.error('Twilio 환경변수가 설정되지 않았습니다')
      throw new Error('SMS 서비스가 설정되지 않았습니다')
    }

    // 한국 번호 포맷 변경 (010-1234-5678 -> +821012345678)
    const toNumber = '+82' + record.phone_number.replace(/-/g, '').substring(1)

    // 메시지 내용
    const messageBody = `[케어온] ${record.name}님, 무료체험단 신청이 완료되었습니다.

신청정보:
- 업체: ${record.company_name || '미입력'}
- 업종: ${getBusinessTypeName(record.business_type)}

담당자가 곧 연락드립니다.
문의: 1588-0000`

    // Twilio API 호출
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'To': toNumber,
        'From': fromNumber,
        'Body': messageBody
      })
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('Twilio 오류:', result)
      throw new Error(`SMS 발송 실패: ${result.message || '알 수 없는 오류'}`)
    }

    console.log('SMS 발송 성공:', result.sid)

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: result.sid,
        to: toNumber 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('SMS 발송 오류:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

// 업종 이름 반환
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
