// 뿌리오 카카오 알림톡 API V1 연동

// API 설정 (기존 SMS 설정 재사용)
const PPURIO_CONFIG = {
  baseUrl: 'https://message.ppurio.com',
  username: process.env.PPURIO_USERNAME || 'nvr_7464463887',
  apiKey: process.env.PPURIO_API_KEY || 'd55f01a941947acd711702ede3f90b74fdda318a78ed26dbde193cceeb0af4ac',
  senderProfile: process.env.PPURIO_SENDER_PROFILE || '', // 발신프로필명 (예: @company)
}

// 메시지 타입
type AlimtalkMessageType = 'ALT' | 'ALL' | 'ALH' | 'ALI'
// ALT: 알림톡(텍스트)
// ALL: 알림톡(리스트)
// ALH: 알림톡(하이라이트)
// ALI: 알림톡(이미지)

// 토큰 캐시 (SMS와 공유 가능)
let tokenCache: { token: string; expiry: number } | null = null

// 알림톡 발송 파라미터
interface SendAlimtalkParams {
  to: string | string[] // 수신번호 (단일 또는 다중)
  templateCode: string // 승인된 템플릿 코드
  variables?: Record<string, string> // 템플릿 변수
  senderProfile?: string // 발신프로필 (옵션)
  messageType?: AlimtalkMessageType // 메시지 타입
  sendTime?: string // 예약 발송 시간
  isResend?: boolean // 실패 시 SMS 대체발송 여부
  resendContent?: string // 대체발송 문자 내용
}

// 알림톡 템플릿 (사전 승인 필요)
export const ALIMTALK_TEMPLATES = {
  // 가입 완료 템플릿
  ENROLLMENT_COMPLETE: {
    code: 'careon_enrollment_001', // 실제 승인된 템플릿 코드로 변경 필요
    name: '가입신청완료',
    content: `[케어온] 가입 신청 완료

안녕하세요, #{이름}님!
케어온 가맹점 가입 신청이 정상적으로 접수되었습니다.

▶ 신청업종: #{업종}
▶ 신청일시: #{신청일시}
▶ 처리상태: 검토중

담당자가 영업일 기준 1-2일 내에 연락드릴 예정입니다.

문의: 1866-1845`,
  },

  // 승인 완료 템플릿
  APPROVAL_COMPLETE: {
    code: 'careon_approval_001', // 실제 승인된 템플릿 코드로 변경 필요
    name: '가입승인완료',
    content: `[케어온] 가맹점 승인 완료

안녕하세요, #{이름}님!
축하합니다! 케어온 가맹점 가입이 승인되었습니다.

▶ 가맹점명: #{가맹점명}
▶ 승인일시: #{승인일시}
▶ 담당자: #{담당자명}

서비스 이용 안내를 위해 담당자가 곧 연락드리겠습니다.

케어온 관리자 페이지: https://careon.co.kr/admin
문의: 1866-1845`,
  },

  // 고객 알림 템플릿
  CUSTOMER_NOTICE: {
    code: 'careon_notice_001', // 실제 승인된 템플릿 코드로 변경 필요
    name: '고객공지',
    content: `[케어온] 공지사항

안녕하세요, #{이름}님!

#{내용}

자세한 사항은 케어온 앱에서 확인해주세요.

문의: 1866-1845`,
  },
}

// Basic Auth 생성 (토큰 발급용)
function getBasicAuth(): string {
  const auth = Buffer.from(`${PPURIO_CONFIG.username}:${PPURIO_CONFIG.apiKey}`).toString('base64')
  return `Basic ${auth}`
}

