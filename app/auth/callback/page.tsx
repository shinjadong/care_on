'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClient } from '@/lib/supabase/client'

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = createClient()

        // Supabase가 OAuth 콜백을 처리
        const { data, error: authError } = await supabase.auth.exchangeCodeForSession(
          window.location.href
        )

        if (authError) {
          throw authError
        }

        // 로그인 성공 - 리다이렉트
        const redirectUrl = searchParams.get('redirect') || '/store-setup'
        router.push(redirectUrl)
      } catch (err) {
        console.error('Auth callback error:', err)
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
        setIsProcessing(false)
      }
    }

    handleCallback()
  }, [searchParams, router])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#148777] via-cyan-500 to-teal-400 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">로그인 실패</CardTitle>
            <CardDescription>로그인 처리 중 문제가 발생했습니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <button
              onClick={() => router.push('/auth/login')}
              className="w-full py-2 px-4 bg-[#148777] text-white rounded-lg hover:bg-[#117766] transition-colors"
            >
              다시 시도하기
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#148777] via-cyan-500 to-teal-400">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">로그인 처리 중...</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-[#148777]" />
          <p className="text-muted-foreground text-center">
            카카오 계정으로 로그인하고 있습니다.
            <br />
            잠시만 기다려주세요.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#148777] via-cyan-500 to-teal-400">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    }>
      <CallbackContent />
    </Suspense>
  )
}
