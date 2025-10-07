---
title: "네이버 커머스API 인증 가이드"
source: "https://apicenter.commerce.naver.com/docs/auth"
author:
published:
created: 2025-09-26
description: "네이버 커머스API의 OAuth2 인증 방식과 전자서명 생성 방법에 대한 완전 가이드"
tags:
  - "clippings"
  - "authentication"
  - "oauth2"
  - "security"
---

# 📊 네이버 커머스API 인증 가이드

## 📋 목차
- [개요](#개요)
- [인증 토큰 발급](#인증-토큰-발급)
- [전자서명](#전자서명)
- [API 인증 실패 대응](#api-인증-실패-대응)
- [코드 예시](#코드-예시)

---

## 🔐 개요

> **🎯 핵심 요약**  
> 네이버 커머스API는 **OAuth2 Client Credentials Grant** 방식을 사용하여 서버 간 인증을 수행합니다.

### 인증 방식 이해하기

커머스API는 **서버 대 서버** 통신을 위해 설계되었습니다. 마치 은행의 ATM이 본점 서버와 통신할 때 인증서를 사용하는 것처럼, 개발사의 서버가 네이버 커머스 서버와 안전하게 데이터를 주고받기 위해 OAuth2 인증을 사용합니다.

**🔍 OAuth2 Client Credentials Grant란?**
- 사용자의 개입 없이 애플리케이션끼리 직접 인증하는 방식
- 웹사이트 로그인과 달리, 서버가 자동으로 인증 토큰을 받아서 API를 호출
- 자세한 사양: [RFC 6749 Section 4.4](https://tools.ietf.org/html/rfc6749#section-4.4)

## 🎫 인증 토큰 발급

### 기본 개념
인증 토큰은 **API 호출을 위한 임시 열쇠**입니다. 마치 호텔에서 받는 키카드처럼, 일정 시간 동안만 유효하며 이 토큰으로 커머스API의 다양한 기능을 사용할 수 있습니다.

> **📖 상세 가이드**  
> 토큰 발급 과정은 [인증 토큰 발급 요청 API 문서](https://apicenter.commerce.naver.com/docs/commerce-api/current/exchange-sellers-auth)를 참고하세요.

### 🔄 API 인증 실패 대응

**문제 상황 인식하기**

API 호출 중 다음과 같은 응답을 받으면 **인증 토큰이 만료**된 상황입니다:

\`\`\`json
HTTP/1.1 401 Unauthorized
date: Tue, 05 Nov 2023 14:35:24 GMT
content-type: application/json
content-length: 168
gncp-gw-trace-id: cr3-000000-aaaaaa^1730711073284^6745261

{
    "code":"GW.AUTHN",
    "message":"요청을 보낼 권한이 없습니다.",
    "timestamp":"2023-11-05T23:35:24.415+09:00",
    "traceId":"cr3-000000-aaaaaa^1730711073284^6745261"
}
\`\`\`

**⚠️ 체크포인트**
- HTTP 상태 코드: `401 Unauthorized`
- 오류 코드: `GW.AUTHN`

**자동 재시도 구현하기**

마치 출입카드가 만료되었을 때 새 카드를 발급받는 것처럼, 토큰 만료 시 자동으로 새 토큰을 발급받는 로직을 구현해야 합니다:

\`\`\`javascript
// 의사코드 (Pseudocode)
retry {
    response = API_호출(with access_token)
} when {
    response.status == 401 && response.body.code == 'GW.AUTHN'
} before {
    access_token = 인증_토큰_발급_요청(client_id, client_secret_sign, timestamp, 'client_credentials', 'SELF')
}
\`\`\`

> **💡 개발 팁**  
> 토큰 만료 전에 미리 갱신하는 것이 좋습니다. 토큰 유효기간은 3시간이므로 2시간 30분 후에 자동 갱신하도록 설정하세요.

## 🔐 전자서명

### 전자서명이 필요한 이유

전자서명은 **인터넷에서 신원을 증명하는 디지털 도장**입니다. 마치 은행에서 거래할 때 도장이나 서명을 하는 것처럼, API 호출 시 "이 요청이 정말 우리 회사에서 보낸 것이다"라는 것을 증명하는 역할을 합니다.

> **🛡️ 보안 강화**  
> 클라이언트 시크릿을 직접 전송하지 않고 전자서명을 사용함으로써, 네트워크상에서 중요한 비밀키가 노출되는 것을 방지합니다.

### 필요한 재료

전자서명을 만들기 위해서는 다음 3가지가 필요합니다:

| 항목 | 설명 | 예시 |
|------|------|------|
| `client_id` | 애플리케이션 ID (우리가 누구인지 알려주는 ID) | `aaaabbbbcccc` |
| `client_secret` | 애플리케이션 시크릿 (비밀키, 절대 공개하면 안됨) | `$2a$10$abcdefghijklmnopqrstuv` |
| `timestamp` | 현재 시간 (밀리초 단위) | `1643956077762` |

### 📝 전자서명 생성 단계

#### 1단계: bcrypt 해싱

**bcrypt란?** 비밀번호를 안전하게 저장하기 위한 암호화 방식입니다. 마치 고기를 갈아서 햄버거 패티로 만들면 원래 상태로 돌아갈 수 없는 것처럼, 원본 데이터를 복원할 수 없게 변환합니다.

\`\`\`javascript
// bcrypt 함수 사용법
BCrypt.hashpw(password, salt)
\`\`\`

**파라미터 준비:**
- `password`: `client_id`와 `timestamp`를 밑줄로 연결
  - 예: `aaaabbbb_1643956077762`
- `salt`: `client_secret` 값 그대로 사용

#### 2단계: Base64 인코딩

생성된 해시값을 **HTTP로 안전하게 전송**하기 위해 Base64로 인코딩합니다. 이는 한글을 URL에 넣을 때 퍼센트 인코딩하는 것과 비슷한 개념입니다.

> **🔄 변환 과정 요약**  
> `client_id + timestamp` → `bcrypt 해싱` → `Base64 인코딩` → `전자서명 완성`

## 💻 코드 예시

각 언어별로 전자서명을 생성하는 완전한 예제입니다. 복사해서 바로 사용할 수 있습니다.

### ☕ Java

\`\`\`java
/**
 * 네이버 커머스API 전자서명 생성기
 * 
 * 필요 라이브러리: JBCrypt
 * 다운로드: https://github.com/jeremyh/jBCrypt
 * Maven: <dependency><groupId>org.mindrot</groupId><artifactId>jbcrypt</artifactId></dependency>
 */
import org.mindrot.jbcrypt.BCrypt;
import java.util.Base64;
import java.nio.charset.StandardCharsets;

class NaverCommerceAuth {
    
    /**
     * 전자서명 생성 함수
     * @param clientId 네이버에서 발급받은 클라이언트 ID
     * @param clientSecret 네이버에서 발급받은 클라이언트 시크릿 (비밀키)
     * @param timestamp 현재 시간 (밀리초 단위)
     * @return Base64로 인코딩된 전자서명
     */
    public static String generateSignature(String clientId, String clientSecret, Long timestamp) {
        // 1단계: 클라이언트ID와 타임스탬프를 밑줄로 연결
        String password = clientId + "_" + timestamp;
        
        // 2단계: bcrypt로 해싱 (마치 고기를 갈아서 패티로 만드는 과정)
        String hashedPassword = BCrypt.hashpw(password, clientSecret);
        
        // 3단계: HTTP 전송을 위해 Base64로 인코딩
        return Base64.getUrlEncoder().encodeToString(hashedPassword.getBytes(StandardCharsets.UTF_8));
    }

    public static void main(String[] args) {
        // 테스트 데이터 (실제로는 네이버에서 발급받은 값을 사용)
        String clientId = "aaaabbbbcccc";
        String clientSecret = "$2a$10$abcdefghijklmnopqrstuv";
        Long timestamp = System.currentTimeMillis(); // 현재 시간
        
        String signature = generateSignature(clientId, clientSecret, timestamp);
        System.out.println("생성된 전자서명: " + signature);
    }
}
\`\`\`

### 🐍 Python

\`\`\`python
#!/usr/bin/env python3
"""
네이버 커머스API 전자서명 생성기

필요 라이브러리:
pip install bcrypt pybase64
"""
import bcrypt
import pybase64
import time

def generate_signature(client_id, client_secret, timestamp):
    """
    전자서명 생성 함수
    
    Args:
        client_id (str): 네이버에서 발급받은 클라이언트 ID
        client_secret (str): 네이버에서 발급받은 클라이언트 시크릿
        timestamp (int): 현재 시간 (밀리초 단위)
    
    Returns:
        str: Base64로 인코딩된 전자서명
    """
    # 1단계: 클라이언트ID와 타임스탬프를 밑줄로 연결
    password = f"{client_id}_{timestamp}"
    
    # 2단계: bcrypt로 해싱
    hashed = bcrypt.hashpw(password.encode('utf-8'), client_secret.encode('utf-8'))
    
    # 3단계: Base64로 인코딩
    return pybase64.standard_b64encode(hashed).decode('utf-8')

if __name__ == "__main__":
    # 테스트 데이터 (실제로는 네이버에서 발급받은 값을 사용)
    client_id = "aaaabbbbcccc"
    client_secret = "$2a$10$abcdefghijklmnopqrstuv" 
    timestamp = int(time.time() * 1000)  # 현재 시간을 밀리초로 변환
    
    signature = generate_signature(client_id, client_secret, timestamp)
    print(f"생성된 전자서명: {signature}")
\`\`\`

### 🟢 Node.js

\`\`\`javascript
/**
 * 네이버 커머스API 전자서명 생성기
 * 
 * 필요 패키지: npm install bcrypt
 */
const bcrypt = require("bcrypt");

/**
 * 전자서명 생성 함수
 * @param {string} clientId - 네이버에서 발급받은 클라이언트 ID
 * @param {string} clientSecret - 네이버에서 발급받은 클라이언트 시크릿
 * @param {number} timestamp - 현재 시간 (밀리초 단위)
 * @returns {string} Base64로 인코딩된 전자서명
 */
function generateSignature(clientId, clientSecret, timestamp) {
    // 1단계: 클라이언트ID와 타임스탬프를 밑줄로 연결
    const password = `${clientId}_${timestamp}`;
    
    // 2단계: bcrypt로 해싱 (동기 방식 사용)
    const hashed = bcrypt.hashSync(password, clientSecret);
    
    // 3단계: Base64로 인코딩
    return Buffer.from(hashed, "utf-8").toString("base64");
}

// 사용 예시
const clientId = "aaaabbbbcccc";
const clientSecret = "$2a$10$abcdefghijklmnopqrstuv";
const timestamp = Date.now(); // 현재 시간 (밀리초)

try {
    const signature = generateSignature(clientId, clientSecret, timestamp);
    console.log(`생성된 전자서명: ${signature}`);
} catch (error) {
    console.error("전자서명 생성 중 오류:", error.message);
}
\`\`\`

### 🐘 PHP

\`\`\`php
<?php
/**
 * 네이버 커머스API 전자서명 생성기
 * 
 * PHP 기본 함수 사용 (추가 라이브러리 불필요)
 */

/**
 * 전자서명 생성 함수
 * @param string $clientId 네이버에서 발급받은 클라이언트 ID
 * @param string $clientSecret 네이버에서 발급받은 클라이언트 시크릿
 * @param int $timestamp 현재 시간 (밀리초 단위)
 * @return string Base64로 인코딩된 전자서명
 */
function generateSignature($clientId, $clientSecret, $timestamp) {
    // 1단계: 클라이언트ID와 타임스탬프를 밑줄로 연결
    $password = $clientId . '_' . $timestamp;
    
    // 2단계: crypt 함수로 bcrypt 해싱
    $hashed = crypt($password, $clientSecret);
    
    // 3단계: Base64로 인코딩
    return base64_encode($hashed);
}

// 사용 예시
$clientId = 'aaaabbbbcccc';
$clientSecret = '$2a$10$abcdefghijklmnopqrstuv';
$timestamp = (int)(microtime(true) * 1000); // 현재 시간을 밀리초로 변환

try {
    $signature = generateSignature($clientId, $clientSecret, $timestamp);
    echo "생성된 전자서명: " . $signature . "\n";
} catch (Exception $e) {
    echo "전자서명 생성 중 오류: " . $e->getMessage() . "\n";
}
?>
\`\`\`

---

> **⚡ 실행 결과**  
> 모든 언어에서 같은 입력값을 사용하면 동일한 전자서명이 생성됩니다:  
> `JDJhJDEwJGFiY2RlZmdoaWprbG1ub3BxcnN0dXVCVldZSk42T0VPdEx1OFY0cDQxa2IuTnpVaUEzbmsy`

> **🚨 주의사항**  
> - `client_secret`은 절대 외부에 노출되어서는 안 됩니다
> - `timestamp`는 서버 시간을 사용하며, 5분 이내에 유효합니다
> - 프로덕션 환경에서는 환경변수나 안전한 설정 파일에 인증 정보를 저장하세요
