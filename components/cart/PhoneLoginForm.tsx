'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

interface PhoneLoginFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function PhoneLoginForm({ onSuccess, onCancel }: PhoneLoginFormProps) {
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
      }

      setIsCodeSent(true)

      // 타이머 시작
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

    } catch (error) {
      setError('인증번호 전송에 실패했습니다')
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
      onSuccess()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '인증에 실패했습니다'
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
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          휴대폰 번호로 로그인
        </h3>
        <p className="text-sm text-gray-600">
          견적서 받기 위해 휴대폰 인증이 필요합니다
        </p>
      </div>

      <div className="space-y-4">
        {/* 휴대폰 번호 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            휴대폰 번호
          </label>
          <div className="flex gap-2">
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="010-1234-5678"
              disabled={isCodeSent}
              className={cn(
                "flex-1 h-12 px-4 rounded-lg border text-base",
                "focus:outline-none focus:ring-2 focus:ring-teal-500",
                isCodeSent && "bg-gray-100 text-gray-500"
              )}
            />
            {!isCodeSent ? (
              <Button
                onClick={handleSendCode}
                disabled={isLoading || phoneNumber.replace(/[^\d]/g, '').length !== 11}
                className="h-12 px-6 bg-[#009da2] hover:bg-[#008a8f]"
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
                className="h-12 px-6"
              >
                재전송
              </Button>
            )}
          </div>
        </div>

        {/* 인증번호 입력 */}
        {isCodeSent && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              인증번호
              {countdown > 0 && (
                <span className="ml-2 text-red-500 text-xs font-normal">
                  {formatTime(countdown)}
                </span>
              )}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, '').slice(0, 6)
                  setVerificationCode(value)
                  setError('')
                }}
                placeholder="6자리 숫자"
                maxLength={6}
                className={cn(
                  "flex-1 h-12 px-4 rounded-lg border text-base text-center tracking-widest",
                  "focus:outline-none focus:ring-2 focus:ring-teal-500"
                )}
              />
              <Button
                onClick={handleVerify}
                disabled={isLoading || verificationCode.length !== 6 || countdown === 0}
                className="h-12 px-6 bg-[#009da2] hover:bg-[#008a8f]"
              >
                {isLoading ? '확인중...' : '확인'}
              </Button>
            </div>
          </div>
        )}

        {/* 에러 메시지 */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>

      {/* 버튼들 */}
      <div className="flex gap-3 pt-4">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1 h-12"
        >
          취소
        </Button>
        {!isCodeSent && (
          <Button
            onClick={handleSendCode}
            disabled={isLoading || phoneNumber.replace(/[^\d]/g, '').length !== 11}
            className="flex-1 h-12 bg-gradient-to-r from-[#009da2] to-[#00c9cf] hover:from-[#008a8f] hover:to-[#00b8be]"
          >
            인증번호 받기
          </Button>
        )}
      </div>
    </div>
  )
}
