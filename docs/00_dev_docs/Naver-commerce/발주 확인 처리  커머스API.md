---
title: "발주 확인 처리 | 커머스API"
source: "https://apicenter.commerce.naver.com/docs/commerce-api/current/seller-confirm-placed-product-orders-pay-order-seller"
author:
published:
created: 2025-09-26
description: "단수 또는 복수 개 상품 주문의 발주를 확인 처리합니다. 요청 가능한 상품 주문 번호는 최대 30개입니다."
tags:
  - "clippings"
---
# 발주 확인 처리

POST

## /v1/pay-order/seller/product-orders/confirm

단수 또는 복수 개 상품 주문의 발주를 확인 처리합니다. 요청 가능한 상품 주문 번호는 최대 30개입니다.

## Request

- application/json

### Body**required**

상품 주문 번호 배열

**productOrderIds**string[]

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

**successProductOrderInfos**object[]

- Array [
    

**productOrderId**string

(성공) 상품 주문 번호

**isReceiverAddressChanged**boolean

- ]
    

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

- ]
    

- curl
- java
- python
- php
- nodejs
- csharp
- kotlin

- AXIOS
- NATIVE
- REQUEST
- UNIREST

```
const axios = require('axios');let data = JSON.stringify({  "productOrderIds": [    "string"  ]});let config = {  method: 'post',  maxBodyLength: Infinity,  url: 'https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/confirm',  headers: {     'Content-Type': 'application/json',     'Accept': 'application/json',     'Authorization': 'Bearer <token>'  },  data : data};axios.request(config).then((response) => {  console.log(JSON.stringify(response.data));}).catch((error) => {  console.log(error);});
```

[

Previous

주문-클레임 처리 반환 구조체

](https://apicenter.commerce.naver.com/docs/commerce-api/current/schemas/%EC%A3%BC%EB%AC%B8-%ED%81%B4%EB%A0%88%EC%9E%84-%EC%B2%98%EB%A6%AC-%EB%B0%98%ED%99%98-%EA%B5%AC%EC%A1%B0%EC%B2%B4)[

Next

발송 처리

](https://apicenter.commerce.naver.com/docs/commerce-api/current/seller-dispatch-product-orders-pay-order-seller)

- [커머스API센터](https://apicenter.commerce.naver.com/)
- [개인정보 처리방침](https://business.naver.com/privacy/privacy.html)
- [고객센터](https://help.sell.smartstore.naver.com/faq/list.help?categoryId=10783)

![](https://apicenter.commerce.naver.com/docs/img/logo_naver.svg)

Copyright © [**NAVER Corp.**](https://www.navercorp.com/ "새창")All rights reserved.

![](chrome-extension://cgococegfcmmfcjggpgelfbjkkncclkf/static/icon/ico_logo_128.png)


```nodejs
const axios = require('axios');
let data = JSON.stringify({
  "productOrderIds": [
    "string"
  ]
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/confirm',
  headers: { 
    'Content-Type': 'application/json', 
    'Accept': 'application/json', 
    'Authorization': 'Bearer <token>'
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
```

