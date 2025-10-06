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
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Minus, Plus, Trash2, Store } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function ShoppingCartComponent() {
  const router = useRouter()
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems, clearCart } = useCartStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Hydration 문제 해결: 클라이언트에서만 렌더링
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleCheckout = () => {
    // 카카오 로그인 페이지로 이동
    router.push('/auth/login?redirect=/store-setup')
    setIsOpen(false)
  }

  const categoryColors: Record<string, string> = {
    'POS': 'bg-blue-100 text-blue-800',
    'KIOSK': 'bg-purple-100 text-purple-800',
    '네트워크/인터넷': 'bg-green-100 text-green-800',
    '보안/CCTV': 'bg-red-100 text-red-800',
    '음악/사운드': 'bg-yellow-100 text-yellow-800',
    '프린터/부가장비': 'bg-gray-100 text-gray-800',
    'TV/디스플레이': 'bg-indigo-100 text-indigo-800',
    '기타': 'bg-gray-100 text-gray-800',
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
    </Sheet>
  )
}