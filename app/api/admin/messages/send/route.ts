import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendSMS } from '@/lib/ppurio/sms-v2'
import {
  sendAlimtalk,
  sendEnrollmentCompleteAlimtalk,
  sendApprovalCompleteAlimtalk,
  sendCustomerNoticeAlimtalk,
} from '@/lib/ppurio/kakao-alimtalk'

// 통합 메시지 발송 API
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const {
      messageType, // SMS, LMS, ALIMTALK
      recipients, // 단일 또는 배열 [{phone, name, customerId, enrollmentId, variables}]
      templateType, // 알림톡용: enrollment, approval, notice, custom
      templateCode, // 커스텀 템플릿 코드
      content, // 메시지 내용
      variables, // 템플릿 변수
      saveHistory = true, // 이력 저장 여부
      batchJobId, // 대량 발송 작업 ID
      senderId = 'admin' // 발송자 ID
    } = body

    // 수신자 배열 정규화
    const recipientList = Array.isArray(recipients) ? recipients : [recipients]

    if (recipientList.length === 0) {
      return NextResponse.json(
        { error: '수신자가 없습니다.' },
        { status: 400 }
      )
    }

    const results = {
      success: [],
      failed: [],
      total: recipientList.length
    }

    // 각 수신자에게 발송
    for (const recipient of recipientList) {
      try {
        let sendResult: any = null
        let finalContent = content
        let finalVariables = { ...variables, ...recipient.variables }

        // 메시지 타입별 처리
        if (messageType === 'ALIMTALK') {
          // 알림톡 발송
          switch (templateType) {
            case 'enrollment':
              const applicationDate = new Date().toLocaleString('ko-KR')
              sendResult = await sendEnrollmentCompleteAlimtalk(
                recipient.phone,
                recipient.name || finalVariables.이름 || '',
                finalVariables.업종 || '',
                applicationDate
              )
              finalContent = `[케어온] 가입 신청 완료\n\n안녕하세요, ${recipient.name}님!\n케어온 가맹점 가입 신청이 정상적으로 접수되었습니다.`
              break

            case 'approval':
              const approvalDate = new Date().toLocaleString('ko-KR')
              sendResult = await sendApprovalCompleteAlimtalk(
                recipient.phone,
                recipient.name || finalVariables.이름 || '',
                finalVariables.가맹점명 || '',
                approvalDate,
                finalVariables.담당자명 || '케어온 담당자'
              )
              finalContent = `[케어온] 가맹점 승인 완료\n\n안녕하세요, ${recipient.name}님!\n축하합니다! 케어온 가맹점 가입이 승인되었습니다.`
              break

            case 'notice':
              sendResult = await sendCustomerNoticeAlimtalk(
                recipient.phone,
                finalContent || finalVariables.내용 || '',
                recipient.name || finalVariables.이름
              )
              finalContent = `[케어온] 공지사항\n\n${finalContent}`
              break

            case 'custom':
              if (!templateCode) {
                throw new Error('템플릿 코드가 필요합니다.')
              }
              sendResult = await sendAlimtalk({
                to: recipient.phone,
                templateCode,
                variables: finalVariables
              })
              break

            default:
              throw new Error('올바르지 않은 템플릿 타입입니다.')
          }
        } else {
          // SMS/LMS 발송
          sendResult = await sendSMS({
            to: recipient.phone,
            text: finalContent,
            type: messageType === 'LMS' ? 'LMS' : 'SMS'
          })
        }

        // 성공 처리
        if (sendResult.success) {
          results.success.push({
            phone: recipient.phone,
            messageKey: sendResult.messageKey || sendResult.refKey
          })

          // 메시지 이력 저장
          if (saveHistory) {
            await supabase
              .from('message_history')
              .insert({
                message_type: messageType,
                recipient_phone: recipient.phone,
                recipient_name: recipient.name,
                customer_id: recipient.customerId,
                enrollment_id: recipient.enrollmentId,
                sender_type: 'admin',
                sender_id: senderId,
                template_code: templateCode,
                message_content: finalContent,
                variables: finalVariables,
                status: 'sent',
                message_key: sendResult.messageKey,
                ref_key: sendResult.refKey,
                sent_at: new Date().toISOString(),
                metadata: { batchJobId }
              })

            // 대량 발송 수신자 상태 업데이트
            if (batchJobId && recipient.batchRecipientId) {
              await supabase
                .from('message_batch_recipients')
                .update({
                  status: 'sent',
                  sent_at: new Date().toISOString()
                })
                .eq('id', recipient.batchRecipientId)
            }
          }
        } else {
          throw new Error(sendResult.error || '발송 실패')
        }
      } catch (error: any) {
        // 실패 처리
        results.failed.push({
          phone: recipient.phone,
          error: error.message
        })

        // 실패 이력 저장
        if (saveHistory) {
          await supabase
            .from('message_history')
            .insert({
              message_type: messageType,
              recipient_phone: recipient.phone,
              recipient_name: recipient.name,
              customer_id: recipient.customerId,
              enrollment_id: recipient.enrollmentId,
              sender_type: 'admin',
              sender_id: senderId,
              template_code: templateCode,
              message_content: content,
              variables: { ...variables, ...recipient.variables },
              status: 'failed',
              error_message: error.message,
              metadata: { batchJobId }
            })

          // 대량 발송 수신자 상태 업데이트
          if (batchJobId && recipient.batchRecipientId) {
            await supabase
              .from('message_batch_recipients')
              .update({
                status: 'failed',
                error_message: error.message
              })
              .eq('id', recipient.batchRecipientId)
          }
        }
      }
    }

    // 대량 발송 작업 상태 업데이트
    if (batchJobId) {
      await supabase
        .from('message_batch_jobs')
        .update({
          sent_count: results.success.length,
          failed_count: results.failed.length,
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', batchJobId)
    }

    return NextResponse.json({
      success: true,
      results: {
        total: results.total,
        successCount: results.success.length,
        failedCount: results.failed.length,
        success: results.success,
        failed: results.failed
      }
    })
  } catch (error) {
    console.error('메시지 발송 오류:', error)
    return NextResponse.json(
      { error: '메시지 발송 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}