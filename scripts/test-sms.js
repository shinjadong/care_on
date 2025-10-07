// SMS 테스트 스크립트
// 실행: node scripts/test-sms.js

const https = require('https');

// 환경변수 설정
const PPURIO_USERNAME = 'nvr_7464463887';
const PPURIO_API_KEY = 'd55f01a941947acd711702ede3f90b74fdda318a78ed26dbde193cceeb0af4ac';
const SENDER_PHONE = '01032453385';

// Basic Auth 생성
const auth = Buffer.from(`${PPURIO_USERNAME}:${PPURIO_API_KEY}`).toString('base64');

// 테스트 메시지 데이터
const messageData = {
  account: PPURIO_USERNAME,
  messageType: 'SMS',
  from: SENDER_PHONE,
  to: '01032453385', // 테스트용 - 본인 번호로 변경
  text: '[케어온 테스트] SMS 연동 테스트 메시지입니다.',
  refKey: `test_${Date.now()}`,
};

// API 요청 옵션
const options = {
  hostname: 'message.ppurio.com',
  port: 443,
  path: '/v1/message',
  method: 'POST',
  headers: {
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(JSON.stringify(messageData))
  }
};

// API 요청
const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('응답 상태 코드:', res.statusCode);
    console.log('응답 데이터:', data);
    
    try {
      const result = JSON.parse(data);
      if (result.success) {
        console.log('✅ SMS 전송 성공!');
        console.log('메시지 ID:', result.messageId);
      } else {
        console.log('❌ SMS 전송 실패:', result.message);
      }
    } catch (e) {
      console.log('응답 파싱 오류:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error('요청 오류:', e.message);
});

// 데이터 전송
req.write(JSON.stringify(messageData));
req.end();

console.log('SMS 전송 요청 중...');
console.log('발신번호:', SENDER_PHONE);
console.log('수신번호:', messageData.to);
