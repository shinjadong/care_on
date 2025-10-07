# 뿌리오 SMS 프로덕션 배포 가이드

## 현재 구조

\`\`\`
로컬 개발 → Vercel API → 뿌리오 (IP 제한으로 실패)
프로덕션 → Supabase Edge Function → 뿌리오 (고정 IP 가능)
\`\`\`

## 1. Supabase Edge Function 배포

### 1-1. Supabase CLI 설치
\`\`\`bash
npm install -g supabase
\`\`\`

### 1-2. 프로젝트 연결
\`\`\`bash
supabase link --project-ref your-project-ref
\`\`\`

### 1-3. 환경변수 설정
\`\`\`bash
# Supabase 대시보드에서 설정
# Edge Functions > send-sms > Secrets

PPURIO_USERNAME=nvr_7464463887
PPURIO_API_KEY=d55f01a941947acd711702ede3f90b74fdda318a78ed26dbde193cceeb0af4ac
SENDER_PHONE=01032453385
\`\`\`

### 1-4. Edge Function 배포
\`\`\`bash
supabase functions deploy send-sms
\`\`\`

### 1-5. Edge Function IP 확인
\`\`\`bash
# Edge Function의 IP 확인 (Deno Deploy 리전별 IP)
curl https://your-project.supabase.co/functions/v1/send-sms/ip-check
\`\`\`

## 2. 뿌리오에 IP 등록

### Supabase Edge Functions IP (Deno Deploy)
주요 리전별 IP:
- US East: `34.120.54.55`
- US West: `34.82.102.30`
- Europe: `34.116.126.37`
- Asia: `34.84.172.176`

> 참고: Supabase는 Deno Deploy를 사용하므로 실제 IP는 변경될 수 있습니다.
> 최신 IP는 Supabase 지원팀에 문의하세요.

### IP 등록 절차
1. [뿌리오 관리자](https://www.ppurio.com) 로그인
2. API 설정 → 연동 IP 관리
3. 위 IP들 추가 (설명: "Supabase Edge Function")

## 3. 클라이언트 코드 사용법

\`\`\`typescript
// 자동으로 환경에 따라 적절한 방식 선택
import { sendSMS } from '@/lib/ppurio/sms-client'

// 사용 예시
await sendSMS({
  to: '010-1234-5678',
  name: '홍길동',
  businessType: '요식업'
})
\`\`\`

## 4. 폴백 전략

\`\`\`
1차: Supabase Edge Function (프로덕션)
2차: Vercel API (개발/폴백)
3차: 콘솔 로그 (개발 모드)
\`\`\`

## 5. 모니터링

### Supabase 대시보드
- Edge Functions > send-sms > Logs
- 실시간 로그 및 에러 확인

### Vercel 대시보드
- Functions > api/sms/send
- 폴백 호출 확인

## 6. 비용

### Supabase Edge Functions
- 무료: 500K 호출/월
- 추가: $0.10 per 1M 호출

### 뿌리오 SMS
- SMS: 건당 10-15원
- LMS: 건당 30-50원

## 7. 테스트

### Edge Function 직접 테스트
\`\`\`bash
curl -X POST https://your-project.supabase.co/functions/v1/send-sms \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "010-1234-5678",
    "name": "테스트",
    "businessType": "요식업"
  }'
\`\`\`

### 로컬 테스트
\`\`\`bash
# Edge Function 로컬 실행
supabase functions serve send-sms

# 테스트
curl -X POST http://localhost:54321/functions/v1/send-sms \
  -H "Content-Type: application/json" \
  -d '{"to": "010-1234-5678", "text": "테스트"}'
\`\`\`

## 8. 대안: 고정 IP 프록시 서버

만약 Supabase Edge Function도 IP 문제가 있다면:

### 옵션 1: AWS EC2 + Elastic IP
\`\`\`javascript
// EC2 인스턴스에 Express 서버 구축
const express = require('express')
const app = express()

app.post('/sms', async (req, res) => {
  // 뿌리오 API 호출
  // Elastic IP로 고정 IP 보장
})
\`\`\`

### 옵션 2: Cloudflare Workers (Enterprise)
- Enterprise 플랜에서 고정 IP 지원
- 월 $5,000+

### 옵션 3: 뿌리오 IP 제한 해제 요청
- 뿌리오 고객센터: 070-8707-1635
- API 연동 담당자와 협의

## 9. 보안 체크리스트

- [ ] API Key 환경변수 설정
- [ ] CORS 설정 확인
- [ ] Rate Limiting 설정
- [ ] 로그에 민감정보 제외
- [ ] HTTPS 통신 확인
- [ ] 발신번호 사전등록 완료
