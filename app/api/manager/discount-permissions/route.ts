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

// GET: 매니저별 할인 권한 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const employee_id = searchParams.get('employee_id')

    if (!employee_id) {
      // 모든 매니저 권한 조회
      const { data, error } = await supabase
        .from('manager_discount_permissions')
        .select(`
          *,
          employee:employees!manager_discount_permissions_employee_id_fkey(
            name,
            department
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      return NextResponse.json({ permissions: data })
    } else {
      // 특정 매니저 권한 조회
      const { data, error } = await supabase
        .from('manager_discount_permissions')
        .select('*')
        .eq('employee_id', employee_id)

      if (error) throw error

      // 카테고리별 최대 할인율 계산
      const permissions = data.reduce((acc: any, perm: any) => {
        if (perm.product_category) {
          acc[perm.product_category] = {
            max_discount_rate: perm.max_discount_rate,
            approval_required_above: perm.approval_required_above
          }
        } else {
          acc['default'] = {
            max_discount_rate: perm.max_discount_rate,
            approval_required_above: perm.approval_required_above
          }
        }
        return acc
      }, {})

      return NextResponse.json({ permissions })
    }

  } catch (error) {
    console.error('[Discount Permissions API] GET error:', error)
    return NextResponse.json(
      { error: '할인 권한 조회에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// POST: 매니저 할인 권한 설정/업데이트
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { employee_id, permissions } = body

    if (!employee_id || !permissions) {
      return NextResponse.json(
        { error: '매니저 ID와 권한 정보가 필요합니다.' },
        { status: 400 }
      )
    }

    // 기존 권한 삭제
    await supabase
      .from('manager_discount_permissions')
      .delete()
      .eq('employee_id', employee_id)

    // 새 권한 설정
    const permissionsArray = Object.entries(permissions).map(([category, perm]: [string, any]) => ({
      employee_id: parseInt(employee_id),
      product_category: category === 'default' ? null : category,
      max_discount_rate: perm.max_discount_rate,
      approval_required_above: perm.approval_required_above || perm.max_discount_rate
    }))

    const { error } = await supabase
      .from('manager_discount_permissions')
      .insert(permissionsArray)

    if (error) throw error

    return NextResponse.json({
      message: '할인 권한이 성공적으로 설정되었습니다.',
      permissions: permissionsArray
    })

  } catch (error) {
    console.error('[Discount Permissions API] POST error:', error)
    return NextResponse.json(
      { error: '할인 권한 설정에 실패했습니다.' },
      { status: 500 }
    )
  }
}