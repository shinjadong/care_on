---
title: "고객 현황(계정) API | 커머스API"
source: "https://apicenter.commerce.naver.com/docs/commerce-api/current/get-account-customer-status-data-insight"
author:
published:
created: 2025-09-26
description: "[브랜드스토어 전용] 스토어의 일별 고객 현황 데이터를 제공합니다."
tags:
  - "clippings"
  - "naver-commerce"
  - "api-documentation"
---

# 고객 현황(계정) API

## 📋 API 개요

**브랜드스토어 전용** API로, 스토어의 일별 고객 현황 데이터를 제공합니다.

- **HTTP Method**: `GET`
- **Endpoint**: `/v1/customer-data/customer-status/account/statistics`
- **Base URL**: `https://api.commerce.naver.com/external`
- **Content-Type**: `application/json;charset=UTF-8`

---

## 🔧 요청 파라미터

### Query Parameters (필수)

| 파라미터 | 타입 | 필수 | 설명 | 예시 |
|----------|------|------|------|------|
| `startDate` | string (yyyy-MM-dd) | ✅ | 조회 시작일 (최대 18개월 전) | 2023-01-01 |
| `endDate` | string (yyyy-MM-dd) | ✅ | 조회 종료일 (최소 1일 전) | 2023-01-01 |

---

## 📊 응답 구조

### HTTP 응답 코드
- `200`: 성공
- `400`: 잘못된 요청
- `401`: 인증 실패
- `404`: 리소스 없음
- `500`: 서버 오류

### Response Schema

응답은 배열 형태로, 각 요소는 일별 고객 현황 데이터입니다.

\`\`\`json
[
  {
    "aggregateDate": "2023-01-01",
    "purchaseStats": {...},
    "malePurchaseStats": {...},
    "femalePurchaseStats": {...},
    "agePurchaseStats": {...},
    "interestStats": {...},
    "normalGrade": {...},
    "loungeStats": {...},
    "periodType": "daily",
    "isNotProvided": false
  }
]
\`\`\`

#### 1️⃣ 기본 정보
- `aggregateDate` (string): 집계일 (yyyy-MM-dd 형식)
- `periodType` (string): 집계 기간 ("daily")
- `isNotProvided` (boolean): 통계 제공 여부 (집계 고객 수가 10건 미만인 경우 false)

#### 2️⃣ 주문 고객 통계 (`purchaseStats`)
\`\`\`json
{
  "customerCount": 1000,           // 전체 고객 수
  "newCustomerCount": 200,         // 신규 고객 수
  "existCustomerCount": 800,       // 기존 고객 수
  "newCustomerRatio": 0.2,         // 신규 고객 비율
  "existCustomerRatio": 0.8,       // 기존 고객 비율
  "purchaseCount": 1500,           // 전체 주문 건수
  "refundCount": 50                // 전체 환불 건수
}
\`\`\`

#### 3️⃣ 성별 구매 통계
- `malePurchaseStats`: 남성 구매 통계
- `femalePurchaseStats`: 여성 구매 통계

\`\`\`json
{
  "ratio": 0.45  // 구매 비율
}
\`\`\`

#### 4️⃣ 연령대별 구매 통계 (`agePurchaseStats`)
각 연령대별로 남성/여성 구매 통계를 포함합니다.

| 연령대 | 필드명 | 설명 |
|--------|--------|------|
| 10대 | `teenage` | 10대 구매 통계 |
| 20대 초반 | `early20s` | 20-24세 구매 통계 |
| 20대 후반 | `late20s` | 25-29세 구매 통계 |
| 30대 초반 | `early30s` | 30-34세 구매 통계 |
| 30대 후반 | `late30s` | 35-39세 구매 통계 |
| 40대 초반 | `early40s` | 40-44세 구매 통계 |
| 40대 후반 | `late40s` | 45-49세 구매 통계 |
| 50대 초반 | `early50s` | 50-54세 구매 통계 |
| 50대 후반 | `late50s` | 55-59세 구매 통계 |
| 60대 이상 | `senior` | 60세 이상 구매 통계 |

각 연령대 객체 구조:
\`\`\`json
{
  "malePurchaseStats": {
    "ratio": 0.3
  },
  "femalePurchaseStats": {
    "ratio": 0.7
  }
}
\`\`\`

#### 5️⃣ 관심 고객 통계 (`interestStats`)
\`\`\`json
{
  "interestCustomer": 5000,                    // 관심 고객 수(누적)
  "interestCustomerFluctuation": 100,          // 관심 고객 수(증감)
  "notificationCustomer": 2000,                // 알림 고객 수(누적)
  "notificationCustomerFluctuation": 50        // 알림 고객 수(증감)
}
\`\`\`

#### 6️⃣ 일반 고객 등급 (`normalGrade`)
\`\`\`json
{
  "silver": 1000,  // 실버 고객 수
  "gold": 500,     // 골드 고객 수
  "vip": 100,      // VIP 고객 수
  "vvip": 20       // VVIP 고객 수
}
\`\`\`

#### 7️⃣ 라운지 고객 등급 (`loungeStats`)
\`\`\`json
{
  "totalCount": 1500,        // 전체 등급 수
  "incrementCount": 50,      // 전체 등급 변동
  "joinCount": 80,           // 신규 등급 추가
  "leaveCount": 30,          // 등급 제외
  "level1Count": 500,        // 레벨 1 등급 수
  "level2Count": 400,        // 레벨 2 등급 수
  "level3Count": 300,        // 레벨 3 등급 수
  "level4Count": 200,        // 레벨 4 등급 수
  "level5Count": 100         // 레벨 5 등급 수
}
\`\`\`

---

## 💻 코드 예제

### Node.js (Axios)```javascript
const axios = require('axios');

