# Cloudflare Workers SMS 프록시 배포 가이드

## 1. Cloudflare 대시보드에서 직접 배포

### 방법 1: 대시보드에서 직접 생성
1. [Cloudflare Dashboard](https://dash.cloudflare.com) 로그인
2. Workers & Pages 클릭
3. "Create application" 클릭
4. "Create Worker" 선택
5. 이름 입력: `careon-sms-proxy`
6. "Deploy" 클릭
7. "Edit code" 클릭
8. `cloudflare-worker-sms.js` 내용 전체 복사/붙여넣기
9. "Deploy" 클릭

### 방법 2: Wrangler CLI 사용 (선택사항)
```bash
# Wrangler 설치
npm install -g wrangler

# 로그인
wrangler login

# Worker 생성 및 배포
wrangler deploy cloudflare-worker-sms.js --name careon-sms-proxy
```

## 2. 뿌리오 IP 등록

Cloudflare Workers는 다음 IP 대역을 사용합니다:
- 173.245.48.0/20
- 103.21.244.0/22
- 103.22.200.0/22
- 103.31.4.0/22
- 141.101.64.0/18
- 108.162.192.0/18
- 190.93.240.0/20
- 188.114.96.0/20
- 197.234.240.0/22
- 198.41.128.0/17
- 162.158.0.0/15
- 172.64.0.0/13
- 131.0.72.0/22
- 104.16.0.0/13
- 104.24.0.0/14

**뿌리오 관리자 페이지에서:**
1. API 설정 > 연동 IP 관리
2. 위 IP 대역 중 주요 대역 등록
3. 또는 "모든 IP 허용" 설정 (보안상 권장하지 않음)

## 3. Worker URL 확인

배포 후 URL 형식:
```
https://careon-sms-proxy.{your-subdomain}.workers.dev
```

### IP 확인:
```
https://careon-sms-proxy.{your-subdomain}.workers.dev/check-ip
```

### SMS 전송:
```
POST https://careon-sms-proxy.{your-subdomain}.workers.dev
```

## 4. 프론트엔드 코드 수정

`components/what/CareonApplicationForm.tsx`에서:

```javascript
// Cloudflare Worker URL로 변경
const WORKER_URL = 'https://careon-sms-proxy.{your-subdomain}.workers.dev';

// SMS 전송 부분
fetch(WORKER_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: fullPhoneNumber,
    name: name.trim(),
    businessType: businessType ? businessTypeMap[businessType] : undefined,
  }),
})
```

## 5. 테스트

1. IP 확인 테스트:
```bash
curl https://careon-sms-proxy.{your-subdomain}.workers.dev/check-ip
```

2. SMS 전송 테스트:
```bash
curl -X POST https://careon-sms-proxy.{your-subdomain}.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"to":"010-1234-5678","name":"테스트","businessType":"카페"}'
```

## 장점
- ✅ 무료 (월 100,000 요청)
- ✅ 고정 IP 대역
- ✅ 글로벌 엣지 네트워크
- ✅ 자동 스케일링
- ✅ DDoS 보호
- ✅ 5분 안에 배포 완료

## 문제 해결

### IP 오류가 계속 발생하는 경우:
1. 뿌리오 고객센터에 문의하여 Cloudflare IP 대역 전체 허용 요청
2. 또는 임시로 "모든 IP 허용" 설정 후 테스트

### CORS 오류:
- Worker 코드의 corsHeaders 확인
- Origin 도메인 추가

### 토큰 오류:
- API 키와 username 확인
- 뿌리오 계정 상태 확인