import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendSMS } from '@/lib/ppurio/sms-v2'

// 6자리 랜덤 인증 코드 생성
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json()

    // 휴대폰 번호 검증
    if (!phoneNumber || !/^01[0-9]{8,9}$/.test(phoneNumber.replace(/-/g, ''))) {
      return NextResponse.json(
        { error: '올바른 휴대폰 번호를 입력해주세요.' },
        { status: 400 }
      )
    }

    // 하이픈 제거
    const cleanPhone = phoneNumber.replace(/-/g, '')

    // 인증 코드 생성
    const code = generateVerificationCode()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5분 후 만료

    const supabase = await createClient()

    // 기존 미인증 코드 삭제
    await supabase
      .from('verification_codes')
      .delete()
      .eq('phone_number', cleanPhone)
      .eq('verified', false)

    // 새 인증 코드 저장
    const insertData = {
      phone_number: cleanPhone,
      code: code,
      expires_at: expiresAt.toISOString(),
    }
    
    console.log('💾 DB 저장 데이터:', {
      phone_number: cleanPhone,
      phone_length: cleanPhone.length,
      code: code,
      expires_at: expiresAt.toISOString(),
    })
    
    const { error: insertError } = await supabase
      .from('verification_codes')
      .insert(insertData)

    if (insertError) {
      console.error('인증 코드 저장 실패:', insertError)
      return NextResponse.json(
        { error: '인증 코드 생성에 실패했습니다.' },
        { status: 500 }
      )
    }

    // SMS 발송
    const message = `[케어온] 인증번호는 [${code}] 입니다. 5분 이내에 입력해주세요.`

    console.log(`📱 SMS 발송 시도: ${cleanPhone}`)
    console.log(`🔐 인증코드: ${code}`)

    try {
      const smsResult = await sendSMS({
        to: cleanPhone, // 실제 입력한 번호로 발송
        text: message,
        type: 'SMS',
      })

      if (!smsResult.success) {
        console.error('SMS 발송 실패:', smsResult.error)
        // SMS 실패해도 코드는 저장되어 있으므로 개발 중에는 계속 진행
        return NextResponse.json({
          success: true,
          warning: 'SMS 발송 실패 (개발 모드: 콘솔에서 코드 확인)',
          devCode: process.env.NODE_ENV === 'development' ? code : undefined,
        })
      }

      return NextResponse.json({
        success: true,
        message: '인증번호가 발송되었습니다.',
        devCode: process.env.NODE_ENV === 'development' ? code : undefined,
      })
    } catch (smsError) {
      console.error('SMS 발송 오류:', smsError)
      return NextResponse.json({
        success: true,
        warning: 'SMS 발송 오류 (개발 모드: 콘솔에서 코드 확인)',
        devCode: process.env.NODE_ENV === 'development' ? code : undefined,
      })
    }
  } catch (error) {
    console.error('인증 코드 발송 API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
