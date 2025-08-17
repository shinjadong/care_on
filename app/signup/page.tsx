"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { GuestOnlyRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [isEmailLoading, setIsEmailLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()
  const { signUpWithEmail, signInWithGoogle, isLoading } = useAuth()

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsEmailLoading(true)
    setMessage("")

    if (password !== confirmPassword) {
      setMessage("비밀번호가 일치하지 않습니다.")
      setIsEmailLoading(false)
      return
    }

    if (password.length < 6) {
      setMessage("비밀번호는 최소 6자 이상이어야 합니다.")
      setIsEmailLoading(false)
      return
    }

    try {
      const { error } = await signUpWithEmail(email, password, {
        data: { full_name: name }
      })

      if (error) {
        if (error.message.includes("User already registered")) {
          setMessage("이미 가입된 이메일입니다. 로그인을 시도해주세요.")
        } else if (error.message.includes("Password should be at least 6 characters")) {
          setMessage("비밀번호는 최소 6자 이상이어야 합니다.")
        } else {
          setMessage(error.message)
        }
      } else {
        setMessage("회원가입이 완료되었습니다! 이메일을 확인해주세요.")
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      }
    } catch (error) {
      setMessage("회원가입 중 오류가 발생했습니다.")
    } finally {
      setIsEmailLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true)
    setMessage("")

    try {
      const { error } = await signInWithGoogle()

      if (error) {
        setMessage("구글 회원가입 중 오류가 발생했습니다: " + error.message)
        setIsGoogleLoading(false)
      }
      // Note: OAuth의 경우 리다이렉트되므로 성공 시 별도 처리 불필요
    } catch (error) {
      setMessage("구글 회원가입 중 오류가 발생했습니다.")
      setIsGoogleLoading(false)
    }
  }

  return (
    <GuestOnlyRoute>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <Image
              src="https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%EC%BC%80%EC%96%B4%EC%98%A8%EB%A1%9C%EA%B3%A0-%EC%97%AC%EB%B0%B1%EC%A0%9C%EA%B1%B0-mint.png"
              alt="케어온 로고"
              width={60}
              height={60}
              className="mx-auto"
            />
          </Link>
          <h2 className="text-2xl font-light text-gray-900 mb-2">회원가입</h2>
          <p className="text-gray-600 text-sm">케어온과 함께 시작해보세요</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* 구글 회원가입 버튼 */}
          <button
            onClick={handleGoogleSignup}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200 mb-6"
          >
            {isGoogleLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
            ) : (
              <>
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                구글로 회원가입
              </>
            )}
          </button>

          {/* 구분선 */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">또는</span>
            </div>
          </div>

          {/* 이메일 회원가입 폼 */}
          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">이름</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                className="border-gray-200 focus:border-[#148777] focus:ring-[#148777] focus:ring-1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">이메일</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="border-gray-200 focus:border-[#148777] focus:ring-[#148777] focus:ring-1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">비밀번호</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="최소 6자 이상"
                className="border-gray-200 focus:border-[#148777] focus:ring-[#148777] focus:ring-1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">비밀번호 확인</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
                className="border-gray-200 focus:border-[#148777] focus:ring-[#148777] focus:ring-1"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isEmailLoading || isLoading}
              className="w-full bg-[#148777] hover:bg-[#0f6b5c] text-white py-3 rounded-lg font-medium transition-colors duration-200"
            >
              {isEmailLoading ? "회원가입 중..." : "회원가입"}
            </Button>
          </form>

          {/* 메시지 */}
          {message && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${
              message.includes("완료") 
                ? "bg-green-50 text-green-700" 
                : "bg-red-50 text-red-700"
            }`}>
              {message}
            </div>
          )}

          {/* 로그인 링크 */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              이미 계정이 있으신가요?{" "}
              <Link href="/login" className="text-[#148777] hover:text-[#0f6b5c] font-medium">
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
      </div>
    </GuestOnlyRoute>
  )
}
