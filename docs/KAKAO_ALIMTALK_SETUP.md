# 카카오 알림톡 설정 가이드

## 개요
케어온 서비스에서 카카오 알림톡을 발송하기 위한 설정 가이드입니다.

## 1. 뿌리오(Ppurio) 계정 설정

### 1.1. 뿌리오 가입 및 계정 생성
1. [뿌리오 홈페이지](https://www.ppurio.com)에 접속
2. 회원가입 진행
3. 비즈니스 계정 생성

### 1.2. API 접근 권한 설정
1. 뿌리오 관리자 페이지 로그인
2. **문자 연동 > 문자 연동 관리** 메뉴 접속
3. API 연동 정보 확인:
   - 계정 ID (Username)
   - 개발 인증키 (API Key)
   - 연동 IP 등록

### 1.3. 발신번호 등록
1. **발신번호 관리** 메뉴에서 발신번호 등록
2. 통신서비스 이용증명원 제출
3. 승인 대기 (1-2일 소요)

## 2. 카카오 비즈니스 채널 설정

### 2.1. 카카오톡 채널 생성
1. [카카오톡 채널 관리자센터](https://center-pf.kakao.com) 접속
2. 채널 만들기
3. 채널 정보 입력 및 인증

### 2.2. 발신프로필 등록
1. 뿌리오 관리자 페이지에서 **카카오 > 발신프로필 관리**
2. 카카오톡 채널 연결
3. 발신프로필명 확인 (예: @careon)

### 2.3. 알림톡 템플릿 등록
1. **카카오 > 템플릿 관리** 메뉴
2. 템플릿 신규 등록:
   - 템플릿 코드
   - 템플릿명
   - 메시지 내용 (변수 포함 가능)
3. 카카오 검수 대기 (1-2일 소요)

#### 템플릿 예시
```
[케어온] 가입 신청 완료

안녕하세요, #{이름}님!
케어온 가맹점 가입 신청이 정상적으로 접수되었습니다.

▶ 신청업종: #{업종}
▶ 신청일시: #{신청일시}
▶ 처리상태: 검토중

담당자가 영업일 기준 1-2일 내에 연락드릴 예정입니다.

문의: 1866-1845
```

## 3. 환경변수 설정

`.env.local` 파일에 다음 환경변수를 추가합니다:

```env
# 뿌리오 API 설정
PPURIO_USERNAME=your_ppurio_account_id
PPURIO_API_KEY=your_ppurio_api_key
PPURIO_SENDER_PROFILE=@your_channel_name

# 발신번호 (SMS 대체발송용)
SENDER_PHONE=010-0000-0000

# 테스트 모드 (선택사항)
PPURIO_TEST_MODE=false  # true로 설정시 실제 발송하지 않고 로그만 출력
```

## 4. 템플릿 코드 업데이트

`/lib/ppurio/kakao-alimtalk.ts` 파일에서 승인된 템플릿 코드로 업데이트:

```typescript
export const ALIMTALK_TEMPLATES = {
  ENROLLMENT_COMPLETE: {
    code: '실제_승인된_템플릿_코드', // 예: 'careon_2024010100001'
    name: '가입신청완료',
    // ...
  },
  // ...
}
```

## 5. API 테스트

### 5.1. 토큰 발급 테스트
```bash
curl -X POST https://message.ppurio.com/v1/token \
  -H "Authorization: Basic $(echo -n 'USERNAME:API_KEY' | base64)"
```

### 5.2. 알림톡 발송 테스트
개발 서버 실행 후:
```bash
npm run dev
```

관리자 페이지 접속: http://localhost:3000/admin/alimtalk

## 6. 운영 시 주의사항

### 6.1. 토큰 관리
- 토큰 유효기간: 24시간
- 자동 갱신 로직 구현됨
- 토큰 캐싱으로 API 호출 최소화

### 6.2. 템플릿 관리
- 템플릿 수정 시 카카오 재검수 필요
- 변수명 변경 시 코드 수정 필요
- 템플릿당 일일 발송 한도 확인

### 6.3. 에러 처리
- 대체발송 설정으로 알림톡 실패 시 SMS 자동 발송
- API 에러 코드별 처리 로직 구현
- 발송 실패 로그 모니터링

### 6.4. 비용 관리
- 알림톡: 건당 8-10원
- SMS 대체발송: 건당 20-30원
- 월별 사용량 모니터링 필요

## 7. 트러블슈팅

### 문제: 토큰 발급 실패
- 원인: IP 미등록, API Key 오류
- 해결: 뿌리오 관리자에서 연동 IP 확인

### 문제: 템플릿 코드 오류
- 원인: 미승인 템플릿, 잘못된 템플릿 코드
- 해결: 템플릿 승인 상태 확인

### 문제: 발신프로필 오류
- 원인: 잘못된 발신프로필명
- 해결: 뿌리오에서 발신프로필 확인 (@ 포함)

## 8. 관련 파일

- `/lib/ppurio/kakao-alimtalk.ts` - 알림톡 API 라이브러리
- `/app/api/kakao/alimtalk/send/route.ts` - API 엔드포인트
- `/app/admin/alimtalk/page.tsx` - 관리자 UI

## 9. 참고 문서

- [뿌리오 API 문서](https://message.ppurio.com/api-docs)
- [카카오 알림톡 가이드](https://business.kakao.com/info/alimtalk/)
- [카카오톡 채널 관리자센터](https://center-pf.kakao.com)