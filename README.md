# 🚀 Care On (케어온)

> **창업자를 위한 종합 비즈니스 플랫폼**  
> 95% 생존율을 달성한 검증된 창업 안전망 시스템

케어온은 창업 컨설팅, CCTV 보안, 계약 관리, 고객 리뷰 시스템을 통합한 올인원 플랫폼으로, 한국형 창업 생태계에 최적화된 서비스를 제공합니다.

## 🎯 주요 기능

- **📋 스마트 계약 관리**: 디지털 계약서 생성부터 서명까지 완전 자동화
- **🛡️ CCTV 보안 서비스**: AI 기반 맞춤 견적 및 통합 보안 솔루션
- **⭐ 고객 리뷰 시스템**: SEO 최적화된 후기 관리 플랫폼
- **🤖 AI 어시스턴트**: Claude API 기반 콘텐츠 자동 생성
- **📱 통합 커뮤니케이션**: Ppurio SMS와 다채널 고객 소통

## 🛠️ 기술 스택

### Core Framework
- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript 5 (strict mode, ES6 target)
- **Frontend**: React 19 with Framer Motion

### UI/UX
- **Styling**: Tailwind CSS + Custom Glassmorphic Design System
- **UI Components**: ShadcnUI (Radix UI 기반)
- **Icons**: Heroicons & Lucide React
- **Fonts**: Geist, 한글 폰트 최적화

### Backend & Database
- **Database**: Supabase (PostgreSQL + Row Level Security)
- **Authentication**: Google OAuth via Supabase Auth
- **File Storage**: Vercel Blob Storage
- **API**: RESTful API with comprehensive endpoints

### Korean Localization
- **SMS**: Ppurio API (한국 특화)
- **Address**: Daum Postcode API
- **Compliance**: 개인정보보호법 준수

### AI & Automation
- **AI**: Anthropic Claude API
- **Page Builder**: Puck visual editor
- **Form Validation**: Zod schema validation

## 🚀 빠른 시작

### 1. 저장소 클론 및 의존성 설치

\`\`\`bash
git clone <repository-url>
cd care_on
npm install
\`\`\`

### 2. 환경변수 설정

\`\`\`bash
# .env.local 파일 생성 (기본 개발 환경)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI & 외부 서비스
ANTHROPIC_API_KEY=your_claude_api_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_secret

# 한국 특화 서비스
PPURIO_API_KEY=your_ppurio_key  # SMS 발송
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
\`\`\`

### 3. 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

🌐 개발 서버: [http://localhost:3000](http://localhost:3000)  
📱 랜딩 페이지: [http://localhost:3000/landing](http://localhost:3000/landing)  
🔧 관리자: [http://localhost:3000/admin](http://localhost:3000/admin)

### 4. 빌드 및 배포

\`\`\`bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 코드 품질 검사
npm run lint
\`\`\`

## 📁 프로젝트 구조

\`\`\`
care_on/
├── 📱 app/                    # Next.js App Router (메인 애플리케이션)
│   ├── 🔒 admin/              # 관리자 대시보드
│   ├── 🌐 api/                # RESTful API 엔드포인트
│   ├── 🔐 auth/               # 인증 페이지
│   ├── 💬 cctv-quote-chat/    # CCTV 견적 채팅
│   ├── 📄 contract/           # 계약 관리
│   ├── 🏠 landing/            # 메인 랜딩 페이지
│   ├── 👤 my/                 # 사용자 개인 페이지
│   ├── ⭐ review/             # 고객 리뷰 시스템
│   └── 🏢 services/           # 서비스 소개
│
├── 🧩 components/             # 재사용 가능한 UI 컴포넌트
│   ├── ui/                   # ShadcnUI 기본 컴포넌트
│   ├── auth/                 # 인증 관련 컴포넌트
│   ├── page-builder/         # Puck 페이지 빌더
│   └── providers/            # React Context 프로바이더
│
├── 🔧 lib/                   # 유틸리티 및 설정
│   ├── supabase/             # 데이터베이스 클라이언트
│   ├── ppurio/               # SMS 서비스
│   └── utils/                # 헬퍼 함수들
│
├── 📝 content/               # 마크다운 콘텐츠
├── 📚 docs/                  # 프로젝트 문서
├── 🗄️ supabase/             # 데이터베이스 마이그레이션
├── 🎯 types/                 # TypeScript 타입 정의
└── ⚙️ 설정 파일들
\`\`\`

## 🌟 핵심 특징

### ✨ 한국형 UX 최적화
- **주소 검색**: 다음 우편번호 API 통합
- **결제 시스템**: 한국 결제 서비스 연동
- **SMS 알림**: Ppurio 기반 실시간 알림
- **법적 준수**: 개인정보보호법 완벽 대응

### 🎨 Glassmorphic Design System
- **Modern UI**: 투명도와 블러 효과의 유리질감 디자인
- **반응형**: 모바일 퍼스트 접근 방식
- **접근성**: WCAG 2.1 AA 기준 준수
- **브랜드**: 케어온 아이덴티티 일관성

### 🔐 엔터프라이즈급 보안
- **Row Level Security**: Supabase RLS로 데이터 보호
- **OAuth 2.0**: Google 소셜 로그인
- **API 보안**: Rate limiting과 IP 검증
- **데이터 암호화**: 민감 정보 암호화 저장

### 🚀 성능 최적화
- **이미지 최적화**: Next.js Image with AVIF/WebP
- **코드 분할**: 동적 임포트와 Lazy Loading
- **캐싱 전략**: SWR/React Query 활용
- **번들 최적화**: Tree shaking과 최적화된 빌드

## 📖 추가 문서

- **개발 가이드**: [CLAUDE.md](./CLAUDE.md) - 상세한 개발 가이드라인
- **OAuth 설정**: [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)
- **카카오 연동**: [KAKAO_OAUTH_SETUP.md](./KAKAO_OAUTH_SETUP.md)

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your Changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the Branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📄 라이선스

This project is proprietary and confidential.  
© 2024 Care On. All rights reserved.
