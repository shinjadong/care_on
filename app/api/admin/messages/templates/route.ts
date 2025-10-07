import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET: 메시지 템플릿 목록 조회
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    const messageType = searchParams.get('type')
    const category = searchParams.get('category')
    const isActive = searchParams.get('active')

    let query = supabase
      .from('message_templates')
      .select('*')
      .order('created_at', { ascending: false })

    if (messageType) {
      query = query.eq('message_type', messageType)
    }
    if (category) {
      query = query.eq('category', category)
    }
    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true')
    }

    const { data, error } = await query

    if (error) {
      console.error('템플릿 조회 오류:', error)
      return NextResponse.json(
        { error: '템플릿 조회에 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      templates: data || []
    })
  } catch (error) {
    console.error('템플릿 조회 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// POST: 새 템플릿 생성
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const {
      name,
      code,
      message_type,
      category,
      title,
      content,
      variables,
      is_active = true,
      created_by = 'admin'
    } = body

    // 필수 필드 검증
    if (!name || !message_type || !content) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // 코드 중복 확인
    if (code) {
      const { data: existing } = await supabase
        .from('message_templates')
        .select('id')
        .eq('code', code)
        .single()

      if (existing) {
        return NextResponse.json(
          { error: '이미 존재하는 템플릿 코드입니다.' },
          { status: 400 }
        )
      }
    }

    // 템플릿 생성
    const { data, error } = await supabase
      .from('message_templates')
      .insert({
        name,
        code,
        message_type,
        category,
        title,
        content,
        variables,
        is_active,
        created_by,
        approval_status: 'pending'
      })
      .select()
      .single()

    if (error) {
      console.error('템플릿 생성 오류:', error)
      return NextResponse.json(
        { error: '템플릿 생성에 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      template: data
    })
  } catch (error) {
    console.error('템플릿 생성 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// PUT: 템플릿 수정
export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const {
      id,
      name,
      code,
      message_type,
      category,
      title,
      content,
      variables,
      is_active,
      approval_status
    } = body

    if (!id) {
      return NextResponse.json(
        { error: '템플릿 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // 업데이트할 필드만 포함
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (code !== undefined) updateData.code = code
    if (message_type !== undefined) updateData.message_type = message_type
    if (category !== undefined) updateData.category = category
    if (title !== undefined) updateData.title = title
    if (content !== undefined) updateData.content = content
    if (variables !== undefined) updateData.variables = variables
    if (is_active !== undefined) updateData.is_active = is_active
    if (approval_status !== undefined) {
      updateData.approval_status = approval_status
      if (approval_status === 'approved') {
        updateData.approval_date = new Date().toISOString()
      }
    }

    const { data, error } = await supabase
      .from('message_templates')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('템플릿 수정 오류:', error)
      return NextResponse.json(
        { error: '템플릿 수정에 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      template: data
    })
  } catch (error) {
    console.error('템플릿 수정 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// DELETE: 템플릿 삭제
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: '템플릿 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // 사용 중인지 확인
    const { data: usageCheck } = await supabase
      .from('message_batch_jobs')
      .select('id')
      .eq('template_id', id)
      .limit(1)
      .single()

    if (usageCheck) {
      return NextResponse.json(
        { error: '사용 중인 템플릿은 삭제할 수 없습니다. 비활성화를 사용하세요.' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('message_templates')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('템플릿 삭제 오류:', error)
      return NextResponse.json(
        { error: '템플릿 삭제에 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '템플릿이 삭제되었습니다.'
    })
  } catch (error) {
    console.error('템플릿 삭제 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
