---
title: "변경 상품 주문 정보 구조체 | 커머스API"
source: "https://apicenter.commerce.naver.com/docs/commerce-api/current/schemas/%EB%B3%80%EA%B2%BD-%EC%83%81%ED%92%88-%EC%A3%BC%EB%AC%B8-%EC%A0%95%EB%B3%B4-%EA%B5%AC%EC%A1%B0%EC%B2%B4"
author:
published:
created: 2025-09-26
description: "이 구조체는 주문건의 변경 상품 주문 정보를 표현하는 구조체입니다."
tags:
  - "clippings"
---
## 변경 상품 주문 정보 구조체

이 구조체는 주문건의 변경 상품 주문 정보를 표현하는 구조체입니다. 전체 주문건에서 지정된 조회 조건에 해당하는 주문건을 식별할 수 있는 일부 정보를 표현합니다.

- 이 구조체는 API 호출에 대한 응답으로만 사용합니다.
- 구조체의 객체 1개는 상품주문번호 1개를 표현합니다.

- Array \[

**orderId** string

주문 ID. 20바이트 내외

**productOrderId** string

상품 주문 ID. 20바이트 내외

**lastChangedType** lastChangedType.pay-order-seller (string)

최종 변경 구분. 250바이트 내외

| 코드 | 설명 | 비고 |
| --- | --- | --- |
| PAY\_WAITING | 결제 대기 |  |
| PAYED | 결제 완료 |  |
| EXCHANGE\_OPTION | 옵션 변경 | 선물하기 |
| DELIVERY\_ADDRESS\_CHANGED | 배송지 변경 |  |
| GIFT\_RECEIVED | 선물 수락 | 선물하기 |
| CLAIM\_REJECTED | 클레임 철회 |  |
| DISPATCHED | 발송 처리 |  |
| CLAIM\_REQUESTED | 클레임 요청 |  |
| COLLECT\_DONE | 수거 완료 |  |
| CLAIM\_COMPLETED | 클레임 완료 |  |
| PURCHASE\_DECIDED | 구매 확정 |  |
| HOPE\_DELIVERY\_INFO\_CHANGED | 배송 희망일 변경 |  |
| CLAIM\_REDELIVERING | 교환 재배송처리 |  |

**paymentDate** string<date-time>

결제 일시. 45바이트 내외

**Example:** `2023-01-16T17:14:51.794+09:00`

**lastChangedDate** string<date-time>

최종 변경 일시. 45바이트 내외

**Example:** `2023-01-16T17:14:51.794+09:00`

**productOrderStatus** productOrderStatus.pay-order-seller (string)

상품 주문 상태. 250바이트 내외

| 코드 | 설명 | 비고 |
| --- | --- | --- |
| PAYMENT\_WAITING | 결제 대기 |  |
| PAYED | 결제 완료 |  |
| DELIVERING | 배송 중 |  |
| DELIVERED | 배송 완료 |  |
| PURCHASE\_DECIDED | 구매 확정 |  |
| EXCHANGED | 교환 |  |
| CANCELED | 취소 |  |
| RETURNED | 반품 |  |
| CANCELED\_BY\_NOPAYMENT | 미결제 취소 |  |

**claimType** claimType.pay-order-seller (string)

클레임 구분. 250바이트 내외

| 코드 | 설명 | 비고 |
| --- | --- | --- |
| CANCEL | 취소 |  |
| RETURN | 반품 |  |
| EXCHANGE | 교환 |  |
| PURCHASE\_DECISION\_HOLDBACK | 구매 확정 보류 |  |
| ADMIN\_CANCEL | 직권 취소 |  |

**claimStatus** claimStatus.pay-order-seller (string)

클레임 상태. 250바이트 내외

| 코드 | 설명 | 비고 |
| --- | --- | --- |
| CANCEL\_REQUEST | 취소 요청 |  |
| CANCELING | 취소 처리 중 |  |
| CANCEL\_DONE | 취소 처리 완료 |  |
| CANCEL\_REJECT | 취소 철회 |  |
| RETURN\_REQUEST | 반품 요청 |  |
| EXCHANGE\_REQUEST | 교환 요청 |  |
| COLLECTING | 수거 처리 중 |  |
| COLLECT\_DONE | 수거 완료 |  |
| EXCHANGE\_REDELIVERING | 교환 재배송 중 |  |
| RETURN\_DONE | 반품 완료 |  |
| EXCHANGE\_DONE | 교환 완료 |  |
| RETURN\_REJECT | 반품 철회 |  |
| EXCHANGE\_REJECT | 교환 철회 |  |
| PURCHASE\_DECISION\_HOLDBACK | 구매 확정 보류 |  |
| PURCHASE\_DECISION\_REQUEST | 구매 확정 요청 |  |
| PURCHASE\_DECISION\_HOLDBACK\_RELEASE | 구매 확정 보류 해제 |  |
| ADMIN\_CANCELING | 직권 취소 중 |  |
| ADMIN\_CANCEL\_DONE | 직권 취소 완료 |  |
| ADMIN\_CANCEL\_REJECT | 직권 취소 철회 |  |

**receiverAddressChanged** boolean

배송지 정보 변경 여부. 45바이트 내외

**Default value:** `false`

**giftReceivingStatus** giftReceivingStatus.pay-order-seller (string)

선물 수락 상태 구분. 250바이트 내외

| 코드 | 설명 | 비고 |
| --- | --- | --- |
| WAIT\_FOR\_RECEIVING | 수락 대기(배송지 입력 대기) |  |
| RECEIVED | 수락 완료 |  |

- \]

```json
변경 상품 주문 정보 구조체[
  {
    "orderId": "string",
    "productOrderId": "string",
    "lastChangedType": "string",
    "paymentDate": "2023-01-16T17:14:51.794+09:00",
    "lastChangedDate": "2023-01-16T17:14:51.794+09:00",
    "productOrderStatus": "string",
    "claimType": "string",
    "claimStatus": "string",
    "receiverAddressChanged": false,
    "giftReceivingStatus": "string"
  }
]
```