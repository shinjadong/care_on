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

// GET: 견적서 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contract_id = searchParams.get('contract_id')

    if (!contract_id) {
      return NextResponse.json(
        { error: '계약 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // 계약 정보와 함께 관련 데이터 조회
    const { data: contract, error } = await supabase
      .from('contracts')
      .select(`
        *,
        customer:customers!customer_id(
          customer_code,
          business_name,
          owner_name,
          phone,
          email,
          address,
          business_registration
        ),
        package:packages!package_id(
          name,
          monthly_fee,
          contract_period,
          free_period,
          closure_refund_rate,
          included_services,
          description
        ),
        contract_items:contract_items(
          quantity,
          fee,
          product:products!product_id(
            name,
            category,
            provider,
            monthly_fee,
            description
          )
        )
      `)
      .eq('id', contract_id)
      .single()

    if (error) throw error

    // 견적서 데이터 구성
    const quote = {
      contract_info: {
        contract_number: contract.contract_number,
        customer_number: contract.customer_number,
        status: contract.status,
        created_at: contract.created_at,
        total_monthly_fee: contract.total_monthly_fee
      },
      customer_info: contract.customer,
      package_info: contract.package,
      service_items: contract.contract_items || [],
      billing_info: {
        contract_period: contract.contract_period,
        free_period: contract.free_period,
        billing_day: contract.billing_day,
        start_date: contract.start_date,
        end_date: contract.end_date
      },
      refund_policy: {
        refund_eligible: contract.refund_eligible,
        closure_refund_rate: contract.package?.closure_refund_rate || 0
      }
    }

    return NextResponse.json({ quote })

  } catch (error) {
    console.error('[Quotes API] GET error:', error)
    return NextResponse.json(
      { error: '견적서 조회에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// POST: 견적서 생성/업데이트
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      contract_id,
      customer_id,
      package_id,
      custom_items = [],
      manager_name,
      quote_notes,
      discount_amount = 0
    } = body

    // 필수 필드 검증
    if (!contract_id) {
      return NextResponse.json(
        { error: '계약 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // 1. 패키지 기반 견적인 경우
    if (package_id) {
      // 패키지 정보 조회
      const { data: packageData, error: packageError } = await supabase
        .from('packages')
        .select(`
          *,
          package_items:package_items(
            quantity,
            item_fee,
            product:products!product_id(*)
          )
        `)
        .eq('package_id', package_id)
        .single()

      if (packageError) throw packageError

      // 계약에 패키지 연결 및 총액 계산
      let total_fee = packageData.monthly_fee - discount_amount

      // contract_items 테이블에 패키지 구성 상품들 추가
      const contractItems = packageData.package_items.map((item: any) => ({
        contract_id,
        product_id: item.product.product_id,
        quantity: item.quantity,
        fee: item.item_fee
      }))

      // 기존 contract_items 삭제 후 새로 추가
      await supabase
        .from('contract_items')
        .delete()
        .eq('contract_id', contract_id)

      const { error: itemsError } = await supabase
        .from('contract_items')
        .insert(contractItems)

      if (itemsError) throw itemsError

      // 계약 정보 업데이트
      const { error: contractError } = await supabase
        .from('contracts')
        .update({
          package_id,
          total_monthly_fee: total_fee,
          status: 'quoted',
          processed_by: manager_name,
          processed_at: new Date().toISOString(),
          admin_notes: JSON.stringify({
            quote_type: 'package',
            package_name: packageData.name,
            discount_amount,
            quote_notes,
            items: packageData.package_items
          })
        })
        .eq('id', contract_id)

      if (contractError) throw contractError
    }

    // 2. 맞춤형 견적인 경우 (custom_items 사용)
    if (custom_items.length > 0) {
      // contract_items에 맞춤 상품들 추가
      await supabase
        .from('contract_items')
        .delete()
        .eq('contract_id', contract_id)

      const { error: itemsError } = await supabase
        .from('contract_items')
        .insert(custom_items.map((item: any) => ({
          contract_id,
          product_id: item.product_id,
          quantity: item.quantity,
          fee: item.fee
        })))

      if (itemsError) throw itemsError

      // 총액 계산
      const total_fee = custom_items.reduce((sum: number, item: any) => 
        sum + (item.fee * item.quantity), 0) - discount_amount

      // 계약 정보 업데이트
      const { error: contractError } = await supabase
        .from('contracts')
        .update({
          package_id: null, // 맞춤형이므로 package_id는 null
          total_monthly_fee: total_fee,
          status: 'quoted',
          processed_by: manager_name,
          processed_at: new Date().toISOString(),
          admin_notes: JSON.stringify({
            quote_type: 'custom',
            discount_amount,
            quote_notes,
            items: custom_items
          })
        })
        .eq('id', contract_id)

      if (contractError) throw contractError
    }

    return NextResponse.json({
      message: '견적서가 성공적으로 생성되었습니다.',
      quote_type: package_id ? 'package' : 'custom',
      contract_id
    })

  } catch (error) {
    console.error('[Quotes API] POST error:', error)
    return NextResponse.json(
      { error: '견적서 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
}