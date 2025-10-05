---
title: "네이버 커머스API센터"
source: "https://apicenter.commerce.naver.com/ko/member/application/manage/detail;id=5NKxpyt3CoF2xn5bHwKduH"
author:
published:
created: 2025-10-05
description: "커머스API를 활용해서 다양한 아이디어로 새로운 기회를 잡아보세요."
tags:
  - "clippings"
---
#### 스토어

| 애플리케이션 이름 | 스토어명 | 상태 | 최근 수정일 | 최근 수정 회원 | 인증 기한 |
| --- | --- | --- | --- | --- | --- |
| 노백샵 | 노백샵 | 활성 | 2025-04-19 19:40 | siww\*\*\*\*\*\*\* | 2025-10-17~2025-10-30  인증 기간 시작 12일 전 |

#### 애플리케이션

| 애플리케이션 ID | 5NKxpyt3CoF2xn5bHwKduH |
| --- | --- |
| 애플리케이션 시크릿 | $2a$04$3tPVEEvnG35Smx7tcXrtfu |
| 설명 | 노백샵 |
| API호출 IP | 211.205.114.124 |

애플리케이션 ID 및 시크릿은 가급적 공유하지 않고 안전하게 관리해야 하며, 불필요한 공유가 발생하지 않도록 각별한 주의가 필요합니다.

#### API 그룹

