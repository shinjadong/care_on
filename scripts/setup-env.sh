#!/bin/bash

# Supabase 환경변수 설정 스크립트
echo "Supabase 환경변수 설정 스크립트"
echo "================================"
echo ""

# .env.local 파일 생성
cat > .env.local << EOL
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://pkehcfbjotctvneordob.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrZWhjZmJqb3RjdHZuZW9yZG9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxOTI2ODEsImV4cCI6MjA2ODc2ODY4MX0.jX3JE0uKyeE_nEm7EcecUwtWd23oHkBrggLhntVHVjc
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrZWhjZmJqb3RjdHZuZW9yZG9iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzE5MjY4MSwiZXhwIjoyMDY4NzY4NjgxfQ.fn1IxRxjJZ6gihy_SCvyQrT6Vx3xb1yMaVzztOsLeyk

# 뿌리오 SMS (필요시 수정)
PPURIO_USERNAME=your_ppurio_username
PPURIO_API_KEY=your_ppurio_api_key
SENDER_PHONE=15880000
EOL

echo "✅ .env.local 파일이 생성되었습니다."
echo ""
echo "주의사항:"
echo "1. 뿌리오 SMS를 사용하려면 PPURIO_USERNAME과 PPURIO_API_KEY를 실제 값으로 수정하세요."
echo "2. 프로덕션 배포시에는 호스팅 서비스의 환경변수 설정을 사용하세요."
echo ""
echo "Vercel 배포시:"
echo "1. https://vercel.com/dashboard 접속"
echo "2. 프로젝트 → Settings → Environment Variables"
echo "3. 위 환경변수들을 추가"
echo "4. Redeploy 실행"
