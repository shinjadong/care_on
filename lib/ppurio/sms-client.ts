// SMS 클라이언트 - Supabase Edge Function 또는 Vercel API 사용
import { createClient } from '@/lib/supabase/client-with-fallback'

interface SendSMSParams {
  to: string
  text?: string
  name?: string
  businessType?: string
}

export async function sendSMS(params: SendSMSParams) {
  try {
    // 프로덕션: Supabase Edge Function 사용
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const supabase = createClient()
      
      const { data, error } = await supabase.functions.invoke('send-sms', {
        body: params
      })

      if (error) {
        console.error('Supabase Edge Function 오류:', error)
        // 폴백: Vercel API 사용
        return sendViaVercelAPI(params)
      }

      return data
    }
    
    // 개발/폴백: Vercel API 사용
    return sendViaVercelAPI(params)
  } catch (error) {
    console.error('SMS 전송 오류:', error)
    return { success: false, error: '메시지 전송 실패' }
  }
}

// Vercel API를 통한 SMS 전송
async function sendViaVercelAPI(params: SendSMSParams) {
  try {
    const response = await fetch('/api/sms/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Vercel API 오류:', error)
    return { success: false, error: '메시지 전송 실패' }
  }
}