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

// GET: CS 티켓 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all'
    const priority = searchParams.get('priority') || 'all'
    const assigned_employee_id = searchParams.get('assigned_employee_id')
    const customer_id = searchParams.get('customer_id')

    let query = supabase
      .from('cs_tickets')
      .select(`
        *,
        customer:customers!cs_tickets_customer_id_fkey(
          customer_code,
          business_name,
          owner_name,
          phone
        ),
        contract:contracts!cs_tickets_contract_id_fkey(
          contract_number,
          status
        ),
        assigned_employee:employees!cs_tickets_assigned_employee_id_fkey(
          name,
          department
        )
      `)
      .order('created_at', { ascending: false })

    // 필터 적용
    if (status !== 'all') {
      query = query.eq('status', status)
    }

    if (priority !== 'all') {
      query = query.eq('priority', priority)
    }

    if (assigned_employee_id) {
      query = query.eq('assigned_employee_id', assigned_employee_id)
    }

    if (customer_id) {
      query = query.eq('customer_id', customer_id)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({
      tickets: data
    })

  } catch (error) {
    console.error('[CS Tickets API] GET error:', error)
    return NextResponse.json(
      { error: 'CS 티켓 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// POST: 새 CS 티켓 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customer_id,
      contract_id,
      subject,
      category,
      priority = 'normal',
      channel,
      assigned_employee_id,
      due_at,
      initial_comment
    } = body

    // 필수 필드 검증
    if (!customer_id || !subject || !category) {
      return NextResponse.json(
        { error: '고객 ID, 제목, 카테고리는 필수입니다.' },
        { status: 400 }
      )
    }

    // 티켓 생성
    const { data: ticket, error: ticketError } = await supabase
      .from('cs_tickets')
      .insert([{
        customer_id,
        contract_id,
        subject,
        category,
        priority,
        channel,
        assigned_employee_id,
        due_at,
        status: 'open',
        last_activity_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (ticketError) throw ticketError

    // 초기 코멘트가 있다면 추가
    if (initial_comment) {
      const { error: commentError } = await supabase
        .from('cs_comments')
        .insert([{
          ticket_id: ticket.id,
          author_employee_id: assigned_employee_id,
          body: initial_comment,
          visibility: 'internal'
        }])

      if (commentError) {
        console.warn('[CS Tickets API] Initial comment creation failed:', commentError)
      }
    }

    return NextResponse.json({
      message: 'CS 티켓이 성공적으로 생성되었습니다.',
      ticket
    })

  } catch (error) {
    console.error('[CS Tickets API] POST error:', error)
    return NextResponse.json(
      { error: 'CS 티켓 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// PUT: CS 티켓 업데이트
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { ticket_id, ...updateData } = body

    if (!ticket_id) {
      return NextResponse.json(
        { error: '티켓 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // 상태 변경 시 resolved_at 업데이트
    if (updateData.status === 'resolved' || updateData.status === 'closed') {
      updateData.resolved_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('cs_tickets')
      .update({
        ...updateData,
        last_activity_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', ticket_id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      message: 'CS 티켓이 성공적으로 업데이트되었습니다.',
      ticket: data
    })

  } catch (error) {
    console.error('[CS Tickets API] PUT error:', error)
    return NextResponse.json(
      { error: 'CS 티켓 업데이트에 실패했습니다.' },
      { status: 500 }
    )
  }
}
