// Supabase URL 확인 스크립트
const fs = require('fs');
const path = require('path');

// .env.local 파일 읽기
const envPath = path.join(process.cwd(), '.env.local');

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  let supabaseUrl = '';
  let supabaseKey = '';
  
  lines.forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1].trim();
    }
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      supabaseKey = line.split('=')[1].trim();
    }
  });
  
  if (supabaseUrl && supabaseKey) {
    console.log('=== Supabase Edge Function 정보 ===\n');
    console.log('프로젝트 URL:', supabaseUrl);
    console.log('Edge Function URL:', `${supabaseUrl}/functions/v1/send-sms`);
    console.log('IP 확인 URL:', `${supabaseUrl}/functions/v1/send-sms/ip-check`);
    console.log('\n=== Edge Function IP 확인 명령어 ===\n');
    console.log(`curl ${supabaseUrl}/functions/v1/send-sms/ip-check \\`);
    console.log(`  -H "Authorization: Bearer ${supabaseKey.substring(0, 20)}..."`);
    console.log('\n=== SMS 테스트 명령어 ===\n');
    console.log(`curl -X POST ${supabaseUrl}/functions/v1/send-sms \\`);
    console.log(`  -H "Authorization: Bearer ${supabaseKey.substring(0, 20)}..." \\`);
    console.log(`  -H "Content-Type: application/json" \\`);
    console.log(`  -d '{"to": "010-3245-3385", "name": "테스트", "businessType": "요식업"}'`);
    
    // 환경변수 export
    console.log('\n=== 환경변수 설정 (테스트용) ===\n');
    console.log(`export NEXT_PUBLIC_SUPABASE_URL="${supabaseUrl}"`);
    console.log(`export NEXT_PUBLIC_SUPABASE_ANON_KEY="${supabaseKey.substring(0, 20)}..."`);
  } else {
    console.log('Supabase 환경변수를 찾을 수 없습니다.');
    console.log('.env.local 파일을 확인해주세요.');
  }
} else {
  console.log('.env.local 파일이 없습니다.');
}
