import { createClient } from './server'

export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  available?: boolean
  searchTerm?: string
}

// 기존 DB 구조에 맞춘 Product 타입
export interface Product {
  product_id: string
  name: string
  category: string
  provider: string | null
  monthly_fee: number
  description: string | null
  available: boolean
  closure_refund_rate: number
  max_discount_rate: number
  discount_tiers: {
    rate: number
    condition: string
    min_quantity: number
  }[]
  image_url?: string | null
  created_at: string
  updated_at: string
}

export async function getProducts(filters?: ProductFilters) {
  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select(`
      *
    `)
    .eq('available', true)

  // Apply filters
  if (filters) {
    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category)
    }
    if (filters.minPrice !== undefined) {
      query = query.gte('monthly_fee', filters.minPrice)
    }
    if (filters.maxPrice !== undefined) {
      query = query.lte('monthly_fee', filters.maxPrice)
    }
    if (filters.available !== undefined) {
      query = query.eq('available', filters.available)
    }
    if (filters.searchTerm) {
      query = query.or(`name.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`)
    }
  }

  const { data, error } = await query
    .order('created_at', { ascending: false })

  return { data, error }
}

export async function getProductById(product_id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select(`
      *
    `)
    .eq('product_id', product_id)
    .single()

  return { data, error }
}

// products 테이블에서 고유 카테고리 목록 가져오기
export async function getProductCategories() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('category')
    .eq('available', true)

  if (error) return { data: [], error }

  // 중복 제거하여 카테고리 목록 생성
  const categories = [...new Set(data?.map((p: { category: string }) => p.category) || [])]
    .filter(Boolean)
    .sort() as string[]

  return {
    data: categories.map((name, index) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      display_order: index
    })),
    error: null
  }
}

// 패키지와 제품 관련 함수들
export async function getPackages() {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('packages')
    .select(`
      *,
      package_items(
        *,
        products(*)
      )
    `)
    .eq('active', true)
    .order('created_at', { ascending: false })

  return { data, error }
}

export async function getPackageById(packageId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('packages')
    .select(`
      *,
      package_items(
        *,
        products(*)
      )
    `)
    .eq('package_id', packageId)
    .single()

  return { data, error }
}

// 계약과 제품 연결 함수
export async function getContractItems(contractId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('contract_items')
    .select(`
      *,
      products(*)
    `)
    .eq('contract_id', contractId)
    .order('created_at', { ascending: true })

  return { data, error }
}

export async function createContractItem(
  contractId: string,
  productId: string,
  quantity: number,
  fee: number,
  discountRate?: number,
  discountReason?: string
) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('contract_items')
    .insert({
      contract_id: contractId,
      product_id: productId,
      quantity,
      fee,
      original_price: fee,
      discount_rate: discountRate || 0,
      discount_reason: discountReason
    })
    .select()
    .single()

  return { data, error }
}
