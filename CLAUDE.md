# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🤖 논스톱 개발 자동화 전략

### 핵심 목표
이 문서는 **Claude Code와 Claude AI가 협업하여 맥락을 잃지 않고 지속적으로 개발을 진행**하기 위한 완벽한 자동화 가이드입니다.

### 개발 자동화 워크플로우

#### 1️⃣ 프로젝트 전체 파악 단계
**모든 개발 작업 시작 전, 반드시 프로젝트 전체 구조를 파악하세요:**

```bash
# Desktop Commander MCP를 사용한 프로젝트 구조 파악
# 1. 프로젝트 루트 디렉토리 탐색
mcp_Desktop_Commander_list_directory("/home/tlswk/projects/careon/care_on")

# 2. 핵심 디렉토리별 파일 확인
mcp_Desktop_Commander_list_directory("/home/tlswk/projects/careon/care_on/app")
mcp_Desktop_Commander_list_directory("/home/tlswk/projects/careon/care_on/components")
mcp_Desktop_Commander_list_directory("/home/tlswk/projects/careon/care_on/lib")

# 3. 최근 수정된 파일 검색 (현재 작업 맥락 파악)
mcp_Desktop_Commander_start_search(
  path="/home/tlswk/projects/careon/care_on",
  pattern="*.tsx",
  searchType="files"
)
```

#### 2️⃣ 코드 구현 후 즉시 테스트
**Chrome DevTools MCP를 활용한 자동 테스트:**

```javascript
// 1. 개발 서버가 실행 중인지 확인
// 터미널에서 npm run dev 실행 상태 체크

// 2. Chrome으로 페이지 접속
mcp_Chrome_DevTools_navigate_page("http://localhost:3000/구현한페이지")

// 3. 페이지 스냅샷으로 구조 파악
mcp_Chrome_DevTools_take_snapshot()

// 4. 스크린샷으로 시각적 확인
mcp_Chrome_DevTools_take_screenshot({ format: "png" })

// 5. 콘솔 에러 확인
mcp_Chrome_DevTools_list_console_messages()

// 6. 네트워크 요청 확인
mcp_Chrome_DevTools_list_network_requests({ 
  resourceTypes: ["fetch", "xhr"] 
})
```

#### 3️⃣ 디버깅 자동화
**에러 발견 시 즉시 원인 파악:**

```bash
# 1. 에러가 발생한 파일 찾기
mcp_Desktop_Commander_start_search(
  path="/home/tlswk/projects/careon/care_on",
  pattern="에러메시지키워드",
  searchType="content"
)

# 2. 관련 파일 읽기
mcp_Desktop_Commander_read_file("파일경로")

# 3. 수정 후 재테스트
# Chrome DevTools로 실시간 확인
```

#### 4️⃣ 맥락 유지 전략
**개발 진행 상황을 놓치지 않기 위한 체크리스트:**

- [ ] **파일 변경 추적**: Desktop Commander로 최근 수정 파일 확인
- [ ] **TODO 주석 검색**: 미완성 작업 파악
- [ ] **Import 관계 분석**: 영향받는 컴포넌트 파악
- [ ] **Database Migration 확인**: DB 스키마 변경사항 체크
- [ ] **Environment 변수**: 새로운 환경변수 필요 여부 확인

---

## 🔧 Chrome DevTools MCP 완벽 가이드

### 페이지 네비게이션

```javascript
// 새 페이지 열기
mcp_Chrome_DevTools_new_page({ url: "http://localhost:3000" })

// 현재 페이지 이동
mcp_Chrome_DevTools_navigate_page({ url: "http://localhost:3000/admin" })

// 뒤로/앞으로 가기
mcp_Chrome_DevTools_navigate_page_history({ navigate: "back" })
mcp_Chrome_DevTools_navigate_page_history({ navigate: "forward" })

// 페이지 목록 확인
mcp_Chrome_DevTools_list_pages()

// 페이지 선택
mcp_Chrome_DevTools_select_page({ pageIdx: 1 })

// 페이지 닫기
mcp_Chrome_DevTools_close_page({ pageIdx: 1 })
```

### 페이지 분석

