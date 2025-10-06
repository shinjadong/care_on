Heading 1 <Alt+Ctrl+1>Heading 2 <Alt+Ctrl+2>Heading 3 <Alt+Ctrl+3>Heading 4 <Alt+Ctrl+4>Heading 5 <Alt+Ctrl+5>Heading 6 <Alt+Ctrl+6>

# AWS EC2 고정 IP 설정 완료

## ✅ 완료된 작업

### 1. EC2 인스턴스 생성 (서울 리전)

- **Instance ID**: `i-0ca94c40fd9d5639e`
- **Instance Name**: `careon`
- **Instance Type**: `t2.micro` (프리티어)
- **Region**: `ap-northeast-2c` (Seoul)
- **Status**: `Running`
- **AMI**: Ubuntu 24.04 LTS

### 2. Elastic IP 할당 및 연결

- **고정 IP 주소**: `13.209.135.199` ⭐⭐⭐
- **Allocation ID**: `eipalloc-0a6ec5a8818c9392a`
- **Association ID**: `eipassoc-0f20c82c6b64f8831`
- **Private IP**: `172.31.42.132`
- **Network Border Group**: `ap-northeast-2`

## 🔥 중요: 이 IP를 SMS 서비스에 등록하세요!

### Ppurio 화이트리스트 등록

1. Ppurio 관리자 페이지 로그인
2. IP 화이트리스트 설정으로 이동
3. **`13.209.135.199`** 추가

### Aligo 화이트리스트 등록 (대안)

1. https://smartsms.aligo.in/admin/api/auth.html 접속
2. "발송 서버 IP" 섹션에 **`13.209.135.199`** 추가
3. 현재 계정: `careon12`
4. API Key: `xgqcli4jeu7f76jbpkfj9248iqsllt6g`

## 📋 다음 작업 단계

### 3. EC2 인스턴스에 Node.js 설치 및 SMS 프록시 서버 구축

**SSH 접속 준비**:

```bash
# 인스턴스 Public IP로 SSH 접속
ssh -i <your-key.pem> ubuntu@13.209.135.199

# 만약 키파일이 없다면, EC2 콘솔에서 "Connect" 버튼으로 Session Manager 사용
```

**Node.js 설치**:

```bash
# 시스템 업데이트
sudo apt update && sudo apt upgrade -y

# Node.js 20.x 설치
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 설치 확인
node --version
npm --version
```

**SMS 프록시 서버 코드 작성**:

```bash
# 작업 디렉토리 생성
mkdir -p ~/sms-proxy
cd ~/sms-proxy

# package.json 생성
npm init -y
npm install express axios dotenv
```

**`~/sms-proxy/server.js` 작성**:

```javascript
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

// Ppurio SMS 전송 엔드포인트
app.post('/api/sms/send', async (req, res) => {
  try {
    const { to, text, type } = req.body;

    // Ppurio API 호출
    const response = await axios.post(
      'https://api.ppurio.com/v2/send',
      {
        to,
        text,
        type: type || 'SMS',
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.PPURIO_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('SMS 발송 실패:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`SMS Proxy Server running on port ${PORT}`);
});
```

**`.env` 파일 작성**:

```bash
PPURIO_API_KEY=d55f01a941947acd711702ede3f90b74fdda318a78ed26dbde193cceeb0af4ac
PORT=3000
```

### 4. PM2로 프로세스 관리 설정

```bash
# PM2 설치
sudo npm install -g pm2

# 서버 시작
pm2 start server.js --name sms-proxy

# 부팅 시 자동 시작 설정
pm2 startup
pm2 save

# 상태 확인
pm2 status
pm2 logs sms-proxy
```

### 5. Security Group 설정

**EC2 콘솔에서 Security Group 수정**:

1. EC2 > Instances > `careon` 인스턴스 선택
2. Security 탭 > Security Groups 클릭
3. Inbound rules 편집:
   - Type: `Custom TCP`
   - Port: `3000`
   - Source: Vercel IP 범위 또는 `0.0.0.0/0` (임시)
   - Description: `SMS Proxy from Vercel`

### 6. Next.js 코드 업데이트

**`/lib/ppurio/sms-v2.ts` 수정**:

```typescript
// BEFORE: 직접 Ppurio API 호출
const response = await fetch('https://api.ppurio.com/v2/send', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.PPURIO_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ to, text, type }),
})

// AFTER: EC2 프록시 서버 경유
const response = await fetch('http://13.209.135.199:3000/api/sms/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ to, text, type }),
})
```

**환경변수 추가** (Vercel Dashboard):

```
SMS_PROXY_URL=http://13.209.135.199:3000
```

**코드 수정 후**:

```typescript
const SMS_PROXY_URL = process.env.SMS_PROXY_URL || 'http://13.209.135.199:3000';

const response = await fetch(`${SMS_PROXY_URL}/api/sms/send`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ to, text, type }),
})
```

### 7. 테스트 및 배포

```bash
# 로컬에서 테스트
curl -X POST http://13.209.135.199:3000/api/sms/send \
  -H "Content-Type: application/json" \
  -d '{"to":"01083087385","text":"테스트 메시지","type":"SMS"}'

# 성공 후 Git 커밋 및 푸시
git add .
git commit -m "feat: SMS 전송을 EC2 프록시 서버 경유로 변경"
git push

# Vercel 자동 배포 후 프로덕션에서 SMS 테스트
```

## 💰 비용 예상

- **EC2 t2.micro**: 프리티어 1년 무료, 이후 월 $8-10
- **Elastic IP**: 인스턴스에 연결된 상태면 무료, 미사용 시 시간당 $0.005
- **데이터 전송**: 월 1GB 무료, 이후 GB당 $0.09

**총 예상 비용**: 프리티어 기간 중 무료, 이후 월 $8-10

[ ]

WYSIWYG <Alt+Ctrl+7>Instant Rendering <Alt+Ctrl+8>Split View <Alt+Ctrl+9>

Outline

DesktopTabletMobile/Wechat
