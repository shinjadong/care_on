---
title: "제약 사항 | 커머스API"
source: "https://apicenter.commerce.naver.com/docs/restriction"
author:
published:
created: 2025-09-26
description:
tags:
  - "clippings"
---
커머스API의 각 기능별 설명 영역에서는 다음과 같이 '제약 사항'에 대해서 안내합니다.

### 웹 서버 인증서(TLS) 버전 제약

커머스API는 웹 서버 인증서(TLS) 버전 1.2 이상에서만 정상 동작합니다.

### 권한 그룹

API를 호출하려면 해당 API가 속한 API 그룹의 권한이 필요합니다. 애플리케이션을 등록하거나 수정할 때 'API 그룹'을 설정하여 권한을 얻을 수 있습니다. 이 때 'API 그룹'에 속하는 API 목록을 확인할 수 있습니다.

### 요청량 제한

\`\`\`markdown
⚠️ 요청량 제한은 커머스API별 리소스 수용 능력과 개발사/판매자 규모에 따른 내부 관리 정책에 따라 유동적이며,
일부 개발사에 예외로 완화해 드릴 수 없습니다.
\`\`\`

#### Rate Limit: 초당 최대 동시 요청 수 제한

과도한 트래픽으로부터 서비스를 보호하기 위해 커머스API에 초당 최대 동시 요청 수를 제한하는 요청량 제한(rate limit)이 적용되어 있습니다.

커머스API는 'Token bucket' 알고리즘 기반 요청량 제한을 개별 API와 인증된 애플리케이션 단위로 처리합니다.

요청량 제한을 초과하는 요청에는 다음과 같은 응답이 전송됩니다.

- HTTP 상태 코드: 429(Too Many Requests - RFC 6585)
- 오류 코드: `GW.RATE_LIMIT`

개발사는 API 응답 헤더에서 현재 요청한 API의 요청량 관련 상태를 확인할 수 있습니다. 관련 헤더에 대한 설명은 다음과 같습니다.

- GNCP-GW-RateLimit-Replenish-Rate: 초당 최대 동시 요청 수
- GNCP-GW-RateLimit-Burst-Capacity: 버스트 모드(burst mode)로 처리 가능한 초당 최대 동시 요청 수
- 커머스API는 API별 요청량 제한 값의 두 배를 버스트 요청 값으로 정의하고 있습니다. 즉, 요청량 제한 값을 넘겼을 경우 최대 두 배까지 처리 가능하지만 그만큼 다음 1초에 호출 가능한 요청 건은 줄어듭니다.
- GNCP-GW-RateLimit-Remaining: 남은 동시 요청 수

#### Quota Limit: (단위) 시간당 판매자 리소스 요청 수 제한

커머스API는 초당 최대 동시 요청 수 제한과 다르게 좀 더 세밀한 단위의 요청량 제한 수단을 제공하고 있습니다. 시간당 판매자 리소스 요청 수 제한이 필요한 경우는 다음과 같습니다.

- API데이터솔루션을 구독 후 API를 호출하는 판매자
- 단위 시간: 구독 회차
- 커머스솔루션을 구독 중인 판매자 리소스에 대한 API를 호출하는 개발업체
- 단위 시간: 1초

요청량 제한을 초과하는 요청에는 다음과 같은 응답이 전송됩니다.

- HTTP 상태 코드: 429(Too Many Requests - RFC 6585)
- 오류 코드: `GW.QUOTA_LIMIT`

개발사는 API 응답 헤더에서 현재 요청한 API의 요청량 관련 상태를 확인할 수 있습니다. 관련 헤더에 대한 설명은 다음과 같습니다.

- GNCP-GW-Quota-Period: 단위 시간
- `SECONDS` 초
- `ROUND` 회차 (API데이터솔루션 구독)
- GNCP-GW-Quota-Limit: 시간당 최대 요청 수
- GNCP-GW-Quota-Remaining: 남은 요청 수
