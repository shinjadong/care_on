import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET: 메시지 발송용 고객 목록 조회
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const businessType = searchParams.get('businessType')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const selectAll = searchParams.get('selectAll') === 'true'

    // 전체 선택 모드일 때는 모든 데이터 반환
    if (selectAll) {
      let query = supabase
        .from('customers')
        .select('id, name, phone, business_name, email, status, business_type')
        .order('created_at', { ascending: false })

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query

      if (error) {
        console.error('고객 조회 오류:', error)
        return NextResponse.json(
          { error: '고객 조회에 실패했습니다.' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        customers: data || [],
        total: data?.length || 0
      })
    }

    // 페이지네이션 모드
    const offset = (page - 1) * limit

    let query = supabase
      .from('customers')
      .select('id, name, phone, business_name, email, status, business_type', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // 검색 조건
    if (search) {
      query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,business_name.ilike.%${search}%`)
    }
    if (status) {
      query = query.eq('status', status)
    }
    if (businessType) {
      query = query.eq('business_type', businessType)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('고객 조회 오류:', error)
      return NextResponse.json(
        { error: '고객 조회에 실패했습니다.' },
        { status: 500 }
      )
    }

    // 가입 신청자 목록도 조회
    let enrollmentQuery = supabase
      .from('enrollment_applications')
      .select('id, applicant_name, applicant_phone, store_name, business_type, status', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (search) {
      enrollmentQuery = enrollmentQuery.or(`applicant_name.ilike.%${search}%,applicant_phone.ilike.%${search}%,store_name.ilike.%${search}%`)
    }

    const { data: enrollments, count: enrollmentCount } = await enrollmentQuery

    // 데이터 병합 (중복 제거)
    const phoneMap = new Map()

    // 고객 데이터 추가
    data?.forEach(customer => {
      if (customer.phone) {
        phoneMap.set(customer.phone, {
          id: customer.id,
          name: customer.name,
          phone: customer.phone,
          businessName: customer.business_name,
          email: customer.email,
          status: customer.status,
          businessType: customer.business_type,
          type: 'customer'
        })
      }
    })

    // 가입 신청자 데이터 추가 (중복되지 않는 경우만)
    enrollments?.forEach(enrollment => {
      if (enrollment.applicant_phone && !phoneMap.has(enrollment.applicant_phone)) {
        phoneMap.set(enrollment.applicant_phone, {
          id: `enrollment_${enrollment.id}`,
          enrollmentId: enrollment.id,
          name: enrollment.applicant_name,
          phone: enrollment.applicant_phone,
          businessName: enrollment.store_name,
          status: enrollment.status,
          businessType: enrollment.business_type,
          type: 'enrollment'
        })
      }
    })

    const mergedData = Array.from(phoneMap.values())

    return NextResponse.json({
      success: true,
      customers: mergedData.slice(offset, offset + limit),
      pagination: {
        page,
        limit,
        total: mergedData.length,
        totalPages: Math.ceil(mergedData.length / limit)
      }
    })
  } catch (error) {
    console.error('고객 조회 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// POST: 고객 그룹별 전화번호 목록 조회
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()
    const { groupType, filters = {} } = body

    let phoneNumbers: Array<{ phone: string; name: string; customerId?: number; enrollmentId?: number }> = []

    switch (groupType) {
      case 'all_customers':
        // 모든 고객
        const { data: allCustomers } = await supabase
          .from('customers')
          .select('id, name, phone')
          .not('phone', 'is', null)

        phoneNumbers = (allCustomers || []).map(c => ({
          phone: c.phone,
          name: c.name,
          customerId: c.id
        }))
        break

      case 'active_customers':
        // 활성 고객만
        const { data: activeCustomers } = await supabase
          .from('customers')
          .select('id, name, phone')
          .eq('status', 'active')
          .not('phone', 'is', null)

        phoneNumbers = (activeCustomers || []).map(c => ({
          phone: c.phone,
          name: c.name,
          customerId: c.id
        }))
        break

      case 'pending_enrollments':
        // 승인 대기 중인 가입 신청자
        const { data: pendingEnrollments } = await supabase
          .from('enrollment_applications')
          .select('id, applicant_name, applicant_phone')
          .eq('status', 'pending')

        phoneNumbers = (pendingEnrollments || []).map(e => ({
          phone: e.applicant_phone,
          name: e.applicant_name,
          enrollmentId: e.id
        }))
        break

      case 'approved_enrollments':
        // 승인된 가입 신청자
        const { data: approvedEnrollments } = await supabase
          .from('enrollment_applications')
          .select('id, applicant_name, applicant_phone')
          .eq('status', 'approved')

        phoneNumbers = (approvedEnrollments || []).map(e => ({
          phone: e.applicant_phone,
          name: e.applicant_name,
          enrollmentId: e.id
        }))
        break

      case 'business_type':
        // 특정 업종
        if (filters.businessType) {
          const { data: businessCustomers } = await supabase
            .from('customers')
            .select('id, name, phone')
            .eq('business_type', filters.businessType)
            .not('phone', 'is', null)

          phoneNumbers = (businessCustomers || []).map(c => ({
            phone: c.phone,
            name: c.name,
            customerId: c.id
          }))
        }
        break

      case 'custom':
        // 커스텀 필터
        let customQuery = supabase
          .from('customers')
          .select('id, name, phone')

        if (filters.status) {
          customQuery = customQuery.eq('status', filters.status)
        }
        if (filters.businessType) {
          customQuery = customQuery.eq('business_type', filters.businessType)
        }
        if (filters.createdAfter) {
          customQuery = customQuery.gte('created_at', filters.createdAfter)
        }
        if (filters.createdBefore) {
          customQuery = customQuery.lte('created_at', filters.createdBefore)
        }

        const { data: customCustomers } = await customQuery.not('phone', 'is', null)

        phoneNumbers = (customCustomers || []).map(c => ({
          phone: c.phone,
          name: c.name,
          customerId: c.id
        }))
        break

      default:
        return NextResponse.json(
          { error: '올바르지 않은 그룹 타입입니다.' },
          { status: 400 }
        )
    }

    // 중복 제거
    const uniquePhones = Array.from(
      new Map(phoneNumbers.map(item => [item.phone, item])).values()
    )

    return NextResponse.json({
      success: true,
      recipients: uniquePhones,
      total: uniquePhones.length
    })
  } catch (error) {
    console.error('고객 그룹 조회 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}