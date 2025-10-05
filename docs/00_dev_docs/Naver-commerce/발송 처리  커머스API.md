---
title: "발송 처리 | 커머스API"
source: "https://apicenter.commerce.naver.com/docs/commerce-api/current/seller-dispatch-product-orders-pay-order-seller"
author:
published:
created: 2025-09-26
description: "단수 또는 복수 개 상품 주문을 발송 처리합니다. 요청 가능한 상품 주문 번호는 최대 30개입니다."
tags:
  - "clippings"
---
# 발송 처리

POST

## /v1/pay-order/seller/product-orders/dispatch

단수 또는 복수 개 상품 주문을 발송 처리합니다. 요청 가능한 상품 주문 번호는 최대 30개입니다.

## Request

- application/json

### Body**required**

DispatchProductOrder 배열

**dispatchProductOrders**dispatchProductOrder.pay-order-seller (object)[]

- Array [
    

**productOrderId**string

상품 주문 번호

**Example:** `2022040521691281`

**deliveryMethod**deliveryMethod.pay-order-seller (string)

배송 방법 코드. 250바이트 내외

|코드|설명|비고|
|---|---|---|
|DELIVERY|택배, 등기, 소포||
|GDFW_ISSUE_SVC|굿스플로 송장 출력||
|VISIT_RECEIPT|방문 수령||
|DIRECT_DELIVERY|직접 전달||
|QUICK_SVC|퀵서비스||
|NOTHING|배송 없음||
|RETURN_DESIGNATED|지정 반품 택배||
|RETURN_DELIVERY|일반 반품 택배||
|RETURN_INDIVIDUAL|직접 반송||
|RETURN_MERCHANT|판매자 직접 수거(장보기 전용)||
|UNKNOWN|알 수 없음(예외 처리에 사용)||

**Example:** `DELIVERY`

**deliveryCompanyCode**deliveryCompanyCode.pay-order-seller (string)

택배사 코드. 250바이트 내외

|코드|설명|비고|
|---|---|---|
|CJGLS|CJ대한통운||
|HYUNDAI|롯데택배||
|HANJIN|한진택배||
|KGB|로젠택배||
|EPOST|우체국택배||
|MTINTER|엠티인터내셔널||
|1004HOME|1004HOME||
|TWOFASTEXPRESS|2FAST익스프레스||
|ACE|ACEexpress||
|ACIEXPRESS|ACI||
|ADCAIR|ADC항운택배||
|AIRWAY|AIRWAY익스프레스||
|APEX|APEX||
|ARAMEX|ARAMEX||
|ARGO|ARGO||
|AIRBOY|AirboyExpress||
|KOREXG|CJ대한통운(국제택배)||
|CUPARCEL|CU편의점택배||
|CWAYEXPRESS|CwayExpress||
|DHL|DHL||
|DHLDE|DHL(독일)||
|DHLGLOBALMAIL|DHLGlobalMail||
|DPD|DPD||
|ECMSEXPRESS|ECMSExpress||
|EFS|EFS||
|EMS|EMS||
|EZUSA|EZUSA||
|EUROPARCEL|EuroParcel||
|FEDEX|FEDEX||
|GOP|GOP당일택배||
|GOS|GOS당일택배||
|GPSLOGIX|GPSLOGIX||
|GSFRESH|GSFresh||
|GSIEXPRESS|GSI익스프레스||
|GSMNTON|GSMNTON||
|GSPOSTBOX|GSPostbox퀵||
|CVSNET|GSPostbox택배||
|GS더프레시|GSTHEFRESH||
|GTSLOGIS|GTS로지스||
|HYBRID|HI택배||
|HY|HY||
|IK|IK물류||
|KGLNET|KGL네트웍스||
|KT|KT EXPRESS||
|LGE|LG전자배송센터||
|LTL|LTL||
|NDEXKOREA|NDEX KOREA||
|SBGLS|SBGLS||
|SFEX|SFexpress||
|SLX|SLX택배||
|SSG|SSG||
|TNT|TNT||
|LOGISPARTNER|UFO로지스||
|UPS|UPS||
|USPS|USPS||
|WIZWA|WIZWA||
|YJSWORLD|YJS글로벌||
|YJS|YJS글로벌(영국)||
|YUNDA|YUNDAEXPRESS||
|IPARCEL|i-parcel||
|KY|건영복합물류||
|KUNYOUNG|건영택배||
|KDEXP|경동택배||
|KIN|경인택배||
|KORYO|고려택배||
|GDSP|골드스넵스||
|KOKUSAI|국제익스프레스||
|GOODTOLUCK|굿투럭||
|NAEUN|나은물류||
|NOGOK|노곡물류||
|NONGHYUP|농협택배||
|HANAROMART|농협하나로마트||
|DAELIM|대림통운||
|DAESIN|대신택배||
|DAEWOON|대운글로벌||
|THEBAO|더바오||
|DODOFLEX|도도플렉스||
|DONGGANG|동강물류||
|DONGJIN|동진특송||
|CHAINLOGIS|두발히어로당일택배||
|DRABBIT|딜리래빗||
|JMNP|딜리박스||
|ONEDAYLOGIS|라스트마일||
|LINEEXP|라인익스프레스||
|ROADSUNEXPRESS|로드썬익스프레스||
|LOGISVALLEY|로지스밸리||
|POOLATHOME|로지스올홈케어(풀앳홈)||
|LOTOS|로토스||
|HLCGLOBAL|롯데글로벌로지스(국제택배)||
|LOTTECHILSUNG|롯데칠성||
|MDLOGIS|모든로지스(SLO)||
|DASONG|물류대장||
|BABABA|바바바로지스||
|BANPOOM|반품구조대||
|VALEX|발렉스||
|SHIPNERGY|배송하기좋은날||
|PANTOS|LX판토스||
|VROONG|부릉||
|BRIDGE|브릿지로지스||
|EKDP|삼다수가정배송||
|SELC|삼성전자물류||
|SEORIM|서림물류||
|SWGEXP|성원글로벌||
|SUNGHUN|성훈물류||
|SEBANG|세방택배||
|SMARTLOGIS|스마트로지스||
|SPARKLE|스파클직배송||
|SPASYS1|스페이시스원||
|CRLX|시알로지텍||
|ANYTRACK|애니트랙||
|ABOUTPET|어바웃펫||
|ESTHER|에스더쉬핑||
|VENDORPIA|벤더피아||
|ACTCORE|에이씨티앤코아||
|HKHOLDINGS|에이치케이홀딩스||
|NTLPS|엔티엘피스||
|TODAYPICKUP|카카오T당일배송||
|RUSH|오늘회러쉬||
|ALLIN|올인닷컴||
|ALLTAKOREA|올타코리아||
|WIDETECH|와이드테크||
|YONGMA|용마로지스||
|DCOMMERCE|우리동네커머스||
|WEVILL|우리동네택배||
|HONAM|우리택배||
|WOORIHB|우리한방택배||
|WOOJIN|우진인터로지스||
|REGISTPOST|우편등기||
|WOONGJI|웅지익스프레스||
|WARPEX|워펙스||
|WINION|위니온로지스||
|WIHTYOU|위드유당일택배||
|WEMOVE|위무브||
|UFREIGHT|유프레이트코리아||
|EUNHA|은하쉬핑||
|INNOS|이노스(올인닷컴)||
|EMARTEVERYDAY|이마트에브리데이||
|ESTLA|이스트라||
|ETOMARS|이투마스||
|GENERALPOST|일반우편||
|ILSHIN|일신모닝택배||
|ILYANG|일양로지스||
|GNETWORK|자이언트||
|ZENIEL|제니엘시스템||
|JLOGIST|제이로지스트||
|GENIEGO|지니고당일특급||
|GDAKOREA|지디에이코리아||
|GHSPEED|지에이치스피드||
|JIKGUMOON|직구문||
|CHUNIL|천일택배||
|CHOROC|초록마을(외부 연동)||
|CHOROCMAEUL|초록마을(네이버직연동)||
|COSHIP|캐나다쉬핑||
|KJT|케이제이티||
|QRUN|큐런||
|CUBEFLOW|큐브플로우||
|QXPRESS|트랙스로지스||
|HEREWEGO|탱고앤고||
|TOMATO|토마토앱||
|TODAY|투데이||
|TSG|티에스지로지스||
|TEAMFRESH|팀프레시||
|PATEK|파테크해운상공||
|XINPATEK|파테크해운항공||
|PANASIA|판월드로지스틱||
|PANSTAR|팬스타국제특송(PIEX)||
|FOREVER|퍼레버택배||
|PULMUONE|풀무원(로지스밸리)||
|FREDIT|프레딧||
|FRESHMATES|프레시메이트||
|FRESH|컬리넥스트마일||
|PINGPONG|핑퐁||
|HOWSER|하우저||
|HIVECITY|하이브시티||
|HANDALUM|한달음택배||
|HANDEX|한덱스||
|HANMI|한미포스트||
|HANSSEM|한샘||
|HANWOORI|한우리물류||
|HPL|한의사랑택배||
|HDEXP|합동택배||
|HERWUZUG|허우적||
|GLOVIS|현대글로비스||
|HOMEINNO|홈이노베이션로지스||
|HOMEPICKTODAY|홈픽오늘도착||
|HOMEPICK|홈픽택배||
|HOMEPLUSDELIVERY|홈플러스||
|HOMEPLUSEXPRESS|홈플러스익스프레스||
|CARGOPLEASE|화물을부탁해||
|HWATONG|화통||
|CH1|기타 택배||
|LETUS|바로스||
|LETUS3PL|레터스||
|CASA|신세계까사||
|GCS|지씨에스||
|GKGLOBAL|지케이글로벌||
|BRCH|비알씨에이치||
|DNDN|든든택배||
|GONELO|고넬로||
|JCLS|JCLS||
|JWTNL|JWTNL||
|GS25|GS편의점(퀵배달용)||
|CU|CU편의점(퀵배달용)||

**trackingNumber**string

송장 번호

**Example:**

**dispatchDate**string<date-time>

배송일

**Example:** `2022-04-05T12:17:35.000+09:00`

- ]
    

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

