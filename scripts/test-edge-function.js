// Supabase Edge Function 테스트
const https = require('https');

// Supabase 설정 (환경변수에서 가져오거나 직접 입력)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

// 1. Edge Function IP 확인
async function checkIP() {
  console.log('=== Edge Function IP 확인 ===');
  
  const url = `${SUPABASE_URL}/functions/v1/send-sms/ip-check`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      }
    });
    
    const data = await response.json();
    console.log('Edge Function IP:', data.ip);
    console.log(data.message);
    return data.ip;
  } catch (error) {
    console.error('IP 확인 실패:', error.message);
    return null;
  }
}

// 2. SMS 전송 테스트
async function testSMS() {
  console.log('\n=== SMS 전송 테스트 ===');
  
  const url = `${SUPABASE_URL}/functions/v1/send-sms`;
  
  const testData = {
    to: '010-3245-3385', // 테스트 번호
    name: '테스트',
    businessType: '요식업'
  };
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ SMS 전송 성공!');
      console.log('메시지 키:', data.messageKey);
      console.log('메시지 타입:', data.type);
    } else {
      console.log('❌ SMS 전송 실패:', data.error);
    }
    
    return data;
  } catch (error) {
    console.error('테스트 실패:', error.message);
    return null;
  }
}

// 메인 실행
async function main() {
  console.log('Supabase URL:', SUPABASE_URL);
  console.log('');
  
  // IP 확인
  const ip = await checkIP();
  
  if (ip) {
    console.log('\n뿌리오 관리자 페이지에서 이 IP를 등록하세요:');
    console.log('https://www.ppurio.com');
    console.log('[API 설정] → [연동 IP 관리] → IP 추가:', ip);
  }
  
  // SMS 테스트
  console.log('\nSMS 테스트를 시작하려면 Enter를 누르세요...');
  
  // 사용자 입력 대기
  process.stdin.once('data', async () => {
    await testSMS();
    process.exit(0);
  });
}

// fetch polyfill for Node.js
if (!global.fetch) {
  global.fetch = require('node-fetch');
}

main().catch(console.error);