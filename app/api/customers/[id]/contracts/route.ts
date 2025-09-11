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

// GET: 특정 고객의 모든 계약 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customer_id = params.id

    const { data: contracts, error } = await supabase
      .from('contracts')
      .select(`
        *,
        package:packages!contracts_package_id_fkey(
          name,
          monthly_fee,
          contract_period,
          free_period
        )
      `)
      .eq('customer_id', customer_id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ contracts: contracts || [] })

  } catch (error) {
    console.error('[Customer Contracts API] GET error:', error)
    return NextResponse.json(
      { error: '고객 계약 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// POST: 특정 고객에 대한 새 계약 생성
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customer_id = params.id
    const body = await request.json()

    // 고객 정보 먼저 조회
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('customer_id', customer_id)
      .single()

    if (customerError) throw customerError

    // 새 계약 생성
    const { data: contract, error: contractError } = await supabase
      .from('contracts')
      .insert([{
        customer_id,
        business_name: customer.business_name,
        owner_name: customer.owner_name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        business_registration: customer.business_registration,
        package_id: body.package_id,
        total_monthly_fee: body.total_monthly_fee || 0,
        status: 'pending',
        ...body
      }])
      .select()
      .single()

    if (contractError) throw contractError

    return NextResponse.json({
      message: '계약이 성공적으로 생성되었습니다.',
      contract
    })

  } catch (error) {
    console.error('[Customer Contracts API] POST error:', error)
    return NextResponse.json(
      { error: '계약 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
}