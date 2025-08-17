# 리다이렉트 URL 설정 가이드

## 🔧 프로덕션 환경 설정 (careon.ai.kr)

### 1. Supabase 대시보드 설정

1. [Supabase 대시보드](https://supabase.com/dashboard) 접속
2. **Authentication > URL Configuration** 이동
3. **Redirect URLs**에 다음 URL들 추가:
   ```
   https://careon.ai.kr/auth/callback
   https://www.careon.ai.kr/auth/callback
   http://localhost:3000/auth/callback (개발용)
   ```

### 2. Google Cloud Console 설정

1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. OAuth 2.0 클라이언트 ID 설정 수정
3. **Authorized JavaScript origins** 추가:
   ```
   https://careon.ai.kr
   https://www.careon.ai.kr
   http://localhost:3000 (개발용)
   ```
4. **Authorized redirect URIs** 추가:
   ```
   https://[YOUR_SUPABASE_PROJECT].supabase.co/auth/v1/callback
   ```

### 3. Vercel 환경변수 설정

Vercel 대시보드에서 다음 환경변수 설정:

```bash
NEXT_PUBLIC_APP_URL=https://careon.ai.kr
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_PROJECT].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
```

## 🔍 자동 리다이렉트 로직

### 클라이언트 사이드 (hooks/use-auth.tsx)
```typescript
// 도메인에 따라 자동으로 올바른 URL 사용
getRedirectUrl('/auth/callback')
// careon.ai.kr -> https://careon.ai.kr/auth/callback
// localhost -> http://localhost:3000/auth/callback
```

### 서버 사이드 (app/auth/callback/route.ts)
```typescript
// X-Forwarded-Host 헤더와 환경을 확인하여 자동 처리
getServerRedirectUrl(request, next)
```

## ✅ 체크리스트

### 개발 환경
- [ ] `npm run dev`로 로컬 서버 실행
- [ ] 구글 로그인 시 `localhost:3000`으로 정상 리다이렉트 확인
- [ ] 로그인 후 원하는 페이지로 이동 확인

### 프로덕션 환경
- [ ] 구글 로그인 시 `careon.ai.kr`로 정상 리다이렉트 확인
- [ ] HTTPS 프로토콜 사용 확인
- [ ] 로그인 후 원하는 페이지로 이동 확인

## 🔥 문제 해결

### "리다이렉트가 localhost로 가는 문제"
1. `getRedirectUrl` 함수가 올바른 도메인을 반환하는지 확인
2. Supabase 대시보드의 Redirect URLs 확인
3. 브라우저 개발자 도구에서 네트워크 탭 확인

### "OAuth 리다이렉트 실패"
1. Google Cloud Console의 Authorized redirect URIs 확인
2. Supabase 프로젝트 URL이 정확한지 확인
3. 환경변수가 올바르게 설정되었는지 확인

## 📋 지원되는 환경

| 환경 | 도메인 | 프로토콜 |
|------|--------|----------|
| 프로덕션 | careon.ai.kr | HTTPS |
| 개발 | localhost:3000 | HTTP |
| Vercel Preview | *.vercel.app | HTTPS |

## 🚀 배포 프로세스

1. 코드 변경사항 커밋 및 푸시
2. Vercel이 자동으로 배포
3. 프로덕션 환경에서 테스트
4. 문제 발생 시 롤백

---

*최종 업데이트: 2025-01-28*