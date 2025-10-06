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
  business_type: string
  address: string
  address_detail: string
  phone: string
  email: string
  description: string
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
    business_type: '',
    address: '',
    address_detail: '',
    phone: '',
    email: '',
    description: '',
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

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, business_type: value }))
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
            price: item.price,
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

      // 2초 후 대시보드로 이동
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err) {
      console.error('Store setup error:', err)
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
      setIsLoading(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#148777] via-cyan-500 to-teal-400">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-4 p-8">
            <Loader2 className="h-12 w-12 animate-spin text-[#148777]" />
            <p className="text-muted-foreground">인증 확인 중...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#148777] via-cyan-500 to-teal-400 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-4 p-8">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <h2 className="text-2xl font-bold text-center">매장 세팅 완료!</h2>
            <p className="text-muted-foreground text-center">
              매장이 성공적으로 등록되었습니다.
              <br />
              대시보드로 이동합니다...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#148777] via-cyan-500 to-teal-400 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 헤더 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-[#148777] flex items-center gap-2">
              <Store className="h-8 w-8" />
              매장 세팅하기
            </CardTitle>
            <CardDescription className="text-lg">
              선택하신 상품으로 매장을 설정합니다. 매장 정보를 입력해주세요.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* 선택한 상품 목록 */}
        {items.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>선택한 상품 ({items.length}개)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.product_id}
                    className="flex justify-between items-center p-3 bg-muted rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.price.toLocaleString()}원 × {item.quantity}개
                      </p>
                    </div>
                    <p className="font-bold text-[#148777]">
                      {(item.price * item.quantity).toLocaleString()}원
                    </p>
                  </div>
                ))}
                <div className="flex justify-between items-center p-3 bg-[#148777] text-white rounded-lg font-bold">
                  <span>총 금액</span>
                  <span>{getTotalPrice().toLocaleString()}원</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 매장 정보 입력 폼 */}
        <Card>
          <CardHeader>
            <CardTitle>매장 정보</CardTitle>
            <CardDescription>정확한 매장 정보를 입력해주세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* 매장명 */}
              <div className="space-y-2">
                <Label htmlFor="store_name" className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  매장명 *
                </Label>
                <Input
                  id="store_name"
                  name="store_name"
                  value={formData.store_name}
                  onChange={handleInputChange}
                  placeholder="케어온 강남점"
                  required
                />
              </div>

              {/* 업종 */}
              <div className="space-y-2">
                <Label htmlFor="business_type">업종 *</Label>
                <Select value={formData.business_type} onValueChange={handleSelectChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="업종을 선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restaurant">음식점</SelectItem>
                    <SelectItem value="cafe">카페</SelectItem>
                    <SelectItem value="retail">소매업</SelectItem>
                    <SelectItem value="service">서비스업</SelectItem>
                    <SelectItem value="beauty">미용/뷰티</SelectItem>
                    <SelectItem value="education">교육</SelectItem>
                    <SelectItem value="other">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 주소 */}
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  주소 *
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="서울시 강남구 테헤란로 123"
                  required
                />
              </div>

              {/* 상세주소 */}
              <div className="space-y-2">
                <Label htmlFor="address_detail">상세주소</Label>
                <Input
                  id="address_detail"
                  name="address_detail"
                  value={formData.address_detail}
                  onChange={handleInputChange}
                  placeholder="1층 101호"
                />
              </div>

              {/* 전화번호 */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  전화번호 *
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="02-1234-5678"
                  required
                />
              </div>

              {/* 이메일 */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  이메일 *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="store@example.com"
                  required
                />
              </div>

              {/* 매장 설명 */}
              <div className="space-y-2">
                <Label htmlFor="description">매장 소개</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="매장에 대한 간단한 소개를 입력해주세요"
                  rows={4}
                />
              </div>

              {/* 제출 버튼 */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#148777] hover:bg-[#117766] text-white text-lg font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    처리 중...
                  </>
                ) : (
                  '매장 세팅 완료하기'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