```javascript
// 페이지 스냅샷 (DOM 구조 + uid)
mcp_Chrome_DevTools_take_snapshot()

// 스크린샷 캡처
mcp_Chrome_DevTools_take_screenshot({ 
  format: "png",  // "png" | "jpeg"
  quality: 90,    // JPEG 품질 (0-100)
  fullPage: true  // 전체 페이지 캡처
})

// 특정 요소 스크린샷
mcp_Chrome_DevTools_take_screenshot({ 
  uid: "2_15",    // 스냅샷에서 얻은 요소 uid
  format: "png" 
})

// 페이지 리사이즈
mcp_Chrome_DevTools_resize_page({ 
  width: 1920, 
  height: 1080 
})
```

### 인터랙션 자동화

```javascript
// 클릭 이벤트
mcp_Chrome_DevTools_click({ 
  uid: "2_23",        // 요소 uid
  dblClick: false     // 더블클릭 여부
})

// 호버 (마우스 올리기)
mcp_Chrome_DevTools_hover({ uid: "2_15" })

// 폼 입력
mcp_Chrome_DevTools_fill({ 
  uid: "2_20", 
  value: "입력할 텍스트" 
})

// 여러 폼 한번에 입력
mcp_Chrome_DevTools_fill_form({ 
  elements: [
    { uid: "2_20", value: "홍길동" },
    { uid: "2_22", value: "hong@example.com" }
  ]
})

// 드래그 앤 드롭
mcp_Chrome_DevTools_drag({ 
  from_uid: "2_10", 
  to_uid: "2_15" 
})

// 파일 업로드
mcp_Chrome_DevTools_upload_file({ 
  uid: "2_25", 
  filePath: "/absolute/path/to/file.pdf" 
})

// 다이얼로그 처리
mcp_Chrome_DevTools_handle_dialog({ 
  action: "accept",      // "accept" | "dismiss"
  promptText: "입력값"   // prompt 다이얼로그용
})

// 특정 텍스트 나타날 때까지 대기
mcp_Chrome_DevTools_wait_for({ text: "로딩 완료" })
```

### 네트워크 & 성능

```javascript
// 네트워크 요청 목록
mcp_Chrome_DevTools_list_network_requests({ 
  resourceTypes: ["fetch", "xhr", "script", "stylesheet"],
  pageIdx: 0,      // 페이지 번호
  pageSize: 50     // 결과 개수
})

// 특정 요청 상세 정보
mcp_Chrome_DevTools_get_network_request({ 
  url: "http://localhost:3000/api/customers" 
})

// CPU 성능 제한 (테스트용)
mcp_Chrome_DevTools_emulate_cpu({ 
  throttlingRate: 4  // 1-20 (4배 느리게)
})

// 네트워크 속도 제한
mcp_Chrome_DevTools_emulate_network({ 
  throttlingOption: "Slow 3G"  // "Slow 3G" | "Fast 3G" | "Slow 4G" | "Fast 4G" | "No emulation"
})

// 성능 트레이스 시작
mcp_Chrome_DevTools_performance_start_trace({ 
  reload: true,      // 페이지 새로고침
  autoStop: true     // 자동 종료
})

// 성능 트레이스 중지
mcp_Chrome_DevTools_performance_stop_trace()

// 성능 인사이트 분석
mcp_Chrome_DevTools_performance_analyze_insight({ 
  insightName: "LCPBreakdown"  // 분석할 인사이트 이름
})
```

### 디버깅

```javascript
// 콘솔 메시지 확인
mcp_Chrome_DevTools_list_console_messages()

// JavaScript 실행
mcp_Chrome_DevTools_evaluate_script({ 
  function: `() => {
    return document.title;
  }`
})

// 요소를 인자로 받는 함수 실행
mcp_Chrome_DevTools_evaluate_script({ 
  function: `(el) => {
    return el.innerText;
  }`,
  args: [{ uid: "2_15" }]
})

// async 함수 실행
mcp_Chrome_DevTools_evaluate_script({ 
  function: `async () => {
    const response = await fetch('/api/customers');
    return await response.json();
  }`
})
```

---

## 📁 Desktop Commander MCP 완벽 가이드

### 파일 시스템 탐색

```javascript
// 디렉토리 내용 확인
mcp_Desktop_Commander_list_directory({ 
  path: "/home/tlswk/projects/careon/care_on" 
})

// 파일 정보 확인 (크기, 수정일, 줄 수 등)
mcp_Desktop_Commander_get_file_info({ 
  path: "/home/tlswk/projects/careon/care_on/package.json" 
})

// 파일 읽기
mcp_Desktop_Commander_read_file({ 
  path: "/home/tlswk/projects/careon/care_on/app/page.tsx",
  offset: 0,     // 시작 줄 (0부터 시작)
  length: 100    // 읽을 줄 수
})

// 파일 끝부분 읽기 (tail)
mcp_Desktop_Commander_read_file({ 
  path: "/home/tlswk/projects/careon/care_on/app/page.tsx",
  offset: -20    // 마지막 20줄
})

// 여러 파일 동시 읽기
mcp_Desktop_Commander_read_multiple_files({ 
  paths: [
    "/home/tlswk/projects/careon/care_on/package.json",
    "/home/tlswk/projects/careon/care_on/tsconfig.json"
  ]
})
```

