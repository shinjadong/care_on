---
title: "네이버 커머스API 상품 주문 정보 구조체 가이드"
source: "https://apicenter.commerce.naver.com/docs/commerce-api/current/schemas/%EC%83%81%ED%92%88-%EC%A3%BC%EB%AC%B8-%EC%A0%95%EB%B3%B4-%EA%B5%AC%EC%A1%B0%EC%B2%B4"
author:
published:
created: 2025-09-26
description: "상품 주문 정보의 상세한 JSON 구조체와 각 필드에 대한 완전 가이드"
tags:
  - "clippings"
  - "data-structure"
  - "json"
  - "order"
---

# 📦 네이버 커머스API 상품 주문 정보 구조체 가이드

## 📋 목차
- [개요](#개요)
- [전체 구조 요약](#전체-구조-요약)
- [주요 객체별 상세 설명](#주요-객체별-상세-설명)
- [전체 JSON 스키마](#전체-json-스키마)
- [실용적 활용 예시](#실용적-활용-예시)

---

## 🎯 개요

> **🎯 핵심 요약**  
> 상품 주문 정보는 **order**, **productOrder**, **cancel**, **return**, **exchange**, **delivery** 등의 객체로 분할되어 체계적으로 구성됩니다.

### 데이터 구조의 철학

네이버 커머스API의 주문 정보는 마치 실제 주문서와 같이 구성됩니다:
- **order**: 주문자 정보와 결제 정보 (주문서 상단)
- **productOrder**: 상품별 세부 정보 (주문 상품 목록)
- **cancel/return/exchange**: 클레임 처리 정보 (A/S 기록)
- **delivery**: 배송 정보 (배송 현황)

### 구조체 특징

- ✅ **응답 전용**: API 호출 응답으로만 사용 (요청에는 사용하지 않음)
- 🔄 **동적 구성**: 주문 상태에 따라 하위 필드가 다양하게 제공
- 📦 **1:1 관계**: 구조체 객체 1개 = 상품주문번호 1개

### 응답 메타데이터

| 필드 | 타입 | 설명 | 예시 |
|------|------|------|------|
| `timestamp` | string (datetime) | API 처리 시각 | `2023-01-16T17:14:51.794+09:00` |
| `traceId` | string (required) | 요청 추적 ID | `abc123-def456-ghi789` |

---

## 🗂️ 전체 구조 요약

### 최상위 응답 구조

```json
{
  "timestamp": "2023-01-16T17:14:51.794+09:00",
  "traceId": "string",
  "data": [
    {
      "order": { /* 주문 정보 */ },
      "productOrder": { /* 상품별 주문 정보 */ },
      "cancel": { /* 취소 정보 */ },
      "return": { /* 반품 정보 */ },
      "exchange": { /* 교환 정보 */ },
      "delivery": { /* 배송 정보 */ }
    }
  ]
}
```

### 주요 객체 관계도

```
📋 Order (주문)
├── 💰 Payment Info (결제 정보)
├── 👤 Orderer Info (주문자 정보)
└── 📦 Product Orders (상품별 주문)
    ├── 🏷️ Product Info (상품 정보)
    ├── 🚚 Shipping Info (배송 정보)
    ├── 💸 Pricing Info (가격 정보)
    └── 📋 Claims (클레임)
        ├── ❌ Cancel (취소)
        ├── 🔄 Return (반품)
        └── 🔀 Exchange (교환)
```

---

## 📊 주요 객체별 상세 설명

### 📋 Order 객체 (주문 기본 정보)

주문의 기본 정보와 결제 내역을 포함합니다.

| 필드 | 타입 | 설명 | 예시 |
|------|------|------|------|
| `orderId` | string | 주문 고유 번호 | "2023010112345" |
| `orderDate` | datetime | 주문 일시 | "2023-01-16T17:14:51.794+09:00" |
| `ordererName` | string | 주문자 이름 | "홍길동" |
| `ordererTel` | string | 주문자 연락처 | "010-1234-5678" |
| `paymentDate` | datetime | 결제 완료 일시 | "2023-01-16T17:14:51.794+09:00" |
| `paymentMeans` | string | 결제 수단 | "CARD", "BANK_TRANSFER" |
| `generalPaymentAmount` | number | 일반 결제 금액 | 50000 |

### 📦 ProductOrder 객체 (상품별 주문 정보)

각 상품의 상세 주문 정보를 포함합니다.

| 필드 | 타입 | 설명 | 예시 |
|------|------|------|------|
| `productOrderId` | string | 상품 주문 고유 번호 | "2023010112345001" |
| `productId` | string | 상품 ID | "PRD12345" |
| `productName` | string | 상품명 | "스마트폰 케이스" |
| `productOrderStatus` | string | 주문 상태 | "PAYED", "DISPATCHED", "DELIVERED" |
| `quantity` | number | 주문 수량 | 2 |
| `unitPrice` | number | 단가 | 15000 |
| `totalPaymentAmount` | number | 총 결제 금액 | 30000 |

### 🏠 ShippingAddress 객체 (배송지 정보)

배송 주소와 관련 정보를 포함합니다.

| 필드 | 타입 | 설명 | 예시 |
|------|------|------|------|
| `name` | string | 수령인 이름 | "김철수" |
| `tel1` | string | 연락처 1 | "010-9876-5432" |
| `baseAddress` | string | 기본 주소 | "서울특별시 강남구 테헤란로 123" |
| `detailedAddress` | string | 상세 주소 | "456동 789호" |
| `zipCode` | string | 우편번호 | "06234" |

### 🚚 Delivery 객체 (배송 정보)

배송 상태와 택배 정보를 포함합니다.

| 필드 | 타입 | 설명 | 예시 |
|------|------|------|------|
| `deliveryCompany` | string | 택배사 | "CJ대한통운" |
| `trackingNumber` | string | 송장번호 | "123456789012" |
| `deliveryStatus` | string | 배송 상태 | "DISPATCHED", "DELIVERING", "DELIVERED" |
| `sendDate` | datetime | 발송일 | "2023-01-17T09:00:00.000+09:00" |
| `deliveredDate` | datetime | 배송완료일 | "2023-01-18T14:30:00.000+09:00" |

### ❌ Cancel 객체 (취소 정보)

주문 취소 관련 정보를 포함합니다.

| 필드 | 타입 | 설명 | 예시 |
|------|------|------|------|
| `claimId` | string | 클레임 ID | "CANCEL_2023010112345" |
| `cancelReason` | string | 취소 사유 | "고객 변심" |
| `cancelApprovalDate` | datetime | 취소 승인일 | "2023-01-16T18:00:00.000+09:00" |
| `refundExpectedDate` | datetime | 환불 예정일 | "2023-01-19T00:00:00.000+09:00" |

### 🔄 Return/Exchange 객체 (반품/교환 정보)

반품이나 교환 요청 관련 정보를 포함합니다.

| 필드 | 타입 | 설명 | 예시 |
|------|------|------|------|
| `claimId` | string | 클레임 ID | "RETURN_2023010112345" |
| `returnReason` | string | 반품 사유 | "상품 불량" |
| `collectDeliveryCompany` | string | 수거 택배사 | "로젠택배" |
| `collectTrackingNumber` | string | 수거 송장번호 | "987654321098" |

---

## 📄 전체 JSON 스키마

> **⚠️ 주의**  
> 아래는 전체 스키마입니다. 실제 응답에서는 주문 상태에 따라 일부 필드가 null이거나 빈 객체일 수 있습니다.

```json
상품 주문 정보 구조체{
  "timestamp": "2023-01-16T17:14:51.794+09:00",
  "traceId": "string",
  "data": [
    {
      "order": {
        "chargeAmountPaymentAmount": 0,
        "checkoutAccumulationPaymentAmount": 0,
        "generalPaymentAmount": 0,
        "naverMileagePaymentAmount": 0,
        "orderDate": "2023-01-16T17:14:51.794+09:00",
        "orderDiscountAmount": 0,
        "orderId": "string",
        "ordererId": "string",
        "ordererName": "string",
        "ordererTel": "string",
        "paymentDate": "2023-01-16T17:14:51.794+09:00",
        "paymentDueDate": "2023-01-16T17:14:51.794+09:00",
        "paymentMeans": "string",
        "isDeliveryMemoParticularInput": "string",
        "payLocationType": "string",
        "ordererNo": "string",
        "payLaterPaymentAmount": 0,
        "isMembershipSubscribed": true
      },
      "productOrder": {
        "claimStatus": "string",
        "claimType": "string",
        "decisionDate": "2023-01-16T17:14:51.794+09:00",
        "delayedDispatchDetailedReason": "string",
        "delayedDispatchReason": "PRODUCT_PREPARE",
        "deliveryDiscountAmount": 0,
        "deliveryFeeAmount": 0,
        "deliveryPolicyType": "string",
        "expectedDeliveryMethod": "DELIVERY",
        "freeGift": "string",
        "mallId": "string",
        "optionCode": "string",
        "optionPrice": 0,
        "packageNumber": "string",
        "placeOrderDate": "2023-01-16T17:14:51.794+09:00",
        "placeOrderStatus": "string",
        "productClass": "string",
        "productDiscountAmount": 0,
        "initialProductDiscountAmount": 0,
        "remainProductDiscountAmount": 0,
        "groupProductId": 0,
        "productId": "string",
        "originalProductId": "string",
        "merchantChannelId": "string",
        "productName": "string",
        "productOption": "string",
        "productOrderId": "string",
        "productOrderStatus": "string",
        "quantity": 0,
        "initialQuantity": 0,
        "remainQuantity": 0,
        "sectionDeliveryFee": 0,
        "sellerProductCode": "string",
        "shippingAddress": {
          "addressType": "string",
          "baseAddress": "string",
          "city": "string",
          "country": "string",
          "detailedAddress": "string",
          "name": "string",
          "state": "string",
          "tel1": "string",
          "tel2": "string",
          "zipCode": "string",
          "isRoadNameAddress": true,
          "pickupLocationType": "FRONT_OF_DOOR",
          "pickupLocationContent": "string",
          "entryMethod": "LOBBY_PW",
          "entryMethodContent": "string",
          "buildingManagementNo": "string",
          "longitude": "string",
          "latitude": "string"
        },
        "shippingStartDate": "2023-01-16T17:14:51.794+09:00",
        "shippingDueDate": "2023-01-16T17:14:51.794+09:00",
        "shippingFeeType": "string",
        "shippingMemo": "string",
        "takingAddress": {
          "addressType": "string",
          "baseAddress": "string",
          "city": "string",
          "country": "string",
          "detailedAddress": "string",
          "name": "string",
          "state": "string",
          "tel1": "string",
          "tel2": "string",
          "zipCode": "string",
          "isRoadNameAddress": true
        },
        "totalPaymentAmount": 0,
        "initialPaymentAmount": 0,
        "remainPaymentAmount": 0,
        "totalProductAmount": 0,
        "initialProductAmount": 0,
        "remainProductAmount": 0,
        "unitPrice": 0,
        "sellerBurdenDiscountAmount": 0,
        "commissionRatingType": "string",
        "commissionPrePayStatus": "string",
        "paymentCommission": 0,
        "saleCommission": 0,
        "expectedSettlementAmount": 0,
        "inflowPath": "string",
        "inflowPathAdd": "string",
        "itemNo": "string",
        "optionManageCode": "string",
        "sellerCustomCode1": "string",
        "sellerCustomCode2": "string",
        "claimId": "string",
        "channelCommission": 0,
        "individualCustomUniqueCode": "string",
        "productImediateDiscountAmount": 0,
        "initialProductImmediateDiscountAmount": 0,
        "remainProductImmediateDiscountAmount": 0,
        "productProductDiscountAmount": 0,
        "initialProductProductDiscountAmount": 0,
        "remainProductProductDiscountAmount": 0,
        "productMultiplePurchaseDiscountAmount": 0,
        "sellerBurdenImediateDiscountAmount": 0,
        "initialSellerBurdenImmediateDiscountAmount": 0,
        "remainSellerBurdenImmediateDiscountAmount": 0,
        "sellerBurdenProductDiscountAmount": 0,
        "initialSellerBurdenProductDiscountAmount": 0,
        "remainSellerBurdenProductDiscountAmount": 0,
        "sellerBurdenMultiplePurchaseDiscountAmount": 0,
        "knowledgeShoppingSellingInterlockCommission": 0,
        "giftReceivingStatus": "string",
        "sellerBurdenStoreDiscountAmount": 0,
        "sellerBurdenMultiplePurchaseDiscountType": "IGNORE_QUANTITY",
        "logisticsCompanyId": "string",
        "logisticsCenterId": "string",
        "skuMappings": [
          {
            "nsId": "string",
            "nsBarcode": "string",
            "pickingQuantityPerOrder": 0
          }
        ],
        "hopeDelivery": {
          "region": "string",
          "additionalFee": 0,
          "hopeDeliveryYmd": "string",
          "hopeDeliveryHm": "string",
          "changeReason": "string",
          "changer": "string"
        },
        "deliveryAttributeType": "string",
        "expectedDeliveryCompany": "string",
        "arrivalGuaranteeDate": "2023-01-16T17:14:51.794+09:00",
        "deliveryTagType": "string",
        "taxType": "string",
        "storageType": "string"
      },
      "cancel": {
        "claimId": "string",
        "cancelApprovalDate": "2023-01-16T17:14:51.794+09:00",
        "cancelCompletedDate": "2023-01-16T17:14:51.794+09:00",
        "cancelDetailedReason": "string",
        "cancelReason": "string",
        "claimRequestDate": "2023-01-16T17:14:51.794+09:00",
        "claimStatus": "string",
        "refundExpectedDate": "2023-01-16T17:14:51.794+09:00",
        "refundStandbyReason": "string",
        "refundStandbyStatus": "string",
        "requestChannel": "string",
        "requestQuantity": 0
      },
      "return": {
        "claimId": "string",
        "claimDeliveryFeeDemandAmount": 0,
        "claimDeliveryFeePayMeans": "string",
        "claimDeliveryFeePayMethod": "string",
        "claimRequestDate": "2023-01-16T17:14:51.794+09:00",
        "claimStatus": "string",
        "collectAddress": {
          "addressType": "string",
          "baseAddress": "string",
          "city": "string",
          "country": "string",
          "detailedAddress": "string",
          "name": "string",
          "state": "string",
          "tel1": "string",
          "tel2": "string",
          "zipCode": "string",
          "isRoadNameAddress": true
        },
        "collectCompletedDate": "2023-01-16T17:14:51.794+09:00",
        "collectDeliveryCompany": "string",
        "collectDeliveryMethod": "DELIVERY",
        "collectStatus": "NOT_REQUESTED",
        "collectTrackingNumber": "string",
        "etcFeeDemandAmount": 0,
        "etcFeePayMeans": "string",
        "etcFeePayMethod": "string",
        "holdbackDetailedReason": "string",
        "holdbackReason": "string",
        "holdbackStatus": "string",
        "refundExpectedDate": "2023-01-16T17:14:51.794+09:00",
        "refundStandbyReason": "string",
        "refundStandbyStatus": "string",
        "requestChannel": "string",
        "requestQuantity": 0,
        "returnDetailedReason": "string",
        "returnReason": "string",
        "returnReceiveAddress": {
          "addressType": "string",
          "baseAddress": "string",
          "city": "string",
          "country": "string",
          "detailedAddress": "string",
          "name": "string",
          "state": "string",
          "tel1": "string",
          "tel2": "string",
          "zipCode": "string",
          "isRoadNameAddress": true,
          "logisticsCenterId": "string"
        },
        "returnCompletedDate": "2023-01-16T17:14:51.794+09:00",
        "holdbackConfigDate": "2023-01-16T17:14:51.794+09:00",
        "holdbackConfigurer": "string",
        "holdbackReleaseDate": "2023-01-16T17:14:51.794+09:00",
        "holdbackReleaser": "string",
        "claimDeliveryFeeProductOrderIds": "string",
        "claimDeliveryFeeDiscountAmount": 0,
        "remoteAreaCostChargeAmount": 0,
        "membershipsArrivalGuaranteeClaimSupportingAmount": 0,
        "returnImageUrl": [
          "string"
        ],
        "claimDeliveryFeeSupportType": "string",
        "claimDeliveryFeeSupportAmount": 0
      },
      "exchange": {
        "claimId": "string",
        "claimDeliveryFeeDemandAmount": 0,
        "claimDeliveryFeePayMeans": "string",
        "claimDeliveryFeePayMethod": "string",
        "claimRequestDate": "2023-01-16T17:14:51.794+09:00",
        "claimStatus": "string",
        "collectAddress": {
          "addressType": "string",
          "baseAddress": "string",
          "city": "string",
          "country": "string",
          "detailedAddress": "string",
          "name": "string",
          "state": "string",
          "tel1": "string",
          "tel2": "string",
          "zipCode": "string",
          "isRoadNameAddress": true
        },
        "collectCompletedDate": "2023-01-16T17:14:51.794+09:00",
        "collectDeliveryCompany": "string",
        "collectDeliveryMethod": "DELIVERY",
        "collectStatus": "NOT_REQUESTED",
        "collectTrackingNumber": "string",
        "etcFeeDemandAmount": 0,
        "etcFeePayMeans": "string",
        "etcFeePayMethod": "string",
        "exchangeDetailedReason": "string",
        "exchangeReason": "string",
        "holdbackDetailedReason": "string",
        "holdbackReason": "string",
        "holdbackStatus": "string",
        "reDeliveryMethod": "DELIVERY",
        "reDeliveryStatus": "COLLECT_REQUEST",
        "reDeliveryCompany": "string",
        "reDeliveryTrackingNumber": "string",
        "reDeliveryAddress": {
          "addressType": "string",
          "baseAddress": "string",
          "city": "string",
          "country": "string",
          "detailedAddress": "string",
          "name": "string",
          "state": "string",
          "tel1": "string",
          "tel2": "string",
          "zipCode": "string",
          "isRoadNameAddress": true
        },
        "requestChannel": "string",
        "requestQuantity": 0,
        "returnReceiveAddress": {
          "addressType": "string",
          "baseAddress": "string",
          "city": "string",
          "country": "string",
          "detailedAddress": "string",
          "name": "string",
          "state": "string",
          "tel1": "string",
          "tel2": "string",
          "zipCode": "string",
          "isRoadNameAddress": true,
          "logisticsCenterId": "string"
        },
        "holdbackConfigDate": "2023-01-16T17:14:51.794+09:00",
        "holdbackConfigurer": "string",
        "holdbackReleaseDate": "2023-01-16T17:14:51.794+09:00",
        "holdbackReleaser": "string",
        "claimDeliveryFeeProductOrderIds": "string",
        "reDeliveryOperationDate": "2023-01-16T17:14:51.794+09:00",
        "claimDeliveryFeeDiscountAmount": 0,
        "remoteAreaCostChargeAmount": 0,
        "membershipsArrivalGuaranteeClaimSupportingAmount": 0,
        "exchangeImageUrl": [
          "string"
        ],
        "claimDeliveryFeeSupportType": "string",
        "claimDeliveryFeeSupportAmount": 0
      },
      "beforeClaim": {
        "exchange": {
          "claimId": "string",
          "claimDeliveryFeeDemandAmount": 0,
          "claimDeliveryFeePayMeans": "string",
          "claimDeliveryFeePayMethod": "string",
          "claimRequestDate": "2023-01-16T17:14:51.794+09:00",
          "claimStatus": "string",
          "collectAddress": {
            "addressType": "string",
            "baseAddress": "string",
            "city": "string",
            "country": "string",
            "detailedAddress": "string",
            "name": "string",
            "state": "string",
            "tel1": "string",
            "tel2": "string",
            "zipCode": "string",
            "isRoadNameAddress": true
          },
          "collectCompletedDate": "2023-01-16T17:14:51.794+09:00",
          "collectDeliveryCompany": "string",
          "collectDeliveryMethod": "DELIVERY",
          "collectStatus": "NOT_REQUESTED",
          "collectTrackingNumber": "string",
          "etcFeeDemandAmount": 0,
          "etcFeePayMeans": "string",
          "etcFeePayMethod": "string",
          "exchangeDetailedReason": "string",
          "exchangeReason": "string",
          "holdbackDetailedReason": "string",
          "holdbackReason": "string",
          "holdbackStatus": "string",
          "reDeliveryMethod": "DELIVERY",
          "reDeliveryStatus": "COLLECT_REQUEST",
          "reDeliveryCompany": "string",
          "reDeliveryTrackingNumber": "string",
          "reDeliveryAddress": {
            "addressType": "string",
            "baseAddress": "string",
            "city": "string",
            "country": "string",
            "detailedAddress": "string",
            "name": "string",
            "state": "string",
            "tel1": "string",
            "tel2": "string",
            "zipCode": "string",
            "isRoadNameAddress": true
          },
          "requestChannel": "string",
          "requestQuantity": 0,
          "returnReceiveAddress": {
            "addressType": "string",
            "baseAddress": "string",
            "city": "string",
            "country": "string",
            "detailedAddress": "string",
            "name": "string",
            "state": "string",
            "tel1": "string",
            "tel2": "string",
            "zipCode": "string",
            "isRoadNameAddress": true,
            "logisticsCenterId": "string"
          },
          "holdbackConfigDate": "2023-01-16T17:14:51.794+09:00",
          "holdbackConfigurer": "string",
          "holdbackReleaseDate": "2023-01-16T17:14:51.794+09:00",
          "holdbackReleaser": "string",
          "claimDeliveryFeeProductOrderIds": "string",
          "reDeliveryOperationDate": "2023-01-16T17:14:51.794+09:00",
          "claimDeliveryFeeDiscountAmount": 0,
          "remoteAreaCostChargeAmount": 0,
          "membershipsArrivalGuaranteeClaimSupportingAmount": 0,
          "exchangeImageUrl": [
            "string"
          ],
          "claimDeliveryFeeSupportType": "string",
          "claimDeliveryFeeSupportAmount": 0
        }
      },
      "currentClaim": {
        "cancel": {
          "claimId": "string",
          "cancelApprovalDate": "2023-01-16T17:14:51.794+09:00",
          "cancelCompletedDate": "2023-01-16T17:14:51.794+09:00",
          "cancelDetailedReason": "string",
          "cancelReason": "string",
          "claimRequestDate": "2023-01-16T17:14:51.794+09:00",
          "claimStatus": "string",
          "refundExpectedDate": "2023-01-16T17:14:51.794+09:00",
          "refundStandbyReason": "string",
          "refundStandbyStatus": "string",
          "requestChannel": "string",
          "requestQuantity": 0
        },
        "return": {
          "claimId": "string",
          "claimDeliveryFeeDemandAmount": 0,
          "claimDeliveryFeePayMeans": "string",
          "claimDeliveryFeePayMethod": "string",
          "claimRequestDate": "2023-01-16T17:14:51.794+09:00",
          "claimStatus": "string",
          "collectAddress": {
            "addressType": "string",
            "baseAddress": "string",
            "city": "string",
            "country": "string",
            "detailedAddress": "string",
            "name": "string",
            "state": "string",
            "tel1": "string",
            "tel2": "string",
            "zipCode": "string",
            "isRoadNameAddress": true
          },
          "collectCompletedDate": "2023-01-16T17:14:51.794+09:00",
          "collectDeliveryCompany": "string",
          "collectDeliveryMethod": "DELIVERY",
          "collectStatus": "NOT_REQUESTED",
          "collectTrackingNumber": "string",
          "etcFeeDemandAmount": 0,
          "etcFeePayMeans": "string",
          "etcFeePayMethod": "string",
          "holdbackDetailedReason": "string",
          "holdbackReason": "string",
          "holdbackStatus": "string",
          "refundExpectedDate": "2023-01-16T17:14:51.794+09:00",
          "refundStandbyReason": "string",
          "refundStandbyStatus": "string",
          "requestChannel": "string",
          "requestQuantity": 0,
          "returnDetailedReason": "string",
          "returnReason": "string",
          "returnReceiveAddress": {
            "addressType": "string",
            "baseAddress": "string",
            "city": "string",
            "country": "string",
            "detailedAddress": "string",
            "name": "string",
            "state": "string",
            "tel1": "string",
            "tel2": "string",
            "zipCode": "string",
            "isRoadNameAddress": true,
            "logisticsCenterId": "string"
          },
          "returnCompletedDate": "2023-01-16T17:14:51.794+09:00",
          "holdbackConfigDate": "2023-01-16T17:14:51.794+09:00",
          "holdbackConfigurer": "string",
          "holdbackReleaseDate": "2023-01-16T17:14:51.794+09:00",
          "holdbackReleaser": "string",
          "claimDeliveryFeeProductOrderIds": "string",
          "claimDeliveryFeeDiscountAmount": 0,
          "remoteAreaCostChargeAmount": 0,
          "membershipsArrivalGuaranteeClaimSupportingAmount": 0,
          "returnImageUrl": [
            "string"
          ],
          "claimDeliveryFeeSupportType": "string",
          "claimDeliveryFeeSupportAmount": 0
        },
        "exchange": {
          "claimId": "string",
          "claimDeliveryFeeDemandAmount": 0,
          "claimDeliveryFeePayMeans": "string",
          "claimDeliveryFeePayMethod": "string",
          "claimRequestDate": "2023-01-16T17:14:51.794+09:00",
          "claimStatus": "string",
          "collectAddress": {
            "addressType": "string",
            "baseAddress": "string",
            "city": "string",
            "country": "string",
            "detailedAddress": "string",
            "name": "string",
            "state": "string",
            "tel1": "string",
            "tel2": "string",
            "zipCode": "string",
            "isRoadNameAddress": true
          },
          "collectCompletedDate": "2023-01-16T17:14:51.794+09:00",
          "collectDeliveryCompany": "string",
          "collectDeliveryMethod": "DELIVERY",
          "collectStatus": "NOT_REQUESTED",
          "collectTrackingNumber": "string",
          "etcFeeDemandAmount": 0,
          "etcFeePayMeans": "string",
          "etcFeePayMethod": "string",
          "exchangeDetailedReason": "string",
          "exchangeReason": "string",
          "holdbackDetailedReason": "string",
          "holdbackReason": "string",
          "holdbackStatus": "string",
          "reDeliveryMethod": "DELIVERY",
          "reDeliveryStatus": "COLLECT_REQUEST",
          "reDeliveryCompany": "string",
          "reDeliveryTrackingNumber": "string",
          "reDeliveryAddress": {
            "addressType": "string",
            "baseAddress": "string",
            "city": "string",
            "country": "string",
            "detailedAddress": "string",
            "name": "string",
            "state": "string",
            "tel1": "string",
            "tel2": "string",
            "zipCode": "string",
            "isRoadNameAddress": true
          },
          "requestChannel": "string",
          "requestQuantity": 0,
          "returnReceiveAddress": {
            "addressType": "string",
            "baseAddress": "string",
            "city": "string",
            "country": "string",
            "detailedAddress": "string",
            "name": "string",
            "state": "string",
            "tel1": "string",
            "tel2": "string",
            "zipCode": "string",
            "isRoadNameAddress": true,
            "logisticsCenterId": "string"
          },
          "holdbackConfigDate": "2023-01-16T17:14:51.794+09:00",
          "holdbackConfigurer": "string",
          "holdbackReleaseDate": "2023-01-16T17:14:51.794+09:00",
          "holdbackReleaser": "string",
          "claimDeliveryFeeProductOrderIds": "string",
          "reDeliveryOperationDate": "2023-01-16T17:14:51.794+09:00",
          "claimDeliveryFeeDiscountAmount": 0,
          "remoteAreaCostChargeAmount": 0,
          "membershipsArrivalGuaranteeClaimSupportingAmount": 0,
          "exchangeImageUrl": [
            "string"
          ],
          "claimDeliveryFeeSupportType": "string",
          "claimDeliveryFeeSupportAmount": 0
        }
      },
      "completedClaims": [
        {
          "claimType": "string",
          "claimId": "string",
          "claimStatus": "string",
          "claimRequestDate": "2023-01-16T17:14:51.794+09:00",
          "requestChannel": "string",
          "claimRequestDetailContent": "string",
          "claimRequestReason": "string",
          "refundExpectedDate": "2023-01-16T17:14:51.794+09:00",
          "refundStandbyReason": "string",
          "refundStandbyStatus": "string",
          "requestQuantity": 0,
          "claimDeliveryFeeDemandAmount": 0,
          "claimDeliveryFeePayMeans": "string",
          "claimDeliveryFeePayMethod": "string",
          "returnReceiveAddress": {
            "addressType": "string",
            "baseAddress": "string",
            "city": "string",
            "country": "string",
            "detailedAddress": "string",
            "name": "string",
            "state": "string",
            "tel1": "string",
            "tel2": "string",
            "zipCode": "string",
            "isRoadNameAddress": true,
            "logisticsCenterId": "string"
          },
          "collectAddress": {
            "addressType": "string",
            "baseAddress": "string",
            "city": "string",
            "country": "string",
            "detailedAddress": "string",
            "name": "string",
            "state": "string",
            "tel1": "string",
            "tel2": "string",
            "zipCode": "string",
            "isRoadNameAddress": true
          },
          "collectCompletedDate": "2023-01-16T17:14:51.794+09:00",
          "collectDeliveryCompany": "string",
          "collectDeliveryMethod": "DELIVERY",
          "collectStatus": "NOT_REQUESTED",
          "collectTrackingNumber": "string",
          "etcFeeDemandAmount": 0,
          "etcFeePayMeans": "string",
          "etcFeePayMethod": "string",
          "holdbackDetailedReason": "string",
          "holdbackReason": "string",
          "holdbackStatus": "string",
          "holdbackConfigDate": "2023-01-16T17:14:51.794+09:00",
          "holdbackConfigurer": "string",
          "holdbackReleaseDate": "2023-01-16T17:14:51.794+09:00",
          "holdbackReleaser": "string",
          "claimDeliveryFeeProductOrderIds": "string",
          "claimDeliveryFeeDiscountAmount": 0,
          "remoteAreaCostChargeAmount": 0,
          "claimCompleteOperationDate": "2023-01-16T17:14:51.794+09:00",
          "claimRequestAdmissionDate": "2023-01-16T17:14:51.794+09:00",
          "collectOperationDate": "string",
          "collectStartTime": "string",
          "collectEndTime": "string",
          "collectSlotId": "string",
          "reDeliveryAddress": {
            "addressType": "string",
            "baseAddress": "string",
            "city": "string",
            "country": "string",
            "detailedAddress": "string",
            "name": "string",
            "state": "string",
            "tel1": "string",
            "tel2": "string",
            "zipCode": "string",
            "isRoadNameAddress": true
          },
          "reDeliveryMethod": "DELIVERY",
          "reDeliveryStatus": "COLLECT_REQUEST",
          "reDeliveryCompany": "string",
          "reDeliveryTrackingNumber": "string",
          "reDeliveryOperationDate": "2023-01-16T17:14:51.794+09:00",
          "membershipsArrivalGuaranteeClaimSupportingAmount": 0,
          "claimDeliveryFeeSupportType": "string",
          "claimDeliveryFeeSupportAmount": 0
        }
      ],
      "delivery": {
        "deliveredDate": "2023-01-16T17:14:51.794+09:00",
        "deliveryCompany": "string",
        "deliveryMethod": "DELIVERY",
        "deliveryStatus": "COLLECT_REQUEST",
        "isWrongTrackingNumber": true,
        "pickupDate": "2023-01-16T17:14:51.794+09:00",
        "sendDate": "2023-01-16T17:14:51.794+09:00",
        "trackingNumber": "string",
        "wrongTrackingNumberRegisteredDate": "2023-01-16T17:14:51.794+09:00",
        "wrongTrackingNumberType": "string"
      }
    }
  ]
}
```

