import ProductsHeader from './components/ProductsHeader'
import ProductsCTA from './components/ProductsCTA'
import ProductsClientWrapper from './components/ProductsClientWrapper'

// Clean Architecture: Use Cases
import { GetProductsUseCase } from '@/lib/application/product'
import { PrismaProductRepository } from '@/lib/infrastructure/database/repositories/PrismaProductRepository'
import { prisma } from '@/lib/infrastructure/database/prisma/client'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  // Get category from search params
  const params = await searchParams
  const selectedCategory = params.category || 'all'

  try {
    // Clean Architecture: Use Case execution
    const repository = new PrismaProductRepository(prisma)
    const getProductsUseCase = new GetProductsUseCase(repository)

    // Get products with filters
    const result = await getProductsUseCase.execute({
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      available: true,
      page: 1,
      pageSize: 100
    })

    // Get categories
    const categories = await repository.getCategories()

    // Map products to frontend format (Domain entities → UI format)
    const mappedProducts = result.products.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.monthlyFee,
      description: product.description || '',
      inStock: product.available,
      provider: product.provider,
      maxDiscountRate: product.maxDiscountRate,
      discountTiers: product.discountTiers || [],
      imageUrl: product.imageUrl
    }))

    // Calculate product counts per category
    const productCounts = mappedProducts.reduce((acc: { [key: string]: number }, product: any) => {
      acc[product.category] = (acc[product.category] || 0) + 1
      return acc
    }, {} as { [key: string]: number })
    productCounts['all'] = mappedProducts.length

    // Map categories to frontend format
    const mappedCategories = categories.map((name, index) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      display_order: index
    }))

    return (
      <div className="min-h-screen bg-[#fbfbfb]">
        {/* 헤더 섹션 */}
        <ProductsHeader />

        {/* Client-side wrapper for interactive components */}
        <ProductsClientWrapper
          initialProducts={mappedProducts}
          categories={mappedCategories}
          productCounts={productCounts}
          initialCategory={selectedCategory}
        />

        {/* CTA 섹션 */}
        <ProductsCTA />
      </div>
    )
  } catch (error) {
    console.error('Failed to load products:', error)
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
}