| API그룹명 | 리소스 유형 | 설명 |
| --- | --- | --- |
| 문의 | 모든 리소스 유형 | 상품 문의 목록 조회, 문의 답변 등록 수정, 문의 답변 템플릿 목록 조회 관련 API를 사용할 수 있습니다.  GET /v1/contents/qnas  GET /v1/contents/qnas/templates  PUT /v1/contents/qnas/{questionId} |
| 주문 판매자 | 모든 리소스 유형 | 주문조회,발주/발송처리,취소,교환 등 네이버페이 주문 판매자 관련 API를 사용할 수 있습니다.  GET /v1/pay-order/seller/product-orders/last-changed-statuses  GET /v1/pay-order/seller/orders/{orderId}/product-order-ids  POST /v1/pay-order/seller/product-orders/query  POST /v1/pay-order/seller/product-orders/confirm  POST /v1/pay-order/seller/product-orders/{productOrderId}/delay  POST /v1/pay-order/seller/product-orders/dispatch  POST /v1/pay-order/seller/product-orders/{productOrderId}/claim/cancel/approve  POST /v1/pay-order/seller/product-orders/{productOrderId}/claim/exchange/dispatch  POST /v1/pay-order/seller/product-orders/{productOrderId}/hope-delivery/change  POST /v1/pay-merchant/inquiries/{inquiryNo}/answer  PUT /v1/pay-merchant/inquiries/{inquiryNo}/answer/{answerContentId}  GET /v1/pay-user/inquiries  POST /v1/pay-order/seller/product-orders/{productOrderId}/claim/cancel/request  POST /v1/pay-order/seller/product-orders/{productOrderId}/claim/return/request  POST /v1/pay-order/seller/product-orders/{productOrderId}/claim/return/approve  POST /v1/pay-order/seller/product-orders/{productOrderId}/claim/return/reject  POST /v1/pay-order/seller/product-orders/{productOrderId}/claim/return/holdback  POST /v1/pay-order/seller/product-orders/{productOrderId}/claim/return/holdback/release  POST /v1/pay-order/seller/product-orders/{productOrderId}/claim/exchange/collect/approve  POST /v1/pay-order/seller/product-orders/{productOrderId}/claim/exchange/reject  POST /v1/pay-order/seller/product-orders/{productOrderId}/claim/exchange/holdback  POST /v1/pay-order/seller/product-orders/{productOrderId}/claim/exchange/holdback/release  GET /v1/pay-order/seller/product-orders |
| 상품 | 모든 리소스 유형 | 상품 등록, 상품 검수, 상품 배송정보, 상품 속성, 제조사 관련 API를 사용할 수 있습니다.  GET /v1/options/standard-options  GET /v1/product-attributes/attributes  GET /v1/product-attributes/attribute-values  GET /v1/product-attributes/attribute-value-units  GET /v1/product-models/{id}  GET /v1/product-models  GET /v1/product-brands  GET /v1/product-manufacturers  GET /v1/categories  GET /v1/categories/{categoryId}  GET /v1/categories/{categoryId}/sub-categories  PUT /v1/products/origin-products/{originProductNo}/change-status  PUT /v1/products/origin-products/bulk-update  POST /v1/product-images/upload  POST /v1/product-delivery-info/bundle-groups  PUT /v1/product-delivery-info/bundle-groups/{deliveryBundleGroupId}  GET /v1/product-delivery-info/bundle-groups  GET /v1/product-delivery-info/bundle-groups/{deliveryBundleGroupId}  GET /v1/product-origin-areas  GET /v1/product-origin-areas/query  GET /v1/product-origin-areas/sub-origin-areas  POST /v1/products/search  GET /v1/product-inspections/channel-products  PUT /v1/product-inspections/channel-product/{channelProductNo}/restore  POST /v1/product-delivery-info/hope-delivery-groups  PUT /v1/product-delivery-info/hope-delivery-groups/{hopeDeliveryGroupId}  GET /v1/product-delivery-info/hope-delivery-groups  GET /v1/product-delivery-info/hope-delivery-groups/{hopeDeliveryGroupId}  GET /v1/contents/seller-notices  GET /v1/contents/seller-notices/{sellerNoticeId}  POST /v1/contents/seller-notices  PUT /v1/contents/seller-notices/{sellerNoticeId}  DEL /v1/contents/seller-notices/{sellerNoticeId}  PUT /v1/products/channel-products/notice/apply  GET /v2/products/channel-products/{channelProductNo}  GET /v2/products/origin-products/{originProductNo}  DEL /v2/products/channel-products/{channelProductNo}  DEL /v2/products/origin-products/{originProductNo}  POST /v2/products  PUT /v2/products/channel-products/{channelProductNo}  PUT /v2/products/origin-products/{originProductNo}  GET /v2/product-delivery-info/return-delivery-companies  GET /v2/tags/recommend-tags  GET /v1/products-for-provided-notice  GET /v1/products-for-provided-notice/{productInfoProvidedNoticeType}  GET /v2/tags/restricted-tags  GET /v1/product-sizes  GET /v1/product-sizes/{sizeTypeId}  GET /v1/product-fashion-models  POST /v1/product-fashion-models  PUT /v1/product-fashion-models/{fashionModelId}  DEL /v1/product-fashion-models/{fashionModelId}  GET /v2/standard-purchase-option-guides  GET /v2/standard-group-products/status  GET /v2/standard-group-products/{groupProductNo}  PUT /v2/standard-group-products/{groupProductNo}  DEL /v2/standard-group-products/{groupProductNo}  POST /v2/standard-group-products  POST /v2/standard-group-products/temp-detail-content  PUT /v1/products/origin-products/{originProductNo}/option-stock  PATCH /v1/products/origin-products/multi-update |
| 판매자정보 | 모든 리소스 유형 | 판매자 주소록, 판매자 오늘출발설정, 판매자 정보조회 관련 API를 사용할 수 있습니다.  GET /v1/seller/this-day-dispatch  POST /v1/seller/this-day-dispatch  GET /v1/seller/channels  GET /v1/seller/addressbooks/{addressBookNo}  GET /v1/seller/addressbooks-for-page  GET /v1/logistics/logistics-companies  GET /v1/seller/account  GET /v1/logistics/outbound-locations |
| 정산 | 모든 리소스 유형 | 네이버페이 가맹점인 스마트스토어의 정산내역, 부가세 신고 내역 등 정산과 관련한 내역 조회API를 사용할 수 있습니다.  GET /v1/pay-settle/settle/case  GET /v1/pay-settle/settle/daily  GET /v1/pay-settle/vat/case  GET /v1/pay-settle/vat/daily  GET /v1/pay-settle/settle/commission-details |

- 커머스솔루션마켓에서 결제한 유료 API솔루션은 솔루션해지시 애플리케이션이 자동삭제됩니다.
- 스토어의 통합매니저 권한이 삭제된 경우, 기존 애플리케이션은 삭제되며 신규 통합매니저가 커머스API센터 가입 후 새로운 애플리케이션으로 사용가능합니다.