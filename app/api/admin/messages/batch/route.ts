import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET: 대량 발송 작업 목록 조회
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const offset = (page - 1) * limit

    let query = supabase
      .from('message_batch_jobs')
      .select(`
        *,
        template:message_templates(id, name, content)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('대량 발송 작업 조회 오류:', error)
      return NextResponse.json(
        { error: '대량 발송 작업 조회에 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('대량 발송 작업 조회 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// POST: 대량 발송 작업 생성 및 실행
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const {
      job_name,
      message_type,
      template_id,
      content,
      variables,
      recipients, // Array of { phone, name, customerId, variables }
      scheduled_at,
      sender_id = 'admin'
    } = body

    // 필수 필드 검증
    if (!message_type || !recipients || recipients.length === 0) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      )
    }

    if (!content && !template_id) {
      return NextResponse.json(
        { error: '메시지 내용 또는 템플릿이 필요합니다.' },
        { status: 400 }
      )
    }

    // 템플릿 조회 (필요한 경우)
    let templateData = null
    if (template_id) {
      const { data: template } = await supabase
        .from('message_templates')
        .select('*')
        .eq('id', template_id)
        .single()

      templateData = template
    }

    // 대량 발송 작업 생성
    const { data: batchJob, error: jobError } = await supabase
      .from('message_batch_jobs')
      .insert({
        job_name: job_name || `대량 ${message_type} 발송`,
        message_type,
        template_id,
        content: content || templateData?.content,
        variables,
        total_recipients: recipients.length,
        status: scheduled_at ? 'pending' : 'processing',
        scheduled_at,
        started_at: !scheduled_at ? new Date().toISOString() : null,
        created_by: sender_id
      })
      .select()
      .single()

    if (jobError) {
      console.error('대량 발송 작업 생성 오류:', jobError)
      return NextResponse.json(
        { error: '대량 발송 작업 생성에 실패했습니다.' },
        { status: 500 }
      )
    }

    // 수신자 목록 생성
    const recipientData = recipients.map((r: any) => ({
      batch_job_id: batchJob.id,
      recipient_phone: r.phone,
      recipient_name: r.name,
      customer_id: r.customerId,
      variables: r.variables || variables,
      status: 'pending'
    }))

    const { error: recipientError } = await supabase
      .from('message_batch_recipients')
      .insert(recipientData)

    if (recipientError) {
      console.error('수신자 목록 생성 오류:', recipientError)
      // 작업 실패 처리
      await supabase
        .from('message_batch_jobs')
        .update({ status: 'failed' })
        .eq('id', batchJob.id)

      return NextResponse.json(
        { error: '수신자 목록 생성에 실패했습니다.' },
        { status: 500 }
      )
    }

    // 즉시 발송인 경우 처리
    if (!scheduled_at) {
      // 여기서 실제 발송 로직 호출
      // processMessageBatch(batchJob.id)를 백그라운드에서 실행
      // 또는 Edge Function / Worker를 통해 처리
    }

    return NextResponse.json({
      success: true,
      data: {
        jobId: batchJob.id,
        status: batchJob.status,
        totalRecipients: recipients.length,
        scheduledAt: scheduled_at
      }
    })
  } catch (error) {
    console.error('대량 발송 작업 생성 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// DELETE: 대량 발송 작업 취소
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('id')

    if (!jobId) {
      return NextResponse.json(
        { error: '작업 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // 작업 상태 확인
    const { data: job } = await supabase
      .from('message_batch_jobs')
      .select('status')
      .eq('id', jobId)
      .single()

    if (!job) {
      return NextResponse.json(
        { error: '작업을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    if (job.status === 'completed') {
      return NextResponse.json(
        { error: '이미 완료된 작업은 취소할 수 없습니다.' },
        { status: 400 }
      )
    }

    // 작업 취소
    const { error } = await supabase
      .from('message_batch_jobs')
      .update({
        status: 'cancelled',
        completed_at: new Date().toISOString()
      })
      .eq('id', jobId)

    if (error) {
      console.error('작업 취소 오류:', error)
      return NextResponse.json(
        { error: '작업 취소에 실패했습니다.' },
        { status: 500 }
      )
    }

    // 미발송 수신자 상태 업데이트
    await supabase
      .from('message_batch_recipients')
      .update({ status: 'failed', error_message: '작업 취소됨' })
      .eq('batch_job_id', jobId)
      .eq('status', 'pending')

    return NextResponse.json({
      success: true,
      message: '작업이 취소되었습니다.'
    })
  } catch (error) {
    console.error('작업 취소 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