// 액세스 토큰 발급 (SMS와 동일한 로직)
export async function getAccessToken(): Promise<string | null> {
  try {
    // 캐시된 토큰이 유효한지 확인
    if (tokenCache && tokenCache.expiry > Date.now()) {
      return tokenCache.token
    }

    const response = await fetch(`${PPURIO_CONFIG.baseUrl}/v1/token`, {
      method: 'POST',
      headers: {
        'Authorization': getBasicAuth(),
        'accept': 'application/json',
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

    console.log('알림톡 토큰 발급 성공')
    return data.token
  } catch (error) {
    console.error('토큰 발급 오류:', error)
    return null
  }
}

// 카카오 알림톡 발송
export async function sendAlimtalk({
  to,
  templateCode,
  variables = {},
  senderProfile,
  messageType = 'ALT',
  sendTime,
  isResend = true,
  resendContent,
}: SendAlimtalkParams) {
  try {
    // 개발 환경에서는 콘솔 로그만 출력
    if (process.env.PPURIO_TEST_MODE === 'true') {
      console.log('📱 [개발모드] 카카오 알림톡 전송 시뮬레이션')
      console.log('수신번호:', to)
      console.log('템플릿코드:', templateCode)
      console.log('변수:', variables)
      console.log('---')
      return {
        success: true,
        messageKey: 'dev_kakao_' + Date.now(),
        type: messageType,
      }
    }

    // 환경변수 체크
    if (!PPURIO_CONFIG.username || !PPURIO_CONFIG.apiKey) {
      console.error('뿌리오 API 설정이 누락되었습니다.')
      return { success: false, error: '메시지 서비스 설정 오류' }
    }

    // 발신프로필 설정
    const profile = senderProfile || PPURIO_CONFIG.senderProfile
    if (!profile) {
      console.error('발신프로필이 설정되지 않았습니다.')
      return { success: false, error: '발신프로필 설정 필요' }
    }

    // 토큰 발급
    const token = await getAccessToken()
    if (!token) {
      return { success: false, error: '인증 토큰 발급 실패' }
    }

    // 수신번호 배열로 변환
    const recipients = Array.isArray(to) ? to : [to]

    // 수신자 목록 생성
    const targets = recipients.map(phoneNumber => ({
      to: phoneNumber.replace(/-/g, ''), // 하이픈 제거
      changeWord: {
        var1: variables.var1 || '',
        var2: variables.var2 || '',
        var3: variables.var3 || '',
        var4: variables.var4 || '',
        var5: variables.var5 || '',
        var6: variables.var6 || '',
        var7: variables.var7 || '',
      },
      name: variables.name || variables.이름 || '', // 이름은 특별 처리
    }))

    // 요청 데이터
    const requestData = {
      account: PPURIO_CONFIG.username,
      messageType: messageType,
      senderProfile: profile,
      templateCode: templateCode,
      duplicateFlag: 'N', // 중복 제거
      isResend: isResend ? 'Y' : 'N', // 대체발송 여부
      targetCount: targets.length,
      targets: targets,
      refKey: `careon_kakao_${Date.now()}`, // 고유 참조키
      ...(sendTime ? { sendTime } : {}),
      ...(isResend && resendContent ? {
        resend: {
          messageType: 'LMS',
          content: resendContent,
          from: '01032453385', // 대체발송 발신번호
        }
      } : {}),
    }

    console.log('알림톡 발송 요청:', JSON.stringify(requestData, null, 2))

    // API 호출
    const response = await fetch(`${PPURIO_CONFIG.baseUrl}/v1/kakao`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(requestData),
    })

    const result = await response.json()

    if (response.ok && result.code === 1000) {
      console.log('알림톡 전송 성공:', result)
      return {
        success: true,
        messageKey: result.messageKey || result.messsageKey, // typo 대응
        refKey: result.refKey,
        type: messageType,
      }
    } else {
      console.error('뿌리오 알림톡 API 오류:', result)
      return {
        success: false,
        error: result.description || '알림톡 전송 실패',
        code: result.code,
      }
    }
  } catch (error) {
    console.error('알림톡 전송 오류:', error)
    return {
      success: false,
      error: '알림톡 전송 중 오류가 발생했습니다.',
    }
  }
}

// 가입 완료 알림톡 발송 헬퍼 함수
export async function sendEnrollmentCompleteAlimtalk(
  phoneNumber: string,
  name: string,
  businessType: string,
  applicationDate: string
) {
  return await sendAlimtalk({
    to: phoneNumber,
    templateCode: ALIMTALK_TEMPLATES.ENROLLMENT_COMPLETE.code,
    variables: {
      이름: name,
      업종: businessType,
      신청일시: applicationDate,
    },
    isResend: true,
    resendContent: `[케어온]
${name}님, 케어온 가맹점 가입 신청이 완료되었습니다.
업종: ${businessType}
신청일시: ${applicationDate}
담당자가 곧 연락드릴 예정입니다.
문의: 1866-1845`,
  })
}

// 승인 완료 알림톡 발송 헬퍼 함수
export async function sendApprovalCompleteAlimtalk(
  phoneNumber: string,
  name: string,
  storeName: string,
  approvalDate: string,
  managerName: string = '케어온 담당자'
) {
  return await sendAlimtalk({
    to: phoneNumber,
    templateCode: ALIMTALK_TEMPLATES.APPROVAL_COMPLETE.code,
    variables: {
      이름: name,
      가맹점명: storeName,
      승인일시: approvalDate,
      담당자명: managerName,
    },
    isResend: true,
    resendContent: `[케어온]
${name}님, 축하합니다!
케어온 가맹점 가입이 승인되었습니다.
가맹점명: ${storeName}
승인일시: ${approvalDate}
담당자가 곧 연락드리겠습니다.
문의: 1866-1845`,
  })
}

// 고객 공지 알림톡 발송 헬퍼 함수
export async function sendCustomerNoticeAlimtalk(
  phoneNumbers: string | string[],
  content: string,
  customerName?: string
) {
  return await sendAlimtalk({
    to: phoneNumbers,
    templateCode: ALIMTALK_TEMPLATES.CUSTOMER_NOTICE.code,
    variables: {
      이름: customerName || '고객',
      내용: content,
    },
    isResend: false, // 공지사항은 대체발송 안함
  })
}
