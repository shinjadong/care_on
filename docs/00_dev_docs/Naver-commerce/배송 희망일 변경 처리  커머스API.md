---
title: "배송 희망일 변경 처리 | 커머스API"
source: "https://apicenter.commerce.naver.com/docs/commerce-api/current/seller-change-hope-delivery-pay-order-seller"
author:
published:
created: 2025-09-26
description: "배송 희망일 정보를 변경 처리합니다."
tags:
  - "clippings"
---
# 배송 희망일 변경 처리

POST

## /v1/pay-order/seller/product-orders/:productOrderId/hope-delivery/change

배송 희망일 정보를 변경 처리합니다.

## Request

### Path Parameters

**productOrderId**stringrequired

상품 주문 번호

**Example:** 2022030221117100

- application/json

### Body**required**

배송 희망일 변경 정보

**hopeDeliveryYmd**stringrequired

배송 희망일. yyyymmdd 형식의 연월일

**Example:** `20221231`

**hopeDeliveryHm**string

배송 희망 시간. HHmm 형식의 시간

**Example:** `1500`

**region**string

지역. 길이 제한 1~30

**changeReason**stringrequired

변경 사유. 길이 제한 1~300

## Responses

- 200
- 400
- 500

(성공/실패) 상품 주문 처리 내역

- application/json

- Schema
- Example (auto)

**Schema**

**timestamp**string<date-time>

**Example:** `2023-01-16T17:14:51.794+09:00`

**traceId**stringrequired

**data**object

**successProductOrderIds**string[]

(성공) 상품 주문 번호

**failProductOrderInfos**object[]

- Array [
    

**productOrderId**string

(실패) 상품 주문 번호

**code**errorCode.pay-order-seller (string)

## 오류 코드 정의

|코드|설명|비고|
|---|---|---|
|**4000**|잘못된 요청 파라미터|오류 유형.객체명.필드명|
|**9999**|기타|정의되지 않은 오류 코드|
|**100001**|상품 주문을 찾을 수 없음||
|**100003**|주문을 찾을 수 없음||
|**101009**|처리 권한이 없는 상품 주문 번호를 요청||
|**104105**|발송 기한 입력 범위 초과||
|**104116**|배송 방법 변경 필요(배송 없음 주문)||
|**104117**|배송 방법 변경 필요||
|**104118**|택배사 미입력||
|**104119**|택배사 코드 확인||
|**104120**|송장 번호 미입력||
|**104121**|배송 송장 오류(기사용 송장)||
|**104122**|배송 송장 오류(유효하지 않은 송장)||
|**104131**|상품 주문 번호 중복||
|**104133**|잘못된 요청||
|**104417**|교환 상태 확인 필요(재배송 처리 불가능 주문 상태)||
|**104441**|희망일배송 상품 또는 N희망일배송 상품이 아님||
|**104442**|상품 주문 상태 확인 필요||
|**104443**|발주 상태 확인 필요||
|**104444**|배송 희망일 날짜가 유효하지 않음||
|**104445**|배송 희망일 변경 가능 날짜 초과||
|**104446**|배송 희망일이 기존과 동일||
|**104138**|배송 희망일 변경 실패||
|**104449**|배송 희망일 변경 가능 기간이 아님||
|**104450**|N희망일배송 상품은 배송 희망 시간, 지역 입력 불가||
|**105306**|변경을 요청한 상태가 기존과 동일||

**message**string

(실패) 메시지

- ]
    

- curl
- java
- python
- php
- nodejs
- csharp
- kotlin

- CURL

```
curl -L 'https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/:productOrderId/hope-delivery/change' \-H 'Content-Type: application/json' \-H 'Accept: application/json' \-H 'Authorization: Bearer <token>' \-d '{  "hopeDeliveryYmd": "20221231",  "hopeDeliveryHm": "1500",  "region": "string",  "changeReason": "string"}'
```

[

Previous

발송 지연 처리

](https://apicenter.commerce.naver.com/docs/commerce-api/current/seller-delay-dispatch-due-date-pay-order-seller)[

Next

주문 조회

](https://apicenter.commerce.naver.com/docs/commerce-api/current/%EC%A3%BC%EB%AC%B8-%EC%A1%B0%ED%9A%8C)

- [커머스API센터](https://apicenter.commerce.naver.com/)
- [개인정보 처리방침](https://business.naver.com/privacy/privacy.html)
- [고객센터](https://help.sell.smartstore.naver.com/faq/list.help?categoryId=10783)

![](https://apicenter.commerce.naver.com/docs/img/logo_naver.svg)

Copyright © [**NAVER Corp.**](https://www.navercorp.com/ "새창")All rights reserved.

![](chrome-extension://cgococegfcmmfcjggpgelfbjkkncclkf/static/icon/ico_logo_128.png)


```curl
curl -L 'https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/:productOrderId/hope-delivery/change' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <token>' \
-d '{
  "hopeDeliveryYmd": "20221231",
  "hopeDeliveryHm": "1500",
  "region": "string",
  "changeReason": "string"
}'
```


******
```node
curl -L 'https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/:productOrderId/hope-delivery/change' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <token>' \
-d '{
  "hopeDeliveryYmd": "20221231",
  "hopeDeliveryHm": "1500",
  "region": "string",
  "changeReason": "string"
}'
```


