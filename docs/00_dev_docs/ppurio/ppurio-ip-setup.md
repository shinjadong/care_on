# 뿌리오 IP 등록 가이드

## 현재 상황
- **에러**: `{"code":"3003","description":"invalid ip"}`
- **원인**: 뿌리오 API는 사전 등록된 IP에서만 호출 가능

## IP 등록 절차

### 1. 로컬 개발 환경
\`\`\`bash
# 현재 IP 확인
node scripts/check-ip.js
\`\`\`
- 출력된 IP를 뿌리오 관리자 페이지에 등록

### 2. 뿌리오 관리자 페이지에서 IP 등록
1. [뿌리오 홈페이지](https://www.ppurio.com) 로그인
2. **[API 설정]** 메뉴 접속
3. **[연동 IP 관리]** 클릭
4. **[IP 추가]** 버튼 클릭
5. IP 주소 입력 및 설명 추가
   - 로컬 개발: `219.241.142.84` (예시)
   - Vercel 프로덕션: 아래 Vercel IP 목록 참조

### 3. Vercel 배포 시 필요한 IP
Vercel은 동적 IP를 사용하므로 고정 IP 설정이 필요합니다.

#### 옵션 1: Vercel의 고정 IP 사용 (추천)
\`\`\`
76.76.21.21
76.76.21.61
76.76.21.93
76.76.21.98
76.76.21.123
76.76.21.142
76.76.21.164
76.76.21.241
\`\`\`
> 참고: Vercel의 IP는 변경될 수 있으므로 [공식 문서](https://vercel.com/docs/concepts/projects/environment-variables#system-environment-variables) 확인 필요

#### 옵션 2: 프록시 서버 사용
별도의 고정 IP를 가진 프록시 서버를 통해 API 호출

## 개발 환경 설정

### 임시 해결책
개발 환경에서는 SMS를 시뮬레이션 모드로 실행:
- `NODE_ENV=development`: SMS 전송 대신 콘솔 로그 출력
- `NODE_ENV=production`: 실제 SMS 전송

### 환경변수 설정
\`\`\`env
# .env.local (개발)
NODE_ENV=development
PPURIO_USERNAME=nvr_7464463887
PPURIO_API_KEY=your_api_key
SENDER_PHONE=01032453385

# .env.production (프로덕션)
NODE_ENV=production
PPURIO_USERNAME=nvr_7464463887
PPURIO_API_KEY=your_api_key
SENDER_PHONE=01032453385
\`\`\`

## 테스트 방법

### 1. IP 등록 확인
\`\`\`bash
# 토큰 발급 테스트
node scripts/test-sms-v2.js
\`\`\`

### 2. 개발 모드 테스트
\`\`\`bash
# 개발 서버 실행
npm run dev

# 신청서 작성 후 콘솔에서 SMS 시뮬레이션 로그 확인
\`\`\`

### 3. 프로덕션 테스트
\`\`\`bash
# 프로덕션 빌드
NODE_ENV=production npm run build
NODE_ENV=production npm start
\`\`\`

## 트러블슈팅

### "invalid ip" 에러가 계속 발생하는 경우
1. IP 등록 후 5-10분 대기 (반영 시간)
2. 공인 IP 재확인 (IP가 변경되었을 수 있음)
3. 뿌리오 고객센터 문의: 070-8707-1635

### Vercel 배포 후 SMS가 안 되는 경우
1. Vercel 환경변수 설정 확인
2. Vercel Functions 로그 확인
3. 필요시 프록시 서버 구축 고려

## 보안 주의사항
- API Key를 GitHub에 직접 커밋하지 마세요
- 환경변수로 관리하고 .env 파일은 .gitignore에 포함
- 프로덕션 환경에서는 IP 화이트리스트 필수
