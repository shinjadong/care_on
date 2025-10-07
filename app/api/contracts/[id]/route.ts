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

// GET: 특정 계약 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contract_id = params.id

    const { data: contract, error } = await supabase
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
          contract_period,
          free_period
        ),
        contract_items:contract_items(
          quantity,
          fee,
          original_price,
          discount_rate,
          discount_reason,
          product:products!contract_items_product_id_fkey(
            name,
            category,
            provider
          )
        )
      `)
      .eq('id', contract_id)
      .single()

    if (error) throw error

    return NextResponse.json({ contract })

  } catch (error) {
    console.error('[Contract Detail API] GET error:', error)
    return NextResponse.json(
      { error: '계약 정보를 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// PUT: 계약 정보 업데이트 (간단한 필드 업데이트)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contract_id = params.id
    const body = await request.json()

    console.log('[Contract Update] Request:', { contract_id, body })

    // 간단한 필드 업데이트
    const { data, error } = await supabase
      .from('contracts')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', contract_id)
      .select()
      .single()

    if (error) {
      console.error('[Contract Update] Database error:', error)
      throw error
    }

    console.log('[Contract Update] Success:', data.id)

    return NextResponse.json({
      message: '계약이 성공적으로 수정되었습니다.',
      contract: data
    })

  } catch (error) {
    console.error('[Contract Update API] Error:', error)
    return NextResponse.json(
      { error: '계약 수정에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// DELETE: 계약 삭제 (소프트 삭제)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contract_id = params.id

    // 소프트 삭제 - status를 cancelled로 변경
    const { data, error } = await supabase
      .from('contracts')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', contract_id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      message: '계약이 성공적으로 취소되었습니다.',
      contract: data
    })

  } catch (error) {
    console.error('[Contract Delete API] Error:', error)
    return NextResponse.json(
      { error: '계약 삭제에 실패했습니다.' },
      { status: 500 }
    )
  }
}