// API 설정
const config = {
  method: 'GET',
  url: 'https://api.commerce.naver.com/external/v1/customer-data/customer-status/account/statistics',
  headers: { 
    'Accept': 'application/json;charset=UTF-8', 
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
  },
  params: {
    startDate: '2023-01-01',
    endDate: '2023-01-31'
  }
};

// API 호출
axios.request(config)
  .then((response) => {
    console.log('고객 현황 데이터:', JSON.stringify(response.data, null, 2));
  })
  .catch((error) => {
    console.error('API 호출 실패:', error.response?.data || error.message);
  });
\`\`\`

### cURL

\`\`\`bash
curl -X GET \
  'https://api.commerce.naver.com/external/v1/customer-data/customer-status/account/statistics?startDate=2023-01-01&endDate=2023-01-31' \
  -H 'Accept: application/json;charset=UTF-8' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'
\`\`\`

---

## ⚡ 주요 특징

### ✅ 제공되는 데이터
- **고객 분석**: 신규/기존 고객 구분, 성별/연령대별 통계
- **구매 패턴**: 주문 건수, 환불 건수, 구매 비율
- **고객 관심도**: 관심 고객, 알림 설정 고객 현황
- **등급 시스템**: 일반 등급(실버~VVIP), 라운지 등급(레벨 1~5)

### ⚠️ 제한사항
- **브랜드스토어 전용**: 일반 스마트스토어에서는 사용 불가
- **조회 기간**: 최대 18개월 전 ~ 최소 1일 전
- **데이터 제공**: 집계 고객 수가 10건 미만인 경우 통계 미제공
- **집계 주기**: 일별(daily) 데이터만 제공

### 🔒 인증 요구사항
- Bearer 토큰 기반 인증 필요
- 네이버 커머스 API 센터에서 발급받은 액세스 토큰 사용

---

## 📝 사용 예시

### 월간 고객 현황 분석
\`\`\`javascript
// 한 달간 고객 현황 데이터 수집
const startDate = '2023-01-01';
const endDate = '2023-01-31';

// API 호출 후 분석 로직
const analyzeCustomerData = (data) => {
  const totalStats = {
    totalCustomers: 0,
    newCustomers: 0,
    maleRatio: 0,
    femaleRatio: 0,
    topAgeGroup: null
  };
  
  // 데이터 분석 로직 구현
  data.forEach(dailyData => {
    totalStats.totalCustomers += dailyData.purchaseStats.customerCount;
    totalStats.newCustomers += dailyData.purchaseStats.newCustomerCount;
    // 추가 분석...
  });
  
  return totalStats;
};
\`\`\`

### 고객 등급별 현황 모니터링
\`\`\`javascript
// 라운지 등급 변동 추적
const trackGradeChanges = (data) => {
  return data.map(dailyData => ({
    date: dailyData.aggregateDate,
    totalCount: dailyData.loungeStats.totalCount,
    changes: dailyData.loungeStats.incrementCount,
    newJoins: dailyData.loungeStats.joinCount,
    leaves: dailyData.loungeStats.leaveCount
  }));
};
\`\`\`

---

## 🔗 관련 API
- [고객 현황(채널) API](https://apicenter.commerce.naver.com/docs/commerce-api/current/get-store-customer-status-data-insight)
- [커머스 API 센터](https://apicenter.commerce.naver.com/)

---

**마지막 업데이트**: 2025-09-26
**API 버전**: v1
