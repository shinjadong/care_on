import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET: 메시지 발송 이력 조회
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    // 쿼리 파라미터
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const messageType = searchParams.get('type')
    const status = searchParams.get('status')
    const phone = searchParams.get('phone')
    const customerId = searchParams.get('customerId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const offset = (page - 1) * limit

    // 기본 쿼리 생성
    let query = supabase
      .from('message_history')
      .select(`
        *,
        customer:customers(id, name, phone, business_name),
        enrollment:enrollment_applications(id, applicant_name, store_name)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // 필터 적용
    if (messageType) {
      query = query.eq('message_type', messageType)
    }
    if (status) {
      query = query.eq('status', status)
    }
    if (phone) {
      query = query.ilike('recipient_phone', `%${phone}%`)
    }
    if (customerId) {
      query = query.eq('customer_id', customerId)
    }
    if (startDate) {
      query = query.gte('created_at', startDate)
    }
    if (endDate) {
      query = query.lte('created_at', endDate)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('메시지 이력 조회 오류:', error)
      return NextResponse.json(
        { error: '메시지 이력 조회에 실패했습니다.' },
        { status: 500 }
      )
    }

    // 통계 정보 조회
    const { data: stats } = await supabase
      .from('message_history')
      .select('status')
      .then(result => {
        const data = result.data || []
        return {
          data: {
            total: data.length,
            sent: data.filter(m => m.status === 'sent').length,
            delivered: data.filter(m => m.status === 'delivered').length,
            failed: data.filter(m => m.status === 'failed').length,
          }
        }
      })

    return NextResponse.json({
      success: true,
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      },
      stats
    })
  } catch (error) {
    console.error('메시지 이력 조회 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// POST: 메시지 발송 이력 저장
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const {
      message_type,
      recipient_phone,
      recipient_name,
      customer_id,
      enrollment_id,
      sender_type = 'admin',
      sender_id,
      template_code,
      message_content,
      variables,
      status = 'sent',
      message_key,
      ref_key,
      sent_at = new Date().toISOString(),
      metadata
    } = body

    // 필수 필드 검증
    if (!message_type || !recipient_phone || !message_content) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // 메시지 이력 저장
    const { data, error } = await supabase
      .from('message_history')
      .insert({
        message_type,
        recipient_phone,
        recipient_name,
        customer_id,
        enrollment_id,
        sender_type,
        sender_id,
        template_code,
        message_content,
        variables,
        status,
        message_key,
        ref_key,
        sent_at,
        metadata
      })
      .select()
      .single()

    if (error) {
      console.error('메시지 이력 저장 오류:', error)
      return NextResponse.json(
        { error: '메시지 이력 저장에 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('메시지 이력 저장 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// PATCH: 메시지 상태 업데이트
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()
    const { id, status, error_message, delivered_at, read_at } = body

    if (!id || !status) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // 업데이트할 필드
    const updateData: any = { status }
    if (error_message) updateData.error_message = error_message
    if (delivered_at) updateData.delivered_at = delivered_at
    if (read_at) updateData.read_at = read_at

    const { data, error } = await supabase
      .from('message_history')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('메시지 상태 업데이트 오류:', error)
      return NextResponse.json(
        { error: '메시지 상태 업데이트에 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('메시지 상태 업데이트 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}