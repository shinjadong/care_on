import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { autoRefreshToken: false, persistSession: false },
    db: { schema: 'public' }
  }
)

export async function GET(request: NextRequest) {
  try {
    // 병렬로 모든 통계 데이터 조회
    const [
      customersResult,
      contractsResult,
      csTicketsResult,
      invoicesResult,
      remittancesResult
    ] = await Promise.allSettled([
      // 고객 통계
      supabase
        .from('customers')
        .select('status, care_status, created_at')
        .order('created_at', { ascending: false }),
      
      // 계약 통계  
      supabase
        .from('contracts')
        .select('status, total_monthly_fee, is_trial, is_portfolio, created_at')
        .order('created_at', { ascending: false }),
      
      // CS 티켓 통계
      supabase
        .from('cs_tickets')
        .select('status, priority, created_at, resolved_at')
        .order('created_at', { ascending: false }),
      
      // 청구서 통계
      supabase
        .from('invoices')
        .select('status, amount, due_date, created_at')
        .order('created_at', { ascending: false }),
      
      // 송금 통계
      supabase
        .from('remittances')
        .select('status, amount, scheduled_for, created_at')
        .order('created_at', { ascending: false })
    ])

    // 결과 처리 및 에러 체크
    const customers = customersResult.status === 'fulfilled' ? customersResult.value.data || [] : []
    const contracts = contractsResult.status === 'fulfilled' ? contractsResult.value.data || [] : []
    const csTickets = csTicketsResult.status === 'fulfilled' ? csTicketsResult.value.data || [] : []
    const invoices = invoicesResult.status === 'fulfilled' ? invoicesResult.value.data || [] : []
    const remittances = remittancesResult.status === 'fulfilled' ? remittancesResult.value.data || [] : []

    // 날짜 계산 헬퍼
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    // 통계 계산
    const stats = {
      customers: {
        total: customers.length,
        active: customers.filter(c => c.status === 'active').length,
        care_active: customers.filter(c => c.care_status === 'active').length,
        new_this_month: customers.filter(c => 
          new Date(c.created_at) >= thisMonth
        ).length,
        onboarding: customers.filter(c => c.care_status === 'onboarding').length
      },
      
      contracts: {
        total: contracts.length,
        pending: contracts.filter(c => c.status === 'pending').length,
        quoted: contracts.filter(c => c.status === 'quoted').length,
        active: contracts.filter(c => c.status === 'active').length,
        completed: contracts.filter(c => c.status === 'completed').length,
        portfolio_count: contracts.filter(c => c.is_portfolio).length,
        trial_count: contracts.filter(c => c.is_trial).length,
        new_this_month: contracts.filter(c => 
          new Date(c.created_at) >= thisMonth
        ).length,
        total_monthly_revenue: contracts
          .filter(c => c.status === 'active')
          .reduce((sum, c) => sum + (c.total_monthly_fee || 0), 0)
      },
      
      cs_tickets: {
        total: csTickets.length,
        open: csTickets.filter(t => t.status === 'open').length,
        in_progress: csTickets.filter(t => t.status === 'in_progress').length,
        urgent: csTickets.filter(t => t.priority === 'urgent').length,
        high_priority: csTickets.filter(t => t.priority === 'high').length,
        resolved_today: csTickets.filter(t => 
          t.resolved_at && new Date(t.resolved_at) >= today
        ).length,
        created_today: csTickets.filter(t => 
          new Date(t.created_at) >= today
        ).length
      },
      
      billing: {
        total_monthly: invoices
          .filter(i => i.status !== 'void')
          .reduce((sum, i) => sum + i.amount, 0),
        pending_invoices: invoices.filter(i => i.status === 'pending').length,
        overdue_count: invoices.filter(i => 
          i.status === 'pending' && new Date(i.due_date) < today
        ).length,
        paid_this_month: invoices
          .filter(i => i.status === 'paid' && new Date(i.created_at) >= thisMonth)
          .reduce((sum, i) => sum + i.amount, 0),
        upcoming_remittances: remittances.filter(r => 
          r.status === 'scheduled' && new Date(r.scheduled_for) <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
        ).length,
        pending_remittances: remittances.filter(r => r.status === 'scheduled').length
      },
      
      // 성장률 계산
      growth: {
        customers_growth: customers.filter(c => new Date(c.created_at) >= thisMonth).length -
                          customers.filter(c => new Date(c.created_at) >= lastMonth && new Date(c.created_at) < thisMonth).length,
        contracts_growth: contracts.filter(c => new Date(c.created_at) >= thisMonth).length -
                          contracts.filter(c => new Date(c.created_at) >= lastMonth && new Date(c.created_at) < thisMonth).length,
        revenue_growth_rate: 0 // 실제로는 전월 대비 계산 필요
      }
    }

    return NextResponse.json({ stats })

  } catch (error) {
    console.error('[Dashboard Stats API] Error:', error)
    return NextResponse.json(
      { error: '통계 데이터를 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}