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

// GET: 고객 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'

    // 조인 없이 기본 조회 (조인 문제 회피)
    let query = supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })

    // 검색 조건 적용
    if (search) {
      query = query.or(`business_name.ilike.%${search}%,owner_name.ilike.%${search}%,phone.ilike.%${search}%`)
    }

    if (status !== 'all') {
      query = query.eq('status', status)
    }

    // 페이징 적용
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({
      customers: data,
      pagination: {
        page,
        limit,
        total: data.length
      }
    })

  } catch (error) {
    console.error('[Customers API] GET error:', error)
    return NextResponse.json(
      { error: '고객 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// POST: 새 고객 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      business_name,
      owner_name,
      business_registration,
      phone,
      email,
      address,
      industry,
      account_manager_employee_id
    } = body

    // 필수 필드 검증
    if (!business_name || !owner_name) {
      return NextResponse.json(
        { error: '사업체명과 대표자명은 필수입니다.' },
        { status: 400 }
      )
    }

    // 고객번호 생성
    const { data: existingCustomers } = await supabase
      .from('customers')
      .select('customer_code')
      .like('customer_code', 'CO%')
      .order('customer_code', { ascending: false })
      .limit(1)

    let nextNumber = 1
    if (existingCustomers && existingCustomers.length > 0) {
      const lastCode = existingCustomers[0].customer_code
      const lastNumber = parseInt(lastCode.substring(2)) || 0
      nextNumber = lastNumber + 1
    }

    const customerCode = 'CO' + nextNumber.toString().padStart(6, '0')

    // 고객 생성
    const { data, error } = await supabase
      .from('customers')
      .insert([{
        customer_code: customerCode,
        business_name,
        owner_name,
        business_registration,
        phone: phone?.replace(/[^0-9]/g, ''),
        email,
        address,
        industry,
        account_manager_employee_id,
        status: 'active'
      }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      message: '고객이 성공적으로 생성되었습니다.',
      customer: data
    })

  } catch (error) {
    console.error('[Customers API] POST error:', error)
    return NextResponse.json(
      { error: '고객 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
}