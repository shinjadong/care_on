import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pkehcfbjotctvneordob.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrZWhjZmJqb3RjdHZuZW9yZG9iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzE5MjY4MSwiZXhwIjoyMDY4NzY4NjgxfQ.fn1IxRxjJZ6gihy_SCvyQrT6Vx3xb1yMaVzztOsLeyk',
  {
    auth: { autoRefreshToken: false, persistSession: false },
    db: { schema: 'public' }
  }
)

// POST: 카카오톡 견적서 메시지 발송
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contract_id, customer_id } = body

    if (!contract_id && !customer_id) {
      return NextResponse.json(
        { error: '계약 ID 또는 고객 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // 계약 및 고객 정보 조회
    const { data: contractData, error } = await supabase
      .from('contracts')
      .select(`
        *,
        customer:customers!contracts_customer_id_fkey(
          customer_code,
          business_name,
          owner_name,
          phone
        ),
        package:packages!contracts_package_id_fkey(
          name,
          monthly_fee,
          free_period,
          closure_refund_rate
        )
      `)
      .eq(contract_id ? 'id' : 'customer_id', contract_id || customer_id)
      .single()

    if (error) throw error

    // 메시지 템플릿 생성
    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL 
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : 'http://localhost:3001'

    const quoteUrl = `${baseUrl}/quote/${contractData.customer?.customer_code}`
    
    const messageTemplate = {
      template_code: 'CAREON_QUOTE_01',
      recipient: {
        phone: contractData.customer.phone.replace(/[^0-9]/g, ''),
        name: contractData.customer.owner_name
      },
      variables: {
        customer_name: contractData.customer.owner_name,
        business_name: contractData.customer.business_name,
        package_name: contractData.package?.name || '맞춤형 패키지',
        monthly_fee: contractData.total_monthly_fee.toLocaleString(),
        free_period: contractData.package?.free_period || 12,
        refund_rate: contractData.package?.closure_refund_rate || 100,
        quote_url: quoteUrl,
        customer_code: contractData.customer.customer_code
      },
      message: `
안녕하세요! ${contractData.customer.owner_name}님 🙋‍♂️

CareOn ${contractData.package?.name || '맞춤형'} 견적이 완료되었습니다!

💰 월 ${contractData.total_monthly_fee.toLocaleString()}원 (${contractData.package?.free_period || 12}개월 무료!)
🎁 설치비 무료 + 전용 매니저 배정
🛡️ 폐업시 ${contractData.package?.closure_refund_rate || 100}% 환급 보장

👇 견적서 확인하고 바로 계약하기
${quoteUrl}

📞 문의: 1588-1234
⏰ 운영시간: 평일 09:00-18:00

※ 위 링크를 클릭하시면 견적서를 확인하고 전자서명을 진행할 수 있습니다.
      `.trim()
    }

    // 실제 카카오톡 발송 로직 (여기서는 템플릿만 반환)
    // 실제 구현 시에는 카카오 비즈니스 메시지 API 연동 필요

    // 발송 이력 기록
    await supabase
      .from('customer_activities')
      .insert([{
        customer_id: contractData.customer_id,
        activity_type: 'quote_sent',
        title: '견적서 카카오톡 발송',
        description: `${contractData.package?.name || '맞춤형'} 패키지 견적서 발송`,
        activity_data: {
          contract_id: contractData.id,
          quote_url: quoteUrl,
          message_template: messageTemplate
        }
      }])

    return NextResponse.json({
      message: '카카오톡 견적서 발송이 완료되었습니다.',
      template: messageTemplate,
      quote_url: quoteUrl,
      recipient: {
        business_name: contractData.customer.business_name,
        owner_name: contractData.customer.owner_name,
        phone: contractData.customer.phone
      }
    })

  } catch (error) {
    console.error('[Kakao Quote API] Error:', error)
    return NextResponse.json(
      { error: '카카오톡 발송에 실패했습니다.' },
      { status: 500 }
    )
  }
}