---
title: "네이버 커머스API 상품 주문 목록 조회 가이드"
source: "https://apicenter.commerce.naver.com/docs/commerce-api/current/seller-get-product-order-ids-pay-order-seller"
author:
published:
created: 2025-09-26
description: "주문 ID로 해당 주문에 포함된 모든 상품 주문 번호를 조회하는 API 가이드"
tags:
  - "clippings"
  - "order"
  - "product-order"
  - "api"
---

# 📦 네이버 커머스API 상품 주문 목록 조회 가이드

## 📋 목차
- [API 개요](#api-개요)
- [요청 방법](#요청-방법)
- [응답 형식](#응답-형식)
- [코드 예시](#코드-예시)
- [에러 처리](#에러-처리)
- [실용적 활용법](#실용적-활용법)

---

## 🎯 API 개요

> **🎯 핵심 요약**  
> 주문 ID(`orderId`)를 사용하여 해당 주문에 포함된 **모든 상품 주문 번호**(`productOrderId`) 목록을 조회합니다.

### 사용 목적

이 API는 다음과 같은 상황에서 활용됩니다:
- 📋 **주문 상세 조회 전 단계**: 주문에 포함된 상품들의 ID를 먼저 확인
- 🔍 **상품별 처리**: 각 상품에 대해 개별적인 처리 (발송, 취소 등)가 필요한 경우
- 📊 **데이터 분석**: 주문당 상품 개수 파악 및 통계 작성

### API 기본 정보

| 항목 | 내용 |
|------|------|
| **HTTP 메서드** | GET |
| **엔드포인트** | `/v1/pay-order/seller/orders/{orderId}/product-order-ids` |
| **인증** | Bearer Token (필수) |
| **응답 형식** | JSON |

---

## 📤 요청 방법

### 기본 요청 구조

```http
GET /external/v1/pay-order/seller/orders/{orderId}/product-order-ids HTTP/1.1
Host: api.commerce.naver.com
Accept: application/json
Authorization: Bearer {access_token}
```

### 경로 파라미터

| 파라미터 | 타입 | 필수 | 설명 | 예시 |
|----------|------|------|------|------|
| `orderId` | string | ✅ 필수 | 조회할 주문의 고유 번호 | `2023010112345` |

### 요청 헤더

| 헤더 | 값 | 필수 | 설명 |
|------|----|----|------|
| `Accept` | `application/json` | ✅ 필수 | 응답 형식 지정 |
| `Authorization` | `Bearer {token}` | ✅ 필수 | 인증 토큰 |

---

## 📥 응답 형식

### 성공 응답 (200 OK)

```json
{
  "timestamp": "2023-01-16T17:14:51.794+09:00",
  "traceId": "abc123-def456-ghi789",
  "data": {
    "productOrderIds": [
      "2023010112345001",
      "2023010112345002", 
      "2023010112345003"
    ]
  }
}
```

### 응답 필드 설명

| 필드 | 타입 | 설명 | 예시 |
|------|------|------|------|
| `timestamp` | string | API 처리 시각 | `2023-01-16T17:14:51.794+09:00` |
| `traceId` | string | 요청 추적 ID | `abc123-def456-ghi789` |
| `data.productOrderIds` | string[] | 상품 주문 번호 배열 | `["2023010112345001", "2023010112345002"]` |

### HTTP 상태 코드

| 코드 | 상태 | 설명 | 대응 방법 |
|------|------|------|----------|
| **200** | OK | 조회 성공 | 응답 데이터 활용 |
| **400** | Bad Request | 잘못된 orderId 형식 | orderId 형식 확인 |
| **401** | Unauthorized | 인증 실패 | 토큰 재발급 |
| **404** | Not Found | 존재하지 않는 주문 | orderId 재확인 |
| **500** | Internal Server Error | 서버 오류 | 잠시 후 재시도 |

---

## 💻 코드 예시

### 🟢 Node.js (axios)

```javascript
const axios = require('axios');

/**
 * 상품 주문 목록 조회 함수
 * @param {string} orderId - 주문 ID
 * @param {string} accessToken - 액세스 토큰
 * @returns {Promise<string[]>} 상품 주문 ID 배열
 */
async function getProductOrderIds(orderId, accessToken) {
    try {
        const response = await axios({
            method: 'GET',
            url: `https://api.commerce.naver.com/external/v1/pay-order/seller/orders/${orderId}/product-order-ids`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        console.log('조회 성공:', response.data.data.productOrderIds);
        return response.data.data.productOrderIds;
        
    } catch (error) {
        console.error('오류 발생:', error.response?.data || error.message);
        throw error;
    }
}

// 사용 예시
async function main() {
    const orderId = '2023010112345';
    const accessToken = 'your_access_token_here';
    
    try {
        const productOrderIds = await getProductOrderIds(orderId, accessToken);
        console.log(`주문 ${orderId}에 포함된 상품 주문 수: ${productOrderIds.length}개`);
        
        // 각 상품 주문에 대해 추가 처리
        for (const productOrderId of productOrderIds) {
            console.log(`상품 주문 처리 중: ${productOrderId}`);
            // 상품별 상세 정보 조회, 발송 처리 등의 로직
        }
    } catch (error) {
        console.error('처리 실패:', error.message);
    }
}

main();
```

### 🐍 Python (requests)

```python
import requests
import json

def get_product_order_ids(order_id, access_token):
    """
    상품 주문 목록 조회 함수
    
    Args:
        order_id (str): 주문 ID
        access_token (str): 액세스 토큰
        
    Returns:
        list: 상품 주문 ID 목록
    """
    url = f"https://api.commerce.naver.com/external/v1/pay-order/seller/orders/{order_id}/product-order-ids"
    
    headers = {
        "Accept": "application/json",
        "Authorization": f"Bearer {access_token}"
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # HTTP 오류 시 예외 발생
        
        data = response.json()
        product_order_ids = data['data']['productOrderIds']
        
        print(f"조회 성공: {len(product_order_ids)}개의 상품 주문 발견")
        return product_order_ids
        
    except requests.exceptions.RequestException as e:
        print(f"API 요청 오류: {e}")
        raise
    except KeyError as e:
        print(f"응답 데이터 파싱 오류: {e}")
        raise

# 사용 예시
if __name__ == "__main__":
    order_id = "2023010112345"
    access_token = "your_access_token_here"
    
    try:
        product_order_ids = get_product_order_ids(order_id, access_token)
        
        for i, product_order_id in enumerate(product_order_ids, 1):
            print(f"{i}. {product_order_id}")
            
    except Exception as e:
        print(f"처리 실패: {e}")
```

### 📎 cURL

```bash
#!/bin/bash

# 환경 변수 설정
ORDER_ID="2023010112345"
ACCESS_TOKEN="your_access_token_here"

# API 호출
curl -L "https://api.commerce.naver.com/external/v1/pay-order/seller/orders/${ORDER_ID}/product-order-ids" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -w "\nHTTP Status: %{http_code}\n" \
  | jq '.'  # JSON 형식으로 출력
```

---

## ⚠️ 에러 처리

### 일반적인 에러 시나리오

```javascript
// 에러 처리가 포함된 완전한 함수
async function getProductOrderIdsWithErrorHandling(orderId, accessToken) {
    try {
        const response = await axios.get(
            `https://api.commerce.naver.com/external/v1/pay-order/seller/orders/${orderId}/product-order-ids`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );
        
        return {
            success: true,
            data: response.data.data.productOrderIds,
            traceId: response.data.traceId
        };
        
    } catch (error) {
        const status = error.response?.status;
        const traceId = error.response?.data?.traceId;
        
        switch (status) {
            case 400:
                return {
                    success: false,
                    error: 'INVALID_ORDER_ID',
                    message: '잘못된 주문 ID 형식입니다.',
                    traceId
                };
                
            case 401:
                return {
                    success: false,
                    error: 'UNAUTHORIZED',
                    message: '인증이 필요합니다. 토큰을 확인해주세요.',
                    traceId
                };
                
            case 404:
                return {
                    success: false,
                    error: 'ORDER_NOT_FOUND',
                    message: '존재하지 않는 주문입니다.',
                    traceId
                };
                
            case 500:
                return {
                    success: false,
                    error: 'SERVER_ERROR',
                    message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
                    traceId
                };
                
            default:
                return {
                    success: false,
                    error: 'UNKNOWN_ERROR',
                    message: `알 수 없는 오류가 발생했습니다. (${status})`,
                    traceId
                };
        }
    }
}
```

---

## 🚀 실용적 활용법

### 1. 주문 처리 워크플로우

```javascript
/**
 * 완전한 주문 처리 워크플로우
 */
async function processOrder(orderId, accessToken) {
    // 1단계: 상품 주문 목록 조회
    const productOrderIds = await getProductOrderIds(orderId, accessToken);
    
    // 2단계: 각 상품의 상세 정보 조회
    const productDetails = [];
    for (const productOrderId of productOrderIds) {
        const detail = await getProductOrderDetail(productOrderId, accessToken);
        productDetails.push(detail);
    }
    
    // 3단계: 비즈니스 로직 처리
    for (const product of productDetails) {
        if (product.status === 'PAYED') {
            // 결제 완료된 상품 → 발송 처리
            await dispatchProduct(product.productOrderId, accessToken);
        } else if (product.status === 'CANCEL_REQUEST') {
            // 취소 요청된 상품 → 취소 승인
            await approveCancellation(product.productOrderId, accessToken);
        }
    }
    
    console.log(`주문 ${orderId} 처리 완료`);
}
```

### 2. 배치 처리 시스템

```javascript
/**
 * 다수 주문의 일괄 처리
 */
async function batchProcessOrders(orderIds, accessToken) {
    const results = [];
    
    for (const orderId of orderIds) {
        try {
            const productOrderIds = await getProductOrderIds(orderId, accessToken);
            
            results.push({
                orderId,
                success: true,
                productCount: productOrderIds.length,
                productOrderIds
            });
            
            // API 호출 제한 고려 (1초당 최대 10회)
            await new Promise(resolve => setTimeout(resolve, 100));
            
        } catch (error) {
            results.push({
                orderId,
                success: false,
                error: error.message
            });
        }
    }
    
    return results;
}
```

### 3. 실시간 모니터링

```javascript
/**
 * 특정 주문의 상품 개수 모니터링
 */
function monitorOrderProducts(orderId, accessToken, intervalMs = 30000) {
    const monitor = setInterval(async () => {
        try {
            const productOrderIds = await getProductOrderIds(orderId, accessToken);
            console.log(`[${new Date().toISOString()}] 주문 ${orderId}: ${productOrderIds.length}개 상품`);
            
        } catch (error) {
            console.error(`모니터링 오류: ${error.message}`);
            clearInterval(monitor);
        }
    }, intervalMs);
    
    return monitor; // 모니터링 중단 시 clearInterval(monitor) 호출
}
```

---

## 📚 관련 문서

- [상품 주문 상세 내역 조회](./상품%20주문%20상세%20내역%20조회%20커머스API.md) - 개별 상품의 상세 정보 조회
- [발송 처리](./발송%20처리%20커머스API.md) - 상품 발송 처리 방법
- [인증 가이드](./인증%20커머스API.md) - 액세스 토큰 발급 방법

> **💡 다음 단계**  
> 상품 주문 ID를 얻었다면, [상품 주문 상세 내역 조회 API](./상품%20주문%20상세%20내역%20조회%20커머스API.md)를 사용해서 각 상품의 자세한 정보를 확인해보세요!