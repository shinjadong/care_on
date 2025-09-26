---
title: "상품 주문 상세 내역 조회 | 커머스API"
source: "https://apicenter.commerce.naver.com/docs/commerce-api/current/seller-get-product-orders-pay-order-seller"
author:
published:
created: 2025-09-26
description: "상품 주문에 대한 상세 상품 주문 내역을 조회합니다. 요청 가능한 상품 주문 번호는 최대 300개입니다."
tags:
  - "clippings"
---
# 상품 주문 상세 내역 조회

POST

## /v1/pay-order/seller/product-orders/query

상품 주문에 대한 상세 상품 주문 내역을 조회합니다. 요청 가능한 상품 주문 번호는 최대 300개입니다.

## Request

- application/json

### Body**required**

string 배열

**productOrderIds**string[]required

**quantityClaimCompatibility**boolean

수량 클레임 변경 사항 개발 대응 완료 여부(수량 클레임 변경 사항에 대한 개발 대응 완료 시 true 값으로 호출)

******

```curl
curl -L 'https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/query' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <token>' \
-d '{
  "productOrderIds": [
    "string"
  ],
  "quantityClaimCompatibility": true
}'
```

```nodejs
const axios = require('axios');
let data = JSON.stringify({
  "productOrderIds": [
    "string"
  ],
  "quantityClaimCompatibility": true
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/query',
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



******

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

**data**productOrdersInfo.pay-order-seller (object)[]

- Array [
    

**order**orderResponseContent.pay-order-seller (object)

**chargeAmountPaymentAmount**integer

충전금 최종 결제 금액

**checkoutAccumulationPaymentAmount**integer

네이버페이 적립금 최종 결제 금액

**generalPaymentAmount**integer

일반 결제 수단 최종 결제 금액

**naverMileagePaymentAmount**integer

네이버페이 포인트 최종 결제 금액

**orderDate**string<date-time>

주문 일시. 45바이트 내외

**Example:** `2023-01-16T17:14:51.794+09:00`

**orderDiscountAmount**integer

주문 할인액

**orderId**string

주문 번호. 20바이트 내외

**ordererId**string

주문자 ID. 20바이트 내외

**ordererName**string

주문자 이름. 300바이트 내외

**ordererTel**string

주문자 연락처(선물 주문은 마스킹됨). 45바이트 내외.

**paymentDate**string<date-time>

결제 일시(최종 결제). 45바이트 내외

**Example:** `2023-01-16T17:14:51.794+09:00`

**paymentDueDate**string<date-time>

결제 기한. 45바이트 내외

**Example:** `2023-01-16T17:14:51.794+09:00`

**paymentMeans**string

결제 수단. 300바이트 내외

|결제 수단|비고|
|---|---|
|신용카드||
|신용카드 간편결제||
|휴대폰||
|휴대폰 간편결제||
|계좌 간편결제||
|무통장입금||
|포인트/머니결제||
|패밀리결제||
|후불결제||

**isDeliveryMemoParticularInput**string

배송 메모 개별 입력 여부. 8바이트 내외

**payLocationType**string

결제 위치 구분(PC/MOBILE). 300바이트 내외

**ordererNo**string

주문자 번호. 20바이트 내외

**payLaterPaymentAmount**integer

후불 결제 최종 결제 금액

**isMembershipSubscribed**boolean

주문 시점 멤버십 여부

**productOrder**productOrderResponseContent.pay-order-seller (object)

**claimStatus**claimStatus.pay-order-seller (string)

클레임 상태. 250바이트 내외

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

**claimType**claimType.pay-order-seller (string)

클레임 구분. 250바이트 내외

|코드|설명|비고|
|---|---|---|
|CANCEL|취소||
|RETURN|반품||
|EXCHANGE|교환||
|PURCHASE_DECISION_HOLDBACK|구매 확정 보류||
|ADMIN_CANCEL|직권 취소||

**decisionDate**string<date-time>

구매 확정일. 45바이트 내외

**Example:** `2023-01-16T17:14:51.794+09:00`

**delayedDispatchDetailedReason**string

발송 지연 상세 사유. 4000바이트 내외

**delayedDispatchReason**delayedDispatchReason.pay-order-seller (string)

발송 지연 사유 코드. 250바이트 내외

|코드|설명|비고|
|---|---|---|
|PRODUCT_PREPARE|상품 준비 중||
|CUSTOMER_REQUEST|고객 요청||
|CUSTOM_BUILD|주문 제작||
|RESERVED_DISPATCH|예약 발송||
|OVERSEA_DELIVERY|해외 배송||
|ETC|기타||

**Example:** `PRODUCT_PREPARE`

**deliveryDiscountAmount**integer

배송비 최종 할인액

**deliveryFeeAmount**integer

배송비 합계

**deliveryPolicyType**string

배송비 정책(조건별 무료 등). 250바이트 내외

**expectedDeliveryMethod**deliveryMethod.pay-order-seller (string)

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

**freeGift**string

사은품. 1000바이트 내외

**mallId**string

가맹점 ID. 20바이트 내외

**optionCode**string

옵션 코드. 1000바이트 내외

**optionPrice**integer

옵션 금액

**packageNumber**string

묶음배송 번호. 20바이트 내외

**placeOrderDate**string<date-time>

발주 확인일. 45바이트 내외

**Example:** `2023-01-16T17:14:51.794+09:00`

**placeOrderStatus**placeOrderStatus.pay-order-seller (string)

발주 상태. 250바이트 내외

|코드|설명|비고|
|---|---|---|
|NOT_YET|발주 미확인||
|OK|발주 확인||
|CANCEL|발주 확인 해제||

**productClass**string

상품 종류(일반/추가 상품 구분). 250바이트 내외

**productDiscountAmount**integer

최초 상품별 할인액

**initialProductDiscountAmount**integer

최초 상품별 할인액

**remainProductDiscountAmount**integer

잔여 상품별 할인액

**groupProductId**number

그룹 상품번호

**productId**string

채널 상품번호. 150바이트 내외

**originalProductId**string

원상품번호. 150바이트 내외

**merchantChannelId**string

채널 번호. 150바이트 내외

**productName**string

상품명. 4000바이트 내외

**productOption**string

상품 옵션(옵션명). 4000바이트 내외

**productOrderId**string

상품 주문 번호. 20바이트 내외

**productOrderStatus**productOrderStatus.pay-order-seller (string)

상품 주문 상태. 250바이트 내외

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

**quantity**integer

최초 수량

**initialQuantity**integer

최초 수량

**remainQuantity**integer

잔여 수량

**sectionDeliveryFee**integer

지역별 추가 배송비

**sellerProductCode**string

판매자 상품 코드(판매자가 임의로 지정). 150바이트 내외

**shippingAddress**shippingAddress.pay-order-seller (object)

**shippingStartDate**string<date-time>

발송 시작일. 45바이트 내외

**Example:** `2023-01-16T17:14:51.794+09:00`

**shippingDueDate**string<date-time>

발송 기한. 45바이트 내외

**Example:** `2023-01-16T17:14:51.794+09:00`

**shippingFeeType**string

배송비 형태(선불/착불/무료). 250바이트 내외

**shippingMemo**string

배송 메모. 4000바이트 내외

**takingAddress**판매자 출고지 주소 (object)

**totalPaymentAmount**integer

최초 결제 금액(할인 적용 후 금액)

**initialPaymentAmount**integer

최초 결제 금액(할인 적용 후 금액)

**remainPaymentAmount**integer

잔여 결제 금액(할인 적용 후 금액)

**totalProductAmount**integer

최초 주문 금액(할인 적용 전 금액)

**initialProductAmount**integer

최초 주문 금액(할인 적용 전 금액)

**remainProductAmount**integer

잔여 주문 금액(할인 적용 전 금액)

**unitPrice**integer

상품 가격

**sellerBurdenDiscountAmount**integer

판매자 부담 할인액

**commissionRatingType**string

수수료 과금 구분(결제 수수료/(구)판매 수수료/채널 수수료). 250바이트 내외

**commissionPrePayStatus**commissionPrePayStatus.pay-order-seller (string)

수수료 선결제 상태 구분. 250바이트 내외

|코드|설명|비고|
|---|---|---|
|GENERAL_PRD|일반 상품||
|PRE_PAY_PRD_NO_PAY|선차감(차감 전)||
|PRE_PAY_PRD_PAYED|선차감(차감 후)||

**paymentCommission**integer

결제 수수료

**saleCommission**integer

(구)판매 수수료

**expectedSettlementAmount**integer

정산 예정 금액

**inflowPath**string

유입 경로(검색광고(SA)/공동구매/밴드/네이버 쇼핑/네이버 쇼핑 외). 250바이트 내외

**inflowPathAdd**string

유입 경로 추가 정보. 250바이트 내외

**itemNo**string

옵션 상품이나 추가 상품 등록 시 자동 생성된 아이템 번호로, 옵션 상품, 추가 상품을 구분하는 고유한 값. OptionCode와 동일한 값을 입력합니다. 1000바이트 내외

**optionManageCode**string

옵션 상품이나 추가 상품 등록 시 판매자가 별도로 입력한 옵션 관리 코드. 옵션 상품이나 추가 상품인 경우에 입력합니다. 1000바이트 내외

**sellerCustomCode1**string

판매자가 내부에서 사용하는 코드. 1000바이트 내외

**sellerCustomCode2**string

판매자가 내부에서 사용하는 코드. 1000바이트 내외

**claimId**string

클레임 번호. 20바이트 내외

**channelCommission**integer

채널 수수료

**individualCustomUniqueCode**string

구매자 개인통관고유부호. 구매 확정, 교환, 반품, 취소, 미결제 취소 상태의 거래 종료 주문에서는 노출되지 않습니다. 300바이트 내외

**productImediateDiscountAmount**integer

상품별 즉시 할인 금액

**initialProductImmediateDiscountAmount**integer

최초 상품별 즉시 할인 금액

**remainProductImmediateDiscountAmount**integer

잔여 상품별 즉시 할인 금액

**productProductDiscountAmount**integer

상품별 상품 할인 쿠폰 금액

**initialProductProductDiscountAmount**integer

최초 상품별 상품 할인 쿠폰 금액

**remainProductProductDiscountAmount**integer

잔여 상품별 상품 할인 쿠폰 금액

**productMultiplePurchaseDiscountAmount**integer

상품별 복수 구매 할인 금액

**sellerBurdenImediateDiscountAmount**integer

판매자 부담 즉시 할인 금액

**initialSellerBurdenImmediateDiscountAmount**integer

최초 판매자 부담 즉시 할인 금액

**remainSellerBurdenImmediateDiscountAmount**integer

잔여 판매자 부담 즉시 할인 금액

**sellerBurdenProductDiscountAmount**integer

판매자 부담 상품 할인 쿠폰 금액

**initialSellerBurdenProductDiscountAmount**integer

최초 판매자 부담 상품 할인 쿠폰 금액

**remainSellerBurdenProductDiscountAmount**integer

잔여 판매자 부담 상품 할인 쿠폰 금액

**sellerBurdenMultiplePurchaseDiscountAmount**integer

판매자 부담 복수 구매 할인 금액

**knowledgeShoppingSellingInterlockCommission**integer

네이버 쇼핑 매출 연동 수수료

**giftReceivingStatus**giftReceivingStatus.pay-order-seller (string)

선물 수락 상태 구분. 250바이트 내외

|코드|설명|비고|
|---|---|---|
|WAIT_FOR_RECEIVING|수락 대기(배송지 입력 대기)||
|RECEIVED|수락 완료||

**sellerBurdenStoreDiscountAmount**integer

판매자 부담 스토어 할인 금액

**sellerBurdenMultiplePurchaseDiscountType**multiplePurchaseDiscountType.pay-order-seller (string)

판매자 부담 복수 구매 할인 타입. 250바이트 내외

**Possible values:** [`IGNORE_QUANTITY`, `QUANTITY`]

**logisticsCompanyId**string

물류사 코드. 45바이트 내외

**logisticsCenterId**string

물류센터 코드. 45바이트 내외

**skuMappings**skuMapping.pay-order-seller (object)[]

**hopeDelivery**hopeDelivery.pay-order-seller (object)

**deliveryAttributeType**deliveryAttributeType.pay-order-seller (string)

배송 속성 타입 코드. 250바이트 내외

|코드|설명|비고|
|---|---|---|
|NORMAL|일반배송||
|TODAY|오늘출발||
|OPTION_TODAY|옵션별 오늘출발||
|HOPE|희망일배송||
|TODAY_ARRIVAL|당일배송||
|DAWN_ARRIVAL|새벽배송||
|PRE_ORDER|예약구매||
|ARRIVAL_GUARANTEE|N배송||
|SELLER_GUARANTEE|N판매자배송||
|HOPE_SELLER_GUARANTEE|N희망일배송||
|PICKUP|픽업||
|QUICK|즉시배달||

**expectedDeliveryCompany**deliveryCompanyCode.pay-order-seller (string)

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

**arrivalGuaranteeDate**string<date-time>

배송 도착 보장 일시. 45바이트 내외

**Example:** `2023-01-16T17:14:51.794+09:00`

**deliveryTagType**deliveryTagType.pay-order-seller (string)

배송 태그 타입. 일부 N배송, N희망일배송, N판매자배송 주문에 대해서만 제공됩니다.

|코드|설명|비고|
|---|---|---|
|TODAY|오늘배송||
|TOMORROW|내일배송||
|DAWN|새벽배송||
|SUNDAY|일요배송||
|STANDARD|D+2이상배송||
|HOPE|희망일배송||

**taxType**taxType.pay-order-seller (string)

상품 과면세 여부

|코드|설명|비고|
|---|---|---|
|TAXATION|과세||
|TAX_EXEMPTION|면세||
|TAX_FREE|영세||

**storageType**storageType.pay-order-seller (string)

옵션 보관 유형

|코드|설명|비고|
|---|---|---|
|DRY|상온||
|WET|냉장||
|FROZEN|냉동||

**cancel**취소(2025년 상반기 중 제거 예정, currentClaim 하위의 동일 오브젝트 사용 권장) (object)

**return**반품(2025년 상반기 중 제거 예정, currentClaim 하위의 동일 오브젝트 사용 권장) (object)

**claimId**string

클레임 번호. 20바이트 내외

**claimDeliveryFeeDemandAmount**integer

반품 배송비 청구액

**claimDeliveryFeePayMeans**string

반품 배송비 결제 수단. 250바이트 내외

**claimDeliveryFeePayMethod**string

반품 배송비 결제 방법. 250바이트 내외

**claimRequestDate**string<date-time>

클레임 요청일. 45바이트 내외

**Example:** `2023-01-16T17:14:51.794+09:00`

**claimStatus**claimStatus.pay-order-seller (string)

클레임 상태. 250바이트 내외

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

**collectAddress**구매자 수거지 주소 (object)

**collectCompletedDate**string<date-time>

수거 완료일. 45바이트 내외

**Example:** `2023-01-16T17:14:51.794+09:00`

**collectDeliveryCompany**deliveryCompanyCode.pay-order-seller (string)

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

**collectDeliveryMethod**deliveryMethod.pay-order-seller (string)

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

**collectStatus**collectStatus.pay-order-seller (string)

수거 상태. 250바이트 내외

|코드|설명|비고|
|---|---|---|
|NOT_REQUESTED|수거 미요청||
|COLLECT_REQUEST_TO_AGENT|수거 지시 완료||
|COLLECT_REQUEST_TO_DELIVERY_COMPANY|수거 요청||
|COLLECT_WAITING|택배사 수거 예정||
|DELIVERING|수거 진행 중||
|DELIVERED|수거 완료||
|DELIVERY_FAILED|배송 실패||
|COLLECT_FAILED|수거 실패||
|WRONG_INVOICE|오류 송장||
|COLLECT_CANCELED|수거 취소||

**Example:** `NOT_REQUESTED`

**collectTrackingNumber**string

수거 송장 번호. 100바이트 내외

**etcFeeDemandAmount**integer

기타 비용 청구액

**etcFeePayMeans**string

기타 비용 결제 수단. 250바이트 내외

**etcFeePayMethod**string

기타 비용 결제 방법. 250바이트 내외

**holdbackDetailedReason**string

보류 상세 사유. 4000바이트 내외

**holdbackReason**holdbackReason.pay-order-seller (string)

보류 유형. 250바이트 내외

|코드|설명|비고|
|---|---|---|
|RETURN_DELIVERYFEE|반품 배송비 청구||
|EXTRAFEEE|추가 비용 청구||
|RETURN_DELIVERYFEE_AND_EXTRAFEEE|반품 배송비 + 추가 비용 청구||
|RETURN_PRODUCT_NOT_DELIVERED|반품 상품 미입고||
|ETC|기타 사유||
|EXCHANGE_DELIVERYFEE|교환 배송비 청구||
|EXCHANGE_EXTRAFEE|추가 교환 비용 청구||
|EXCHANGE_PRODUCT_READY|교환 상품 준비 중||
|EXCHANGE_PRODUCT_NOT_DELIVERED|교환 상품 미입고||
|EXCHANGE_HOLDBACK|교환 구매 확정 보류||
|SELLER_CONFIRM_NEED|판매자 확인 필요||
|PURCHASER_CONFIRM_NEED|구매자 확인 필요||
|SELLER_REMIT|판매자 직접 송금||
|ETC2|기타||

**holdbackStatus**holdbackStatus.pay-order-seller (string)

보류 상태. 250바이트 내외

|코드|설명|비고|
|---|---|---|
|HOLDBACK|보류 중||
|RELEASED|보류 해제||

**refundExpectedDate**string<date-time>

환불 예정일. 45바이트 내외

**Example:** `2023-01-16T17:14:51.794+09:00`

**refundStandbyReason**string

환불 대기 사유. 250바이트 내외

**refundStandbyStatus**string

환불 대기 상태. 250바이트 내외

**requestChannel**string

접수 채널. 250바이트 내외

**requestQuantity**integer

요청 수량

**returnDetailedReason**string

반품 상세 사유. 100바이트 내외

**returnReason**claimReason.pay-order-seller (string)

클레임 요청 사유. 250바이트 내외

|코드|설명|비고|
|---|---|---|
|INTENT_CHANGED|구매 의사 취소||
|COLOR_AND_SIZE|색상 및 사이즈 변경||
|WRONG_ORDER|다른 상품 잘못 주문||
|PRODUCT_UNSATISFIED|서비스 불만족||
|DELAYED_DELIVERY|배송 지연||
|SOLD_OUT|상품 품절||
|DROPPED_DELIVERY|배송 누락||
|NOT_YET_DELIVERY|미배송||
|BROKEN|상품 파손||
|INCORRECT_INFO|상품 정보 상이||
|WRONG_DELIVERY|오배송||
|WRONG_OPTION|색상 등 다른 상품 잘못 배송||
|SIMPLE_INTENT_CHANGED|단순 변심||
|MISTAKE_ORDER|주문 실수||
|ETC|기타|API 에서 지정 불가|
|DELAYED_DELIVERY_BY_PURCHASER|배송 지연||
|INCORRECT_INFO_BY_PURCHASER|상품 정보 상이||
|PRODUCT_UNSATISFIED_BY_PURCHASER|서비스 불만족||
|NOT_YET_DISCUSSION|상호 협의가 완료되지 않은 주문 건||
|OUT_OF_STOCK|재고 부족으로 인한 판매 불가||
|SALE_INTENT_CHANGED|판매 의사 변심으로 인한 거부||
|NOT_YET_PAYMENT|구매자의 미결제로 인한 거부||
|NOT_YET_RECEIVE|상품 미수취||
|WRONG_DELAYED_DELIVERY|오배송 및 지연||
|BROKEN_AND_BAD|파손 및 불량||
|RECEIVING_DUE_DATE_OVER|수락 기한 만료||
|RECEIVER_MISMATCHED|수신인 불일치||
|GIFT_INTENT_CHANGED|보내기 취소||
|GIFT_REFUSAL|선물 거절||
|MINOR_RESTRICTED|상품 수신 불가||
|RECEIVING_BLOCKED|상품 수신 불가||
|UNDER_QUANTITY|주문 수량 미달||
|ASYNC_FAIL_PAYMENT|결제 승인 실패||
|ASYNC_LONG_WAIT_PAYMENT|결제 승인 실패||

**returnReceiveAddress**판매자 교환/반품 수취 주소 (object)

**returnCompletedDate**string<date-time>

반품 완료일. 45바이트 내외

**Example:** `2023-01-16T17:14:51.794+09:00`

**holdbackConfigDate**string<date-time>

보류 설정일. 45바이트 내외

**Example:** `2023-01-16T17:14:51.794+09:00`

**holdbackConfigurer**string

보류 설정자(구매자/판매자/관리자/시스템). 250바이트 내외

**holdbackReleaseDate**string<date-time>

보류 해제일. 45바이트 내외

**Example:** `2023-01-16T17:14:51.794+09:00`

**holdbackReleaser**string

보류 해제자(구매자/판매자/관리자/시스템). 250바이트 내외

**claimDeliveryFeeProductOrderIds**string

반품 배송비 묶음 청구 상품 주문 번호(여러 개면 쉼표로 구분). 4000바이트 내외

**claimDeliveryFeeDiscountAmount**integer

반품 배송비 할인액

**remoteAreaCostChargeAmount**integer

반품 도서산간 배송비

**membershipsArrivalGuaranteeClaimSupportingAmount**integer

멤버십 N배송 지원 금액

**returnImageUrl**string[]

반품 이미지 URL

**claimDeliveryFeeSupportType**claimDeliveryFeeSupportType.pay-order-seller (string)

클레임 배송비 지원 타입

|코드|설명|비고|
|---|---|---|
|MEMBERSHIP_ARRIVAL_GUARANTEE|멤버십 도착보장||
|MEMBERSHIP_KURLY|멤버십 컬리N마트||

**claimDeliveryFeeSupportAmount**integer

클레임 배송비 지원 금액

**exchange**교환(2025년 상반기 중 제거 예정, currentClaim 하위의 동일 오브젝트 사용 권장) (object)

**claimId**string

클레임 번호. 20바이트 내외

**claimDeliveryFeeDemandAmount**integer

교환 배송비 청구액

**claimDeliveryFeePayMeans**string

교환 배송비 결제 수단. 100바이트 내외

**claimDeliveryFeePayMethod**string

교환 배송비 결제 방법. 100바이트 내외

**claimRequestDate**string<date-time>

클레임 요청일. 45바이트 내외

**Example:** `2023-01-16T17:14:51.794+09:00`

**claimStatus**claimStatus.pay-order-seller (string)

클레임 상태. 250바이트 내외

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

**collectAddress**구매자 수거지 주소 (object)

**collectCompletedDate**string<date-time>

수거 완료일. 45바이트 내외

**Example:** `2023-01-16T17:14:51.794+09:00`

**collectDeliveryCompany**deliveryCompanyCode.pay-order-seller (string)

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

**collectDeliveryMethod**deliveryMethod.pay-order-seller (string)

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

**collectStatus**collectStatus.pay-order-seller (string)

수거 상태. 250바이트 내외

|코드|설명|비고|
|---|---|---|
|NOT_REQUESTED|수거 미요청||
|COLLECT_REQUEST_TO_AGENT|수거 지시 완료||
|COLLECT_REQUEST_TO_DELIVERY_COMPANY|수거 요청||
|COLLECT_WAITING|택배사 수거 예정||
|DELIVERING|수거 진행 중||
|DELIVERED|수거 완료||
|DELIVERY_FAILED|배송 실패||
|COLLECT_FAILED|수거 실패||
|WRONG_INVOICE|오류 송장||
|COLLECT_CANCELED|수거 취소||

**Example:** `NOT_REQUESTED`

**collectTrackingNumber**string

수거 송장 번호. 100바이트 내외

**etcFeeDemandAmount**integer

기타 비용 청구액

**etcFeePayMeans**string

기타 비용 결제 수단. 100바이트 내외

**etcFeePayMethod**string

기타 비용 결제 방법. 100바이트 내외

**exchangeDetailedReason**string

교환 상세 사유. 4000바이트 내외

**exchangeReason**claimReason.pay-order-seller (string)

클레임 요청 사유. 250바이트 내외

|코드|설명|비고|
|---|---|---|
|INTENT_CHANGED|구매 의사 취소||
|COLOR_AND_SIZE|색상 및 사이즈 변경||
|WRONG_ORDER|다른 상품 잘못 주문||
|PRODUCT_UNSATISFIED|서비스 불만족||
|DELAYED_DELIVERY|배송 지연||
|SOLD_OUT|상품 품절||
|DROPPED_DELIVERY|배송 누락||
|NOT_YET_DELIVERY|미배송||
|BROKEN|상품 파손||
|INCORRECT_INFO|상품 정보 상이||
|WRONG_DELIVERY|오배송||
|WRONG_OPTION|색상 등 다른 상품 잘못 배송||
|SIMPLE_INTENT_CHANGED|단순 변심||
|MISTAKE_ORDER|주문 실수||
|ETC|기타|API 에서 지정 불가|
|DELAYED_DELIVERY_BY_PURCHASER|배송 지연||
|INCORRECT_INFO_BY_PURCHASER|상품 정보 상이||
|PRODUCT_UNSATISFIED_BY_PURCHASER|서비스 불만족||
|NOT_YET_DISCUSSION|상호 협의가 완료되지 않은 주문 건||
|OUT_OF_STOCK|재고 부족으로 인한 판매 불가||
|SALE_INTENT_CHANGED|판매 의사 변심으로 인한 거부||
|NOT_YET_PAYMENT|구매자의 미결제로 인한 거부||
|NOT_YET_RECEIVE|상품 미수취||
|WRONG_DELAYED_DELIVERY|오배송 및 지연||
|BROKEN_AND_BAD|파손 및 불량||
|RECEIVING_DUE_DATE_OVER|수락 기한 만료||
|RECEIVER_MISMATCHED|수신인 불일치||
|GIFT_INTENT_CHANGED|보내기 취소||
|GIFT_REFUSAL|선물 거절||
|MINOR_RESTRICTED|상품 수신 불가||
|RECEIVING_BLOCKED|상품 수신 불가||
|UNDER_QUANTITY|주문 수량 미달||
|ASYNC_FAIL_PAYMENT|결제 승인 실패||
|ASYNC_LONG_WAIT_PAYMENT|결제 승인 실패||

**holdbackDetailedReason**string

보류 상세 사유. 4000바이트 내외

**holdbackReason**holdbackReason.pay-order-seller (string)

보류 유형. 250바이트 내외

|코드|설명|비고|
|---|---|---|
|RETURN_DELIVERYFEE|반품 배송비 청구||
|EXTRAFEEE|추가 비용 청구||
|RETURN_DELIVERYFEE_AND_EXTRAFEEE|반품 배송비 + 추가 비용 청구||
|RETURN_PRODUCT_NOT_DELIVERED|반품 상품 미입고||
|ETC|기타 사유||
|EXCHANGE_DELIVERYFEE|교환 배송비 청구||
|EXCHANGE_EXTRAFEE|추가 교환 비용 청구||
|EXCHANGE_PRODUCT_READY|교환 상품 준비 중||
|EXCHANGE_PRODUCT_NOT_DELIVERED|교환 상품 미입고||
|EXCHANGE_HOLDBACK|교환 구매 확정 보류||
|SELLER_CONFIRM_NEED|판매자 확인 필요||
|PURCHASER_CONFIRM_NEED|구매자 확인 필요||
|SELLER_REMIT|판매자 직접 송금||
|ETC2|기타||

**holdbackStatus**holdbackStatus.pay-order-seller (string)

보류 상태. 250바이트 내외

|코드|설명|비고|
|---|---|---|
|HOLDBACK|보류 중||
|RELEASED|보류 해제||

**reDeliveryMethod**deliveryMethod.pay-order-seller (string)

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

**reDeliveryStatus**deliveryStatus.pay-order-seller (string)

배송 상세 상태. 250바이트 내외

|코드|설명|비고|
|---|---|---|
|COLLECT_REQUEST|수거 요청||
|COLLECT_WAIT|수거 대기||
|COLLECT_CARGO|집화||
|DELIVERY_COMPLETION|배송 완료||
|DELIVERING|배송중||
|DELIVERY_FAIL|배송 실패||
|WRONG_INVOICE|오류 송장||
|COLLECT_CARGO_FAIL|집화 실패||
|COLLECT_CARGO_CANCEL|집화 취소||
|NOT_TRACKING|배송 추적 없음||

**Example:** `COLLECT_REQUEST`

**reDeliveryCompany**deliveryCompanyCode.pay-order-seller (string)

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

**reDeliveryTrackingNumber**string

재배송 송장 번호. 100바이트 내외

**reDeliveryAddress**구매자 재배송지 주소 (object)

**requestChannel**string

접수 채널. 100바이트 내외

**requestQuantity**integer

요청 수량

**returnReceiveAddress**판매자 교환/반품 수취 주소 (object)

**holdbackConfigDate**string<date-time>

보류 설정일. 45바이트 내외

**Example:** `2023-01-16T17:14:51.794+09:00`

**holdbackConfigurer**string

보류 설정자(구매자/판매자/관리자/시스템). 100바이트 내외

**holdbackReleaseDate**string<date-time>

보류 해제일. 45바이트 내외

**Example:** `2023-01-16T17:14:51.794+09:00`

**holdbackReleaser**string

보류 해제자(구매자/판매자/관리자/시스템). 100바이트 내외

**claimDeliveryFeeProductOrderIds**string

교환 배송비 묶음 청구 상품 주문 번호(여러 개면 쉼표로 구분). 4000바이트 내외

**reDeliveryOperationDate**string<date-time>

재배송 처리일. 45바이트 내외

**Example:** `2023-01-16T17:14:51.794+09:00`

**claimDeliveryFeeDiscountAmount**integer

교환 배송비 할인액

**remoteAreaCostChargeAmount**integer

교환 도서산간 배송비

**membershipsArrivalGuaranteeClaimSupportingAmount**integer

멤버십 N배송 지원 금액

**exchangeImageUrl**string[]

교환 이미지 URL

**claimDeliveryFeeSupportType**claimDeliveryFeeSupportType.pay-order-seller (string)

클레임 배송비 지원 타입

|코드|설명|비고|
|---|---|---|
|MEMBERSHIP_ARRIVAL_GUARANTEE|멤버십 도착보장||
|MEMBERSHIP_KURLY|멤버십 컬리N마트||

**claimDeliveryFeeSupportAmount**integer

클레임 배송비 지원 금액

**beforeClaim**beforeClaimResponseContent.pay-order-seller (object)

**exchange**exchangeResponseContent.pay-order-seller (object)

**currentClaim**currentClaimResponseContent.pay-order-seller (object)

**cancel**cancelResponseContent.pay-order-seller (object)

**return**returnResponseContent.pay-order-seller (object)

**exchange**exchangeResponseContent.pay-order-seller (object)

**completedClaims**completedClaimResponseContent.pay-order-seller (object)[]

- Array [
    

**claimType**claimType.pay-order-seller (string)

클레임 구분. 250바이트 내외

|코드|설명|비고|
|---|---|---|
|CANCEL|취소||
|RETURN|반품||
|EXCHANGE|교환||
|PURCHASE_DECISION_HOLDBACK|구매 확정 보류||
|ADMIN_CANCEL|직권 취소||

**claimId**string

클레임 번호. 20바이트 내외

**claimStatus**claimStatus.pay-order-seller (string)

클레임 상태. 250바이트 내외

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

**claimRequestDate**string<date-time>

클레임 요청일. 45바이트 내외

**Example:** `2023-01-16T17:14:51.794+09:00`

**requestChannel**string

접수 채널. 100바이트 내외

**claimRequestDetailContent**string

클레임 상세 사유. 4000바이트 내외

**claimRequestReason**claimReason.pay-order-seller (string)

클레임 요청 사유. 250바이트 내외

|코드|설명|비고|
|---|---|---|
|INTENT_CHANGED|구매 의사 취소||
|COLOR_AND_SIZE|색상 및 사이즈 변경||
|WRONG_ORDER|다른 상품 잘못 주문||
|PRODUCT_UNSATISFIED|서비스 불만족||
|DELAYED_DELIVERY|배송 지연||
|SOLD_OUT|상품 품절||
|DROPPED_DELIVERY|배송 누락||
|NOT_YET_DELIVERY|미배송||
|BROKEN|상품 파손||
|INCORRECT_INFO|상품 정보 상이||
|WRONG_DELIVERY|오배송||
|WRONG_OPTION|색상 등 다른 상품 잘못 배송||
|SIMPLE_INTENT_CHANGED|단순 변심||
|MISTAKE_ORDER|주문 실수||
|ETC|기타|API 에서 지정 불가|
|DELAYED_DELIVERY_BY_PURCHASER|배송 지연||
|INCORRECT_INFO_BY_PURCHASER|상품 정보 상이||
|PRODUCT_UNSATISFIED_BY_PURCHASER|서비스 불만족||
|NOT_YET_DISCUSSION|상호 협의가 완료되지 않은 주문 건||
|OUT_OF_STOCK|재고 부족으로 인한 판매 불가||
|SALE_INTENT_CHANGED|판매 의사 변심으로 인한 거부||
|NOT_YET_PAYMENT|구매자의 미결제로 인한 거부||
|NOT_YET_RECEIVE|상품 미수취||
|WRONG_DELAYED_DELIVERY|오배송 및 지연||
|BROKEN_AND_BAD|파손 및 불량||
|RECEIVING_DUE_DATE_OVER|수락 기한 만료||
|RECEIVER_MISMATCHED|수신인 불일치||
|GIFT_INTENT_CHANGED|보내기 취소||
|GIFT_REFUSAL|선물 거절||
|MINOR_RESTRICTED|상품 수신 불가||
|RECEIVING_BLOCKED|상품 수신 불가||
|UNDER_QUANTITY|주문 수량 미달||
|ASYNC_FAIL_PAYMENT|결제 승인 실패||
|ASYNC_LONG_WAIT_PAYMENT|결제 승인 실패||

**refundExpectedDate**string<date-time>

환불 예정일. 45바이트 내외

**Example:** `2023-01-16T17:14:51.794+09:00`

**refundStandbyReason**string

환불 대기 사유. 250바이트 내외

**refundStandbyStatus**string

환불 대기 상태. 250바이트 내외

**requestQuantity**integer

클레임 요청 수량

**claimDeliveryFeeDemandAmount**integer

클레임 배송비 청구액

**claimDeliveryFeePayMeans**string

클레임 배송비 결제 수단. 100바이트 내외

**claimDeliveryFeePayMethod**string

클레임 배송비 결제 방법. 100바이트 내외

**returnReceiveAddress**판매자 교환/반품 수취 주소 (object)

**collectAddress**구매자 수거지 주소 (object)

**collectCompletedDate**string<date-time>

수거 완료일. 45바이트 내외

**Example:** `2023-01-16T17:14:51.794+09:00`

**collectDeliveryCompany**deliveryCompanyCode.pay-order-seller (string)

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

**collectDeliveryMethod**deliveryMethod.pay-order-seller (string)

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

**collectStatus**collectStatus.pay-order-seller (string)

수거 상태. 250바이트 내외

|코드|설명|비고|
|---|---|---|
|NOT_REQUESTED|수거 미요청||
|COLLECT_REQUEST_TO_AGENT|수거 지시 완료||
|COLLECT_REQUEST_TO_DELIVERY_COMPANY|수거 요청||
|COLLECT_WAITING|택배사 수거 예정||
|DELIVERING|수거 진행 중||
|DELIVERED|수거 완료||
|DELIVERY_FAILED|배송 실패||
|COLLECT_FAILED|수거 실패||
|WRONG_INVOICE|오류 송장||
|COLLECT_CANCELED|수거 취소||

**Example:** `NOT_REQUESTED`

**collectTrackingNumber**string

수거 송장 번호. 100바이트 내외

**etcFeeDemandAmount**integer

기타 비용 청구액

**etcFeePayMeans**string

기타 비용 결제 수단. 100바이트 내외

**etcFeePayMethod**string

기타 비용 결제 방법. 100바이트 내외

**holdbackDetailedReason**string

보류 상세 사유. 4000바이트 내외

**holdbackReason**holdbackReason.pay-order-seller (string)

보류 유형. 250바이트 내외

|코드|설명|비고|
|---|---|---|
|RETURN_DELIVERYFEE|반품 배송비 청구||
|EXTRAFEEE|추가 비용 청구||
|RETURN_DELIVERYFEE_AND_EXTRAFEEE|반품 배송비 + 추가 비용 청구||
|RETURN_PRODUCT_NOT_DELIVERED|반품 상품 미입고||
|ETC|기타 사유||
|EXCHANGE_DELIVERYFEE|교환 배송비 청구||
|EXCHANGE_EXTRAFEE|추가 교환 비용 청구||
|EXCHANGE_PRODUCT_READY|교환 상품 준비 중||
|EXCHANGE_PRODUCT_NOT_DELIVERED|교환 상품 미입고||
|EXCHANGE_HOLDBACK|교환 구매 확정 보류||
|SELLER_CONFIRM_NEED|판매자 확인 필요||
|PURCHASER_CONFIRM_NEED|구매자 확인 필요||
|SELLER_REMIT|판매자 직접 송금||
|ETC2|기타||

**holdbackStatus**holdbackStatus.pay-order-seller (string)

보류 상태. 250바이트 내외

|코드|설명|비고|
|---|---|---|
|HOLDBACK|보류 중||
|RELEASED|보류 해제||

**holdbackConfigDate**string<date-time>

보류 설정일. 45바이트 내외

**Example:** `2023-01-16T17:14:51.794+09:00`

**holdbackConfigurer**string

보류 설정자(구매자/판매자/관리자/시스템). 250바이트 내외

**holdbackReleaseDate**string<date-time>

보류 해제일. 45바이트 내외

**Example:** `2023-01-16T17:14:51.794+09:00`

**holdbackReleaser**string

보류 해제자(구매자/판매자/관리자/시스템). 250바이트 내외

**claimDeliveryFeeProductOrderIds**string

클레임 배송비 묶음 청구 상품 주문 번호(여러 개면 쉼표로 구분). 4000바이트 내외

**claimDeliveryFeeDiscountAmount**integer

반품 배송비 할인액

**remoteAreaCostChargeAmount**integer

반품 도서산간 배송비

**claimCompleteOperationDate**string<date-time>

반품 완료일. 45바이트 내외

**Example:** `2023-01-16T17:14:51.794+09:00`

**claimRequestAdmissionDate**string<date-time>

클레임 승인일. 45바이트 내외

**Example:** `2023-01-16T17:14:51.794+09:00`

**collectOperationDate**string

배송 일자. 8바이트 내외

**collectStartTime**string

수거 시작 시간. 8바이트 내외

**collectEndTime**string

수거 종료 시간. 8바이트 내외

**collectSlotId**string

수거 슬롯 ID. 100바이트 내외

**reDeliveryAddress**구매자 재배송지 주소 (object)

**reDeliveryMethod**deliveryMethod.pay-order-seller (string)

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

**reDeliveryStatus**deliveryStatus.pay-order-seller (string)

배송 상세 상태. 250바이트 내외

|코드|설명|비고|
|---|---|---|
|COLLECT_REQUEST|수거 요청||
|COLLECT_WAIT|수거 대기||
|COLLECT_CARGO|집화||
|DELIVERY_COMPLETION|배송 완료||
|DELIVERING|배송중||
|DELIVERY_FAIL|배송 실패||
|WRONG_INVOICE|오류 송장||
|COLLECT_CARGO_FAIL|집화 실패||
|COLLECT_CARGO_CANCEL|집화 취소||
|NOT_TRACKING|배송 추적 없음||

**Example:** `COLLECT_REQUEST`

**reDeliveryCompany**deliveryCompanyCode.pay-order-seller (string)

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

**reDeliveryTrackingNumber**string

재배송 송장 번호. 100바이트 내외

**reDeliveryOperationDate**string<date-time>

재배송 처리일. 45바이트 내외

**Example:** `2023-01-16T17:14:51.794+09:00`

**membershipsArrivalGuaranteeClaimSupportingAmount**integer

멤버십 N배송 지원 금액

**claimDeliveryFeeSupportType**claimDeliveryFeeSupportType.pay-order-seller (string)

클레임 배송비 지원 타입

|코드|설명|비고|
|---|---|---|
|MEMBERSHIP_ARRIVAL_GUARANTEE|멤버십 도착보장||
|MEMBERSHIP_KURLY|멤버십 컬리N마트||

**claimDeliveryFeeSupportAmount**integer

클레임 배송비 지원 금액

- ]
    

**delivery**deliveryResponseContent.pay-order-seller (object)

**deliveredDate**string<date-time>

배송 완료 일시. 45바이트 내외

**Example:** `2023-01-16T17:14:51.794+09:00`

**deliveryCompany**deliveryCompanyCode.pay-order-seller (string)

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

**deliveryStatus**deliveryStatus.pay-order-seller (string)

배송 상세 상태. 250바이트 내외

|코드|설명|비고|
|---|---|---|
|COLLECT_REQUEST|수거 요청||
|COLLECT_WAIT|수거 대기||
|COLLECT_CARGO|집화||
|DELIVERY_COMPLETION|배송 완료||
|DELIVERING|배송중||
|DELIVERY_FAIL|배송 실패||
|WRONG_INVOICE|오류 송장||
|COLLECT_CARGO_FAIL|집화 실패||
|COLLECT_CARGO_CANCEL|집화 취소||
|NOT_TRACKING|배송 추적 없음||

**Example:** `COLLECT_REQUEST`

**isWrongTrackingNumber**boolean

오류 송장 여부. true는 송장에 오류가 있음을 의미합니다. 8바이트 내외

**pickupDate**string<date-time>

집화 일시. 45바이트 내외

**Example:** `2023-01-16T17:14:51.794+09:00`

**sendDate**string<date-time>

발송 일시. 45바이트 내외

**Example:** `2023-01-16T17:14:51.794+09:00`

**trackingNumber**string

송장 번호. 100바이트 내외

**wrongTrackingNumberRegisteredDate**string<date-time>

오류 송장 등록 일시. 45바이트 내외

**Example:** `2023-01-16T17:14:51.794+09:00`

**wrongTrackingNumberType**string

오류 사유. 300바이트 내외

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
const axios = require('axios');let data = JSON.stringify({  "productOrderIds": [    "string"  ],  "quantityClaimCompatibility": true});let config = {  method: 'post',  maxBodyLength: Infinity,  url: 'https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/query',  headers: {     'Content-Type': 'application/json',     'Accept': 'application/json',     'Authorization': 'Bearer <token>'  },  data : data};axios.request(config).then((response) => {  console.log(JSON.stringify(response.data));}).catch((error) => {  console.log(error);});
```

[

Previous

변경 상품 주문 내역 조회

](https://apicenter.commerce.naver.com/docs/commerce-api/current/seller-get-last-changed-status-pay-order-seller)[

Next

취소

](https://apicenter.commerce.naver.com/docs/commerce-api/current/%EC%B7%A8%EC%86%8C)

- [커머스API센터](https://apicenter.commerce.naver.com/)
- [개인정보 처리방침](https://business.naver.com/privacy/privacy.html)
- [고객센터](https://help.sell.smartstore.naver.com/faq/list.help?categoryId=10783)

![](https://apicenter.commerce.naver.com/docs/img/logo_naver.svg)

Copyright © [**NAVER Corp.**](https://www.navercorp.com/ "새창")All rights reserved.

![](chrome-extension://cgococegfcmmfcjggpgelfbjkkncclkf/static/icon/ico_logo_128.png)