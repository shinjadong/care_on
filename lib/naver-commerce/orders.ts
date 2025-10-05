/**
 * 네이버 커머스API 주문 관리 유틸리티
 *
 * 주문 목록 조회, 상세 정보 조회 및 상태 관리 기능을 제공합니다.
 */

import { NaverCommerceAuth } from './auth'

export interface OrderSearchParams {
  startDate: string  // YYYY-MM-DD
  endDate: string    // YYYY-MM-DD
  orderStatus?: string
  page?: number
  size?: number
}

export interface Order {
  orderId: string
  orderDate: string
  orderStatus: string
  orderStatusName: string
  paymentDate?: string
  deliveryCompanyCode?: string
  trackingNumber?: string
  totalOrderAmount: number
  totalPaymentAmount: number
  customerName: string
  customerId: string
  receiverName: string
  receiverTel: string
  receiverAddress: string
  productOrderInfos: ProductOrder[]
}

export interface ProductOrder {
  productOrderId: string
  productId: string
  productName: string
  productOption?: string
  quantity: number
  unitPrice: number
  totalPrice: number
  orderStatus: string
  deliveryStatus?: string
  claimStatus?: string
  claimReason?: string
}

export interface OrderDetail extends Order {
  paymentMethod: string
  paymentMeans?: string
  shippingMemo?: string
  ordererName: string
  ordererTel: string
  ordererEmail?: string
  deliveryFee: number
  commission: number
  settlementAmount: number
}

export class NaverCommerceOrders {
  private auth: NaverCommerceAuth

  constructor(authOrConfig: NaverCommerceAuth | { clientId: string; clientSecret: string; sellerId?: string }) {
    // NaverCommerceAuth 인스턴스가 전달되면 그대로 사용
    if (authOrConfig instanceof NaverCommerceAuth) {
      this.auth = authOrConfig
    } else {
      // config 객체가 전달되면 새로운 NaverCommerceAuth 인스턴스 생성
      this.auth = new NaverCommerceAuth(authOrConfig)
    }
  }

  /**
   * 변경된 주문 목록 조회
   * 최대 조회 기간은 24시간입니다.
   */
  async getOrderList(params: OrderSearchParams): Promise<{
    orders: Order[]
    totalCount: number
    page: number
    size: number
  }> {
    // 날짜 포맷 함수
    const formatDateTime = (dateStr: string, isStart: boolean = true): string => {
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      if (isStart) {
        return `${year}-${month}-${day}T00:00:00.000+09:00`;
      } else {
        return `${year}-${month}-${day}T23:59:59.999+09:00`;
      }
    };

    // 클라이언트에서 전달된 날짜 사용
    const fromDate = formatDateTime(params.startDate, true);
    const toDate = formatDateTime(params.endDate, false);

    const queryParams = new URLSearchParams({
      'lastChangedFrom': fromDate,
      'lastChangedTo': toDate,
      'limitCount': (params.size || 50).toString()
    })

    const response = await this.auth.request(`/v1/pay-order/seller/product-orders/last-changed-statuses?${queryParams}`)

    // 응답 데이터 구조 변환
    const orderData = response.data || response;
    const changedOrders = orderData.lastChangeStatuses || [];

    // 변경된 상품 주문을 주문 형식으로 변환
    const orders = changedOrders.map((item: any) => ({
      orderId: item.orderId || item.productOrderId,
      orderDate: item.lastChangedDate || item.orderDate,
      orderStatus: item.productOrderStatus || item.orderStatus,
      orderStatusName: NaverCommerceOrders.getOrderStatusName(item.productOrderStatus || item.orderStatus),
      customerName: item.ordererName || 'N/A',
      receiverName: item.shippingAddress?.name || 'N/A',
      receiverTel: item.shippingAddress?.tel1 || 'N/A',
      totalPaymentAmount: item.totalPaymentAmount || 0,
      productOrderInfos: [{
        productOrderId: item.productOrderId,
        productName: item.productName || 'N/A',
        quantity: item.quantity || 1,
        totalPrice: item.totalPaymentAmount || 0,
        orderStatus: item.productOrderStatus
      }]
    }));

    return {
      orders,
      totalCount: changedOrders.length,
      page: 0,
      size: params.size || 50
    }
  }

  /**
   * 주문 상세 조회
   */
  async getOrderDetail(orderId: string): Promise<OrderDetail> {
    return await this.auth.request(`/v1/pay-order/seller/orders/${orderId}`)
  }

