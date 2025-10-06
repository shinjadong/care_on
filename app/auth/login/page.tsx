'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const redirectUrl = searchParams.get('redirect') || '/store-setup'

  const handleKakaoLogin = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // 카카오 OAuth URL 구성
      const kakaoAuthUrl = new URL('https://kauth.kakao.com/oauth/authorize')
      kakaoAuthUrl.searchParams.append('client_id', process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID || '')
      kakaoAuthUrl.searchParams.append('redirect_uri', `${window.location.origin}/auth/callback/kakao`)
      kakaoAuthUrl.searchParams.append('response_type', 'code')
      kakaoAuthUrl.searchParams.append('state', redirectUrl)

      // 카카오 로그인 페이지로 이동
      window.location.href = kakaoAuthUrl.toString()
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.')
      setIsLoading(false)
      console.error('Kakao login error:', err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#148777] via-cyan-500 to-teal-400 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-[#148777] rounded-full flex items-center justify-center">
              <span className="text-white text-3xl font-bold">CO</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-[#148777]">
            케어온에 오신 것을 환영합니다
          </CardTitle>
          <CardDescription className="text-base">
            카카오톡으로 간편하게 시작하세요
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleKakaoLogin}
            disabled={isLoading}
            className="w-full h-12 bg-[#FEE500] hover:bg-[#FDD835] text-[#000000] font-semibold text-base flex items-center justify-center gap-2 rounded-xl transition-all duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>로그인 중...</span>
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 3C6.486 3 2 6.582 2 11c0 2.605 1.55 4.93 3.934 6.441l-1.328 4.88a.5.5 0 00.748.56l5.36-3.217C11.138 19.88 11.565 20 12 20c5.514 0 10-3.582 10-8s-4.486-8-10-8z"
                    fill="currentColor"
                  />
                </svg>
                <span>카카오톡으로 시작하기</span>
              </>
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              계속 진행하면{' '}
              <a href="/terms" className="text-[#148777] hover:underline">
                서비스 이용약관
              </a>{' '}
              및{' '}
              <a href="/privacy" className="text-[#148777] hover:underline">
                개인정보 처리방침
              </a>
              에 동의하는 것으로 간주됩니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#148777] via-cyan-500 to-teal-400">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
