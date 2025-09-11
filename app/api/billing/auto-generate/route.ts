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

// POST: 월별 청구서/송금 자동 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      target_month, // 'YYYY-MM' 형태
      action = 'both' // 'invoices', 'remittances', 'both'
    } = body

    const targetDate = new Date(target_month + '-01')
    const year = targetDate.getFullYear()
    const month = targetDate.getMonth()
    
    // 해당 월의 시작일과 종료일 계산
    const periodStart = new Date(year, month, 1)
    const periodEnd = new Date(year, month + 1, 0)

    let generatedInvoices = 0
    let generatedRemittances = 0

    // 활성 계약 조회
    const { data: activeContracts, error: contractsError } = await supabase
      .from('contracts')
      .select(`
        id,
        customer_id,
        total_monthly_fee,
        billing_day,
        remittance_day,
        status,
        customer:customers!customer_id(
          customer_code,
          business_name,
          owner_name
        ),
        package:packages!package_id(
          name,
          monthly_fee
        )
      `)
      .eq('status', 'active')
      .not('customer_id', 'is', null)

    if (contractsError) throw contractsError

    // 1. 청구서 생성
    if (action === 'invoices' || action === 'both') {
      for (const contract of activeContracts) {
        // 이미 해당 월 청구서가 있는지 확인
        const { data: existingInvoice } = await supabase
          .from('invoices')
          .select('id')
          .eq('contract_id', contract.id)
          .gte('billing_period_start', periodStart.toISOString().split('T')[0])
          .lte('billing_period_start', periodEnd.toISOString().split('T')[0])
          .single()

        if (existingInvoice) {
          console.log(`Invoice already exists for contract ${contract.id} in ${target_month}`)
          continue
        }

        // 청구일 계산
        const billingDay = contract.billing_day || 1
        const dueDate = new Date(year, month, Math.min(billingDay, periodEnd.getDate()))

        // 청구서 생성
        const { error: invoiceError } = await supabase
          .from('invoices')
          .insert([{
            contract_id: contract.id,
            billing_period_start: periodStart.toISOString().split('T')[0],
            billing_period_end: periodEnd.toISOString().split('T')[0],
            due_date: dueDate.toISOString().split('T')[0],
            amount: contract.total_monthly_fee || 0,
            status: 'pending'
          }])

        if (!invoiceError) {
          generatedInvoices++
          
          // 다음 청구일 업데이트
          const nextBilling = new Date(year, month + 1, billingDay)
          await supabase
            .from('contracts')
            .update({ next_billing_at: nextBilling.toISOString() })
            .eq('id', contract.id)
        }
      }
    }

    // 2. 송금 생성 (벤더 송금)
    if (action === 'remittances' || action === 'both') {
      for (const contract of activeContracts) {
        // 이미 해당 월 송금이 있는지 확인
        const { data: existingRemittance } = await supabase
          .from('remittances')
          .select('id')
          .eq('contract_id', contract.id)
          .gte('scheduled_for', periodStart.toISOString().split('T')[0])
          .lte('scheduled_for', periodEnd.toISOString().split('T')[0])
          .single()

        if (existingRemittance) {
          console.log(`Remittance already exists for contract ${contract.id} in ${target_month}`)
          continue
        }

        // 송금일 계산  
        const remittanceDay = contract.remittance_day || 25
        const scheduledDate = new Date(year, month, Math.min(remittanceDay, periodEnd.getDate()))

        // 송금액 계산 (예: 총액의 80%를 벤더에게 송금)
        const remittanceAmount = Math.floor((contract.total_monthly_fee || 0) * 0.8)

        // 벤더 송금 생성
        const { error: remittanceError } = await supabase
          .from('remittances')
          .insert([{
            contract_id: contract.id,
            counterparty_type: 'vendor',
            counterparty_name: contract.package?.name ? 
              `${contract.package.name} 패키지 벤더` : 
              '서비스 제공업체',
            scheduled_for: scheduledDate.toISOString().split('T')[0],
            amount: remittanceAmount,
            status: 'scheduled',
            memo: `${target_month} 월 정산 송금`
          }])

        if (!remittanceError) {
          generatedRemittances++
          
          // 다음 송금일 업데이트
          const nextRemittance = new Date(year, month + 1, remittanceDay)
          await supabase
            .from('contracts')
            .update({ next_remittance_at: nextRemittance.toISOString() })
            .eq('id', contract.id)
        }
      }
    }

    return NextResponse.json({
      message: '월별 청구/송금 생성이 완료되었습니다.',
      generated: {
        invoices: generatedInvoices,
        remittances: generatedRemittances
      },
      target_month,
      processed_contracts: activeContracts.length
    })

  } catch (error) {
    console.error('[Auto Billing API] Error:', error)
    return NextResponse.json(
      { error: '자동 청구/송금 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// GET: 자동 생성 가능한 계약 목록 확인
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const target_month = searchParams.get('target_month') || new Date().toISOString().slice(0, 7)

    const { data: activeContracts, error } = await supabase
      .from('contracts')
      .select(`
        id,
        contract_number,
        total_monthly_fee,
        billing_day,
        remittance_day,
        customer:customers!customer_id(
          customer_code,
          business_name
        )
      `)
      .eq('status', 'active')
      .not('customer_id', 'is', null)

    if (error) throw error

    return NextResponse.json({
      target_month,
      eligible_contracts: activeContracts.length,
      contracts: activeContracts,
      estimated_billing: activeContracts.reduce((sum, c) => sum + (c.total_monthly_fee || 0), 0)
    })

  } catch (error) {
    console.error('[Auto Billing API] GET error:', error)
    return NextResponse.json(
      { error: '자동 생성 가능 계약 조회에 실패했습니다.' },
      { status: 500 }
    )
  }
}