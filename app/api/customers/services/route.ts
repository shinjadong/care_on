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

// GET: 고객의 서비스 현황 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customer_number = searchParams.get('customer_number')
    const customer_code = searchParams.get('customer_code')
    
    if (!customer_number && !customer_code) {
      return NextResponse.json(
        { error: '고객 번호가 필요합니다.' },
        { status: 400 }
      )
    }

    // 고객 정보 조회
    let customerQuery = supabase
      .from('customers')
      .select(`
        *,
        contracts:contracts!contracts_customer_id_fkey(
          id,
          contract_number,
          status,
          total_monthly_fee,
          start_date,
          end_date,
          next_billing_at,
          package:packages!contracts_package_id_fkey(
            name,
            contract_period,
            free_period,
            closure_refund_rate
          )
        ),
        cs_tickets:cs_tickets!cs_tickets_customer_id_fkey(
          id,
          subject,
          status,
          created_at
        )
      `)

    if (customer_number) {
      customerQuery = customerQuery.or(`customer_code.eq.${customer_number}`)
    } else {
      customerQuery = customerQuery.eq('customer_code', customer_code)
    }

    const { data: customer, error: customerError } = await customerQuery.single()

    if (customerError) throw customerError

    // 청구 내역 조회 (최근 6개월)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const { data: billingHistory } = await supabase
      .from('invoices')
      .select('amount, due_date, status, paid_at')
      .in('contract_id', customer.contracts.map((c: any) => c.id))
      .gte('due_date', sixMonthsAgo.toISOString().split('T')[0])
      .order('due_date', { ascending: false })

    // 응답 데이터 구성
    const responseData = {
      customer: {
        customer_code: customer.customer_code,
        business_name: customer.business_name,
        owner_name: customer.owner_name,
        phone: customer.phone,
        email: customer.email
      },
      contracts: customer.contracts,
      current_services: customer.current_services,
      cs_tickets: customer.cs_tickets?.slice(0, 10) || [], // 최근 10개
      billing_history: billingHistory || [],
      summary: {
        total_monthly_fee: customer.contracts.reduce((sum: number, contract: any) => 
          sum + (contract.total_monthly_fee || 0), 0
        ),
        active_contracts: customer.contracts.filter((c: any) => c.status === 'active').length,
        total_contracts: customer.contracts.length,
        open_tickets: customer.cs_tickets?.filter((t: any) => t.status === 'open').length || 0
      }
    }

    return NextResponse.json({ customer: responseData })

  } catch (error) {
    console.error('[Customer Services API] Error:', error)
    return NextResponse.json(
      { error: '서비스 정보 조회에 실패했습니다.' },
      { status: 500 }
    )
  }
}