### 파일 수정

```javascript
// 파일 쓰기 (덮어쓰기)
mcp_Desktop_Commander_write_file({ 
  path: "/home/tlswk/projects/careon/care_on/test.txt",
  content: "새로운 내용",
  mode: "rewrite"
})

// 파일 추가 (append)
mcp_Desktop_Commander_write_file({ 
  path: "/home/tlswk/projects/careon/care_on/test.txt",
  content: "추가 내용",
  mode: "append"
})

// 코드 블록 수정 (정밀 편집)
mcp_Desktop_Commander_edit_block({ 
  file_path: "/home/tlswk/projects/careon/care_on/app/page.tsx",
  old_string: `export default function Page() {
  return <div>기존 코드</div>
}`,
  new_string: `export default function Page() {
  return <div>수정된 코드</div>
}`,
  expected_replacements: 1  // 기대하는 교체 횟수
})

// 디렉토리 생성
mcp_Desktop_Commander_create_directory({ 
  path: "/home/tlswk/projects/careon/care_on/new-folder" 
})

// 파일/디렉토리 이동
mcp_Desktop_Commander_move_file({ 
  source: "/home/tlswk/projects/careon/care_on/old.txt",
  destination: "/home/tlswk/projects/careon/care_on/new.txt"
})
```

### 파일 검색 (강력한 기능!)

```javascript
// 파일명 검색
mcp_Desktop_Commander_start_search({ 
  path: "/home/tlswk/projects/careon/care_on",
  pattern: "*.tsx",
  searchType: "files",
  ignoreCase: true,
  includeHidden: false,
  maxResults: 100
})

// 파일 내용 검색
mcp_Desktop_Commander_start_search({ 
  path: "/home/tlswk/projects/careon/care_on",
  pattern: "useState",
  searchType: "content",
  filePattern: "*.tsx|*.ts",  // 특정 파일 타입만
  contextLines: 5,            // 매칭된 줄 주변 라인 수
  literalSearch: false,       // false: 정규식, true: 정확한 문자열
  ignoreCase: true
})

// 검색 결과 가져오기
mcp_Desktop_Commander_get_more_search_results({ 
  sessionId: "search-session-id",
  offset: 0,
  length: 50
})

// 검색 중지
mcp_Desktop_Commander_stop_search({ 
  sessionId: "search-session-id" 
})

// 활성 검색 목록
mcp_Desktop_Commander_list_searches()
```

### 프로세스 실행

```javascript
// 프로세스 시작 (스마트 감지 포함)
mcp_Desktop_Commander_start_process({ 
  command: "npm run dev",
  timeout_ms: 5000,
  shell: "bash"  // 선택사항
})

// Python REPL 시작 (데이터 분석용)
mcp_Desktop_Commander_start_process({ 
  command: "python3 -i",
  timeout_ms: 3000
})

// 프로세스와 상호작용
mcp_Desktop_Commander_interact_with_process({ 
  pid: 12345,
  input: "import pandas as pd\ndf = pd.read_csv('data.csv')\nprint(df.head())",
  timeout_ms: 8000,
  wait_for_prompt: true  // REPL 프롬프트 대기
})

// 프로세스 출력 읽기
mcp_Desktop_Commander_read_process_output({ 
  pid: 12345,
  timeout_ms: 5000
})

// 프로세스 강제 종료
mcp_Desktop_Commander_force_terminate({ 
  pid: 12345 
})

// 활성 세션 목록
mcp_Desktop_Commander_list_sessions()

// 시스템 프로세스 목록
mcp_Desktop_Commander_list_processes()

// 프로세스 종료
mcp_Desktop_Commander_kill_process({ 
  pid: 12345 
})
```

---

## 🔄 지속적 개발 자동화 패턴

