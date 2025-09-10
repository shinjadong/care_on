import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('[Contract Update API] Request received:', { timestamp: new Date().toISOString() })

    // Supabase 클라이언트 직접 생성
    const supabase = createClient(
      'https://pkehcfbjotctvneordob.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrZWhjZmJqb3RjdHZuZW9yZG9iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzE5MjY4MSwiZXhwIjoyMDY4NzY4NjgxfQ.fn1IxRxjJZ6gihy_SCvyQrT6Vx3xb1yMaVzztOsLeyk'
    )

    const {
      contract_id,
      customer_number,
      quote,
      total_monthly_fee,
      manager_name
    } = body

    if (!contract_id || !customer_number || !quote) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // contracts 테이블 업데이트
    const { data, error } = await supabase
      .from('contracts')
      .update({
        // 서비스 정보 업데이트
        internet_plan: quote.internet_plan,
        internet_monthly_fee: quote.internet_monthly_fee,
        cctv_count: quote.cctv_count,
        cctv_monthly_fee: quote.cctv_monthly_fee,
        installation_address: quote.installation_address || null,
        
        // 추가 서비스 정보 (JSON으로 저장)
        admin_notes: JSON.stringify({
          pos_needed: quote.pos_needed,
          pos_monthly_fee: quote.pos_monthly_fee,
          tv_needed: quote.tv_needed,
          tv_monthly_fee: quote.tv_monthly_fee,
          insurance_needed: quote.insurance_needed,
          insurance_monthly_fee: quote.insurance_monthly_fee,
          discount_rate: quote.discount_rate,
          special_conditions: quote.special_conditions,
          manager_notes: quote.manager_notes,
          manager_name: manager_name || '매니저'
        }),
        
        // 계약 조건 업데이트
        free_period: quote.free_period || 12,
        contract_period: quote.contract_period || 36,
        
        // 총 월 요금 저장
        total_monthly_fee: total_monthly_fee || 0,
        
        // 상태 변경 (견적 완료)
        status: 'quoted',
        processed_by: manager_name || '매니저',
        processed_at: new Date().toISOString(),
        
        // 업데이트 시간
        updated_at: new Date().toISOString()
      })
      .eq('id', contract_id)
      .eq('customer_number', customer_number) // 추가 보안
      .select()
      .single()

    if (error) {
      console.error('[Contract Update API] Database error:', error)
      return NextResponse.json(
        { error: '견적 정보 저장에 실패했습니다.' },
        { status: 500 }
      )
    }

    console.log('[Contract Update API] Successfully updated:', {
      contract_id: data.id,
      customer_number: data.customer_number,
      status: data.status,
      total_monthly_fee: total_monthly_fee
    })

    return NextResponse.json({
      message: '견적 정보가 성공적으로 저장되었습니다.',
      contract: data
    })

  } catch (error) {
    console.error('[Contract Update API] Unexpected error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 견적 조회 API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contractId = searchParams.get('contract_id')
    const customerNumber = searchParams.get('customer_number')

    if (!contractId && !customerNumber) {
      return NextResponse.json(
        { error: '계약 ID 또는 고객번호가 필요합니다.' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      'https://pkehcfbjotctvneordob.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrZWhjZmJqb3RjdHZuZW9yZG9iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzE5MjY4MSwiZXhwIjoyMDY4NzY4NjgxfQ.fn1IxRxjJZ6gihy_SCvyQrT6Vx3xb1yMaVzztOsLeyk'
    )

    let query = supabase.from('contracts').select('*')
    
    if (contractId) {
      query = query.eq('id', contractId)
    } else if (customerNumber) {
      query = query.eq('customer_number', customerNumber)
    }

    const { data, error } = await query.single()

    if (error || !data) {
      return NextResponse.json(
        { error: '계약 정보를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // admin_notes가 있으면 파싱
    if (data.admin_notes) {
      try {
        data.quote_details = JSON.parse(data.admin_notes)
      } catch (e) {
        data.quote_details = null
      }
    }

    return NextResponse.json({ contract: data })

  } catch (error) {
    console.error('[Contract GET API] Error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}