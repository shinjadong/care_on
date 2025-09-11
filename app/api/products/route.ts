import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: { autoRefreshToken: false, persistSession: false },
    db: { schema: 'public' }
  }
)

// GET: 상품 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const available = searchParams.get('available')

    let query = supabase
      .from('products')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true })

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (available !== null) {
      query = query.eq('available', available === 'true')
    }

    const { data, error } = await query

    if (error) throw error

    // 카테고리별로 그룹화
    const groupedProducts = data.reduce((acc: any, product: any) => {
      const category = product.category
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(product)
      return acc
    }, {})

    return NextResponse.json({
      products: data,
      grouped: groupedProducts,
      categories: Object.keys(groupedProducts)
    })

  } catch (error) {
    console.error('[Products API] GET error:', error)
    return NextResponse.json(
      { error: '상품 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// POST: 새 상품 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      category,
      provider,
      monthly_fee,
      description,
      available,
      closure_refund_rate
    } = body

    // 필수 필드 검증
    if (!name || !category) {
      return NextResponse.json(
        { error: '상품명과 카테고리는 필수입니다.' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{
        name,
        category,
        provider,
        monthly_fee: parseInt(monthly_fee) || 0,
        description,
        available: available !== false,
        closure_refund_rate: parseInt(closure_refund_rate) || 0
      }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      message: '상품이 성공적으로 생성되었습니다.',
      product: data
    })

  } catch (error) {
    console.error('[Products API] POST error:', error)
    return NextResponse.json(
      { error: '상품 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// PUT: 상품 업데이트
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { product_id, ...updateData } = body

    if (!product_id) {
      return NextResponse.json(
        { error: '상품 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('products')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('product_id', product_id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      message: '상품이 성공적으로 업데이트되었습니다.',
      product: data
    })

  } catch (error) {
    console.error('[Products API] PUT error:', error)
    return NextResponse.json(
      { error: '상품 업데이트에 실패했습니다.' },
      { status: 500 }
    )
  }
}