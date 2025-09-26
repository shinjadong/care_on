---
title: "네이버 커머스API 인증 토큰 발급 가이드"
source: "https://apicenter.commerce.naver.com/docs/commerce-api/current/exchange-sellers-auth"
author:
published:
created: 2025-09-26
description: "네이버 커머스API 사용을 위한 인증 토큰 발급 및 갱신 완전 가이드"
tags:
  - "clippings"
  - "authentication"
  - "api"
  - "token"
---

# 🎫 네이버 커머스API 인증 토큰 발급 가이드

## 📋 목차
- [개요](#개요)
- [API 엔드포인트](#api-엔드포인트)
- [요청 파라미터](#요청-파라미터)
- [응답 형식](#응답-형식)
- [실제 사용 예시](#실제-사용-예시)
- [오류 처리](#오류-처리)

---

## 🔐 개요

### 토큰 발급의 목적
인증 토큰은 **네이버 커머스API에 접근하기 위한 열쇠**입니다. 마치 아파트 출입카드처럼, 이 토큰이 있어야 커머스API의 다양한 기능을 사용할 수 있습니다.

### 🕐 토큰 유효시간 규칙

> **⏰ 토큰 수명: 3시간 (10,800초)**

| 상황 | 토큰 갱신 정책 | 설명 |
|------|----------------|------|
| 남은 시간 30분 이상 | 기존 토큰 반환 | 아직 충분히 유효하므로 새로 발급하지 않음 |
| 남은 시간 30분 미만 | 새 토큰 발급 | 곧 만료될 예정이므로 새 토큰 생성 |
| 동시 사용 가능 | 기존 + 새 토큰 | 새 토큰 발급 후에도 기존 토큰은 만료 전까지 사용 가능 |

---

## 🚀 API 엔드포인트

```http
POST https://api.commerce.naver.com/external/v1/oauth2/token
Content-Type: application/x-www-form-urlencoded
```

> **📍 기본 URL**  
> `https://api.commerce.naver.com/external`

## 📝 요청 파라미터

### Content-Type
```
application/x-www-form-urlencoded
```

### 필수 파라미터

| 파라미터 | 타입 | 필수 | 설명 | 예시 |
|----------|------|------|------|------|
| `client_id` | string | ✅ | 네이버에서 발급받은 애플리케이션 ID | `7dMvteboKNHwyRremLXXXX` |
| `timestamp` | integer | ✅ | 현재 시간 (밀리초 단위)<br/>**⚠️ 5분 이내 유효** | `1706671059230` |
| `grant_type` | string | ✅ | OAuth2 인증 방식<br/>**고정값: `client_credentials`** | `client_credentials` |
| `client_secret_sign` | string | ✅ | [전자서명](https://apicenter.commerce.naver.com/docs/auth) 생성 결과 | `JDJhJDA0JFF...` |
| `type` | string | ✅ | 토큰 발급 타입<br/>`SELF` 또는 `SELLER` | `SELLER` |

### 선택 파라미터

| 파라미터 | 타입 | 필수 | 설명 | 예시 |
|----------|------|------|------|------|
| `account_id` | string | ⚠️ | 판매자 ID 또는 UID<br/>**`type`이 `SELLER`일 때 필수** | `ncp_2sRZTWJVbDtHPoz9OXXXX` |

### 📋 파라미터 상세 설명

#### `type` 파라미터의 이해
- **`SELF`**: 자신의 애플리케이션 정보에 접근
- **`SELLER`**: 특정 판매자의 주문, 상품 정보에 접근 (이 경우 `account_id` 필수)

#### `timestamp` 생성 방법
```javascript
// JavaScript
const timestamp = Date.now();

// Python
import time
timestamp = int(time.time() * 1000)

// Java
long timestamp = System.currentTimeMillis();

// PHP
$timestamp = (int)(microtime(true) * 1000);
```

---

## 📤 응답 형식

### 성공 응답 (200 OK)

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 10800,
  "token_type": "Bearer"
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `access_token` | string | 실제 API 호출에 사용할 인증 토큰 |
| `expires_in` | integer | 토큰 유효시간 (초 단위, 기본값: 10800 = 3시간) |
| `token_type` | string | 토큰 타입 (항상 "Bearer") |

### 오류 응답

| HTTP 상태 | 설명 |
|-----------|------|
| 400 | 잘못된 요청 파라미터 |
| 403 | 인증 실패 (잘못된 전자서명 등) |
| 500 | 서버 내부 오류 |

---

## 🧪 실제 사용 예시

### Step 1: 전자서명 생성 및 토큰 발급

#### cURL 예시

```bash
# 전자서명을 미리 생성했다고 가정
curl -X POST "https://api.commerce.naver.com/external/v1/oauth2/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Accept: application/json" \
  -d "client_id=your_client_id" \
  -d "timestamp=1706671059230" \
  -d "grant_type=client_credentials" \
  -d "client_secret_sign=JDJhJDA0JFFLTG5vdTFEMmNTSDE5UGlhMzBiY3VNbE5FSGVCaHhUS3Uuajc0VmZ3TlNiOFhxVzNhXXXX" \
  -d "type=SELLER" \
  -d "account_id=ncp_2sRZTWJVbDtHPoz9OXXXX"
```

#### JavaScript (Node.js) 완전한 예시

```javascript
const axios = require('axios');
const bcrypt = require('bcrypt');

/**
 * 네이버 커머스API 토큰 발급 완전 예제
 */
class NaverCommerceTokenManager {
    constructor(clientId, clientSecret) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.baseUrl = 'https://api.commerce.naver.com/external';
    }

    // 전자서명 생성
    generateSignature(timestamp) {
        const password = `${this.clientId}_${timestamp}`;
        const hashed = bcrypt.hashSync(password, this.clientSecret);
        return Buffer.from(hashed, "utf-8").toString("base64");
    }

    // 토큰 발급
    async getAccessToken(type = 'SELLER', accountId = null) {
        const timestamp = Date.now();
        const signature = this.generateSignature(timestamp);

        const data = new URLSearchParams({
            client_id: this.clientId,
            timestamp: timestamp.toString(),
            grant_type: 'client_credentials',
            client_secret_sign: signature,
            type: type
        });

        // SELLER 타입일 경우 account_id 추가
        if (type === 'SELLER' && accountId) {
            data.append('account_id', accountId);
        }

        try {
            const response = await axios.post(`${this.baseUrl}/v1/oauth2/token`, data, {
  headers: { 
    'Content-Type': 'application/x-www-form-urlencoded', 
    'Accept': 'application/json'
  }
            });

            return response.data;
        } catch (error) {
            console.error('토큰 발급 실패:', error.response?.data || error.message);
            throw error;
        }
    }
}

// 사용 예시
async function main() {
    const tokenManager = new NaverCommerceTokenManager(
        'your_client_id',                    // 실제 클라이언트 ID로 교체
        '$2a$10$abcdefghijklmnopqrstuv'      // 실제 클라이언트 시크릿으로 교체
    );

    try {
        const tokenResult = await tokenManager.getAccessToken('SELLER', 'your_seller_id');
        console.log('토큰 발급 성공:', tokenResult);
        
        // 발급받은 토큰을 저장하여 다른 API 호출에 사용
        const accessToken = tokenResult.access_token;
        console.log(`토큰: ${accessToken}`);
        console.log(`유효시간: ${tokenResult.expires_in}초 (${tokenResult.expires_in/3600}시간)`);
        
    } catch (error) {
        console.error('오류 발생:', error.message);
    }
}

// 실행
main();
```

#### Python 완전한 예시

```python
import requests
import bcrypt
import pybase64
import time

class NaverCommerceTokenManager:
    """네이버 커머스API 토큰 관리 클래스"""
    
    def __init__(self, client_id, client_secret):
        self.client_id = client_id
        self.client_secret = client_secret
        self.base_url = 'https://api.commerce.naver.com/external'
    
    def generate_signature(self, timestamp):
        """전자서명 생성"""
        password = f"{self.client_id}_{timestamp}"
        hashed = bcrypt.hashpw(password.encode('utf-8'), self.client_secret.encode('utf-8'))
        return pybase64.standard_b64encode(hashed).decode('utf-8')
    
    def get_access_token(self, token_type='SELLER', account_id=None):
        """토큰 발급"""
        timestamp = int(time.time() * 1000)
        signature = self.generate_signature(timestamp)
        
        data = {
            'client_id': self.client_id,
            'timestamp': str(timestamp),
            'grant_type': 'client_credentials',
            'client_secret_sign': signature,
            'type': token_type
        }
        
        # SELLER 타입일 경우 account_id 추가
        if token_type == 'SELLER' and account_id:
            data['account_id'] = account_id
        
        try:
            response = requests.post(
                f"{self.base_url}/v1/oauth2/token",
                data=data,
                headers={
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                }
            )
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"토큰 발급 실패: {e}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"응답 내용: {e.response.text}")
            raise

# 사용 예시
if __name__ == "__main__":
    token_manager = NaverCommerceTokenManager(
        client_id='your_client_id',                   # 실제 클라이언트 ID로 교체
        client_secret='$2a$10$abcdefghijklmnopqrstuv'  # 실제 클라이언트 시크릿으로 교체
    )
    
    try:
        token_result = token_manager.get_access_token('SELLER', 'your_seller_id')
        print(f"토큰 발급 성공: {token_result}")
        print(f"액세스 토큰: {token_result['access_token']}")
        print(f"유효시간: {token_result['expires_in']}초 ({token_result['expires_in']/3600}시간)")
        
    except Exception as e:
        print(f"오류 발생: {e}")
```

### Step 2: 발급받은 토큰으로 API 호출

```javascript
// 토큰을 사용하여 다른 API 호출
const accessToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...'; // Step 1에서 받은 토큰

const apiResponse = await axios.get(
    'https://api.commerce.naver.com/external/v1/some-api-endpoint',
    {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
        }
    }
);
```

---

## 🚨 오류 처리

### 일반적인 오류와 해결방법

| 오류 코드 | 원인 | 해결방법 |
|-----------|------|----------|
| 400 | 필수 파라미터 누락 | 모든 필수 파라미터가 포함되었는지 확인 |
| 403 | 전자서명 오류 | 전자서명 생성 과정을 다시 확인 |
| 403 | 타임스탬프 만료 | 현재 시간으로 새 타임스탬프 생성 |
| 500 | 서버 오류 | 잠시 후 재시도 |

### 디버깅 팁

1. **전자서명 검증**: [인증 문서](https://apicenter.commerce.naver.com/docs/auth)의 예시와 결과 비교
2. **타임스탬프 확인**: 현재 시간으로부터 5분 이내인지 확인
3. **Content-Type 확인**: `application/x-www-form-urlencoded` 사용 필수

---

> **✅ 체크리스트**
> - [ ] 클라이언트 ID와 시크릿 확인
> - [ ] 전자서명 정확히 생성
> - [ ] 타임스탬프가 5분 이내
> - [ ] Content-Type 올바르게 설정
> - [ ] type이 SELLER일 때 account_id 포함

---

**참고 문서**
- [인증 방식 이해하기](https://apicenter.commerce.naver.com/docs/auth)
- [전자서명 생성 가이드](https://apicenter.commerce.naver.com/docs/auth#전자서명)
- [커머스API 센터](https://apicenter.commerce.naver.com/)


