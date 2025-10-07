import { NextRequest, NextResponse } from 'next/server'
import { NaverCommerceAuth } from '@/lib/naver-commerce/auth'
import { NaverCommerceOrders } from '@/lib/naver-commerce/orders'

export async function GET(request: NextRequest) {
  try {
    // 환경변수에서 네이버 커머스 인증 정보 가져오기 (함수 내부에서 읽기)
    const config = {
      clientId: process.env.NAVER_COMMERCE_CLIENT_ID || '5NKxpyt3CoF2xn5bHwKduH',
      clientSecret: process.env.NAVER_COMMERCE_CLIENT_SECRET || '$2a$04$3tPVEEvnG35Smx7tcXrtfu',
      sellerId: process.env.NAVER_COMMERCE_SELLER_ID || 'ncp_1of59r_01'
    }

    // 인증 정보 확인
    if (!config.clientId || !config.clientSecret) {
      console.error('환경변수 확인:', {
        clientId: !!process.env.NAVER_COMMERCE_CLIENT_ID,
        clientSecret: !!process.env.NAVER_COMMERCE_CLIENT_SECRET
      })
      return NextResponse.json(
        { error: '네이버 커머스 인증 정보가 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const orderId = searchParams.get('orderId')

    const auth = new NaverCommerceAuth(config)
    const orders = new NaverCommerceOrders(auth)

    // 특정 주문 상세 조회
    if (orderId) {
      const orderDetail = await orders.getOrderDetail(orderId)
      return NextResponse.json(orderDetail)
    }

    // 조회 모드 확인 (블로거 방식 지원)
    const queryMode = searchParams.get('queryMode') // 'standard' | 'changed' | 'recent'
    const lastChangedType = searchParams.get('lastChangedType') as 'PAYED' | 'DISPATCHED' | 'DELIVERED' | null
    const hours = searchParams.get('hours') ? parseInt(searchParams.get('hours')!) : 3

    // 블로거 방식 1: 변경된 주문 조회 (lastChangedType 사용)
    if (queryMode === 'changed' && lastChangedType) {
      console.log(`블로거 방식: ${lastChangedType} 상태 주문 조회 (${hours}시간 전부터)`)
      const changedOrders = await orders.getChangedOrders(lastChangedType, hours)
      return NextResponse.json({
        orders: changedOrders,
        totalCount: changedOrders.length,
        page: 0,
        size: changedOrders.length,
        queryMode: 'changed',
        lastChangedType,
        hours,
        message: `최근 ${hours}시간 동안 ${lastChangedType} 상태로 변경된 주문`
      })
    }

    // 블로거 방식 2: 최근 주문 간단 조회
    if (queryMode === 'recent') {
      console.log(`블로거 방식: 최근 ${hours}시간 주문 조회`)
      const recentOrders = await orders.getRecentOrders(hours)
      return NextResponse.json({
        orders: recentOrders,
        totalCount: recentOrders.length,
        page: 0,
        size: recentOrders.length,
        queryMode: 'recent',
        hours,
        message: `최근 ${hours}시간 이내 주문`
      })
    }

    // 기본 방식: 날짜 범위 조회
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const orderStatus = searchParams.get('orderStatus')
    const page = searchParams.get('page')
    const size = searchParams.get('size')

    // 날짜가 지정되지 않은 경우 최근 3시간 주문 조회 (블로거 기본값)
    if (!startDate || !endDate) {
      const recentOrders = await orders.getRecentOrders(3)
      return NextResponse.json({
        orders: recentOrders,
        totalCount: recentOrders.length,
        page: 0,
        size: 100,
        message: '날짜 미지정 - 최근 3시간 주문 조회'
      })
    }

    // 지정된 조건으로 주문 조회
    const result = await orders.getOrderList({
      startDate,
      endDate,
      orderStatus: orderStatus || undefined,
      page: page ? parseInt(page) : 0,
      size: size ? parseInt(size) : 50
    })

    return NextResponse.json(result)

  } catch (error) {
    console.error('네이버 커머스 주문 조회 오류:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '주문 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