- AXIOS
- NATIVE
- REQUEST
- UNIREST

```
const axios = require('axios');let data = JSON.stringify({  "dispatchProductOrders": [    {      "productOrderId": "2022040521691281",      "deliveryMethod": "DELIVERY",      "deliveryCompanyCode": "string",      "trackingNumber": "",      "dispatchDate": "2022-04-05T12:17:35.000+09:00"    }  ]});let config = {  method: 'post',  maxBodyLength: Infinity,  url: 'https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/dispatch',  headers: {     'Content-Type': 'application/json',     'Accept': 'application/json',     'Authorization': 'Bearer <token>'  },  data : data};axios.request(config).then((response) => {  console.log(JSON.stringify(response.data));}).catch((error) => {  console.log(error);});
```

[

Previous

발주 확인 처리

](https://apicenter.commerce.naver.com/docs/commerce-api/current/seller-confirm-placed-product-orders-pay-order-seller)[

Next

발송 지연 처리

](https://apicenter.commerce.naver.com/docs/commerce-api/current/seller-delay-dispatch-due-date-pay-order-seller)

- [커머스API센터](https://apicenter.commerce.naver.com/)
- [개인정보 처리방침](https://business.naver.com/privacy/privacy.html)
- [고객센터](https://help.sell.smartstore.naver.com/faq/list.help?categoryId=10783)

![](https://apicenter.commerce.naver.com/docs/img/logo_naver.svg)

Copyright © [**NAVER Corp.**](https://www.navercorp.com/ "새창")All rights reserved.





```curl
curl -L 'https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/dispatch' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <token>' \
-d '{
  "dispatchProductOrders": [
    {
      "productOrderId": "2022040521691281",
      "deliveryMethod": "DELIVERY",
      "deliveryCompanyCode": "string",
      "trackingNumber": "",
      "dispatchDate": "2022-04-05T12:17:35.000+09:00"
    }
  ]
}'
```


******

```
const axios = require('axios');
let data = JSON.stringify({
  "dispatchProductOrders": [
    {
      "productOrderId": "2022040521691281",
      "deliveryMethod": "DELIVERY",
      "deliveryCompanyCode": "string",
      "trackingNumber": "",
      "dispatchDate": "2022-04-05T12:17:35.000+09:00"
    }
  ]
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/dispatch',
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

