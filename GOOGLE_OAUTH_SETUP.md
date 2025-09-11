# 구글 OAuth 설정 체크리스트

## 🔧 현재 상태 확인

### ✅ 완료된 설정들
- [x] Next.js 앱에서 구글 OAuth 로직 구현
- [x] Supabase 클라이언트 설정 완료
- [x] 환경변수 설정 (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
- [x] 인증 콜백 핸들러 구현 (`/auth/callback`)
- [x] 인증 상태 관리 훅 생성
- [x] 보호된 라우트 컴포넌트 구현

### 🔍 확인이 필요한 설정들

#### 1. Google Cloud Console 설정
**현재 Google Client ID:** `YOUR_GOOGLE_CLIENT_ID_HERE`

**필요한 설정:**
- [ ] **Authorized JavaScript origins:**
  - `http://localhost:3000` (개발용)
  - `https://your-domain.com` (프로덕션용)
  
- [ ] **Authorized redirect URIs:**
  - `https://pkehcfbjotctvneordob.supabase.co/auth/v1/callback`
  - `http://localhost:3000/auth/callback` (개발용)

#### 2. Supabase 대시보드 설정
**프로젝트 ID:** `pkehcfbjotctvneordob`
**대시보드 URL:** https://supabase.com/dashboard/project/pkehcfbjotctvneordob

**필요한 설정:**
- [ ] **Authentication > Providers > Google 활성화**
- [ ] **Google Client ID 입력:** `YOUR_GOOGLE_CLIENT_ID_HERE`
- [ ] **Google Client Secret 입력:** `YOUR_GOOGLE_CLIENT_SECRET_HERE`

#### 3. 리다이렉트 URL 설정
- [ ] **Supabase > Authentication > URL Configuration에서 Redirect URLs 추가:**
  - `http://localhost:3000/auth/callback`
  - `https://your-domain.com/auth/callback`

## 🧪 테스트 시나리오

### 개발 환경 테스트
1. **로컬 서버 실행:** `npm run dev`
2. **구글 로그인 테스트:**
   - `/login` 페이지에서 "구글로 로그인" 버튼 클릭
   - 구글 인증 페이지로 리다이렉트 확인
   - 인증 완료 후 홈페이지로 정상 리다이렉트 확인
   - Header에서 사용자 정보 표시 확인

3. **구글 회원가입 테스트:**
   - `/signup` 페이지에서 "구글로 회원가입" 버튼 클릭
   - 동일한 OAuth 플로우 작동 확인

4. **보호된 라우트 테스트:**
   - 로그아웃 상태에서 `/admin` 접근 시 로그인 페이지로 리다이렉트 확인
   - 로그인 후 `/admin` 정상 접근 확인

### 프로덕션 환경 체크리스트
- [ ] **Vercel 환경변수 설정 확인**
- [ ] **프로덕션 도메인의 Authorized origins 설정**
- [ ] **HTTPS 리다이렉트 URI 설정**
- [ ] **구글 OAuth Consent Screen 설정**

## 🔥 문제 해결 가이드

### 일반적인 오류들

#### "Invalid OAuth Client" 오류
- Google Cloud Console에서 Client ID 확인
- Authorized JavaScript origins 설정 확인
- 도메인 매칭 확인

#### "Redirect URI Mismatch" 오류
- Google Cloud Console의 Authorized redirect URIs 확인
- Supabase 콜백 URL 정확성 확인: `https://pkehcfbjotctvneordob.supabase.co/auth/v1/callback`

#### "Provider not enabled" 오류
- Supabase 대시보드에서 Google 프로바이더 활성화 확인
- Client ID와 Secret 입력 확인

#### 로그인 후 리다이렉트 실패
- `/auth/callback` 라우트 핸들러 확인
- 세션 쿠키 설정 확인
- 브라우저 개발자 도구에서 네트워크 탭 확인

## 📋 현재 구현 상태

### 완료된 기능들
- ✅ 구글 OAuth 로그인/회원가입 UI
- ✅ 이메일 로그인/회원가입
- ✅ 사용자 인증 상태 관리
- ✅ 자동 로그아웃 기능
- ✅ 보호된 라우트 시스템
- ✅ 로그인/회원가입 페이지 접근 제한 (로그인된 사용자)
- ✅ 관리자 페이지 접근 제한 (미로그인 사용자)

### 추가 개선 사항
- [ ] Google One-Tap 로그인 구현
- [ ] 사용자 프로필 관리 페이지
- [ ] 비밀번호 재설정 기능
- [ ] 이메일 인증 상태 확인
- [ ] 관리자 권한 시스템 구현

## 🚀 다음 단계

1. **Supabase 대시보드 설정 완료**
2. **Google Cloud Console 설정 완료**  
3. **로컬 개발 환경에서 테스트**
4. **프로덕션 배포 및 테스트**

---

*구현 완료일: 2025-01-28*
*개발자: 케어온 개발팀*









