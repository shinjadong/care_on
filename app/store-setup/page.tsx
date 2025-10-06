'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Store, MapPin, Phone, Mail, CheckCircle2 } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'

interface StoreSetupForm {
  store_name: string
  phone: string
  email: string
}

export default function StoreSetupPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState<StoreSetupForm>({
    store_name: '',
    phone: '',
    email: '',
  })

  useEffect(() => {
    // 로그인 상태 확인
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check')
        if (!response.ok) {
          // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
          router.push('/auth/login?redirect=/store-setup')
          return
        }
        setIsCheckingAuth(false)
      } catch (err) {
        console.error('Auth check error:', err)
        router.push('/auth/login?redirect=/store-setup')
      }
    }

    checkAuth()
  }, [router])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // 선택한 상품 정보와 매장 정보를 함께 전송
      const response = await fetch('/api/store-setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          selected_products: items.map((item) => ({
            product_id: item.product_id,
            product_name: item.name,
            quantity: item.quantity,
            price: item.monthly_fee,
          })),
          total_amount: getTotalPrice(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '매장 세팅 중 오류가 발생했습니다.')
      }

      // 성공 시 장바구니 비우기
      clearCart()
      setSuccess(true)
    } catch (err) {
      console.error('Store setup error:', err)
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
      setIsLoading(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fbfbfb]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-[#009da2]" />
          <p className="text-gray-600">인증 확인 중...</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#fbfbfb] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
            {/* 축하 이모지 애니메이션 */}
            <div className="text-8xl mb-6 animate-bounce">
              🎉
            </div>

            {/* 메인 메시지 */}
            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-black">
                접수가 완료됐어요!
              </h1>
              <p className="text-xl text-gray-700">
                성공적으로 등록되었습니다
              </p>
            </div>

            {/* 정보 카드 */}
            <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 space-y-6 shadow-lg">
              {/* 체크 아이콘 */}
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>

              {/* 안내 메시지 */}
              <div className="space-y-4">
                <div className="bg-teal-50 rounded-xl p-5 space-y-2">
                  <div className="flex items-center justify-center gap-2 text-[#009da2] font-semibold">
                    <Phone className="h-5 w-5" />
                    <span>곧 연락드릴게요</span>
                  </div>
                  <p className="text-gray-700 text-center">
                    전문 견적사가 빠른 시일 내에<br />
                    연락을 드릴 예정입니다
                  </p>
                </div>

                {/* 선택한 상품 요약 */}
                {items.length > 0 && (
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600 mb-3">선택하신 상품</p>
                    <div className="space-y-2">
                      {items.slice(0, 3).map((item) => (
                        <div key={item.product_id} className="flex justify-between text-sm">
                          <span className="text-gray-700">{item.name}</span>
                          <span className="text-gray-900 font-medium">{item.quantity}개</span>
                        </div>
                      ))}
                      {items.length > 3 && (
                        <p className="text-xs text-gray-500 text-center pt-1">
                          외 {items.length - 3}개 상품
                        </p>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                      <span className="font-semibold text-gray-800">월 총액</span>
                      <span className="text-xl font-bold text-[#009da2]">
                        {getTotalPrice().toLocaleString()}원
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* 홈으로 버튼 */}
              <Button
                onClick={() => router.push('/')}
                className="w-full py-4 px-6 rounded-xl font-semibold text-base text-white bg-[#009da2] hover:bg-[#008a8f] transition-all duration-200 active:scale-[0.98]"
              >
                홈으로 돌아가기
              </Button>
            </div>

            {/* 추가 안내 */}
            <p className="text-sm text-gray-500">
              등록하신 연락처로 곧 연락드리겠습니다
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fbfbfb] py-8 px-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* 헤더 */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-black">
            매장 정보를<br />
            입력해 주세요
          </h1>
          <p className="text-base text-gray-600">
            전문 견적사가 연락드릴 수 있도록<br />
            정보를 알려주세요
          </p>
        </div>

        {/* 선택한 상품 목록 */}
        {items.length > 0 && (
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">선택하신 상품 ({items.length}개)</h3>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.product_id}
                  className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.monthly_fee.toLocaleString()}원 × {item.quantity}개
                    </p>
                  </div>
                  <p className="font-bold text-[#009da2]">
                    {(item.monthly_fee * item.quantity).toLocaleString()}원
                  </p>
                </div>
              ))}
              <div className="flex justify-between items-center pt-3 mt-2 bg-teal-50 rounded-lg p-4">
                <span className="font-semibold text-gray-800">월 총액</span>
                <span className="text-xl font-bold text-[#009da2]">{getTotalPrice().toLocaleString()}원</span>
              </div>
            </div>
          </div>
        )}

        {/* 매장 정보 입력 폼 */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* 매장명 */}
              <div className="space-y-3">
                <label className="block text-base font-medium text-black">매장명 *</label>
                <Input
                  id="store_name"
                  name="store_name"
                  value={formData.store_name}
                  onChange={handleInputChange}
                  placeholder="예) 케어온 강남점"
                  required
                  className="w-full py-4 px-4 border-0 border-b-2 border-gray-200 bg-transparent text-base text-black placeholder-gray-400 transition-colors duration-200 focus:border-[#009da2] focus:outline-none rounded-none"
                />
              </div>

              {/* 전화번호 */}
              <div className="space-y-3">
                <label className="block text-base font-medium text-black">전화번호 *</label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="예) 02-1234-5678"
                  required
                  className="w-full py-4 px-4 border-0 border-b-2 border-gray-200 bg-transparent text-base text-black placeholder-gray-400 transition-colors duration-200 focus:border-[#009da2] focus:outline-none rounded-none"
                />
              </div>

              {/* 이메일 */}
              <div className="space-y-3">
                <label className="block text-base font-medium text-black">이메일 *</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="예) store@example.com"
                  required
                  className="w-full py-4 px-4 border-0 border-b-2 border-gray-200 bg-transparent text-base text-black placeholder-gray-400 transition-colors duration-200 focus:border-[#009da2] focus:outline-none rounded-none"
                />
              </div>

              {/* 제출 버튼 */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 rounded-xl font-semibold text-base text-white bg-[#009da2] hover:bg-[#008a8f] transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      <span>처리 중...</span>
                    </>
                  ) : (
                    <span>접수 완료하기</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
      </div>
    </div>
  )
}
