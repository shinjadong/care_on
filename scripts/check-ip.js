// 현재 서버의 공인 IP 확인
const https = require('https');

https.get('https://api.ipify.org?format=json', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const ip = JSON.parse(data).ip;
    console.log('현재 공인 IP:', ip);
    console.log('\n이 IP를 뿌리오 관리자 페이지에 등록해주세요:');
    console.log('1. https://www.ppurio.com 로그인');
    console.log('2. [API 설정] 메뉴 접속');
    console.log('3. [연동 IP 관리] 에서 위 IP 추가');
    console.log('\nVercel 배포 시에는 Vercel의 고정 IP도 등록 필요');
  });
}).on('error', console.error);