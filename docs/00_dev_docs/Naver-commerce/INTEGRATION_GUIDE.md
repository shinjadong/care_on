# 네이버 커머스 API 연동 가이드

## 📋 개요
네이버 스마트스토어 주문 관리를 위한 커머스 API 연동이 완료되었습니다.

## ✅ 구현된 기능

### 1. 인증 시스템 (`/lib/naver-commerce/auth.ts`)
- OAuth2 Client Credentials Grant 방식 인증
- bcrypt 기반 전자서명 생성
- 자동 토큰 갱신 메커니즘
- API 요청 래퍼 함수

### 2. 주문 관리 기능 (`/lib/naver-commerce/orders.ts`)
- 주문 목록 조회 (날짜, 상태별 필터링)
- 주문 상세 정보 조회
- 최근 주문 조회 헬퍼 함수
- 주문 상태 한글 변환

### 3. API 엔드포인트
- `GET /api/naver/orders` - 주문 목록 조회
- `GET /api/naver/orders/[orderId]` - 주문 상세 조회

### 4. 관리자 UI (`/app/admin/naver-orders`)
- 실시간 주문 조회 대시보드
- 날짜 범위 필터링
- 주문 상태별 필터링
- 페이지네이션
- 주문 상세 정보 패널

## 🔧 설정 정보

### 환경 변수
\`\`\`env
# Naver Commerce API
NAVER_COMMERCE_CLIENT_ID=5NKxpyt3CoF2xn5bHwKduH
NAVER_COMMERCE_CLIENT_SECRET=$2a$04$3tPVEEvnG35Smx7tcXrtfu
NAVER_COMMERCE_SELLER_ID=ncp_1of59r_01  # 판매자 ID
\`\`\`

### API 호출 IP
- **현재 허용 IP**: 211.205.114.124
- **로컬 개발 IP**: 125.180.6.168 (추가 필요)
- **중요**: 로컬 개발 환경에서 테스트하려면 네이버 커머스 개발자 센터에서 IP 추가 필요
- IP 추가 후 즉시 API 호출 가능

## 📊 주문 상태 코드

| 상태 코드 | 한글명 | 설명 |
|-----------|--------|------|
| PAYMENT_WAITING | 결제대기 | 결제를 기다리는 상태 |
| PAYED | 결제완료 | 결제가 완료된 상태 |
| DELIVERING | 배송중 | 상품 배송 중 |
| DELIVERED | 배송완료 | 배송이 완료된 상태 |
| PURCHASE_DECIDED | 구매확정 | 구매가 확정된 상태 |
| CANCELED | 취소완료 | 주문이 취소된 상태 |
| RETURNED | 반품완료 | 반품이 완료된 상태 |
| CANCELED_BY_NOPAYMENT | 미결제취소 | 미결제로 인한 자동 취소 |

## 🚀 사용 방법

### 1. 관리자 페이지 접속
\`\`\`
http://localhost:3000/admin/naver-orders
\`\`\`

### 2. API 직접 호출

#### 최근 7일 주문 조회
\`\`\`bash
curl http://localhost:3000/api/naver/orders
\`\`\`

#### 특정 기간 주문 조회
\`\`\`bash
curl "http://localhost:3000/api/naver/orders?startDate=2025-01-01&endDate=2025-01-31"
\`\`\`

#### 주문 상세 조회
\`\`\`bash
curl http://localhost:3000/api/naver/orders/ORDER_ID
\`\`\`

### 3. 프로그래밍 방식 사용

\`\`\`typescript
import { NaverCommerceAuth } from '@/lib/naver-commerce/auth'
import { NaverCommerceOrders } from '@/lib/naver-commerce/orders'

// 인증 설정
const auth = new NaverCommerceAuth({
  clientId: process.env.NAVER_COMMERCE_CLIENT_ID!,
  clientSecret: process.env.NAVER_COMMERCE_CLIENT_SECRET!
})

// 주문 조회
const orders = new NaverCommerceOrders(auth)
const recentOrders = await orders.getRecentOrders(7)
\`\`\`

## 📝 주의사항

1. **API 호출 제한**
   - 설정된 IP (211.205.114.124)에서만 호출 가능
   - 배포 시 서버 IP 확인 필요

2. **조회 기간 제한**
   - 최대 31일 단위로 조회 가능
   - 더 긴 기간 조회 시 여러 번 나누어 호출

3. **토큰 관리**
   - 토큰은 자동으로 갱신됨
   - 만료 30분 전에 자동 갱신

4. **에러 처리**
   - 401 에러 시 자동으로 토큰 재발급 후 재시도
   - 네트워크 에러 시 적절한 에러 메시지 표시

## 🔍 트러블슈팅

### IP 차단 오류 (GW.IP_NOT_ALLOWED)
- **원인**: 현재 IP가 API 허용 목록에 없음
- **해결 방법**:
  1. 네이버 커머스 개발자 센터에서 현재 IP 추가
  2. 또는 211.205.114.124 IP를 가진 서버에서 실행
  3. 배포 환경에서 정상 작동 확인

### 인증 실패
- 환경 변수 확인: CLIENT_ID, CLIENT_SECRET, SELLER_ID
- type 파라미터: 항상 'SELF' 사용
- 전자서명: bcrypt salt로 CLIENT_SECRET 사용

### 주문 조회 실패
- 날짜 형식 확인: YYYY-MM-DD
- 조회 기간 확인: 최대 31일
- 토큰 만료: 자동 갱신되지만 수동 확인 필요할 수 있음

### Select 컴포넌트 오류
- Radix UI Select는 빈 문자열 value 미지원
- 'all' 같은 명시적 값 사용 필요

### bcrypt 에러
\`\`\`bash
npm install bcryptjs @types/bcryptjs
\`\`\`

## 📚 참고 문서
- [네이버 커머스 API 문서](https://apicenter.commerce.naver.com)
- OAuth2 Client Credentials Grant 방식
- bcrypt 전자서명 생성 방식
