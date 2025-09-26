// 뿌리오 API V1 연동 (토큰 방식)

// API 설정
const PPURIO_CONFIG = {
  baseUrl: 'https://message.ppurio.com',
  username: process.env.PPURIO_USERNAME || 'nvr_7464463887',
  apiKey: process.env.PPURIO_API_KEY || 'd55f01a941947acd711702ede3f90b74fdda318a78ed26dbde193cceeb0af4ac',
  senderPhone: process.env.SENDER_PHONE || '01032453385',
}

// 메시지 타입
type MessageType = 'SMS' | 'LMS' | 'MMS'

// 토큰 캐시
let tokenCache: { token: string; expiry: number } | null = null

// 메시지 전송 인터페이스
interface SendMessageParams {
  to: string // 수신번호
  text: string // 메시지 내용
  subject?: string // LMS/MMS 제목
  type?: MessageType // 메시지 타입
}

// 메시지 길이에 따른 타입 자동 판별
function getMessageType(text: string): MessageType {
  const byteLength = Buffer.from(text, 'utf-8').length
  return byteLength <= 90 ? 'SMS' : 'LMS'
}

// Basic Auth 생성 (토큰 발급용)
function getBasicAuth(): string {
  const auth = Buffer.from(`${PPURIO_CONFIG.username}:${PPURIO_CONFIG.apiKey}`).toString('base64')
  return `Basic ${auth}`
}

// 액세스 토큰 발급
async function getAccessToken(): Promise<string | null> {
  try {
    // 캐시된 토큰이 유효한지 확인
    if (tokenCache && tokenCache.expiry > Date.now()) {
      return tokenCache.token
    }

    const response = await fetch(`${PPURIO_CONFIG.baseUrl}/v1/token`, {
      method: 'POST',
      headers: {
        'Authorization': getBasicAuth(),
      },
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('토큰 발급 실패:', error)
      return null
    }

    const data = await response.json()
    
    // 토큰 캐시 (23시간 동안 유효)
    tokenCache = {
      token: data.token,
      expiry: Date.now() + (23 * 60 * 60 * 1000)
    }

    return data.token
  } catch (error) {
    console.error('토큰 발급 오류:', error)
    return null
  }
}

// 메시지 전송 함수
export async function sendSMS({ to, text, subject, type }: SendMessageParams) {
  try {
    // 테스트 모드에서는 콘솔 로그만 출력
    if (process.env.PPURIO_TEST_MODE === 'true') {
      console.log('📱 [테스트모드] SMS 전송 시뮬레이션');
      console.log('수신번호:', to);
      console.log('메시지 내용:', text);
      console.log('---');
      return {
        success: true,
        messageKey: 'dev_' + Date.now(),
        type: type || getMessageType(text),
      }
    }

    // 환경변수 체크
    if (!PPURIO_CONFIG.username || !PPURIO_CONFIG.apiKey || !PPURIO_CONFIG.senderPhone) {
      console.error('뿌리오 API 설정이 누락되었습니다.')
      return { success: false, error: '메시지 서비스 설정 오류' }
    }

    // 토큰 발급
    const token = await getAccessToken()
    if (!token) {
      return { success: false, error: '인증 토큰 발급 실패' }
    }

    // 메시지 타입 자동 결정
    const messageType = type || getMessageType(text)
    
    // 요청 데이터
    const requestData = {
      account: PPURIO_CONFIG.username,
      messageType: messageType,
      content: text,
      from: PPURIO_CONFIG.senderPhone.replace(/-/g, ''), // 하이픈 제거
      duplicateFlag: 'N', // 중복 제거
      targetCount: 1,
      targets: [
        {
          to: to.replace(/-/g, ''), // 하이픈 제거
        }
      ],
      refKey: `careon_${Date.now()}`, // 고유 참조키
      ...(subject && messageType !== 'SMS' ? { subject } : {}),
    }

    // API 호출
    const response = await fetch(`${PPURIO_CONFIG.baseUrl}/v1/message`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })

    const result = await response.json()

    if (response.ok && result.code === '200') {
      console.log('SMS 전송 성공:', result)
      return {
        success: true,
        messageKey: result.messageKey,
        type: messageType,
      }
    } else {
      console.error('뿌리오 API 오류:', result)
      return {
        success: false,
        error: result.description || '메시지 전송 실패',
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