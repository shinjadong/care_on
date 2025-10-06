'use client'

import { useState, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Minus, Plus, Trash2, Store, FileText } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function ShoppingCartComponent() {
  const router = useRouter()
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems, clearCart } = useCartStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  // Hydration 문제 해결: 클라이언트에서만 렌더링
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleCheckout = () => {
    // 확인 다이얼로그 표시
    setShowConfirmDialog(true)
  }

  const handleConfirmQuote = async () => {
    // "좋아요" 버튼 클릭 시 인증 확인 후 이동
    setShowConfirmDialog(false)
    setIsOpen(false)

    try {
      // 인증 상태 확인
      const response = await fetch('/api/auth/check')
      if (response.ok) {
        // 이미 로그인되어 있으면 바로 완료 페이지로
        router.push('/quote-complete')
      } else {
        // 로그인 필요
        router.push('/auth/login?redirect=/quote-complete')
      }
    } catch (error) {
      // 에러 발생 시 로그인 페이지로
      router.push('/auth/login?redirect=/quote-complete')
    }
  }

  const categoryColors: Record<string, string> = {
    'POS': 'bg-teal-100 text-teal-800',
    'KIOSK': 'bg-teal-100 text-teal-800',
    '네트워크/인터넷': 'bg-teal-100 text-teal-800',
    '보안/CCTV': 'bg-teal-100 text-teal-800',
    '음악/사운드': 'bg-teal-100 text-teal-800',
    '프린터/부가장비': 'bg-teal-100 text-teal-800',
    'TV/디스플레이': 'bg-teal-100 text-teal-800',
    '기타': 'bg-teal-100 text-teal-800',
  }

  const totalItems = getTotalItems()

  // 서버 렌더링 중에는 기본 UI만 표시
  if (!isMounted) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            data-cart-button
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow z-50 bg-[#009da2] hover:bg-[#008a8f] border-none text-white"
          >
            <div className="relative">
              <ShoppingCart size={24} />
            </div>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md flex flex-col h-full">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart size={20} />
              장바구니
            </SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          data-cart-button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow z-50 bg-[#009da2] hover:bg-[#008a8f] border-none text-white"
        >
          <div className="relative">
            <ShoppingCart size={24} />
            {totalItems > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-white text-[#009da2] border-2 border-[#009da2]">
                {totalItems}
              </Badge>
            )}
          </div>
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md flex flex-col h-full">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart size={20} />
            장바구니
          </SheetTitle>
          <SheetDescription>
            선택한 상품들로 매장을 세팅할 수 있습니다.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ShoppingCart size={64} className="mb-4 text-gray-300" />
              <p className="text-lg font-medium">장바구니가 비어있습니다</p>
              <p className="text-sm mt-2">상품을 추가해주세요</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.product_id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <Badge
                        className={cn(
                          "mt-1 text-xs",
                          categoryColors[item.category] || categoryColors['기타']
                        )}
                      >
                        {item.category}
                      </Badge>
                      {item.provider && (
                        <p className="text-xs text-gray-600 mt-1">{item.provider}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeItem(item.product_id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      >
                        <Minus size={14} />
                      </Button>
                      <span className="w-12 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {(item.monthly_fee * item.quantity).toLocaleString()}원
                      </p>
                      <p className="text-xs text-gray-600">/월</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="flex-col gap-4 border-t pt-4">
            <div className="w-full space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">총 상품 수</span>
                <span className="font-medium">{totalItems}개</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">월 총액</span>
                <span className="text-xl font-bold text-primary">
                  {getTotalPrice().toLocaleString()}원
                </span>
              </div>
            </div>

            <div className="w-full space-y-2">
              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
              >
                <Store className="mr-2" size={18} />
                이 구성으로 매장 세팅하기
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  if (confirm('장바구니를 비우시겠습니까?')) {
                    clearCart()
                  }
                }}
              >
                장바구니 비우기
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>

      {/* 견적서 확인 다이얼로그 - Enrollment 스타일 */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md bg-[#fbfbfb] border-none p-0">
          <div className="p-6 pb-3">
            <div className="w-16 h-16 mx-auto mb-4 bg-teal-100 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
              <FileText className="h-8 w-8 text-[#009da2]" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-semibold text-black leading-relaxed">
                선택한 상품들 구성으로<br />
                견적서 받아보시겠어요?
              </DialogTitle>
            </DialogHeader>
          </div>
          
          <div className="px-6 space-y-6">

            {/* 선택된 상품 요약 */}
            <div className="bg-white rounded-xl border-2 border-gray-100 p-5 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h4 className="font-semibold text-gray-800 text-base">선택하신 상품</h4>
              <div className="space-y-3">
                {items.slice(0, 3).map((item, index) => (
                  <div 
                    key={item.product_id} 
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-[#009da2] font-bold text-sm">✓</span>
                      </div>
                      <span className="text-gray-700 font-medium">{item.name}</span>
                    </div>
                    <span className="text-gray-600 font-medium">{item.quantity}개</span>
                  </div>
                ))}
                {items.length > 3 && (
                  <div className="text-sm text-gray-500 text-center pt-2">
                    외 {items.length - 3}개 상품
                  </div>
                )}
              </div>
              <div className="bg-teal-50 rounded-lg p-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">월 총액</span>
                  <span className="text-2xl font-bold text-[#009da2]">
                    {getTotalPrice().toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="p-6 pt-0 space-y-3">
            <button
              type="button"
              onClick={handleConfirmQuote}
              className="w-full py-4 px-6 rounded-xl font-semibold text-base text-white bg-[#009da2] hover:bg-[#008a8f] transition-all duration-200 active:scale-[0.98]"
            >
              좋아요
            </button>
            <button
              type="button"
              onClick={() => setShowConfirmDialog(false)}
              className="w-full py-4 px-6 rounded-xl font-medium text-base text-gray-600 bg-white hover:bg-gray-50 border-2 border-gray-200 transition-all duration-200 active:scale-[0.98]"
            >
              취소
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </Sheet>
  )
}