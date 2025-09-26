---
title: "네이버 커머스API RESTful 규격 가이드"
source: "https://apicenter.commerce.naver.com/docs/restful-api"
author:
published:
created: 2025-09-26
description: "네이버 커머스API의 RESTful 규격, 데이터 형식, HTTP 상태 코드에 대한 완전 가이드"
tags:
  - "clippings"
  - "restful"
  - "api"
  - "http"
---

# 🌐 네이버 커머스API RESTful 규격 가이드

## 📋 목차
- [API 기본 규격](#api-기본-규격)
- [데이터 형식](#데이터-형식)
- [날짜 및 시간 형식](#날짜-및-시간-형식)
- [HTTP 상태 코드](#http-상태-코드)
- [응답 헤더](#응답-헤더)
- [호스트 정보](#호스트-정보)

---

## 🔧 API 기본 규격

> **🎯 핵심 요약**  
> 네이버 커머스API는 **RESTful API 설계 원칙**을 따르며, JSON 기반의 데이터 통신을 사용합니다.

### RESTful이란?
RESTful API는 웹의 기본 프로토콜인 HTTP를 활용한 API 설계 방식입니다. 마치 웹사이트에서 주소(URL)로 페이지에 접근하는 것처럼, 각 기능이 고유한 URL을 가지고 HTTP 메서드(GET, POST, PUT, DELETE)로 작업을 구분합니다.

---

## 📄 데이터 형식

### Content Type
**기본 형식: JSON (JavaScript Object Notation)**

```json
{
  "orderId": "2023010112345",
  "productName": "스마트폰 케이스",
  "quantity": 2,
  "price": 15000
}
```

> **📝 예외 상황**  
> 파일 업로드/다운로드와 같은 특수한 경우에만 다른 형식을 사용합니다.

### Character Encoding
- **요청**: 모든 파라미터와 메시지는 **UTF-8**로 인코딩
- **응답**: 모든 응답 메시지는 **UTF-8**로 인코딩

> **💡 개발 팁**  
> 한글, 이모지, 특수문자가 포함된 데이터를 다룰 때 UTF-8 인코딩이 중요합니다.

---

## 📅 날짜 및 시간 형식

### 기본 원칙
커머스API는 **ISO 8601 표준**을 따르며, 모든 시간은 **한국 표준시(KST, UTC+09:00)**를 기준으로 합니다.

### 날짜시간 형식

> **⚠️ 중요**  
> 날짜시간 형식을 정확히 맞춰야 오류를 방지할 수 있습니다.

| 형식 | 패턴 | 예시 | 설명 |
|------|------|------|------|
| **날짜시간** | `yyyy-MM-dd'T'HH:mm:ss.SSSXXX` | `2022-01-01T01:01:01.001+09:00` | 밀리초 포함 |
| **날짜** | `yyyy-MM-dd` | `2022-07-25` | 연월일 |
| **연월** | `yyyy-MM` | `2022-07` | 연월만 |

### 프로그래밍 언어별 구현

#### ☕ Java

```java
import java.time.*;
import java.time.format.DateTimeFormatter;

// 현재 시간을 커머스API 형식으로 변환
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSXXX");

// 방법 1: ZonedDateTime 사용 (권장)
String currentTime = ZonedDateTime.now(ZoneId.of("Asia/Seoul"))
                                  .format(formatter);
System.out.println(currentTime); // 2024-01-15T14:30:25.123+09:00

// 방법 2: Instant 사용
String instantTime = Instant.now()
                           .atZone(ZoneOffset.of("+09:00"))
                           .format(formatter);

// 문자열을 ZonedDateTime으로 파싱
ZonedDateTime parsed = ZonedDateTime.parse("2023-07-25T10:10:10.100+09:00");
```

#### 🐍 Python

```python
from datetime import datetime
import pytz

# 한국 표준시 설정
kst = pytz.timezone('Asia/Seoul')

# 현재 시간을 커머스API 형식으로 변환
current_time = datetime.now(kst).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + '+09:00'
print(current_time)  # 2024-01-15T14:30:25.123+09:00

# 문자열을 datetime 객체로 파싱
from dateutil import parser
parsed_time = parser.parse("2023-07-25T10:10:10.100+09:00")
```

#### 🟢 Node.js

```javascript
// 현재 시간을 커머스API 형식으로 변환
const now = new Date();
const kstOffset = 9 * 60; // 9시간을 분으로 변환
const kstTime = new Date(now.getTime() + (kstOffset * 60 * 1000));

// ISO 형식으로 변환 후 +09:00 추가
const formattedTime = kstTime.toISOString().replace('Z', '+09:00');
console.log(formattedTime); // 2024-01-15T14:30:25.123+09:00

// 문자열을 Date 객체로 파싱
const parsedDate = new Date("2023-07-25T10:10:10.100+09:00");
```

#### 🐘 PHP

```php
// 현재 시간을 커머스API 형식으로 변환
$timezone = new DateTimeZone('Asia/Seoul');
$now = new DateTime('now', $timezone);
$formatted = $now->format('Y-m-d\TH:i:s.vP');
echo $formatted; // 2024-01-15T14:30:25.123+09:00

// 문자열을 DateTime 객체로 파싱
$parsedDate = DateTime::createFromFormat('Y-m-d\TH:i:s.vP', '2023-07-25T10:10:10.100+09:00');
```

---

## 📊 HTTP 상태 코드

> **🎯 핵심 요약**  
> 커머스API는 **HTTP 상태 코드**로 요청 처리 결과를 알려줍니다. 상태 코드는 요청이 성공했는지, 실패했다면 어떤 이유인지를 나타냅니다.

### HTTP 상태 코드 분류 체계

HTTP 상태 코드는 3자리 숫자로 구성되며, 첫 번째 숫자가 응답의 종류를 나타냅니다:

```
2xx → ✅ 성공 (Success)
3xx → 🔄 리다이렉션 (Redirection) 
4xx → ❌ 클라이언트 오류 (Client Error)
5xx → 💥 서버 오류 (Server Error)
```

### ✅ 2xx 성공 (Success)
요청이 성공적으로 처리되었음을 나타냅니다.

| 코드 | 상태 | 설명 | 사용 예시 |
|------|------|------|----------|
| **200** | OK | 요청이 성공적으로 처리됨 | 상품 목록 조회, 주문 상세 정보 조회 |
| **201** | Created | 새로운 리소스가 생성됨 | 새 주문 생성, 상품 등록 |
| **202** | Accepted | 요청을 접수했지만 아직 처리 중 | 비동기 배송 처리 요청 |
| **204** | No Content | 처리 성공, 반환할 내용 없음 | 주문 취소, 상품 삭제 |

### 🔄 3xx 리다이렉션 (Redirection)
요청 완료를 위해 추가 작업이 필요합니다.

| 코드 | 상태 | 설명 | 대응 방법 |
|------|------|------|----------|
| **301** | Moved Permanently | 리소스가 영구적으로 이동됨 | 새 URL로 요청 변경 |

### ❌ 4xx 클라이언트 오류 (Client Error)
요청에 문제가 있어 서버가 처리할 수 없습니다.

| 코드 | 상태 | 원인 | 해결 방법 | 예시 |
|------|------|------|----------|------|
| **400** | Bad Request | 잘못된 요청 형식 | 요청 데이터 검증 | JSON 문법 오류, 필수 필드 누락 |
| **401** | Unauthorized | 인증 실패 | 토큰 재발급 또는 로그인 | 액세스 토큰 만료, 잘못된 인증 정보 |
| **403** | Forbidden | 권한 없음 | 적절한 권한 요청 | 판매자 전용 API를 구매자가 호출 |
| **404** | Not Found | 리소스 없음 | URL 및 ID 확인 | 존재하지 않는 주문 ID로 조회 |
| **405** | Method Not Allowed | HTTP 메서드 오류 | 올바른 메서드 사용 | GET API에 POST 요청 |
| **406** | Not Acceptable | 지원하지 않는 응답 형식 | Accept 헤더 수정 | `Accept: text/yaml` 대신 `Accept: application/json` |
| **409** | Conflict | 비즈니스 로직 충돌 | 요청 내용 재검토 | 이미 취소된 주문을 다시 취소 요청 |
| **415** | Unsupported Media Type | 지원하지 않는 요청 형식 | Content-Type 수정 | `Content-Type: text/yaml` 대신 `application/json` |
| **429** | Too Many Requests | 요청량 초과 | 요청 빈도 조절 | 1시간에 1000회 제한 초과 |

### 💥 5xx 서버 오류 (Server Error)
서버에서 문제가 발생하여 요청을 처리할 수 없습니다.

| 코드 | 상태 | 원인 | 대응 방법 |
|------|------|------|----------|
| **500** | Internal Server Error | 서버 내부 오류 | 잠시 후 재시도, 지속되면 문의 |
| **502** | Bad Gateway | 게이트웨이 오류 | 네트워크 연결 확인 후 재시도 |
| **503** | Service Unavailable | 서비스 일시 중단 | 서버 점검 시간 확인 후 재시도 |
| **504** | Gateway Timeout | 응답 시간 초과 | 타임아웃 설정 확인 후 재시도 |

### 📝 상태 코드별 대응 전략

#### 🔧 개발자를 위한 에러 처리 가이드

```javascript
// Node.js 예시: 상태 코드별 에러 처리
async function handleApiResponse(response) {
    switch (response.status) {
        case 200:
        case 201:
            return response.data; // 성공
            
        case 401:
            // 토큰 만료 시 자동 재발급
            await refreshAccessToken();
            return retryRequest();
            
        case 429:
            // 요청량 초과 시 지연 후 재시도
            await delay(60000); // 1분 대기
            return retryRequest();
            
        case 500:
        case 502:
        case 503:
        case 504:
            // 서버 오류 시 지수 백오프로 재시도
            return retryWithBackoff();
            
        default:
            throw new Error(`API 오류: ${response.status} - ${response.statusText}`);
    }
}

// 지수 백오프 재시도 함수
async function retryWithBackoff(maxRetries = 3, baseDelay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await makeApiRequest();
        } catch (error) {
            if (attempt === maxRetries) throw error;
            
            const delay = baseDelay * Math.pow(2, attempt - 1); // 1초, 2초, 4초...
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}
```

> **💡 개발 팁**  
> • **4xx 오류**: 클라이언트 코드 수정 필요  
> • **5xx 오류**: 자동 재시도 구현 권장  
> • **401 오류**: 토큰 자동 갱신 로직 구현  
> • **429 오류**: Rate Limiting 대응 필요

---

## 📤 응답 헤더

커머스API는 모든 응답에 유용한 메타데이터를 헤더로 포함합니다.

### 주요 응답 헤더

| 헤더명 | 설명 | 활용 방법 |
|--------|------|----------|
| `GNCP-GW-Trace-ID` | 요청별 고유 추적 ID | 문제 발생 시 고객센터 문의용 |
| `GNCP-GW-HttpClient-ResponseTime` | API 처리 시간 (밀리초) | 성능 모니터링 및 최적화 |

### Trace ID 활용법

**Trace ID**는 마치 택배의 운송장 번호와 같습니다. API 요청마다 고유하게 부여되어 문제 발생 시 정확한 추적이 가능합니다.

```javascript
// 응답에서 traceId 추출 예시
const response = await fetch('https://api.commerce.naver.com/external/v1/orders');

// 응답 헤더에서 추출
const traceId = response.headers.get('GNCP-GW-Trace-ID');
const responseTime = response.headers.get('GNCP-GW-HttpClient-ResponseTime');

console.log('Trace ID:', traceId);
console.log('응답 시간:', responseTime + 'ms');
```

> **💡 개발 팁**  
> 에러 로그에 Trace ID를 포함하면 빠른 문제 해결이 가능합니다.

```javascript
// 에러 로깅 예시
try {
    const result = await callCommerceAPI();
} catch (error) {
    const traceId = error.response?.headers?.get('GNCP-GW-Trace-ID');
    console.error(`API 오류 발생 [TraceID: ${traceId}]:`, error.message);
    
    // 로그 서비스에 traceId와 함께 전송
    logger.error('Commerce API Error', {
        traceId: traceId,
        message: error.message,
        responseTime: error.response?.headers?.get('GNCP-GW-HttpClient-ResponseTime'),
        timestamp: new Date().toISOString()
    });
}
```

---

## 🌐 호스트 정보

### API 엔드포인트

| 환경 | 호스트 URL | 용도 | 특징 |
|------|------------|------|------|
| **운영 환경** | `https://api.commerce.naver.com/external` | 실제 서비스 | • 실제 거래 데이터<br>• 24/7 운영<br>• SLA 보장 |

> **⚠️ 중요한 주의사항**  
> 실제 운영 중인 스토어에서 API 테스트 시 문제가 발생한 경우, 커머스API센터에서 책임지지 않습니다.  
> **개발/테스트 환경에서 충분히 검증 후 운영에 적용하세요.**

### 완전한 API URL 구성

```
https://api.commerce.naver.com/external/v1/{endpoint}
```

**구성 요소 설명:**
- `https://api.commerce.naver.com` - 기본 호스트
- `/external` - 외부 API 구분자  
- `/v1` - API 버전 (현재 v1만 제공)
- `/{endpoint}` - 구체적인 API 경로

### 📋 API URL 예시

| 기능 | HTTP 메서드 | 완전한 URL |
|------|-------------|------------|
| 토큰 발급 | POST | `https://api.commerce.naver.com/external/v1/oauth2/token` |
| 주문 목록 조회 | GET | `https://api.commerce.naver.com/external/v1/pay-order/seller/orders` |
| 상품 주문 상세 | POST | `https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/query` |
| 발송 처리 | POST | `https://api.commerce.naver.com/external/v1/pay-order/seller/product-orders/dispatch` |

---

## 🎯 빠른 참조 가이드

### 필수 요청 헤더

```http
POST /external/v1/oauth2/token HTTP/1.1
Host: api.commerce.naver.com
Content-Type: application/x-www-form-urlencoded  # 토큰 발급 시
Accept: application/json
```

### 일반적인 요청 헤더

```http
POST /external/v1/pay-order/seller/product-orders/query HTTP/1.1
Host: api.commerce.naver.com
Content-Type: application/json
Accept: application/json
Authorization: Bearer {access_token}
```

### 응답 형식

```json
{
  "timestamp": "2024-01-15T14:30:25.123+09:00",
  "traceId": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
  "data": {
    // 실제 응답 데이터
  }
}
```

---

## 📚 관련 문서

- [인증 가이드](./인증%20커머스API.md) - OAuth2 인증 방법
- [토큰 발급 가이드](./인증%20토큰%20발급%20요청%20커머스API.md) - 액세스 토큰 발급
- [주문 관리 API](./상품%20주문%20목록%20조회%20커머스API.md) - 주문 데이터 조회
- [문제 해결 가이드](./문제%20해결%20커머스API.md) - 에러 대응 방법

> **✨ 축하합니다!**  
> 이제 네이버 커머스API의 기본 규격을 모두 이해하셨습니다. 다음 단계로 인증 토큰 발급을 진행해보세요!