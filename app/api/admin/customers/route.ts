import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET: 고객 목록 조회 (페이지네이션, 필터, 검색)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    // 쿼리 파라미터 추출
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'
    const careStatus = searchParams.get('care_status') || 'all'
    const sortBy = searchParams.get('sort_by') || 'created_at'
    const sortOrder = searchParams.get('sort_order') || 'desc'

    // 기본 쿼리 구성
    let query = supabase.from('customers').select('*', { count: 'exact' })

    // 검색 조건 적용
    if (search) {
      query = query.or(
        `business_name.ilike.%${search}%,owner_name.ilike.%${search}%,phone.ilike.%${search}%,business_registration.ilike.%${search}%`
      )
    }

    // 상태 필터 적용
    if (status !== 'all') {
      query = query.eq('status', status)
    }

    if (careStatus !== 'all') {
      query = query.eq('care_status', careStatus)
    }

    // 정렬 적용
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // 페이지네이션 적용
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    // 쿼리 실행
    const { data, error, count } = await query

    if (error) {
      throw error
    }

    // 각 고객에 대한 추가 정보 조회 (계약 수, CS 티켓 수)
    const customersWithStats = await Promise.all(
      (data || []).map(async (customer) => {
        const [contractsCount, ticketsCount] = await Promise.all([
          supabase
            .from('contracts')
            .select('*', { count: 'exact', head: true })
            .eq('customer_id', customer.customer_id),
          // CS 티켓 테이블이 없으면 0 반환
          Promise.resolve({ count: 0 })
        ])

        return {
          ...customer,
          contracts_count: contractsCount.count || 0,
          tickets_count: ticketsCount.count || 0
        }
      })
    )

    // 응답 구성
    const response = {
      customers: customersWithStats,
      pagination: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      },
      filters: {
        search,
        status,
        careStatus,
        sortBy,
        sortOrder
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Customer list error:', error)
    return NextResponse.json(
      { error: '고객 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// POST: 신규 고객 등록
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // 필수 필드 검증
    const requiredFields = ['business_name', 'owner_name', 'phone']
    const missingFields = requiredFields.filter(field => !body[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: '필수 정보가 누락되었습니다.',
          missingFields
        },
        { status: 400 }
      )
    }

    // 중복 체크 (사업자등록번호가 있는 경우)
    if (body.business_registration) {
      const { data: existing } = await supabase
        .from('customers')
        .select('customer_id')
        .eq('business_registration', body.business_registration)
        .single()

      if (existing) {
        return NextResponse.json(
          { error: '이미 등록된 사업자등록번호입니다.' },
          { status: 409 }
        )
      }
    }

    // 고객 코드 생성 (자동)
    const customerCode = generateCustomerCode()

    // 고객 데이터 구성
    const customerData = {
      customer_code: customerCode,
      business_name: body.business_name,
      owner_name: body.owner_name,
      business_registration: body.business_registration || null,
      phone: body.phone,
      email: body.email || null,
      address: body.address || null,
      industry: body.industry || null,
      status: body.status || 'active',
      care_status: body.care_status || 'onboarding',
      account_manager_employee_id: body.account_manager_employee_id || null,
      created_at: new Date().toISOString()
    }

    // 데이터베이스에 삽입
    const { data, error } = await supabase
      .from('customers')
      .insert(customerData)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: '고객이 성공적으로 등록되었습니다.',
      customer: data
    }, { status: 201 })

  } catch (error) {
    console.error('Customer creation error:', error)
    return NextResponse.json(
      { error: '고객 등록 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// PUT: 고객 정보 수정 (bulk update 지원)
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // 단일 업데이트 또는 벌크 업데이트 구분
    if (body.customer_id) {
      // 단일 고객 업데이트
      const { customer_id, ...updateData } = body

      const { data, error } = await supabase
        .from('customers')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('customer_id', customer_id)
        .select()
        .single()

      if (error) {
        throw error
      }

      return NextResponse.json({
        success: true,
        message: '고객 정보가 업데이트되었습니다.',
        customer: data
      })

    } else if (body.customer_ids && body.updates) {
      // 벌크 업데이트
      const { customer_ids, updates } = body

      const { error } = await supabase
        .from('customers')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .in('customer_id', customer_ids)

      if (error) {
        throw error
      }

      return NextResponse.json({
        success: true,
        message: `${customer_ids.length}개의 고객 정보가 업데이트되었습니다.`,
        updated_count: customer_ids.length
      })

    } else {
      return NextResponse.json(
        { error: '고객 ID가 필요합니다.' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Customer update error:', error)
    return NextResponse.json(
      { error: '고객 정보 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// DELETE: 고객 삭제 (soft delete)
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customer_id')

    if (!customerId) {
      return NextResponse.json(
        { error: '고객 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // 연관된 계약이 있는지 확인
    const { count: contractsCount } = await supabase
      .from('contracts')
      .select('*', { count: 'exact', head: true })
      .eq('customer_id', customerId)
      .neq('status', 'cancelled')

    if (contractsCount && contractsCount > 0) {
      return NextResponse.json(
        { error: '활성 계약이 있는 고객은 삭제할 수 없습니다.' },
        { status: 400 }
      )
    }

    // Soft delete (status를 inactive로 변경)
    const { error } = await supabase
      .from('customers')
      .update({
        status: 'inactive',
        care_status: 'offboarded',
        updated_at: new Date().toISOString()
      })
      .eq('customer_id', customerId)

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: '고객이 비활성화되었습니다.',
      customer_id: customerId
    })

  } catch (error) {
    console.error('Customer deletion error:', error)
    return NextResponse.json(
      { error: '고객 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 헬퍼 함수: 고객 코드 생성
function generateCustomerCode(): string {
  const prefix = 'CO'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}