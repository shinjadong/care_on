#!/usr/bin/env node

/**
 * 네이버 커머스 API 연결 테스트 스크립트
 */

const bcrypt = require('bcryptjs');

// 환경 변수에서 설정 읽기
const config = {
  clientId: '5NKxpyt3CoF2xn5bHwKduH',
  clientSecret: '$2a$04$3tPVEEvnG35Smx7tcXrtfu',
  sellerId: 'ncp_1of59r_01'
};

console.log('📋 네이버 커머스 API 연결 테스트');
console.log('================================');
console.log('Client ID:', config.clientId);
console.log('Seller ID:', config.sellerId);
console.log('');

// 전자서명 생성
function generateSignature(timestamp) {
  const password = `${config.clientId}_${timestamp}`;
  const hashed = bcrypt.hashSync(password, config.clientSecret);
  return Buffer.from(hashed, 'utf-8').toString('base64');
}

// 토큰 발급 테스트
async function testAuth() {
  const timestamp = Date.now();
  const signature = generateSignature(timestamp);

  const params = new URLSearchParams({
    client_id: config.clientId,
    timestamp: timestamp.toString(),
    grant_type: 'client_credentials',
    client_secret_sign: signature,
    type: 'SELF'
  });

  console.log('🔐 인증 토큰 요청 중...');

  try {
    const response = await fetch('https://api.commerce.naver.com/external/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: params.toString()
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ 토큰 발급 성공!');
      console.log('Access Token:', data.access_token.substring(0, 20) + '...');
      console.log('Expires In:', data.expires_in, 'seconds');
      console.log('Token Type:', data.token_type);
      return data.access_token;
    } else {
      console.error('❌ 토큰 발급 실패:', data);
      return null;
    }
  } catch (error) {
    console.error('❌ 네트워크 오류:', error.message);
    return null;
  }
}

// 주문 조회 테스트
async function testOrderList(token) {
  if (!token) {
    console.log('\n토큰이 없어 주문 조회를 건너뜁니다.');
    return;
  }

  console.log('\n📦 주문 목록 조회 중...');

  // 24시간 이내 데이터만 조회 (API 제한사항)
  const endDate = new Date('2025-01-29T15:00:00');
  const startDate = new Date('2025-01-28T15:00:00');

  // 날짜를 2022-04-11T15:21:44.000+09:00 형식으로 변경
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000+09:00`;
  };

  const fromDate = formatDate(startDate);
  const toDate = formatDate(endDate);

  console.log('조회 기간:', fromDate, '~', toDate);

  const params = new URLSearchParams({
    'lastChangedFrom': fromDate,
    'lastChangedTo': toDate,
    'limitCount': '50'
  });

  try {
    // 변경 상품 주문 내역 조회 API 사용
    const response = await fetch(`https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/last-changed-statuses?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ 주문 조회 성공!');

      // data.data가 실제 데이터를 포함
      const orderData = data.data || data;
      const orders = orderData.lastChangeStatuses || orderData.contents || [];

      console.log('조회된 주문 수:', orders.length);

      if (orders.length > 0) {
        console.log('\n최근 변경된 주문 목록:');
        orders.forEach((order, index) => {
          console.log(`  ${index + 1}. 상품주문번호: ${order.productOrderId || order.orderId}`);
          console.log(`     주문번호: ${order.orderId || 'N/A'}`);
          console.log(`     상태: ${order.productOrderStatus || order.orderStatus}`);
          console.log(`     변경일시: ${order.lastChangedDate || 'N/A'}`);
          console.log('');
        });
      } else {
        console.log('조회 기간 내 변경된 주문이 없습니다.');
      }
    } else {
      console.error('❌ 주문 조회 실패:', data);
    }
  } catch (error) {
    console.error('❌ 네트워크 오류:', error.message);
  }
}

// 메인 실행
async function main() {
  const token = await testAuth();
  await testOrderList(token);

  console.log('\n✨ 테스트 완료!');

  if (token) {
    console.log('\n💡 API 연결이 정상적으로 작동합니다.');
    console.log('관리자 페이지에서 주문을 확인하세요:');
    console.log('http://localhost:3000/admin/naver-orders');
  } else {
    console.log('\n⚠️  API 연결에 문제가 있습니다.');
    console.log('환경 변수와 API 설정을 확인하세요.');
  }
}

// 실행
main().catch(console.error);