import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST - 새 상품 등록
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from('products')
      .insert({
        name: body.name,
        category: body.category,
        provider: body.provider,
        monthly_fee: body.monthly_fee,
        description: body.description,
        available: body.available ?? true,
        closure_refund_rate: body.closure_refund_rate ?? 0,
        max_discount_rate: body.max_discount_rate ?? 0,
        discount_tiers: body.discount_tiers ?? [],
        image_url: body.image_url ?? null
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating product:', error)
      throw error
    }

    return NextResponse.json({
      success: true,
      product: data
    })
  } catch (error) {
    console.error('[Admin Products API] POST error:', error)
    return NextResponse.json(
      { error: '상품 등록에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// PUT - 상품 수정
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    if (!body.product_id) {
      return NextResponse.json(
        { error: '상품 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('products')
      .update({
        name: body.name,
        category: body.category,
        provider: body.provider,
        monthly_fee: body.monthly_fee,
        description: body.description,
        available: body.available,
        closure_refund_rate: body.closure_refund_rate ?? 0,
        max_discount_rate: body.max_discount_rate ?? 0,
        discount_tiers: body.discount_tiers ?? [],
        image_url: body.image_url,
        updated_at: new Date().toISOString()
      })
      .eq('product_id', body.product_id)
      .select()
      .single()

    if (error) {
      console.error('Error updating product:', error)
      throw error
    }

    return NextResponse.json({
      success: true,
      product: data
    })
  } catch (error) {
    console.error('[Admin Products API] PUT error:', error)
    return NextResponse.json(
      { error: '상품 수정에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// DELETE - 상품 삭제 (soft delete)
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('id')

    if (!productId) {
      return NextResponse.json(
        { error: '상품 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // Soft delete: available = false
    const { error } = await supabase
      .from('products')
      .update({
        available: false,
        updated_at: new Date().toISOString()
      })
      .eq('product_id', productId)

    if (error) {
      console.error('Error deleting product:', error)
      throw error
    }

    return NextResponse.json({
      success: true,
      message: '상품이 휴지통으로 이동되었습니다.'
    })
  } catch (error) {
    console.error('[Admin Products API] DELETE error:', error)
    return NextResponse.json(
      { error: '상품 삭제에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// GET - 모든 상품 조회 (관리자용 - available false 포함)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const category = searchParams.get('category')
    const showAvailableOnly = searchParams.get('available') === 'true'

    let query = supabase
      .from('products')
      .select('*')

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (showAvailableOnly) {
      query = query.eq('available', true)
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products:', error)
      throw error
    }

    return NextResponse.json({
      success: true,
      products: data || []
    })
  } catch (error) {
    console.error('[Admin Products API] GET error:', error)
    return NextResponse.json(
      { error: '상품 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}
