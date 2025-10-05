// 뿌리오 API 설정
const PPURIO_CONFIG = {
  baseUrl: 'https://message.ppurio.com',
  accountId: process.env.PPURIO_USERNAME || '',
  apiKey: process.env.PPURIO_API_KEY || '',
  from: process.env.SENDER_PHONE || '', // 발신번호 (사전 등록 필요)
}

// 메시지 타입
type MessageType = 'SMS' | 'LMS' | 'MMS'

// 메시지 전송 인터페이스
interface SendMessageParams {
  to: string // 수신번호
  text: string // 메시지 내용
  subject?: string // LMS/MMS 제목
  type?: MessageType // 메시지 타입 (자동 판별 가능)
}

// 메시지 길이에 따른 타입 자동 판별
function getMessageType(text: string): MessageType {
  const byteLength = Buffer.from(text, 'utf-8').length
  
  if (byteLength <= 90) {
    return 'SMS' // 90바이트 이하
  } else {
    return 'LMS' // 90바이트 초과
  }
}

// Basic Auth 생성
function getBasicAuth(): string {
  const auth = Buffer.from(`${PPURIO_CONFIG.accountId}:${PPURIO_CONFIG.apiKey}`).toString('base64')
  return `Basic ${auth}`
}

// 메시지 전송 함수
export async function sendSMS({ to, text, subject, type }: SendMessageParams) {
  try {
    // 환경변수 체크
    if (!PPURIO_CONFIG.accountId || !PPURIO_CONFIG.apiKey || !PPURIO_CONFIG.from) {
      console.error('뿌리오 API 설정이 누락되었습니다.')
      return { success: false, error: '메시지 서비스 설정 오류' }
    }

    // 메시지 타입 자동 결정
    const messageType = type || getMessageType(text)
    
    // API 엔드포인트
    const endpoint = `${PPURIO_CONFIG.baseUrl}/v1/message`
    
    // 요청 데이터
    const requestData = {
      account: PPURIO_CONFIG.accountId,
      messageType: messageType,
      from: PPURIO_CONFIG.from,
      to: to.replace(/-/g, ''), // 하이픈 제거
      text: text,
      ...(subject && messageType !== 'SMS' ? { subject } : {}),
      refKey: `careon_${Date.now()}`, // 고유 참조키
    }

    // API 호출
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': getBasicAuth(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })

    const result = await response.json()

    if (response.ok && result.success) {
      return {
        success: true,
        messageId: result.messageId,
        type: messageType,
      }
    } else {
      console.error('뿌리오 API 오류:', result)
      return {
        success: false,
        error: result.message || '메시지 전송 실패',
      }
    }
  } catch (error) {
    console.error('SMS 전송 오류:', error)
    return {
      success: false,
      error: '메시지 전송 중 오류가 발생했습니다.',
    }
  }
}

// 케어온 신청 완료 메시지 템플릿
export function getApplicationCompleteMessage(name: string, businessType?: string): string {
  return `[케어온]
${name}님, 스타트케어 신청이 완료되었습니다.

담당자가 곧 연락드릴 예정입니다.
${businessType ? `업종: ${businessType}` : ''}

문의: 1866-1845`
}

// 상담 예약 메시지 템플릿
export function getConsultationScheduleMessage(
  name: string, 
  date: string, 
  time: string
): string {
  return `[케어온]
${name}님, 상담 일정이 확정되었습니다.

날짜: ${date}
시간: ${time}

상담 전 궁금하신 사항은 1866-1845로 문의 바랍니다.`
}