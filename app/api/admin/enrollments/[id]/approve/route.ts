import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const enrollmentId = params.id
    const body = await request.json()

    const { action, notes } = body // action: 'approve' | 'reject'

    // 1. 가입 신청 정보 조회
    const { data: enrollment, error: fetchError } = await supabase
      .from('enrollment_applications')
      .select('*')
      .eq('id', enrollmentId)
      .single()

    if (fetchError || !enrollment) {
      return NextResponse.json(
        { error: '가입 신청을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 2. 이미 처리된 신청인지 확인
    if (enrollment.status === 'approved' || enrollment.status === 'rejected') {
      return NextResponse.json(
        { error: '이미 처리된 신청입니다.' },
        { status: 400 }
      )
    }

    // 3. 필수 서류 확인 (승인의 경우)
    if (action === 'approve') {
      const requiredDocs = [
        'business_registration_url',
        'id_card_front_url',
        'bankbook_url'
      ]

      const missingDocs = requiredDocs.filter(doc => !enrollment[doc])
      if (missingDocs.length > 0) {
        return NextResponse.json(
          {
            error: '필수 서류가 누락되었습니다.',
            missingDocuments: missingDocs
          },
          { status: 400 }
        )
      }
    }

    const now = new Date().toISOString()

    if (action === 'approve') {
      // 4. 승인 처리
      // 4-1. enrollment_applications 상태 업데이트
      const { error: updateError } = await supabase
        .from('enrollment_applications')
        .update({
          status: 'approved',
          reviewed_at: now,
          reviewer_notes: notes,
          updated_at: now
        })
        .eq('id', enrollmentId)

      if (updateError) {
        throw new Error('승인 처리 중 오류가 발생했습니다.')
      }

      // 4-2. customers 테이블에 새 고객 생성 (없는 경우)
      if (enrollment.business_number) {
        // 기존 고객인지 확인
        const { data: existingCustomer } = await supabase
          .from('customers')
          .select('customer_id')
          .eq('business_registration', enrollment.business_number)
          .single()

        if (!existingCustomer) {
          // 새 고객 생성
          const { error: customerError } = await supabase
            .from('customers')
            .insert({
              business_name: enrollment.business_name,
              owner_name: enrollment.representative_name,
              business_registration: enrollment.business_number,
              phone: enrollment.phone_number,
              email: enrollment.email,
              address: enrollment.business_address,
              industry: enrollment.business_category,
              status: 'active',
              care_status: 'onboarding',
              created_at: now
            })

          if (customerError) {
            console.error('Customer creation error:', customerError)
            // 고객 생성 실패는 무시하고 진행 (나중에 수동 처리)
          }
        }
      }

      // 4-3. 카드사 가맹 상태 초기화 (card_company_status 테이블이 있는 경우)
      if (enrollment.card_companies) {
        const cardCompanies = enrollment.card_companies as string[]
        const cardStatusInserts = cardCompanies.map(company => ({
          enrollment_id: enrollmentId,
          company_name: company,
          status: 'pending',
          created_at: now
        }))

        await supabase
          .from('card_company_status')
          .insert(cardStatusInserts)
          .select() // 에러 무시
      }

      // 4-4. 환영 SMS 발송 (옵션)
      if (enrollment.phone_number) {
        // SMS API 호출 (구현 필요)
        try {
          await fetch('/api/sms/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: enrollment.phone_number,
              message: `[케어온] ${enrollment.business_name}님, 가입 신청이 승인되었습니다. 온보딩 프로세스를 시작해주세요.`
            })
          })
        } catch (smsError) {
          console.error('SMS send error:', smsError)
          // SMS 실패는 무시하고 진행
        }
      }

      return NextResponse.json({
        success: true,
        message: '가입 신청이 승인되었습니다.',
        enrollmentId,
        status: 'approved',
        reviewedAt: now
      })

    } else if (action === 'reject') {
      // 5. 거절 처리
      const { error: updateError } = await supabase
        .from('enrollment_applications')
        .update({
          status: 'rejected',
          reviewed_at: now,
          reviewer_notes: notes || '승인 요건을 충족하지 못했습니다.',
          updated_at: now
        })
        .eq('id', enrollmentId)

      if (updateError) {
        throw new Error('거절 처리 중 오류가 발생했습니다.')
      }

      // 거절 알림 SMS
      if (enrollment.phone_number) {
        try {
          await fetch('/api/sms/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: enrollment.phone_number,
              message: `[케어온] ${enrollment.business_name}님, 가입 신청이 반려되었습니다. 자세한 내용은 고객센터로 문의해주세요.`
            })
          })
        } catch (smsError) {
          console.error('SMS send error:', smsError)
        }
      }

      return NextResponse.json({
        success: true,
        message: '가입 신청이 거절되었습니다.',
        enrollmentId,
        status: 'rejected',
        reviewedAt: now
      })

    } else {
      return NextResponse.json(
        { error: '잘못된 액션입니다. (approve 또는 reject)' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Enrollment approval error:', error)
    return NextResponse.json(
      { error: '처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 가입 신청 상태 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const enrollmentId = params.id

    const { data, error } = await supabase
      .from('enrollment_applications')
      .select(`
        *,
        card_company_status (
          company_name,
          status,
          processed_at
        )
      `)
      .eq('id', enrollmentId)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: '가입 신청을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      enrollment: data,
      canApprove: data.status === 'submitted' || data.status === 'reviewing',
      hasRequiredDocuments: !!(
        data.business_registration_url &&
        data.id_card_front_url &&
        data.bankbook_url
      )
    })

  } catch (error) {
    console.error('Enrollment fetch error:', error)
    return NextResponse.json(
      { error: '조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}