import { NextRequest, NextResponse } from 'next/server'
import { sendSMS, getApplicationCompleteMessage } from '@/lib/ppurio/sms-v2'

// 업종 코드를 텍스트로 변환
const businessTypeMap: { [key: number]: string } = {
  1: '요식업',
  2: '카페/베이커리',
  3: '미용/뷰티',
  4: '의료/병원',
  5: '학원/교육',
  6: '소매/판매',
  7: '사무실',
  8: '헬스/운동',
  9: '숙박업',
  10: '기타',
}

export async function POST(request: NextRequest) {
  try {
    const { name, phoneNumber, businessType } = await request.json()

    // 입력값 검증
    if (!name || !phoneNumber) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // 업종 텍스트 변환
    const businessTypeText = businessType ? businessTypeMap[businessType] || '기타' : ''

    // 메시지 생성
    const message = getApplicationCompleteMessage(name, businessTypeText)

    // SMS 전송
    const result = await sendSMS({
      to: phoneNumber,
      text: message,
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        type: result.type,
      })
    } else {
      // SMS 실패해도 신청은 성공으로 처리 (로그만 남김)
      console.error('SMS 전송 실패:', result.error)
      return NextResponse.json({
        success: true,
        warning: 'SMS 전송 실패 (신청은 완료됨)',
      })
    }
  } catch (error) {
    console.error('SMS API 오류:', error)
    // SMS 실패해도 신청은 성공으로 처리
    return NextResponse.json({
      success: true,
      warning: 'SMS 서비스 오류 (신청은 완료됨)',
    })
  }
}