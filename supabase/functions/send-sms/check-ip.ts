// Edge Function IP 확인용 코드
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
    // IP 확인
    const ipResponse = await fetch('https://api.ipify.org?format=json')
    const ipData = await ipResponse.json()
    
    // 추가 IP 확인 (백업)
    const ip2Response = await fetch('https://ifconfig.me/ip')
    const ip2 = await ip2Response.text()
    
    return new Response(
      JSON.stringify({ 
        ip: ipData.ip,
        ip_backup: ip2.trim(),
        message: '이 IP들을 뿌리오 관리자 페이지에 등록해주세요',
        ppurio_url: 'https://www.ppurio.com',
        menu: 'API 설정 > 연동 IP 관리 > IP 추가',
        region: 'Supabase Edge Function (Deno Deploy)',
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: error.message,
        message: 'IP 확인 실패'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})