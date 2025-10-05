---
title: "문제 해결 | 커머스API"
source: "https://apicenter.commerce.naver.com/docs/trouble-shooting"
author:
published:
created: 2025-09-26
description:
tags:
  - "clippings"
---
| API 기술지원: [https://github.com/commerce-api-naver/commerce-api](https://github.com/commerce-api-naver/commerce-api)  

## Trace ID

커머스API는 요청마다 Trace ID라는 고유한 ID를 생성하여 관리하고 클라이언트에게 전달합니다. 커머스API 사용에 대한 문의나 문제 상황 확인 요청 시 Trace ID를 전달하면 더 신속한 원인 파악에 도움이 됩니다.

Trace ID는 응답 메시지의 `GNCP-GW-Trace-ID` 헤더에서 확인할 수 있으며, **API 게이트웨이 서버의 오류** 가 발생한 경우에는 응답 메시지의 `traceId` 필드에서 확인할 수 있습니다.

## 오류 메시지

커머스API에서 발생하는 오류는 크게 다음 두 가지로 구분합니다.

- API 게이트웨이 서버의 오류
- 커머스API 서버의 오류

그중 **API 게이트웨이 서버의 오류** 는 모든 커머스API에 공통으로 발생할 수 있는 오류이며 다음과 같은 규격의 메시지로 오류 정보를 제공합니다.

```json
{
  "code": "GW.TIMEOUT.01",
  "message": "요청 대기 시간이 초과되었습니다.",
  "timestamp": "2022-02-07T07:57:11.369+09:00",
  "traceId": "ar2-55f4fd5f54-mwk8w^1643182339983^366577"
}
```

응답 메시지의 각 JSON 필드 설명은 다음과 같습니다.

| 필드 | 설명 |
| --- | --- |
| code | 게이트웨이 서버 오류 코드. API 서버 오류 코드와 구분하기 위해 `GW.`로 시작합니다. |
| message | 오류 메시지 |
| timestamp | 오류 발생 시간. ISO 8601 규격에 따라 `KST(UTC+9)` 로 표현합니다.   예: `2022-02-07T07:57:11.369+09:00` |
| traceId | API 요청마다 생성되는 고유한 ID |

### 게이트웨이 서버 오류 코드

| HTTP 상태 코드 | 게이트웨이 서버 오류 코드 | 원인 | 오류 메시지 |
| --- | --- | --- | --- |
| 401 | GW.AUTHN | OAuth 인증 실패 | 요청을 보낼 권한이 없습니다. |
| 403 | GW.IP\_NOT\_ALLOWED | 요청 IP가 API G/W 에서 허용한 IP가 아닌경우 | 호출이 허용되지 않은 IP입니다. |
| 404 | GW.NOT\_FOUND | API 게이트웨이에 등록되지 않은 API | 요청하신 리소스를 찾을 수 없습니다. |
| 429 | GW.RATE\_LIMIT | 요청량 제한 초과 | 요청이 많아 서비스를 일시적으로 사용할 수 없습니다. |
| 429 | GW.QUOTA\_LIMIT | 요청량 제한 초과   - (단위)시간당 API 요청량 제한을 초과하는 경우 - 적용 대상: API데이터솔루션, 사용등급을 적용한 솔루션의 판매자 리소스 | 할당된 시간당 요청량을 초과하였습니다. |
| 500 | GW.PROXY.01 | 호스트 정보 오류 | 작업 중 오류가 발생하였습니다. |
| 500 | GW.PROXY.02 | 포트 정보 오류 | 작업 중 오류가 발생하였습니다. |
| 500 | GW.PROXY.03 | 서비스로부터 응답을 기다리는 도중 연결이 끊어짐 | 작업 중 오류가 발생하였습니다. |
| 500 | GW.PROXY.04 | 네트워크 연결 대기 시간 초과 | 작업 중 오류가 발생하였습니다. |
| 500 | GW.PROXY.05 | 기타 서비스 서버 오류 | 작업 중 오류가 발생하였습니다. |
| 500 | GW.INTERNAL\_SERVER\_ERROR | 예상치 못한 API 게이트웨이 내부 예외 상황 | 작업 중 오류가 발생하였습니다. |
| 503 | GW.BLOCK.01 | circuit open으로 인한 요청 차단 | 서비스를 일시적으로 사용할 수 없습니다. |
| 503 | GW.BLOCK.02 | 일부 API 또는 커머스플랫폼 전체 시스템 점검으로 인해 일시적인 API 사용 불가 | 서비스를 일시적으로 사용할 수 없습니다. |
| 504 | GW.TIMEOUT.01 | API 처리 대기 시간 초과 | 요청 대기 시간이 초과되었습니다. |
| 504 | GW.TIMEOUT.02 | API 서버의 응답이 없어서 API 게이트웨이가 대기할 수 있는 응답 시간 초과 | 요청 대기 시간이 초과되었습니다. |