'use client'

import { Suspense, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

function LoginContent() {
  const router = useRouter()
  const [step, setStep] = useState<'phone' | 'code'>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)

  // 휴대폰 번호 포맷팅 (자동 하이픈)
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, '')
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
  }

  // 카운트다운 시작
  const startCountdown = () => {
    setCountdown(300) // 5분
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // 인증번호 발송
  const handleSendCode = async () => {
    setError(null)
    setMessage(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage(data.message || '인증번호가 발송되었습니다.')
        setStep('code')
        startCountdown()
        
        // 개발 모드에서는 콘솔에 코드 표시
        if (data.devCode) {
          console.log('🔐 개발 모드 인증 코드:', data.devCode)
          alert(`개발 모드: 인증번호는 ${data.devCode} 입니다.`)
        }
      } else {
        setError(data.error || '인증번호 발송에 실패했습니다.')
      }
    } catch (err) {
      console.error('인증번호 발송 오류:', err)
      setError('서버 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 인증번호 확인 및 로그인
  const handleVerifyCode = async () => {
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, code: verificationCode }),
      })

      const data = await response.json()

      if (data.success) {
        // 세션 저장
        if (data.sessionToken) {
          localStorage.setItem('auth_token', data.sessionToken)
          localStorage.setItem('user_id', data.user.id)
        }

        // 로그인 성공
        setMessage('로그인 성공! 이동 중...')
        setTimeout(() => {
          if (data.user.isNewUser) {
            router.push('/store-setup') // 신규 사용자는 매장 설정으로
          } else {
            router.push('/') // 기존 사용자는 홈으로
          }
        }, 1000)
      } else {
        setError(data.error || '인증에 실패했습니다.')
      }
    } catch (err) {
      console.error('인증 확인 오류:', err)
      setError('서버 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
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
            {step === 'phone' ? '휴대폰 번호로 간편하게 시작하세요' : '인증번호를 입력해주세요'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {step === 'phone' ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">휴대폰 번호</label>
                <Input
                  type="tel"
                  placeholder="010-1234-5678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                  maxLength={13}
                  className="h-12 text-base"
                />
              </div>

              <Button
                onClick={handleSendCode}
                disabled={isLoading || phoneNumber.length < 12}
                className="w-full h-12 bg-[#148777] hover:bg-[#0f6b5f] text-white font-semibold text-base rounded-xl"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    <span>발송 중...</span>
                  </>
                ) : (
                  <span>인증번호 받기</span>
                )}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">인증번호</label>
                  {countdown > 0 && (
                    <span className="text-sm text-red-600 font-medium">
                      {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
                    </span>
                  )}
                </div>
                <Input
                  type="text"
                  placeholder="6자리 숫자 입력"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  maxLength={6}
                  className="h-12 text-base text-center text-2xl tracking-widest"
                />
                <p className="text-xs text-muted-foreground text-center">
                  {phoneNumber}로 발송된 인증번호를 입력해주세요
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={handleVerifyCode}
                  disabled={isLoading || verificationCode.length !== 6}
                  className="w-full h-12 bg-[#148777] hover:bg-[#0f6b5f] text-white font-semibold text-base rounded-xl"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      <span>확인 중...</span>
                    </>
                  ) : (
                    <span>인증 완료</span>
                  )}
                </Button>

                <Button
                  onClick={handleSendCode}
                  variant="outline"
                  disabled={isLoading || countdown > 240}
                  className="w-full h-10 text-sm"
                >
                  인증번호 재발송
                </Button>

                <Button
                  onClick={() => {
                    setStep('phone')
                    setVerificationCode('')
                    setCountdown(0)
                  }}
                  variant="ghost"
                  className="w-full h-10 text-sm"
                >
                  번호 변경
                </Button>
              </div>
            </>
          )}

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
