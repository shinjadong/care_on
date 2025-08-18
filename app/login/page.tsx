"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { GuestOnlyRoute } from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isEmailLoading, setIsEmailLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isKakaoLoading, setIsKakaoLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()
  const { signInWithEmail, signInWithGoogle, signInWithKakao, isLoading, user } = useAuth()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsEmailLoading(true)
    setMessage("")

    try {
      const { error } = await signInWithEmail(email, password)

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setMessage("이메일 또는 비밀번호가 잘못되었습니다.")
        } else if (error.message.includes("Email not confirmed")) {
          setMessage("이메일 인증이 필요합니다. 이메일을 확인해주세요.")
        } else {
          setMessage(error.message)
        }
      } else {
        setMessage("로그인 성공!")
        // 인증 훅에서 자동으로 리다이렉트 처리됨
      }
    } catch (error) {
      setMessage("로그인 중 오류가 발생했습니다.")
    } finally {
      setIsEmailLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    setMessage("")

    try {
      const { error } = await signInWithGoogle()

      if (error) {
        setMessage("구글 로그인 중 오류가 발생했습니다: " + error.message)
        setIsGoogleLoading(false)
      }
      // Note: OAuth의 경우 리다이렉트되므로 성공 시 별도 처리 불필요
    } catch (error) {
      setMessage("구글 로그인 중 오류가 발생했습니다.")
      setIsGoogleLoading(false)
    }
  }

  const handleKakaoLogin = async () => {
    setIsKakaoLoading(true)
    setMessage("")

    try {
      const { error } = await signInWithKakao()

      if (error) {
        setMessage("카카오 로그인 중 오류가 발생했습니다: " + error.message)
        setIsKakaoLoading(false)
      }
      // Note: OAuth의 경우 리다이렉트되므로 성공 시 별도 처리 불필요
    } catch (error) {
      setMessage("카카오 로그인 중 오류가 발생했습니다.")
      setIsKakaoLoading(false)
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
          <h2 className="text-2xl font-light text-gray-900 mb-2">로그인</h2>
          <p className="text-gray-600 text-sm">케어온에 오신 것을 환영합니다</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* 구글 로그인 버튼 */}
          <button
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200 mb-3"
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
                구글로 로그인
              </>
            )}
          </button>

          {/* 카카오 로그인 버튼 */}
          <button
            onClick={handleKakaoLogin}
            disabled={isKakaoLoading}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg bg-[#FEE500] text-[#191919] hover:bg-[#FDD835] transition-colors duration-200 mb-6"
          >
            {isKakaoLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#191919]"></div>
            ) : (
              <>
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#191919" d="M12 3C6.477 3 2 6.65 2 11.2c0 2.93 1.85 5.51 4.64 6.98.21.09.28.39.22.6l-.88 3.31c-.05.22.15.42.38.33l3.65-2.44c.14-.09.33-.12.5-.07.8.18 1.63.28 2.49.28 5.523 0 10-3.65 10-8.2S17.523 3 12 3z"/>
                </svg>
                카카오로 로그인
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

          {/* 이메일 로그인 폼 */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
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
                placeholder="비밀번호를 입력하세요"
                className="border-gray-200 focus:border-[#148777] focus:ring-[#148777] focus:ring-1"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isEmailLoading || isLoading}
              className="w-full bg-[#148777] hover:bg-[#0f6b5c] text-white py-3 rounded-lg font-medium transition-colors duration-200"
            >
              {isEmailLoading ? "로그인 중..." : "이메일로 로그인"}
            </Button>
          </form>

          {/* 메시지 */}
          {message && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${
              message.includes("성공") 
                ? "bg-green-50 text-green-700" 
                : "bg-red-50 text-red-700"
            }`}>
              {message}
            </div>
          )}

          {/* 회원가입 링크 */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              계정이 없으신가요?{" "}
              <Link href="/signup" className="text-[#148777] hover:text-[#0f6b5c] font-medium">
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </div>
      </div>
    </GuestOnlyRoute>
  )
}
