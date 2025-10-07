// Supabase Edge Function for Ppurio SMS
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// 토큰 캐시
let tokenCache: { token: string; expiry: number } | null = null

// Basic Auth 생성
function getBasicAuth(username: string, apiKey: string): string {
  const auth = btoa(`${username}:${apiKey}`)
  return `Basic ${auth}`
}

// 액세스 토큰 발급
async function getAccessToken(username: string, apiKey: string): Promise<string | null> {
  try {
    // 캐시된 토큰 확인
    if (tokenCache && tokenCache.expiry > Date.now()) {
      return tokenCache.token
    }

    const response = await fetch('https://message.ppurio.com/v1/token', {
      method: 'POST',
      headers: {
        'Authorization': getBasicAuth(username, apiKey),
      },
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('토큰 발급 실패:', error)
      return null
    }

    const data = await response.json()
    
    // 토큰 캐시 (23시간)
    tokenCache = {
      token: data.token,
      expiry: Date.now() + (23 * 60 * 60 * 1000)
    }

    return data.token
  } catch (error) {
    console.error('토큰 발급 오류:', error)
    return null
  }
}

serve(async (req) => {
  // CORS 처리
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // IP 확인 엔드포인트
  if (req.url.includes('/ip-check')) {
    const ipResponse = await fetch('https://api.ipify.org?format=json')
    const ipData = await ipResponse.json()
    return new Response(
      JSON.stringify({ 
        ip: ipData.ip,
        message: '이 IP를 뿌리오 관리자 페이지에 등록해주세요'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  }

  try {
    // 환경변수
    const username = Deno.env.get('PPURIO_USERNAME') || 'nvr_7464463887'
    const apiKey = Deno.env.get('PPURIO_API_KEY') || ''
    const senderPhone = Deno.env.get('SENDER_PHONE') || '01032453385'

    if (!apiKey) {
      throw new Error('PPURIO_API_KEY가 설정되지 않았습니다')
    }

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

    // 토큰 발급
    const token = await getAccessToken(username, apiKey)
    if (!token) {
      throw new Error('인증 토큰 발급 실패')
    }

    // 메시지 타입 결정
    const messageType = new TextEncoder().encode(message).length <= 90 ? 'SMS' : 'LMS'
    
    // SMS 전송
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

    const response = await fetch('https://message.ppurio.com/v1/message', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })

    const result = await response.json()

    if (response.ok && result.code === '200') {
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
