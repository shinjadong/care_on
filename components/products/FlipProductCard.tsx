'use client'

import { useState, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Plus, Info, Check } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import { cn } from '@/lib/utils'

// 장바구니로 날아가는 애니메이션 함수 (곡선 경로)
const flyToCart = (startElement: HTMLElement, productImage?: string | null) => {
  // 장바구니 버튼 찾기
  const cartButton = document.querySelector('[data-cart-button]') as HTMLElement
  if (!cartButton) return

  // 시작 위치와 끝 위치
  const startRect = startElement.getBoundingClientRect()
  const endRect = cartButton.getBoundingClientRect()

  const startX = startRect.left + startRect.width / 2
  const startY = startRect.top + startRect.height / 2
  const endX = endRect.left + endRect.width / 2
  const endY = endRect.top + endRect.height / 2

  // 곡선 제어점 (위쪽으로 포물선 그리기)
  const controlX = (startX + endX) / 2
  const controlY = Math.min(startY, endY) - 150

  // 날아갈 요소 생성
  const flyingElement = document.createElement('div')
  flyingElement.style.cssText = `
    position: fixed;
    left: ${startX}px;
    top: ${startY}px;
    width: 60px;
    height: 60px;
    z-index: 9999;
    pointer-events: none;
    transform: translate(-50%, -50%);
  `

  // 이미지가 있으면 이미지를, 없으면 아이콘 사용
  if (productImage) {
    flyingElement.innerHTML = `
      <div style="
        width: 100%;
        height: 100%;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 157, 162, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px;
        animation: fly-rotate 0.9s ease-out;
      ">
        <img src="${productImage}" style="width: 100%; height: 100%; object-fit: contain;" />
      </div>
    `
  } else {
    flyingElement.innerHTML = `
      <div style="
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #009da2 0%, #00c9cf 100%);
        border-radius: 50%;
        box-shadow: 0 8px 24px rgba(0, 157, 162, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fly-rotate 0.9s ease-out;
      ">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
      </div>
    `
  }

  document.body.appendChild(flyingElement)

  // 장바구니 흔들림 효과
  const addCartShake = () => {
    cartButton.style.animation = 'cart-shake 0.5s ease-in-out'
    setTimeout(() => {
      cartButton.style.animation = ''
    }, 500)
  }

  // 곡선 경로를 따라 애니메이션
  let startTime: number
  const duration = 900

  const animate = (currentTime: number) => {
    if (!startTime) startTime = currentTime
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    // 이차 베지어 곡선 계산
    const t = progress
    const x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * controlX + t * t * endX
    const y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * controlY + t * t * endY

    flyingElement.style.left = `${x}px`
    flyingElement.style.top = `${y}px`
    
    // 크기 축소 및 투명도 조절
    const scale = 1 - (progress * 0.7) // 1 -> 0.3
    flyingElement.style.transform = `translate(-50%, -50%) scale(${scale})`
    flyingElement.style.opacity = `${1 - (progress * 0.2)}`

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      // 애니메이션 완료
      flyingElement.style.opacity = '0'
      addCartShake()
      setTimeout(() => {
        document.body.removeChild(flyingElement)
      }, 100)
    }
  }

  requestAnimationFrame(animate)
}

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
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const addButtonRef = useRef<HTMLButtonElement>(null)

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget

    // 장바구니에 추가
    addItem({
      product_id: product.product_id,
      name: product.name,
      category: product.category,
      provider: product.provider,
      monthly_fee: product.monthly_fee,
      image_url: product.image_url,
    })

    // 날아가는 애니메이션 실행
    flyToCart(button, product.image_url)

    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)

    // 애니메이션 완료 후 카드를 초기 상태로 되돌림
    setTimeout(() => setIsFlipped(false), 1000)
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

  return (
    <div className="flip-card h-[500px] w-full">
      <div
        className={cn(
          "flip-card-inner",
          isFlipped && "flipped"
        )}
      >
        {/* Front Side */}
        <Card
          className="flip-card-front overflow-hidden cursor-pointer hover:shadow-lg transition-shadow bg-white border-2 border-teal-200 hover:border-teal-300"
          onClick={() => setIsFlipped(!isFlipped)}
          style={{ pointerEvents: isFlipped ? 'none' : 'auto' }}
        >
          <div className="relative h-96 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
            {/* 항상 아이콘을 렌더링 (배경) */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <ShoppingCart size={64} />
            </div>
            {/* 항상 img 태그를 렌더링 - 투명 1x1 픽셀을 fallback으로 사용 */}
            <img
              src={product.image_url || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'}
              alt={product.name}
              className="relative w-full h-full object-contain p-4 bg-gradient-to-br from-gray-100 to-gray-200"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              style={{ 
                opacity: imageLoaded && !imageError && product.image_url ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
                pointerEvents: imageLoaded && !imageError && product.image_url ? 'auto' : 'none'
              }}
            />
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

          <div className="p-5 flex flex-col justify-between h-[calc(500px-384px)]">
            <div className="space-y-1">
              <h3 className="font-bold text-base line-clamp-1">{product.name}</h3>
              {product.provider && (
                <p className="text-xs text-gray-500">{product.provider}</p>
              )}
            </div>

            <div className="flex items-end justify-between gap-3">
              <div className="flex-shrink-0">
                <p className="text-xl font-bold text-[#009da2] leading-tight">
                  {product.monthly_fee.toLocaleString()}원
                  <span className="text-xs font-normal text-gray-600 ml-0.5">/월</span>
                </p>
                {product.closure_refund_rate > 0 && (
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    폐업 환급률 {product.closure_refund_rate}%
                  </p>
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                className="gap-1 border-2 border-[#009da2] text-[#009da2] hover:bg-teal-50 flex-shrink-0 h-8 text-xs px-3"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsFlipped(true)
                }}
              >
                <Info size={14} />
                상세보기
              </Button>
            </div>
          </div>
        </Card>

        {/* Back Side */}
        <Card
          className="flip-card-back overflow-hidden bg-[#fbfbfb] border-2 border-teal-200"
          style={{ pointerEvents: isFlipped ? 'auto' : 'none' }}
        >
          <div className="h-full flex flex-col">
            <div className="p-4 bg-gradient-to-r from-teal-50 to-teal-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
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
                  className="ml-2 hover:bg-white/50"
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

            <div className="p-4 border-t bg-white">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600">월 이용료</p>
                  <p className="text-2xl font-bold text-[#009da2]">
                    {product.monthly_fee.toLocaleString()}원
                  </p>
                </div>
                {product.available ? (
                  <Button
                    onClick={handleAddToCart}
                    disabled={isAdded}
                    className={cn(
                      "gap-2 rounded-xl font-semibold text-white transition-all duration-200 active:scale-[0.98]",
                      isAdded 
                        ? "bg-green-600 hover:bg-green-600" 
                        : "bg-[#009da2] hover:bg-[#008a8f]"
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
                  <Button disabled variant="secondary" className="rounded-xl">
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