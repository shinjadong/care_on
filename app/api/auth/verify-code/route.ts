import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, code } = await request.json()

    // 입력값 검증
    if (!phoneNumber || !code) {
      return NextResponse.json(
        { error: '휴대폰 번호와 인증번호를 모두 입력해주세요.' },
        { status: 400 }
      )
    }

    // 하이픈 제거
    const cleanPhone = phoneNumber.replace(/-/g, '')
    const supabase = await createClient()

    // 인증 코드 조회
    const { data: verificationData, error: fetchError } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('phone_number', cleanPhone)
      .eq('code', code)
      .eq('verified', false)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (fetchError || !verificationData) {
      // 시도 횟수 증가
      await supabase
        .from('verification_codes')
        .update({ attempts: supabase.rpc('increment', { amount: 1 }) })
        .eq('phone_number', cleanPhone)
        .eq('verified', false)

      return NextResponse.json(
        { error: '인증번호가 올바르지 않거나 만료되었습니다.' },
        { status: 400 }
      )
    }

    // 시도 횟수 확인 (5회 초과시 차단)
    if (verificationData.attempts >= 5) {
      return NextResponse.json(
        { error: '인증 시도 횟수를 초과했습니다. 새로운 인증번호를 요청해주세요.' },
        { status: 400 }
      )
    }

    // 인증 코드 검증 성공 - verified 업데이트
    const { error: updateError } = await supabase
      .from('verification_codes')
      .update({
        verified: true,
        verified_at: new Date().toISOString(),
      })
      .eq('id', verificationData.id)

    if (updateError) {
      console.error('인증 상태 업데이트 실패:', updateError)
      return NextResponse.json(
        { error: '인증 처리 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    // 사용자 조회 또는 생성
    const { data: existingUser, error: userFetchError } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', cleanPhone)
      .maybeSingle()

    let userId: string
    let customerCode: string

    if (existingUser) {
      // 기존 사용자
      userId = existingUser.customer_id
      customerCode = existingUser.customer_code
    } else {
      // 신규 사용자 생성 - customer_code 자동 생성을 위해 최근 고객 번호 조회
      const { data: lastCustomer } = await supabase
        .from('customers')
        .select('customer_code')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      // 고객 코드 생성 (CO000001, CO000002, ...)
      let newCustomerCode = 'CO000001'
      if (lastCustomer && lastCustomer.customer_code) {
        const lastNumber = parseInt(lastCustomer.customer_code.replace('CO', ''))
        newCustomerCode = `CO${String(lastNumber + 1).padStart(6, '0')}`
      }

      // 신규 사용자 생성
      const { data: newUser, error: createError } = await supabase
        .from('customers')
        .insert({
          customer_code: newCustomerCode,
          phone: cleanPhone,
          business_name: '미설정', // 나중에 매장 설정에서 입력
          owner_name: '미설정', // 나중에 프로필에서 입력
          status: 'active',
          care_status: 'active', // 케어 서비스 활성
          industry: '미분류',
        })
        .select()
        .single()

      if (createError || !newUser) {
        console.error('사용자 생성 실패:', createError)
        return NextResponse.json(
          { error: '사용자 생성에 실패했습니다.' },
          { status: 500 }
        )
      }

      userId = newUser.customer_id
      customerCode = newUser.customer_code
    }

    // 세션 토큰 생성 (간단한 JWT 대신 UUID 사용)
    const sessionToken = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30일

    // 쿠키에 세션 저장
    const cookieStore = await cookies()
    cookieStore.set('careon_session', userId, {
      httpOnly: true,
      secure: false, // 개발 환경에서는 false
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30일
      path: '/',
    })
    
    console.log('🍪 Cookie set for user:', userId)

    return NextResponse.json({
      success: true,
      message: '인증이 완료되었습니다.',
      user: {
        id: userId,
        customerCode: customerCode,
        phone: cleanPhone,
        isNewUser: !existingUser,
      },
      sessionToken,
      expiresAt: expiresAt.toISOString(),
    })
  } catch (error) {
    console.error('인증 코드 검증 API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
