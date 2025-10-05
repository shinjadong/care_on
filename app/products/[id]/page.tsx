'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Minus,
  Plus,
  Heart,
  Share2,
  CheckCircle,
  Truck,
  Shield as ShieldIcon,
  CreditCard as CreditCardIcon,
  Package
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getProductById } from '@/lib/products-data'
import Link from 'next/link'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = parseInt(params.id as string)
  const product = getProductById(productId)

  const [quantity, setQuantity] = useState(1)
  const [selectedTab, setSelectedTab] = useState('overview')
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    if (!product) {
      router.push('/products')
    }
  }, [product, router])

  if (!product) {
    return null
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price)
  }

  const handleAddToCart = () => {
    alert(`${product.name} ${quantity}개가 장바구니에 추가되었습니다.`)
  }

  const handleBuyNow = () => {
    router.push('/enrollment')
  }

  const ProductIcon = product.keyFeatures[0]?.icon || Package

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* 뒤로가기 버튼 */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/products">
            <Button
              variant="ghost"
              className="gap-2 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4" />
              제품 목록으로
            </Button>
          </Link>
        </div>
      </div>

      {/* 제품 상세 정보 */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* 왼쪽: 이미지 섹션 */}
          <div>
            <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden">
              {product.badge && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge className={`${product.badge.color} text-white px-3 py-1 text-sm`}>
                    {product.badge.text}
                  </Badge>
                </div>
              )}

              {/* 제품 아이콘 표시 */}
              <div className="flex items-center justify-center h-full">
                <div className={`p-8 bg-gradient-to-r ${
                  product.id === 1 ? 'from-purple-600 to-purple-400' :
                  product.id === 2 ? 'from-blue-600 to-blue-400' :
                  product.id === 3 ? 'from-green-600 to-green-400' :
                  product.id === 4 ? 'from-indigo-600 to-indigo-400' :
                  product.id === 5 ? 'from-orange-600 to-orange-400' :
                  product.id === 6 ? 'from-teal-600 to-teal-400' :
                  product.id === 7 ? 'from-pink-600 to-pink-400' :
                  product.id === 8 ? 'from-yellow-600 to-yellow-400' :
                  'from-gray-600 to-gray-400'
                } rounded-full`}>
                  <ProductIcon className="w-32 h-32 text-white" />
                </div>
              </div>

              {/* 액션 버튼들 */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="bg-white/90 hover:bg-white"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="bg-white/90 hover:bg-white"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* 오른쪽: 제품 정보 */}
          <div
            className="flex flex-col"
          >
            {/* 카테고리 */}
            <p className="text-sm font-medium text-purple-600 mb-2">
              {product.category}
            </p>

            {/* 제품명 */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* 평점 */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 font-semibold">{product.rating}</span>
              </div>
              <span className="text-gray-500">({product.reviews.toLocaleString()} 리뷰)</span>
            </div>

            {/* 설명 */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.longDescription}
            </p>

            {/* 가격 */}
            <div className="mb-6">
              {product.originalPrice && (
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ₩{formatPrice(product.price)}
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    ₩{formatPrice(product.originalPrice)}
                  </span>
                  <Badge className="bg-red-500 text-white">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% 할인
                  </Badge>
                </div>
              )}
              {!product.originalPrice && (
                <span className="text-3xl font-bold text-gray-900">
                  ₩{formatPrice(product.price)}
                </span>
              )}
              <p className="text-sm text-gray-500 mt-1">월 구독료 (VAT 별도)</p>
            </div>

            {/* 주요 기능 */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">주요 기능</h3>
              <div className="space-y-3">
                {product.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 수량 선택 및 구매 버튼 */}
            {product.inStock ? (
              <div className="space-y-4">
                {/* 수량 선택 */}
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 font-medium">수량:</span>
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity === 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="px-4 py-2 min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* 구매 버튼 */}
                <div className="flex gap-3">
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    장바구니 담기
                  </Button>
                  <Button
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    onClick={handleBuyNow}
                  >
                    바로 구매하기
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <p className="text-gray-600 font-medium">현재 품절된 상품입니다</p>
                <p className="text-sm text-gray-500 mt-1">입고 알림 신청을 해주세요</p>
              </div>
            )}

            {/* 혜택 정보 */}
            <div className="flex gap-4 mt-6 pt-6 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck className="w-4 h-4 text-purple-600" />
                <span>무료 설치</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ShieldIcon className="w-4 h-4 text-purple-600" />
                <span>품질 보증</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CreditCardIcon className="w-4 h-4 text-purple-600" />
                <span>카드 할부</span>
              </div>
            </div>
          </div>
        </div>

        {/* 탭 섹션 */}
        <div
          className="mt-16"
        >
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="overview">상세 정보</TabsTrigger>
              <TabsTrigger value="features">주요 기능</TabsTrigger>
              <TabsTrigger value="specs">제품 사양</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-8">
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">제품 상세 정보</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {product.longDescription}
                  </p>
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">이런 분들께 추천합니다</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• 창업을 준비 중이신 예비 창업자</li>
                      <li>• 효율적인 매장 운영을 원하시는 사장님</li>
                      <li>• 체계적인 고객 관리가 필요하신 분</li>
                      <li>• 매출 증대를 목표로 하시는 분</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="mt-8">
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">주요 기능</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {product.keyFeatures.map((feature, index) => {
                    const Icon = feature.icon
                    return (
                      <div
                        key={index}
                        className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Icon className="w-6 h-6 text-purple-600" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="specs" className="mt-8">
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">제품 사양</h2>
                <div className="space-y-4">
                  {product.specifications?.map((spec, index) => (
                    <div
                      key={index}
                      className="flex justify-between py-3 border-b last:border-0"
                    >
                      <span className="text-gray-600">{spec.label}</span>
                      <span className="font-medium text-gray-900">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}