/**
 * 환경에 따른 올바른 리다이렉트 URL을 반환하는 헬퍼 함수
 */
export function getRedirectUrl(path: string = '') {
  // 클라이언트 사이드에서 실행되는 경우
  if (typeof window !== 'undefined') {
    // 프로덕션 도메인 확인
    if (window.location.hostname === 'careon.ai.kr' || window.location.hostname === 'www.careon.ai.kr') {
      return `https://careon.ai.kr${path}`
    }
    // 개발 환경 또는 기타 환경
    return `${window.location.origin}${path}`
  }

  // 서버 사이드에서 실행되는 경우 (환경변수 사용)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 
                  process.env.NEXT_PUBLIC_SITE_URL || 
                  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)

  // 프로덕션 도메인이면 careon.ai.kr 사용
  if (appUrl && (appUrl.includes('careon.ai.kr') || process.env.NODE_ENV === 'production')) {
    return `https://careon.ai.kr${path}`
  }

  // 개발 환경
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:3000${path}`
  }

  // Vercel Preview 환경
  if (appUrl) {
    return `${appUrl}${path}`
  }

  // 기본값
  return `https://careon.ai.kr${path}`
}

/**
 * 서버 컴포넌트에서 사용할 수 있는 리다이렉트 URL 헬퍼
 */
export function getServerRedirectUrl(request: Request, path: string = '') {
  const url = new URL(request.url)
  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'
  
  // x-forwarded-host가 있으면 우선 사용 (로드밸런서/프록시 환경)
  if (forwardedHost) {
    // careon.ai.kr 도메인 확인
    if (forwardedHost.includes('careon.ai.kr')) {
      return `https://careon.ai.kr${path}`
    }
    return `${forwardedProto}://${forwardedHost}${path}`
  }
  
  // 프로덕션 환경
  if (process.env.NODE_ENV === 'production' || url.hostname.includes('careon.ai.kr')) {
    return `https://careon.ai.kr${path}`
  }
  
  // 개발 환경
  if (process.env.NODE_ENV === 'development') {
    return `${url.origin}${path}`
  }
  
  // 기본값
  return `${url.origin}${path}`
}