### Pattern 1: 기능 구현 → 즉시 테스트
```javascript
// 1. 컴포넌트 작성
mcp_Desktop_Commander_write_file({...})

// 2. 즉시 브라우저에서 확인
mcp_Chrome_DevTools_navigate_page({...})
mcp_Chrome_DevTools_take_snapshot()
mcp_Chrome_DevTools_list_console_messages()

// 3. 에러 있으면 즉시 수정
if (hasError) {
  mcp_Desktop_Commander_edit_block({...})
}
```

### Pattern 2: 전체 프로젝트 영향 분석
```javascript
// 1. 수정한 파일이 어디에 import 되는지 검색
mcp_Desktop_Commander_start_search({
  pattern: "from './modified-file'",
  searchType: "content"
})

// 2. 영향받는 모든 파일 확인
mcp_Desktop_Commander_get_more_search_results({...})

// 3. 각 페이지별로 테스트
영향받는_페이지들.forEach(page => {
  mcp_Chrome_DevTools_navigate_page({ url: page })
  mcp_Chrome_DevTools_take_screenshot()
})
```

### Pattern 3: Database Migration 후 검증
```javascript
// 1. Migration 실행
mcp_Desktop_Commander_start_process({
  command: "npx supabase db reset"
})

// 2. 서버 재시작 확인
mcp_Desktop_Commander_list_sessions()

// 3. API 테스트
mcp_Chrome_DevTools_evaluate_script({
  function: `async () => {
    const res = await fetch('/api/customers');
    return await res.json();
  }`
})
```

### Pattern 4: 맥락 복구 (작업 재개 시)
```javascript
// 1. 최근 수정 파일 파악
mcp_Desktop_Commander_start_search({
  pattern: "*",
  searchType: "files"
  // 최근 수정순으로 정렬됨
})

// 2. TODO 주석 검색
mcp_Desktop_Commander_start_search({
  pattern: "TODO:|FIXME:",
  searchType: "content"
})

// 3. 현재 페이지 상태 확인
mcp_Chrome_DevTools_take_snapshot()
mcp_Chrome_DevTools_list_console_messages()
```

---

## 📋 프로젝트 개요

**케어온(Care On)** - 창업자를 위한 종합 비즈니스 플랫폼
- 창업 컨설팅, CCTV 보안, 계약 관리, 고객 리뷰, POS/결제 시스템을 통합한 올인원 플랫폼
- 사업자의 95% 생존율을 달성한 검증된 창업 안전망 시스템
- 한국형 창업 생태계에 최적화된 서비스
- 카드 가맹점 신청 및 토스페이 통합 결제 솔루션 제공

## Development Commands

