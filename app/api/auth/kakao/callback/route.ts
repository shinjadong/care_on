import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface KakaoTokenResponse {
  access_token: string
  token_type: string
  refresh_token: string
  expires_in: number
  scope: string
  refresh_token_expires_in: number
}

interface KakaoUserInfo {
  id: number
  connected_at: string
  properties?: {
    nickname?: string
    profile_image?: string
    thumbnail_image?: string
  }
  kakao_account?: {
    profile_nickname_needs_agreement?: boolean
    profile_image_needs_agreement?: boolean
    profile?: {
      nickname?: string
      thumbnail_image_url?: string
      profile_image_url?: string
      is_default_image?: boolean
    }
    name_needs_agreement?: boolean
    name?: string
    email_needs_agreement?: boolean
    is_email_valid?: boolean
    is_email_verified?: boolean
    email?: string
    age_range_needs_agreement?: boolean
    age_range?: string
    birthyear_needs_agreement?: boolean
    birthyear?: string
    birthday_needs_agreement?: boolean
    birthday?: string
    birthday_type?: string
    gender_needs_agreement?: boolean
    gender?: string
    phone_number_needs_agreement?: boolean
    phone_number?: string
    ci_needs_agreement?: boolean
    ci?: string
    ci_authenticated_at?: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json(
        { error: '인증 코드가 필요합니다.' },
        { status: 400 }
      )
    }

    // 1. 카카오 토큰 요청
    const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID || '',
        redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback/kakao`,
        code,
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      console.error('Kakao token error:', errorData)
      return NextResponse.json(
        { error: '카카오 토큰 요청 실패' },
        { status: 400 }
      )
    }

    const tokenData: KakaoTokenResponse = await tokenResponse.json()

    // 2. 카카오 사용자 정보 요청
    const userInfoResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    })

    if (!userInfoResponse.ok) {
      const errorData = await userInfoResponse.json()
      console.error('Kakao user info error:', errorData)
      return NextResponse.json(
        { error: '사용자 정보 요청 실패' },
        { status: 400 }
      )
    }

    const userInfo: KakaoUserInfo = await userInfoResponse.json()

    // 3. Supabase에 사용자 생성 또는 로그인
    const supabase = await createClient()

    const email = userInfo.kakao_account?.email || `kakao_${userInfo.id}@careon.temp`
    const nickname = userInfo.kakao_account?.profile?.nickname ||
                     userInfo.properties?.nickname ||
                     `사용자${userInfo.id}`
    const profileImage = userInfo.kakao_account?.profile?.profile_image_url ||
                         userInfo.properties?.profile_image

    // 기존 사용자 확인
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('*')
      .eq('kakao_id', userInfo.id.toString())
      .single()

    let customerId: string

    if (existingCustomer) {
      // 기존 사용자 - 로그인
      customerId = existingCustomer.customer_id

      // 토큰 정보 업데이트
      await supabase
        .from('customers')
        .update({
          kakao_access_token: tokenData.access_token,
          kakao_refresh_token: tokenData.refresh_token,
          last_login_at: new Date().toISOString(),
        })
        .eq('customer_id', customerId)
    } else {
      // 신규 사용자 - 회원가입
      const { data: newCustomer, error: insertError } = await supabase
        .from('customers')
        .insert({
          name: nickname,
          email,
          kakao_id: userInfo.id.toString(),
          kakao_access_token: tokenData.access_token,
          kakao_refresh_token: tokenData.refresh_token,
          profile_image_url: profileImage,
          phone_number: userInfo.kakao_account?.phone_number,
          created_at: new Date().toISOString(),
          last_login_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (insertError) {
        console.error('Customer insert error:', insertError)
        return NextResponse.json(
          { error: '사용자 생성 실패' },
          { status: 500 }
        )
      }

      customerId = newCustomer.customer_id
    }

    // 4. 세션 쿠키 생성
    const response = NextResponse.json({
      success: true,
      user: {
        id: customerId,
        name: nickname,
        email,
        profile_image: profileImage,
      },
    })

    // HTTP-only 쿠키로 세션 정보 저장
    response.cookies.set('careon_session', customerId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30일
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Kakao login error:', error)
    return NextResponse.json(
      { error: '로그인 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
