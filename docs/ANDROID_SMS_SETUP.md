# 안드로이드 폰 SMS 게이트웨이 설정 가이드

## 개요
뿌리오 API의 IP 제한과 [Web발신] 문구를 완벽하게 우회하는 방법입니다.
안드로이드 폰을 전용 SMS 서버로 활용하여 자연스러운 문자를 발송합니다.

## 시스템 구조
```
[고객 신청] → [Supabase DB] → [Edge Function] → [Slack] → [안드로이드 폰] → [SMS 발송]
```

---

## 1단계: Slack 설정

### 1.1 Slack 워크스페이스 준비
1. [Slack](https://slack.com) 로그인
2. 새 채널 생성: `#sms-automation` (비공개 권장)

### 1.2 Incoming Webhook 설정
1. [Slack App Directory](https://api.slack.com/apps) 접속
2. "Create New App" → "From scratch" 선택
3. App Name: `SMS Notifier`
4. Workspace 선택
5. "Incoming Webhooks" 메뉴 → Activate 켜기
6. "Add New Webhook to Workspace" 클릭
7. 채널 선택: `#sms-automation`
8. Webhook URL 복사 (예: `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXX`)

### 1.3 테스트
```bash
curl -X POST YOUR_WEBHOOK_URL \
  -H 'Content-Type: application/json' \
  -d '{"text":"테스트 메시지"}'
```

---

## 2단계: Supabase Edge Function 설정

### 2.1 Edge Function 배포
1. Supabase 대시보드 → Functions
2. "New Function" 클릭
3. Name: `sms-to-slack`
4. `/supabase/functions/sms-to-slack/index.ts` 코드 복사/붙여넣기
5. **중요**: SLACK_WEBHOOK_URL을 실제 URL로 변경
6. Deploy

### 2.2 Database Webhook 설정
1. Supabase 대시보드 → Database → Webhooks
2. "Create a new webhook" 클릭
3. 설정:
   - Name: `sms_notification`
   - Table: `careon_applications`
   - Events: `INSERT` 체크
   - Type: `Supabase Edge Function`
   - Edge Function: `sms-to-slack`
4. "Create webhook" 클릭

---

## 3단계: 안드로이드 폰 설정

### 3.1 필요한 앱 설치
1. **Slack** - Play Store에서 설치 후 로그인
2. **MacroDroid** - Play Store에서 설치 (무료 버전으로 충분)

### 3.2 MacroDroid 매크로 생성

#### 새 매크로 만들기
1. MacroDroid 앱 실행
2. "매크로 추가" (+) 버튼 클릭
3. 이름: `케어온 SMS 자동발송`

#### 트리거 설정 (언제 실행할지)
1. "트리거 추가" → "기기 이벤트" → "알림"
2. "알림 수신 시" 선택
3. 설정:
   - 애플리케이션 선택: **Slack**
   - 알림 텍스트 포함: `SMS_TRIGGER|`
   - 정확히 일치: 체크 해제
   - 대소문자 구분: 체크 해제
4. "확인"

#### 액션 설정 (무엇을 할지)
1. "액션 추가" → "메시지" → "SMS 보내기"
2. 전화번호 설정:
   - "..." 버튼 클릭
   - "매직 텍스트" → "알림 텍스트"
   - "텍스트 조작" → "텍스트 추출"
   - 추출 방법: "텍스트 사이"
   - 시작 텍스트: `SMS_TRIGGER|`
   - 종료 텍스트: `|`
   - 첫 번째 일치 항목만: 체크
3. 메시지 내용:
```
[케어온]
{name}님, 스타트케어 신청이 완료되었습니다.

담당자가 곧 연락드릴 예정입니다.
업종: {businessType}

문의: 1866-1845
```

4. 변수 설정 (메시지 내 {name}, {businessType} 처리):
   - {name} 클릭 → "매직 텍스트" → "알림 텍스트" → "텍스트 추출"
     - 시작: `|` (두 번째 파이프)
     - 종료: `|` (세 번째 파이프)
   - {businessType} 동일하게 설정
     - 시작: `|` (세 번째 파이프)  
     - 종료: (끝까지)

#### 제약 조건 (선택사항)
1. "제약 조건 추가"
2. "연결" → "Wi-Fi 연결됨" (특정 Wi-Fi 선택 가능)
3. 이렇게 하면 집/사무실 Wi-Fi에서만 작동

#### 저장
1. 우측 하단 체크(✓) 버튼 클릭
2. 매크로 이름 확인 후 저장

### 3.3 권한 설정
1. MacroDroid 설정 → 권한 관리
2. 필수 권한 모두 허용:
   - SMS 보내기
   - 알림 접근
   - 배터리 최적화 제외
3. Slack 앱 알림 설정:
   - 설정 → 앱 → Slack → 알림
   - 모든 알림 허용
   - `#sms-automation` 채널 알림 켜기

### 3.4 안드로이드 폰 최적화
1. **전원 관리**:
   - 설정 → 배터리 → 배터리 최적화
   - MacroDroid, Slack: "최적화하지 않음"
2. **자동 시작**:
   - 설정 → 앱 관리 → 자동 시작
   - MacroDroid, Slack: 허용
3. **충전기 연결**:
   - 폰을 항상 충전기에 연결해두기
   - 화면 꺼짐 시간: "안 함"으로 설정 (선택사항)

---

## 4단계: 테스트

### 4.1 전체 플로우 테스트
1. 웹사이트에서 신청서 작성 및 제출
2. Slack `#sms-automation` 채널에 알림 확인
3. 안드로이드 폰에서 SMS 자동 발송 확인
4. 수신자 폰에서 문자 수신 확인

### 4.2 MacroDroid 디버깅
1. MacroDroid → 시스템 로그
2. 매크로 실행 기록 확인
3. 오류 발생 시 트리거/액션 재설정

---

## 5단계: 모니터링 및 유지보수

### 일일 체크리스트
- [ ] 안드로이드 폰 전원 상태
- [ ] Wi-Fi 연결 상태
- [ ] Slack 앱 로그인 상태
- [ ] MacroDroid 실행 중
- [ ] 문자 발송 정상 여부

### 주간 체크리스트
- [ ] 안드로이드 OS 업데이트 확인 (자동 업데이트 끄기 권장)
- [ ] 앱 업데이트 확인 (수동 업데이트 권장)
- [ ] 문자 발송 기록 백업

### 문제 해결
| 문제 | 해결 방법 |
|------|----------|
| Slack 알림 안 옴 | Webhook URL 확인, 채널 알림 설정 확인 |
| MacroDroid 작동 안 함 | 권한 재설정, 배터리 최적화 확인 |
| SMS 발송 실패 | 통신사 요금제 확인, 스팸 차단 여부 확인 |
| 폰이 꺼짐 | 충전기 연결, 자동 재시작 설정 |

---

## 장점 정리

✅ **[Web발신] 문구 없음** - 일반 문자와 100% 동일
✅ **IP 제한 없음** - API 서버 위치 무관
✅ **비용 절감** - API 사용료 없음
✅ **높은 전달률** - 스팸 필터링 우회
✅ **실시간 모니터링** - Slack에서 발송 현황 확인

## 제한사항

⚠️ **발송량 제한** - 하루 200~500건 (통신사별 상이)
⚠️ **물리적 의존성** - 폰이 항상 켜져 있어야 함
⚠️ **수동 관리 필요** - 주기적인 상태 확인 필요

---

## 대안 및 확장

### 발송량 증가 시
1. **안드로이드 폰 추가**: 2~3대로 부하 분산
2. **Tasker 앱 사용**: MacroDroid보다 강력한 자동화
3. **전용 SMS 게이트웨이 장비**: 대량 발송용 하드웨어

### 안정성 향상
1. **UPS 연결**: 정전 대비
2. **원격 접속 설정**: TeamViewer, AnyDesk
3. **이중화**: 메인/백업 폰 구성

---

## 결론

이 방식은 소규모~중규모 서비스에 최적화된 솔루션입니다.
복잡한 API 연동 없이 자연스러운 문자 발송이 가능하며,
초기 설정 후에는 거의 자동으로 운영됩니다.

**추천 사용 케이스:**
- 일 100건 이하 발송
- B2B 서비스
- 신뢰도가 중요한 서비스
- API 비용 절감이 필요한 스타트업