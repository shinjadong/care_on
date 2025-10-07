'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from './ui/sheet'
import { DraggableModal } from './ui/draggable-modal'
import { PhoneLoginForm } from './PhoneLoginForm'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ShoppingCart, Minus, Plus, Trash2, Store, FileText, CheckCircle } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function ShoppingCartComponent() {
  const router = useRouter()
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems, clearCart } = useCartStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const checkoutButtonRef = useRef<HTMLButtonElement>(null)

  // Hydration 문제 해결: 클라이언트에서만 렌더링
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleCheckout = () => {
    // 견적서 확인 모달 표시
    setShowConfirmModal(true)
  }

  const handleConfirmQuote = () => {
    // "좋아요" 버튼 클릭 시 로그인 모달로 전환
    setShowConfirmModal(false)
    setShowLoginModal(true)
  }

  const handleLoginSuccess = () => {
    // 로그인 성공 시
    setShowLoginModal(false)
    setIsOpen(false)
    router.push('/quote-complete')
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
        <SheetContent className="w-[280px] sm:w-[320px] flex flex-col h-full p-0">
          <SheetHeader className="px-4 pt-6 pb-4 border-b">
            <SheetTitle className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                <ShoppingCart size={18} className="text-[#009da2]" />
              </div>
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

      <SheetContent className="w-[280px] sm:w-[320px] flex flex-col h-full p-0">
        <SheetHeader className="px-4 pt-6 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
              <ShoppingCart size={18} className="text-[#009da2]" />
            </div>
            장바구니
          </SheetTitle>
          <SheetDescription className="text-xs">
            선택한 상품으로 매장 세팅
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 px-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <ShoppingCart size={32} className="text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-700">장바구니가 비어있습니다</p>
              <p className="text-xs text-gray-500 mt-1">상품을 추가해주세요</p>
            </div>
          ) : (
            <div className="space-y-3 py-2">
              {items.map((item) => (
                <div
                  key={item.product_id}
                  className="group hover:bg-gray-50 rounded-xl p-3 transition-colors border border-gray-100"
                >
                  <div className="flex items-start gap-2 mb-2">
                    {item.image_url && (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-contain p-1" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-xs leading-tight line-clamp-2 mb-1">{item.name}</h4>
                      <Badge
                        className={cn(
                          "text-[10px] px-1.5 py-0 h-4",
                          categoryColors[item.category] || categoryColors['기타']
                        )}
                      >
                        {item.category}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      onClick={() => removeItem(item.product_id)}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 rounded-md"
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      >
                        <Minus size={10} />
                      </Button>
                      <span className="w-8 text-center text-xs font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 rounded-md"
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      >
                        <Plus size={10} />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-[#009da2]">
                        {(item.monthly_fee * item.quantity).toLocaleString()}원
                        <span className="text-[10px] font-normal text-gray-500">/월</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="flex-col gap-3 border-t p-4">
            {/* 요약 정보 */}
            <div className="w-full bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600 flex-shrink-0">총 상품</span>
                <span className="text-sm font-semibold text-gray-800">{totalItems}개</span>
              </div>
              <div className="flex justify-between items-center gap-2 pt-1 border-t border-teal-100">
                <span className="text-xs font-medium text-gray-700 flex-shrink-0">월 총액</span>
                <span className="text-base font-bold text-[#009da2] truncate">
                  {getTotalPrice().toLocaleString()}원
                </span>
              </div>
            </div>

            {/* 매장 세팅 버튼 */}
            <div className="w-full">
              <Button
                ref={checkoutButtonRef}
                className="w-full h-12 text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-[#009da2] to-[#00c9cf] hover:from-[#008a8f] hover:to-[#00b8be]"
                onClick={handleCheckout}
              >
                <Store className="mr-1.5" size={18} />
                매장 세팅하기
              </Button>
              <p className="text-[10px] text-center text-gray-500 mt-1.5">
                전문가가 직접 설치해드립니다
              </p>
            </div>

            {/* 장바구니 비우기 */}
            <div className="w-full flex justify-center">
              <button
                onClick={() => {
                  if (confirm('장바구니를 비우시겠습니까?')) {
                    clearCart()
                  }
                }}
                className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
              >
                <Trash2 size={10} />
                전체 삭제
              </button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>

      {/* 견적서 확인 모달 (드래그 가능) */}
      <DraggableModal
        isOpen={showConfirmModal}
        onOpenChange={setShowConfirmModal}
        title="견적서 확인"
        triggerElement={checkoutButtonRef.current}
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-teal-100 rounded-full flex items-center justify-center">
              <FileText className="h-8 w-8 text-[#009da2]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              선택한 상품들 구성으로
            </h3>
            <p className="text-base text-gray-700">
              견적서 받아보시겠어요?
            </p>
          </div>

          {/* 선택된 상품 요약 */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h4 className="font-semibold text-gray-800 text-sm">선택하신 상품</h4>
            <div className="space-y-2">
              {items.slice(0, 3).map((item) => (
                <div key={item.product_id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-[#009da2]" />
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">{item.quantity}개</span>
                </div>
              ))}
              {items.length > 3 && (
                <div className="text-xs text-gray-500 text-center pt-1">
                  외 {items.length - 3}개 상품
                </div>
              )}
            </div>
            <div className="bg-teal-50 rounded-lg p-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-800">월 총액</span>
                <span className="text-xl font-bold text-[#009da2]">
                  {getTotalPrice().toLocaleString()}원
                </span>
              </div>
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
              className="flex-1 h-12"
            >
              취소
            </Button>
            <Button
              onClick={handleConfirmQuote}
              className="flex-1 h-12 bg-gradient-to-r from-[#009da2] to-[#00c9cf] hover:from-[#008a8f] hover:to-[#00b8be]"
            >
              좋아요
            </Button>
          </div>
        </div>
      </DraggableModal>

      {/* 휴대폰 로그인 모달 (드래그 가능) */}
      <DraggableModal
        isOpen={showLoginModal}
        onOpenChange={setShowLoginModal}
        title="로그인"
      >
        <PhoneLoginForm
          onSuccess={handleLoginSuccess}
          onCancel={() => setShowLoginModal(false)}
        />
      </DraggableModal>
    </Sheet>
  )
}
