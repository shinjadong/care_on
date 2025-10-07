import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST - 새 패키지 생성
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // 1. 패키지 생성
    const { data: packageData, error: packageError } = await supabase
      .from('packages')
      .insert({
        name: body.name,
        monthly_fee: body.monthly_fee,
        contract_period: body.contract_period ?? 36,
        free_period: body.free_period ?? 12,
        closure_refund_rate: body.closure_refund_rate ?? 0,
        included_services: body.included_services,
        description: body.description,
        active: body.active ?? true
      })
      .select()
      .single()

    if (packageError) {
      console.error('Error creating package:', packageError)
      throw packageError
    }

    // 2. 패키지 아이템 생성 (선택된 상품들)
    if (body.product_items && body.product_items.length > 0) {
      const items = body.product_items.map((item: any) => ({
        package_id: packageData.package_id,
        product_id: item.product_id,
        quantity: item.quantity ?? 1,
        item_fee: item.item_fee
      }))

      const { error: itemsError } = await supabase
        .from('package_items')
        .insert(items)

      if (itemsError) {
        console.error('Error creating package items:', itemsError)
        // 패키지 아이템 생성 실패 시 패키지도 롤백
        await supabase
          .from('packages')
          .delete()
          .eq('package_id', packageData.package_id)

        throw itemsError
      }
    }

    return NextResponse.json({
      success: true,
      package: packageData
    })
  } catch (error) {
    console.error('[Admin Packages API] POST error:', error)
    return NextResponse.json(
      { error: '패키지 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// GET - 패키지 목록 조회 (패키지 아이템 포함)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active') === 'true'

    let query = supabase
      .from('packages')
      .select(`
        *,
        package_items(
          *,
          products(*)
        )
      `)

    if (activeOnly) {
      query = query.eq('active', true)
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching packages:', error)
      throw error
    }

    return NextResponse.json({
      success: true,
      packages: data || []
    })
  } catch (error) {
    console.error('[Admin Packages API] GET error:', error)
    return NextResponse.json(
      { error: '패키지 목록 조회에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// PUT - 패키지 수정
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    if (!body.package_id) {
      return NextResponse.json(
        { error: '패키지 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('packages')
      .update({
        name: body.name,
        monthly_fee: body.monthly_fee,
        contract_period: body.contract_period,
        free_period: body.free_period,
        closure_refund_rate: body.closure_refund_rate,
        included_services: body.included_services,
        description: body.description,
        active: body.active,
        updated_at: new Date().toISOString()
      })
      .eq('package_id', body.package_id)
      .select()
      .single()

    if (error) {
      console.error('Error updating package:', error)
      throw error
    }

    return NextResponse.json({
      success: true,
      package: data
    })
  } catch (error) {
    console.error('[Admin Packages API] PUT error:', error)
    return NextResponse.json(
      { error: '패키지 수정에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// DELETE - 패키지 삭제 (soft delete)
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const packageId = searchParams.get('id')

    if (!packageId) {
      return NextResponse.json(
        { error: '패키지 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // Soft delete: active = false
    const { error } = await supabase
      .from('packages')
      .update({
        active: false,
        updated_at: new Date().toISOString()
      })
      .eq('package_id', packageId)

    if (error) {
      console.error('Error deleting package:', error)
      throw error
    }

    return NextResponse.json({
      success: true,
      message: '패키지가 비활성화되었습니다.'
    })
  } catch (error) {
    console.error('[Admin Packages API] DELETE error:', error)
    return NextResponse.json(
      { error: '패키지 삭제에 실패했습니다.' },
      { status: 500 }
    )
  }
}
