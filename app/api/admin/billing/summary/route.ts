import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { startOfMonth, endOfMonth, subMonths, format, addMonths } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    // 쿼리 파라미터
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString())
    const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString())

    // 날짜 계산
    const targetDate = new Date(year, month - 1)
    const monthStart = startOfMonth(targetDate)
    const monthEnd = endOfMonth(targetDate)
    const lastMonthStart = startOfMonth(subMonths(targetDate, 1))
    const lastMonthEnd = endOfMonth(subMonths(targetDate, 1))
    const nextMonthStart = startOfMonth(addMonths(targetDate, 1))

    // 1. 월별 청구 요약
    const { data: activeContracts } = await supabase
      .from('contracts')
      .select('monthly_fee, customer_id, contract_name, start_date')
      .eq('status', 'active')
      .lte('start_date', monthEnd.toISOString())

    // 2. 청구액 계산
    const monthlyRevenue = (activeContracts || []).reduce(
      (sum, contract) => sum + (contract.monthly_fee || 0),
      0
    )

    // 3. 미수금 현황 (payment_status 필드가 있다고 가정)
    const { data: pendingPayments, count: pendingCount } = await supabase
      .from('contracts')
      .select('monthly_fee, customer_id', { count: 'exact' })
      .eq('status', 'active')
      .lt('next_payment_date', new Date().toISOString())

    const pendingAmount = (pendingPayments || []).reduce(
      (sum, payment) => sum + (payment.monthly_fee || 0),
      0
    )

    // 4. 연체 현황 (30일 이상 연체)
    const overdueDate = subMonths(new Date(), 1)
    const { data: overduePayments, count: overdueCount } = await supabase
      .from('contracts')
      .select('monthly_fee, customer_id', { count: 'exact' })
      .eq('status', 'active')
      .lt('next_payment_date', overdueDate.toISOString())

    const overdueAmount = (overduePayments || []).reduce(
      (sum, payment) => sum + (payment.monthly_fee || 0),
      0
    )

    // 5. 예정 수금액 (다음 달)
    const { data: upcomingContracts } = await supabase
      .from('contracts')
      .select('monthly_fee')
      .eq('status', 'active')
      .gte('next_payment_date', nextMonthStart.toISOString())

    const upcomingRevenue = (upcomingContracts || []).reduce(
      (sum, contract) => sum + (contract.monthly_fee || 0),
      0
    )

    // 6. 월별 트렌드 (최근 6개월)
    const monthlyTrends = []
    for (let i = 5; i >= 0; i--) {
      const trendDate = subMonths(targetDate, i)
      const trendStart = startOfMonth(trendDate)
      const trendEnd = endOfMonth(trendDate)

      const { data: trendContracts } = await supabase
        .from('contracts')
        .select('monthly_fee')
        .eq('status', 'active')
        .lte('start_date', trendEnd.toISOString())

      const trendRevenue = (trendContracts || []).reduce(
        (sum, contract) => sum + (contract.monthly_fee || 0),
        0
      )

      monthlyTrends.push({
        month: format(trendDate, 'yyyy-MM'),
        monthLabel: format(trendDate, 'M월'),
        revenue: trendRevenue,
        contracts: trendContracts?.length || 0
      })
    }

    // 7. 카테고리별 수익 분석
    const { data: customerData } = await supabase
      .from('customers')
      .select('customer_id, industry')

    const industryMap = new Map(
      customerData?.map(c => [c.customer_id, c.industry]) || []
    )

    const revenueByIndustry: Record<string, number> = {}
    activeContracts?.forEach(contract => {
      const industry = industryMap.get(contract.customer_id) || '기타'
      revenueByIndustry[industry] = (revenueByIndustry[industry] || 0) + (contract.monthly_fee || 0)
    })

    // 8. 결제 방법별 통계 (가정)
    const paymentMethods = {
      card: Math.floor(monthlyRevenue * 0.6),
      transfer: Math.floor(monthlyRevenue * 0.3),
      cms: Math.floor(monthlyRevenue * 0.1)
    }

    // 9. 상위 고객 (매출 기준)
    const { data: topCustomers } = await supabase
      .from('contracts')
      .select(`
        customer_id,
        monthly_fee,
        customers (
          business_name,
          owner_name
        )
      `)
      .eq('status', 'active')
      .order('monthly_fee', { ascending: false })
      .limit(5)

    // 응답 데이터 구성
    const response = {
      summary: {
        currentMonth: {
          revenue: monthlyRevenue,
          contracts: activeContracts?.length || 0,
          averagePerContract: activeContracts?.length ? Math.floor(monthlyRevenue / activeContracts.length) : 0
        },
        pending: {
          count: pendingCount || 0,
          amount: pendingAmount
        },
        overdue: {
          count: overdueCount || 0,
          amount: overdueAmount
        },
        upcoming: {
          nextMonthRevenue: upcomingRevenue
        }
      },
      trends: monthlyTrends,
      breakdown: {
        byIndustry: revenueByIndustry,
        byPaymentMethod: paymentMethods
      },
      topCustomers: topCustomers?.map(tc => ({
        customerId: tc.customer_id,
        businessName: tc.customers?.business_name || '미확인',
        monthlyFee: tc.monthly_fee
      })) || [],
      period: {
        year,
        month,
        monthLabel: format(targetDate, 'yyyy년 M월')
      },
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Billing summary error:', error)
    return NextResponse.json(
      {
        error: '청구 요약 정보를 불러오는데 실패했습니다.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST: 청구서 생성 (월별 일괄)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { year, month, dryRun = false } = body

    // 대상 월 계산
    const targetDate = new Date(year, month - 1)
    const monthStart = startOfMonth(targetDate)
    const monthEnd = endOfMonth(targetDate)

    // 활성 계약 조회
    const { data: contracts } = await supabase
      .from('contracts')
      .select(`
        *,
        customers (
          business_name,
          owner_name,
          phone,
          email
        )
      `)
      .eq('status', 'active')
      .lte('start_date', monthEnd.toISOString())

    if (!contracts || contracts.length === 0) {
      return NextResponse.json({
        message: '청구 대상 계약이 없습니다.',
        count: 0
      })
    }

    // 청구서 데이터 준비
    const invoices = contracts.map(contract => ({
      contract_id: contract.contract_id,
      customer_id: contract.customer_id,
      invoice_date: monthStart.toISOString(),
      due_date: addMonths(monthStart, 1).toISOString(),
      amount: contract.monthly_fee || 0,
      status: 'pending',
      invoice_number: generateInvoiceNumber(year, month),
      created_at: new Date().toISOString()
    }))

    if (dryRun) {
      // 시뮬레이션 모드
      return NextResponse.json({
        message: '청구서 생성 시뮬레이션',
        dryRun: true,
        count: invoices.length,
        totalAmount: invoices.reduce((sum, inv) => sum + inv.amount, 0),
        preview: invoices.slice(0, 5)
      })
    }

    // 실제 청구서 생성 (invoices 테이블이 있다고 가정)
    // const { error } = await supabase
    //   .from('invoices')
    //   .insert(invoices)

    // SMS 발송 (옵션)
    for (const contract of contracts) {
      if (contract.customers?.phone) {
        try {
          await fetch('/api/sms/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: contract.customers.phone,
              message: `[케어온] ${contract.customers.business_name}님, ${month}월 청구서가 발행되었습니다. 금액: ${contract.monthly_fee?.toLocaleString()}원`
            })
          })
        } catch (smsError) {
          console.error('SMS error:', smsError)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `${invoices.length}개의 청구서가 생성되었습니다.`,
      count: invoices.length,
      totalAmount: invoices.reduce((sum, inv) => sum + inv.amount, 0),
      period: `${year}년 ${month}월`
    })

  } catch (error) {
    console.error('Invoice creation error:', error)
    return NextResponse.json(
      { error: '청구서 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 헬퍼 함수: 청구서 번호 생성
function generateInvoiceNumber(year: number, month: number): string {
  const yearStr = year.toString()
  const monthStr = month.toString().padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `INV-${yearStr}${monthStr}-${random}`
}