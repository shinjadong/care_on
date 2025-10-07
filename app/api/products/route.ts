import { NextRequest, NextResponse } from 'next/server'
import { getProducts, ProductFilters } from '@/lib/supabase/products'

// GET: 상품 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters: ProductFilters = {
      category: searchParams.get('category') || undefined,
      minPrice: searchParams.get('minPrice')
        ? parseFloat(searchParams.get('minPrice')!)
        : undefined,
      maxPrice: searchParams.get('maxPrice')
        ? parseFloat(searchParams.get('maxPrice')!)
        : undefined,
      inStock: searchParams.get('inStock')
        ? searchParams.get('inStock') === 'true'
        : undefined,
      featured: searchParams.get('featured')
        ? searchParams.get('featured') === 'true'
        : undefined,
      searchTerm: searchParams.get('search') || undefined
    }

    const { data, error } = await getProducts(filters)

    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json(
        { error: '상품 목록을 불러오는데 실패했습니다.' },
        { status: 500 }
      )
    }

    // 카테고리별로 그룹화
    const groupedProducts = (data || []).reduce((acc: any, product: any) => {
      const category = product.category
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(product)
      return acc
    }, {})

    return NextResponse.json({
      success: true,
      products: data || [],
      grouped: groupedProducts,
      categories: Object.keys(groupedProducts),
      count: data?.length || 0
    })

  } catch (error) {
    console.error('[Products API] GET error:', error)
    return NextResponse.json(
      { error: '상품 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// Note: POST and PUT methods should be implemented in admin API routes with proper authentication
