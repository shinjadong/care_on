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

// POST: 계약 전자서명 처리
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contract_id, customer_signature, signed_at } = body

    if (!contract_id || !customer_signature) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // 계약 상태를 승인으로 변경
    const { data: updatedContract, error } = await supabase
      .from('contracts')
      .update({
        status: 'approved',
        customer_signature_agreed: true,
        customer_signed_at: signed_at,
        updated_at: new Date().toISOString()
      })
      .eq('id', contract_id)
      .select(`
        *,
        customer:customers!contracts_customer_id_fkey(
          customer_code,
          business_name,
          owner_name,
          phone
        )
      `)
      .single()

    if (error) throw error

    // 고객 활동 이력에 서명 기록 추가
    await supabase
      .from('customer_activities')
      .insert([{
        customer_id: updatedContract.customer_id,
        activity_type: 'contract_signed',
        title: '계약서 전자서명 완료',
        description: `계약번호 ${updatedContract.contract_number} 전자서명 완료`,
        activity_data: {
          contract_id,
          signed_at,
          signature_method: 'electronic'
        }
      }])

    return NextResponse.json({
      message: '계약서 서명이 성공적으로 완료되었습니다.',
      contract: updatedContract,
      next_step: '설치 일정 조율을 위해 곧 연락드리겠습니다.'
    })

  } catch (error) {
    console.error('[Contract Sign API] Error:', error)
    return NextResponse.json(
      { error: '서명 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
