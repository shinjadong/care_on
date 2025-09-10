import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Supabase 클라이언트 생성
    const supabase = createClient(
      'https://pkehcfbjotctvneordob.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrZWhjZmJqb3RjdHZuZW9yZG9iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzE5MjY4MSwiZXhwIjoyMDY4NzY4NjgxfQ.fn1IxRxjJZ6gihy_SCvyQrT6Vx3xb1yMaVzztOsLeyk'
    )

    // 기본 쿼리
    let query = supabase
      .from('contracts')
      .select(`
        id,
        customer_number,
        contract_number,
        business_name,
        owner_name,
        phone,
        email,
        address,
        business_registration,
        status,
        internet_plan,
        internet_monthly_fee,
        cctv_count,
        cctv_monthly_fee,
        installation_address,
        bank_name,
        account_number,
        account_holder,
        contract_period,
        free_period,
        start_date,
        end_date,
        additional_requests,
        admin_notes,
        created_at,
        updated_at,
        processed_by,
        processed_at
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // 상태 필터
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    // 검색 필터
    if (search) {
      query = query.or(`
        business_name.ilike.%${search}%,
        owner_name.ilike.%${search}%,
        phone.ilike.%${search}%,
        customer_number.ilike.%${search}%
      `)
    }

    const { data: contracts, error, count } = await query

    if (error) {
      console.error('[Manager Contracts API] Database error:', error)
      return NextResponse.json(
        { error: '계약 목록 조회에 실패했습니다.' },
        { status: 500 }
      )
    }

    // admin_notes 파싱
    const contractsWithDetails = contracts?.map(contract => {
      if (contract.admin_notes) {
        try {
          contract.quote_details = JSON.parse(contract.admin_notes)
        } catch (e) {
          contract.quote_details = null
        }
      }
      return contract
    }) || []

    return NextResponse.json({
      contracts: contractsWithDetails,
      total: count,
      limit,
      offset
    })

  } catch (error) {
    console.error('[Manager Contracts API] Unexpected error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}