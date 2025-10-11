import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/infrastructure/auth/supabase/server'
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

    // Service role key로 verification_codes 테이블 접근
    const supabase = await createClient(true)

    console.log('🔍 인증 코드 검증 시도:', {
      input_phone: phoneNumber,
      clean_phone: cleanPhone,
      phone_length: cleanPhone.length,
      input_code: code,
      current_time: new Date().toISOString(),
    })

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

    console.log('📋 DB 조회 결과:', {
      found: !!verificationData,
      error: fetchError?.message,
      data: verificationData,
    })

    if (fetchError || !verificationData) {
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

    // 사용자 조회 또는 생성 (customers 테이블)
    const { data: existingUser, error: userFetchError } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', cleanPhone)
      .maybeSingle()

    if (userFetchError) {
      console.error('사용자 조회 실패:', userFetchError)
      return NextResponse.json(
        { error: '사용자 정보 조회 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    let userId: string
    let customerCode: string

    if (existingUser) {
      // 기존 사용자
      userId = existingUser.customer_id
      customerCode = existingUser.customer_code
      console.log('✅ 기존 사용자 로그인:', customerCode)
    } else {
      // 신규 사용자 생성 - customer_code 중복 방지 재시도 로직
      let newUser = null
      let createError = null
      const maxRetries = 10

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        // 모든 고객 코드 조회하여 사용 가능한 다음 번호 찾기
        const { data: allCustomers } = await supabase
          .from('customers')
          .select('customer_code')
          .order('customer_code', { ascending: false })

        // 사용 중인 번호들 추출
        const usedNumbers = new Set(
          allCustomers
            ?.filter(c => c.customer_code) // null 체크
            .map(c => parseInt(c.customer_code.replace('CO', '')))
            .filter(n => !isNaN(n)) || []
        )

        // 사용 가능한 다음 번호 찾기
        let nextNumber = 1
        while (usedNumbers.has(nextNumber)) {
          nextNumber++
        }

        const newCustomerCode = `CO${String(nextNumber).padStart(6, '0')}`
        console.log(`🔄 사용자 생성 시도 ${attempt + 1}/${maxRetries}, code: ${newCustomerCode}`)

        // 신규 사용자 생성
        const result = await supabase
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

        if (!result.error) {
          newUser = result.data
          createError = null
          console.log(`✅ 사용자 생성 성공: ${newCustomerCode}`)
          break
        }

        // 중복 코드 에러가 아니면 바로 실패 처리
        if (result.error.code !== '23505') {
          createError = result.error
          console.error(`❌ 사용자 생성 실패 (중복 아님):`, result.error)
          break
        }

        console.log(`⚠️ customer_code 중복, 재시도... (${attempt + 1}/${maxRetries})`)
        // 잠시 대기 후 재시도 (동시성 문제 방지)
        await new Promise(resolve => setTimeout(resolve, 100))
        createError = result.error
      }

      if (createError || !newUser) {
        console.error('사용자 생성 실패:', createError)
        return NextResponse.json(
          { error: '사용자 생성에 실패했습니다. 잠시 후 다시 시도해주세요.' },
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
