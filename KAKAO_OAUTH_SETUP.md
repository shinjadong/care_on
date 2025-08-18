# 카카오 OAuth 설정 가이드

## 1. Kakao Developers 설정

### 애플리케이션 정보
- **앱 이름:** 케어온
- **회사명:** 케어온
- **사업자 등록번호:** 609-41-95762

### 앱 키 (민감 정보 - 환경 변수 사용 필요)
- **REST API 키:** `YOUR_KAKAO_REST_API_KEY` (Client ID로 사용)
- **JavaScript 키:** `YOUR_KAKAO_JAVASCRIPT_KEY`
- **Client Secret:** Kakao Developers에서 생성 필요

### 플랫폼 설정
- **Web 사이트 도메인:** https://careon.ai.kr

### Redirect URI 설정
1. Kakao Developers 대시보드 접속
2. 제품 설정 > 카카오 로그인 > Redirect URI
3. 다음 URL 추가:
   - **프로덕션:** `https://careon.ai.kr/auth/v1/callback`
   - **로컬 개발:** `http://localhost:3000/auth/v1/callback`
   - **Supabase:** `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

### 동의 항목 설정
제품 설정 > 카카오 로그인 > 동의 항목에서 다음 항목 설정:
- `account_email` (이메일) - 필수
- `profile_nickname` (닉네임) - 필수
- `profile_image` (프로필 사진) - 선택

### 보안 설정
1. 제품 설정 > 카카오 로그인 > 보안
2. Client Secret 생성 및 활성화
3. 생성된 Client Secret 안전하게 보관

## 2. Supabase 설정

### Supabase 대시보드에서 카카오 OAuth 활성화
1. Supabase 프로젝트 대시보드 접속
2. Authentication > Providers > Kakao
3. **Kakao Enabled** 토글 ON
4. 다음 정보 입력:
   - **Kakao Client ID:** REST API 키 입력
   - **Kakao Client Secret:** 생성한 Client Secret 입력
5. Save 클릭

### Callback URL 확인
Supabase 대시보드에서 제공하는 Callback URL 확인:
- 형식: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
- 이 URL을 Kakao Developers의 Redirect URI에 추가

## 3. 코드 구현

### useAuth 훅 (이미 구현됨)
```typescript
// hooks/use-auth.tsx
const signInWithKakao = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: 'https://careon.ai.kr/auth/callback',
      },
    })
    // ...
  } catch (error) {
    // 에러 처리
  }
}
```

### 로그인/회원가입 페이지 (이미 구현됨)
- 카카오 로그인 버튼이 추가되어 있음
- 노란색 배경 (#FEE500)과 카카오 로고 포함

## 4. 테스트

### 로컬 테스트
1. 환경 변수 설정 확인
2. `npm run dev`로 개발 서버 실행
3. http://localhost:3000/login 접속
4. 카카오 로그인 버튼 클릭하여 테스트

### 프로덕션 배포 전 체크리스트
- [ ] Kakao Developers에 프로덕션 Redirect URI 등록
- [ ] Supabase에 카카오 OAuth 설정 완료
- [ ] Client ID와 Client Secret 환경 변수 설정
- [ ] 로그인/로그아웃 플로우 테스트
- [ ] 사용자 정보 동기화 확인

## 5. 트러블슈팅

### 일반적인 문제 해결

#### "redirect_uri_mismatch" 오류
- Kakao Developers와 Supabase의 Redirect URI가 정확히 일치하는지 확인
- 프로토콜(http/https)과 포트 번호까지 정확히 일치해야 함

#### 로그인 후 무한 리다이렉트
- auth/callback/route.ts의 리다이렉트 로직 확인
- useAuth 훅의 onAuthStateChange 이벤트 처리 확인

#### 사용자 정보 누락
- Kakao Developers의 동의 항목 설정 확인
- 필수 동의 항목이 올바르게 설정되었는지 확인

## 6. 보안 주의사항

- Client Secret은 절대 클라이언트 코드에 노출되면 안 됨
- 모든 민감한 정보는 환경 변수로 관리
- 프로덕션 환경에서는 HTTPS 필수
- Redirect URI는 신뢰할 수 있는 도메인만 등록

## 7. 참고 자료

- [Kakao Developers 문서](https://developers.kakao.com/docs/latest/ko/kakaologin/common)
- [Supabase Kakao OAuth 가이드](https://supabase.com/docs/guides/auth/social-login/auth-kakao)
- [케어온 프로젝트 GitHub](https://github.com/shinjadong/care_on)