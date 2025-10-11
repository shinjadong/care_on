'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface PhoneLoginFormProps {
  onSuccess?: () => void
}

export function PhoneLoginForm({ onSuccess }: PhoneLoginFormProps) {
  const router = useRouter()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(180) // 3분
  const [error, setError] = useState('')

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '')
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhoneNumber(formatted)
    setError('')
  }

  const handleSendCode = async () => {
    const numbers = phoneNumber.replace(/[^\d]/g, '')
    if (numbers.length !== 11) {
      setError('올바른 휴대폰 번호를 입력해주세요')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: numbers }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || '인증번호 전송 실패')
      }

      // 개발 모드에서 인증번호 콘솔에 표시
      if (data.devCode) {
        console.log('🔐 개발 모드 인증번호:', data.devCode)
        alert(`개발 모드: 인증번호 ${data.devCode}`)
      }

      setIsCodeSent(true)

      // 타이머 시작
      let timeLeft = 180
      const timer = setInterval(() => {
        timeLeft--
        setCountdown(timeLeft)
        if (timeLeft <= 0) {
          clearInterval(timer)
        }
      }, 1000)

    } catch (err: any) {
      setError(err.message || '인증번호 전송에 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      setError('인증번호 6자리를 입력해주세요')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const numbers = phoneNumber.replace(/[^\d]/g, '')
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: numbers,
          code: verificationCode
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || '인증 실패')
      }

      // 로그인 성공
      console.log('✅ 로그인 성공:', data.user)

      if (onSuccess) {
        onSuccess()
      } else {
        // 기본 동작: Canvas 페이지로 이동
        router.push('/canvas')
        router.refresh()
      }
    } catch (err: any) {
      const errorMessage = err.message || '인증에 실패했습니다'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* 휴대폰 번호 입력 */}
        <div>
          <label className="block text-sm font-medium mb-2">
            휴대폰 번호
          </label>
          <div className="flex gap-2">
            <Input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="010-1234-5678"
              disabled={isCodeSent}
            />
            {!isCodeSent ? (
              <Button
                onClick={handleSendCode}
                disabled={isLoading || phoneNumber.replace(/[^\d]/g, '').length !== 11}
              >
                {isLoading ? '전송중...' : '인증번호'}
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setIsCodeSent(false)
                  setVerificationCode('')
                  setCountdown(180)
                }}
                variant="outline"
              >
                재전송
              </Button>
            )}
          </div>
        </div>

        {/* 인증번호 입력 */}
        {isCodeSent && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="block text-sm font-medium mb-2">
              인증번호
              {countdown > 0 && (
                <span className="ml-2 text-red-500 text-xs">
                  {formatTime(countdown)}
                </span>
              )}
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={verificationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, '').slice(0, 6)
                  setVerificationCode(value)
                  setError('')
                }}
                placeholder="6자리 숫자"
                maxLength={6}
                className="text-center tracking-widest"
              />
              <Button
                onClick={handleVerify}
                disabled={isLoading || verificationCode.length !== 6 || countdown === 0}
              >
                {isLoading ? '확인중...' : '확인'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
