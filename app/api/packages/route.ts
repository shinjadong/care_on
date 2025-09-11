import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pkehcfbjotctvneordob.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrZWhjZmJqb3RjdHZuZW9yZG9iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzE5MjY4MSwiZXhwIjoyMDY4NzY4NjgxfQ.fn1IxRxjJZ6gihy_SCvyQrT6Vx3xb1yMaVzztOsLeyk',
  {
    auth: { autoRefreshToken: false, persistSession: false },
    db: { schema: 'public' }
  }
)

// GET: 패키지 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const include_products = searchParams.get('include_products') === 'true'
    const active_only = searchParams.get('active_only') === 'true'

    let query = supabase
      .from('packages')
      .select(include_products ? `
        *,
        package_items:package_items(
          quantity,
          item_fee,
          product:products!product_id(
            name,
            category,
            provider,
            monthly_fee,
            description
          )
        )
      ` : '*')
      .order('name', { ascending: true })

    if (active_only) {
      query = query.eq('active', true)
    }

    const { data, error } = await query

    if (error) throw error

    // 각 패키지의 실제 총액 계산 (무료기간 고려)
    const packagesWithCalculations = data.map((pkg: any) => {
      if (pkg.package_items) {
        const totalBeforeFree = pkg.package_items.reduce((sum: number, item: any) => 
          sum + (item.fee * item.quantity), 0
        )
        const totalAfterFree = pkg.monthly_fee
        
        pkg.calculated_totals = {
          total_before_free_period: totalBeforeFree,
          total_after_free_period: totalAfterFree,
          savings_during_free_period: totalBeforeFree * pkg.free_period,
          total_contract_value: (totalBeforeFree * pkg.free_period) + (totalAfterFree * (pkg.contract_period - pkg.free_period))
        }
      }
      
      return pkg
    })

    return NextResponse.json({
      packages: packagesWithCalculations,
      total_count: data.length
    })

  } catch (error) {
    console.error('[Packages API] GET error:', error)
    return NextResponse.json(
      { error: '패키지 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// POST: 새 패키지 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      monthly_fee,
      contract_period = 36,
      free_period = 12,
      closure_refund_rate = 100,
      included_services,
      description,
      active = true,
      product_items = [] // 포함할 상품 목록
    } = body

    // 필수 필드 검증
    if (!name) {
      return NextResponse.json(
        { error: '패키지명은 필수입니다.' },
        { status: 400 }
      )
    }

    // 트랜잭션으로 패키지 생성
    const { data: newPackage, error: packageError } = await supabase
      .from('packages')
      .insert([{
        name,
        monthly_fee: parseInt(monthly_fee) || 0,
        contract_period: parseInt(contract_period),
        free_period: parseInt(free_period),
        closure_refund_rate: parseInt(closure_refund_rate),
        included_services,
        description,
        active
      }])
      .select()
      .single()

    if (packageError) throw packageError

    // 패키지 구성 상품들 추가
    if (product_items.length > 0) {
      const packageItems = product_items.map((item: any) => ({
        package_id: newPackage.package_id,
        product_id: item.product_id,
        quantity: item.quantity || 1,
        item_fee: item.item_fee || 0
      }))

      const { error: itemsError } = await supabase
        .from('package_items')
        .insert(packageItems)

      if (itemsError) {
        console.error('Package items creation failed:', itemsError)
        // 패키지는 생성되었지만 구성 상품 추가 실패
      }
    }

    return NextResponse.json({
      message: '패키지가 성공적으로 생성되었습니다.',
      package: newPackage
    })

  } catch (error) {
    console.error('[Packages API] POST error:', error)
    return NextResponse.json(
      { error: '패키지 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// PUT: 패키지 업데이트
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { package_id, product_items, ...updateData } = body

    if (!package_id) {
      return NextResponse.json(
        { error: '패키지 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // 패키지 기본 정보 업데이트
    const { data, error } = await supabase
      .from('packages')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('package_id', package_id)
      .select()
      .single()

    if (error) throw error

    // 패키지 구성 상품 업데이트 (있는 경우)
    if (product_items) {
      // 기존 구성 삭제 후 새로 추가
      await supabase
        .from('package_items')
        .delete()
        .eq('package_id', package_id)

      if (product_items.length > 0) {
        const packageItems = product_items.map((item: any) => ({
          package_id,
          product_id: item.product_id,
          quantity: item.quantity || 1,
          item_fee: item.item_fee || 0
        }))

        const { error: itemsError } = await supabase
          .from('package_items')
          .insert(packageItems)

        if (itemsError) {
          console.error('Package items update failed:', itemsError)
        }
      }
    }

    return NextResponse.json({
      message: '패키지가 성공적으로 업데이트되었습니다.',
      package: data
    })

  } catch (error) {
    console.error('[Packages API] PUT error:', error)
    return NextResponse.json(
      { error: '패키지 업데이트에 실패했습니다.' },
      { status: 500 }
    )
  }
}