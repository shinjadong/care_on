'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import { cn } from '@/lib/utils'

interface Product {
  product_id: string
  name: string
  category: string
  monthly_fee: number
  provider?: string
  image_url?: string
}

interface MobileProductCardProps {
  product: Product
}

export default function MobileProductCard({ product }: MobileProductCardProps) {
  const [imageError, setImageError] = useState(false)
  const { addItem, items } = useCartStore()
  const isInCart = items.some(item => item.product_id === product.product_id)

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

  const handleAddToCart = () => {
    addItem({
      product_id: product.product_id,
      name: product.name,
      category: product.category,
      monthly_fee: product.monthly_fee,
      provider: product.provider,
      quantity: 1,
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
      {/* Product Image */}
      <div className="relative w-full aspect-video bg-gray-100">
        {product.image_url && !imageError ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <ShoppingCart size={48} />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category Badge */}
        <Badge
          className={cn(
            "w-fit mb-2 text-xs font-medium",
            categoryColors[product.category] || categoryColors['기타']
          )}
        >
          {product.category}
        </Badge>

        {/* Product Name */}
        <h3 className="font-semibold text-base mb-1 line-clamp-2">
          {product.name}
        </h3>

        {/* Provider */}
        {product.provider && (
          <p className="text-sm text-gray-600 mb-3">
            {product.provider}
          </p>
        )}

        {/* Price and Button */}
        <div className="mt-auto pt-3 border-t">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-lg font-bold text-[#009da2]">
                {product.monthly_fee.toLocaleString()}원
              </p>
              <p className="text-xs text-gray-500">/월</p>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={isInCart}
            className={cn(
              "w-full min-h-[44px] font-medium transition-colors",
              isInCart
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-[#009da2] hover:bg-[#008a8f] text-white"
            )}
          >
            <ShoppingCart className="mr-2" size={18} />
            {isInCart ? '담기 완료' : '담기'}
          </Button>
        </div>
      </div>
    </div>
  )
}
