---
title: "고객 문의 자동 응답 시스템에서 문자(SMS) 알림 추가 구현"
source: "https://www.gpters.org/nocode/post/additional-text-notifications-automatic-NJGoHTKHV8xS1yH"
author:
  - "[[컷팅스타]]"
published: 2025-02-11
created: 2025-08-15
description: "📅 소개 지난번에는 고객이 구글폼을 통해 문의를 남기면, AI를 활용해 자동으로 이메일 응답을 생성하는 시스템을 구축했습니다. 이번에는 한 단계 더 나아가, 이메일이 전송되었음을 고객에게 즉시 문자(SMS)로 알리는 기능을 추가 구현했습니다. 이를 통해 고객은 문의가 정상적으로 처리되었는지 실시간으로 확인할 수 있으며, 이메일을 놓치는 경우에도 중요한 정보를 즉..."
tags:
  - "clippings"
---
[♻️](https://www.gpters.org/nocode)

[노코드 / 로우코드 자동화](https://www.gpters.org/nocode)

## 📅 소개

지난번에는 고객이 구글폼을 통해 문의를 남기면, AI를 활용해 자동으로 이메일 응답을 생성하는 시스템을 구축했습니다.

이번에는 한 단계 더 나아가, 이메일이 전송되었음을 고객에게 즉시 문자(SMS)로 알리는 기능을 추가 구현했습니다.

이를 통해 고객은 문의가 정상적으로 처리되었는지 실시간으로 확인할 수 있으며, 이메일을 놓치는 경우에도 중요한 정보를 즉시 확인할 수 있습니다.

## 🔧 구현 과정

### ✅ 사용 도구

- **Google Apps Script (GAS)**: Google Forms와 스프레드시트에서 데이터를 처리
- **뿌리오 API**: 문자(SMS) 발송을 위해 활용
- **ChatGPT API**: 고객 문의 자동 답변 생성

### 📝 전체 흐름

1. **고객이 Google Forms를 통해 문의를 제출**
2. **Google Apps Script가 자동 실행되어 문의 데이터를 처리**
3. **ChatGPT를 활용해 문의에 대한 답변을 생성**
4. **이메일을 통해 고객에게 답변 전송**
5. **뿌리오 API를 사용하여 고객에게 "이메일이 전송되었음"을 문자(SMS)로 알림**
6. **처리된 상태를 Google 스프레드시트에 기록**
- 메인함수 중 문자 자동 전송을 위해 추가된 부분

\`\`\`
/**
 * 전화번호에서 숫자를 제외한 나머지 문자를 제거하는 헬퍼 함수
 * @param {string} phoneNumber - 원본 전화번호 문자열
 * @return {string} - 숫자만 남은 전화번호 문자열
 */
function cleanPhoneNumber(phoneNumber) {
  return String(phoneNumber).replace(/[^0-9]/g, '');
}

/**
 * 문자 발송 함수
 * - ppurioGetAccessToken() 함수를 통해 액세스 토큰을 발급 받고,
 * - ppurioSendMessage(token, phoneNumber)를 호출하여 문자 메시지를 발송합니다.
 * - 전화번호를 발송 전에 cleanPhoneNumber() 함수를 사용하여 정리합니다.
 * 
 * @param {string} phoneNumber - 발신자(또는 수신자) 전화번호
 * @throws 액세스 토큰 발급 또는 메시지 전송에 실패한 경우 예외 발생
 */
function sendCustomerSMS(phoneNumber) {
  // 전화번호에서 숫자가 아닌 문자를 제거
  const cleanedPhoneNumber = cleanPhoneNumber(phoneNumber);
  Logger.log("Cleaned Phone Number: " + cleanedPhoneNumber);
  
  var token = ppurioGetAccessToken();
  Logger.log("Access Token: " + token);
  
  if (!token) {
    throw new Error("문자 발송 실패: 액세스 토큰 발급에 실패했습니다.");
  }
  
  var messageKey = ppurioSendMessage(token, cleanedPhoneNumber);
  Logger.log("Message sent to " + cleanedPhoneNumber + " with Message Key: " + messageKey);
  
  if (!messageKey) {
    throw new Error("문자 발송 실패: 메시지 발송에 실패했습니다.");
  }
}

/* 
 * 아래의 함수들은 별도 구현 필요:
 * - preparePDFAttachment() : PDF 첨부 파일 준비 함수
 * - generateChatGPTResponse(inquiry) : 문의 내용에 따른 ChatGPT 응답 생성 함수
 * - createEmailContent(name, chatGPTResponse) : 이메일 본문 생성 함수
 * - sendCustomerEmail(email, subject, content, attachment) : 고객에게 이메일 발송 함수
 * - logProcessResult(row, status, message) : 처리 결과 로깅 함수
 * - ppurioGetAccessToken() : 문자 발송 API 액세스 토큰 발급 함수
 * - ppurioSendMessage(token, phoneNumber) : 문자 메시지 전송 함수
 */
\`\`\`

- 문자 자동 전송을 위한 함수

\`\`\`
// 전역 상수 설정
const API_URL = "https://message.ppurio.com";
const USER_NAME = "onix7";
const TOKEN = "5af40866e7b1b73c1c5ecd084cd8e578805617ed068e9636da4aa7d49d94517d";
const SEND_TIME = "2025-02-10T16:23:59";

/**
 * HTTP POST 요청을 보내고 JSON 응답을 반환하는 공통 함수
 * @param {string} url - API 엔드포인트 URL
 * @param {Object|null} auth - Basic Auth를 위한 객체 {username, password} (없으면 null)
 * @param {Object|null} payload - 전송할 JSON 객체
 * @param {Object|null} headers - 추가 헤더 정보
 * @return {Object|null} - 응답 JSON 객체 (오류 발생 시 null)
 */
function ppurioMakeRequest(url, auth, payload, headers) {
  if (auth && auth.username && auth.password) {
    var basicAuth = Utilities.base64Encode(auth.username + ":" + auth.password);
    headers = headers || {};
    headers["Authorization"] = "Basic " + basicAuth;
  }
  
  headers = headers || {};
  headers["Content-Type"] = headers["Content-Type"] || "application/json";
  
  var options = {
    method: "post",
    contentType: "application/json",
    payload: payload ? JSON.stringify(payload) : "",
    headers: headers,
    muteHttpExceptions: true
  };
  
  try {
    var response = UrlFetchApp.fetch(url, options);
    var responseCode = response.getResponseCode();
    if (responseCode >= 200 && responseCode < 300) {
      return JSON.parse(response.getContentText());
    } else {
      Logger.log("HTTP Error (" + responseCode + "): " + response.getContentText());
      return null;
    }
  } catch (e) {
    Logger.log("Request exception: " + e);
    return null;
  }
}

/**
 * 엑세스 토큰 발급 (토큰은 24시간 동안 유효)
 * @return {string|null} - access_token 또는 null
 */
function ppurioGetAccessToken() {
  var url = API_URL + "/v1/token";
  var auth = { username: USER_NAME, password: TOKEN };
  var responseData = ppurioMakeRequest(url, auth);
  return responseData ? responseData.token : null;
}

/**
 * 메시지 발송 (예약 발송이 아닌 즉시 발송)
 * @param {string} accessToken - 발급받은 엑세스 토큰
 * @param {string} recipient - 수신자 전화번호
 * @return {string|null} - 발송 후 반환된 messageKey 또는 null
 */
function ppurioSendMessage(accessToken, recipient) {
  var url = API_URL + "/v1/message";
  var headers = {
    "Authorization": "Bearer " + accessToken,
    "Content-Type": "application/json",
  };
  var payload = {
    "account": USER_NAME,              // 뿌리오 계정
    "messageType": "SMS",              // SMS(단문) / LMS(장문) / MMS(포토)
    "content": "문의하신 내용에 대한 답변이 남겨주신 메일로 전송되었습니다. 컷팅스타 드림",  // 메시지 내용
    "from": "01062605500",             // 발신번호 (숫자만)
    "duplicateFlag": "N",              // 수신번호 중복 허용 여부 (Y:허용 / N:제거)
    "rejectType": "AD",                // 광고성 문자 수신거부 설정 (AD:수신거부)
    "refKey": "ref_key",               // 요청에 부여할 키
    "targetCount": 1,                  // 수신자 수
    // 예약 발송은 sendTime 필드를 사용하지 않으므로 즉시 발송됩니다.
    "targets": [
      {
        "to": recipient,             // 매개변수로 전달받은 수신자 번호
        "name": "홍길동",              // [*이름*] 변수에 들어갈 정보 (선택사항)
        "changeWord": { "var1": "10000" } // 치환 변수 정보 (선택사항)
      }
    ]
  };

  var responseData = ppurioMakeRequest(url, null, payload, headers);
  Logger.log("Send message response: " + JSON.stringify(responseData));
  return responseData ? responseData.messageKey : null;
}

/**
 * (예약 발송 취소 함수는 예약 발송 메시지에 대해서만 동작합니다.)
 * 예약 발송 취소는 즉시 발송에는 적용되지 않습니다.
 *
function ppurioCancelReservation(accessToken, messageKey) {
  var url = API_URL + "/v1/cancel";
  var headers = {
    "Authorization": "Bearer " + accessToken,
    "Content-Type": "application/json",
  };
  var payload = {
    "account": USER_NAME,            // 뿌리오 계정
    "messageKey": messageKey         // 고유 메시지 키
  };

  var responseData = ppurioMakeRequest(url, null, payload, headers);
  Logger.log("Cancel response: " + JSON.stringify(responseData));
  return responseData ? responseData.code : null;
}
*/

/**
 * 전체 실행 흐름을 테스트하는 함수
 * 수신자 전화번호를 외부에서 매개변수로 전달받습니다.
 * 만약 전달하지 않으면 기본값 "01062605500"를 사용합니다.
 * 이 테스트 함수는 토큰 발급 후, 지정한 수신번호로 즉시 문자 메시지를 발송합니다.
 */
function testPpurioFlowWithRecipient(recipient) {
  // 전달된 recipient가 없으면 기본값 사용
  var testRecipient = recipient || "01062605500";
  
  var token = ppurioGetAccessToken();
  Logger.log("Access Token: " + token);
  
  if (!token) {
    Logger.log("Test failed: 엑세스 토큰 발급에 실패했습니다.");
    return;
  }
  
  var messageKey = ppurioSendMessage(token, testRecipient);
  Logger.log("Message sent to " + testRecipient + " with Message Key: " + messageKey);
  
  if (!messageKey) {
    Logger.log("Test failed: 메시지 발송에 실패했습니다.");
  } else {
    Logger.log("Test Success: 메시지 발송에 성공하였습니다.");
  }
}

/**
 * 실행 엔트리 포인트
 */
function run() {
  // 원하는 수신자 번호를 전달하여 테스트할 수 있습니다.
  // 예: testPpurioFlowWithRecipient("01011112222");
  testPpurioFlowWithRecipient();
}
\`\`\`

### 📝 시도와 실패

- 처음에는 **솔라피(Solapi)** API를 이용해 문자 발송을 시도했으나, 여러 가지 기술적 문제로 인해 최종적으로 다년간 이용해 오던 업체인 \*\*뿌리오(Ppurio)\*\*를 선택하여 구현했습니다.
- 문자(SMS) 외에도 **카카오 알림톡** 을 활용하는 방안을 검토했으나, 추가적인 인증 절차 및 준비 사항이 많아 추후에 다시 시도해볼 계획입니다.

### 📝 구현 결과

- 고객이 문의를 제출하면 이메일과 동시에 문자로 알림을 받을 수 있도록 개선됨
- Google Apps Script의 트리거를 활용해 자동화 구현
- 이메일이 잘 전달되지 않거나 스팸으로 분류될 경우 고객이 즉시 확인 가능

## 🔮 배운 점

- Google Apps Script를 활용하면 손쉽게 자동화 시스템을 구축할 수 있음
- API 연동을 통해 문자 발송 같은 실용적인 기능을 추가할 수 있음
- 고객 경험을 개선하는 작은 변화가 큰 차이를 만들 수 있음

## 🌟 다음 계획

- 고객이 직접 문의 진행 상태를 확인할 수 있도록 추가 개발
- AI 답변의 정확도를 높이기 위해 ChatGPT API 개선
- SMS 외에도 카카오 알림톡 같은 추가 채널 연동 검토[14기 사이드프로젝트](https://www.gpters.org/search?query=14%EA%B8%B0%20%EC%82%AC%EC%9D%B4%EB%93%9C%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8&type=post)

3

4개의 답글

지피터스 뉴스레터

실제로 쓰이는 AI 활용 사례를  
프롬프트와 함께 매주 세 번 보내드립니다.

실제로 쓰이는 AI 활용 사례를 프롬프트와 함께 매주 세 번 보내드립니다.

지피터스 뉴스레터

실제로 쓰이는 AI 활용 사례를  
프롬프트와 함께 매주 세 번 보내드립니다.

실제로 쓰이는 AI 활용 사례를 프롬프트와 함께 매주 세 번 보내드립니다.

[young kwon](https://www.gpters.org/member/37QeDX6fXs "young kwon")

🌿 뉴비 파트너

[· Bizmatrixx CEO](https://www.gpters.org/nocode/post/additional-text-notifications-automatic-NJGoHTKHV8xS1yH?highlight=fPdB0qQuflpAQRB)

와 대단하신 작업이네요

[컷팅스타](https://www.gpters.org/member/SXBhD84kOs "컷팅스타")

안녕하세요?  
권 대표님.  
  
좋게 봐 주셔서 기쁘고 힘이 나네요.  
  
연락 한 번 드리겠습니다.  
감사합니다 ~  
  

[컷팅스타](https://www.gpters.org/member/SXBhD84kOs "컷팅스타")

관심 가져주시고  
  
긍정적인 피드백  
  
남겨주셔서 감사합니다 ~

4개 중 4개

[![](https://tribe-s3-production.imgix.net/RXXXICdawABFI7Z3wV7g8?auto=compress,format)](https://www.gpters.org/ai-study-list)

### 👉 이 게시글도 읽어보세요

- [
	## 우리 아이 영어 발음, AI 선생님이 봐드릴게요! (feat. n8n으로 만든 자동 피드백 시스템)
	](https://www.gpters.org/research/post/my-childs-english-pronunciation-9SpkKtiPcfGQ7J4)
	"선생님, 제가 Rice라고 했는데 친구가 Lice(이가 벼룩)라고 들었대요ㅠㅠ" 30명 수업에서 한 명 한 명 발음 체크하기... 진짜 하고 싶어도 시간이 없죠. 특히 우리 아이들이 힘들어하는 R, W, F 발음은 "다시 해봐!" 100번보다 "이렇게 해봐!" 한 번이 필요해요. 그래서 만들었어요! 카톡 보내듯 텔레그램에 녹음 파일 전송 → AI가 "어? 너 R을 L처럼 발음했네?" 바로 체크 → "우르르~ 강아지처럼 해봐!" 우리 선생님 꿀팁까지 포함된 성적표가 이메일로 슝~! 이제 새벽에 연습해도, 100번 틀려도 괜찮아요. 지치지 않는 AI 선생님이 항상 곁에 있으니까요! 영어 발음 교육에서 가장 큰 어려움은 개인별 맞춤 피드백을 제공하는 것이에요. 특히 한국인 학습자들이 어려워하는 R, W, F 발음 등은 반복적인 연습과 구체적인 교정 지침이 필요한데요. 이를 해결하기 위해 AI 기반 영어 발음 평가 자동화 시스템을 구축했어요. 학생이 텔레그램으로 녹음 파일을 전송하면, 자동으로 STT 분석 → AI 평가 → 맞춤형 피드백 보고서를 생성하여 이메일로 전송하는 완전 자동화 시스템이랍니다. 목표: 24/7 즉시 피드백 제공 개인별 발음 특성에 맞는 구체적 조언 교사의 전문 지식과 AI의 분석 능력 결합 (RAG 방식) 학습 데이터 축적을 통한 장기적 개선 추적 사용 도구: n8n: 워크플로우 자동화 플랫폼 Google Gemini API: AI 분석 및 피드백 생성 Google Speech-to-Text API: 음성을 텍스트로 변환 (신뢰도 점수 포함) Google Sheets: 발음 교정 팁 데이터베이스 (RAG) Telegram Bot: 파일 수신 인터페이스 Google Drive & Cloud Storage: 파일 저장소 Gmail: 보고서 전송 워크플로우 구성 1. 파일 수신 워크플로우 (Telegram → Google Drive) 1-1. Telegram Trigger 설정 // Trigger On: {{ \["message"\] }} // 모든 업로드된 파일을 캐치 1-2. 녹음파일ID추출 노드 - 파일 ID 추출 return \[{ json: { file\_id: $json.message.voice.file\_id } }\]; 1-3. Get a file - 텔레그램에서 파일 정보 가져오기 File ID: {{ $json.file\_id }} 1-4. Upload file - Google Drive에 저장 Bucket Name: english-pronunciation Object Name: {{$json\["name"\]}} Input Data Field Name: data 2. 메인 발음평가 워크플로우 2-1. Google Drive Trigger Google Drive에 새 파일 업로드 시 자동 실행 이 부분은 생략가능함. 하나의 워크플로우에 2개의 트리거는 동시에 발동하지 못하기 때문임. 2-2. Download file (1-4번에 이어서) 업로드된 음성 파일 다운로드 2-3. Create an object - Google Cloud Storage에 저장 STT API 사용을 위해 Cloud Storage에 저장 Bucket: english-pronunciation Object Name: {{$json\["name"\]}} 2-4. HTTP Request - STT API 호출 JSON 부분 아래 복붙! { "config": { "encoding": "OGG\_OPUS", "sampleRateHertz": 48000, "languageCode": "en-US" }, "audio": { "uri": "gs://{{$node\["Create an object"\].json\["bucket"\]}}/{{$node\["Create an object"\].json\["name"\]}}" } } 2-5. 발음결과처리 노드 - STT 결과 처리 및 신뢰도 분석 자바스크립트 내용은 아래 예시 참조! const res = $input.first().json.results; let fullTranscript = ''; let totalConfidence = 0; res.forEach(r => { const alt = r.alternatives\[0\]; fullTranscript += alt.transcript + ' '; totalConfidence += alt.confidence; }); fullTranscript = fullTranscript.trim(); return \[{ json: { transcript: fullTranscript, confidence: (totalConfidence / res.length).toFixed(6) // 평균값 } }\]; 2-6. Append row in sheet - 평가 기록 저장 Document: n8n test Sheet: 시트1 Values to Send: 1열: {{ $json.transcript }} 2열: {{ $json.confidence }} 3열: {{ new Date().toISOString() }} 2-7. AI Agent 설정 (RAG 핵심) AI Agent 프롬프트: 너는 초등학생을 위한 영어 발음 코치야 🎧 학생의 발음을 분석할 때 다음 단계를 따라줘: 1. \*\*발음 문제 감지\*\*: 학생이 발음한 문장에서 어려워하는 발음을 찾아줘 - R/L 구분 문제 (예: rice → lice) - W 발음 문제 (예: wolf → 울프) - F/P 구분 문제 (예: coffee → 코피) - 기타 한국인이 어려워하는 발음 2. \*\*키워드 추출\*\*: 발견한 발음 문제를 아래 키워드로 분류해줘 - "R/L" - R과 L 구분 문제 - "W" - W 발음 문제 - "F" - F 발음 문제 - "TH" - TH 발음 문제 - "V" - V 발음 문제 - "Z" - Z 발음 문제 3. \*\*CoachingTips 도구 사용\*\*: - 위에서 찾은 키워드로 CoachingTips 시트를 검색해줘 - 검색할 때는 정확한 키워드(예: "L", "R/L", "W")를 사용해 - 해당 키워드의 Tip을 가져와서 학생에게 전달해줘 \[입력 정보\] - 학생이 발음한 문장: {{$node\["발음결과처리"\].json\["transcript"\]}} - 신뢰도 지수: {{$node\["발음결과처리"\].json\["confidence"\]}} \[역할\] 1. 신뢰도 지수를 설명해줘. (예: 0.89 → "아주 좋아요! 거의 정확했어요 😊") 2. 학생의 발음에서 문제점을 찾아 키워드로 추출해줘 (R/L, W, F, TH, V, Z 등) 3. CoachingTips 도구를 사용해서 해당 키워드의 Tip을 검색하고 알려줘 - 반드시 시트의 Keyword 열과 정확히 일치하는 값으로 검색 - 예: "really"를 "leally"로 발음 → "R/L" 키워드로 검색 4. 매칭되는 팁이 없다면, 한국인이 자주 틀리는 발음 팁을 알려줘 5. 초등학생이 따라 하기 쉬운 연습법을 추가로 제시해줘 6. 마지막에 응원의 메시지를 남겨줘! \[예시 응답 형식\] 🎯 신뢰도: 0.75 → "잘했어요! 조금만 더 연습하면 완벽해질 거예요! 💪" 🔍 발견한 발음 포인트: L 발음이 어려웠구나! 💡 \*\*꿀팁\*\*: "라라라라라 를 다섯번 외치쇼ㅋㅋㅋㅋ" 🎮 연습 방법: 거울 보면서 혀끝을 윗니 뒤에 대고 "을~" 소리 내보기! 응원 메시지: 너무 잘하고 있어! 내일은 더 잘할 거야~ 화이팅! 🌟 \[신뢰도 지수 설명 가이드\] - 0.9 이상: "완벽해요! 원어민 수준이에요! 🏆" - 0.8~0.9: "아주 좋아요! 거의 정확했어요 😊" - 0.7~0.8: "잘했어요! 조금만 더 연습하면 완벽! 💪" - 0.6~0.7: "괜찮아요! 천천히 다시 해보자 🙂" - 0.6 미만: "어려웠구나~ 선생님이랑 같이 연습해보자! 🤗" \[톤\] - 말투는 초등학생 친구처럼 친근하게 😊 - 중요한 팁은 \*\*굵게\*\*, 한글 발음은 "따옴표"로 - 이모지 적절히 사용 (🗣 👂 🎯 👏 🌟 💪 등) - 어려운 용어 대신 쉬운 말 사용 - 실수해도 괜찮다는 격려 꼭 포함! AI Agent Tools 구성: Google Gemini Chat Model - AI 응답 생성 Simple Memory - 대화 컨텍스트 저장 Get row(s) in sheet - CoachingTips 조회 Column: Keyword Value: AI가 자동으로 판단하여 필요한 키워드 검색 코칭 팁 시트 예시: 2-8. 보고서작성 노드 - 보고서 HTML 생성 // 1) 각 노드에서 데이터 가져오기 const aiOutputRaw = $input.first().json.output || "AI 코치 메시지를 불러올 수 없습니다."; const studentName = $node\["Telegram Trigger"\].json.message?.from?.first\_name || "학생"; const evaluationDate = new Date().toLocaleDateString('ko-KR'); // 2) HTTP Request (STT) 결과 가져오기 const sttResponse = $node\["HTTP Request"\].json; // 3) 모든 세그먼트 합치기 const segments = sttResponse.results?.map(r => r.alternatives?.\[0\]?.transcript || "") || \[\]; const fullTranscript = segments.join(" ").trim(); // 4) confidence 평균 계산 const confidences = sttResponse.results?.map(r => parseFloat(r.alternatives?.\[0\]?.confidence || 0)) || \[0\]; const avgConfidence = confidences.reduce((sum, c) => sum + c, 0) / confidences.length; const overallScore = Math.round(avgConfidence \* 100); // 5) transcript 와 confidence 덮어쓰기 const transcript = fullTranscript; const confidence = overallScore; // 6) Helper: 색상과 등급 결정 function getScoreColor(score) { if (score >= 90) return '#28a745'; if (score >= 80) return '#ffc107'; if (score >= 70) return '#fd7e14'; return '#dc3545'; } function getGrade(score) { if (score >= 90) return 'A'; if (score >= 80) return 'B'; if (score >= 70) return 'C'; return 'D'; } // 7) AI 코칭 메시지 포맷팅: \*\*굵게\*\* → <strong>, 줄바꿈 → <br> const formattedOutput = aiOutputRaw.replace(/\\\*\\\*(.\*?)\\\*\\\*/g, '<strong>$1</strong>').replace(/\\n/g, '<br>'); // 8) 전체 HTML 템플릿 const htmlTemplate = \` <!DOCTYPE html> <html lang="ko"> <head> <meta charset="UTF-8"> <title>${studentName} - 영어 발음 평가 보고서</title> <style> @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap'); \* { margin:0; padding:0; box-sizing:border-box; } body { font-family:'Noto Sans KR',sans-serif; background:#f8f9fa; }.report-container { max-width:800px; margin:40px auto; background:#fff; border-radius:15px; box-shadow:0 10px 30px rgba(0,0,0,0.1); overflow:hidden; }.header { background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); color:#fff; padding:40px 30px; text-align:center; position:relative; }.header::before,.header::after { content:'🌟'; position:absolute; top:20px; font-size:24px; }.header::before { left:30px; }.header::after { right:30px; }.header h1 { font-size:32px; font-weight:700; margin-bottom:10px; }.header.subtitle { font-size:16px; opacity:0.9; }.student-info { background:rgba(255,255,255,0.2); display:inline-block; padding:10px 20px; border-radius:25px; margin-top:15px; }.content { padding:30px; }.score-section { text-align:center; margin-bottom:40px; }.score-number { font-size:72px; font-weight:700; color:${getScoreColor(confidence)}; }.score-label { font-size:18px; color:#6c757d; margin-top:5px; }.score-grade { display:inline-block; margin-top:15px; background:${getScoreColor(confidence)}; color:#fff; padding:8px 16px; border-radius:20px; font-size:16px; }.transcript-section { background:#e3f2fd; padding:20px; border-left:5px solid #2196f3; border-radius:10px; margin-bottom:40px; font-style:italic; }.coaching-section { margin-bottom:40px; }.coaching-section h2 { font-size:20px; color:#155724; margin-bottom:15px; display:flex; align-items:center; }.coaching-section h2::before { content:'🎯'; margin-right:10px; }.coaching-content { background:linear-gradient(135deg,#e8f5e8 0%,#f0f8f0 100%); padding:25px; border-radius:15px; border:2px solid #c3e6cb; line-height:1.8; }.tips-section { background:#fff3cd; padding:25px; border-radius:10px; border-left:5px solid #ffc107; margin-bottom:40px; }.tips-section h2 { font-size:18px; color:#856404; margin-bottom:15px; display:flex; align-items:center; }.tips-section h2::before { content:'💡'; margin-right:10px; }.tips-section ul { list-style:disc; padding-left:20px; line-height:1.8; }.footer { background:#f8f9fa; text-align:center; padding:20px; font-size:12px; color:#6c757d; border-top:1px solid #dee2e6; } </style> </head> <body> <div class="report-container"> <div class="header"> <h1>영어 발음 평가 보고서</h1> <p class="subtitle">English Pronunciation Assessment Report</p> <div class="student-info">${studentName} | ${evaluationDate}</div> </div> <div class="content"> <div class="score-section"> <div class="score-number">${confidence}</div> <div class="score-label">신뢰도 지수 (Confidence)</div> <div class="score-grade">등급 ${getGrade(confidence)}</div> </div> ${ transcript? \` <div class="transcript-section"> 발음한 문장: "${transcript}" </div>\`: '' } <div class="coaching-section"> <h2>AI 맞춤형 코칭</h2> <div class="coaching-content">${formattedOutput}</div> </div> <div class="tips-section"> <h2>추천 연습 방법</h2> <ul> <li>매일 10분씩 영어 동화책 소리내어 읽기</li> <li>좋아하는 영어 동요·팝송 따라 부르기</li> <li>거울 보며 입 모양과 혀 위치 연습하기</li> <li>영어 발음 앱으로 재미있게 학습하기</li> </ul> </div> </div> <div class="footer"> 이 보고서는 Google Speech-to-Text AI 분석 기반으로 자동 생성되었습니다.<br> 더 나은 영어 발음을 위해 꾸준히 연습해보세요! 💪 </div> </div> </body> </html> \`; // 9) 결과 반환 return \[{ json: { html: htmlTemplate, studentName, transcript, confidence, overallScore, evaluationDate, fileName: \`${studentName.replace(/\\s+/g,'\_')}\_발음평가\_${evaluationDate.replace(/\\./g,'')}.pdf\` } }\]; 2-9. Send a message - Gmail로 최종 보고서 전송 To: ondalgeneral2022@gmail.com 받는사람 이메일주소 Subject: {{$json.studentName}}의 영어 발음 평가 보고서 Email Type: HTML Message: {{ $json.html }} Google Sheets RAG 데이터베이스 CoachingTips 시트 구조 예시: Keyword Tip R R 발음할 때는 '우' 소리를 먼저 짧게 내세요. 그 다음 재빠르게 다음 소리로 잇기! W W 발음할 때는 '워' 소리를 내세요! Wolf는 '울프'가 아니라 '워~울프' 소리에 가까워요! L L 발음할 때는 라라라라라 를 다섯번 외치쇼ㅋㅋㅋㅋ 결과 배운 점과 나만의 꿀팁 RAG 구현의 핵심은 데이터 구조화 Google Sheets를 지식베이스로 활용하면 비개발자도 쉽게 내용 수정 가능 AI Agent가 자동으로 필요한 키워드를 판단하여 검색 STT API 설정 최적화 enableWordTimeOffsets로 단어별 타이밍 분석 가능 파일 처리 워크플로우 분리 Google Drive를 중간 저장소로 활용하여 안정성 확보 AI Agent "Defined automatically by the model" 활용 처음에는 명시적 값 전달이 필요하다고 생각했으나 AI가 프롬프트를 이해하고 자동으로 적절한 키워드를 찾아 검색 과정 중에 겪은 시행착오 AI Agent가 Google Sheets 데이터를 못 가져오는 문제 원인: 프롬프트에서 도구 사용 지시가 명확하지 않음 해결: "CoachingTips 시트를 참고해서"라는 명확한 지시 추가 STT 신뢰도 점수 계산 문제: 여러 results의 confidence를 어떻게 통합할지 해결: 평균값 계산으로 전체 신뢰도 산출 텔레그램 음성 파일 처리 문제: 음성 메시지의 file\_id 추출 위치 해결: message.voice.file\_id 경로 확인 도움이 필요한 부분 다양한 억양과 발음 속도에 대한 STT 정확도 개선 방법 발음 개선 추이를 시각화하는 대시보드 구현 앞으로의 계획 평가 지표 고도화 억양, 강세, 리듬 평가 추가 단어별 신뢰도 점수 세분화 학습 추적 시스템 개인별 발전 그래프 자동 생성 반복적으로 틀리는 패턴 자동 감지 및 맞춤 커리큘럼 제안 다채널 확장 웹 인터페이스 추가 도움 받은 글 n8n AI Agent 공식 문서 Google Cloud Speech-to-Text API 가이드 RAG (Retrieval-Augmented Generation) 개념 설명 자료 n8n Community Forum의 워크플로우 최적화 팁 "선생님, 저 Wolf를 '울프'라고 했더니 친구들이 놀려요ㅠㅠ" 이제는 밤 10시에도, 아침 7시에도 언제든 녹음만 보내면 3분 뒤에 답장이 와요! 📱 "워~울프! 늑대가 울부짖듯이 해봐! 넌 벌써 70점이야! 대단해!" 마치 포켓몬GO 같아요! 🎮 언제 어디서나 연습 가능 바로바로 점수 확인 레벨업하는 재미! 진짜 신기한 건, AI 선생님이 우리 진짜 선생님의 꿀팁을 외우고 있다는 거예요. "라라라라라~ 다섯 번!" 같은 우리만의 비법도 알려준대요 ㅋㅋㅋ 이제 영어 발음이 무서운 게 아니라 재밌는 게임이 됐어요!
	2025.07.27.
- [
	## N8N으로 부동산 중개 매물 소개 블로그 자동화 하기!
	](https://www.gpters.org/nocode/post/n8neuro-budongsan-junggae-maemul-sogae-beulrogeu-jadonghwa-hagi-4M0T4N2rRA8sT1j)
	소개 본인의 업무를 자동화하다보니 더 자동화할 것등을 찾는 과정에서 지인이 일손이 부족하여서 부동산, 인스타그램, 유튜브를 꾸준히 올릴 여력이 부족하다고 하여 N8N으로 자동화를 도전하기로 하였습니다. 기존의 제 업무는 Make 프로그램으로 자동화를 하였기에 별도의 스터디 없이 바로 N8N으로 작업에 착수하여서 온갖 삽질을 시작하였습니다. <사용도구> N8N(N8N 제공 무료 14일 이용): 자동화 구현 프로그램 네이버지도 API: 매물 위치의 네이버지도를 캡처한 이미지 생성 Openweathermap(날씨) API: 블로그 서론(인사말)에 날씨 이야기를 위해 사용 GCP(구글 콘솔) 프로젝트 및 API: 구글 문서 생성 및 등록을 위해 이용 구글 스프레드시트 & 구글 드라이브: 사진 및 매물정보 기입 및 자동화 결과물 등록 Azure API: 사진 속 객체를 특정하여서 분석하는 API로 매물의 사진 정보를 분석하는데 사용 <프로그램 흐름 개요> 매일 아침 6시에 구글 스프레드시트에서 새로운 매물 정보 확인 날씨 정보 확인 하나의 매물씩 자동화 프로그램 작동 작업시간 입력 건물의 층 정보를 분리하기 매물의 주소 분석하여서 지도 생성하기 매물의 사진을 분석하기 사진 분석정보로 사진 설명 작성 인사말, 마무리인사, 임대정보, 해시태그, 제목 등을 생성 구글 문서에 하나의 글로 생성 작업완료 입력 <들여다보기> 매일 6시마다 새로운 매물 정보(작업상태 열의 정보가 '대기'인 것을 감지하여 작동하도록 만들었습니다. 또한 인사말에 사용할 날시 정보를 Openweathermap API를 상뇽해서 불러왔습니다. N8N의 문제인지 제 문제인지 모르겠는데, 특정 노드의 정보가 일정 구역을 넘어가면 자료가 전달이 되지 않아서 edit 노드(날시 정보 흘러가기)로 똑같은 정보를 받은 다음에 처리하였습니다. 사용자가 자동화 또는 AI툴 등에 익숙하지 않은 사람이어서 그나마 엑셀과 비슷한 구글 스프레드시트를 트리거로 이용하였습니다. 매물의 기준은 매물번호로 하고, 트리거 기능은 '대기' 작업상태를 적용하였습니다.5. 작업은 무조건 하나씩 처리하기 위해 필터링을 하고, 아까 날씨정보와 마찬가지로 제일 핵심이되는 '매물 정보 확인(구글 시트에 저장된 매물 정보들)'가 전달이 되었다가 안되었다 하는 상황이 생겨서 정보를 한 번 복제하는 노드를 하나 만들어서 적용하였습니다. 아직도 원인이 무엇인지는 모릅니다. 작업시간을 입력하여서 현재 프로그램이 작동중인 것을 가시적으로 사용자가 알 수 있도록 하였습니다. 대부분의 정보는 열 하나에 정보 하나를 기입하여서 자동화 또는 챗GPT가 이용하기 좋게 하였는데, 건물마다 층수와 지하층의 정보등이 각기 다르기 때문에 이 정보를 하나의 셀에 입력하게 하고, 자동화 과정에서 쉼표(,)를 기준으로 층(1층,2층,3층 ---)과 평(100평, 200평 ---)을 묶어서 정리하게 했습니다. 주소를 적으면 위도로 변환시켜서 네이버지도 API를 호출하고, 매물의 정확한 위치를 노출하면 안되기 때문에 난수를 적용하여서 네이버지도의 중심 위치를 매물의 위치와 다르게 설정하였습니다. 매물 입지 기반 키워드와 매물위치 픽셀변환은 최종적으로 사용하지 않는데, 픽셀 변환은 위도/경도를 픽셀값으로 변환해서 적용하는 것인데, 실제 지도와 오차가 계속 발생해서 폐기하였습니다. 또한 입지 기반 키워드도 특정 음식점, 건물 등을 나타낼 수 는 있으나 부동산 관점에서의 입지 분석과는 거리가 있는 것으로 보여서 최종적으로 사용하지 않았습니다. 네이버지도를 생성한 뒤 구글 드라이브에 올리는 과정과 이어서 바로 사진을 찾아서 분석하는 구조여서 이 과정을 '사진 폴더'를 찾은 뒤에 병렬적으로 처리하도록 하여 자동화 시간을 매우적은 시간 줄이는데 이용하고, 노드의 연결성을 강화했습니다. 대량의 사진을 구글 드라이브에 올려놓으면, 사진 이름(사진 파일 이름을 미리 지정된 이름들을 사용)에 따라서 건물소개, 내부사진, 외부사진, 부대시설 4가지 타입으로 나누어주고, 각 층, 호실, 공간마다 묶어서 중복되는 사진은 제외하고 대표사진을 가지고 사진을 분석하여서 분석 비용과 시간을 절약했습니다. 사진 분석은 Azure API(사진 속 객체를 태그로 지정하여 분석)를 사용하여서 분석 결과를 태그값으로 받은 뒤에 간략한 한 줄 영어 설명을 만들고, 이를 챗GPT가 부동산 중개 사무소의 직원에 빙의하여서 분석글을 생성하였습니다. 사진이름과 설명을 간략하게 정리하여서 블로그 글 생성시 해당 위치에 배열하였습니다.ㅇ 인사말, 마무리인사, 임대정보, 제목, 해시태그 등을 위와같이 정보제공하는 것을 마크다운 정보로 가공해서 챗 GPT에게 넘기는 방법을 사용했습니다. json 파일에서 직접 챗 GPT에 넘기는 것을 잘 반영하지 못하는 것으로 체크되어서 중간 과정을 여러번 넣는 형태로 진행하게 되었습니다. 이 점은 Make와 다른 점으로 인지가 됩니다. 앞서 작성한 모든 글을 합쳐서 하나의 노드에 취합하고, 이를 마크다운으로 변형해서 구글 문서에 업로드하였습니다. Make에서는 html 모드를 통해서 글의 스타일까지 지정하였는데 반해 Make에서 Html 형태로 올리는 것에 실패하여서 텍스트 상태로 올리게 되고 이는 스타일은 지정되지 않은 형태의 글 등록으로 되었습니다. 프로그램의 작동이 끝나면 '작업완료'로 상태를 변경하여서 가시적으로 사용자가 결과물이 나온 것을 확인하도록 하였습니다. 결과와 배운 점 글 서식을 지정하지 못하고 올리기 때문에 이 부분은 조금 아쉽지만, 네이버 블로그에 올릴 글이기 때문에 아쉬움은 뒤로하여야 할 것 같습니다. 그리고 이상하게 N8N이 불안정한건지 제가 노드를 잘못만들어서인지 프로그램이 작동하였다가 중간에 오류가 나는 것을 반복해서 이 부분을 해결해야지 상용적으로 사용할 수 있을거 같습니다. 빠른 시일내에 지금 겪고 있는 이 문제를 해결해서 안정적으로 사용하는 것과 이에대한 후기를 남겨보겠습니다. 그리고 완성 후 다음으로는 이어서 인스타그램 릴스와 유튜브 영상을 자동화하는 것을 만들어서 블로그-인스타그램릴스-유튜브 영상 업로드까지 3개를 한방에 또는 2개로 이원화해서 부동산 중개 사무소의 콘텐츠 자동화를 완성해보겠습니다. N8N VS Make 개인적인 차이점을 느낀 것 N8N은 노드가 비교적 단순하게 생겨서 이용이 편리해보인다. 다만 편리하게 생긴만큼 편의성을 위한 세팅은 비교적 없는 것 같습니다. 반면에 Make는 다소 복잡해 보이지만 그만큼 사용 편의성이 좋아서 모듈의 기능을 정확히 알고, 필요한 것이 다 갖추어져 있을경우에 빠르게 작업할 수 있었던 거 같습니다. N8N은 노드의 정보를 참조할 때 앞선 노드를 찾는 것이 Make보다는 디자인적으로 조금 밋밋하여서 시각적으로 조금 아쉬움이 있었습니다. N8N에서 가장 좋았던 것은 안되는 것은 일단 자바스크립트 코드를 작성해서 어떻게든 되게 만든다는 것이고, 반대로 코드를 사용하지 않으면 뭐 하나 만들기 어려울 정도로 노드가 부족하다는 것이었습니다. 도움 받은 글 (옵션) 참고한 지피터스 글이나 외부 사례를 알려주세요. (내용 입력)
	2025.01.20.
- [
	## 매일 아침 4대 국내 주요 신문사 뉴스 요약본을 메일로 받아보기
	](https://www.gpters.org/nocode/post/every-morning-you-can-rcZL7ycPw9UwHcS)
	소개 지난 주, 저는 글로벌 뉴스와 매일경제신문 뉴스 요약본을 각각 이메일로 받는 자동화 사례를 발표 발표했습니다. \[지난주 베스트 발표 사례\] 이어, 이번에는 4대 국내 주요 신문사 뉴스의 요약과 링크를 하나의 이메일로 받아보는 심화 과제에 도전했습니다. 매일 아침 여러 사이트를 방문하는 비효율을 없애고 정보 과부하를 해결하는 것이 주된 목표였습니다. 이 과정에서 신문사마다 다른 데이터 형식과 웹사이트 차단 문제를 해결해야만 했습니다. 수많은 시행착오 끝에, 마침내 4개 신문사의 맞춤형 요약본을 단 한 통의 이메일로 받아보는 워크플로우를 완성했습니다. 진행 방법 1. 1차 시도: 간단한 통합 처리 방식의 실패 📌 워크플로우 구성 (1차 시도) 1차 시도에는 다음과 같은 도구와 노드를 활용하여 단일 처리 흐름을 만들고자 했습니다. ＊Schedule Trigger: 원하는 시간에 워크플로우를 자동으로 시작(아침 8시) ＊RSS Read (x4): 4개 언론사의 RSS 피드를 동시에 수집 ＊HTTP Request: (수정 시도) RSS에 내용이 없는 기사의 본문을 가져오기 위해 추가 ＊Filter: 특정 조건을 설정, 조건을 통과하는 데이터만 다음 단계로 넘겨주는 역할 ＊Basic LLM Chain & Google Gemini: 통합된 데이터를 AI를 통해 요약 ＊Code: 데이터수 5개로 줄이고, HTML 형식으로 만들고, 데이터 합치기 ＊Google Sheets: 이메일 수신자 목록 관리 ＊Gmail: 최종 결과물 내용을 이메일로 발송 📈 진행했던 워크플로우 구성도 (1차 시도) 🛠️ 진행 방법 및 실패 원인 (1차 시도) 데이터 통합 수집 (RSS Read & Merge): 4개 신문사의 RSS 피드를 RSS Read 노드로 각각 읽어온 뒤, code 노드를 이용해 통합하고자 했습니다. 문제 발견 및 수정 시도 (HTTP Request 추가): 실행 결과, 일부 신문사(한국경제, 한겨레 등)의 RSS 피드에는 요약할 만한 텍스트가 전혀 없다는 사실을 발견했습니다. 이를 해결하기 RSS 다음에 HTTP Request 노드를 추가하여, 각 기사의 링크(link)에 직접 방문해 원문을 가져오는 '웹 스크래핑' 방식을 도입하려 했습니다. 하지만 HTTP Request 노드는 대부분의 언론사 웹사이트에서 즉시 차단(403 Forbidden Error)되었습니다. User-Agent 헤더를 추가하는 등의 시도 없이는 자동화된 접근이 불가능하다는 것을 확인했습니다. 2. 2차 시도: 합치지 못하고 개별 도착（실패） 📌 워크플로우 구성 (2차 시도) ２차 시도에는 다음과 같은 도구와 노드를 활용하여 단일 처리 흐름을 만들고자 했습니다. ＊Schedule Trigger: 원하는 시간에 워크플로우를 자동으로 시작 ＊RSS Read (x2): 2개 언론사의 RSS 피드를 동시에 수집 ＊HTTP Request: 네이버 뉴스의 API를 통해 뉴스 받아오는 역할 ＊Split Out: 여러 기사 꾸러미를 풀어서 5개의 개별 기사 아이템으로 분리해 주는 역할 ＊Basic LLM Chain & Google Gemini: 통합된 데이터를 AI를 통해 요약 ＊Code: 데이터수 5개로 줄이고, HTML 형식으로 만들고, 데이터 합치기(제대로 작동 안함) ＊Gmail: 최종 결과물을 이메일로 발송 📈 진행했던 워크플로우 구성도 (2차 시도) 🛠️ 진행 방법 및 실패 원인 (2차 시도) 1차 시도에서 얻은 교훈을 바탕으로 각 신문사의 RSS 피드 데이터 구조를 분석하여, 텍스트가 풍부한 '매일경제'와 '조선일보'는 RSS를 직접 활용하고, 텍스트가 부족한 '한국경제'와 '한겨레'는 네이버 뉴스 API를 통해 데이터를 가져오도록 처리 방식을 이원화했습니다. 여기까지는 좋았습니다. 2차 시도에서 '데이터를 합치는' 노드가 합치는 역할을 하지 않고, 도착하는 데이터마다 개별적으로 실행되었다. 개별로 요약문을 만들었지만 이 노드는 4개의 결과물을 기다렸다가 하나로 합치는 것이 아니라, 결과물이 도착할 때마다 한 번씩, 총 4번을 실행했습니다. 결과적으로 4개의 분리된 이메일이 만들어졌고, 각각의 이메일에는 신문사 하나의 내용만 담겨있습니다. Merge 노드나 Code 노드의 Run Once for All Items 모드 등 다양한 방법을 시도했지만, 이 노드들이 '기다렸다가 합치는' 동기화 기능을 제대로 수행하지 못하고 각자 실행되어 버린 것이 실패 원인입니다. 3. 3차 시도: 직렬방식으로 결과물 누적시켜 성공 🛠️ 진행 방법 및 성공 원인 (3차 시도 - 성공) 📌 워크플로우 구성 (3차 시도) Schedule Trigger, RSS Read, HTTP Request, Basic LLM Chain & Google Gemini, Google Sheets, Gmail Code1,2,3,4: 각 신문사별 요약 결과를 HTML 형식으로 만들며, 이전 단계의 결과물에 새로운 결과물을 누적시키는 핵심적인 역할을 수행했습니다. 📈 진행했던 워크플로우 구성도 (3차 시도 - 성공) Code1에서 전달받은 내용(previousHtml) 뒤에 Code2에서 새로 만든 자신의 결과물(html)을 덧붙여서(+), 더 길어진 바통을 다음 주자(혹은 결승선)로 넘겨주는 것이 핵심입니다. \[ 아침에 도착한 4개 신문 요약과 링크 \] ※ n8n 뉴스 수집 3가지 방법 비교 여러 신문사의 뉴스를 가져올 때, 어떤 방법을 사용하느냐에 따라 설정법과 데이터의 특징이 다름 1. RSS: 가장 쉽고 정확한 '직접 구독' (매일경제신문, 조선일보) \* 작동 방식: 각 신문사의 공식 채널(RSS)을 직접 구독하여 정보를 받는 방식. \* n8n 설정: RSS Feed Read 노드에 RSS 주소만 넣으면 끝나므로 매우 간단함. \* 핵심 특징: 해당 신문사 기사만 100% 들어와 데이터가 가장 정확하고 깔끔함. 2. News API: 똑똑한 '뉴스 전문 비서' (글로벌 뉴스) \* 작동 방식: 전 세계 뉴스를 수집하는 전문 데이터 회사의 'API 키'를 가지고 원하는 뉴스를 요청해서 받는 방식. \* n8n 설정: HTTP Request 노드를 사용하며, 서비스 가입 후 받은 'API 키'가 필요함. \* 핵심 특징: 키워드, 국가 등 다양한 조건으로 뉴스를 검색할 수 있어 기능이 강력함. 3. 네이버 뉴스 API: 편리한 '포털 검색 대행' (한국경제신문, 한겨레) \* 작동 방식: 네이버 포털에 특정 키워드(예: '한겨레')로 뉴스를 '검색'해서 결과 받음. \* n8n 설정: HTTP Request 노드와 네이버에서 발급받은 'API 키'가 필요함. \* 핵심 특징: RSS가 막힌 언론사의 기사를 가져올 수 있는 좋은 대안이지만, 검색 결과이므로 불필요한 기사가 섞일 수 있음. 따라서, 원하는 기사만 골라내는 별도의 필터링 작업이 필요함. 아래 네이버 개발자 센터(https://developers.naver.com/main/)에서 네이버 뉴스API 발급받아야 함. 결과와 배운 점 결과 수많은 시행착오 끝에, 매일 아침 지정된 시간에 4개 신문사의 최신 뉴스 각 5개를 AI로 요약하고, 깔끔하게 정리된 하나의 이메일로 받아보는 자동화 워크플로우를 완성했습니다. 배운 점 데이터 소스를 분석하는 것이 먼저다: 자동화 설계를 시작하기 전에, 내가 사용할 데이터(RSS, API)의 구조와 제약 조건을 명확히 파악하는 '정찰' 과정이 가장 중요합니다. 하나의 방법론을 고집하지 마라: 모든 데이터 소스에 맞는 '만능 열쇠'는 없습니다. 각 소스의 특성에 맞춰 RSS, API, 웹 스크래핑 등 다양한 방법을 조합하는 유연성이 필요합니다. 가장 확실한 방법은 '직렬 처리'다: 여러 단계에 걸쳐 데이터를 누적하거나 가공해야 할 때, 한 단계의 결과물이 다음 단계의 입력이 되도록 의존성을 만들어주는 직렬(순차) 방식이 가장 안정적이고 예측 가능합니다. AI(Gemini)는 훌륭한 페어 프로그래머다: 복잡한 코드 작성이나 에러 발생 시, 문제를 구체적으로 설명하고 Gemini에게 계속 질문하며 답을 찾아가는 과정이 매우 중요했습니다. 막혔을 때 포기하지 않고 계속 대화하며 수정하는 반복적인 과정이 없었다면 이 워크플로우는 완성되지 못했을 것입니다. 도움 받은 글 (옵션) 매번 스터디에 참석하면서 스터디장님(멍멍님, 올마이티님)과 스터디원 여러분들의 열정이 자극이 되어 저도 분발했습니다. 감사합니다.
	2025.07.29.
- [
	## 반복 업무 탈출! n8n + AI로 만드는 뉴스 자동화 시스템 🧠
	](https://www.gpters.org/nocode/post/banbog-eobmu-talcul-n8n-airo-mandeuneun-nyuseu-jadonghwa-siseutem-rbOJqI3bXs4HHez)
	소개 스타트업에서 개발 PM 및 사업 전략 부서에서 일하다 보니, 반복적이고 단순한 업무가 너무 많아 시간을 많이 빼앗기고 있었습니다. 그래서 가능한 모든 반복 작업을 자동화하고자 이 프로젝트를 시작하게 되었어요. 효율적인 정보 수집과 정리, 공유를 자동화하는 시스템을 만들고 싶었습니다. n8n을 선택한 이유 🧩 make, zapier 등 다양한 자동화 도구가 있지만, n8n을 선택한 이유는 다음과 같아요: 비용 효율성: n8n은 사용량과 관계없이 고정 요금 구조를 제공하고, 셀프호스팅 시 무료로 운영할 수 있어요. Zapier나 Make처럼 사용량이 늘면 가격이 급격히 올라가는 모델과 달리, 예측 가능한 비용 구조는 스타트업에 큰 장점이에요. 보안 및 인프라 독립성: 자체 서버에 직접 설치하고 운영할 수 있기 때문에 회사 내부 보안 정책에 맞춰 유연하게 대응할 수 있어요. 클라우드 서비스에 데이터를 위임하지 않아도 돼요. 로우코드 기반의 높은 확장성: 코드 없이도 워크플로우를 만들 수 있지만, 필요하면 JavaScript 또는 Python을 삽입해 자유롭게 확장할 수도 있어요. 직관적인 시각적 인터페이스: 워크플로우 전체를 시각적으로 확인하면서 설계할 수 있어, 디버깅과 유지보수에 유리해요. 오픈소스와 활발한 커뮤니티: 공식 포럼과 GitHub 커뮤니티에서 다양한 템플릿과 해결 사례를 참고할 수 있어요. 목표 이번 프로젝트에서는 다음과 같은 목표를 달성하고자 했습니다: n8n 셀프호스팅 환경 구축 – Google Cloud에서 인스턴스를 직접 생성하고, Cloudflare 도메인을 연결하여 독립적인 자동화 환경을 구성했습니다. 뉴스 모니터링 및 자동화 뉴스레터 배포시스템 구축 – 관심 키워드에 따른 뉴스를 자동 수집 및 요약하고, 여러 플랫폼(Slack, Discord 등)에 자동 전송하는 구조를 만들고자 했어요. 🤖 AI Agent 기반 뉴스 키워드 감지 및 실시간 뉴스레터 응답 시스템 – Slack 명령어로 키워드를 등록하면, AI가 관련 뉴스를 수집해 뉴스레터를 실시간 응답으로 전송하는 기능을 구현했습니다. Code 노드 없이 뉴스레터 배포시스템 만들기 – 코드 노드 없이 구성함으로써 유지보수성과 가독성을 높이고, 팀원 누구나 이해하고 확장할 수 있는 구조로 리팩토링했습니다. n8n의 기본 노드만으로도 충분히 강력한 자동화 시스템을 만들 수 있음을 검증했습니다. 진행 방법 사용한 도구 🛠 n8n: 전체 워크플로우 자동화를 위한 핵심 툴 OpenAI Chat Model: 뉴스 요약, 키워드 추출 등 자연어 처리 작업 담당 SerpAPI: 뉴스 검색용 API Slack, Discord, Telegram: 뉴스레터 배포 채널 RSS/HTTP 모듈: 뉴스 수집 및 파싱 Google Cloud Platform: n8n 셀프호스팅을 위한 VM 인스턴스 생성 Cloudflare: 도메인 연결 및 DNS 설정을 통한 외부 접속 구성 AI에게 이렇게 물어봤어요! 💬 ChatGPT 활용기 🤖 ChatGPT에서 \*\*n8n 맞춤 버전(GPTs)\*\*을 활용해 코딩 관련 질문을 진행하면서 워크플로우를 구성해 나갔습니다. 특히 노드 연결법, 오류 디버깅, 코드 노드 최적화 등 실무에서 막히는 부분들을 중심으로 질문했고, 가능한 경우 input, output, error log까지 최대한 정보를 자세히 입력해서 문제 해결을 유도했어요. 캡처 이미지 ✨ 평생 공짜인 Make, 재피어? 노코드 자동화 n8n 서버 무료 호스팅 Google Cloud Console에서 VM 인스턴스 구성 화면 Cloudflare DNS 설정 화면 (devvicky.com) n8n 자동화 뉴스레터 배포 시스템 AI Agent 워크플로우 (Slack 실시간 응답 시스템) Code 노드 없이 구성한 리팩토링 시스템 결과와 배운 점 배운 점 🌱 n8n의 다양한 노드만으로도 복잡한 로직을 구현할 수 있다는 점에서 큰 가능성을 보았어요. AI Agent와 Slack을 연결하면 실시간 반응형 뉴스 시스템도 충분히 구현 가능하다는 걸 확인했습니다. GCP + Cloudflare를 이용해 n8n을 셀프호스팅하면서 인프라 구성 역량도 한 단계 성장할 수 있었어요. 시행착오 🌀 셀프호스팅 환경 구축은 생각보다 큰 허들이었어요. 시작이 가장 어렵다는 말이 딱 맞았습니다. 도커에 n8n 컨테이너를 설치하는 개념부터, GCP에서 IP를 받는 과정, Cloudflare에서 도메인을 연결한 뒤 이를 다시 도커의 n8n에 붙이는 작업까지... 익숙하지 않은 인프라 구성이라 몇 번이나 포기하고 싶었어요. 그래도 유튜브 영상을 보며 따라하고, 중간중간 막히는 부분은 ChatGPT와의 핑퐁 대화를 통해 꾸역꾸역 해결했습니다. 하지만 여전히 안정성 문제는 남아있었습니다. 예를 들면 무한루프 버그가 생기면 마치 디도스 공격처럼 서버가 멈추는 문제가 있었고, GCP에서 인스턴스가 자동 비활성화되면서 외부 연결이 끊긴 적도 있었어요. 기본 구조를 잘 모르니까, 서버 연결이 안 되면 처음부터 다시 설정을 반복하는 방식으로 해결해야 했습니다. 그래도 덕분에 서버 구조에 대한 이해가 생겨서 매우 보람 있었습니다. n8n 노드의 문법을 몰라서 처음엔 연결에 애먹었어요. 어떤 알고리즘을 짜도 "이건 어떤 노드로 연결하지?" 싶은 경우가 많았습니다. 그래서 하나하나 YouTube나 ChatGPT로 노드별 사용법을 검색해가며 구성했습니다. 특히 데이터 파싱 후 가공할 때 Split, Merge, Loop, Edit Fields 등은 직접 여러 번 만져보며 배웠습니다. 그리고 직접 n8n 공식 사이트에 들어가서 튜토리얼 문서들을 하나씩 따라해보며 테스트도 했어요. 아직도 걸음마 수준이라고 느끼지만, 그래도 처음보다는 훨씬 자신감이 생겼습니다. 배포 과정에서 플랫폼마다 다른 설정에 당황했어요. Slack, Discord, Telegram 각각 봇 생성 방식, 웹훅 연결 방식, 인증 방식, 노드 설정 방식이 다 달라서 세팅에 많은 시간을 쏟았습니다. 특히 Slack의 워크스페이스 봇 설정이 까다로워서 가장 고생했어요. 그럼에도 셋 다 배포 자동화를 완료하고 나니 뿌듯했습니다. 다음 계획 🛠 AI Agent에 페르소나를 적용하여 단순 뉴스 제공을 넘어서 자연스러운 대화형 응답이 가능하도록 업그레이드할 예정이에요. 특히 Slack과 Telegram에서 유용하게 활용될 수 있도록 준비 중입니다. n8n + MCP + 커서 기반 구조를 활용한 자동 시장조사 봇 개발에도 도전해보고 싶어요. 예를 들어, 특정 키워드나 관심 주제를 입력하면 관련 트렌드 뉴스, SNS 반응, 기업 정보 등을 종합해서 요약해주는 자동 리서치 봇을 만드는 것을 목표로 하고 있어요. 이 기능이 잘 구축된다면, 스타트업 내부의 전략/기획 업무에도 큰 도움이 될 거라고 생각해요. 도움 받은 글 (옵션) (21) 평생 공짜인 Make, 재피어? 노코드 자동화 n8n 서버 무료 호스팅 - YouTube
	2025.05.30.
- [
	## (lovable를 활용한 회사 홈페이지 만들기 2탄) 코딩 1도 모르는 사람의 회사 홈페이지 완성기
	](https://www.gpters.org/wealth/post/completion-company-homepage-person-JkXZEOM9hCK9Eti)
	소개 2주전 베스트사례로 공유드렸던 '강아지 영양제 추천 웹사이트' 따라서 회사 홈페이지 만들기의 2탄으로 지난번 만들었던 프로토타입을 기반으로 후속 작업을 진행하여 드디어 회사 도메인 주소를 사용한 실제 홈페이지를 완성했습니다. Lovable를 사용하여 수정하는 동안 에러도 많이 나오고, 속도도 느려지고, $20/월 플랜의 Credit도 모두 소진하여 포기를 하고 외주 전문가에게 의뢰를 할까 했으나… 기존에 Lovable에 만들었던 페이지가 디자인도 좋고, 70%정도는 만들었다고 생각해서 그것을 최대한 살리고 싶어서 크몽에서 몇 분 컨택을 해봤는데 기존에 만들어 놓은 것에 이어서 작업해 줄 전문가도 찾기 어려웠고, 새로 개발하는데는 200만원 정도의 견적이 나와서, 다시 도전하기로 결심하고 $50/월 플랜으로 변경하여 다시 시도한 결과, 원하는 기능이 모두 구현된 멋진 홈페이지를 완성하여 퍼블리싱할 수 있게 되었습니다. https://qmeinno.com/ 지난번 홈페이지를 프로토타입 작성 이후에 완성하기까지 과정을 공유하면 좋을 것 같아 올립니다 진행 방법 홈페이지 프론트엔드 lovable.dev, 백엔드는 lovable과 잘 연동되는 supabase 홈페이지에 삽입될 디자인과 사진은 gen spark, ChatGPT Sora, Google AI Studio, 진행 중 뭘 어떻게 해야할 지 모를 때는 Google AI Studio Stream 기능 지난번 1차로 만든 프로토타입 홈페이지는 에러가 너무 많고 페이지수가 많아서 포기하고 새 프로젝트를 만들어서 PRD입력부터 다시 시작했습니다. 1. 홈페이지 생성 프롬프트 이전에 만든 큐엠앤이이노베이션 홈페이지 구축 Product Requirement Document(PRD) 문서내용 입력 주요내용: 프로젝트 개요, 배경 및 필요성, 목표 및 범위, 핵심기능 요구사항, 시스템.기술 요구사항, Constraints 등 프롬프트 회사로고와 어울리게 전체적으로 검은색과 파란색 계열 색상으로 변경하는데, 파란색 계열의 색상과 검은색,회색 색상을 다양하게 사용하여 단조롭게 느껴지지 않게 해줘 홈페이지 생성 후에는 수정을 할 때는 왼쪽 아래에 있는 Edit 버튼을 누르면 홈페이지 화면을 스캔 한 후 특정 영역을 선택할 수 있도록 됩니다. 그러면 그 영역을 선택한 후 프롬프트에 요구사항을 입력하면 됩니다 배경색을 #F9FCFF로 바꿔줘 글자색을 #767677로 바꿔줘 2. 컴포넌트의 삭제나 추가 이 컴포넌트는 없애줘 이 버튼 없애줘 ~~섹션 만들어줘 3. 제목이나 글에 대한 수정 에디트 메뉴로 글 박스를 선정하여, 직접 글을 고칠 수 있는 경우와 그 글을 고치기 위해 프롬프트에 어떤 글을 써달라고 명령하는 경우로 나뉩니다 아마도 그 글자에 어떤 효과들이 연결되어 있으면 프롬프트에 써달라고 하는 것 같습니다 4. 사진이나 이미지 업로드, 그래프와 수정 이미지를 교체하거나 입력할 때도 해당 영역에 클릭을 하고 프롬프트 창에 이미지를 복사붙여 넣기를 한 후에 명령하면 됩니다 이 그림을 넣어줘, 이 그림으로 교체해줘, 이 그림 삭제해줘 동영상이나 GIF파일도 업로드 가능한지 물었더니, 직접 업로드는 안되고 유튜브에 올린 후 링크버튼을 만드는 게 좋다고 합니다 (인물사진 업로드) 사진을 올릴 때 고생했던 것은 제가 가지고 있는 사람들 사진은 여권사진 종류가 많은데, 사진을 업로드하는 자리가 가로로 길어서(아마도 스마트폰에서도 문제없이 볼 수 있도록 세팅을 해야하기 때문에 그 사이즈에 맞게하기 위한 것 같습니다) 사진을 편집하는데 어려움이 있었습니다. 세로사진을 그냥 넣으면 머리가 잘리고 얼굴이 엄청 크게 나오고, 가로가 긴 사진을 만들려고 ChatGPT, Sora에서 가로가 긴 사진으로 만들면, 얼굴이 전혀 다른 사람이 되어 나와서… 그래도 얼굴변화가 가장 작았던 방법은 Google AI Studio에서 작업한 것있습니다. 덕분에 표정이 안좋은 외국분의 사진을 웃는 모습으로 만들어 넣기도 했네요 (이미지생성 및 업로드) 입력된 이미지 생성에서 어려웠던 점은 gen spark가 디자인은 가장 예쁘게 이미지를 만들어 주는데 철자가 틀리고 글씨가 깨지는 점 이었습니다. 그래서 gen spark에서 디자인 이미지를 생성한 후 ChatGPT. Sora로 가지고 와서 글자를 읽으라고 한 후 철자를 맞추어 이미지에 추가해 달라고 요청해서 해결했습니다 (그래프 수정) 입력된 그래프의 숫자등을 수정하는 것도 해당영역을 선정한 후 프롬프트에 숫자를 입력한 후 수정해 달라고하면 쉽게 수정됩니다 5. 토큰을 절약하면서 수정할 수 있는 요령 Lovable에게 토큰은 어떻게 차감되냐고 물었더니, 프롬프트 명령을 내릴 때 마다 차감된다고 하더군요. 처음는 에러가 날까봐 겁먹에서 글이나 그림도 별도로 한개씩 지시하여 고쳤는데, 그렇게 하면 매 지시마다 토큰이 차감되는 것 같습니다. 그래서 나중에는 한 영역을 선정한다음에 그 영역에 해당하는 지시를 한꺼번에 입력하여 동일한 수정을 하더라고 토큰 차감량을 줄였습니다. 6. Supabase를 연결한 백엔드 연결 고객문의 데이터나 GPT체험자 데이터를 DB화하기 위해 백엔드 구축이 필요하는 이 기능은 lovable과 잘 연동되는 Supabase를 활용하면 됩니다. Supabase는 오픈소스기반의 Backend서비스 제공 플랫폼이라고 하네요. 사용자 정보수집등 하기위해 어떻게 해야하는지 Lovable에게 물었습니다. 무료 플랜 제공: 500MB 데이터베이스와 월 5만 명의 사용자 인증 등 강력한 무료 플랜을 지원한다고 합니다 Supabase 주요 기능 사용자 인증: 안전한 로그인 및 회원가입 기능 구현 데이터 저장: 애플리케이션 데이터를 클라우드 데이터베이스에 저장 Edge Functions: AI 기능, 결제 처리, 이메일 통합 등 고급 기능 추가 역시 Supabase에 통합하라고 하네요. 기능구현을 위해서 오른쪽 상단 노색 Supabase버튼을 눌러서 연결하라고 알려주십니다. Supasbase에 가서 가입하고, 프로젝트를 만들고, Lovable과 연결을 합니다 그런데 Supabase와 연결을 하다가 에러가 났습니다. 에러를 해결하는 방법을 Lovable이 가르쳐줍니다. 그런데 무슨 소리를 하는건지, 어디로 가서 뭘 입력 하라는 건지 도통 모르겠습니다. 이제는 Google AI Studio Stream/Share Screen의 도움을 받아야합니다. Lovable과 Supabase두개 화면을 띄워놓고 Google AI Studio와 문답을 해가며 시도를 해서 문제를 해결했습니다. 그 결과 아래와 같이 홈페이지에 문의를 남긴 분들의 데이터가 Supabase Table에 잘 저장됩니다 7. 배포와 회사 도메인 연결 퍼블리시는 이버튼을 눌러서 하면됩니다. 그냥 lovable앱주소로 하면 그것으로 완료되고 외부 도메인에 연결할꺼면, Custom domain에 연결하는 메뉴를 선택 후에 요청하는대로 도메인 주소 넣고, 진행하다가 보면 나중에는 네임서버를 수동으로 설정할 때 필요한 호스트명과 IP주소를 알려줍니다 저희회사 도메인은 후이스에서 받은 것이라서, 후이즈에 전화해서 서비스 도음을 받아 연결 시켰습니다. 테스톱은 물로 스마트폰에서도 잘 작동됩니다. 이제 완성!! 결과와 배운 점 다시 시도한 결과, 원하는 기능이 모두 구현된 멋진 홈페이지를 완성하여 퍼블리싱할 수 있게 되었습니다. https://qmeinno.com/ 결론적으로 이제 회사의 B2B세일즈를 할 수 있는 외부커뮤니케이션 허브가 생겼습니다. 이 홈페이지를 어떻게 더 잘 활용할지도 더 고민해야겠죠? 실제 외부에 큰 비용을 들이지 않고 스스로 구축한 점도 좋았으며, 앞으로도 웹 호스팀 회사에 의존하지 않고 내가 직접 관리, 수정, 개선할 수 있다는 점도 매우 매력적이었습니다. 이번 경험을 바탕으로 그 동안 어렵게만 느꼈던 웹이나 앱을 도구로 훨씬 편하게 사용할 수 있을 것 같은 생각이 들었습니다 Lovable을 사용하여 홈페이지를 수정하면서 알게된 점들을 몇가지 정리했습니다 Lovable를 사용해서 홈페이지를 수정,완성하면서 알게된 점 1. 기본적으로 Lovable은 홈페이지를 아주 빠르게 세련된 홈페이지를 만들어 줍니다. 디자인이 좋습니다 2. 홈페이지 생성시 원하는 색상이나 로고를 넣고 로고와 어울리게 만들어달라고 하면 잘 만들어 줍니다 3. 하지만 그 이후 디테일한 부분을 수정해가면서 시간과 노력이 투입되는데, 수정을 최소화하려면 처음에는 페이지 수와 섹션을 가볍게 가지고 가는데 더 좋을 것 같습니다. 기능이나 페이지는 언제든지 더 추가할 수 있습니다. 4. 수정하다가 보면 에러가 자주 발생하는데, 코드를 모르는 입장에서는 가장 두려운 에러가 발생해도 Fix the error버튼이 있기 때문에 그것만 누르면 스스로 수정하니 염려하지 않아도 됩니다 또 에러가 발생하여 잘 수정되지 않더라도 원하는 어느시점 돌아가는 기능이있으므로 염려하지 않아도 됩니다 5. 경험적으로 볼 때 수정시 error가 발생하는 경우를 보니, 애니메이션 효과 등 무언가 기능이 들어간 것들을 수정 요청했을 때 error가 발생되고, 그 error를 수정하느라 시간과 토큰이 많이 소요됨으로, 처음에 홈페이지 생성시부터 애니메이션 효과는 넣지 말라고 하는 것이 좋습니다. 그래서 이번에 홈페이지를 새로 빌드하면서 PRD(Product Requirement Document)에 Constraints 항목을 추가하여 “업로드된 이미지는 반응형 애니메이션 효과를 적용하지 말 것, 반응형 애니메이션을 효과는 필요한 경우 추후 추가 예정”이라는 지시를 포함했습니다. 6. 모든 AI가 마찬가지이지만 내가 더욱 디테일하고 구체적으로 수정사항을 지시할수록 에러가 발생할 확률이 줄어듭니다 7. 비개발자 입장에서 무언가 문제가 발생했을 때 해결에 도움을 줄 수 있는 ‘Google AI Studio; Stream 중 Share Screen’이 있으니 뭔가 새로운 것을 훨씬 편하게 도전해볼 수 있을 것 같습니다 도움 받은 글 (옵션) (베스트사례) 강아지 영양제 추천 서비스 웹사이트 만들어보기(강아지 영양제 추천 서비스 웹사이트 만들어보기) (스터디게시글)AI로 진화하는 노코드 웹 앱 개발 - Lovable.dev & Supabase 완벽 가이드(AI로 진화하는 노코드 웹 앱 개발 - Lovable.dev & Supabase 완벽 가이드) 홈페이지만들기 1부 베스트사례 '강아지 영양제 추천 웹사이트' 따라서 회사 홈페이지 만들기(베스트사례 '강아지 영양제 추천 웹사이트' 따라서 회사 홈페이지 만들기) (유튜브)Lovable 플스택 개발 가장 빠르게 시작하기 https://youtu.be/2ko3f9rPAoQ?si=DhYEYZtFP091SOZv
	2025.04.11.

### 컷팅스타의 다른 글["책-앤-첵" (Book & Check): 책 구입 전에 한 번 체크해 보세요](https://www.gpters.org/dev/post/bookandcheck-check-purchasing-book-8e40D0FEho81zHJ)

[

컷팅스타 | 2024.11.11

](https://www.gpters.org/dev/post/bookandcheck-check-purchasing-book-8e40D0FEho81zHJ)[고객 문의 자동 응답 시스템 구축: Google과 ChatGPT 활용](https://www.gpters.org/nocode/post/customer-inquiry-automatic-response-JJvazdl8bHnncDV)

[

컷팅스타 | 2025.02.04

](https://www.gpters.org/nocode/post/customer-inquiry-automatic-response-JJvazdl8bHnncDV)[압도적 영어 퀴즈 <압영퀴>](https://www.gpters.org/dev/post/overwhelming-english-quiz-apyeongqui-GtdH3vS0HUD1i0s)

[

컷팅스타 | 2024.11.24

](https://www.gpters.org/dev/post/overwhelming-english-quiz-apyeongqui-GtdH3vS0HUD1i0s)

[전체보기](https://www.gpters.org/member/SXBhD84kOs)[공유 회의실 예약시스템 Vercel 배포](https://www.gpters.org/nocode/post/sharing-conference-room-reservation-Sm1XPIiW92snXuy)

[

리부티너 | 2025.07.30

](https://www.gpters.org/nocode/post/sharing-conference-room-reservation-Sm1XPIiW92snXuy)[현우봇 개발기: 좌충우돌 URL 요약 & AI 검색 기능 구축기 🚀](https://www.gpters.org/nocode/post/hyunwoo-bot-developer-left-cFZrZeQSlArkN9g)

[

복받어김현우 | 2025.05.17

](https://www.gpters.org/nocode/post/hyunwoo-bot-developer-left-cFZrZeQSlArkN9g)[나도 이제 해본다, n8n](https://www.gpters.org/nocode/post/do-now-n8n-gUxrZ4lcq4jYeSP)

[

준터오마이 | 2025.07.13

](https://www.gpters.org/nocode/post/do-now-n8n-gUxrZ4lcq4jYeSP)[wine&me 초스피드MVP만들기](https://www.gpters.org/nocode/post/wine-me-coseupideumvpmandeulgi-CtFhfbLGBUT26kj)

[

유니 | 2023.09.22

](https://www.gpters.org/nocode/post/wine-me-coseupideumvpmandeulgi-CtFhfbLGBUT26kj)[쓰레드 포스팅 자동화 - 아이폰 단축어와 Make.com의 콜라보](https://www.gpters.org/nocode/post/thread-posting-automation-collaboration-RVIwWRDiuV2tVk5)

[

하먹이 | 2025.04.02

](https://www.gpters.org/nocode/post/thread-posting-automation-collaboration-RVIwWRDiuV2tVk5)

[전체보기](https://www.gpters.org/nocode)