```bash
# Development server
npm run dev           # Start development server at http://localhost:3000

# Production build
npm run build         # Build for production (TypeScript errors ignored in next.config.mjs)
npm start            # Start production server after building

# Code quality
npm run lint         # Run Next.js linter

# Database operations (requires Supabase CLI)
npx supabase migration new <name>  # Create new migration
npx supabase db reset              # Reset database with migrations
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript 5 (strict mode enabled, ES6 target)
- **Frontend**: React 19 with Framer Motion animations
- **Styling**: Tailwind CSS with custom glassmorphic design system
- **UI Components**:
  - ShadcnUI (Radix UI based) in `components/ui/`
  - CareOn custom UI components (`careon-*` prefix)
- **Database**: Supabase (PostgreSQL with RLS)
- **Blob Storage**: Vercel Blob Storage
- **AI Integration**: Anthropic Claude API for HTML assistance and AI-powered features
- **SMS Service**: Ppurio API for Korean SMS notifications
- **Payment**:
  - TossPay integration for payment processing
  - Support for major Korean card companies (KB, BC, Samsung, Woori, Hana)
- **Address**: Daum Postcode API for Korean address search
- **Authentication**:
  - Kakao OAuth for social login
  - Google OAuth via Supabase Auth

### Database Architecture
The application uses Supabase with service role keys for server-side operations. Two client creation patterns:
- **Browser Client**: `lib/supabase/client.ts` - Uses public anon key for client-side operations
- **Server Client**: `lib/supabase/server.ts` - Can use service role key for admin operations (server-side only)
- **RLS Policies**: Currently disabled for development (`20250125000001_disable_rls_temp.sql`)

### Authentication Flow
- Google OAuth integration with Supabase Auth
- Protected routes handled via `components/auth/protected-route.tsx`
- Auth state managed through `hooks/useAuth.tsx`
- Callback handler at `/auth/callback`
- Admin authentication separate from user auth

### API Structure
All API routes are in `app/api/` with key endpoints:
- `/api/ai/html-assist` - Claude AI HTML editor assistance
- `/api/admin/*` - Admin dashboard endpoints
- `/api/agreements/*` - Card company agreements and terms
- `/api/contracts/*` - Contract management
- `/api/enrollment/*` - Merchant enrollment and card application
- `/api/reviews/*` - Review system
- `/api/sms/*` - SMS notifications via Ppurio
- `/api/upload/vercel-blob` - File upload to Vercel Blob Storage

## Project Structure

```
app/
├── admin/          # Admin dashboard (protected routes)
├── api/            # API endpoints
├── enrollment/     # Merchant enrollment flow
├── landing/        # Main landing page (default redirect from /)
├── services/       # Service pages
└── layout.tsx      # Root layout with Header/Footer

components/
├── ui/             # ShadcnUI components
├── ui-backup/      # Backup of original UI components
├── auth/           # Authentication components
├── enrollment/     # Multi-step enrollment form components
├── page-builder/   # Puck page builder integration
└── [feature]/      # Feature-specific components

lib/
├── supabase/       # Supabase clients
├── ppurio/         # SMS service
├── database.types.ts # Supabase database TypeScript types
└── utils/          # Utility functions

content/
├── [카드사명]-동의서.md # Card company agreement documents

docs/
├── 00_dev_docs/    # Development documentation
├── images/         # Documentation images
└── 고객 가입 시스템(리뉴얼)/ # Enrollment system docs

scripts/
├── apply-migration.js # Database migration script
└── check-enrollment-data.js # Enrollment data validation
```

## Environment Variables

Required environment variables (create `.env.local`):
```bash
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Integration
ANTHROPIC_API_KEY=your_claude_api_key

# OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_secret

# Storage
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token

# SMS Service (Korean)
PPURIO_API_KEY=your_ppurio_key
```

## Design System

The project uses a custom glassmorphic design system (see `app/globals.css`):

### CSS Classes
- **Glass containers**: `glass-container`, `glass-container-strong`, `glass-container-soft`
- **Text styles**: `glass-text-primary`, `glass-text-secondary`, `glass-text-muted`
- **Backgrounds**: `glass-bg-primary`, `glass-bg-secondary`, `glass-bg-accent`
- **Social components**: `social-card`, `social-button`, `thread-card`

### Brand Colors
- Primary: `#148777` (CareOn teal)
- Background gradient: Teal to cyan with radial overlays

### Custom Components
CareOn UI components follow a consistent naming pattern (`careon-*`):
- `careon-button` - Styled button with hover effects
- `careon-input` - Custom input field with validation
- `careon-container` - Responsive container wrapper
- `careon-bottom-sheet` - Mobile-friendly bottom sheet
- `careon-carrier-select` - Korean carrier selection dropdown

## Key Features & Workflows

### Supabase Integration
- Migrations in `supabase/migrations/` (chronological order)
- Edge functions in `supabase/functions/`
- Database types in `lib/database.types.ts` (auto-generated from schema)
- Tables: `customers`, `contracts`, `enrollment_applications`, `cs_tickets`, `billing`, `managers`

### Merchant Enrollment System
Multi-step enrollment flow for new merchants:
- Agreement acceptance (TossPay and card companies)
- Business information collection
- Document upload with Vercel Blob Storage
- Real-time validation and progress tracking
- Support for individual and corporate businesses
- Integration with Korean business categories

### Page Builder
The app includes Puck page builder integration at `/admin/pages` for visual page editing with components defined in `components/page-builder/`.

### Review System
Comprehensive review system with:
- Public reviews at `/review`
- Admin management at `/admin/reviews`
- API endpoints for CRUD operations

### Contract Management
Contract system for service agreements:
- Customer portal at `/my/contract`
- Manager view at `/manager/contract`
- Admin management at `/admin/customers`

### Payment Integration
- TossPay for payment processing
- Support for major Korean card companies
- Card merchant application workflow
- Settlement account management

## Development Notes

### Build Configuration
- **TypeScript**: Strict mode enabled but errors ignored in production builds (`ignoreBuildErrors: true`)
- **ESLint**: Errors ignored during builds (`ignoreDuringBuilds: true`)
- **Target**: ES6 with bundler module resolution
- **Image domains**: Vercel Blob Storage, Supabase Storage, YouTube thumbnails

### Routing Patterns
- Root `/` redirects to `/landing` (302 temporary redirect)
- Admin routes (`/admin/*`) require authentication
- API routes follow RESTful conventions with `route.ts` files
- Dynamic routes use `[param]` folder naming

### Performance Considerations
- Framer Motion with `optimizePackageImports` for tree-shaking
- Image optimization: AVIF/WebP formats with 60s minimum cache
- Component lazy loading for large UI sections
- Parallel data fetching in server components

## Recent Updates (2025-01)

### Enrollment System

- Complete merchant enrollment flow with 11+ step wizard
- Integration with TossPay and major Korean card companies
- Document upload system using Vercel Blob Storage
- Database schema for enrollment applications

### UI Components Refactoring

- Migrated original UI components to `ui-backup/`
- Created new CareOn-branded components with consistent design
- Implemented mobile-responsive enrollment forms
- Added Korean business category selection system

### Database Enhancements

- Added `enrollment_applications` table
- SMS webhook integration for Ppurio service
- TypeScript type definitions in `lib/database.types.ts`

### Documentation

- NextJS 15 development guides added
- Card company agreement documents
- Enrollment system technical documentation

## Common Development Tasks

### Working with Enrollment System

When modifying enrollment flow:

1. Check `components/enrollment/` for multi-step form components
2. Update validation in `components/enrollment/EnrollmentSchema.tsx`
3. API endpoint at `/api/enrollment/submit`
4. Database table: `enrollment_applications`

### Admin Dashboard Development

Admin routes require auth check via `/api/admin/check-auth`:

1. Dashboard data from `/api/dashboard/stats`
2. Customer management via `/api/admin/customers`
3. Enrollment approvals at `/api/admin/enrollments/[id]/approve`
4. All admin components use standard ShadcnUI (not glass UI)

### Adding New API Endpoints

Follow the existing patterns:

1. Create `route.ts` file in appropriate `/api/` folder
2. Use `NextRequest` and `NextResponse` from `next/server`
3. Import Supabase client from `lib/supabase/server.ts` for server operations
4. Handle errors with appropriate status codes

### Korean-Specific Features

1. **Address Search**: Use `react-daum-postcode` component
2. **SMS**: Send via `/api/sms/send` using Ppurio service
3. **Business Categories**: See `components/enrollment/steps/BusinessInfo.tsx` for category list

### Admin Dashboard Improvements (2025-09-26)

- **UI System Migration**: Replaced glassmorphic design with standard ShadcnUI components
  - Moved all glass UI components to `components/ui-backup/`
  - Updated admin layout, header, footer to use standard white/gray UI
  - Converted review pages to use standard shadow-based cards

- **Admin API Implementation (Phase 1)**
  - Created comprehensive admin improvement plan (`/admin/ADMIN_IMPROVEMENT_PLAN.md`)
  - Implemented Dashboard Stats API (`/api/dashboard/stats`)
    - Real-time statistics for customers, contracts, tickets, billing
    - Returns actual data from Supabase database
  - Customer Management API (`/api/admin/customers`)
    - Full CRUD operations with pagination and filtering
    - Bulk update support for multiple customers
    - Soft delete functionality
  - Enrollment Approval API (`/api/admin/enrollments/[id]/approve`)
    - Approve/reject enrollment applications
    - Automatic customer account creation on approval
    - SMS notification integration
  - Billing Summary API (`/api/admin/billing/summary`)
    - Monthly revenue tracking and trends
    - 6-month historical data analysis
    - Payment method breakdown

- **Dashboard Enhancement**
  - Connected admin dashboard to real APIs instead of mock data
  - Displays live statistics: 2 customers, 2 contracts, enrollment status
  - Improved error handling with fallback UI states

## Testing Patterns

### Manual Testing Flow

1. Start development server: `npm run dev`
2. Access main landing: `http://localhost:3000/landing`
3. Test enrollment flow: `http://localhost:3000/enrollment`
4. Admin dashboard: `http://localhost:3000/admin` (requires auth)
5. Check API responses in browser DevTools Network tab

### Common Issues & Solutions

- **Supabase connection errors**: Verify `NEXT_PUBLIC_SUPABASE_URL` and keys in `.env.local`
- **Build errors**: TypeScript errors ignored in production, but check with `npm run lint`
- **Admin auth issues**: Check `/api/admin/check-auth` implementation
- **Korean text encoding**: Ensure UTF-8 encoding in all API responses
- **File upload errors**: Verify `BLOB_READ_WRITE_TOKEN` is set for Vercel Blob Storage
