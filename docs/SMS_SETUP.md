# SMS 자동발송 설정 가이드 (준비중)

> ⚠️ **현재 상태**: SMS 기능은 구현되어 있으나, API 키 발급 대기중으로 비활성화 상태입니다.

## 뿌리오(Ppurio) SMS 연동

### 1. 뿌리오 회원가입 및 API 키 발급

1. [뿌리오 홈페이지](https://www.ppurio.com) 접속
2. 회원가입 진행
3. 로그인 후 관리자 페이지 이동
4. API 설정 메뉴에서:
   - **Username** 확인
   - **API Key** 발급

### 2. 발신번호 등록

1. 뿌리오 관리자 페이지에서 발신번호 관리 메뉴 이동
2. 사업자 번호 또는 개인 전화번호 등록
3. 인증 절차 완료 (통신사 인증 필요)

### 3. 환경변수 설정

`.env.local` 파일에 다음 내용 추가:

```env
# 뿌리오 SMS 설정
PPURIO_USERNAME=your_username
PPURIO_API_KEY=your_api_key
SENDER_PHONE=15880000  # 등록한 발신번호
```

### 4. SMS 활성화 방법

API 키 발급 완료 후, `/components/what/CareonApplicationForm.tsx` 파일의 118-119 라인 주석을 해제:

```typescript
// SMS 기능 활성화 시 아래 주석 해제
/*
try {
  await fetch('/api/send-sms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: payload.name,
      phone_number: payload.phone_number,
      company_name: payload.company_name,
      business_type: payload.business_type
    })
  })
} catch (smsError) {
  console.error('SMS 발송 실패:', smsError)
}
*/
```

### 5. SMS 발송 흐름 (활성화 후)

1. 고객이 무료체험단 신청 폼 제출
2. Supabase에 데이터 저장
3. `/api/send-sms` API 호출
4. 뿌리오 API를 통해 SMS 발송

### 5. 발송되는 메시지 예시

```
[케어온] 홍길동님, 무료체험단 신청이 완료되었습니다.
업체: OO치킨
담당자가 곧 연락드립니다.
문의: 1588-0000
```

### 6. 개발 환경 테스트

개발 환경에서는 실제 SMS가 발송되지 않고 콘솔에 로그만 출력됩니다.

```bash
npm run dev
# 폼 제출 시 터미널에서 SMS 내용 확인 가능
```

### 7. 프로덕션 체크리스트

- [ ] 뿌리오 계정 생성 완료
- [ ] API Key 발급 완료
- [ ] 발신번호 등록 및 인증 완료
- [ ] 환경변수 설정 완료
- [ ] SMS 포인트 충전 완료

### 8. 요금 정보

- SMS (90바이트 이하): 약 8-12원/건
- LMS (2000바이트 이하): 약 30-40원/건
- 대량 발송 시 별도 협의 가능

### 9. 문제 해결

#### SMS가 발송되지 않는 경우:
1. 환경변수 확인
2. 뿌리오 포인트 잔액 확인
3. 발신번호 인증 상태 확인
4. API 응답 로그 확인

#### 에러 코드:
- `401`: 인증 실패 (Username/API Key 확인)
- `400`: 잘못된 요청 (발신번호, 수신번호 형식 확인)
- `402`: 포인트 부족

### 10. 참고 문서

- [뿌리오 API 문서](https://docs.ppurio.com)
- [케어온 무료체험단 신청 폼 코드](/components/what/CareonApplicationForm.tsx)
- [SMS API 라우트](/app/api/send-sms/route.ts)