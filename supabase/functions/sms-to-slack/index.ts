import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Slack Webhook URL - 실제 URL로 교체하세요
const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL'

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
    // Supabase 클라이언트 생성
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 요청 본문 파싱
    const { type, table, record, old_record } = await req.json()

    // INSERT 이벤트만 처리
    if (type === 'INSERT' && table === 'careon_applications') {
      const { name, phone_number, business_type, company_name } = record

      // 업종 매핑
      const businessTypes: { [key: number]: string } = {
        1: '요식업',
        2: '카페/베이커리', 
        3: '미용/뷰티',
        4: '의료/병원',
        5: '학원/교육',
        6: '소매/판매',
        7: '사무실',
        8: '헬스/운동',
        9: '숙박업',
        10: '기타',
      }

      const businessTypeName = businessTypes[business_type] || '기타'

      // Slack 메시지 포맷
      // MacroDroid가 파싱하기 쉽도록 구조화
      const slackMessage = {
        text: `📱 SMS발송요청`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*신규 스타트케어 신청*\n이름: ${name}\n전화번호: ${phone_number}\n업종: ${businessTypeName}${company_name ? `\n업체명: ${company_name}` : ''}`
            }
          },
          {
            type: 'divider'
          },
          {
            type: 'section',
            text: {
              type: 'plain_text',
              text: `SMS_TRIGGER|${phone_number}|${name}|${businessTypeName}`
            }
          }
        ]
      }

      // Slack으로 전송
      const slackResponse = await fetch(SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(slackMessage),
      })

      if (!slackResponse.ok) {
        throw new Error(`Slack 전송 실패: ${slackResponse.status}`)
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Slack 알림 전송 완료' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // INSERT가 아닌 경우
    return new Response(
      JSON.stringify({ success: true, message: 'Skipped - not an INSERT event' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
