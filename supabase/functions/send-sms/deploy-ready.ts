// 이 코드를 Supabase 대시보드에 복사/붙여넣기 하세요
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
    // 하드코딩된 값 (환경변수 대신)
    const username = 'nvr_7464463887'
    const apiKey = 'd55f01a941947acd711702ede3f90b74fdda318a78ed26dbde193cceeb0af4ac'
    const senderPhone = '01032453385'

    // 요청 데이터
    const { to, text, name, businessType } = await req.json()

    // 메시지 생성
    let message = text
    if (!message && name) {
      message = `[케어온]
${name}님, 스타트케어 신청이 완료되었습니다.

담당자가 곧 연락드릴 예정입니다.
${businessType ? `업종: ${businessType}` : ''}

문의: 1866-1845`
    }

    // 1. 토큰 발급
    const tokenResponse = await fetch('https://message.ppurio.com/v1/token', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${username}:${apiKey}`),
      },
    })

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text()
      throw new Error('토큰 발급 실패: ' + error)
    }

    const tokenData = await tokenResponse.json()
    const token = tokenData.token

    // 2. SMS 전송
    const messageType = new TextEncoder().encode(message).length <= 90 ? 'SMS' : 'LMS'
    
    const requestData = {
      account: username,
      messageType: messageType,
      content: message,
      from: senderPhone.replace(/-/g, ''),
      duplicateFlag: 'N',
      targetCount: 1,
      targets: [{ to: to.replace(/-/g, '') }],
      refKey: `careon_${Date.now()}`,
    }

    const smsResponse = await fetch('https://message.ppurio.com/v1/message', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })

    const result = await smsResponse.json()

    if (smsResponse.ok && result.code === '200') {
      return new Response(
        JSON.stringify({
          success: true,
          messageKey: result.messageKey,
          type: messageType,
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    } else {
      throw new Error(result.description || '메시지 전송 실패')
    }

  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})