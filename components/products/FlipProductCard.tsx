'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Plus, Info, Check } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import { cn } from '@/lib/utils'

interface Product {
  product_id: string
  name: string
  category: string
  provider: string | null
  monthly_fee: number
  description: string | null
  available: boolean
  closure_refund_rate: number
  image_url?: string | null
  features?: string[]
  benefits?: string[]
}

interface FlipProductCardProps {
  product: Product
}

export default function FlipProductCard({ product }: FlipProductCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem({
      product_id: product.product_id,
      name: product.name,
      category: product.category,
      provider: product.provider,
      monthly_fee: product.monthly_fee,
      image_url: product.image_url,
    })

    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
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

  return (
    <div className="flip-card h-[400px] w-full">
      <div
        className={cn(
          "flip-card-inner",
          isFlipped && "md:flipped" // 모바일에서는 플립 비활성화
        )}
      >
        {/* Front Side */}
        <Card
          className="flip-card-front overflow-hidden md:cursor-pointer md:hover:shadow-lg transition-shadow bg-white border-2"
          onClick={() => setIsFlipped(true)}
          style={{ pointerEvents: isFlipped ? 'none' : 'auto' }}
        >
          <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-contain p-4"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <ShoppingCart size={64} />
              </div>
            )}
            <Badge
              className={cn(
                "absolute top-2 left-2",
                categoryColors[product.category] || categoryColors['기타']
              )}
            >
              {product.category}
            </Badge>
            {!product.available && (
              <Badge className="absolute top-2 right-2 bg-gray-500">
                판매중단
              </Badge>
            )}
          </div>

          <div className="p-4 flex flex-col gap-3">
            <div>
              <h3 className="font-bold text-lg line-clamp-2">{product.name}</h3>
              {product.provider && (
                <p className="text-sm text-gray-600">{product.provider}</p>
              )}
            </div>

            <div className="flex items-center justify-between mt-auto">
              <div>
                <p className="text-2xl font-bold text-primary">
                  {product.monthly_fee.toLocaleString()}원
                  <span className="text-sm font-normal text-gray-600">/월</span>
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="gap-1"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsFlipped(true)
                }}
              >
                <Info size={16} />
                상세보기
              </Button>
            </div>

            {product.closure_refund_rate > 0 && (
              <p className="text-xs text-gray-500">
                폐업 환급률: {product.closure_refund_rate}%
              </p>
            )}
          </div>
        </Card>

        {/* Back Side */}
        <Card
          className="flip-card-back overflow-hidden bg-white border-2"
          style={{ pointerEvents: isFlipped ? 'auto' : 'none' }}
        >
          <div className="h-full flex flex-col">
            <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <Badge
                    className={cn(
                      "mt-1",
                      categoryColors[product.category] || categoryColors['기타']
                    )}
                  >
                    {product.category}
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsFlipped(false)}
                  className="ml-2"
                >
                  ✕
                </Button>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              {product.description && (
                <div className="mb-4">
                  <h4 className="font-semibold text-sm mb-2">상품 설명</h4>
                  <p className="text-sm text-gray-700">{product.description}</p>
                </div>
              )}

              {product.features && product.features.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-sm mb-2">주요 기능</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.benefits && product.benefits.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-sm mb-2">혜택</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {product.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.provider && (
                <div className="mb-4">
                  <h4 className="font-semibold text-sm mb-1">제공업체</h4>
                  <p className="text-sm text-gray-700">{product.provider}</p>
                </div>
              )}

              {product.closure_refund_rate > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-sm mb-1">폐업 환급률</h4>
                  <p className="text-sm text-gray-700">{product.closure_refund_rate}%</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600">월 이용료</p>
                  <p className="text-2xl font-bold text-primary">
                    {product.monthly_fee.toLocaleString()}원
                  </p>
                </div>
                {product.available ? (
                  <Button
                    onClick={handleAddToCart}
                    disabled={isAdded}
                    className={cn(
                      "gap-2",
                      isAdded && "bg-green-600 hover:bg-green-600"
                    )}
                  >
                    {isAdded ? (
                      <>
                        <Check size={18} />
                        담기 완료
                      </>
                    ) : (
                      <>
                        <Plus size={18} />
                        장바구니 담기
                      </>
                    )}
                  </Button>
                ) : (
                  <Button disabled variant="secondary">
                    판매 중단
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}