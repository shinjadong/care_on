import { NextRequest, NextResponse } from 'next/server'
import { NaverCommerceAuth } from '@/lib/naver-commerce/auth'
import { NaverCommerceOrders } from '@/lib/naver-commerce/orders'

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    // 환경변수에서 네이버 커머스 인증 정보 가져오기 (함수 내부에서 읽기)
    const config = {
      clientId: process.env.NAVER_COMMERCE_CLIENT_ID || '5NKxpyt3CoF2xn5bHwKduH',
      clientSecret: process.env.NAVER_COMMERCE_CLIENT_SECRET || '$2a$04$3tPVEEvnG35Smx7tcXrtfu',
      sellerId: process.env.NAVER_COMMERCE_SELLER_ID || 'ncp_1of59r_01'
    }

    // 인증 정보 확인
    if (!config.clientId || !config.clientSecret) {
      return NextResponse.json(
        { error: '네이버 커머스 인증 정보가 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    const auth = new NaverCommerceAuth(config)
    const orders = new NaverCommerceOrders(auth)

    // 주문 상세 조회
    const orderDetail = await orders.getOrderDetail(params.orderId)

    return NextResponse.json(orderDetail)

  } catch (error) {
    console.error('네이버 커머스 주문 상세 조회 오류:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '주문 상세 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
