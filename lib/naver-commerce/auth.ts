/**
 * 네이버 커머스API 인증 관련 유틸리티
 *
 * OAuth2 Client Credentials Grant 방식으로 서버 간 인증을 수행합니다.
 * 전자서명을 생성하고 액세스 토큰을 발급받는 기능을 제공합니다.
 */

import bcrypt from 'bcryptjs'

interface NaverCommerceConfig {
  clientId: string
  clientSecret: string
  sellerId?: string
}

interface TokenResponse {
  access_token: string
  expires_in: number
  token_type: string
}

interface NaverCommerceError {
  code: string
  message: string
  timestamp: string
  traceId: string
}

export class NaverCommerceAuth {
  private config: NaverCommerceConfig
  private baseUrl = 'https://api.commerce.naver.com/external'
  private accessToken: string | null = null
  private tokenExpiresAt: number = 0

  constructor(config: NaverCommerceConfig) {
    this.config = config
  }

  /**
   * 전자서명 생성
   * client_id와 timestamp를 bcrypt로 해싱하고 Base64로 인코딩합니다.
   */
  private generateSignature(timestamp: number): string {
    const password = `${this.config.clientId}_${timestamp}`
    const hashed = bcrypt.hashSync(password, this.config.clientSecret)
    return Buffer.from(hashed, 'utf-8').toString('base64')
  }

  /**
   * 액세스 토큰 발급
   * 토큰이 없거나 만료 예정(30분 이내)인 경우 새로 발급합니다.
   */
  async getAccessToken(forceRefresh = false): Promise<string> {
    const now = Date.now()

    // 기존 토큰이 유효한 경우 재사용
    if (!forceRefresh && this.accessToken && this.tokenExpiresAt > now + 30 * 60 * 1000) {
      return this.accessToken
    }

    const timestamp = now
    const signature = this.generateSignature(timestamp)

    const params = new URLSearchParams({
      client_id: this.config.clientId,
      timestamp: timestamp.toString(),
      grant_type: 'client_credentials',
      client_secret_sign: signature,
      type: 'SELF'
    })

    try {
      const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: params.toString()
      })

      if (!response.ok) {
        const error = await response.json() as NaverCommerceError
        throw new Error(`토큰 발급 실패: ${error.message} (${error.code})`)
      }

      const data = await response.json() as TokenResponse

      this.accessToken = data.access_token
      this.tokenExpiresAt = now + data.expires_in * 1000

      return this.accessToken
    } catch (error) {
      console.error('네이버 커머스 토큰 발급 오류:', error)
      throw error
    }
  }

  /**
   * API 요청 헤더 생성
   * Authorization 헤더를 포함한 공통 헤더를 반환합니다.
   */
  async getHeaders(): Promise<Record<string, string>> {
    const token = await this.getAccessToken()
    return {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }

  /**
   * API 요청 래퍼
   * 토큰 만료 시 자동으로 재발급하고 재시도합니다.
   */
  async request<T = any>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = await this.getHeaders()

    let response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers
      }
    })

    // 인증 실패 시 토큰 재발급 후 재시도
    if (response.status === 401) {
      await this.getAccessToken(true) // 강제 갱신
      const newHeaders = await this.getHeaders()

      response = await fetch(`${this.baseUrl}${path}`, {
        ...options,
        headers: {
          ...newHeaders,
          ...options.headers
        }
      })
    }

    if (!response.ok) {
      const error = await response.json() as NaverCommerceError
      throw new Error(`API 요청 실패: ${error.message} (${error.code})`)
    }

    return response.json()
  }
}