---
title: "Kakao Developers"
source: "https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-code"
author:
  - "[[인가]]"
published:
created: 2025-10-06
description: "이 문서는 REST API를 사용한 로그인 구현 방법을 안내합니다."
tags:
  - "clippings"
---
## menu

## 카카오 로그인

![](https://developers.kakao.com/docs/static/image/ko/m/kakaologin.png)

## REST API

이 문서는 REST API를 사용한 로그인 구현 방법을 안내합니다.

이 문서에 포함된 기능 일부는 \[도구\] > \[REST API 테스트\]에서 사용해 볼 수 있습니다.

카카오 로그인 구현에 필요한 로그인 버튼 이미지는 \[도구\] > \[리소스 다운로드\]에서 제공합니다. 해당 로그인 버튼은 디자인 가이드를 참고하여 서비스 UI에 적합한 크기로 수정하여 사용할 수 있습니다.

## 시작하기 전에

### 카카오 로그인 과정

REST API 방식의 카카오 로그인은 PC 및 모바일 웹에서 사용하기 적합한 방식입니다. 아래는 REST API를 사용한 카카오 로그인 과정을 나타낸 시퀀스 다이어그램(Sequence diagram)입니다. 단계별 안내를 함께 참고합니다.

![카카오 로그인 과정](https://developers.kakao.com/docs/latest/ko/assets/style/img/login_sequence_ko.png)

카카오 로그인 과정

##### 1\. 인가 코드 요청

1. 서비스 서버가 카카오 인증 서버로 [인가 코드 요청](https://developers.kakao.com/docs/latest/ko/kakaologin/#request-code) 을 호출합니다.
2. 카카오 인증 서버가 사용자에게 [인증](https://developers.kakao.com/docs/latest/ko/kakaologin/common#login-authentication) 을 요청합니다.
	- 사용자 클라이언트에 유효한 카카오계정 세션이 있거나, 카카오톡 인앱 브라우저에서의 요청인 경우 4단계로 넘어갑니다.
3. 사용자가 카카오계정으로 로그인합니다.
4. 카카오 인증 서버가 사용자에게 동의 화면을 출력하여 를 위한 사용자 동의를 요청합니다.
	- 동의 화면은 서비스 앱의 [동의항목 설정](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope) 으로 구성됩니다.
5. 사용자가 필수 동의항목과, 이 외의 원하는 동의항목에 동의한 뒤 \[동의하고 계속하기\] 버튼을 누릅니다.
6. 카카오 인증 서버는 서비스 서버의 리다이렉트 URI로 인가 코드를 전달합니다.

**카카오계정 세션**

클라이언트에서 사용자가 이미 카카오계정으로 로그인한 상태라면 카카오계정 세션이 존재합니다. 로그인 시 카카오계정 세션의 인증 시간은 기본 24시간이며, 최초 인증 후 세션 시간은 변경되지 않습니다. 사용자가 카카오계정 로그인 화면에서 \[로그인 상태 유지\]를 선택한 경우에는 인증 시간이 1달입니다.

**간편로그인**

모바일 웹 환경에서는 Kakao SDK for JavaScript의 [간편로그인](https://developers.kakao.com/docs/latest/ko/kakaologin/js#login) 을 사용할 수 있습니다. 간편로그인 사용 시, 사용자가 카카오계정 ID와 비밀번호를 입력하지 않고도 카카오톡으로 인증을 받아 간편하게 로그인할 수 있습니다.

##### 2\. 토큰 요청

1. 서비스 서버가 리다이렉트 URI로 전달받은 인가 코드로 [토큰 요청](https://developers.kakao.com/docs/latest/ko/kakaologin/#request-token) 을 호출합니다.
2. 카카오 인증 서버가 토큰을 발급해 서비스 서버에 전달합니다.

##### 3\. 사용자 로그인 처리

**주의**

서비스의 사용자 로그인 처리는 서비스에서 자체 구현해야 합니다. 이 문서는 사용자 로그인 처리 구현 시 참고할 수 있는 정보를 제공합니다.

- 서비스 서버가 발급받은 액세스 토큰으로 [사용자 정보 조회](https://developers.kakao.com/docs/latest/ko/kakaologin/#req-user-info) 를 요청해 사용자의 회원번호 및 정보를 조회하여 서비스 회원인지 확인합니다.
- 서비스 회원 정보 확인 결과에 따라 서비스 로그인 또는 회원 가입합니다.
- 이 외 서비스에서 필요한 로그인 절차를 수행한 후, 카카오 로그인한 사용자의 서비스 로그인 처리를 완료합니다.

## 카카오 로그인

### 인가 코드 요청

##### 기본 정보

| 메서드 | URL | 인증 방식 |
| --- | --- | --- |
| `GET` | `https://kauth.kakao.com/oauth/authorize` | \- |

| [권한](https://developers.kakao.com/docs/latest/ko/getting-started/permission) | 사전 설정 | [카카오 로그인](https://developers.kakao.com/docs/latest/ko/kakaologin/common) | [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#scope) |
| --- | --- | --- | --- |
| \- | [플랫폼 등록](https://developers.kakao.com/docs/latest/ko/app-setting/app#platform)   [카카오 로그인 활성화](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#kakao-login-activate)   [리다이렉트 URI 등록](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#kakao-login-redirect-uri)   [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope)   [OpenID Connect 활성화](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#kakao-login-oidc) (선택)   [간편가입](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#sync) (선택) | 필요 | 필요:   필수 동의항목 |

  

카카오 로그인 동의 화면을 호출하고, 사용자 동의를 거쳐 인가 코드를 발급합니다. 동의 화면은 앱에 설정된 [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#scope) 에 대해 사용자에게 인가(동의)를 구합니다. 인가 코드는 동의 화면으로 인가받은 동의항목 정보를 갖고 있으며, 인가 코드를 사용해 [토큰 요청](https://developers.kakao.com/docs/latest/ko/kakaologin/#request-token) 을 호출할 수 있습니다. [OpenID Connect](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#oidc) 를 사용하는 앱일 경우, 앱 설정에 따라 ID 토큰을 함께 발급받을 수 있는 인가 코드를 발급합니다.

**동의 화면**

동의 화면은 사용자와 앱이 처음 연결될 때만 나타납니다. 사용자가 이미 동의 화면에서 서비스 이용에 필요한 동의항목에 동의 완료한 경우, 해당 사용자의 카카오 로그인 시에는 동의 화면이 나타나지 않고 즉시 인가 코드가 발급됩니다. 사용자와 앱이 연결된 이후 다시 동의 화면으로 특정 동의항목에 대한 사용자 동의를 요청하려면 [동의항목 추가 동의 요청](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-code-additional-consent) 로 동의 화면을 호출할 수 있습니다. 서비스 가입 과정이 올바르게 완료되지 않아 다시 동의 화면을 호출해야 할 경우에는 [연결 해제](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#unlink) 후 다시 인가 코드를 요청합니다.

인가 코드 요청은 웹 브라우저 또는 웹뷰의 카카오계정 세션 존재 여부에 따라 다르게 동작합니다.

- 카카오계정 세션 없음: 사용자가 카카오계정 정보를 입력하거나 카카오톡으로 로그인하는 인증 과정을 거쳐 동의 화면을 출력합니다.
- 카카오계정 세션 있음: 카카오계정 로그인 과정을 거치지 않고 바로 동의 화면을 출력합니다.

사용자는 동의 화면에서 서비스 이용에 필요한 동의항목에 동의하고 로그인하거나 로그인을 취소할 수 있습니다. 카카오 인증 서버는 사용자의 선택에 따라 요청 처리 결과를 담은 쿼리 문자열(Query string)을 `redirect_uri` 로 [HTTP 302](https://en.wikipedia.org/wiki/HTTP_302) 리다이렉트(Redirect)합니다. 리다이렉트 URI는 [앱 관리 페이지](https://developers.kakao.com/console/app) 의 \[카카오 로그인\] > \[리다이렉트 URI\]에 등록된 값 중 하나여야 합니다.

![카카오계정으로 로그인 과정](https://developers.kakao.com/docs/latest/ko/assets/style/images/kakaologin/kakaologin_code.png)

카카오계정으로 로그인 과정

서비스 서버는 `redirect_uri` 로 HTTP 302 리다이렉트된 요청의 `Location` 에서 인가 코드 또는 에러를 확인해 아래와 같이 처리해야 합니다.

- 인가 코드 요청 성공
	- 사용자가 모든 필수 동의항목에 동의하고 \[동의하고 계속하기\] 버튼을 누른 경우
	- `code` 및 `state` 전달
	- `code` 의 인가 코드 값으로 [토큰 요청](https://developers.kakao.com/docs/latest/ko/kakaologin/#request-token)
- 인가 코드 요청 실패
	- 사용자가 동의 화면에서 \[취소\] 버튼을 눌러 로그인을 취소했거나, 다른 에러가 발생한 경우
	- `error` 및 `error_description` 전달
	- [카카오 로그인 에러 코드](https://developers.kakao.com/docs/latest/ko/kakaologin/trouble-shooting) 와 [공통 에러 코드](https://developers.kakao.com/docs/latest/ko/rest-api/error-code) 를 참고해 에러 원인별 상황에 맞는 서비스 페이지나 안내 문구를 사용자에게 보여주도록 처리

#### 요청

##### 쿼리 파라미터

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| client\_id | `String` | 앱 REST API 키   [앱 관리 페이지](https://developers.kakao.com/console/app) 의 \[앱\] > \[일반\] > \[앱 키\]에서 확인 가능 | O |
| redirect\_uri | `String` | 인가 코드를 전달받을 서비스 서버의 URI   [앱 관리 페이지](https://developers.kakao.com/console/app) 의 \[카카오 로그인\] > \[리다이렉트 URI\]에서 등록 | O |
| response\_type | `String` | `code` 로 고정 | O |
| scope | `String` | [동의항목 추가 동의 요청](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-code-additional-consent) 시 사용   사용자에게 동의 요청할 동의항목 ID 목록   동의항목의 ID는 [사용자 정보](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#user-info) 또는 [앱 관리 페이지](https://developers.kakao.com/console/app) 의 \[카카오 로그인\] > \[동의항목\]에서 확인 가능   쉼표(,)로 구분해 여러 개 전달 가능      **주의**: OpenID Connect를 사용하는 앱의 경우, `scope` 파라미터 값에 `openid` 를 반드시 포함해야 함, 미포함 시 ID 토큰이 재발급되지 않음 (참고: [인가 코드 요청 API의 scope 파라미터](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#additional-consent-scope)) | X |
| prompt | `String` | 동의 화면 요청 시 추가 상호작용을 요청할 때 사용   쉼표(,)로 구분된 문자열 값 목록으로 전달      아래 값 사용 가능   `login`: 기존 사용자 인증 여부와 상관없이 사용자에게 카카오계정 로그인 화면을 출력하여 다시 사용자 인증을 수행하고자 할 때 사용, 카카오톡 인앱 브라우저에서는 제공하지 않음   `none`: 사용자에게 동의 화면과 같은 대화형 UI를 노출하지 않고 인가 코드 발급을 요청할 때 사용, 인가 코드 발급을 위해 사용자의 동작이 필요한 경우 에러 응답 전달   `create`: 사용자가 카카오계정 신규 가입 후 로그인하도록 할 때 사용, [카카오계정 가입 페이지](https://accounts.kakao.com/weblogin/create_account) 로 이동 후, 카카오계정 가입 완료 후 동의 화면 출력   `select_account`: [카카오계정 간편로그인](https://developers.kakao.com/docs/latest/ko/kakaologin/#request-code-prompt-select-account) 을 요청할 때 사용, 브라우저에 카카오계정 로그인 세션이 있을 경우 자동 로그인 또는 계정 선택 화면 출력      **참고**: [추가 기능](https://developers.kakao.com/docs/latest/ko/kakaologin/#additional-feature) | X |
| login\_hint | `String` | [로그인 힌트](https://developers.kakao.com/docs/latest/ko/kakaologin/#request-code-login-hint) 요청 시 사용   카카오계정 로그인 페이지의 ID란에 자동 입력할 값      **중요**: 로그인하지 않은 사용자에게 카카오계정 로그인 페이지를 표시하는 상황에서만 동작   **참고**: 카카오계정 로그인 시 이메일, 전화번호, 카카오메일 ID를 ID에 입력하여 로그인 가능 | X |
| service\_terms | `String` | [서비스 약관 선택해 동의 요청](https://developers.kakao.com/docs/latest/ko/kakaologin/#request-code-terms) 시 사용   동의받을 서비스 약관 태그 목록   서비스 약관 태그는 [앱 관리 페이지](https://developers.kakao.com/console/app) 의 \[카카오 로그인\] > \[간편가입\]에서 확인 가능   쉼표(,)로 구분된 문자열 값 목록으로 전달 | X |
| state | `String` | 카카오 로그인 과정 중 동일한 값을 유지하는 임의의 문자열(정해진 형식 없음)   [Cross-Site Request Forgery(CSRF)](https://en.wikipedia.org/wiki/Cross-site_request_forgery) 공격으로부터 카카오 로그인 요청을 보호하기 위해 사용   각 사용자의 로그인 요청에 대한 `state` 값은 고유해야 함   인가 코드 요청, 인가 코드 응답, 토큰 발급 요청의 `state` 값 일치 여부로 요청 및 응답 유효성 확인 가능 | X |
| nonce | `String` | [OpenID Connect](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#oidc) 로 ID 토큰을 함께 발급받을 경우, [ID 토큰 재생](https://en.wikipedia.org/wiki/Replay_attack) 공격을 방지하기 위해 사용   [ID 토큰 유효성 검증](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#oidc-id-token-verify) 시 대조할 임의의 문자열(정해진 형식 없음) | X |

\* auth\_type: Deprecated, prompt를 사용하도록 변경

#### 응답

인가 코드 요청의 응답은 HTTP 302 리다이렉트되어, `redirect_uri` 에 `GET` 요청으로 전달됩니다. 아래 쿼리 파라미터를 포함합니다.

##### 쿼리 파라미터

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| code | `String` | [토큰 요청](https://developers.kakao.com/docs/latest/ko/kakaologin/#request-token) 에 필요한 인가 코드 | X |
| error | `String` | 인증 실패 시 반환되는 에러 코드 | X |
| error\_description | `String` | 인증 실패 시 반환되는 에러 메시지 | X |
| state | `String` | 요청 시 전달한 `state` 값과 동일한 값 | X |

#### 예제

##### 요청

\`\`\`bash
https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}
\`\`\`

##### 응답: 사용자가 \[동의하고 계속하기\] 선택, 로그인 진행

\`\`\`
HTTP/1.1 302
Content-Length: 0
Location: ${REDIRECT_URI}?code=${AUTHORIZE_CODE}
\`\`\`

##### 응답: 로그인 취소

\`\`\`
HTTP/1.1 302
Content-Length: 0
Location: ${REDIRECT_URI}?error=access_denied&error_description=User%20denied%20access
\`\`\`

### 토큰 요청

##### 기본 정보

| 메서드 | URL | 인증 방식 |
| --- | --- | --- |
| `POST` | `https://kauth.kakao.com/oauth/token` | \- |

| [권한](https://developers.kakao.com/docs/latest/ko/getting-started/permission) | 사전 설정 | [카카오 로그인](https://developers.kakao.com/docs/latest/ko/kakaologin/common) | [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#scope) |
| --- | --- | --- | --- |
| \- | [플랫폼 등록](https://developers.kakao.com/docs/latest/ko/app-setting/app#platform)   [카카오 로그인 활성화](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#kakao-login-activate)   [리다이렉트 URI 등록](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#kakao-login-redirect-uri)   [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope)   [OpenID Connect 활성화](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#kakao-login-oidc) (선택) | 필요 | 필요:   필수 동의항목 |

  

인가 코드로 토큰 발급을 요청합니다. [인가 코드 요청](https://developers.kakao.com/docs/latest/ko/kakaologin/#request-code) 만으로는 카카오 로그인이 완료되지 않으며, 토큰 요청까지 마쳐야 카카오 로그인을 정상적으로 완료할 수 있습니다.

필수 파라미터를 포함해 `POST` 로 요청합니다. 요청 성공 시 응답은 토큰과 토큰 정보를 포함합니다. [OpenID Connect](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#oidc) 를 사용하는 앱인 경우, 응답에 ID 토큰이 함께 포함됩니다. 각 토큰의 역할과 만료 시간에 대한 자세한 정보는 [토큰 정보](https://developers.kakao.com/docs/latest/ko/kakaologin/common#login-token) 에서 확인할 수 있습니다.

액세스 토큰으로 [사용자 정보 조회](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#req-user-info) 와 같은 카카오 API를 호출할 수 있습니다. [액세스 토큰 정보 조회](https://developers.kakao.com/docs/latest/ko/kakaologin/#get-token-info) 로 액세스 토큰 유효성 검증 후, [사용자 정보 조회](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#req-user-info) 를 요청해 필요한 사용자 정보를 받아 서비스 회원 가입 및 로그인을 완료합니다.

**주의: 토큰 발급 요청 수 제한**

[요청 수 제한](https://developers.kakao.com/docs/latest/ko/getting-started/quota#rate-limit) 을 초과한 토큰 발급을 요청한 경우 `KOE237` 에러가 발생합니다. 자세한 내용과 해결 방법은 [문제 해결](https://developers.kakao.com/docs/latest/ko/kakaologin/trouble-shooting#token) 을 참고합니다.

#### 요청

##### 헤더

| 이름 | 설명 | 필수 |
| --- | --- | --- |
| Content-Type | `Content-Type: application/x-www-form-urlencoded;charset=utf-8`   요청 데이터 타입 | O |

##### 본문

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| grant\_type | `String` | `authorization_code` 로 고정 | O |
| client\_id | `String` | 앱 REST API 키   [앱 관리 페이지](https://developers.kakao.com/console/app) 의 \[앱\] > \[일반\] > \[앱 키\]에서 확인 가능 | O |
| redirect\_uri | `String` | 인가 코드가 리다이렉트된 URI | O |
| code | `String` | 인가 코드 요청으로 얻은 인가 코드 | O |
| client\_secret | `String` | 토큰 발급 시, 보안을 강화하기 위해 추가 확인하는 코드   [앱 관리 페이지](https://developers.kakao.com/console/app) 의 \[카카오 로그인\] > \[보안\]에서 설정 가능   ON 상태인 경우 필수 설정해야 함 | X |

#### 응답

##### 본문

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| token\_type | `String` | 토큰 타입, `bearer` 로 고정 | O |
| access\_token | `String` | 사용자 액세스 토큰 값 | O |
| id\_token | `String` | [ID 토큰](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#oidc-id-token) 값   OpenID Connect 확장 기능으로 발급하는 ID 토큰, Base64 인코딩 된 사용자 인증 정보 포함      **제공 조건**: [OpenID Connect](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#oidc) 가 활성화 된 앱의 토큰 발급 요청인 경우   또는 `scope` 에 `openid` 를 포함한 [동의항목 추가 동의 요청](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-code-additional-consent) 을 거친 토큰 발급 요청인 경우 | X |
| expires\_in | `Integer` | 액세스 토큰과 ID 토큰의 만료 시간(초)      **참고**: 액세스 토큰과 ID 토큰의 만료 시간은 동일 | O |
| refresh\_token | `String` | 사용자 리프레시 토큰 값 | O |
| refresh\_token\_expires\_in | `Integer` | 리프레시 토큰 만료 시간(초) | O |
| scope | `String` | 인증된 사용자의 정보 조회 권한 범위   범위가 여러 개일 경우, 공백으로 구분      **참고**: [OpenID Connect](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#oidc) 가 활성화된 앱의 토큰 발급 요청인 경우, ID 토큰이 함께 발급되며 `scope` 값에 `openid` 포함 | X |

##### 참고: ID 토큰 페이로드

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| iss | `String` | ID 토큰을 발급한 인증 기관 정보   `https://kauth.kakao.com` 으로 고정 | O |
| aud | `String` | ID 토큰이 발급된 앱의 앱 키   [인가 코드 요청](https://developers.kakao.com/docs/latest/ko/kakaologin/#request-code) 시 `client_id` 에 전달된 앱 키   Kakao SDK를 사용한 카카오 로그인의 경우, 해당 SDK 초기화 시 사용된 앱 키 | O |
| sub | `String` | ID 토큰에 해당하는 사용자의 회원번호 | O |
| iat | `Integer` | ID 토큰 발급 또는 갱신 시각, UNIX 타임스탬프(Timestamp) | O |
| exp | `Integer` | ID 토큰 만료 시간, UNIX 타임스탬프(Timestamp) | O |
| auth\_time | `Integer` | 사용자가 카카오 로그인으로 인증을 완료한 시각, UNIX 타임스탬프(Timestamp) | O |
| nonce | `String` | 인가 코드 요청 시 전달한 `nonce` 값과 동일한 값   [ID 토큰 유효성 검증](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#oidc-id-token-verify) 시 사용 | X |
| nickname | `String` | 닉네임   [사용자 정보 조회](https://developers.kakao.com/docs/latest/ko/kakaologin/#req-user-info) 의 `kakao_account.profile.nickname` 에 해당      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 프로필 정보(닉네임/프로필 사진) 또는 닉네임 | X |
| picture | `String` | 프로필 미리보기 이미지 URL   110px \* 110px 또는 100px \* 100px   [사용자 정보 조회](https://developers.kakao.com/docs/latest/ko/kakaologin/#req-user-info) 의 `kakao_account.profile.thumbnail_image_url` 에 해당      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 프로필 정보(닉네임/프로필 사진) 또는 프로필 사진 | X |
| email | `String` | 카카오계정 대표 이메일   [사용자 정보 조회](https://developers.kakao.com/docs/latest/ko/kakaologin/#req-user-info) 의 `kakao_account.email` 에 해당      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 카카오계정(이메일)   **중요**: ID 토큰 페이로드의 이메일은 유효하고 인증된 이메일 값이 있는 경우에만 제공, [이메일 사용 시 주의 사항](https://developers.kakao.com/docs/latest/ko/kakaologin/common#policy-user-info-email) 참고 | X |

#### 예제

##### 요청

\`\`\`bash
curl -v -X POST "https://kauth.kakao.com/oauth/token" \
    -H "Content-Type: application/x-www-form-urlencoded;charset=utf-8" \
    -d "grant_type=authorization_code" \
    -d "client_id=${REST_API_KEY}" \
    --data-urlencode "redirect_uri=${REDIRECT_URI}" \
    -d "code=${AUTHORIZE_CODE}"
\`\`\`

##### 응답: 성공

\`\`\`json
HTTP/1.1 200
Content-Type: application/json;charset=UTF-8
{
    "token_type":"bearer",
    "access_token":"${ACCESS_TOKEN}",
    "expires_in":43199,
    "refresh_token":"${REFRESH_TOKEN}",
    "refresh_token_expires_in":5184000,
    "scope":"account_email profile"
}
\`\`\`

##### 응답: 성공, OpenID Connect를 활성화한 앱, ID 토큰 포함

\`\`\`json
HTTP/1.1 200
{
    "token_type": "bearer",
    "access_token": "${ACCESS_TOKEN}",
    "id_token": "${ID_TOKEN}",
    "expires_in": 7199,
    "refresh_token": "${REFRESH_TOKEN}",
    "refresh_token_expires_in": 86399,
    "scope": "profile_image openid profile_nickname"
}
\`\`\`

##### 응답: ID 토큰 페이로드 예시

\`\`\`json
{
  "aud": "${APP_KEY}",
  "sub": "${USER_ID}",
  "auth_time": 1661967952,
  "iss": "https://kauth.kakao.com",
  "exp": 1661967972,
  "iat": 1661967952,
  "nickname": "JordyTest",
  "picture": "http://yyy.kakao.com/.../img_110x110.jpg",
  "email": "jordy@kakao.com"
}
\`\`\`

### 추가 기능

[인가 코드 요청](https://developers.kakao.com/docs/latest/ko/kakaologin/#request-code) 시 사용할 수 있는 추가 기능은 아래와 같습니다.

- [동의항목 추가 동의 요청](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-code-additional-consent)
- [카카오톡에서 자동 로그인](https://developers.kakao.com/docs/latest/ko/kakaologin/#request-code-auto-login)
- [서비스 약관 선택해 동의 요청](https://developers.kakao.com/docs/latest/ko/kakaologin/#request-code-terms)
- [기존 로그인 여부와 상관없이 로그인](https://developers.kakao.com/docs/latest/ko/kakaologin/#request-code-re-authentication)
- [카카오계정 가입 후 로그인](https://developers.kakao.com/docs/latest/ko/kakaologin/#request-code-prompt-create)
- [로그인 힌트](https://developers.kakao.com/docs/latest/ko/kakaologin/#request-code-login-hint)
- [카카오계정 간편로그인](https://developers.kakao.com/docs/latest/ko/kakaologin/#request-code-prompt-select-account)

##### 동의항목 추가 동의 요청

[동의항목 추가 동의 요청](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#additional-consent) 은 사용자가 동의하지 않은 동의항목에 대한 추가 동의를 요청하는 추가 기능입니다. 인가 코드 요청 시 `scope` 파라미터로 추가 동의받을 항목의 ID 목록을 지정합니다. 응답으로 받은 인가 코드로 [토큰 요청 API](https://developers.kakao.com/docs/latest/ko/kakaologin/#request-token) 를 호출해 카카오 로그인을 완료한 뒤, 이후 새로 발급받은 토큰을 사용해야 합니다. 아래는 `scope` 에 이메일, 성별의 추가 동의를 요청하는 예제입니다.

\`\`\`bash
https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=account_email,gender
\`\`\`

**주의: OpenID Connect**

OpenID Connect를 사용하는 앱의 경우, 동의항목 추가 동의 요청 시 동의항목 키를 전달하는 scope 파라미터 값에 openid를 반드시 포함해야 합니다. 해당 파라미터 값을 포함하지 않을 경우, ID 토큰이 재발급되지 않습니다. (참고: [인가 코드 요청 API의 scope 파라미터](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#additional-consent-scope))

  

##### 카카오톡에서 자동 로그인

카카오톡에서 자동 로그인은 카카오톡 인앱브라우저에서 서비스 페이지 진입 시 서비스 가입 여부에 따른 분기 처리를 지원하는 추가 기능입니다. [활용하기](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#login-auto) 에서 자세한 안내를 확인한 후 사용해야 합니다. 인가 코드 요청 시 `prompt` 파라미터 값을 `none` 으로 지정합니다.

\`\`\`bash
https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&prompt=none
\`\`\`

서비스 가입을 완료하지 않아 아직 앱과 연결되지 않은 사용자인 경우, 아래와 같이 사용자 동의가 필요하다는 에러 응답이 `redirect_uri` 로 전달됩니다. 이 경우, 사용자가 직접 서비스 페이지에서 카카오 로그인 및 서비스 가입을 해야 합니다.

\`\`\`
HTTP/1.1 302
Content-Length: 0
Location: ${REDIRECT_URI}?error=consent_required&error_description=user%20consent%20required.
\`\`\`
  

##### 서비스 약관 선택해 동의 요청

**카카오싱크 전용**

[카카오싱크](https://developers.kakao.com/docs/latest/ko/kakaosync/common) 를 도입한 서비스만 사용할 수 있는 기능입니다.

서비스 약관 선택해 동의 요청은 카카오 로그인 동의 화면에 포함할 서비스 약관을 지정하는 추가 기능입니다. 사용자의 서비스 가입 시나리오에 따라 앱에 등록된 서비스 약관 중 특정 서비스 약관을 지정해 동의받고자 할 때 사용합니다. 인가 코드 요청 시 `service_terms` 파라미터로 동의 화면에 포함할 서비스 약관 태그 목록을 지정합니다. 요청 시 \[필수 동의\]로 설정된 서비스 약관을 하나 이상 포함해야 동의 화면을 출력하고 사용자에게 동의받을 수 있습니다.

\`\`\`bash
https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&service_terms=${TAG1,TAG2,TAG3}
\`\`\`
  

##### OpenID Connect ID 토큰 발급

[OpenID Connect](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#oidc) 사용 서비스인 경우, [OpenID Connect 사용 설정](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#kakao-login-oidc) 이 되어 있다면 별도 파라미터 없이도 ID 토큰을 함께 발급받을 수 있습니다. OpenID Connect 사용 시 ID 토큰 재생 공격을 방지하기 위해 `nonce` 파라미터 사용을 권장합니다. 단, [동의항목 추가 동의 요청](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-code-additional-consent) 시에는 `scope` 파라미터에 `openid` 를 포함해야 ID 토큰 재발급이 가능합니다. (참고: [인가 코드 요청 API의 scope 파라미터](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#additional-consent-scope))

\`\`\`bash
https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&nonce=${NONCE}
\`\`\`
  

##### 기존 로그인 여부와 상관없이 로그인

기존 로그인 여부와 상관없이 로그인은 서비스의 필요에 따라 사용자 인증을 다시 수행하고자 할 때 사용하는 추가 기능입니다. 이 기능을 사용하면 사용자가 브라우저에 카카오계정으로 로그인되어 있는 상태라도 다시 카카오계정으로 로그인하는 과정을 거쳐 서비스에 카카오 로그인하도록 할 수 있습니다. 인가 코드 요청 시 `prompt` 파라미터 값을 `login` 으로 지정합니다.

\`\`\`bash
https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&prompt=login
\`\`\`
  

##### 카카오계정 가입 후 로그인

사용자에게 카카오계정 신규 가입 후 로그인하도록 하기 위해 사용하는 추가 기능입니다. 이 기능을 사용하면 [카카오계정 가입 페이지](https://accounts.kakao.com/weblogin/create_account) 로 이동 후, 카카오계정 가입 완료 후에 동의 화면을 출력합니다. `prompt` 파라미터의 값을 `create` 로 지정해 카카오 로그인을 요청합니다.

\`\`\`bash
https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&prompt=create
\`\`\`
  

##### 로그인 힌트

인가 코드 요청 시 `login_hint` 파라미터를 사용하면, 해당 파라미터 값이 ID란에 자동 입력된 카카오계정 로그인 화면을 호출합니다.

\`\`\`bash
https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&login_hint=${HINT}
\`\`\`
  

##### 카카오톡에서 자동 로그인, 로그인 힌트 함께 사용

\`\`\`bash
https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&prompt=none&login_hint=${HINT}
\`\`\`
  

##### 카카오계정 간편로그인

[카카오계정 간편로그인](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#login-simple) 을 사용하려면 `prompt` 파라미터의 값을 `select_account` 로 지정해 카카오 로그인을 요청합니다.

\`\`\`
https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&prompt=select_account
\`\`\`

## 로그아웃

##### 기본 정보

| 메서드 | URL | 인증 방식 |
| --- | --- | --- |
| `POST` | `https://kapi.kakao.com/v1/user/logout` | 액세스 토큰   서비스 앱 어드민 키 |

| [권한](https://developers.kakao.com/docs/latest/ko/getting-started/permission) | 사전 설정 | [카카오 로그인](https://developers.kakao.com/docs/latest/ko/kakaologin/common) | [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#scope) |
| --- | --- | --- | --- |
| \- | [플랫폼 등록](https://developers.kakao.com/docs/latest/ko/app-setting/app#platform)   [카카오 로그인 활성화](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#kakao-login-activate) | 필요 | \- |

  

사용자가 서비스에서 자신의 로그인 세션을 안전하게 종료할 수 있도록 카카오 로그인을 통해 해당 서비스에 발급되었던 사용자의 액세스 토큰과 리프레시 토큰을 모두 폐기합니다.

토큰이 폐기되면, 더 이상 해당 카카오 로그인 사용자의 정보로 카카오 API를 호출할 수 없습니다. 로그아웃은 요청 방법에 따라 아래와 같이 동작합니다.

- 액세스 토큰으로 요청
	- 해당 액세스 토큰만 폐기
	- 폐기된 액세스 토큰을 사용하는 모든 기기에서 로그아웃됨
- 서비스 앱 어드민 키로 요청
	- 해당 사용자의 모든 토큰 폐기
	- 모든 기기에서 로그아웃됨

로그아웃 요청 성공 시, 응답 코드와 로그아웃된 사용자의 회원번호를 받습니다. 로그아웃 시에도 웹 브라우저의 카카오계정 세션은 만료되지 않고, 로그아웃을 호출한 앱의 토큰만 만료됩니다. 따라서 웹 브라우저의 카카오계정 로그인 상태는 로그아웃을 호출해도 유지됩니다. 로그아웃 후에는 서비스 초기 화면으로 리다이렉트하는 등 후속 조치를 취하도록 합니다.

##### 참고: 카카오계정 로그아웃

서비스에서 필요에 따라 웹 브라우저의 카카오계정 로그인 상태 또한 로그아웃 처리해야 할 때는 추가 기능인 [카카오계정과 함께 로그아웃](https://developers.kakao.com/docs/latest/ko/kakaologin/#logout-of-service-and-kakaoaccount) 을 사용해 카카오계정 세션을 만료시켜야 합니다.

#### 요청: 액세스 토큰 방식

##### 헤더

| 이름 | 설명 | 필수 |
| --- | --- | --- |
| Authorization | 사용자 인증 수단, 액세스 토큰 값   `Authorization: Bearer ${ACCESS_TOKEN}` | O |

#### 요청: 서비스 앱 어드민 키 방식

##### 헤더

| 이름 | 설명 | 필수 |
| --- | --- | --- |
| Authorization | 사용자 인증 수단, 앱 어드민 키   `Authorization: KakaoAK ${SERVICE_APP_ADMIN_KEY}` | O |
| Content-Type | `Content-Type: application/x-www-form-urlencoded;charset=utf-8`   요청 데이터 타입 | O |

##### 본문

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| target\_id\_type | `String` | 회원번호 종류, `user_id` 로 고정 | O |
| target\_id | `Long` | 서비스에서 로그아웃시킬 사용자의 회원번호 | O |

#### 응답

##### 본문

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| id | `Long` | 로그아웃된 사용자의 회원번호 | O |

#### 예제

##### 요청: 액세스 토큰 방식

\`\`\`bash
curl -v -X POST "https://kapi.kakao.com/v1/user/logout" \
    -H "Content-Type: application/x-www-form-urlencoded;charset=utf-8" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}"
\`\`\`

##### 요청: 서비스 앱 어드민 키 방식

\`\`\`bash
curl -v -X POST "https://kapi.kakao.com/v1/user/logout" \
    -H "Content-Type: application/x-www-form-urlencoded;charset=utf-8" \
    -H "Authorization: KakaoAK ${SERVICE_APP_ADMIN_KEY}" \
    -d "target_id_type=user_id" \
    -d "target_id=123456789"
\`\`\`

##### 응답

\`\`\`json
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
{
    "id":123456789
}
\`\`\`

## 카카오계정과 함께 로그아웃

##### 기본 정보

| 메서드 | URL | 인증 방식 |
| --- | --- | --- |
| `GET` | `https://kauth.kakao.com/oauth/logout` | \- |

| [권한](https://developers.kakao.com/docs/latest/ko/getting-started/permission) | 사전 설정 | [카카오 로그인](https://developers.kakao.com/docs/latest/ko/kakaologin/common) | [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#scope) |
| --- | --- | --- | --- |
| \- | [플랫폼 등록](https://developers.kakao.com/docs/latest/ko/app-setting/app#platform)   [카카오 로그인 활성화](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#kakao-login-activate)   [로그아웃 리다이렉트 URI 등록](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#logout-redirect-uri) | 필요 | \- |

  

카카오계정과 함께 로그아웃은 웹 브라우저에 로그인된 카카오계정의 세션을 만료시키고, 서비스에서도 로그아웃 처리할 때 사용하는 로그아웃 추가 기능입니다. 카카오계정과 함께 로그아웃 기능의 설명과 동작에 대한 자세한 내용은 [이해하기](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#logout-with-kakao-account), 설정 방법은 [설정하기](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#logout-redirect-uri) 를 각각 참고합니다.

기본적인 [로그아웃](https://developers.kakao.com/docs/latest/ko/kakaologin/#logout) 은 토큰을 폐기해 해당 사용자 정보로 더 이상 카카오 API를 호출할 수 없도록 하는 기능으로, 서비스 로그아웃과 카카오계정 로그아웃을 각각 수행해야 합니다. 이와 달리 카카오계정과 함께 로그아웃 기능은 카카오계정 로그아웃 처리 후 `logout_redirect_uri` 로 302 리다이렉트(Redirect)하여 서비스 로그아웃까지 연속해서 수행할 수 있도록 구성돼 있습니다.

기능 동작이 다르기 때문에 기본적인 로그아웃과 카카오계정과 함께 로그아웃은 요청 URL 및 파라미터가 서로 다른 점에 유의합니다. 앱의 REST API 키를 `client_id`, 서비스 로그아웃 처리를 하는 서비스 서버의 주소를 `logout_redirect_uri` 파라미터에 담아 `GET` 으로 요청합니다. 로그아웃 과정 중 유지하고자 하는 특정 값이 있다면 `state` 파라미터에 담아 요청 시 함께 전달할 수 있습니다.

서비스 서버의 `logout_redirect_uri` 로 전달된 서비스 로그아웃 요청에 대한 처리는 자체적으로 구현해야 합니다. 카카오 인증 서버는 서비스 로그아웃 처리 결과를 전달받지 않습니다.

#### 요청

##### 쿼리 파라미터

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| client\_id | `String` | 앱 REST API 키   [앱 관리 페이지](https://developers.kakao.com/console/app) 의 \[앱\] > \[일반\] > \[앱 키\]에서 확인 가능 | O |
| logout\_redirect\_uri | `String` | 서비스 회원 로그아웃 처리를 수행할 로그아웃 리다이렉트 URI   [앱 관리 페이지](https://developers.kakao.com/console/app) 의 \[카카오 로그인\] > \[로그아웃 리다이렉트 URI\]에 등록된 값 중 하나 | O |
| state | `String` | 카카오 로그인 과정 중 동일한 값을 유지하는 임의의 문자열(정해진 형식 없음)   [Cross-Site Request Forgery(CSRF)](https://en.wikipedia.org/wiki/Cross-site_request_forgery) 공격으로부터 카카오 로그인 요청을 보호하기 위해 사용   각 사용자의 로그인 요청에 대한 `state` 값은 고유해야 함   인가 코드 요청, 인가 코드 응답, 토큰 발급 요청의 `state` 값 일치 여부로 요청 및 응답 유효성 확인 가능 | X |

#### 응답

인가 코드 요청의 응답은 HTTP 302 리다이렉트되어, `redirect_uri` 에 `GET` 요청으로 전달됩니다. 아래 쿼리 파라미터를 포함합니다.

##### 쿼리 파라미터

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| state | `String` | 요청 시 전달한 `state` 값과 동일한 값 | X |

#### 예제

##### 요청

\`\`\`bash
curl -v -G GET "https://kauth.kakao.com/oauth/logout?client_id=${YOUR_REST_API_KEY}&logout_redirect_uri=${YOUR_LOGOUT_REDIRECT_URI}"
\`\`\`

##### 응답

\`\`\`
HTTP/1.1 302
Location: ${LOGOUT_REDIRECT_URI}?state=${STATE}
\`\`\`

## 연결 해제

##### 기본 정보

| 메서드 | URL | 인증 방식 |
| --- | --- | --- |
| `POST` | `https://kapi.kakao.com/v1/user/unlink` | 액세스 토큰   서비스 앱 어드민 키 |

| [권한](https://developers.kakao.com/docs/latest/ko/getting-started/permission) | 사전 설정 | [카카오 로그인](https://developers.kakao.com/docs/latest/ko/kakaologin/common) | [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#scope) |
| --- | --- | --- | --- |
| \- | [플랫폼 등록](https://developers.kakao.com/docs/latest/ko/app-setting/app#platform)   [카카오 로그인 활성화](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#kakao-login-activate) | 필요 | \- |

  

연결 해제는 사용자의 동의를 철회하고, 발급한 액세스 토큰과 리프레시 토큰을 폐기(Token revocation)합니다. 자세한 설명은 [연결 해제](https://developers.kakao.com/docs/latest/ko/kakaologin/common#unlink) 를 참고합니다.

REST API 사용 시 연결 해제는 사용자의 액세스 토큰 또는 앱 어드민 키(Admin key)로 API를 호출할 수 있습니다. 서비스 종료 등 상황에 따라 토큰으로 연결 해제를 요청할 수 없는 경우가 있기 때문에 앱 어드민 키를 사용한 요청을 지원합니다.

하지만 앱 어드민 키는 절대로 유출되어선 안 되는 중요한 키입니다. 정보 보안을 위해 어드민 키를 사용한 REST API 요청은 꼭 서버에서만 사용하고, 소스 코드에는 어드민 키를 사용하지 않도록 유의합니다. 어드민 키를 사용해 연결 해제를 할 경우, 대상 사용자를 명시하는 파라미터를 함께 보내야 합니다.

연결 해제 요청에 성공하면 해당 사용자 회원번호를 응답으로 받습니다.

#### 요청: 액세스 토큰 방식

##### 헤더

| 이름 | 설명 | 필수 |
| --- | --- | --- |
| Authorization | 사용자 인증 수단, 액세스 토큰 값   `Authorization: Bearer ${ACCESS_TOKEN}` | O |

#### 요청: 서비스 앱 어드민 키 방식

##### 헤더

| 이름 | 설명 | 필수 |
| --- | --- | --- |
| Authorization | 사용자 인증 수단, 앱 어드민 키   `Authorization: KakaoAK ${SERVICE_APP_ADMIN_KEY}` | O |
| Content-Type | `Content-Type: application/x-www-form-urlencoded;charset=utf-8`   요청 데이터 타입 | O |

##### 본문

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| target\_id\_type | `String` | 회원번호 종류, `user_id` 로 고정 | O |
| target\_id | `Long` | 연결을 끊을 사용자의 회원번호 | O |

#### 응답

##### 본문

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| id | `Long` | 연결 해제에 성공한 사용자의 회원번호 | O |

#### 예제

##### 요청: 액세스 토큰 방식

\`\`\`bash
curl -v -X POST "https://kapi.kakao.com/v1/user/unlink" \
    -H "Content-Type: application/x-www-form-urlencoded;charset=utf-8" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}"
\`\`\`

##### 요청: 서비스 앱 어드민 키 방식

\`\`\`bash
curl -v -X POST "https://kapi.kakao.com/v1/user/unlink" \
    -H "Content-Type: application/x-www-form-urlencoded;charset=utf-8" \
    -H "Authorization: KakaoAK ${SERVICE_APP_ADMIN_KEY}" \
    -d "target_id_type=user_id" \
    -d "target_id=123456789"
\`\`\`

##### 응답

\`\`\`json
{
  "id": 123456789
}
\`\`\`

## 액세스 토큰 정보 조회

##### 기본 정보

| 메서드 | URL | 인증 방식 |
| --- | --- | --- |
| `GET` | `https://kapi.kakao.com/v1/user/access_token_info` | 액세스 토큰 |

| [권한](https://developers.kakao.com/docs/latest/ko/getting-started/permission) | 사전 설정 | [카카오 로그인](https://developers.kakao.com/docs/latest/ko/kakaologin/common) | [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#scope) |
| --- | --- | --- | --- |
| \- | [플랫폼 등록](https://developers.kakao.com/docs/latest/ko/app-setting/app#platform)   [카카오 로그인 활성화](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#kakao-login-activate) | 필요 | \- |

  

액세스 토큰의 유효성을 검증하거나 정보를 확인합니다. 토큰 만료 여부나 유효기간을 알 수 있어 갱신 과정에 활용할 수 있습니다. 액세스 토큰을 요청 헤더(Header)에 담아 `GET` 으로 요청합니다.

응답은 `JSON` 객체로 토큰 상세 정보를 받습니다. 에러 발생 시 [에러 코드](https://developers.kakao.com/docs/latest/ko/rest-api/error-code) 및 아래 내용을 참고합니다.

| 코드 | 설명 | HTTP Status |
| --- | --- | --- |
| \-1 | 카카오 플랫폼 서비스의 일시적 내부 장애 상태   토큰을 강제 만료(폐기) 또는 로그아웃 처리하지 않고 일시적인 장애 메시지로 처리 권장 | 400 |
| \-2 | 필수 인자가 포함되지 않은 경우나 호출 인자값의 데이터 타입이 적절하지 않거나 허용된 범위를 벗어난 경우   요청 시 주어진 액세스 토큰 정보가 잘못된 형식인 경우로 올바른 형식으로 요청했는지 확인 | 400 |
| \-401 | 유효하지 않은 앱키나 액세스 토큰으로 요청한 경우   토큰 값이 잘못되었거나 만료되어 유효하지 않은 경우로 토큰 갱신 필요 | 401 |

이 외 에러는 앱이나 사용자, 토큰 등의 상태가 더 이상 유효하지 않아 쓸 수 없는 경우로 로그아웃 처리를 권장합니다.

#### 요청

##### 헤더

| 이름 | 설명 | 필수 |
| --- | --- | --- |
| Authorization | `Authorization: Bearer ${ACCESS_TOKEN}`   인증 방식, 액세스 토큰으로 인증 요청 | O |

#### 응답

##### 본문

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| id | `Long` | 회원번호 | O |
| expires\_in | `Integer` | 액세스 토큰 만료 시간(초) | O |
| app\_id | `Integer` | 토큰이 발급된 앱 ID | O |

\* appId: Deprecated, app\_id를 사용하도록 변경

\* expiresInMillis: Deprecated, expires\_in을 사용하도록 변경

#### 예제

##### 요청

\`\`\`bash
curl -v -G GET "https://kapi.kakao.com/v1/user/access_token_info" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}"
\`\`\`

##### 응답

\`\`\`json
HTTP/1.1 200 OK
{
    "id":123456789,
    "expires_in": 7199,
    "app_id":1234
}
\`\`\`

## 토큰 갱신

##### 기본 정보

| 메서드 | URL | 인증 방식 |
| --- | --- | --- |
| `POST` | `https://kauth.kakao.com/oauth/token` | \- |

| [권한](https://developers.kakao.com/docs/latest/ko/getting-started/permission) | 사전 설정 | [카카오 로그인](https://developers.kakao.com/docs/latest/ko/kakaologin/common) | [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#scope) |
| --- | --- | --- | --- |
| \- | [플랫폼 등록](https://developers.kakao.com/docs/latest/ko/app-setting/app#platform)   [카카오 로그인 활성화](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#kakao-login-activate) | 필요 | \- |

  

액세스 토큰과 리프레시 토큰을 갱신합니다. JavaScript SDK 사용 시에도 보안 정책으로 인해 REST API로 액세스 토큰을 갱신합니다. 리프레시 토큰 값과 필수 파라미터를 담아 `POST` 로 요청합니다.

응답은 [토큰 요청](https://developers.kakao.com/docs/latest/ko/kakaologin/#request-token) 과 마찬가지로 `JSON` 객체로 전달됩니다. 응답 중 `refresh_token` 값은 요청 시 사용된 리프레시 토큰의 만료 시간이 1개월 미만으로 남았을 때만 갱신되어 전달됩니다. 따라서 `refresh_token` 과 `refresh_token_expires_in` 은 결과 값에 포함되지 않을 수 있다는 점을 응답 처리 시 유의해야 합니다.

##### 참고: ID 토큰 갱신

[OpenID Connect](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#oidc) 로 [ID 토큰](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#oidc-id-token) 과 함께 발급된 리프레시 토큰으로 토큰 갱신을 요청한 경우, 액세스 토큰과 ID 토큰이 함께 갱신되어 응답에 포함됩니다. OpenID Connect를 사용하지 않는 앱의 토큰 갱신 시에는 ID 토큰이 응답에 포함되지 않습니다.

**주의: 토큰 발급 요청 수 제한**

[요청 수 제한](https://developers.kakao.com/docs/latest/ko/getting-started/quota#rate-limit) 을 초과한 토큰 발급을 요청한 경우 `KOE237` 에러가 발생합니다. 자세한 내용과 해결 방법은 [문제 해결](https://developers.kakao.com/docs/latest/ko/kakaologin/trouble-shooting#token) 을 참고합니다.

#### 요청

##### 헤더

| 이름 | 설명 | 필수 |
| --- | --- | --- |
| Content-Type | `Content-Type: application/x-www-form-urlencoded;charset=utf-8`   요청 데이터 타입 | O |

##### 본문

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| grant\_type | `String` | `refresh_token` 으로 고정 | O |
| client\_id | `String` | 앱 REST API 키   [앱 관리 페이지](https://developers.kakao.com/console/app) 의 \[앱\] > \[일반\] > \[앱 키\]에서 확인 가능 | O |
| refresh\_token | `String` | 토큰 발급 시 응답으로 받은 refresh\_token   액세스 토큰을 갱신하기 위해 사용 | O |
| client\_secret | `String` | 토큰 발급 시, 보안을 강화하기 위해 추가 확인하는 코드   [앱 관리 페이지](https://developers.kakao.com/console/app) 의 \[카카오 로그인\] > \[보안\]에서 설정 가능   ON 상태인 경우 필수 설정해야 함 | X |

#### 응답

##### 본문

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| token\_type | `String` | 토큰 타입, `bearer` 로 고정 | O |
| access\_token | `String` | 갱신된 사용자 액세스 토큰 값 | O |
| id\_token | `String` | 갱신된 [ID 토큰](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#oidc-id-token) 값      **제공 조건**: ID 토큰과 함께 발급된 리프레시 토큰으로 토큰 갱신을 요청한 경우 | X |
| expires\_in | `Integer` | 액세스 토큰 만료 시간(초) | O |
| refresh\_token | `String` | 갱신된 사용자 리프레시 토큰 값, 기존 리프레시 토큰의 유효기간이 1개월 미만인 경우에만 갱신 | X |
| refresh\_token\_expires\_in | `Integer` | 리프레시 토큰 만료 시간(초) | X |

#### 예제

##### 요청

\`\`\`bash
curl -v -X POST "https://kauth.kakao.com/oauth/token" \
    -H "Content-Type: application/x-www-form-urlencoded;charset=utf-8" \
    -d "grant_type=refresh_token" \
    -d "client_id=${REST_API_KEY}" \
    -d "refresh_token=${USER_REFRESH_TOKEN}"
\`\`\`

##### 응답

\`\`\`json
HTTP/1.1 200
Content-Type: application/json;charset=UTF-8
{
    "access_token":"${ACCESS_TOKEN}",
    "token_type":"bearer",
    "refresh_token":"${REFRESH_TOKEN}",  //optional
    "refresh_token_expires_in":5184000,  //optional
    "expires_in":43199,
}
\`\`\`

## 사용자 정보 조회

##### 기본 정보

| 메서드 | URL | 인증 방식 |
| --- | --- | --- |
| `GET/POST` | `https://kapi.kakao.com/v2/user/me` | 액세스 토큰   서비스 앱 어드민 키 |

| [권한](https://developers.kakao.com/docs/latest/ko/getting-started/permission) | 사전 설정 | [카카오 로그인](https://developers.kakao.com/docs/latest/ko/kakaologin/common) | [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#scope) |
| --- | --- | --- | --- |
| \- | [플랫폼 등록](https://developers.kakao.com/docs/latest/ko/app-setting/app#platform)   [카카오 로그인 활성화](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#kakao-login-activate)   [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope) | 필요 | 필요:   사용자 정보를 요청할 모든 동의항목 |

  

현재 로그인한 사용자의 정보를 불러옵니다. 이 API를 사용하려면 [동의항목 설정](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope) 을 참고하여 각 응답 필드에 필요한 동의항목을 설정해야 합니다. 동의항목이 설정되어 있더라도 사용자가 [동의](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#scope-user-consent) 하지 않으면 사용자 정보를 받을 수 없습니다. [동의항목 동의 내역 조회](https://developers.kakao.com/docs/latest/ko/kakaologin/#check-consent) API로 사용자가 동의한 동의항목을 먼저 확인할 수 있습니다.

사용자 액세스 토큰 또는 어드민 키를 헤더(Header)에 담아 `GET` 또는 `POST` 로 요청합니다. 사용자 정보 요청 REST API는 사용자 액세스 토큰을 사용하는 방법, 앱 어드민 키를 사용하는 방법 두 가지로 제공됩니다. 어드민 키는 보안에 유의하여 사용해야 하므로 서버에서 호출할 때만 사용합니다.

`property_keys` 파라미터를 사용하면 특정 정보만 지정해 요청할 수 있습니다. `secure_resource` 파라미터로는 URL 응답 값을 `HTTPS` 로 받을지 지정할 수 있습니다. 어드민 키로 요청할 때는 어떤 사용자의 정보가 필요한지 명시하기 위해 `target_id` 및 `target_id_type` 파라미터로 대상 사용자의 회원번호를 함께 전달합니다.

사용자 정보에는 [앱 관리 페이지](https://developers.kakao.com/console/app) 의 \[카카오 로그인\] > \[사용자 프로퍼티\] 메뉴에서 설정한 [사용자 프로퍼티](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#user-properties) 가 포함됩니다.

사용자 정보 요청 성공 시, 응답 본문은 [사용자 정보](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#user-info) 를 포함한 `JSON` 객체를 반환합니다.

#### 요청: 액세스 토큰 방식

##### 헤더

| 이름 | 설명 | 필수 |
| --- | --- | --- |
| Authorization | `Authorization: Bearer ${ACCESS_TOKEN}`   인증 방식, 액세스 토큰으로 인증 요청 | O |
| Content-Type | `Content-Type: application/x-www-form-urlencoded;charset=utf-8`   요청 데이터 타입 | O |

##### 쿼리 파라미터

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| secure\_resource | `Boolean` | 이미지 URL 값 HTTPS 여부, true 설정 시 HTTPS 사용, 기본 값 false | X |
| property\_keys | [`PropertyKeys[]`](https://developers.kakao.com/docs/latest/ko/kakaologin/#propertykeys) | Property 키 목록, JSON Array를 \["kakao\_account.email"\]과 같은 형식으로 사용 | X |

##### PropertyKeys

| 이름 | 설명 |
| --- | --- |
| kakao\_account.profile | 카카오계정의 프로필 소유 여부   실시간 닉네임과 프로필 사진 URL |
| kakao\_account.name | 카카오계정의 이름 소유 여부, 이름 값 |
| kakao\_account.email | 카카오계정의 이메일 소유 여부   이메일 값, 이메일 인증 여부, 이메일 유효 여부 |
| kakao\_account.age\_range | 카카오계정의 연령대 소유 여부, 연령대 값 |
| kakao\_account.birthday | 카카오계정의 생일 소유 여부, 생일 값 |
| kakao\_account.gender | 카카오계정의 성별 소유 여부, 성별 값 |

\* properties.nickname, properties.profile\_image, properties.thumbnail\_image: Deprecated, [공지](https://devtalk.kakao.com/t/122565) 참고

#### 요청: 서비스 앱 어드민 키 방식

##### 헤더

| 이름 | 설명 | 필수 |
| --- | --- | --- |
| Authorization | `Authorization: KakaoAK ${SERVICE_APP_ADMIN_KEY}`   인증 방식, 서비스 앱 어드민 키로 인증 요청 | O |
| Content-Type | `Content-Type: application/x-www-form-urlencoded;charset=utf-8`   요청 데이터 타입 | O |

##### 쿼리 파라미터

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| target\_id\_type | `String` | 회원번호 종류, `user_id` 로 고정 | O |
| target\_id | `Long` | 사용자 정보를 가져올 사용자의 회원번호 | O |
| secure\_resource | `Boolean` | 이미지 URL 값 HTTPS 여부, true 설정 시 HTTPS 사용, 기본 값 false | X |
| property\_keys | [`PropertyKeys[]`](https://developers.kakao.com/docs/latest/ko/kakaologin/#propertykeys) | Property 키 목록, JSON Array를 \["kakao\_account.email"\]과 같은 형식으로 사용 | X |

#### 응답

##### 본문

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| id | `Long` | 회원번호 | O |
| has\_signed\_up | `Boolean` | 자동 연결 설정을 비활성화한 경우만 존재   수동 연결 API의 호출 완료 여부   `false`: 연결 대기(Preregistered) 상태   `true`: 연결(Registered) 상태 | X |
| connected\_at | `Datetime` | 서비스에 연결 완료된 시각, UTC\* | X |
| synched\_at | `Datetime` | 카카오싱크 간편가입으로 로그인한 시각, UTC\* | X |
| properties | `JSON` | 사용자 프로퍼티(Property)   [사용자 프로퍼티](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#user-properties) 참고 | X |
| kakao\_account | [`KakaoAccount`](https://developers.kakao.com/docs/latest/ko/kakaologin/#kakaoaccount) | 카카오계정 정보 | X |
| for\_partner | [`Partner`](https://developers.kakao.com/docs/latest/ko/kakaologin/#req-user-info-response-body-partner) | `uuid` 등 추가 정보 | X |

\* [UTC](https://ko.wikipedia.org/wiki/%ED%98%91%EC%A0%95_%EC%84%B8%EA%B3%84%EC%8B%9C): 한국 시간(KST)과 9시간 차이, [RFC3339: Date and Time on the Internet](https://tools.ietf.org/html/rfc3339) 참고

##### KakaoAccount

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| profile\_needs\_agreement | `Boolean` | 사용자 동의 시 프로필 정보(닉네임/프로필 사진) 제공 가능      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 프로필 정보(닉네임/프로필 사진) | X |
| profile\_nickname\_needs\_agreement | `Boolean` | 사용자 동의 시 닉네임 제공 가능      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 닉네임 | X |
| profile\_image\_needs\_agreement | `Boolean` | 사용자 동의 시 프로필 사진 제공 가능      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 프로필 사진 | X |
| profile | [`Profile`](https://developers.kakao.com/docs/latest/ko/kakaologin/#profile) | 프로필 정보      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 프로필 정보(닉네임/프로필 사진), 닉네임, 프로필 사진 | X |
| name\_needs\_agreement | `Boolean` | 사용자 동의 시 카카오계정 이름 제공 가능      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 이름 | X |
| name | `String` | 카카오계정 이름      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 이름 | X |
| email\_needs\_agreement | `Boolean` | 사용자 동의 시 카카오계정 대표 이메일 제공 가능      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 카카오계정(이메일) | X |
| is\_email\_valid | `Boolean` | 이메일 유효 여부   `true`: 유효한 이메일   `false`: 이메일이 다른 카카오계정에 사용돼 만료      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 카카오계정(이메일) | X |
| is\_email\_verified | `Boolean` | 이메일 인증 여부   `true`: 인증된 이메일   `false`: 인증되지 않은 이메일      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 카카오계정(이메일) | X |
| email | `String` | 카카오계정 대표 이메일      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 카카오계정(이메일)   **중요**: [이메일 사용 시 주의 사항](https://developers.kakao.com/docs/latest/ko/kakaologin/common#policy-user-info-email) | X |
| age\_range\_needs\_agreement | `Boolean` | 사용자 동의 시 연령대 제공 가능      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 연령대 | X |
| age\_range | `String` | 연령대   `1~9`: 1세 이상 10세 미만   `10~14`: 10세 이상 15세 미만   `15~19`: 15세 이상 20세 미만   `20~29`: 20세 이상 30세 미만   `30~39`: 30세 이상 40세 미만   `40~49`: 40세 이상 50세 미만   `50~59`: 50세 이상 60세 미만   `60~69`: 60세 이상 70세 미만   `70~79`: 70세 이상 80세 미만   `80~89`: 80세 이상 90세 미만   `90~`: 90세 이상      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 연령대 | X |
| birthyear\_needs\_agreement | `Boolean` | 사용자 동의 시 출생 연도 제공 가능      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 출생 연도 | X |
| birthyear | `String` | 출생 연도(`YYYY` 형식)      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 출생 연도 | X |
| birthday\_needs\_agreement | `Boolean` | 사용자 동의 시 생일 제공 가능      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 생일 | X |
| birthday | `String` | 생일(`MMDD` 형식)      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 생일 | X |
| birthday\_type | `String` | 생일 타입   `SOLAR` (양력) 또는 `LUNAR` (음력)      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 생일 | X |
| is\_leap\_month | `Boolean` | 생일의 윤달 여부      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 생일 | X |
| gender\_needs\_agreement | `Boolean` | 사용자 동의 시 성별 제공 가능      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 성별 | X |
| gender | `String` | 성별   `female`: 여성   `male`: 남성      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 성별 | X |
| phone\_number\_needs\_agreement | `Boolean` | 사용자 동의 시 전화번호 제공 가능      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 카카오계정(전화번호) | X |
| phone\_number | `String` | 카카오계정의 전화번호   국내 번호인 경우 `+82 00-0000-0000` 형식   해외 번호인 경우 자릿수, 붙임표(-) 유무나 위치가 다를 수 있음   (참고: [libphonenumber](https://github.com/google/libphonenumber))      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 카카오계정(전화번호) | X |
| ci\_needs\_agreement | `Boolean` | 사용자 동의 시 CI 참고 가능      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): CI(연계정보) | X |
| ci | `String` | 연계정보      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): CI(연계정보) | X |
| ci\_authenticated\_at | `Datetime` | CI 발급 시각, UTC\*      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): CI(연계정보) | X |

\* [UTC](https://ko.wikipedia.org/wiki/%ED%98%91%EC%A0%95_%EC%84%B8%EA%B3%84%EC%8B%9C): 한국 시간(KST)과 9시간 차이, [RFC3339: Date and Time on the Internet](https://tools.ietf.org/html/rfc3339) 참고

\* `has_${FIELD_NAME}`: Deprecated, 각 사용자 정보 값 소유 여부(Boolean), 해당 사용자 정보의 제공 가능 여부를 확인하는 용도로 사용할 수 없음, [사용자 동의 시 정보 제공 가능 여부](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#needs-agreement) 참고

**프로필 정보 동의항목 분리**

2021년 6월 25일부터 프로필 정보가 \[닉네임\]과 \[프로필 사진\]으로 분리되어 제공됩니다. 분리된 동의항목인 \[닉네임\]과 \[프로필 사진\] 동의항목을 각각 설정하여 서비스에 필요한 프로필 정보만 선택적으로 제공받을 수 있습니다. 기존 \[프로필(닉네임/프로필 사진)\] 동의항목을 사용 중인 앱에서는 기존과 같이 해당 동의항목으로 닉네임과 프로필 사진 정보를 모두 받을 수 있습니다. 기존 동의항목을 사용하던 앱에서 분리된 동의항목을 사용하려면 [데브톡](https://devtalk.kakao.com/t/topic/116264) 에서 변경을 요청합니다. 이 경우, 응답 구성이 변경될 수 있으므로 주의합니다. 자세한 사항은 [공지사항](https://devtalk.kakao.com/t/116209) 을 참고합니다.

##### Profile

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| nickname | `String` | 닉네임      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 프로필 정보(닉네임/프로필 사진) 또는 닉네임 | X |
| thumbnail\_image\_url | `String` | 프로필 미리보기 이미지 URL   110px \* 110px 또는 100px \* 100px      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 프로필 정보(닉네임/프로필 사진) 또는 프로필 사진 | X |
| profile\_image\_url | `String` | 프로필 사진 URL   640px \* 640px 또는 480px \* 480px      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 프로필 정보(닉네임/프로필 사진) 또는 프로필 사진 | X |
| is\_default\_image | `Boolean` | 프로필 사진 URL이 기본 프로필 사진 URL인지 여부   사용자가 등록한 프로필 사진이 없을 경우, 기본 프로필 사진 제공   `true`: 기본 프로필 사진   `false`: 사용자가 등록한 프로필 사진      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 프로필 정보(닉네임/프로필 사진) 또는 프로필 사진 | X |
| is\_default\_nickname | `Boolean` | 닉네임이 기본 닉네임인지 여부   사용자가 등록한 닉네임이 운영정책에 부합하지 않는 경우, "닉네임을 등록해주세요"가 기본 닉네임으로 적용됨   `true`: 기본 닉네임   `false`: 사용자가 등록한 닉네임      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 프로필 정보(닉네임/프로필 사진) 또는 닉네임 | X |

##### Partner

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| uuid | `String` | 고유 ID   [카카오톡 메시지](https://developers.kakao.com/docs/latest/ko/kakaotalk-message/common#kakaotalk) API 사용 권한이 있는 경우에만 제공      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 카카오톡 메시지 전송(talk\_message) | X |

#### 예제

##### 요청: 액세스 토큰 방식으로 모든 정보 조회

\`\`\`bash
curl -v -G GET "https://kapi.kakao.com/v2/user/me" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}"
\`\`\`

##### 요청: 액세스 토큰 방식으로 email 정보 조회

\`\`\`bash
curl -v -X POST "https://kapi.kakao.com/v2/user/me" \
    -H "Content-Type: application/x-www-form-urlencoded;charset=utf-8" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}" \
    --data-urlencode 'property_keys=["kakao_account.email"]'
\`\`\`

##### 요청: 서비스 앱 어드민 키 방식으로 email 정보 조회

\`\`\`bash
curl -v -X POST "https://kapi.kakao.com/v2/user/me" \
    -H "Content-Type: application/x-www-form-urlencoded;charset=utf-8" \
    -H "Authorization: KakaoAK ${SERVICE_APP_ADMIN_KEY}" \
    -d "target_id_type=user_id" \
    -d "target_id=123456789"  \
    --data-urlencode 'property_keys=["kakao_account.email"]'
\`\`\`

##### 응답: 성공, 모든 사용자 정보 포함

- 일부 사용자 정보의 동의항목은 설정 권한 필요, [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope) 참고
\`\`\`json
HTTP/1.1 200 OK
{
    "id":123456789,
    "connected_at": "2022-04-11T01:45:28Z",
    "kakao_account": { 
        // 프로필 또는 닉네임 동의항목 필요
        "profile_nickname_needs_agreement    ": false,
        // 프로필 또는 프로필 사진 동의항목 필요
        "profile_image_needs_agreement    ": false,
        "profile": {
            // 프로필 또는 닉네임 동의항목 필요
            "nickname": "홍길동",
            // 프로필 또는 프로필 사진 동의항목 필요
            "thumbnail_image_url": "http://yyy.kakao.com/.../img_110x110.jpg",
            "profile_image_url": "http://yyy.kakao.com/dn/.../img_640x640.jpg",
            "is_default_image":false,
            "is_default_nickname": false
        },
        // 이름 동의항목 필요
        "name_needs_agreement":false, 
        "name":"홍길동",
        // 카카오계정(이메일) 동의항목 필요
        "email_needs_agreement":false, 
        "is_email_valid": true,   
        "is_email_verified": true,
        "email": "sample@sample.com",
        // 연령대 동의항목 필요
        "age_range_needs_agreement":false,
        "age_range":"20~29",
        // 출생 연도 동의항목 필요
        "birthyear_needs_agreement": false,
        "birthyear": "2002",
        // 생일 동의항목 필요
        "birthday_needs_agreement":false,
        "birthday":"1130",
        "birthday_type":"SOLAR",
        "is_leap_month": false,
        // 성별 동의항목 필요
        "gender_needs_agreement":false,
        "gender":"female",
        // 카카오계정(전화번호) 동의항목 필요
        "phone_number_needs_agreement": false,
        "phone_number": "+82 010-1234-5678",   
        // CI(연계정보) 동의항목 필요
        "ci_needs_agreement": false,
        "ci": "${CI}",
        "ci_authenticated_at": "2019-03-11T11:25:22Z",
    },
    "properties":{
        "${CUSTOM_PROPERTY_KEY}": "${CUSTOM_PROPERTY_VALUE}",
        ...
    },
    "for_partner": {
        "uuid": "${UUID}"
    }
}
\`\`\`

##### 응답: 성공, 앱에 닉네임 동의항목만 설정하고 사용자에게 동의받은 경우

\`\`\`json
HTTP/1.1 200 OK
{
    "id":123456789,
    "connected_at": "2022-04-11T01:45:28Z",
    "kakao_account": { 
        "profile_nickname_needs_agreement": false,
        "profile": {
            "nickname": "홍길동"
        }
    },  
    "properties":{
        "${CUSTOM_PROPERTY_KEY}": "${CUSTOM_PROPERTY_VALUE}",
        ...
    }
}
\`\`\`

## 여러 사용자 정보 조회

##### 기본 정보

| 메서드 | URL | 인증 방식 |
| --- | --- | --- |
| `GET` | `https://kapi.kakao.com/v2/app/users` | 서비스 앱 어드민 키 |

| [권한](https://developers.kakao.com/docs/latest/ko/getting-started/permission) | 사전 설정 | [카카오 로그인](https://developers.kakao.com/docs/latest/ko/kakaologin/common) | [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#scope) |
| --- | --- | --- | --- |
| \- | [플랫폼 등록](https://developers.kakao.com/docs/latest/ko/app-setting/app#platform)   [카카오 로그인 활성화](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#kakao-login-activate)   [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope) | 필요 | 필요:   사용자 정보를 요청할 모든 동의항목 |

  

앱 사용자 여러 명의 정보를 불러옵니다. 이 API는 관리자를 위한 것으로, 앱 어드민 키를 사용하기 때문에 반드시 서버에서만 호출해야 합니다.

앱 어드민 키를 헤더에 담아 `GET` 으로 요청합니다. 정보를 요청할 사용자 목록을 `target_ids` 파라미터에 배열로 담아 전달해야 합니다.

응답은 요청 시 지정한 사용자 정보 목록을 포함합니다. 이 API의 기본 응답은 회원번호, 연결 시각과 같은 기본적인 정보만 포함합니다. `property_keys` 파라미터를 사용해 원하는 [사용자 정보](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#user-info) 를 추가 요청할 수 있습니다. 추가 요청할 사용자 정보는 앱에 [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope) 설정이 되어 있어야 합니다.

`property_keys` 파라미터 값은 요청할 사용자 정보와 사전 정의된 [사용자 프로퍼티](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#user-properties) 키(Key)의 문자열(String) 배열로 구성하여 아래와 같이 전달합니다.

\`\`\`bash
property_keys=["id","has_signed_up","kakao_account.email"]
\`\`\`

조회할 사용자 정보에 하위 항목이 존재하는 경우, 아래와 같이 상위 항목의 키에 온점(.)을 추가해 모든 하위 항목을 요청할 수 있습니다.

\`\`\`bash
property_keys=["kakao_account.","properties."]
\`\`\`

특정 하위 항목만 요청하려면, 아래와 같이 온점(.) 뒤에 하위 항목의 키를 명시하여 전달합니다.

\`\`\`bash
property_keys=["kakao_account.email","kakao_account.gender"]
\`\`\`

세트로 구성된 응답은 관련 정보가 함께 전달됩니다. 예를 들어 `property_keys` 에 "kakao\_account.email"을 포함해 이메일 정보를 요청한 경우, 관련 정보인 `kakao_account.email_needs_agreement`, `kakao_account.is_email_valid`, `kakao_account.is_email_verified` 가 응답에 함께 포함됩니다.

**사용자 정보 전체** 를 요청하려면 아래와 같이 `property_keys` 파라미터 값을 전달합니다.

\`\`\`json
property_keys=["kakao_account.","properties.","has_signed_up"]
\`\`\`

별도 파라미터 지정 없이 특정 사용자 한 명의 사용자 정보 전체를 요청하려면 [사용자 정보 조회](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#req-user-info) API를 사용합니다.

#### 요청

##### 헤더

| 이름 | 설명 | 필수 |
| --- | --- | --- |
| Authorization | `Authorization: KakaoAK ${SERVICE_APP_ADMIN_KEY}`   인증 방식, 서비스 앱 어드민 키로 인증 요청 | O |
| Content-Type | `Content-Type: application/x-www-form-urlencoded;charset=utf-8`   요청 데이터 타입 | O |

##### 쿼리 파라미터

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| target\_ids | `Long[]` | 조회할 회원번호 목록   최대 100명의 사용자 정보 요청 가능   `property_keys` 로 사용자 정보를 지정해 요청하는 경우, 최대 20명의 사용자 정보 요청 가능 | O |
| target\_id\_type | `String` | `target_ids` 에 포함된 회원번호 종류   `user_id` 로 고정 | O |
| property\_keys | [`PropertyKeys[]`](https://developers.kakao.com/docs/latest/ko/kakaologin/#propertykeys) | 응답에 포함할 사용자 프로퍼티의 키   각 [사용자 정보](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#user-info) 및 [사용자 프로퍼티](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#user-properties) 키 사용 가능   미지정 시 기본 응답만 제공 | X |

#### 응답

##### 본문

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| elements | [`UsersInfo[]`](https://developers.kakao.com/docs/latest/ko/kakaologin/#users-info) | 사용자 정보 목록   여러 사용자 정보 조회 API의 기본 응답에서는 ID와 같은 일부 기본 정보만 포함   기본 응답 외 정보는 `property_keys` 파라미터로 지정해 응답에 포함하도록 요청 가능   요청 가능한 정보의 종류는 [사용자 정보](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#user-info) 참고 | O |

##### UsersInfo

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| id | `Long` | 회원번호(`user_id`) | O |
| synched\_at | `Datetime` | [카카오싱크](https://developers.kakao.com/docs/latest/ko/kakaosync/common) 간편가입으로 로그인한 시각, UTC\* | X |
| connected\_at | `Datetime` | 서비스에 [연결](https://developers.kakao.com/docs/latest/ko/kakaologin/common#link) 완료된 시각, UTC\* | X |
| kakao\_account | [KakaoAccount](https://developers.kakao.com/docs/latest/ko/kakaologin/#kakaoaccount) | 카카오계정 정보 | X |
| properties | `JSON` | 사용자 프로퍼티   [사용자 프로퍼티](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#user-properties) 참고 | X |

\* [UTC](https://ko.wikipedia.org/wiki/%ED%98%91%EC%A0%95_%EC%84%B8%EA%B3%84%EC%8B%9C): 한국 시간(KST)과 9시간 차이, [RFC3339: Date and Time on the Internet](https://tools.ietf.org/html/rfc3339) 참고

#### 예제

##### 요청

\`\`\`bash
curl -v -G GET "https://kapi.kakao.com/v2/app/users" \
    -H "Authorization: KakaoAK ${SERVICE_APP_ADMIN_KEY}" \
    -H "Content-Type: application/x-www-form-urlencoded;charset=utf-8" \
    -d "target_id_type=user_id" \
    --data-urlencode "target_ids=[1399634384,1406264199]"
\`\`\`

##### 요청: property\_keys로 이메일, 프로필 지정 요청

\`\`\`bash
curl -v -G GET "https://kapi.kakao.com/v2/app/users" \
    -H "Authorization: KakaoAK ${SERVICE_APP_ADMIN_KEY}" \
    -H "Content-Type: application/x-www-form-urlencoded;charset=utf-8" \
    -d "target_id_type=user_id" \
    --data-urlencode "target_ids=[1399634384,1406264199]" \
    --data-urlencode 'property_keys=["kakao_account.email","kakao_account.profile"]'
\`\`\`

##### 요청: 조회 가능한 모든 사용자 정보 요청

\`\`\`bash
curl -v -G GET "https://kapi.kakao.com/v2/app/users" \
    -H "Authorization: KakaoAK ${SERVICE_APP_ADMIN_KEY}" \
    -H "Content-Type: application/x-www-form-urlencoded;charset=utf-8" \
    -d "target_id_type=user_id" \
    --data-urlencode "target_ids=[1285016924429472463]" \
    --data-urlencode 'property_keys=["kakao_account.","properties.","has_signed_up"]'
\`\`\`

##### 응답

\`\`\`json
[
    {
        "id":1406264199,
        "connected_at":"2020-07-14T06:15:36Z",
        // 카카오싱크 서비스에만 존재
        "synched_at":"2020-07-14T06:15:36Z"
    },
    {
        "id":1399634384,
        "connected_at":"2020-07-06T09:55:51Z",
        // 카카오싱크 서비스에만 존재
        "synched_at":"2020-07-06T09:55:51Z"
    }
    ...
]
\`\`\`

##### 응답: property\_keys로 이메일, 프로필 지정 요청

\`\`\`json
[
    {
        "id":1399634384,
        "connected_at":"2020-07-06T09:55:51Z",
        "kakao_account":{
            "profile_needs_agreement":false,
            "profile":{
                "nickname":"춘식이",
                "thumbnail_image_url":"http://k.kakaocdn.net/dn/zK7QA/btqzpE4aqO1/pl2HpfVBUI9s1SSrstperq/img_110x110.jpg",
                "profile_image_url":"http://k.kakaocdn.net/dn/zK7QA/btqzpE4aqO1/pl2HpfVBUI9s1wqsgrEAVk/img_640x640.jpg",
                "is_default_image":false
            },
            "email_needs_agreement":false,
            "is_email_valid":true,
            "is_email_verified":true,
            "email":"sweetpotato@kakao.com"
        }
    },
    {
        "id":1406264199,
        "connected_at":"2020-07-14T06:15:36Z",
        "kakao_account":{
            "profile_needs_agreement":false,
            "profile":{
                "nickname":"나비",
                "thumbnail_image_url":"http://k.kakaocdn.net/dn/DCjQu/btqti3A2gEc/zgQwddmSnG7CDfmKtTO1/img_110x110.jpg",
                "profile_image_url":"http://k.kakaocdn.net/dn/DCjQu/btqti3A2gEc/zgip1O4JmSnG8sDfmKtTO1/img_640x640.jpg",
                "is_default_image":false
            },
            "email_needs_agreement":true
            }
    }
    ...
]
\`\`\`

##### 응답: 모든 사용자 정보 요청

- [사용자 정보 조회](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#req-user-info) 응답 예제 참고

## 사용자 목록 조회

##### 기본 정보

| 메서드 | URL | 인증 방식 |
| --- | --- | --- |
| `GET` | `https://kapi.kakao.com/v1/user/ids` | 서비스 앱 어드민 키 |

| [권한](https://developers.kakao.com/docs/latest/ko/getting-started/permission) | 사전 설정 | [카카오 로그인](https://developers.kakao.com/docs/latest/ko/kakaologin/common) | [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#scope) |
| --- | --- | --- | --- |
| \- | [플랫폼 등록](https://developers.kakao.com/docs/latest/ko/app-setting/app#platform)   [카카오 로그인 활성화](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#kakao-login-activate) | 필요 | \- |

  

앱의 사용자 회원번호 목록을 제공하는 API입니다. 이 API는 관리자를 위한 것으로, 앱 어드민 키를 사용하기 때문에 반드시 서버에서만 호출해야 합니다. 2025년 4월 1일부터 각 앱은 **분당 최대 100** 건까지 호출할 수 있습니다.

앱 어드민 키를 헤더에 담아 `GET` 으로 요청하며, 파라미터를 사용해 회원번호 조회 범위 및 정렬 순서를 지정할 수 있습니다. 응답은 `JSON` 객체로 전달되며 검색 조건에 맞는 사용자 회원번호 목록을 포함합니다. 사용자 수가 많아 한 번에 전달할 수 없을 경우, 이전 또는 다음 페이지 URL을 포함합니다. 해당 URL로 사용자 목록의 이전 또는 다음 페이지를 추가 확인할 수 있습니다.

#### 요청

##### 헤더

| 이름 | 설명 | 필수 |
| --- | --- | --- |
| Authorization | `Authorization: KakaoAK ${SERVICE_APP_ADMIN_KEY}`   인증 방식, 서비스 앱 어드민 키로 인증 요청 | O |
| Content-Type | `Content-Type: application/x-www-form-urlencoded;charset=utf-8`   요청 데이터 타입 | O |

##### 쿼리 파라미터

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| limit | `Integer` | 페이지당 사용자 수   최소 `1`, 최대 `100`, 기본값 `100` | X |
| from\_id | `Long` | 페이징 시작 기준이 되는 사용자 회원번호, 사용자 목록은 from\_id과 그보다 큰 회원번호를 가진 사용자가 포함됨   일반적으로 Response에서 나온 결과를 이용   값이 없을 경우 가장 작은 회원번호를 가진 사용자부터 읽기 | X |
| order | `String` | 페이지 검색 방향   `asc` 또는 `desc`   기본값 `asc` | X |

#### 응답

##### 본문

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| elements | `Integer[]` | 회원번호 목록 | O |
| before\_url | `String` | 이전 페이지 URL, 이전 페이지가 없을 경우 null | X |
| after\_url | `String` | 다음 페이지 URL, 다음 페이지가 없을 경우 null | X |

\* total\_count: Deprecated, 앱의 사용자 수(Integer), 사용자 통계는 [앱 관리 페이지](https://developers.kakao.com/console/app) 의 \[통계\]에서 확인 가능, [공지](https://devtalk.kakao.com/t/api/120030) 참고

#### 예제

##### 요청: 첫 사용자 100명 정보 조회

\`\`\`bash
curl -v -G GET "https://kapi.kakao.com/v1/user/ids" \
    -H "Authorization: KakaoAK ${SERVICE_APP_ADMIN_KEY}"
    -H "Content-Type: application/x-www-form-urlencoded;charset=utf-8" \
\`\`\`

##### 요청: 회원번호 12345와 그보다 큰 회원번호를 가진 사용자 3명 정보 보기

\`\`\`bash
curl -v -G GET "https://kapi.kakao.com/v1/user/ids" \
    -H "Authorization: KakaoAK ${SERVICE_APP_ADMIN_KEY}" \
    -H "Content-Type: application/x-www-form-urlencoded;charset=utf-8" \
    -d "limit=3&order=asc" \
    -d "from_id=12345"
\`\`\`

##### 응답: 성공

\`\`\`json
HTTP/1.1 200 OK
{
    "elements": [
        1376016924426111111, 1376016924426222222, 1376016924426333333
    ],
    "before_url": "http://kapi.kakao.com/v1/user/ids?limit=3&order=desc&from_id=1376016924426111111&app_key=12345674ae6e12379d5921f4417b399e7",
    "after_url": "http://kapi.kakao.com/v1/user/ids?limit=3&order=asc&from_id=1376016924426333333&app_key=12345674ae6e12379d5921f4417b399e7"
}
\`\`\`

##### 응답: 실패, 분당 쿼터를 초과한 경우

\`\`\`json
HTTP/1.1 429 Too Many Request
{
  "msg": "API limit has been exceeded.",
  "code": -10
}
\`\`\`

## 사용자 프로퍼티 저장

##### 기본 정보

| 메서드 | URL | 인증 방식 |
| --- | --- | --- |
| `POST` | `https://kapi.kakao.com/v1/user/update_profile` | 액세스 토큰 |

| [권한](https://developers.kakao.com/docs/latest/ko/getting-started/permission) | 사전 설정 | [카카오 로그인](https://developers.kakao.com/docs/latest/ko/kakaologin/common) | [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#scope) |
| --- | --- | --- | --- |
| \- | [플랫폼 등록](https://developers.kakao.com/docs/latest/ko/app-setting/app#platform)   [카카오 로그인 활성화](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#kakao-login-activate)   [사용자 프로퍼티](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#user-properties) | 필요 | \- |

  

[사용자 프로퍼티](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#user-properties) 에 값을 저장합니다. 키 값은 [앱 관리 페이지](https://developers.kakao.com/console/app) 의 \[카카오 로그인\] > \[사용자 프로퍼티\]에 정의한 값을 사용해야 합니다.

`properties` 파라미터에 액세스 토큰과 함께 저장할 항목의 키와 값을 `JSON` 형식의 목록으로 담아 `POST` 로 요청합니다. 파라미터 구성 방법은 요청 예제를 참고합니다. 사용자 프로퍼티 저장에 성공하면 응답 코드와 해당 사용자 회원번호를 받습니다.

저장한 사용자 프로퍼티는 [사용자 정보 조회](https://developers.kakao.com/docs/latest/ko/kakaologin/#req-user-info) 로 사용할 수 있습니다. 해당 사용자의 정보 전체를 불러오거나, 파라미터로 특정 정보만 지정해 불러올 수 있습니다.

#### 요청

##### 헤더

| 이름 | 설명 | 필수 |
| --- | --- | --- |
| Authorization | `Authorization: Bearer ${ACCESS_TOKEN}`   인증 방식, 액세스 토큰으로 인증 요청 | O |
| Content-Type | `Content-Type: application/x-www-form-urlencoded;charset=utf-8`   요청 데이터 타입 | O |

##### 본문

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| properties | `JSON` | `{"${CUSTOM_PROPERTY_KEY}":"${CUSTOM_PROPERTY_VALUE}"}` 형식의 사용자 프로퍼티 키, 값 목록 | O |

#### 응답

##### 본문

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| id | `Long` | 회원번호 | O |

#### 예제

##### 요청

\`\`\`bash
curl -v -X POST "https://kapi.kakao.com/v1/user/update_profile" \
    -H "Content-Type: application/x-www-form-urlencoded;charset=utf-8" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}" \
    --data-urlencode 'properties={"${CUSTOM_PROPERTY_KEY}":"${CUSTOM_PROPERTY_VALUE}"}'
\`\`\`

##### 응답

\`\`\`json
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
{
    "id":123456789
}
\`\`\`

## 배송지 조회

##### 기본 정보

| 메서드 | URL | 인증 방식 |
| --- | --- | --- |
| `GET` | `https://kapi.kakao.com/v1/user/shipping_address` | 액세스 토큰   서비스 앱 어드민 키 |

| [권한](https://developers.kakao.com/docs/latest/ko/getting-started/permission) | 사전 설정 | [카카오 로그인](https://developers.kakao.com/docs/latest/ko/kakaologin/common) | [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#scope) |
| --- | --- | --- | --- |
| 필요: [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope) | [플랫폼 등록](https://developers.kakao.com/docs/latest/ko/app-setting/app#platform)   [카카오 로그인 활성화](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#kakao-login-activate)   [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope) | 필요 | 필요:   배송지 정보(shipping\_address) |

  

특정 사용자의 배송지 정보를 가져옵니다. 이 API는 액세스 토큰으로 요청하는 방식, 서비스 관리자가 앱의 어드민 키와 회원번호로 요청하는 방식 두 가지로 제공됩니다. 서버에서 배송지를 요청할 때는 요청 헤더(Header)에 사용자 토큰 대신 어드민 키를 사용하고, 배송지를 조회할 사용자를 지정해야 합니다.

요청 성공 시 응답은 사용자 카카오계정의 배송지 목록을 포함합니다. 응답에 `shipping_addresses` 값이 포함되지 않은 경우, [Q. 배송지 조회 응답에 배송지 정보가 없어요.](https://developers.kakao.com/docs/latest/ko/kakaologin/faq#no-shipping-address)를 참고합니다.

#### 요청: 액세스 토큰 방식

##### 헤더

| 이름 | 설명 | 필수 |
| --- | --- | --- |
| Authorization | `Authorization: Bearer ${ACCESS_TOKEN}`   인증 방식, 액세스 토큰으로 인증 요청 | O |

##### 쿼리 파라미터

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| address\_id | `Long` | 배송지 정보가 많은 경우, 특정 배송지 정보만 얻고 싶을 때 배송지 ID 지정 | X |
| from\_updated\_at | `Integer` | 여러 페이지에 걸쳐 응답이 제공될 때, 기준이 되는 배송지 `updated_at` 시각   해당 시각(미포함) 이전에 수정된 배송지부터 조회   이전 페이지의 마지막 배송지의 `updated_at` 을 다음 페이지 input으로 사용   값을 0으로 전달하면 처음부터 조회 | X |
| page\_size | `Integer` | 2 이상, 한 페이지에 포함할 배송지 개수(기본값: 10) | X |

#### 요청: 서비스 앱 어드민 키 방식

##### 헤더

| 이름 | 설명 | 필수 |
| --- | --- | --- |
| Authorization | `Authorization: KakaoAK ${SERVICE_APP_ADMIN_KEY}`   인증 방식, 서비스 앱 어드민 키로 인증 요청 | O |
| Content-Type | `Content-Type: application/x-www-form-urlencoded;charset=utf-8`   요청 데이터 타입 | O |

##### 쿼리 파라미터

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| target\_id\_type | `String` | 사용자 ID 타입, `user_id` 로 고정 | O |
| target\_id | `Long` | 회원번호 | O |
| address\_id | `Long` | 배송지 정보가 많은 경우, 특정 배송지 정보만 얻고 싶을 때 배송지 ID 지정 | X |
| from\_updated\_at | `Integer` | 여러 페이지에 걸쳐 응답이 제공될 때, 기준이 되는 배송지 `updated_at` 시각   해당 시각(미포함) 이전에 수정된 배송지부터 조회   이전 페이지의 마지막 배송지의 `updated_at` 을 다음 페이지 input으로 사용   값을 0으로 전달하면 처음부터 조회 | X |
| page\_size | `Integer` | 2 이상, 한 페이지에 포함할 배송지 개수(기본값: 10) | X |

#### 응답

##### 본문

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| user\_id | `Long` | 회원번호 | O |
| shipping\_addresses | [`ShippingAddress[]`](https://developers.kakao.com/docs/latest/ko/kakaologin/#shipping-address-response-body-shipping-address) | 배송지 정보 리스트 | X |
| shipping\_addresses\_needs\_agreement | `Boolean` | 배송지를 얻기 위한 추가 동의 필요 여부 | X |

\* has\_shipping\_addresse: Deprecated, 배송지 정보 값 소유 여부(Boolean), 해당 사용자 정보의 제공 가능 여부를 확인하는 용도로 사용할 수 없음, [사용자 동의 시 정보 제공 가능 여부](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#needs-agreement) 참고

##### ShippingAddress

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| id | `Long` | 배송지 ID | O |
| name | `String` | 배송지명 | X |
| is\_default | `Boolean` | 기본 배송지 여부 | O |
| updated\_at | `Integer` | 수정시각 | X |
| type | `String` | 배송지 타입   구주소 또는 신주소(도로명주소) | X |
| base\_address | `String` | 우편번호 검색시 채워지는 기본 주소 | X |
| detail\_address | `String` | 기본 주소에 추가하는 상세 주소 | X |
| receiver\_name | `String` | 수령인 이름 | X |
| receiver\_phone\_number1 | `String` | 수령인 연락처 | X |
| receiver\_phone\_number2 | `String` | 수령인 추가 연락처 | X |
| zone\_number | `String` | 신주소 우편번호, 신주소인 경우에 반드시 존재함 | X |
| zip\_code | `String` | 구주소 우편번호, 우편번호를 소유하지 않는 구주소도 존재하여 구주소인 경우도 해당값이 없을 수 있음 | X |

#### 예제

##### 요청: 액세스 토큰 방식

\`\`\`bash
curl -v -G GET "https://kapi.kakao.com/v1/user/shipping_address" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}"
\`\`\`

##### 요청: 서비스 앱 어드민 키 방식

\`\`\`bash
curl -v -G GET "https://kapi.kakao.com/v1/user/shipping_address" \
  -H "Authorization: KakaoAK ${SERVICE_APP_ADMIN_KEY}" \
  -d "target_id_type=user_id" \
  -d "target_id=${USER_ID}"
\`\`\`

##### 응답

\`\`\`json
{
  "user_id": 9876543211234,
  "shipping_addresses": [
    {
      "id": 319,
      "name": "회사",
      "is_default": true,
      "updated_at": 1538448856,
      "type": "NEW",
      "base_address": "경기 성남시 분당구 판교역로 231 (삼평동, 에이치스퀘어 에스동)",
      "detail_address": "6층",
      "receiver_name": "판교",
      "receiver_phone_number1": "031-123-2345",
      "receiver_phone_number2": "",
      "zone_number": "13494",
      "zip_code": "463-400"
    },
    {
      "id": 320,
      "name": "회사",
      "is_default": false,
      "updated_at": 1538450389,
      "type": "OLD",
      "base_address": "경기 성남시 분당구 삼평동 680 (삼평동, 에이치스퀘어 에스동)",
      "detail_address": "6층",
      "receiver_name": "판교2",
      "receiver_phone_number1": "010-0056-1234",
      "receiver_phone_number2": "",
      "zone_number": "13494",
      "zip_code": "463-400"
    }
  ],
  "shipping_addresses_needs_agreement": false
}
\`\`\`

## 동의항목 동의 내역 조회

##### 기본 정보

| 메서드 | URL | 인증 방식 |
| --- | --- | --- |
| `GET` | `https://kapi.kakao.com/v2/user/scopes` | 액세스 토큰   서비스 앱 어드민 키 |

| [권한](https://developers.kakao.com/docs/latest/ko/getting-started/permission) | 사전 설정 | [카카오 로그인](https://developers.kakao.com/docs/latest/ko/kakaologin/common) | [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#scope) |
| --- | --- | --- | --- |
| \- | [플랫폼 등록](https://developers.kakao.com/docs/latest/ko/app-setting/app#platform)   [카카오 로그인 활성화](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#kakao-login-activate)   [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope) | 필요 | \- |

  

사용자가 동의한 동의항목의 상세 정보 목록을 조회합니다. [앱 관리 페이지](https://developers.kakao.com/console/app) 의 \[카카오 로그인\] > \[동의항목\]에 설정된 동의항목의 목록과 사용자가 동의한 동의항목의 상세 정보를 반환합니다. 사용자가 기존에 동의했던 동의항목이라면 현재 앱에 사용하도록 설정돼 있지 않아도 응답에 포함됩니다.

사용자 액세스 토큰을 사용하는 방법, 앱 어드민 키를 사용하는 방법 두 가지로 제공됩니다. 사용자 액세스 토큰 또는 어드민 키를 헤더(Header)에 담아 `GET` 으로 요청합니다. 어드민 키로 요청할 때는 어떤 사용자의 정보가 필요한지 명시하기 위해 대상 사용자의 회원번호를 함께 전달합니다.

성공 시 앱에서 설정한 동의항목(Scope) 목록을 받습니다. 사용자가 동의한 항목은 `agreed` 값이 `true` 로 전달됩니다. 특정 동의항목의 동의 내역만 확인하려면 `scopes` 파라미터로 동의항목의 ID를 지정하여 요청할 수 있으며, 성공 시 응답은 지정된 동의항목의 정보만 포함합니다.

#### 요청: 액세스 토큰 방식

##### 헤더

| 이름 | 설명 | 필수 |
| --- | --- | --- |
| Authorization | `Authorization: Bearer ${ACCESS_TOKEN}`   인증 방식, 액세스 토큰으로 인증 요청 | O |

##### 쿼리 파라미터

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| scopes | `String[]` | 특정 동의항목에 대한 동의 내역만 불러오려는 경우 사용   [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope) 의 ID 목록 | X |

#### 요청: 서비스 앱 어드민 키 방식

##### 헤더

| 이름 | 설명 | 필수 |
| --- | --- | --- |
| Authorization | `Authorization: KakaoAK ${SERVICE_APP_ADMIN_KEY}`   인증 방식, 서비스 앱 어드민 키로 인증 요청 | O |
| Content-Type | `Content-Type: application/x-www-form-urlencoded;charset=utf-8`   요청 데이터 타입 | O |

##### 쿼리 파라미터

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| target\_id\_type | `String` | 회원번호 종류, `user_id` 로 고정 | O |
| target\_id | `Long` | 동의 내역을 확인할 사용자의 회원번호 | O |
| scopes | `String[]` | 특정 동의항목에 대한 동의 내역만 불러오려는 경우 사용   [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope) 의 ID 목록 | X |

#### 응답

##### 본문

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| id | `Long` | 회원번호 | O |
| scopes | [`Scope[]`](https://developers.kakao.com/docs/latest/ko/kakaologin/#check-consent-response-body-scope) | 해당 앱의 동의항목(Scope) 목록 | O |

##### Scope

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| id | `String` | [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope) ID | O |
| display\_name | `String` | 사용자 동의 화면에 출력되는 동의항목의 이름 또는 설명 | O |
| type | `String` | 동의항목 타입, `PRIVACY` 또는 `SERVICE`   `PRIVACY`: [개인정보 보호 동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#scope-user)   `SERVICE`: [접근권한 동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#scope-feature) | O |
| using | `Boolean` | 해당 앱에서 동의항목 사용 여부   `true`: 현재 앱에서 사용 중인 동의항목일 경우   `false`: 사용자가 동의했으나 현재 앱에 설정되어 있지 않은 동의항목일 경우 | O |
| agreed | `Boolean` | 사용자 동의 여부   `true`: 사용자가 동의한 경우   `false`: 사용자가 동의하지 않은 경우 | O |
| revocable | `Boolean` | 동의항목의 [동의 철회](https://developers.kakao.com/docs/latest/ko/kakaologin/#revoke-consent) 가능 여부   사용자가 동의(`"agreed"=true`)한 동의항목인 경우에만 응답에 포함   `true`: 동의 철회 가능   `false`: 동의 철회 불가능 | X |

#### 예제

##### 요청: 액세스 토큰 방식

\`\`\`bash
curl -v -G GET "https://kapi.kakao.com/v2/user/scopes" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}"
\`\`\`

##### 요청: 액세스 토큰 방식으로 특정 동의항목만 조회

\`\`\`bash
curl -v -G GET "https://kapi.kakao.com/v2/user/scopes" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}" \
    --data-urlencode 'scopes=["account_email","friends"]'
\`\`\`

##### 요청: 서비스 앱 어드민 키 방식

\`\`\`bash
curl -v -G GET "https://kapi.kakao.com/v2/user/scopes" \
    -H "Authorization: KakaoAK ${SERVICE_APP_ADMIN_KEY}" \
    -d "target_id_type=user_id" \
    -d "target_id=123456789"
\`\`\`

##### 응답

\`\`\`json
{
    "id":123456789,
    "scopes":[
        {
            "id":"profile",
            "display_name":"Profile Info(nickname/profile image)",
            "type":"PRIVACY",
            "using":true,           // 동의항목 사용 여부
            "agreed":true,          // 사용자 동의 여부
            "revocable":false       // 동의 철회 가능 여부, "agreed"가 "true"일 경우에만 반환
        },
        {
            "id":"account_email",
            "display_name":"Email",
            "type":"PRIVACY",
            "using":true,           // 동의항목 사용 여부
            "agreed":true,          // 사용자 동의 여부
            "revocable":true        // 동의 철회 가능 여부, "agreed"가 "true"일 경우에만 반환
        },
        {
            "id":"shipping_address",
            "display_name":"Shipping information (receiver, shipping address, phone number)",
            "type":"PRIVACY",
            "using":true,           // 동의항목 사용 여부
            "agreed":false         // 사용자 동의 여부 
        },
        ...
    ]
}
\`\`\`

##### 응답: 이메일, 카카오 서비스 내 친구 목록에 대한 동의 내역

\`\`\`json
{
    "id":123456789,
    "scopes":
    [
        {
            "id":"friends",
            "display_name":"Friends List in Kakao Service(Including profile image, nickname, and favorites)",
            "type":"PRIVACY",
            "using":true,
            "agreed":true,
            "revocable":false
        },
        {
            "id":"account_email",
            "display_name":"Email",
            "type":"PRIVACY",
            "using":true,
            "agreed":false
        }
    ]
}
\`\`\`

## 동의항목 동의 철회

##### 기본 정보

| 메서드 | URL | 인증 방식 |
| --- | --- | --- |
| `POST` | `https://kapi.kakao.com/v2/user/revoke/scopes` | 액세스 토큰   서비스 앱 어드민 키 |

| [권한](https://developers.kakao.com/docs/latest/ko/getting-started/permission) | 사전 설정 | [카카오 로그인](https://developers.kakao.com/docs/latest/ko/kakaologin/common) | [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#scope) |
| --- | --- | --- | --- |
| \- | [플랫폼 등록](https://developers.kakao.com/docs/latest/ko/app-setting/app#platform)   [카카오 로그인 활성화](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#kakao-login-activate)   [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope) | 필요 | \- |

  

사용자가 동의한 항목에 대해 동의를 철회합니다. [동의항목 동의 내역 조회 API](https://developers.kakao.com/docs/latest/ko/kakaologin/#check-consent) 로 조회한 동의항목 정보 중 동의 철회 가능 여부(`revocable`) 값이 `true` 인 동의항목만 철회할 수 있습니다. 동의 철회가 불가능한 동의항목을 대상으로 요청한 경우 에러 응답을 받습니다.

액세스 토큰을 사용하는 방법, 앱 어드민 키를 사용하는 방법 두 가지로 제공됩니다. 액세스 토큰 또는 어드민 키를 헤더(Header)에 담고, 동의를 철회할 동의항목 목록을 전달하여 `POST` 로 요청합니다. 어드민 키로 요청할 때는 어떤 사용자의 정보가 필요한지 명시하기 위해 대상 사용자의 회원번호를 함께 전달합니다.

요청 성공 시 변경된 앱의 동의항목 정보 목록을 받습니다. 각 동의항목 사용 설정 여부, 사용자 동의 여부, 철회 가능 여부와 같은 상세 정보를 포함합니다. 동의가 철회된 동의항목은 `agreed` 값을 `false` 로 반환합니다.

#### 요청: 액세스 토큰 방식

##### 헤더

| 이름 | 설명 | 필수 |
| --- | --- | --- |
| Authorization | `Authorization: Bearer ${ACCESS_TOKEN}`   인증 방식, 액세스 토큰으로 인증 요청 | O |

##### 본문

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| scopes | `String[]` | 동의를 철회할 [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope) ID 목록      **중요**: [동의항목 동의 내역 조회](https://developers.kakao.com/docs/latest/ko/kakaologin/#check-consent) API 응답에서 동의 철회 가능 여부(`revocable`) 값이 `true` 인 동의항목만 동의 철회 가능 | O |

#### 요청: 서비스 앱 어드민 키 방식

##### 헤더

| 이름 | 설명 | 필수 |
| --- | --- | --- |
| Authorization | `Authorization: KakaoAK ${SERVICE_APP_ADMIN_KEY}`   인증 방식, 서비스 앱 어드민 키로 인증 요청 | O |
| Content-Type | `Content-Type: application/x-www-form-urlencoded;charset=utf-8`   요청 데이터 타입 | O |

##### 본문

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| target\_id\_type | `String` | 회원번호 종류, `user_id` 로 고정 | O |
| target\_id | `Long` | 동의를 철회할 사용자의 회원번호 | O |
| scopes | `String[]` | 동의를 철회할 [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope) ID 목록   [동의항목 동의 내역 조회](https://developers.kakao.com/docs/latest/ko/kakaologin/#check-consent) API 응답에서 동의 철회 가능 여부(`revocable`) 값이 `true` 인 동의항목만 철회 가능 | O |

#### 응답

- [동의항목 동의 내역 조회](https://developers.kakao.com/docs/latest/ko/kakaologin/#check-consent) 와 동일, 해당 항목 참고

#### 예제

##### 요청: 액세스 토큰 방식

\`\`\`bash
curl -v -X POST "https://kapi.kakao.com/v2/user/revoke/scopes" \
    -H "Content-Type: application/x-www-form-urlencoded;charset=utf-8" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}" \
    --data-urlencode 'scopes=["account_email"]'
\`\`\`

##### 요청: 서비스 앱 어드민 키 방식

\`\`\`bash
curl -v -X POST "https://kapi.kakao.com/v2/user/revoke/scopes" \
    -H "Content-Type: application/x-www-form-urlencoded;charset=utf-8" \
    -H "Authorization: KakaoAK ${SERVICE_APP_ADMIN_KEY}" \
    -d "target_id_type=user_id" \
    -d "target_id=123456789" \
    --data-urlencode 'scopes=["account_email"]'
\`\`\`

##### 응답

\`\`\`json
{
    "id":123456789,
    "scopes":[
        {
            "id":"profile",
            "display_name":"Profile Info(nickname/profile image)",
            "type":"PRIVACY",
            "using":true,
            "agreed":true,
            "revocable":false
        },
        {
            "id":"friends",
            "display_name":"Friends List in Kakao Service(Including profile image, nickname, and favorites)",
            "type":"PRIVACY",
            "using":true,
            "agreed":true,
            "revocable":false
        },
        {
            "id":"account_email",
            "display_name":"Email",
            "type":"PRIVACY",
            "using":true,
            "agreed":false          //동의 철회 성공 시 동의 여부 값이 false로 변경됨
        },
        {
            "id":"talk_chats",
            "display_name":"Read chat lists in Kakao Talk",
            "type":"SERVICE",
            "using":true,
            "agreed":true,
            "revocable":false
        },
        ...
    ]
}
\`\`\`

##### 응답: 실패, 필수 동의항목의 철회를 요청한 경우

\`\`\`json
HTTP/1.1 403 Forbidden
{
    "msg":"[profile] is not revocable. check out if it's set as required on developers.kakao.com",
    "code":-3
}
\`\`\`

##### 응답: 실패, 철회할 동의항목 ID가 잘못된 경우

\`\`\`json
HTTP/1.1 400 Bad Request
{
  "msg":"There is no scopes to revoke. check out if given scope id([email]) is correct again.",
  "code":-2
}
\`\`\`

## 서비스 약관

이 항목은 서비스 약관 관련 API의 사용 방법을 안내합니다.

**카카오싱크 전용**

[카카오싱크](https://developers.kakao.com/docs/latest/ko/kakaosync/common) 를 도입한 서비스만 사용할 수 있는 기능입니다.

**서비스 약관 주의 사항**

서비스 약관에 대한 사용자 동의는 [서비스 약관 운용](https://developers.kakao.com/docs/latest/ko/kakaologin/common#policy-terms) 정책에 따라 서비스에서 직접 관리해야 합니다. 카카오싱크 간편가입으로 동의받지 않은 서비스 약관은, 자체적인 동의 절차로 동의받는 것을 권장합니다. 사용자가 동의하지 않았거나, 동의 철회한 **필수 서비스 약관** 은 [서비스 약관 선택해 동의 요청](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-code-terms) 으로 동의받을 수 있습니다.

### 서비스 약관 동의 내역 조회

##### 기본 정보

| 메서드 | URL | 인증 방식 |
| --- | --- | --- |
| `GET` | `https://kapi.kakao.com/v2/user/service_terms` | 액세스 토큰   서비스 앱 어드민 키 |

| [권한](https://developers.kakao.com/docs/latest/ko/getting-started/permission) | 사전 설정 | [카카오 로그인](https://developers.kakao.com/docs/latest/ko/kakaologin/common) | [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#scope) |
| --- | --- | --- | --- |
| 필요: [카카오싱크](https://developers.kakao.com/docs/latest/ko/kakaosync/common) | [플랫폼 등록](https://developers.kakao.com/docs/latest/ko/app-setting/app#platform)   [카카오 로그인 활성화](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#kakao-login-activate)   [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope)   [간편가입](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#sync) | 필요 | \- |

  

특정 사용자가 어떤 서비스 약관에 동의하고 로그인했는지 확인합니다. **[서비스 약관 주의 사항](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#sync) 을 반드시 준수** 해야 합니다.

원하는 인증 방식을 헤더에 담아 `GET` 으로 요청합니다. 앱에 설정된 전체 서비스 약관 목록을 조회하려면 `result` 를 `app_service_terms` 로 지정해 요청합니다. 특정 서비스 약관만 조회하려면 `tags` 에 해당 서비스 약관의 태그(Tag)를 지정해 요청합니다.

관리자가 특정 사용자의 서비스 약관 동의 내역을 확인하려면 서버에서 어드민 키(Admin key)로 요청할 수 있습니다. 어드민 키는 **서버에서 호출할 때만** 사용해야 합니다. 어드민 키를 사용해 요청할 경우 `target_id` 파라미터로 사용자 회원번호를 전달해 조회 대상을 지정하고, `target_id_type` 파라미터 값을 `user_id` 로 지정하여 함께 전달해야 합니다.

요청 성공 시 응답은 사용자 ID와 서비스 약관 정보가 포함된 `JSON` 객체입니다. 사용자가 서비스를 탈퇴하고 앱과의 연결을 끊은 뒤 로그인하면 다시 간편가입 화면으로 동의 절차를 거칩니다. 이에 따라 서비스 약관에 동의한 시간 정보가 갱신됩니다.

#### 요청: 액세스 토큰 방식

##### 헤더

| 이름 | 설명 | 필수 |
| --- | --- | --- |
| Authorization | `Authorization: Bearer ${ACCESS_TOKEN}`   인증 방식, 액세스 토큰으로 인증 요청 | O |

##### 쿼리 파라미터

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| result | `String` | 조회할 서비스 약관 목록, 아래 중 하나   `agreed_service_terms`: 사용자가 동의한 서비스 약관 목록(기본값)   `app_service_terms`: 앱에 사용 설정된 서비스 약관 목록 | X |
| tags | `String` | 조회할 서비스 약관 태그, `result` 로 지정한 목록 내 서비스 약관으로 한정   여러 태그를 쉼표(`,`)로 구분한 하나의 문자열로 전달, [예제](https://developers.kakao.com/docs/latest/ko/kakaologin/#terms-sample) 참고 | X |

#### 요청: 서비스 앱 어드민 키 방식

##### 헤더

| 이름 | 설명 | 필수 |
| --- | --- | --- |
| Authorization | `Authorization: KakaoAK ${SERVICE_APP_ADMIN_KEY}`   인증 방식, 서비스 앱 어드민 키로 인증 요청 | O |
| Content-Type | `Content-Type: application/x-www-form-urlencoded;charset=utf-8`   요청 데이터 타입 | O |

##### 쿼리 파라미터

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| target\_id\_type | `String` | 사용자 ID 타입, `user_id` 로 고정 | O |
| target\_id | `Long` | 사용자 ID | O |
| result | `String` | 조회할 서비스 약관 목록, 아래 중 하나   `agreed_service_terms`: 사용자가 동의한 서비스 약관 목록(기본값)   `app_service_terms`: 앱에 사용 설정된 서비스 약관 목록 | X |
| tags | `String` | 조회할 서비스 약관 태그, `result` 로 지정한 목록 내 서비스 약관으로 한정   여러 태그를 쉼표(`,`)로 구분한 하나의 문자열로 전달, [예제](https://developers.kakao.com/docs/latest/ko/kakaologin/#terms-sample) 참고 | X |

#### 응답

##### 본문

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| id | `Long` | 회원번호 | O |
| service\_terms | [`ServiceTerms[]`](https://developers.kakao.com/docs/latest/ko/kakaologin/#service-terms) | 서비스 약관 목록 | X |

##### ServiceTerms

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| tag | `String` | 서비스 약관에 설정된 태그(Tag) | O |
| required | `Boolean` | 서비스 약관의 필수 동의 여부 | O |
| agreed | `Boolean` | 서비스 약관의 동의 상태   `true`: 동의   `false`: 미동의 | O |
| revocable | `Boolean` | 서비스 약관의 동의 철회 가능 여부   `true`: 동의 철회 가능   `false`: 동의 철회 불가, 사용자가 동의하지 않은 약관인 경우      **중요**: 동의 철회 가능 서비스 약관만 [서비스 약관 동의 철회](https://developers.kakao.com/docs/latest/ko/kakaologin/#revoke-terms) 요청 가능 | O |
| agreed\_at | `Datetime` | 사용자가 해당 서비스 약관에 마지막으로 동의한 시간   (RFC3339 internet date/time format) | X |
| agreed\_by | `String` | 서비스 약관의 동의 경로   `KAUTH`: 카카오싱크 [간편가입](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#simple-signup) 동의 화면   `KAPI`: [서비스 약관에 동의](https://developers.kakao.com/docs/latest/ko/kakaologin/#upgrade-terms) API | X |

#### 예제

##### 요청: 액세스 토큰 방식, 사용자가 동의한 서비스 약관 조회

\`\`\`bash
curl -v -G GET "https://kapi.kakao.com/v2/user/service_terms" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}"
\`\`\`

##### 요청: 액세스 토큰 방식, 앱에 사용 설정된 서비스 약관 목록 조회

\`\`\`bash
curl -v -G GET "https://kapi.kakao.com/v2/user/service_terms" \
    -H 'Authorization: Bearer ${ACCESS_TOKEN}' \
    -d "result=app_service_terms"
\`\`\`

##### 요청: 서비스 앱 어드민 키 방식, 특정 태그의 서비스 약관만 조회

\`\`\`bash
curl -v -G GET "https://kapi.kakao.com/v2/user/service_terms" \
    -H "Authorization: KakaoAK ${SERVICE_APP_ADMIN_KEY}" \
    -d "target_id_type=user_id" \
    -d "target_id=${USER_ID}" \
    -d "tags=optional_no_consent,service_2020_0218"
\`\`\`

##### 응답: 사용자가 동의한 서비스 약관

\`\`\`json
{
    "id": 111111,
    "service_terms": [
        {
            "tag": "optional_20200616",
            "required": false,
            "agreed": true,
            "revocable": true,
            "agreed_at": "2023-06-29T07:39:56Z",
            "agreed_by": "KAUTH"
        },
        {
            "tag": "service_2020_0218",
            "required": true,
            "agreed": true,
            "revocable": false,
            "agreed_at": "2023-06-29T07:39:56Z",
            "agreed_by": "KAUTH"
        },
        ...
    ]
}
\`\`\`

##### 응답: 앱에 사용 설정된 서비스 약관 목록

\`\`\`json
{
    "id": 111111,
    "service_terms": [
        {
            "tag": "optional_20200616",
            "required": false,
            "agreed": true,
            "revocable": true,
            "agreed_at": "2023-06-29T07:39:56Z",
            "agreed_by": "KAUTH"
        },
        {
            "tag": "optional_no_consent",
            "required": false,
            "agreed": false,
            "revocable": true
        },
        {
            "tag": "service_2020_0218",
            "required": true,
            "agreed": true,
            "revocable": false,
            "agreed_at": "2023-06-29T07:39:56Z",
            "agreed_by": "KAUTH"
        },
        ...
    ]
}
\`\`\`

##### 응답: 특정 태그의 서비스 약관

\`\`\`json
{
    "id": 111111,
    "service_terms": [
        {
            "tag": "optional_no_consent",
            "required": false,
            "agreed": false,
            "revocable": true
        },
        {
            "tag": "service_2020_0218",
            "required": true,
            "agreed": true,
            "revocable": false,
            "agreed_at": "2023-06-29T07:39:56Z",
            "agreed_by": "KAUTH"
        }
    ]
}
\`\`\`

##### 응답: 실패, 존재하지 않는 서비스 약관 태그

\`\`\`json
HTTP/1.1 400 Bad Request
{
    "msg": "There is no tags to get service terms. check out to configured this tags([test]) in app(docu_test).",
    "code": -2
}
\`\`\`

### 서비스 약관 동의 철회

##### 기본 정보

| 메서드 | URL | 인증 방식 |
| --- | --- | --- |
| `POST` | `https://kapi.kakao.com/v2/user/revoke/service_terms` | 액세스 토큰   서비스 앱 어드민 키 |

| [권한](https://developers.kakao.com/docs/latest/ko/getting-started/permission) | 사전 설정 | [카카오 로그인](https://developers.kakao.com/docs/latest/ko/kakaologin/common) | [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#scope) |
| --- | --- | --- | --- |
| 필요: [카카오싱크](https://developers.kakao.com/docs/latest/ko/kakaosync/common) | [플랫폼 등록](https://developers.kakao.com/docs/latest/ko/app-setting/app#platform)   [카카오 로그인 활성화](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#kakao-login-activate)   [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope)   [간편가입](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#sync) | 필요 | \- |

  

특정 사용자가 동의한 서비스 약관의 동의를 철회합니다. [사용자 약관 동의 내역 조회](https://developers.kakao.com/docs/latest/ko/kakaologin/#terms) 응답의 동의 철회 가능 여부(`revocable`) 값이 `true` 인 서비스 약관만 철회 가능합니다. **[서비스 약관 주의 사항](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#sync) 을 반드시 준수** 해야 합니다.

원하는 인증 방식을 헤더에 담아 `POST` 로 요청합니다. `tags` 에 동의 철회할 서비스 약관의 태그(Tag)를 지정해 전달해야 합니다.

관리자가 특정 사용자의 서비스 약관 동의를 철회하려면 서버에서 어드민 키(Admin key)로 요청할 수 있습니다. 어드민 키는 **서버에서 호출할 때만** 사용해야 합니다. 어드민 키를 사용해 요청할 경우 `target_id` 에 사용자 회원번호를 전달해 조회 대상을 지정하고, `target_id_type` 를 `user_id` 로 지정해 함께 전달해야 합니다.

요청 성공 시 응답은 동의 철회에 성공한 서비스 약관 목록이 포함된 `JSON` 객체입니다. 동의 철회가 불가능한 사용자 미동의 서비스 약관은 포함되지 않습니다.

#### 요청: 액세스 토큰 방식

##### 헤더

| 이름 | 설명 | 필수 |
| --- | --- | --- |
| Authorization | `Authorization: Bearer ${ACCESS_TOKEN}`   인증 방식, 액세스 토큰으로 인증 요청 | O |

##### 본문

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| tags | `String` | 동의 철회할 서비스 약관 태그   여러 태그를 쉼표(`,`)로 구분한 하나의 문자열로 전달, [예제](https://developers.kakao.com/docs/latest/ko/kakaologin/#revoke-terms-sample) 참고      **중요**: [서비스 약관 동의 내역 조회 API](https://developers.kakao.com/docs/latest/ko/kakaologin/#terms) 응답에서 동의 철회 가능 여부(`revocable`) 값이 `true` 인 서비스 약관만 철회 가능 | O |

#### 요청: 서비스 앱 어드민 키 방식

##### 헤더

| 이름 | 설명 | 필수 |
| --- | --- | --- |
| Authorization | `Authorization: KakaoAK ${SERVICE_APP_ADMIN_KEY}`   인증 방식, 서비스 앱 어드민 키로 인증 요청 | O |
| Content-Type | `Content-Type: application/x-www-form-urlencoded;charset=utf-8`   요청 데이터 타입 | O |

##### 본문

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| target\_id\_type | `String` | 사용자 ID 타입, `user_id` 로 고정 | O |
| target\_id | `Long` | 사용자 ID | O |
| tags | `String` | 동의 철회할 서비스 약관 태그   여러 태그를 쉼표(`,`)로 구분한 하나의 문자열로 전달, [예제](https://developers.kakao.com/docs/latest/ko/kakaologin/#revoke-terms-sample) 참고      **중요**: [서비스 약관 동의 내역 조회 API](https://developers.kakao.com/docs/latest/ko/kakaologin/#terms) 응답에서 동의 철회 가능 여부(`revocable`) 값이 `true` 인 서비스 약관만 철회 가능 | O |

#### 응답

##### 본문

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| id | `Long` | 회원번호 | O |
| revoked\_service\_terms | [`RevokedServiceTerms[]`](https://developers.kakao.com/docs/latest/ko/kakaologin/#revoked-service-terms) | 동의 철회에 성공한 서비스 약관 목록      **중요**: 동의 철회가 불가능한 사용자 미동의 서비스 약관은 포함되지 않음 | X |

##### RevokedServiceTerms

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| tag | `String` | 동의 철회에 성공한 서비스 약관 태그(Tag) | O |
| agreed | `Boolean` | 동의 철회 후 서비스 약관의 동의 상태   `true`: 동의   `false`: 미동의 | O |

#### 예제

##### 요청: 액세스 토큰 방식

\`\`\`bash
curl -v -X POST "https://kapi.kakao.com/v2/user/revoke/service_terms" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}"
    -d "tags=optional_20200616,optional_no_consent"
\`\`\`

##### 요청: 서비스 앱 어드민 키 방식

\`\`\`bash
curl -v -X POST "https://kapi.kakao.com/v2/user/revoke/service_terms" \
    -H "Authorization: KakaoAK ${SERVICE_APP_ADMIN_KEY}" \
    -d "target_id_type=user_id" \
    -d "target_id=${USER_ID}" \
    -d "tags=optional_20200616,optional_no_consent"
\`\`\`

##### 응답

\`\`\`json
{
    "id": 111111,
    "revoked_service_terms": [
        {
            "tag": "optional_20200616",
            "agreed": false
        },
        {
            "tag": "optional_no_consent",
            "agreed": false
        }
    ]
}
\`\`\`

##### 응답: 실패, 존재하지 않는 서비스 약관 태그

\`\`\`json
HTTP/1.1 400 Bad Request
{
    "msg": "There is no tags to revoke. check out to configured this tags([test_tag]) in app(test_app).",
    "code": -2
}
\`\`\`

### 고급: 서비스 약관에 동의

##### 기본 정보

| 메서드 | URL | 인증 방식 |
| --- | --- | --- |
| `POST` | `https://kapi.kakao.com/v2/user/upgrade/service_terms` | 액세스 토큰   서비스 앱 어드민 키 |

| [권한](https://developers.kakao.com/docs/latest/ko/getting-started/permission) | 사전 설정 | [카카오 로그인](https://developers.kakao.com/docs/latest/ko/kakaologin/common) | [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#scope) |
| --- | --- | --- | --- |
| 필요: [카카오싱크](https://developers.kakao.com/docs/latest/ko/kakaosync/common) | [플랫폼 등록](https://developers.kakao.com/docs/latest/ko/app-setting/app#platform)   [카카오 로그인 활성화](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#kakao-login-activate)   [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope)   [간편가입](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#sync) | 필요 | \- |

  

[카카오싱크](https://developers.kakao.com/docs/latest/ko/kakaosync/common) 서비스에서 사용자가 특정 서비스 약관에 동의한 것으로 처리합니다. 이 API는 카카오싱크 간편가입 동의 화면으로 사용자에게 동의를 요청하는 기능을 제공하지 않습니다. 서비스에서 필요 시 서비스 약관 동의 내역을 카카오 API 플랫폼에 반영하는 용도로 사용합니다. **[서비스 약관 주의 사항](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#sync) 을 반드시 준수** 해야 합니다.

원하는 인증 방식으로 `POST` 요청합니다. 동의 처리할 서비스 약관의 태그를 `tags` 파라미터로 전달해야 합니다.

요청 성공 시 응답은 사용자 ID, 동의 처리에 성공한 서비스 약관 목록을 포함한 `JSON` 객체입니다. 사용자가 이미 동의했거나, 약관 태그가 유효하지 않아 동의 처리에 실패한 서비스 약관은 응답에 포함되지 않습니다.

#### 요청: 액세스 토큰 방식

##### 헤더

| 이름 | 설명 | 필수 |
| --- | --- | --- |
| Authorization | `Authorization: Bearer ${ACCESS_TOKEN}`   인증 방식, 액세스 토큰으로 인증 요청 | O |

##### 본문

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| tags | `String` | 동의 처리할 서비스 약관 태그   여러 태그를 쉼표(`,`)로 구분한 하나의 문자열로 전달, [예제](https://developers.kakao.com/docs/latest/ko/kakaologin/#upgrade-terms-sample) 참고 | O |

#### 요청: 서비스 앱 어드민 키 방식

##### 헤더

| 이름 | 설명 | 필수 |
| --- | --- | --- |
| Authorization | `Authorization: KakaoAK ${SERVICE_APP_ADMIN_KEY}`   인증 방식, 서비스 앱 어드민 키로 인증 요청 | O |
| Content-Type | `Content-Type: application/x-www-form-urlencoded;charset=utf-8`   요청 데이터 타입 | O |

##### 본문

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| target\_id\_type | `String` | `target_id` 타입, `user_id` 로 고정 | O |
| target\_id | `Long` | 사용자 ID | O |
| tags | `String` | 동의 처리할 서비스 약관 태그   여러 태그를 쉼표(`,`)로 구분한 하나의 문자열로 전달, [예제](https://developers.kakao.com/docs/latest/ko/kakaologin/#upgrade-terms-sample) 참고 | O |

#### 응답

##### 본문

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| id | `Long` | 회원번호 | O |
| agreed\_service\_terms | [`AgreedServiceTerms[]`](https://developers.kakao.com/docs/latest/ko/kakaologin/#agreed-service-terms) | 동의 처리에 성공한 서비스 약관 목록 | X |

##### AgreedServiceTerms

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| tag | `String` | 서비스 약관에 설정된 태그(Tag) | O |
| agreed | `Boolean` | 서비스 약관의 동의 상태   `true`: 동의   `false`: 미동의 | O |
| agreed\_at | `Datetime` | 사용자가 해당 약관에 마지막으로 동의한 시간   (RFC3339 internet date/time format) | X |
| agreed\_by | `String` | 서비스 약관의 동의 경로   `KAUTH`: 카카오싱크 [간편가입](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#simple-signup) 동의 화면   `KAPI`: [서비스 약관에 동의](https://developers.kakao.com/docs/latest/ko/kakaologin/#upgrade-terms) API | X |

#### 예제

##### 요청: 액세스 토큰 방식

\`\`\`bash
curl -v -X POST "https://kapi.kakao.com/v2/user/upgrade/service_terms" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}" \
    -d "tags=term01,term02,term03"
\`\`\`

##### 요청: 서비스 앱 어드민 키 방식

\`\`\`bash
curl -v -X POST "https://kapi.kakao.com/v2/user/upgrade/service_terms" \
    -H "Authorization: KakaoAK ${SERVICE_APP_ADMIN_KEY}" \
    -d "target_id=${USER_ID}" \
    -d "target_id_type=user_id" \
    -d "tags=term01,term02,term03"
\`\`\`

##### 응답: 사용자가 동의한 서비스 약관

\`\`\`json
HTTP/1.1 200 OK
{
    "id": 1376016924429759243,
    "agreed_service_terms": [
        {
            "tag": "term03",
            "agreed": true,
            "agreed_at": "2023-08-02T08:33:25Z",
            "agreed_by": "KAPI"
        }, {
            "tag": "term01",
            "agreed": true,
            "agreed_at": "2023-08-02T08:33:25Z",
            "agreed_by": "KAUTH"
        }, {
            "tag": "term02",
            "agreed": true,
            "agreed_at": "2023-08-02T08:33:25Z",
            "agreed_by": "KAUTH"
        }
    ]
}
\`\`\`

##### 응답: 동의 처리에 성공한 일부 서비스 약관만 포함

\`\`\`json
HTTP/1.1 200 OK
{
    "id": 1376016924429759243,
    "agreed_service_terms": [
        {
            "tag": "term02",
            "agreed": true,
            "agreed_at": "2023-08-02T08:34:56Z"
        }
    ]
}
\`\`\`

## OpenID Connect

이 항목은 카카오 로그인 OpenID Connect 관련 API의 사용 방법을 안내합니다.

### OIDC: 메타데이터 조회

##### 기본 정보

| 메서드 | URL | 인증 방식 |
| --- | --- | --- |
| `GET` | `https://kauth.kakao.com/.well-known/openid-configuration` | \- |

| [권한](https://developers.kakao.com/docs/latest/ko/getting-started/permission) | 사전 설정 | [카카오 로그인](https://developers.kakao.com/docs/latest/ko/kakaologin/common) | [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#scope) |
| --- | --- | --- | --- |
| \- | \- | \- | \- |

  

카카오 로그인의 OpenID Connect 서비스 제공자 설정을 확인합니다. 카카오 로그인은 OpenID Connect Discovery 표준 규격에 따라 서비스 제공자 설정을 담은 메타데이터(Metadata) 문서를 제공합니다.

#### 응답

##### 본문

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| issuer | `String` | 인증 기관 정보, `https://kauth.kakao.com` 으로 고정 | O |
| authorization\_endpoint | `String` | [인가 코드 요청](https://developers.kakao.com/docs/latest/ko/kakaologin/#request-code) URL | O |
| token\_endpoint | `String` | [토큰 요청](https://developers.kakao.com/docs/latest/ko/kakaologin/#request-token) URL | O |
| userinfo\_endpoint | `String` | 사용자 정보 요청 URL      **참고**: [OIDC: 사용자 정보 조회](https://developers.kakao.com/docs/latest/ko/kakaologin/#oidc-user-info) 의 요청 URL이며 [사용자 정보 조회](https://developers.kakao.com/docs/latest/ko/kakaologin/#req-user-info) 와 별개 | O |
| jwks\_uri | `String` | [OIDC: 공개키 목록 조회](https://developers.kakao.com/docs/latest/ko/kakaologin/#oidc-find-public-key) 요청 URL | O |
| token\_endpoint\_auth\_methods\_supported | `String[]` | [토큰 요청](https://developers.kakao.com/docs/latest/ko/kakaologin/#request-token) 이 지원하는 클라이언트 인증 방식   `client_secret_post`: `POST` 메서드를 사용한 [Client Secret](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#security-client-secret) 전송 | O |
| subject\_types\_supported | `String[]` | 지원하는 식별자 유형, `public` 으로 고정 | O |
| id\_token\_signing\_alg\_values\_supported | `String[]` | ID 토큰 암호화 알고리즘, `RS256` 으로 고정 | O |
| request\_uri\_parameter\_supported | `Boolean` | [Pushed Authorization](https://www.rfc-editor.org/rfc/rfc9126) 지원 여부   `false` (미지원)으로 고정 | O |
| response\_types\_supported | `String[]` | [인가 코드 요청](https://developers.kakao.com/docs/latest/ko/kakaologin/#request-code) 이 지원하는 응답 형식(`response_type`), `code` 로 고정 | O |
| response\_modes\_supported | `String[]` | [인가 코드 요청](https://developers.kakao.com/docs/latest/ko/kakaologin/#request-code) 이 지원하는 `code` 응답 방식   `query`: 쿼리 문자열(Query string) | O |
| grant\_types\_supported | `String[]` | [토큰 요청](https://developers.kakao.com/docs/latest/ko/kakaologin/#request-token) 이 지원하는 인증 유형(`grant_type`), `authorization_code` (인가 코드), `refresh_token` (리프레시 토큰) 두 가지로 고정 | O |
| code\_challenge\_methods\_supported | `String[]` | PKCE(Proof Key for Code Exchange) `code_challenge` 매개 변수에 대한 `code_verifier` 인코딩에 지원되는 메서드, `S256` 으로 고정 | O |
| claims\_supported | `String[]` | 서비스 제공자가 지원하는 데이터 목록   [ID 토큰 구성 요소](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#oidc-id-token) 만 포함      **참고**: OpenID Connect로 제공하는 사용자 정보의 종류는 [OIDC: 사용자 정보 조회](https://developers.kakao.com/docs/latest/ko/kakaologin/#oidc-user-info) 에서 확인 가능 | O |

#### 예제

##### 요청

\`\`\`bash
curl -v -G GET "https://kauth.kakao.com/.well-known/openid-configuration"
\`\`\`

##### 응답

\`\`\`json
HTTP/1.1 200
Content-Type: application/json;charset=utf-8
{
    "issuer": "https://kauth.kakao.com",
    "authorization_endpoint": "https://kauth.kakao.com/oauth/authorize",
    "token_endpoint": "https://kauth.kakao.com/oauth/token",
    "userinfo_endpoint": "https://kapi.kakao.com/v1/oidc/userinfo",
    "jwks_uri": "https://kauth.kakao.com/.well-known/jwks.json",
    "token_endpoint_auth_methods_supported": ["client_secret_post"],
    "subject_types_supported": ["public"],
    "id_token_signing_alg_values_supported": ["RS256"],
    "request_uri_parameter_supported": false,
    "response_types_supported": ["code"],
    "response_modes_supported": ["query"],
    "grant_types_supported": [
        "authorization_code", "refresh_token"
    ],
    "code_challenge_methods_supported": ["S256"],
    "claims_supported": [
        "iss",
        "aud",
        "sub",
        "auth_time",
        "exp",
        "iat",
        "nonce",
        "nickname",
        "picture",
        "email"
    ]
}
\`\`\`
  

### OIDC: 공개키 목록 조회

##### 기본 정보

| 메서드 | URL | 인증 방식 |
| --- | --- | --- |
| `GET` | `https://kauth.kakao.com/.well-known/jwks.json` | \- |

| [권한](https://developers.kakao.com/docs/latest/ko/getting-started/permission) | 사전 설정 | [카카오 로그인](https://developers.kakao.com/docs/latest/ko/kakaologin/common) | [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#scope) |
| --- | --- | --- | --- |
| \- | \- | \- | \- |

  

카카오 인증 서버가 [ID 토큰](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#oidc-id-token) 서명 시 사용한 공개키 목록을 조회합니다. 공개키는 일정 주기 또는 특별한 이슈 발생 시 변경될 수 있습니다. 주기적으로 최신 공개키 목록을 조회한 후, 일정 기간 캐싱(Caching)하여 사용할 것을 권장합니다. 지나치게 빈번한 공개키 목록 조회 요청 시, 요청이 차단될 수 있습니다.

요청 성공 시, `JSON` 형식으로 카카오 인증 서버가 제공하는 공개키 목록을 받습니다. 응답의 공개키 목록 중, ID 토큰의 `kid` 에 해당하는 공개키를 확인하여 [ID 토큰 유효성 검증](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#oidc-id-token-verify) 시 사용합니다.

#### 응답

##### 본문

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| keys | [`JWK[]`](https://developers.kakao.com/docs/latest/ko/kakaologin/#oidc-find-public-key-response-body-jwk) | 공개키 목록을 담은 `JSON Web Key` (JWK) 배열(참고: [RFC7517](https://datatracker.ietf.org/doc/html/rfc7517#section-5)) | O |

##### JWK

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| kid | `String` | 공개키 ID | O |
| kty | `String` | 공개키 타입, `RSA` 로 고정 | O |
| alg | `String` | 암호화 알고리즘 | O |
| use | `String` | 공개키의 용도, `sig` (서명)으로 고정 | O |
| n | `String` | 공개키 모듈(Modulus)   공개키는 `n` 과 `e` 의 쌍으로 구성됨 | O |
| e | `String` | 공개키 지수(Exponent)   공개키는 `n` 과 `e` 의 쌍으로 구성됨 | O |

#### 예제: 요청

\`\`\`bash
curl -v -G GET "https://kauth.kakao.com/.well-known/jwks.json"
\`\`\`

#### 예제: 응답, 성공

\`\`\`json
HTTP/1.1 200
{
    "keys": [
        {
            "kid": "3f96980381e451efad0d2ddd30e3d3",
            "kty": "RSA",
            "alg": "RS256",
            "use": "sig",
            "n": "q8zZ0b_MNaLd6Ny8wd4cjFomilLfFIZcmhNSc1ttx_oQdJJZt5CDHB8WWwPGBUDUyY8AmfglS9Y1qA0_fxxs-ZUWdt45jSbUxghKNYgEwSutfM5sROh3srm5TiLW4YfOvKytGW1r9TQEdLe98ork8-rNRYPybRI3SKoqpci1m1QOcvUg4xEYRvbZIWku24DNMSeheytKUz6Ni4kKOVkzfGN11rUj1IrlRR-LNA9V9ZYmeoywy3k066rD5TaZHor5bM5gIzt1B4FmUuFITpXKGQZS5Hn_Ck8Bgc8kLWGAU8TzmOzLeROosqKE0eZJ4ESLMImTb2XSEZuN1wFyL0VtJw",
            "e": "AQAB"
        }, {
            "kid": "9f252dadd5f233f93d2fa528d12fea",
            "kty": "RSA",
            "alg": "RS256",
            "use": "sig",
            "n": "qGWf6RVzV2pM8YqJ6by5exoixIlTvdXDfYj2v7E6xkoYmesAjp_1IYL7rzhpUYqIkWX0P4wOwAsg-Ud8PcMHggfwUNPOcqgSk1hAIHr63zSlG8xatQb17q9LrWny2HWkUVEU30PxxHsLcuzmfhbRx8kOrNfJEirIuqSyWF_OBHeEgBgYjydd_c8vPo7IiH-pijZn4ZouPsEg7wtdIX3-0ZcXXDbFkaDaqClfqmVCLNBhg3DKYDQOoyWXrpFKUXUFuk2FTCqWaQJ0GniO4p_ppkYIf4zhlwUYfXZEhm8cBo6H2EgukntDbTgnoha8kNunTPekxWTDhE5wGAt6YpT4Yw",
            "e": "AQAB"
        }
    ]
}
\`\`\`
  

### OIDC: ID 토큰 정보 조회

##### 기본 정보

| 메서드 | URL | 인증 방식 |
| --- | --- | --- |
| `POST` | `https://kauth.kakao.com/oauth/tokeninfo` | \- |

| [권한](https://developers.kakao.com/docs/latest/ko/getting-started/permission) | 사전 설정 | [카카오 로그인](https://developers.kakao.com/docs/latest/ko/kakaologin/common) | [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#scope) |
| --- | --- | --- | --- |
| \- | [플랫폼 등록](https://developers.kakao.com/docs/latest/ko/app-setting/app#platform)   [카카오 로그인 활성화](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#kakao-login-activate)   [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope)   [OpenID Connect 활성화](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#kakao-login-oidc) | 필요 | \- |

  

**주의: API 용도**

ID 토큰 정보 조회 API는 디버깅(Debugging) 용도로 제공하며, 실제 서비스의 ID 토큰 유효성 검증 용도로 사용할 수 없습니다. 용도에 맞지 않는 요청은 차단될 수 있습니다.

ID 토큰 유효성 검증을 위한 참고 정보를 제공합니다. 서비스에서 [OpenID Connect](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#oidc) (OIDC)로 발급받은 [ID 토큰](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#oidc-id-token) 유효성을 검증할 때, 직접 확인한 페이로드(Payload) 값이 이 API의 응답이 일치하는지 대조하여 확인하는 용도로 사용합니다.

`id_token` 파라미터에 ID 토큰 값을 담아 `POST` 로 요청합니다. 요청 성공 시, 요청 시 전달된 ID 토큰의 페이로드 값을 반환합니다. 페이로드만으로는 ID 토큰의 유효성을 검증할 수 없으므로, 서비스에서 자체적으로 [ID 토큰 유효성 검증](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#oidc-id-token-verify) 으로 ID 토큰 유효성을 검증해야 합니다.

#### 요청

##### 헤더

| 이름 | 설명 | 필수 |
| --- | --- | --- |
| Content-Type | `Content-Type: application/x-www-form-urlencoded;charset=utf-8`   요청 데이터 타입 | O |

##### 본문

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| id\_token | `String` | [토큰 요청](https://developers.kakao.com/docs/latest/ko/kakaologin/#request-token) 으로 발급받은 ID 토큰 값 문자열 | O |

##### 응답

- [ID 토큰 페이로드](https://developers.kakao.com/docs/latest/ko/kakaologin/#request-token-response-id-token) 참고

#### 예제

##### 요청

\`\`\`bash
curl -v POST "https://kauth.kakao.com/oauth/tokeninfo" \
    -H "Content-Type: application/x-www-form-urlencoded;charset=utf-8" \
    -d "id_token=${ID_TOKEN}"
\`\`\`

##### 응답: 성공

\`\`\`json
HTTP/1.1 200
{
    "iss": "https://kauth.kakao.com",
    "aud": "${APP_KEY}",
    "sub": "166959",
    "iat": 1647183250,
    "exp": 1647190450,
    "nonce": "${NONCE}",
    "auth_time": 1647183250
}
\`\`\`

##### 응답: 실패, 유효하지 않은 ID 토큰

\`\`\`json
HTTP/1.1 400 Bad Request
{
    "error": "invalid_token",
    "error_description": "${ERROR_DESCRIPTION}",
    "error_code": "KOE400"
}
\`\`\`
  

### OIDC: 사용자 정보 조회

##### 기본 정보

| 메서드 | URL | 인증 방식 |
| --- | --- | --- |
| `GET` | `https://kapi.kakao.com/v1/oidc/userinfo` | 액세스 토큰 |

| [권한](https://developers.kakao.com/docs/latest/ko/getting-started/permission) | 사전 설정 | [카카오 로그인](https://developers.kakao.com/docs/latest/ko/kakaologin/common) | [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#scope) |
| --- | --- | --- | --- |
| \- | [플랫폼 등록](https://developers.kakao.com/docs/latest/ko/app-setting/app#platform)   [카카오 로그인 활성화](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#kakao-login-activate)   [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope)   [OpenID Connect 활성화](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#kakao-login-oidc) | 필요 | 필요:   사용자 정보를 요청할 모든 동의항목 |

  

현재 로그인한 사용자의 정보를 불러옵니다. 이 API는 카카오계정의 기본적인 사용자 정보만을 제공하며, 이 외 사용자 정보는 [사용자 정보 조회](https://developers.kakao.com/docs/latest/ko/kakaologin/#req-user-info) API로 받을 수 있습니다. 사용자 정보의 종류와 상세 설명은 [사용자 정보](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#user-info) 를 참고합니다.

사용자 액세스 토큰을 헤더에 담아 `GET` 으로 요청합니다. 요청 성공 시, 응답 본문에 사용자 정보를 포함한 `JSON` 객체를 반환합니다. 카카오 로그인 동의 화면에서 사용자가 동의하지 않은 항목의 사용자 정보는 응답에 포함되지 않습니다. 를 참고합니다.

#### 요청

##### 헤더

| 이름 | 설명 | 필수 |
| --- | --- | --- |
| Authorization | `Authorization: Bearer ${ACCESS_TOKEN}`   인증 방식, 액세스 토큰으로 인증 요청 | O |

#### 응답

##### 본문

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| sub | `String` | 회원번호 | O |
| name | `String` | 카카오계정 이름      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 이름 | X |
| nickname | `String` | 서비스에서 쓰이는 사용자 닉네임   (기본값: 앱 연결 시 카카오계정 닉네임)      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 프로필 정보(닉네임/프로필 사진) 또는 닉네임 | X |
| picture | `String` | 서비스에서 쓰이는 사용자 썸네일 이미지 URL   (기본값: 앱 연결 시의 카카오계정 썸네일 프로필 사진 URL, 110px\*110px 크기)      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 프로필 정보(닉네임/프로필 사진) 또는 프로필 사진 | X |
| email | `String` | 카카오계정 대표 이메일      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 카카오계정(이메일)   **중요**: [이메일 사용 시 주의 사항](https://developers.kakao.com/docs/latest/ko/kakaologin/common#policy-user-info-email) | X |
| email\_verified | `Boolean` | 카카오계정 이메일의 인증 및 유효 여부   `true`: 인증을 완료했고 유효한 이메일   `false`: 인증을 완료하지 않았거나, 다른 카카오 계정에서 사용돼 유효하지 않은 이메일      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 카카오계정(이메일) | X |
| gender | `String` | 카카오계정 성별   `female`: 여성   `male`: 남성      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 성별 | X |
| birthdate | `String` | 카카오계정 생년월일   필요한 동의항목에 대한 사용자 동의 여부에 따라 제공하는 값 형식 다름   생일만 동의한 경우: `0000-MM-DD` 형식   출생 연도만 동의한 경우: `YYYY` 형식   생일, 출생 연도 모두 동의한 경우: `YYYY-MM-DD` 형식      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 생일, 출생 연도 | X |
| phone\_number | `String` | 카카오계정 전화번호   국내 번호인 경우 `+82 00-0000-0000` 또는 `+82 00 0000 0000` 형식   해외 번호인 경우 자릿수, 하이픈(-) 유무나 위치가 다를 수 있음   (참고: [libphonenumber](https://github.com/google/libphonenumber))      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 카카오계정(전화번호) | X |
| phone\_number\_verified | `Boolean` | 카카오계정 전화번호 인증 여부   `phone_number` 값 존재 시 `true` 로 고정      [**필요한 동의항목**](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#scope): 카카오계정(전화번호) | X |

#### 예제

##### 요청

\`\`\`bash
curl -v -G GET "https://kapi.kakao.com/v1/oidc/userinfo" \
 -H "Authorization: Bearer ${ACCESS_TOKEN}"
\`\`\`

##### 응답: 성공

\`\`\`json
HTTP/ 1.1 200 OK
{
    "sub": "123456789",
    "name": "홍길동",
    "nickname": "홍길동",
    "picture": "${IMAGE_PATH}",
    "email": "sample@sample.com",
    "email_verified": true,
    "gender": "MALE",
    "birthdate": "2002-11-30",
    "phone_number": "+82 00-0000-0000",
    "phone_number_verified": true
}
\`\`\`

## 고급: 수동 연결

##### 기본 정보

| 메서드 | URL | 인증 방식 |
| --- | --- | --- |
| `POST` | `https://kapi.kakao.com/v1/user/signup` | 액세스 토큰 |

| [권한](https://developers.kakao.com/docs/latest/ko/getting-started/permission) | 사전 설정 | [카카오 로그인](https://developers.kakao.com/docs/latest/ko/kakaologin/common) | [동의항목](https://developers.kakao.com/docs/latest/ko/kakaologin/utilize#scope) |
| --- | --- | --- | --- |
| 필요: 수동 연결 설정 | [플랫폼 등록](https://developers.kakao.com/docs/latest/ko/app-setting/app#platform)   [카카오 로그인 활성화](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#kakao-login-activate) | 필요 | \- |

  

**주의: 자동 연결 사용 여부 확인**

수동 연결 API는 자동 연결을 사용하지 않는 앱에서만 사용하는 API입니다. 사용 중인 앱의 자동 연결 사용 여부는 [앱 관리 페이지](https://developers.kakao.com/console/app) 의 \[카카오 로그인\] > \[로그인 시 앱 자동 연결\] 메뉴에서 확인할 수 있습니다. 해당 설정이 노출되지 않는다면 자동 연결을 사용하는 앱입니다. \[로그인 시 앱 자동 연결\] 설정이 노출된다면 자동 연결 사용 여부를 설정할 수 있는 앱으로, \[사용 안함\]으로 설정돼 있을 경우 수동 연결 API를 사용해야 합니다.

수동 연결 API는 **자동 연결** 을 \[사용 안함\]으로 설정한 앱에서 앱과 사용자를 수동으로 연결하는 기능입니다. 자동 연결은 카카오 로그인 완료 시 앱과 사용자를 자동으로 연결하는 기능으로, 필요 시 카카오와 협의를 거쳐 자동 연결의 사용 여부를 설정할 수 있습니다. 아래는 앱과 사용자를 수동으로 연결하고자 하는 경우의 예시입니다.

- 사용자가 카카오 로그인 및 서비스 이용에 동의한 직후 서비스에 가입 완료되지 않는 경우
	- 사용자가 카카오 로그인 후 별도 정보 입력이나 인증 절차를 거쳐 가입 완료하는 경우
	- 사용자가 즉시 가입되지 않고, 서비스에서 일정 주기로 사용자의 가입을 승인하는 경우
- 이 외, 서비스에서 사용자의 앱 연결 상태를 직접 관리해야 할 필요가 있는 경우

자동 연결을 사용하지 않는 서비스는 **반드시 수동 연결 API를 호출해 사용자와 앱을 직접 연결** 해야 합니다. 또한 사용자의 서비스 가입 상태와 앱 연결 상태가 일치하는지 확인하고 수동 연결 및 연결 해제 API를 호출해 사용자의 연결 상태를 관리해야 합니다. 따라서 반드시 필요한 경우가 아니라면 기본 설정인 자동 연결을 사용하는 것을 권장합니다.

**가입 미완료자 연결 해제 처리**

사용자가 연결 대기 상태에서 24시간 안에 수동 연결 API 요청으로 연결 완료되지 않는다면, 가입 미완료자로 분류되어 카카오 API 플랫폼에서 연결 해제 처리합니다. 연결 해제 시 [연결 해제 설정](https://developers.kakao.com/docs/latest/ko/app-setting/app#unlink-webhook) 이 되어 있다면 웹훅(Webhook)이 전달되므로, 서비스에서도 해당 사용자에 대해 [연결 해제](https://developers.kakao.com/docs/latest/ko/kakaologin/#unlink) 요청 및 사용자 정보 삭제를 해야 합니다. 자세한 정보는 [공지사항](https://devtalk.kakao.com/t/notice-unlink-for-users-who-have-not-completed-a-signup) 을 참고합니다.

액세스 토큰을 헤더에 담아 `POST` 로 요청합니다. 요청 시 `properties` 파라미터를 사용해 [사용자 프로퍼티](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#user-properties) 값 저장을 함께 요청할 수 있습니다. 사용자 프로퍼티 값은 사용자 연결 후 [사용자 프로퍼티 저장 API](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#properties) 로도 저장할 수 있으며 [연결 해제](https://developers.kakao.com/docs/latest/ko/kakaologin/#unlink) 시 삭제됩니다.

##### 참고: 사용자 연결 상태에 따른 사용자 정보 제공 범위

수동 연결 API를 요청하지 않아 사용자가 앱과 연결 완료되지 않은 연결 대기(Preregistered) 상태인 경우, 아래의 일부 사용자 정보만 [사용자 정보 조회](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#req-user-info) 및 [여러 사용자 정보 조회 API](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#user-info-list) 로 제공합니다.

| Name | Key |
| --- | --- |
| 회원번호 | `id` |
| 고유 ID | `for_partner.uuid` |
| 프로필 정보(닉네임/프로필 사진) | `kakao_account.profile` |
| 연결 여부 | `has_signed_up` |
| 연결 시각 | `connected_at` |
| 카카오계정(이메일) | `kakao_account.email` |
| 유효 이메일 여부 | `is_email_valid` |
| 이메일 인증 여부 | `is_email_verified` |

#### 요청

##### 헤더

| 이름 | 설명 | 필수 |
| --- | --- | --- |
| Authorization | `Authorization: Bearer ${ACCESS_TOKEN}`   인증 방식, 액세스 토큰으로 인증 요청 | O |
| Content-Type | `Content-Type: application/x-www-form-urlencoded;charset=utf-8`   요청 데이터 타입 | O |

##### 본문

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| properties | `JSON` | `{"key":"value"}` 형태의 사용자 정보 리스트   수동 연결 시 사용자 프로퍼티 값을 저장하고자 할 때 전달   [사용자 프로퍼티](https://developers.kakao.com/docs/latest/ko/kakaologin/prerequisite#user-properties) 및 [사용자 프로퍼티 저장](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#properties) 참고 | X |

#### 응답

##### 본문

| 이름 | 타입 | 설명 | 필수 |
| --- | --- | --- | --- |
| id | `Long` | 앱과 연결된 사용자 회원번호 | O |

#### 예제

##### 요청: 사용자 프로퍼티 저장 없이 수동 연결만 요청

\`\`\`bash
curl -v -X POST "https://kapi.kakao.com/v1/user/signup" \
    -H "Content-Type: application/x-www-form-urlencoded;charset=utf-8" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}"
\`\`\`

##### 요청: 수동 연결 요청 시 사용자 프로퍼티 저장

\`\`\`bash
curl -v -X POST "https://kapi.kakao.com/v1/user/signup" \
    -H "Content-Type: application/x-www-form-urlencoded;charset=utf-8" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}" \
    --data-urlencode 'properties={"${CUSTOM_PROPERTY_KEY}":"${CUSTOM_PROPERTY_VALUE}"}'
\`\`\`

##### 응답: 성공

\`\`\`json
HTTP/1.1 200 OK
{
    "id":1376016924429759228
}
\`\`\`

##### 응답: 실패, 앱과 이미 연결되어 있는 사용자인 경우

\`\`\`json
HTTP/1.1 400 Bad Request
{
    "msg":"already registered",
    "code":-102
}
\`\`\`

##### 응답: 실패, 요청 시 사용한 액세스 토큰이 유효하지 않은 경우

\`\`\`json
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer error=invalid_token
{
    "msg":"this access token does not exist",
    "code":-401
}
\`\`\`

##### 응답: 실패, 앱에 설정돼 있지 않은 사용자 프로퍼티 저장을 요청한 경우

\`\`\`json
HTTP/1.1 400 Bad Request
{
    "msg":"user property not found ([gender, age] for appId=${APP_ID})",
    "code":-201
}
\`\`\`
