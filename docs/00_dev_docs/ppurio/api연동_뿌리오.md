---
title: "문자 서비스 1위"
source: "https://www.ppurio.com/send-api/develop"
author:
  - "[[뿌리오]]"
published:
created: 2025-09-26
description: "단체문자 1위 뿌리오! 대량문자, RCS, 포토문자, 후불문자, 예약문자, API연동, 알림톡/브랜드메시지까지!"
tags:
  - "clippings"
---
**연동 개발(API) 인증키

**연동 개발(API) 인증키**

인증키 : **d55f01a941947acd711702ede3f90b74fdda318a78ed26dbde193cceeb0af4ac**

\* 발급일자 : 2025-08-19 09:23:53

* *-*API 연동 인증키는 신규 연동 API에서 활용할 수 있습니다 .(API V1 이상)
* *-*해당 인증키는 타인에게 공유하지 마시고, 분실 또는 오류가 발생할 경우 연동 상담 창구(070-8707-1635)로 문의 하시기 바랍니다.

## 

PPURIO API 1.0.0

OAS3

뿌리오 문자연동 API Docs

Servers

https://message.ppurio.com

Authorize

### [인증](https://message.ppurio.com/api-docs/#/%EC%9D%B8%EC%A6%9D)

POST[/v1/token](https://message.ppurio.com/api-docs/#/%EC%9D%B8%EC%A6%9D/post_v1_token)

엑세스 토큰 발급

메시지 발송 API 사용을 위해 필요한 엑세스 토큰을 발급받기 위한 **<엑세스 토큰 발급 API>** 입니다.
토큰의 유효기간은 1일이며, 발급 받은 후 1일이 지난 경우에 다시 발급 받아야 합니다. 문자연동 정보나 사용자 정보가 변경된 경우에도 다시 발급 받아야 합니다.

_Note: 연동IP 등록, auth key 발급이 선행되어야 합니다. **문자 연동 > 문자 연동 관리**에서 확인할 수 있습니다._

## 1. Header


| Name          | Description                                                                                                                                                                                   |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Authorization | Basic Authentication 방식이며,**계정:뿌리오 개발 인증키**를 Base64 인코딩한 값을 포함시켜야 합니다.  <br>헤더값에 반드시 _Basic_을 포함해야 하며 _Basic_과 값 사이에 공백을 넣어야만 합니다 |

_Note: Authorization 헤더 설정은 우측 상단의 Authorize 버튼을 통해 진행할 수 있습니다. (Username : 계정, Password : 뿌리오 개발 인증키)_

#### Parameters

Cancel

No parameters

ExecuteClear

#### Responses

#### Curl

\`\`\`bash
curl -X 'POST' \
  'https://message.ppurio.com/v1/token' \
  -H 'accept: application/json' \
  -d ''
\`\`\`

#### Request URL

https://message.ppurio.com/v1/token

#### Server response


| Code | Details                                                                                                                                                                                                                                                                                                                                 |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 400  | Error: Bad Request<br><br>##### Response body<br><br>Download<br><br>```json<br>{<br>  "code": "3001",<br>  "description": "invalid basic Authentication"<br>}<br>```<br><br>##### Response headers<br><br> connection: keep-alive content-length: 60  content-type: application/json; charset=utf-8 date: Fri,26 Sep 2025 09:02:26 GMT |

#### Responses


| Code | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Links      |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| 200  | Media type<br><br>application/json<br><br>Controls `Accept` header.<br><br>- Example Value<br>- Schema<br><br>```json<br>{<br>  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ2ZwxvcGVydC5jb20iLCJleHAiOiIxNDg1MjcwMDAwMDAwIiwiaHR0cHM6Ly92ZwxvcGVydC5jb20vand0X2NsYWltcy9pc19hZG1pbiI6dHJ1ZswidXNlcklkIjoiMTEwMjgzNzM3MjcxMDIiLCJ1c2VybmFtZSI6InZlbG9wZXJ0In0.WE5fMufM0NDSVGJ8cAolXGkyB5RmYwCto1pQwDIqo2w",<br>  "type": "Bearer",<br>  "expired": 20201110185520<br>}<br>```                        | _No links_ |
| 400  | \|Code\|Reason\|<br>\|---\|---\|<br>\|3001\|토큰 발급 호출 시, Authorization 헤더가 유효하지 않음\|<br>\|3003\|아이피가 유효하지 않음\|<br>\|3004\|계정이 유효하지 않음\|<br>\|3007\|엑세스 토큰 발행 실패\|<br>\|4004\|api 접근 권한이 비활성화 상태\|<br>\|4006\|인증키가 유효하지 않음\|<br>\|4007\|인증키를 발행 받지 않음\|<br><br>Media type<br><br>application/json<br><br>- Example Value<br>- Schema<br><br>```json<br>{<br>  "code": 3001,<br>  "description": "invalid basic Authentication"<br>}<br>``` | _No links_ |
| 500  | \|Code\|Reason\|<br>\|---\|---\|<br>\|9000~9999\|서버에서 알 수 없는 오류가 발생함\|                                                                                                                                                                                                                                                                                                                                                                                                                                | _No links_ |

### [발송](https://message.ppurio.com/api-docs/#/%EB%B0%9C%EC%86%A1)

POST[/v1/message](https://message.ppurio.com/api-docs/#/%EB%B0%9C%EC%86%A1/post_v1_message)

메시지 발송

SMS/LMS/MMS 메시지를 발송할 수 있는 **<메시지 발송 API>** 입니다.

_Note: 엑세스 토큰 발급이 선행되어야 합니다._

## 1. Header


| Name          | Description                                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Authorization | **엑세스 토큰**을 포함해야 하는 헤더, 헤더값에 반드시 Bearer를 명시해야 하며 Bearer와 **엑세스 토큰**사이에 공백을 넣어야만 합니다. |

_Note: Authorization 헤더 설정은 우측 상단의 Authorize 버튼을 통해 진행할 수 있습니다._

## 2. Body


| NAME          | TYPE       | REQUIRED        | DESCRIPTION                                                             |
| ------------- | ---------- | --------------- | ----------------------------------------------------------------------- |
| account       | text(20)   | O               | 뿌리오 계정                                                             |
| messageType   | text(3)    | O               | SMS/LMS/MMS                                                             |
| content       | text(2000) | O               | 메시지 내용 (SMS : 90byte, MMS/LMS : 2000byte)                          |
| from          | text(16)   | O               | 발신 번호                                                               |
| duplicateFlag | text(1)    | O               | 수신 번호 중복 여부(Y:중복 허용, N:중복 제거)                           |
| targetCount   | number     | O               | 수신자 목록 수                                                          |
| targets       | array      | O               | 수신자 목록(아래 targets 참조)                                          |
| refKey        | text(32)   | O               | 고객사에서 부여한 키                                                    |
| rejectType    | text(2)    | X               | 수신거부 설정 및 유형 선택(AD: 광고 수신거부)                           |
| sendTime      | text(19)   | X               | 예약 발송 시간`yyyy-MM-ddTHH:mm:ss` (최소 3분 이후, 최대 다음 해 말일) |
| subject       | text(30)   | X               | 제목                                                                    |
| files         | array      | MMS 발송시 필수 | MMS 발송 시 첨부 파일 (아래 files 참조)                                 |

**2-1. targets**


| NAME       | TYPE      | REQUIRED | DESCRIPTION                       |
| ---------- | --------- | -------- | --------------------------------- |
| to         | text(16)  | O        | 수신 번호                         |
| changeWord | json      | X        | 치환 문구 (아래 changedWord 참조) |
| name       | text(100) | X        | [*이름*] 치환 문구                |

**2-1-1. changeWord**


| NAME | TYPE      | REQUIRED | DESCRIPTION     |
| ---- | --------- | -------- | --------------- |
| var1 | text(100) | X        | [*1*] 치환 문구 |
| var2 | text(100) | X        | [*2*] 치환 문구 |
| var3 | text(100) | X        | [*3*] 치환 문구 |
| var4 | text(100) | X        | [*4*] 치환 문구 |
| var5 | text(100) | X        | [*5*] 치환 문구 |
| var6 | text(100) | X        | [*6*] 치환 문구 |
| var7 | text(100) | X        | [*7*] 치환 문구 |

**2-2. files**


| NAME | TYPE      | REQUIRED        | DESCRIPTION          |
| ---- | --------- | --------------- | -------------------- |
| name | text(200) | MMS 발송시 필수 | 파일 명              |
| size | number    | MMS 발송시 필수 | 파일 크기, byte 단위 |
| data | text      | MMS 발송시 필수 | 업로드할 이미지 파일 |

_Note:MMS 발송 시 사용될 이미지입니다, 바이너리 형식인 이미지 파일을 Base64로 인코딩하여 텍스트로 입력합니다. (파일 형식 및 크기 : jpg, jpeg / 최대 300KB)_

#### Parameters

Try it out

No parameters

#### Request body

application/json

메시지 발송 정보

- Example Value
- Schema

\`\`\`json
{
  "account": "뿌리오 계정",
  "messageType": "MMS",
  "content": "[*이름*] [*1*] [*2*] [*3*] [*4*] [*5*] [*6*] [*7*]",
  "from": "발신번호",
  "duplicateFlag": "N",
  "targetCount": 1,
  "targets": [
    {
      "to": "수신번호",
      "changeWord": {
        "var1": "치환변수1",
        "var2": "치환변수2",
        "var3": "치환변수3",
        "var4": "치환변수4",
        "var5": "치환변수5",
        "var6": "치환변수6",
        "var7": "치환변수7"
      },
      "name": "이름"
    }
  ],
  "refKey": "refKey",
  "rejectType": "AD",
  "sendTime": "2022-01-01T12:00:00",
  "subject": "제목",
  "files": [
    {
      "name": "image.jpg",
      "size": 50,
      "data": "바이너리 형식인 이미지 파일을 Base64 인코딩한 텍스트"
    }
  ]
}
\`\`\`

#### Responses


| Code | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Links      |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| 200  | \|Code\|Reason\|<br>\|---\|---\|<br>\|1000\|메시지 발송 요청이 정상적으로 처리됨\|<br><br>Media type<br><br>application/json<br><br>Controls `Accept` header.<br><br>- Example Value<br>- Schema<br><br>```json<br>{<br>  "code": 1000,<br>  "description": "ok",<br>  "refKey": "test",<br>  "messsageKey": "221128133505801SMS010542suchUL8P"<br>}<br>```                                                                                                                                                                                                                                                                                   | _No links_ |
| 400  | \|Code\|Reason\|<br>\|---\|---\|<br>\|2000\|잘못된 요청\|<br>\|3001\|토큰 발급 호출 시, Authorization 헤더가 유효하지 않음\|<br>\|3002\|토큰이 유효하지 않음\|<br>\|3003\|아이피가 유효하지 않음\|<br>\|3004\|계정이 유효하지 않음\|<br>\|3005\|토큰이 유효하지 않음\|<br>\|3006\|Authentication Header가 유효하지 않음\|<br>\|3008\|너무 많은 요청\|<br>\|4004\|api 접근 권한이 비활성화 상태\|<br>\|4006\|인증키가 유효하지 않음\|<br>\|4007\|인증키를 발행 받지 않음\|<br><br>Media type<br><br>application/json<br><br>- Example Value<br>- Schema<br><br>```json<br>{<br>  "code": 2000,<br>  "description": "invalid message"<br>}<br>``` | _No links_ |
| 500  | \|Code\|Reason\|<br>\|---\|---\|<br>\|9000~9999\|서버 오류\|                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | _No links_ |

POST[/v1/kakao](https://message.ppurio.com/api-docs/#/%EB%B0%9C%EC%86%A1/post_v1_kakao)

카카오(알림톡) 발송

카카오(알림톡) 메시지를 발송할 수 있는 **<카카오(알림톡) 발송 API>** 입니다.

_Note: 엑세스 토큰 발급이 선행되어야 합니다. | 발신프로필 키 및 템플릿 코드를 뿌리오에서 저장해야 합니다._

## 1. Header


| Name          | Description                                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Authorization | **엑세스 토큰**을 포함해야 하는 헤더, 헤더값에 반드시 Bearer를 명시해야 하며 Bearer와 **엑세스 토큰**사이에 공백을 넣어야만 합니다. |

_Note: Authorization 헤더 설정은 우측 상단의 Authorize 버튼을 통해 진행할 수 있습니다._

## 2. Body


| NAME          | TYPE      | REQUIRED | DESCRIPTION                                                             |
| ------------- | --------- | -------- | ----------------------------------------------------------------------- |
| account       | text(20)  | O        | 뿌리오 계정                                                             |
| messageType   | text(3)   | O        | ALT/ALL/ALH/ALI                                                         |
| senderProfile | text(20)  | O        | 발신프로필명                                                            |
| templateCode  | text(100) | O        | 템플릿 코드                                                             |
| duplicateFlag | text(1)   | O        | 수신 번호 중복 여부(Y:중복 허용, N:중복 제거)                           |
| isResend      | text(1)   | O        | 대체 발송 지원 여부(Y:허용, N:비허용)                                   |
| targetCount   | number    | O        | 수신자 목록 수                                                          |
| targets       | array     | O        | 수신자 목록(아래 targets 참조)                                          |
| refKey        | text(32)  | O        | 고객사에서 부여한 키                                                    |
| sendTime      | text(19)  | X        | 예약 발송 시간`yyyy-MM-ddTHH:mm:ss` (최소 3분 이후, 최대 다음 해 말일) |
| resend        | array     | X        | 대체문자 발송 정보                                                      |

**2-1. targets**


| NAME       | TYPE      | REQUIRED | DESCRIPTION                       |
| ---------- | --------- | -------- | --------------------------------- |
| to         | text(16)  | O        | 수신 번호                         |
| changeWord | json      | X        | 치환 문구 (아래 changedWord 참조) |
| name       | text(100) | X        | [*이름*] 치환 문구                |

**2-1-1. changeWord**


| NAME | TYPE      | REQUIRED | DESCRIPTION     |
| ---- | --------- | -------- | --------------- |
| var1 | text(100) | X        | [*1*] 치환 문구 |
| var2 | text(100) | X        | [*2*] 치환 문구 |
| var3 | text(100) | X        | [*3*] 치환 문구 |
| var4 | text(100) | X        | [*4*] 치환 문구 |
| var5 | text(100) | X        | [*5*] 치환 문구 |
| var6 | text(100) | X        | [*6*] 치환 문구 |
| var7 | text(100) | X        | [*7*] 치환 문구 |

**2-2. resend**


| NAME        | TYPE       | REQUIRED        | DESCRIPTION                                    |
| ----------- | ---------- | --------------- | ---------------------------------------------- |
| messageType | text(3)    | O               | SMS/LMS/MMS                                    |
| content     | text(2000) | O               | 메시지 내용 (SMS : 90byte, MMS/LMS : 2000byte) |
| from        | text(16)   | O               | 발신 번호                                      |
| subject     | text(30)   | X               | 제목                                           |
| files       | array      | MMS 발송시 필수 | MMS 발송 시 첨부 파일 (v1/message files 참조)  |

#### Parameters

Cancel

No parameters

#### Request body

application/json

카카오 발송 정보

ExecuteClear

#### Responses

#### Curl

\`\`\`bash
curl -X 'POST' \
  'https://message.ppurio.com/v1/kakao' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "account": "뿌리오 계정",
  "messageType": "ALT",
  "senderProfile": "@뿌리오",
  "templateCode": "ppur_2024020514240922798543242",
  "duplicateFlag": "N",
  "targetCount": 1,
  "targets": [
    {
      "to": "수신번호",
      "changeWord": {
        "var1": "치환변수1",
        "var2": "치환변수2",
        "var3": "치환변수3",
        "var4": "치환변수4",
        "var5": "치환변수5",
        "var6": "치환변수6",
        "var7": "치환변수7"
      },
      "name": "이름"
    }
  ],
  "refKey": "refKey",
  "sendTime": "2022-01-01T12:00:00",
  "isResend": "N",
  "resend": [
    {
      "messageType": "ALT",
      "content": "[*이름*] [*1*] [*2*] [*3*] [*4*] [*5*] [*6*] [*7*]",
      "from": "발신번호",
      "subject": "제목",
      "files": [
        {
          "fileKey": "fileKey",
          "fileName": "fileName",
          "fileType": "fileType",
          "fileUrl": "fileUrl"
        }
      ]
    }
  ]
}'
\`\`\`

#### Request URL

https://message.ppurio.com/v1/kakao

#### Server response


| Code | Details                                                                                                                                                                                                                                                                                                                                               |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 400  | Error: Bad Request<br><br>##### Response body<br><br>Download<br><br>```json<br>{<br>  "code": "2000",<br>  "description": "'targets/0/to' must be phone number format"<br>}<br>```<br><br>##### Response headers<br><br> connection: keep-alive content-length: 74  content-type: application/json; charset=utf-8 date: Fri,26 Sep 2025 09:02:55 GMT |

#### Responses


| Code | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Links      |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| 200  | \|Code\|Reason\|<br>\|---\|---\|<br>\|1000\|카카오 발송 요청이 정상적으로 처리됨\|<br><br>Media type<br><br>application/json<br><br>Controls `Accept` header.<br><br>- Example Value<br>- Schema<br><br>```json<br>{<br>  "code": 1000,<br>  "description": "ok",<br>  "refKey": "test",<br>  "messsageKey": "221128133505801SMS010542suchUL8P"<br>}<br>```                                                                                                                                                                                                                                                                                   | _No links_ |
| 400  | \|Code\|Reason\|<br>\|---\|---\|<br>\|2000\|잘못된 요청\|<br>\|3001\|토큰 발급 호출 시, Authorization 헤더가 유효하지 않음\|<br>\|3002\|토큰이 유효하지 않음\|<br>\|3003\|아이피가 유효하지 않음\|<br>\|3004\|계정이 유효하지 않음\|<br>\|3005\|토큰이 유효하지 않음\|<br>\|3006\|Authentication Header가 유효하지 않음\|<br>\|3008\|너무 많은 요청\|<br>\|4004\|api 접근 권한이 비활성화 상태\|<br>\|4006\|인증키가 유효하지 않음\|<br>\|4007\|인증키를 발행 받지 않음\|<br><br>Media type<br><br>application/json<br><br>- Example Value<br>- Schema<br><br>```json<br>{<br>  "code": 2000,<br>  "description": "invalid message"<br>}<br>``` | _No links_ |
| 500  | \|Code\|Reason\|<br>\|---\|---\|<br>\|9000~9999\|서버 오류\|                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | _No links_ |

### [예약발송 취소](https://message.ppurio.com/api-docs/#/%EC%98%88%EC%95%BD%EB%B0%9C%EC%86%A1%20%EC%B7%A8%EC%86%8C)

POST[/v1/cancel](https://message.ppurio.com/api-docs/#/%EC%98%88%EC%95%BD%EB%B0%9C%EC%86%A1%20%EC%B7%A8%EC%86%8C/post_v1_cancel)

문자 예약발송 취소

문자 예약발송을 취소할 수 있는 **<예약발송 취소 API>** 입니다.
발송 진행 중이거나, 발송 시간까지 1분 이하로 남은 경우 취소는 불가능합니다.

_Note: 엑세스 토큰 발급이 선행되어야 합니다._

## 1. Header


| Name          | Description                                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Authorization | **엑세스 토큰**을 포함해야 하는 헤더, 헤더값에 반드시 Bearer를 명시해야 하며 Bearer와 **엑세스 토큰**사이에 공백을 넣어야만 합니다. |

_Note: Authorization 헤더 설정은 우측 상단의 Authorize 버튼을 통해 진행할 수 있습니다._

## 2. Body


| NAME       | TYPE     | REQUIRED | DESCRIPTION    |
| ---------- | -------- | -------- | -------------- |
| account    | text(20) | O        | 뿌리오 계정    |
| messageKey | text(33) | O        | 고유 메시지 키 |

#### Parameters

Try it out

No parameters

#### Request body

application/json

예약 발송 취소 정보

- Example Value
- Schema

\`\`\`json
{
  "account": "뿌리오 계정",
  "messageKey": "221128133505801SMS010542suchUL8P"
}
\`\`\`

#### Responses


| Code | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Links      |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| 200  | \|Code\|Reason\|<br>\|---\|---\|<br>\|1000\|예약발송 취소 요청이 정상적으로 처리됨\|<br><br>Media type<br><br>application/json<br><br>Controls `Accept` header.<br><br>- Example Value<br>- Schema<br><br>```json<br>{<br>  "code": 1000,<br>  "description": "ok"<br>}<br>```                                                                                                                                                                                                                                                                                                                       | _No links_ |
| 400  | \|Code\|Reason\|<br>\|---\|---\|<br>\|2000\|잘못된 요청\|<br>\|2001\|잘못된 URL\|<br>\|3002\|토큰이 유효하지 않음\|<br>\|3003\|아이피가 유효하지 않음\|<br>\|3004\|계정이 유효하지 않음\|<br>\|3005\|인증 정보가 유효하지 않음 (bearer)\|<br>\|3006\|Authentication Header가 유효하지 않음\|<br>\|3008\|너무 많은 요청\|<br>\|4004\|api 접근 권한이 비활성화 상태\|<br>\|4006\|인증키가 유효하지 않음\|<br>\|4007\|인증키를 발행 받지 않음\|<br>\|4009\|메시지키가 유효하지 않음\|<br>\|4010\|예약 취소 가능 시간이 지남\|<br>\|4011\|메시지가 이미 발송중인 상태\|<br>\|4012\|예약을 취소할 수 없음\| | _No links_ |
| 500  | \|Code\|Reason\|<br>\|---\|---\|<br>\|9000~9999\|서버 오류\|                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | _No links_ |

POST[/v1/cancel/kakao](https://message.ppurio.com/api-docs/#/%EC%98%88%EC%95%BD%EB%B0%9C%EC%86%A1%20%EC%B7%A8%EC%86%8C/post_v1_cancel_kakao)

카카오톡 예약발송 취소

카카오톡 예약발송을 취소할 수 있는 **<예약발송 취소 API>** 입니다.
발송 진행 중이거나, 발송 시간까지 1분 이하로 남은 경우 취소는 불가능합니다.

_Note: 엑세스 토큰 발급이 선행되어야 합니다._

## 1. Header


| Name          | Description                                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Authorization | **엑세스 토큰**을 포함해야 하는 헤더, 헤더값에 반드시 Bearer를 명시해야 하며 Bearer와 **엑세스 토큰**사이에 공백을 넣어야만 합니다. |

_Note: Authorization 헤더 설정은 우측 상단의 Authorize 버튼을 통해 진행할 수 있습니다._

## 2. Body


| NAME       | TYPE     | REQUIRED | DESCRIPTION    |
| ---------- | -------- | -------- | -------------- |
| account    | text(20) | O        | 뿌리오 계정    |
| messageKey | text(33) | O        | 고유 메시지 키 |

#### Parameters

Try it out

No parameters

#### Request body

application/json

예약 발송 취소 정보

- Example Value
- Schema

\`\`\`json
{
  "account": "뿌리오 계정",
  "messageKey": "221128133505801SMS010542suchUL8P"
}
\`\`\`

#### Responses


| Code | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Links      |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| 200  | \|Code\|Reason\|<br>\|---\|---\|<br>\|1000\|예약발송 취소 요청이 정상적으로 처리됨\|<br><br>Media type<br><br>application/json<br><br>Controls `Accept` header.<br><br>- Example Value<br>- Schema<br><br>```json<br>{<br>  "code": 1000,<br>  "description": "ok"<br>}<br>```                                                                                                                                                                                                                                                                                                                       | _No links_ |
| 400  | \|Code\|Reason\|<br>\|---\|---\|<br>\|2000\|잘못된 요청\|<br>\|2001\|잘못된 URL\|<br>\|3002\|토큰이 유효하지 않음\|<br>\|3003\|아이피가 유효하지 않음\|<br>\|3004\|계정이 유효하지 않음\|<br>\|3005\|인증 정보가 유효하지 않음 (bearer)\|<br>\|3006\|Authentication Header가 유효하지 않음\|<br>\|3008\|너무 많은 요청\|<br>\|4004\|api 접근 권한이 비활성화 상태\|<br>\|4006\|인증키가 유효하지 않음\|<br>\|4007\|인증키를 발행 받지 않음\|<br>\|4009\|메시지키가 유효하지 않음\|<br>\|4010\|예약 취소 가능 시간이 지남\|<br>\|4011\|메시지가 이미 발송중인 상태\|<br>\|4012\|예약을 취소할 수 없음\| | _No links_ |
| 500  | \|Code\|Reason\|<br>\|---\|---\|<br>\|9000~9999\|서버 오류\|                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | _No links_ |
