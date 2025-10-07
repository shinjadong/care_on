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

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { employee_id, assign_to_contracts = false } = body
    const customer_id = params.id

    if (!employee_id) {
      return NextResponse.json(
        { error: '직원 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // 직원 정보 확인
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .select('id, name, department, is_active')
      .eq('id', employee_id)
      .eq('is_active', true)
      .single()

    if (employeeError || !employee) {
      return NextResponse.json(
        { error: '유효한 직원을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 고객에게 담당 매니저 배정
    const { data: updatedCustomer, error: customerError } = await supabase
      .from('customers')
      .update({
        account_manager_employee_id: employee_id,
        care_status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('customer_id', customer_id)
      .select(`
        *,
        assigned_manager:employees!account_manager_employee_id(
          name,
          department
        )
      `)
      .single()

    if (customerError) throw customerError

    // 해당 고객의 모든 계약에도 담당자 배정 (옵션)
    if (assign_to_contracts) {
      const { error: contractsError } = await supabase
        .from('contracts')
        .update({
          account_manager_employee_id: employee_id,
          updated_at: new Date().toISOString()
        })
        .eq('customer_id', customer_id)

      if (contractsError) {
        console.warn('Contract manager assignment failed:', contractsError)
      }
    }

    // CS 티켓 생성 (담당자 배정 알림)
    const { error: ticketError } = await supabase
      .from('cs_tickets')
      .insert([{
        customer_id,
        subject: `담당 매니저 배정 완료: ${employee.name}`,
        category: 'other',
        priority: 'normal',
        status: 'closed',
        channel: 'web',
        assigned_employee_id: employee_id,
        resolved_at: new Date().toISOString()
      }])

    if (ticketError) {
      console.warn('CS ticket creation failed:', ticketError)
    }

    return NextResponse.json({
      message: `담당 매니저가 성공적으로 배정되었습니다.`,
      customer: updatedCustomer,
      assigned_manager: employee,
      assigned_to_contracts: assign_to_contracts
    })

  } catch (error) {
    console.error('[Assign Manager API] Error:', error)
    return NextResponse.json(
      { error: '담당 매니저 배정에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// DELETE: 담당 매니저 배정 해제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customer_id = params.id

    // 고객 담당자 해제
    const { data: updatedCustomer, error } = await supabase
      .from('customers')
      .update({
        account_manager_employee_id: null,
        care_status: 'paused',
        updated_at: new Date().toISOString()
      })
      .eq('customer_id', customer_id)
      .select()
      .single()

    if (error) throw error

    // CS 티켓 생성 (담당자 해제 알림)
    await supabase
      .from('cs_tickets')
      .insert([{
        customer_id,
        subject: '담당 매니저 배정 해제',
        category: 'other',
        priority: 'normal',
        status: 'closed',
        channel: 'web',
        resolved_at: new Date().toISOString()
      }])

    return NextResponse.json({
      message: '담당 매니저 배정이 해제되었습니다.',
      customer: updatedCustomer
    })

  } catch (error) {
    console.error('[Unassign Manager API] Error:', error)
    return NextResponse.json(
      { error: '담당 매니저 해제에 실패했습니다.' },
      { status: 500 }
    )
  }
}
