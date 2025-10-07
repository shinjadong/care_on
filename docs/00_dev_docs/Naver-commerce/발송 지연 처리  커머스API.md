---
title: "발송 지연 처리 | 커머스API"
source: "https://apicenter.commerce.naver.com/docs/commerce-api/current/seller-delay-dispatch-due-date-pay-order-seller"
author:
published:
created: 2025-09-26
description: "특정 상품 주문을 발송 지연 처리합니다."
tags:
  - "clippings"
---
---
title: "발송 지연 처리 | 커머스API"
source: "https://apicenter.commerce.naver.com/docs/commerce-api/current/seller-delay-dispatch-due-date-pay-order-seller"
author:
published:
created: 2025-09-26
description: "특정 상품 주문을 발송 지연 처리합니다."
tags:
  - "clippings"
---
POST 

## /v1/pay-order/seller/product-orders/:productOrderId/delay

특정 상품 주문을 발송 지연 처리합니다.

## Request[​](https://apicenter.commerce.naver.com/docs/commerce-api/current/#request "Direct link to Request")

### Path Parameters

**productOrderId** stringrequired

상품 주문 번호

**Example:** 2022030221117100

- application/json

### Body**required**

string 배열

**dispatchDueDate**string<date-time>

발송 기한

**Example:** `2022-06-05T12:17:35.000+09:00`

**delayedDispatchReason**delayedDispatchReason.pay-order-seller (string)

발송 지연 사유 코드. 250바이트 내외

| 코드 | 설명 | 비고 |
| --- | --- | --- |
| PRODUCT\_PREPARE | 상품 준비 중 |  |
| CUSTOMER\_REQUEST | 고객 요청 |  |
| CUSTOM\_BUILD | 주문 제작 |  |
| RESERVED\_DISPATCH | 예약 발송 |  |
| OVERSEA\_DELIVERY | 해외 배송 |  |
| ETC | 기타 |  |

**Example:** `PRODUCT_PREPARE`

**dispatchDelayedDetailedReason**string

발송 지연 상세 사유

**Example:** `상품 준비중입니다.`

## Responses[​](https://apicenter.commerce.naver.com/docs/commerce-api/current/#responses "Direct link to Responses")

- 200
- 400
- 500

(성공/실패) 상품 주문 처리 내역

- application/json

- Schema
- Example (auto)

**Schema**

**timestamp**string<date-time>

**Example:** `2023-01-16T17:14:51.794+09:00`

**traceId**stringrequired

**data** object

**successProductOrderIds**string\[\]

(성공) 상품 주문 번호

**failProductOrderInfos** object\[\]

- Array \[

**productOrderId**string

(실패) 상품 주문 번호

**code**errorCode.pay-order-seller (string)

## 오류 코드 정의

| 코드 | 설명 | 비고 |
| --- | --- | --- |
| **4000** | 잘못된 요청 파라미터 | 오류 유형.객체명.필드명 |
| **9999** | 기타 | 정의되지 않은 오류 코드 |
| **100001** | 상품 주문을 찾을 수 없음 |  |
| **100003** | 주문을 찾을 수 없음 |  |
| **101009** | 처리 권한이 없는 상품 주문 번호를 요청 |  |
| **104105** | 발송 기한 입력 범위 초과 |  |
| **104116** | 배송 방법 변경 필요(배송 없음 주문) |  |
| **104117** | 배송 방법 변경 필요 |  |
| **104118** | 택배사 미입력 |  |
| **104119** | 택배사 코드 확인 |  |
| **104120** | 송장 번호 미입력 |  |
| **104121** | 배송 송장 오류(기사용 송장) |  |
| **104122** | 배송 송장 오류(유효하지 않은 송장) |  |
| **104131** | 상품 주문 번호 중복 |  |
| **104133** | 잘못된 요청 |  |
| **104417** | 교환 상태 확인 필요(재배송 처리 불가능 주문 상태) |  |
| **104441** | 희망일배송 상품 또는 N희망일배송 상품이 아님 |  |
| **104442** | 상품 주문 상태 확인 필요 |  |
| **104443** | 발주 상태 확인 필요 |  |
| **104444** | 배송 희망일 날짜가 유효하지 않음 |  |
| **104445** | 배송 희망일 변경 가능 날짜 초과 |  |
| **104446** | 배송 희망일이 기존과 동일 |  |
| **104138** | 배송 희망일 변경 실패 |  |
| **104449** | 배송 희망일 변경 가능 기간이 아님 |  |
| **104450** | N희망일배송 상품은 배송 희망 시간, 지역 입력 불가 |  |
| **105306** | 변경을 요청한 상태가 기존과 동일 |  |

**message**string

(실패) 메시지

- \]



\`\`\`nodejs
const axios = require('axios');
let data = JSON.stringify({
  "dispatchDueDate": "2022-06-05T12:17:35.000+09:00",
  "delayedDispatchReason": "PRODUCT_PREPARE",
  "dispatchDelayedDetailedReason": "상품 준비중입니다."
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/:productOrderId/delay',
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
\`\`\`

\`\`\`curl
curl -L 'https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/:productOrderId/delay' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <token>' \
-d '{
  "dispatchDueDate": "2022-06-05T12:17:35.000+09:00",
  "delayedDispatchReason": "PRODUCT_PREPARE",
  "dispatchDelayedDetailedReason": "상품 준비중입니다."
}'
\`\`\`
