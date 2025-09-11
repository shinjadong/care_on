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

// GET: 특정 고객 상세 정보 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customer_id = params.id

    const { data: customer, error } = await supabase
      .from('customers')
      .select('*')
      .eq('customer_id', customer_id)
      .single()

    if (error) throw error

    return NextResponse.json({ customer })

  } catch (error) {
    console.error('[Customer Detail API] GET error:', error)
    return NextResponse.json(
      { error: '고객 정보를 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// PUT: 고객 정보 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customer_id = params.id
    const body = await request.json()

    const { data, error } = await supabase
      .from('customers')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('customer_id', customer_id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      message: '고객 정보가 성공적으로 수정되었습니다.',
      customer: data
    })

  } catch (error) {
    console.error('[Customer Detail API] PUT error:', error)
    return NextResponse.json(
      { error: '고객 정보 수정에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// DELETE: 고객 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customer_id = params.id

    // 관련 계약이 있는지 확인
    const { data: contracts } = await supabase
      .from('contracts')
      .select('id')
      .eq('customer_id', customer_id)
      .limit(1)

    if (contracts && contracts.length > 0) {
      return NextResponse.json(
        { error: '연결된 계약이 있어 삭제할 수 없습니다.' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('customer_id', customer_id)

    if (error) throw error

    return NextResponse.json({
      message: '고객이 성공적으로 삭제되었습니다.'
    })

  } catch (error) {
    console.error('[Customer Detail API] DELETE error:', error)
    return NextResponse.json(
      { error: '고객 삭제에 실패했습니다.' },
      { status: 500 }
    )
  }
}