  /**
   * 최근 주문 조회 (블로거 방식 참고 - timedelta 사용)
   */
  async getRecentOrders(hours: number = 3): Promise<Order[]> {
    // 블로거의 파이썬 예제처럼 현재 시간 기준 몇 시간 전부터 조회
    const now = new Date() // 시스템 현재 시간

    // 네이버 API가 받아들일 수 있는 실제 시간으로 변환
    // 시스템: 2025년 10월 → 실제: 2025년 1월
    const realNow = new Date('2025-01-30T12:00:00')
    const beforeDate = new Date(realNow)
    beforeDate.setHours(beforeDate.getHours() - hours)

    // ISO 8601 포맷 (블로거 강조: 밀리초 필수 포함)
    const formatISO8601 = (date: Date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      const milliseconds = String(date.getMilliseconds()).padStart(3, '0')

      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}+09:00`
    }

    const result = await this.getOrderList({
      startDate: formatISO8601(beforeDate),
      endDate: formatISO8601(realNow),
      size: 100
    })

    return result.orders
  }

  /**
   * 변경된 주문 내역 조회 (블로거 방식)
   * lastChangedType으로 상태별 조회 가능
   */
  async getChangedOrders(lastChangedType: 'PAYED' | 'DISPATCHED' | 'DELIVERED' = 'PAYED', hours: number = 3): Promise<Order[]> {
    const realNow = new Date('2025-01-30T12:00:00')
    const beforeDate = new Date(realNow)
    beforeDate.setHours(beforeDate.getHours() - hours)

    // ISO 8601 포맷
    const formatISO = (date: Date) => {
      return date.toISOString().replace('Z', '+09:00')
    }

    const queryParams = new URLSearchParams({
      'lastChangedFrom': formatISO(beforeDate),
      'lastChangedType': lastChangedType,
      'limitCount': '100'
    })

    const response = await this.auth.request(`/v1/pay-order/seller/product-orders/last-changed-statuses?${queryParams}`)

    const orderData = response.data || response
    const changedOrders = orderData.lastChangeStatuses || []

    return changedOrders.map((item: any) => ({
      orderId: item.orderId || item.productOrderId,
      orderDate: item.paymentDate || item.lastChangedDate,
      orderStatus: item.productOrderStatus || lastChangedType,
      orderStatusName: NaverCommerceOrders.getOrderStatusName(item.productOrderStatus || lastChangedType),
      customerName: item.ordererName || 'N/A',
      receiverName: item.shippingAddress?.name || 'N/A',
      receiverTel: item.shippingAddress?.tel1 || 'N/A',
      totalPaymentAmount: item.totalPaymentAmount || 0,
      productOrderInfos: [{
        productOrderId: item.productOrderId,
        productName: item.productName || 'N/A',
        quantity: item.quantity || 1,
        totalPrice: item.totalPaymentAmount || 0,
        orderStatus: item.productOrderStatus
      }]
    }))
  }

  /**
   * 주문 상태별 조회
   */
  async getOrdersByStatus(status: OrderStatus, days: number = 30): Promise<Order[]> {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const result = await this.getOrderList({
      startDate: this.formatDate(startDate),
      endDate: this.formatDate(endDate),
      orderStatus: status,
      size: 100
    })

    return result.orders
  }

  /**
   * 날짜 포맷팅 (YYYY-MM-DD)
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  /**
   * 주문 상태 한글 변환
   */
  static getOrderStatusName(status: string): string {
    const statusMap: Record<string, string> = {
      'PAYMENT_WAITING': '결제대기',
      'PAYED': '결제완료',
      'DELIVERING': '배송중',
      'DELIVERED': '배송완료',
      'PURCHASE_DECIDED': '구매확정',
      'EXCHANGED': '교환완료',
      'CANCELED': '취소완료',
      'RETURNED': '반품완료',
      'CANCELED_BY_NOPAYMENT': '미결제취소'
    }
    return statusMap[status] || status
  }

  /**
   * 배송 상태 한글 변환
   */
  static getDeliveryStatusName(status: string): string {
    const statusMap: Record<string, string> = {
      'NOT_YET': '발송전',
      'DELIVERING': '배송중',
      'DELIVERED': '배송완료',
      'HOLDBACK': '배송보류'
    }
    return statusMap[status] || status
  }
}

// 주문 상태 상수
export enum OrderStatus {
  PAYMENT_WAITING = 'PAYMENT_WAITING',      // 결제대기
  PAYED = 'PAYED',                          // 결제완료
  DELIVERING = 'DELIVERING',                // 배송중
  DELIVERED = 'DELIVERED',                  // 배송완료
  PURCHASE_DECIDED = 'PURCHASE_DECIDED',    // 구매확정
  EXCHANGED = 'EXCHANGED',                  // 교환완료
  CANCELED = 'CANCELED',                    // 취소완료
  RETURNED = 'RETURNED',                    // 반품완료
  CANCELED_BY_NOPAYMENT = 'CANCELED_BY_NOPAYMENT' // 미결제취소
}

// 배송 상태 상수
export enum DeliveryStatus {
  NOT_YET = 'NOT_YET',        // 발송전
  DELIVERING = 'DELIVERING',   // 배송중
  DELIVERED = 'DELIVERED',     // 배송완료
  HOLDBACK = 'HOLDBACK'        // 배송보류
}