---
title: "조건형 상품 주문 상세 내역 조회 | 커머스API"
source: "https://apicenter.commerce.naver.com/docs/commerce-api/current/seller-get-product-orders-with-conditions-pay-order-seller"
author:
published:
created: 2025-09-26
description: "조건에 맞는 상품 주문에 대한 상세 내역을 조회합니다."
tags:
  - "clippings"
---
## 조건형 상품 주문 상세 내역 조회

\`\`\`markdown
GET /v1/pay-order/seller/product-orders
\`\`\`

조건에 맞는 상품 주문에 대한 상세 내역을 조회합니다.

## Request

## Responses

- 200
- 400
- 500

(성공) 상품 주문 내역

- application/json

- Schema
- Example (auto)


# 조건형 상품 주문 상세 내역 조회

GET

## /v1/pay-order/seller/product-orders

조건에 맞는 상품 주문에 대한 상세 내역을 조회합니다.

## Request

### Query Parameters

**from**string<date-time>required

조회 기준의 시작 일시(inclusive)

**Example:** 2024-06-07T19:00:00.000+09:00

**to**string<date-time>

조회 기준의 종료 일시(inclusive). 생략 시 from으로부터 24시간 후로 자동 지정됩니다.

**Example:** 2024-06-08T19:00:00.000+09:00

**rangeType**rangeType.pay-order-seller (string)required

조회 기준 유형. 250바이트 내외

|코드|설명|비고|
|---|---|---|
|PAYED_DATETIME|결제 일시||
|ORDERED_DATETIME|주문 일시||
|DISPATCHED_DATETIME|발송 처리 일시||
|PURCHASE_DECIDED_DATETIME|구매 확정 일시||
|CLAIM_REQUESTED_DATETIME|클레임 요청 일시||
|CLAIM_COMPLETED_DATETIME|클레임 완료 일시||
|COLLECT_COMPLETED_DATETIME|수거 완료 일시||
|GIFT_RECEIVED_DATETIME|선물 수락 일시||
|HOPE_DELIVERY_INFO_CHANGED_DATETIME|배송 희망일 변경 일시||

**Example:** PAYED_DATETIME

**productOrderStatuses**productOrderStatus.pay-order-seller (string)[]

상품 주문 상태 목록. 250바이트 내외

|코드|설명|비고|
|---|---|---|
|PAYMENT_WAITING|결제 대기||
|PAYED|결제 완료||
|DELIVERING|배송 중||
|DELIVERED|배송 완료||
|PURCHASE_DECIDED|구매 확정||
|EXCHANGED|교환||
|CANCELED|취소||
|RETURNED|반품||
|CANCELED_BY_NOPAYMENT|미결제 취소||

**Example:** [PAYMENT_WAITING, PAYED, CANCELED]

**claimStatuses**claimStatus.pay-order-seller (string)[]

클레임 상태 목록. 250바이트 내외

|코드|설명|비고|
|---|---|---|
|CANCEL_REQUEST|취소 요청||
|CANCELING|취소 처리 중||
|CANCEL_DONE|취소 처리 완료||
|CANCEL_REJECT|취소 철회||
|RETURN_REQUEST|반품 요청||
|EXCHANGE_REQUEST|교환 요청||
|COLLECTING|수거 처리 중||
|COLLECT_DONE|수거 완료||
|EXCHANGE_REDELIVERING|교환 재배송 중||
|RETURN_DONE|반품 완료||
|EXCHANGE_DONE|교환 완료||
|RETURN_REJECT|반품 철회||
|EXCHANGE_REJECT|교환 철회||
|PURCHASE_DECISION_HOLDBACK|구매 확정 보류||
|PURCHASE_DECISION_REQUEST|구매 확정 요청||
|PURCHASE_DECISION_HOLDBACK_RELEASE|구매 확정 보류 해제||
|ADMIN_CANCELING|직권 취소 중||
|ADMIN_CANCEL_DONE|직권 취소 완료||
|ADMIN_CANCEL_REJECT|직권 취소 철회||

**Example:** [CANCEL_REQUEST, CANCELING]

**placeOrderStatusType**placeOrderStatus.pay-order-seller (string)

발주 상태. 250바이트 내외

|코드|설명|비고|
|---|---|---|
|NOT_YET|발주 미확인||
|OK|발주 확인||
|CANCEL|발주 확인 해제||

**Example:** NOT_YET

**fulfillment**boolean

풀필먼트 배송 여부

|값|설명|비고|
|---|---|---|
|null|풀필먼트 설정된 상품 여부를 구분하지 않고 상품 주문 상세 내역을 조회합니다.||
|false|풀필먼트 설정이 되지 않은 상품의 상품 주문 상세 내역을 조회합니다.||
|true|풀필먼트 설정된 상품의 상품 주문 상세 내역을 조회합니다.||

**Example:** true

**pageSize**integer

페이지 크기

**Default value:** `300`

**Example:** 300

**Possible values:** `>= 1` and `<= 300`

**page**integer

페이지 번호

**Default value:** `1`

**Example:** 1

**Possible values:** `>= 1`

**quantityClaimCompatibility**boolean

수량 클레임 변경 사항 개발 대응 완료 여부(수량 클레임 변경 사항에 대한 개발 대응 완료 시 true 값으로 호출)

**Example:** true

## Responses

- 200
- 400
- 500

(성공) 상품 주문 내역

- application/json

- Schema
- Example (auto)

**Schema**

**timestamp**string<date-time>

**Example:** `2023-01-16T17:14:51.794+09:00`

**traceId**stringrequired

**data**object

**contents**commonConditionalProductOrderDetails.pay-order-seller (object)[]

- Array [
    

**productOrderId**string

상품 주문 번호. 20바이트 내외

**content**productOrderDetails.pay-order-seller (object)

- ]
    

**pagination**pagination.pay-order-seller (object)

페이징 정보

**page**integer

현재 페이지 번호

**size**integer

페이지 크기

**hasNext**boolean

다음 페이지 존재 여부

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

\`\`\`
const axios = require('axios');let config = {  method: 'get',  maxBodyLength: Infinity,  url: 'https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders',  headers: {     'Accept': 'application/json',     'Authorization': 'Bearer <token>'  }};axios.request(config).then((response) => {  console.log(JSON.stringify(response.data));}).catch((error) => {  console.log(error);});
\`\`\`

[

Previous

상품 주문 목록 조회

](https://apicenter.commerce.naver.com/docs/commerce-api/current/seller-get-product-order-ids-pay-order-seller)[

Next

변경 상품 주문 내역 조회

](https://apicenter.commerce.naver.com/docs/commerce-api/current/seller-get-last-changed-status-pay-order-seller)

- [커머스API센터](https://apicenter.commerce.naver.com/)
- [개인정보 처리방침](https://business.naver.com/privacy/privacy.html)
- [고객센터](https://help.sell.smartstore.naver.com/faq/list.help?categoryId=10783)

![](https://apicenter.commerce.naver.com/docs/img/logo_naver.svg)

Copyright © [**NAVER Corp.**](https://www.navercorp.com/ "새창")All rights reserved.

![](chrome-extension://cgococegfcmmfcjggpgelfbjkkncclkf/static/icon/ico_logo_128.png)


# 조건형 상품 주문 상세 내역 조회

GET

## /v1/pay-order/seller/product-orders

조건에 맞는 상품 주문에 대한 상세 내역을 조회합니다.

## Request

### Query Parameters

**from**string<date-time>required

조회 기준의 시작 일시(inclusive)

**Example:** 2024-06-07T19:00:00.000+09:00

**to**string<date-time>

조회 기준의 종료 일시(inclusive). 생략 시 from으로부터 24시간 후로 자동 지정됩니다.

**Example:** 2024-06-08T19:00:00.000+09:00

**rangeType**rangeType.pay-order-seller (string)required

조회 기준 유형. 250바이트 내외

|코드|설명|비고|
|---|---|---|
|PAYED_DATETIME|결제 일시||
|ORDERED_DATETIME|주문 일시||
|DISPATCHED_DATETIME|발송 처리 일시||
|PURCHASE_DECIDED_DATETIME|구매 확정 일시||
|CLAIM_REQUESTED_DATETIME|클레임 요청 일시||
|CLAIM_COMPLETED_DATETIME|클레임 완료 일시||
|COLLECT_COMPLETED_DATETIME|수거 완료 일시||
|GIFT_RECEIVED_DATETIME|선물 수락 일시||
|HOPE_DELIVERY_INFO_CHANGED_DATETIME|배송 희망일 변경 일시||

**Example:** PAYED_DATETIME

**productOrderStatuses**productOrderStatus.pay-order-seller (string)[]

상품 주문 상태 목록. 250바이트 내외

|코드|설명|비고|
|---|---|---|
|PAYMENT_WAITING|결제 대기||
|PAYED|결제 완료||
|DELIVERING|배송 중||
|DELIVERED|배송 완료||
|PURCHASE_DECIDED|구매 확정||
|EXCHANGED|교환||
|CANCELED|취소||
|RETURNED|반품||
|CANCELED_BY_NOPAYMENT|미결제 취소||

**Example:** [PAYMENT_WAITING, PAYED, CANCELED]

**claimStatuses**claimStatus.pay-order-seller (string)[]

클레임 상태 목록. 250바이트 내외

|코드|설명|비고|
|---|---|---|
|CANCEL_REQUEST|취소 요청||
|CANCELING|취소 처리 중||
|CANCEL_DONE|취소 처리 완료||
|CANCEL_REJECT|취소 철회||
|RETURN_REQUEST|반품 요청||
|EXCHANGE_REQUEST|교환 요청||
|COLLECTING|수거 처리 중||
|COLLECT_DONE|수거 완료||
|EXCHANGE_REDELIVERING|교환 재배송 중||
|RETURN_DONE|반품 완료||
|EXCHANGE_DONE|교환 완료||
|RETURN_REJECT|반품 철회||
|EXCHANGE_REJECT|교환 철회||
|PURCHASE_DECISION_HOLDBACK|구매 확정 보류||
|PURCHASE_DECISION_REQUEST|구매 확정 요청||
|PURCHASE_DECISION_HOLDBACK_RELEASE|구매 확정 보류 해제||
|ADMIN_CANCELING|직권 취소 중||
|ADMIN_CANCEL_DONE|직권 취소 완료||
|ADMIN_CANCEL_REJECT|직권 취소 철회||

**Example:** [CANCEL_REQUEST, CANCELING]

**placeOrderStatusType**placeOrderStatus.pay-order-seller (string)

발주 상태. 250바이트 내외

|코드|설명|비고|
|---|---|---|
|NOT_YET|발주 미확인||
|OK|발주 확인||
|CANCEL|발주 확인 해제||

**Example:** NOT_YET

**fulfillment**boolean

풀필먼트 배송 여부

|값|설명|비고|
|---|---|---|
|null|풀필먼트 설정된 상품 여부를 구분하지 않고 상품 주문 상세 내역을 조회합니다.||
|false|풀필먼트 설정이 되지 않은 상품의 상품 주문 상세 내역을 조회합니다.||
|true|풀필먼트 설정된 상품의 상품 주문 상세 내역을 조회합니다.||

**Example:** true

**pageSize**integer

페이지 크기

**Default value:** `300`

**Example:** 300

**Possible values:** `>= 1` and `<= 300`

**page**integer

페이지 번호

**Default value:** `1`

**Example:** 1

**Possible values:** `>= 1`

**quantityClaimCompatibility**boolean

수량 클레임 변경 사항 개발 대응 완료 여부(수량 클레임 변경 사항에 대한 개발 대응 완료 시 true 값으로 호출)

**Example:** true

## Responses

- 200
- 400
- 500

(성공) 상품 주문 내역

- application/json

- Schema
- Example (auto)

**Schema**

**timestamp**string<date-time>

**Example:** `2023-01-16T17:14:51.794+09:00`

**traceId**stringrequired

**data**object

**contents**commonConditionalProductOrderDetails.pay-order-seller (object)[]

- Array [
    

**productOrderId**string

상품 주문 번호. 20바이트 내외

**content**productOrderDetails.pay-order-seller (object)

- ]
    

**pagination**pagination.pay-order-seller (object)

페이징 정보

**page**integer

현재 페이지 번호

**size**integer

페이지 크기

**hasNext**boolean

다음 페이지 존재 여부

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

\`\`\`
const axios = require('axios');let config = {  method: 'get',  maxBodyLength: Infinity,  url: 'https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders',  headers: {     'Accept': 'application/json',     'Authorization': 'Bearer <token>'  }};axios.request(config).then((response) => {  console.log(JSON.stringify(response.data));}).catch((error) => {  console.log(error);});
\`\`\`

[

Previous

상품 주문 목록 조회

](https://apicenter.commerce.naver.com/docs/commerce-api/current/seller-get-product-order-ids-pay-order-seller)[

Next

변경 상품 주문 내역 조회

](https://apicenter.commerce.naver.com/docs/commerce-api/current/seller-get-last-changed-status-pay-order-seller)

- [커머스API센터](https://apicenter.commerce.naver.com/)
- [개인정보 처리방침](https://business.naver.com/privacy/privacy.html)
- [고객센터](https://help.sell.smartstore.naver.com/faq/list.help?categoryId=10783)

![](https://apicenter.commerce.naver.com/docs/img/logo_naver.svg)

Copyright © [**NAVER Corp.**](https://www.navercorp.com/ "새창")All rights reserved.

![](chrome-extension://cgococegfcmmfcjggpgelfbjkkncclkf/static/icon/ico_logo_128.png)



\`\`\`node
const axios = require('axios');

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders',
  headers: { 
    'Accept': 'application/json', 
    'Authorization': 'Bearer <token>'
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
\`\`\`
