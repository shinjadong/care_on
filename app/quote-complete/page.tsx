'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Sparkles, Phone } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'

export default function QuoteCompletePage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedItems, setSubmittedItems] = useState<typeof items>([])
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    const submitQuote = async () => {
      if (isSubmitting) return
      
      // 장바구니와 제출된 아이템이 모두 비어있으면 products 페이지로 리다이렉트
      if (items.length === 0 && submittedItems.length === 0) {
        router.push('/products')
        return
      }

      // 이미 제출되었으면 중복 제출 방지
      if (submittedItems.length > 0) {
        return
      }

      // 제출할 데이터 저장 (장바구니 비우기 전에)
      setSubmittedItems(items)
      setTotalAmount(getTotalPrice())
      setIsSubmitting(true)

      try {
        // 인증 확인
        const authResponse = await fetch('/api/auth/check')
        if (!authResponse.ok) {
          // 인증 실패 시 장바구니 데이터를 localStorage에 임시 저장
          localStorage.setItem('pending_quote_items', JSON.stringify(items))
          router.push('/auth/login?redirect=/quote-complete')
          return
        }

        // 견적 요청 제출 (장바구니 상품 정보)
        const response = await fetch('/api/quote-request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            selected_products: items.map((item) => ({
              product_id: item.product_id,
              product_name: item.name,
              quantity: item.quantity,
              price: item.monthly_fee,
            })),
            total_amount: getTotalPrice(),
          }),
        })

        if (response.ok) {
          // localStorage 정리
          localStorage.removeItem('pending_quote_items')
          // 장바구니 비우기
          clearCart()
        }
      } catch (error) {
        console.error('Quote submission error:', error)
      }
    }

    submitQuote()
  }, [router, items, getTotalPrice, clearCart, isSubmitting, submittedItems])

  return (
    <div className="min-h-screen bg-[#fbfbfb] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 축하 애니메이션 */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            {/* 배경 원 */}
            <div className="w-32 h-32 bg-gradient-to-br from-[#009da2] to-[#00c9cf] rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <CheckCircle2 className="h-16 w-16 text-white" strokeWidth={2.5} />
            </div>
            {/* 반짝이는 효과 */}
            <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-yellow-400 animate-bounce" />
            <Sparkles className="absolute -bottom-2 -left-2 h-6 w-6 text-yellow-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          </div>

          <h1 className="text-4xl font-bold text-black mb-4">
            접수가 완료됐어요!
          </h1>
          
          <div className="space-y-3">
            <p className="text-xl font-semibold text-[#009da2]">
              곧 연락드릴게요
            </p>
            <p className="text-base text-gray-600 leading-relaxed">
              전문 견적사가 빠른 시일 내에<br />
              연락을 드릴 예정입니다
            </p>
          </div>
        </div>

        {/* 선택한 상품 요약 */}
        {submittedItems.length > 0 && (
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#009da2]"></div>
              <h3 className="font-semibold text-gray-800">선택하신 상품</h3>
            </div>
            
            <div className="space-y-2">
              {submittedItems.slice(0, 3).map((item) => (
                <div key={item.product_id} className="flex justify-between text-sm">
                  <span className="text-gray-700">{item.name}</span>
                  <span className="text-gray-600">{item.quantity}개</span>
                </div>
              ))}
              {submittedItems.length > 3 && (
                <div className="text-sm text-gray-500 pt-1">
                  외 {submittedItems.length - 3}개
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
              <span className="font-semibold text-gray-800">월 총액</span>
              <span className="text-2xl font-bold text-[#009da2]">
                {totalAmount.toLocaleString()}원
              </span>
            </div>
          </div>
        )}

        {/* 안내 메시지 */}
        <div className="bg-teal-50 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-[#009da2] mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-700 leading-relaxed">
              <p className="font-medium mb-1">연락 예정 시간</p>
              <p className="text-gray-600">
                영업시간 기준 1~2시간 이내에<br />
                등록하신 번호로 연락드립니다
              </p>
            </div>
          </div>
        </div>

        {/* 홈으로 돌아가기 버튼 */}
        <button
          onClick={() => router.push('/products')}
          className="w-full py-4 px-6 rounded-xl font-semibold text-base text-white bg-[#009da2] hover:bg-[#008a8f] transition-all duration-200 active:scale-[0.98] shadow-sm"
        >
          홈으로 돌아가기
        </button>

        {/* 추가 안내 */}
        <p className="text-center text-sm text-gray-500 mt-6">
          견적서는 이메일로도 함께 발송됩니다
        </p>
      </div>
    </div>
  )
}
