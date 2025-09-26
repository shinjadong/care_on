import { NextRequest, NextResponse } from 'next/server'
import {
  sendAlimtalk,
  sendEnrollmentCompleteAlimtalk,
  sendApprovalCompleteAlimtalk,
  sendCustomerNoticeAlimtalk,
  ALIMTALK_TEMPLATES
} from '@/lib/ppurio/kakao-alimtalk'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      type, // 'custom' | 'enrollment' | 'approval' | 'notice'
      to,
      templateCode,
      variables,
      // 특정 타입용 파라미터
      name,
      businessType,
      storeName,
      content,
      managerName,
    } = body

    // 입력값 검증
    if (!to) {
      return NextResponse.json(
        { error: '수신번호가 필요합니다.' },
        { status: 400 }
      )
    }

    let result

    switch (type) {
      case 'enrollment':
        // 가입 완료 알림톡
        if (!name || !businessType) {
          return NextResponse.json(
            { error: '이름과 업종 정보가 필요합니다.' },
            { status: 400 }
          )
        }
        const applicationDate = new Date().toLocaleString('ko-KR')
        result = await sendEnrollmentCompleteAlimtalk(to, name, businessType, applicationDate)
        break

      case 'approval':
        // 승인 완료 알림톡
        if (!name || !storeName) {
          return NextResponse.json(
            { error: '이름과 가맹점명이 필요합니다.' },
            { status: 400 }
          )
        }
        const approvalDate = new Date().toLocaleString('ko-KR')
        result = await sendApprovalCompleteAlimtalk(to, name, storeName, approvalDate, managerName)
        break

      case 'notice':
        // 고객 공지 알림톡
        if (!content) {
          return NextResponse.json(
            { error: '공지 내용이 필요합니다.' },
            { status: 400 }
          )
        }
        result = await sendCustomerNoticeAlimtalk(to, content, name)
        break

      case 'custom':
      default:
        // 커스텀 템플릿 발송
        if (!templateCode) {
          return NextResponse.json(
            { error: '템플릿 코드가 필요합니다.' },
            { status: 400 }
          )
        }
        result = await sendAlimtalk({
          to,
          templateCode,
          variables: variables || {},
        })
        break
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageKey: result.messageKey,
        refKey: result.refKey,
        type: result.type,
      })
    } else {
      console.error('알림톡 전송 실패:', result.error)
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          code: result.code,
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('알림톡 API 오류:', error)
    return NextResponse.json(
      {
        success: false,
        error: '알림톡 서비스 오류가 발생했습니다.',
      },
      { status: 500 }
    )
  }
}

// 템플릿 목록 조회 API
export async function GET(request: NextRequest) {
  try {
    // 사용 가능한 템플릿 목록 반환
    const templates = Object.entries(ALIMTALK_TEMPLATES).map(([key, template]) => ({
      key,
      code: template.code,
      name: template.name,
      content: template.content,
    }))

    return NextResponse.json({
      success: true,
      templates,
    })
  } catch (error) {
    console.error('템플릿 조회 오류:', error)
    return NextResponse.json(
      {
        success: false,
        error: '템플릿 조회 중 오류가 발생했습니다.',
      },
      { status: 500 }
    )
  }
}