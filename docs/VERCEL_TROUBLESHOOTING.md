# Vercel 환경변수 트러블슈팅 가이드

## 1. Vercel Dashboard에서 확인할 사항

### A. 프로젝트 설정 확인
1. **Vercel Dashboard** → 프로젝트 선택
2. **Settings** → **General**
   - Framework Preset: `Next.js`
   - Node.js Version: `20.x` (권장)
   - Build Command: `next build` 또는 비워두기
   - Output Directory: 비워두기

### B. 환경변수 설정 확인
1. **Settings** → **Environment Variables**
2. 다음 변수가 있는지 확인:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   \`\`\`
3. **중요**: 각 변수가 `Production` 환경에 체크되어 있는지 확인
4. 값에 따옴표나 불필요한 공백이 없는지 확인

### C. Git 연결 확인
1. **Settings** → **Git**
2. Repository: `shinjadong/care_on`
3. Production Branch: `main` (또는 실제 배포 브랜치)

## 2. 재배포 방법 (순서대로 시도)

### 방법 1: 캐시 없이 재배포
1. **Deployments** 탭
2. 최신 배포 옆 ⋮ 클릭
3. **Redeploy**
4. ✅ **Use existing Build Cache** 체크 해제
5. **Redeploy** 클릭

### 방법 2: 환경변수 재설정
1. **Settings** → **Environment Variables**
2. 기존 변수 삭제
3. 다시 추가:
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://pkehcfbjotctvneordob.supabase.co`
   - Environment: `Production` 체크
4. 같은 방법으로 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 추가
5. 자동으로 재배포 시작됨

### 방법 3: Git에서 트리거
\`\`\`bash
git commit --allow-empty -m "trigger: Vercel 재배포"
git push origin main
\`\`\`

## 3. 디버깅

### 배포 후 확인
1. 배포 완료 후 접속: `https://your-domain.vercel.app/api/check-env`
2. 응답 확인:
   \`\`\`json
   {
     "environment": {
       "NEXT_PUBLIC_SUPABASE_URL": "✅ 설정됨",
       "NEXT_PUBLIC_SUPABASE_ANON_KEY": "✅ 설정됨"
     }
   }
   \`\`\`

### 배포 로그 확인
1. **Deployments** → 배포 선택
2. **Building** 단계 로그에서:
   \`\`\`
   Environments: .env.production (또는 환경변수 로드 메시지)
   \`\`\`

## 4. 자주 발생하는 문제

### 문제 1: 환경변수가 빌드에 포함되지 않음
- 원인: `NEXT_PUBLIC_` 접두사 누락
- 해결: 변수명이 정확히 `NEXT_PUBLIC_SUPABASE_URL` 형식인지 확인

### 문제 2: 캐시된 빌드 사용
- 원인: Vercel이 이전 빌드 캐시 사용
- 해결: "Use existing Build Cache" 체크 해제 후 재배포

### 문제 3: 잘못된 브랜치
- 원인: Vercel이 다른 브랜치를 보고 있음
- 해결: Settings → Git에서 Production Branch 확인

### 문제 4: 값에 문제
- 원인: 환경변수 값에 따옴표나 공백 포함
- 해결: 값을 그대로 복사-붙여넣기 (따옴표 없이)

## 5. 최종 체크리스트

- [ ] Vercel Dashboard에서 프로젝트 선택 확인
- [ ] 환경변수가 Production에 설정됨
- [ ] 변수명에 오타 없음 (`NEXT_PUBLIC_` 접두사 포함)
- [ ] 값에 따옴표나 공백 없음
- [ ] Git 저장소 연결 정상
- [ ] Production Branch가 `main`
- [ ] 캐시 없이 재배포 시도
- [ ] 배포 로그에 에러 없음
- [ ] `/api/check-env`로 확인

## 6. 그래도 안 될 경우

1. **새 프로젝트로 재배포**:
   - Vercel에서 프로젝트 삭제
   - 새로 Import
   - 환경변수 설정
   - 배포

2. **Vercel CLI 사용**:
   \`\`\`bash
   npm i -g vercel
   vercel --prod
   # 환경변수 입력 프롬프트에서 설정
   \`\`\`

3. **Support 문의**:
   - https://vercel.com/support
   - 프로젝트 ID와 함께 문의
