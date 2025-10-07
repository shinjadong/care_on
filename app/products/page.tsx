import { getProducts, getProductCategories, Product } from '@/lib/supabase/products'
import ProductsHeader from './components/ProductsHeader'
import ProductsCTA from './components/ProductsCTA'
import ProductsClientWrapper from './components/ProductsClientWrapper'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  // Get category from search params
  const params = await searchParams
  const selectedCategory = params.category || 'all'

  // Fetch products from database
  const { data: products, error: productsError } = await getProducts(
    selectedCategory === 'all' ? undefined : { category: selectedCategory }
  )

  // Fetch categories from database
  const { data: categories, error: categoriesError } = await getProductCategories()

  if (productsError || categoriesError) {
    return (
      <div className="min-h-screen bg-[#fbfbfb]">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">오류가 발생했습니다</h2>
            <p className="mt-2 text-gray-600">제품 목록을 불러오는 중 문제가 발생했습니다.</p>
          </div>
        </div>
      </div>
    )
  }

  // Map products to frontend format
  const mappedProducts = (products || []).map((product: Product) => ({
    id: product.product_id,
    name: product.name,
    category: product.category,
    price: product.monthly_fee,
    description: product.description || '',
    inStock: product.available,
    provider: product.provider,
    maxDiscountRate: product.max_discount_rate,
    discountTiers: product.discount_tiers,
    imageUrl: product.image_url
  }))

  // Calculate product counts per category
  const productCounts = mappedProducts.reduce((acc: { [key: string]: number }, product: any) => {
    acc[product.category] = (acc[product.category] || 0) + 1
    return acc
  }, {} as { [key: string]: number })
  productCounts['all'] = mappedProducts.length

  return (
    <div className="min-h-screen bg-[#fbfbfb]">
      {/* 헤더 섹션 */}
      <ProductsHeader />

      {/* Client-side wrapper for interactive components */}
      <ProductsClientWrapper
        initialProducts={mappedProducts}
        categories={categories || []}
        productCounts={productCounts}
        initialCategory={selectedCategory}
      />

      {/* CTA 섹션 */}
      <ProductsCTA />
    </div>
  )
}
