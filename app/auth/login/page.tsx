'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect') || '/'
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
          // redirect 파라미터가 있으면 해당 경로로, 없으면 기본 경로로
          router.push(redirectUrl)
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
    <div className="min-h-screen bg-[#fbfbfb] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#009da2] to-[#00c9cf] rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-3xl font-bold">CO</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-black mb-3">
            케어온에 오신 것을<br />환영합니다
          </h1>
          <p className="text-base text-gray-600">
            {step === 'phone' ? '휴대폰 번호로 간편하게 시작하세요' : '인증번호를 입력해주세요'}
          </p>
        </div>

        <Card className="shadow-lg border-2 border-gray-100 rounded-2xl overflow-hidden bg-white">
        <CardContent className="space-y-6 p-8">
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
              <div className="space-y-3">
                <label className="block text-base font-medium text-black">휴대폰 번호</label>
                <Input
                  type="tel"
                  placeholder="010-1234-5678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                  maxLength={13}
                  className="w-full py-4 px-4 border-0 border-b-2 border-gray-200 bg-transparent text-base text-black placeholder-gray-400 transition-colors duration-200 focus:border-[#009da2] focus:outline-none rounded-none"
                />
              </div>

              <Button
                onClick={handleSendCode}
                disabled={isLoading || phoneNumber.length < 12}
                className="w-full py-4 px-6 rounded-xl font-semibold text-base text-white bg-[#009da2] hover:bg-[#008a8f] transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-base font-medium text-black">인증번호</label>
                  {countdown > 0 && (
                    <span className="text-sm text-[#009da2] font-semibold bg-teal-50 px-3 py-1 rounded-full">
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
                  className="w-full py-6 px-4 border-0 border-b-2 border-gray-200 bg-transparent text-3xl text-center tracking-[0.5em] text-black placeholder-gray-400 transition-colors duration-200 focus:border-[#009da2] focus:outline-none rounded-none font-semibold"
                />
                <p className="text-sm text-gray-600 text-center pt-2">
                  {phoneNumber}로 발송된 인증번호를 입력해주세요
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleVerifyCode}
                  disabled={isLoading || verificationCode.length !== 6}
                  className="w-full py-4 px-6 rounded-xl font-semibold text-base text-white bg-[#009da2] hover:bg-[#008a8f] transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="w-full py-3 px-6 rounded-xl font-medium text-base text-gray-700 bg-white hover:bg-gray-50 border-2 border-gray-200 transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
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
                  className="w-full py-3 px-6 rounded-xl font-medium text-base text-gray-600 hover:bg-gray-100 transition-all duration-200"
                >
                  번호 변경
                </Button>
              </div>
            </>
          )}

          <div className="text-center text-sm text-gray-600 pt-4">
            <p>
              계속 진행하면{' '}
              <a href="/terms" className="text-[#009da2] hover:underline font-medium">
                서비스 이용약관
              </a>{' '}
              및{' '}
              <a href="/privacy" className="text-[#009da2] hover:underline font-medium">
                개인정보 처리방침
              </a>
              에 동의하는 것으로 간주됩니다.
            </p>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#fbfbfb]">
        <Loader2 className="h-8 w-8 animate-spin text-[#009da2]" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
