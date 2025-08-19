// 뿌리오 SMS V1 API 테스트 스크립트
// 실행: node scripts/test-sms-v2.js

const https = require('https');

// 환경변수 설정
const PPURIO_USERNAME = 'nvr_7464463887';
const PPURIO_API_KEY = 'd55f01a941947acd711702ede3f90b74fdda318a78ed26dbde193cceeb0af4ac';
const SENDER_PHONE = '01032453385';

// Basic Auth 생성
const auth = Buffer.from(`${PPURIO_USERNAME}:${PPURIO_API_KEY}`).toString('base64');

// 1단계: 토큰 발급
function getToken() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'message.ppurio.com',
      port: 443,
      path: '/v1/token',
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log('토큰 응답 상태:', res.statusCode);
        console.log('토큰 응답:', data);
        
        try {
          const result = JSON.parse(data);
          if (result.token) {
            console.log('✅ 토큰 발급 성공!');
            resolve(result.token);
          } else {
            console.log('❌ 토큰 발급 실패');
            reject(new Error('토큰 없음'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// 2단계: 메시지 전송
function sendMessage(token) {
  return new Promise((resolve, reject) => {
    const messageData = {
      account: PPURIO_USERNAME,
      messageType: 'SMS',
      content: '[케어온 테스트] SMS V1 API 연동 테스트 메시지입니다.',
      from: SENDER_PHONE,
      duplicateFlag: 'N',
      targetCount: 1,
      targets: [
        {
          to: '01032453385', // 테스트용 - 본인 번호로 변경
        }
      ],
      refKey: `test_${Date.now()}`,
    };

    const dataString = JSON.stringify(messageData);

    const options = {
      hostname: 'message.ppurio.com',
      port: 443,
      path: '/v1/message',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(dataString)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log('\n메시지 응답 상태:', res.statusCode);
        console.log('메시지 응답:', data);
        
        try {
          const result = JSON.parse(data);
          if (result.code === '200') {
            console.log('✅ SMS 전송 성공!');
            console.log('메시지 키:', result.messageKey);
            resolve(result);
          } else {
            console.log('❌ SMS 전송 실패:', result.description);
            reject(new Error(result.description));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(dataString);
    req.end();
  });
}

// 메인 실행
async function main() {
  try {
    console.log('=== 뿌리오 SMS V1 API 테스트 시작 ===');
    console.log('계정:', PPURIO_USERNAME);
    console.log('발신번호:', SENDER_PHONE);
    console.log('');

    console.log('1. 토큰 발급 중...');
    const token = await getToken();
    console.log('토큰:', token.substring(0, 20) + '...');
    
    console.log('\n2. SMS 전송 중...');
    const result = await sendMessage(token);
    
    console.log('\n=== 테스트 완료 ===');
  } catch (error) {
    console.error('테스트 실패:', error.message);
  }
}

main();