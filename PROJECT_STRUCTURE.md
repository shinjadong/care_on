# 🏗️ 케어온(Care On) 프로젝트 구조

> **창업자를 위한 종합 비즈니스 플랫폼**  
> Next.js 14 + TypeScript + Tailwind CSS + Supabase

---

## 📁 전체 디렉토리 구조

```
care_on/
├── 📁 app/                          # Next.js App Router 구조
│   ├── 📁 api/                      # API 라우트
│   │   └── 📁 cctv-quotes/          # CCTV 견적 API
│   │       └── 📄 route.ts
│   ├── 📁 cctv-quote-chat/          # CCTV 견적 채팅 페이지
│   │   ├── 📄 layout.tsx
│   │   └── 📄 page.tsx
│   ├── 📁 review/                   # 📌 NEW! 후기 페이지
│   │   └── 📄 page.tsx
│   ├── 📁 start-care/               # 메인 랜딩 페이지
│   │   └── 📄 page.tsx
│   ├── 📄 globals.css               # 전역 스타일
│   ├── 📄 layout.tsx                # 루트 레이아웃
│   ├── 📄 page.tsx                  # 홈페이지
│   └── 📄 upload-action.ts          # 파일 업로드 액션
│
├── 📁 components/                   # 재사용 가능한 컴포넌트
│   ├── 📁 backup/                   # 백업된 기존 컴포넌트들
│   ├── 📁 cctv-quote-chat/          # CCTV 견적 채팅 컴포넌트
│   ├── 📁 review/                   # 📌 NEW! 후기 페이지 컴포넌트
│   │   ├── 📄 category-filter.tsx   # 카테고리 필터 탭
│   │   ├── 📄 review-card.tsx       # 후기 카드 컴포넌트
│   │   ├── 📄 review-header.tsx     # 후기 페이지 헤더
│   │   ├── 📄 review-pagination.tsx # 페이지네이션
│   │   └── 📄 search-bar.tsx        # 검색 기능
│   ├── 📁 start-care/               # 랜딩 페이지 컴포넌트들
│   │   ├── 📄 anxiety-check.tsx     # 불안감 체크 섹션
│   │   ├── 📄 authority-co-companies.tsx # 협력사 로고
│   │   ├── 📄 first-year-matters.tsx # 첫 1년의 중요성
│   │   ├── 📄 image-uploader.tsx    # 이미지 업로더
│   │   ├── 📄 no-one-protects-you.tsx # 보호 필요성 강조
│   │   ├── 📄 score-explanation.tsx # 점수 설명
│   │   ├── 📄 secrets-1to3.tsx      # 3가지 비밀
│   │   ├── 📄 test-safety.tsx       # 안전성 테스트
│   │   ├── 📄 three-no-fail-secrets.tsx # 실패 없는 비밀
│   │   ├── 📄 three-one-off.tsx     # 일회성 혜택
│   │   ├── 📄 three-untold-secrets.tsx # 숨겨진 비밀
│   │   └── 📄 unbelievable-but-true.tsx # 믿기 힘든 진실
│   ├── 📁 ui/                       # shadcn/ui 컴포넌트 라이브러리
│   └── 📄 theme-provider.tsx        # 테마 프로바이더
│
├── 📁 hooks/                        # 커스텀 React 훅
│   ├── 📄 use-mobile.tsx
│   └── 📄 use-toast.ts
│
├── 📁 lib/                          # 유틸리티 라이브러리
│   ├── 📁 supabase/                 # Supabase 설정
│   │   ├── 📄 client.ts             # 클라이언트 설정
│   │   └── 📄 server.ts             # 서버 설정
│   ├── 📄 cctv-knowledge-base.ts    # CCTV 지식 베이스
│   ├── 📄 chat-flow.ts              # 채팅 플로우 로직
│   ├── 📄 reviews-data.ts           # 📌 NEW! 후기 데이터
│   ├── 📄 types.ts                  # 타입 정의
│   └── 📄 utils.ts                  # 유틸리티 함수
│
├── 📁 public/                       # 정적 파일
│   ├── 🖼️ favicon.png              # 파비콘
│   ├── 🖼️ laurel_left_clean.png    # 왼쪽 월계수
│   ├── 🖼️ laurel_right_clean.png   # 오른쪽 월계수
│   ├── 🖼️ partner-logos-strip-*.png # 파트너 로고들
│   └── 🖼️ placeholder-*.jpg/svg    # 플레이스홀더 이미지들
│
├── 📁 styles/                       # 스타일 파일
│   └── 📄 globals.css
│
├── 📄 components.json               # shadcn/ui 설정
├── 📄 next.config.mjs               # Next.js 설정
├── 📄 package.json                  # 의존성 관리
├── 📄 tailwind.config.ts            # Tailwind CSS 설정
└── 📄 tsconfig.json                 # TypeScript 설정
```

---

## 🎯 주요 페이지 구조

### 🏠 메인 랜딩 페이지 (`/start-care`)
**창업자를 위한 종합 안내 페이지**

| 컴포넌트 | 역할 | 상태 |
|---------|------|------|
| `anxiety-check.tsx` | 창업 불안감 체크 | ✅ 완성 |
| `authority-co-companies.tsx` | 신뢰할 수 있는 협력사 | ✅ 완성 |
| `first-year-matters.tsx` | 첫 1년의 중요성 강조 | ✅ 완성 |
| `no-one-protects-you.tsx` | 보호 필요성 어필 | ✅ 완성 |
| `secrets-1to3.tsx` | 3가지 핵심 비밀 | ✅ 완성 |
| `test-safety.tsx` | 안전성 테스트 | ✅ 완성 |
| `unbelievable-but-true.tsx` | 충격적 현실 제시 | ✅ 완성 |

### 💬 CCTV 견적 채팅 (`/cctv-quote-chat`)
**AI 기반 CCTV 견적 상담 서비스**

| 컴포넌트 | 역할 | 상태 |
|---------|------|------|
| `cctv-quote-chat-ui.tsx` | 채팅 UI 메인 | ✅ 완성 |
| `streaming-text-ui.tsx` | 스트리밍 텍스트 | ✅ 완성 |
| `use-cctv-quote-chat.ts` | 채팅 로직 훅 | ✅ 완성 |

### ⭐ 후기 페이지 (`/review`) - **NEW!**
**이상한마케팅 아카데미 클론**

| 컴포넌트 | 역할 | 상태 |
|---------|------|------|
| `review-header.tsx` | 페이지 헤더 | ✅ 완성 |
| `category-filter.tsx` | 카테고리 필터 | ✅ 완성 |
| `review-card.tsx` | 후기 카드 | ✅ 완성 |
| `review-pagination.tsx` | 페이지네이션 | ✅ 완성 |
| `search-bar.tsx` | 검색 기능 | ✅ 완성 |

---

## 🛠️ 기술 스택

### **Frontend**
- ⚡ **Next.js 14** - App Router 사용
- 🎨 **TypeScript** - 타입 안정성
- 🎪 **Tailwind CSS** - 유틸리티 퍼스트 CSS
- 🎭 **Framer Motion** - 애니메이션
- 🧩 **shadcn/ui** - 컴포넌트 라이브러리
- 🏷️ **Heroicons** - 아이콘 라이브러리

### **Backend & Database**
- 🗄️ **Supabase** - BaaS (Backend as a Service)
- 🔌 **API Routes** - Next.js 서버리스 함수

---

## 🎨 디자인 시스템

### **브랜드 컬러**
- 🌊 **Primary**: `#148777` (케어온 시그니처 청록색)
- 🔥 **Accent**: `#dc2626` (강조 빨간색)
- ⚡ **Warning**: `#f59e0b` (경고 노란색)
- 🌙 **Dark**: `#1f2937` (다크 그레이)

### **Typography**
- 📝 **Primary**: `Noto Serif KR` (한글 세리프)
- 🖋️ **Secondary**: `Garamond` (영문 세리프)
- 💻 **Monospace**: `Consolas` (코드용)

---

## 📊 페이지별 기능 현황

| 페이지 | URL | 상태 | 주요 기능 |
|--------|-----|------|----------|
| 🏠 홈 | `/` | ✅ 완성 | 기본 랜딩 |
| 🎯 메인 랜딩 | `/start-care` | ✅ 완성 | 창업 지원 서비스 소개 |
| 💬 CCTV 견적 | `/cctv-quote-chat` | ✅ 완성 | AI 기반 견적 상담 |
| ⭐ 후기 | `/review` | ✅ 완성 | 성공 사례 및 후기 |

---

## 🚀 최근 업데이트 (2024년)

### **v2.1.0** - 후기 페이지 추가
- ⭐ **NEW**: `/review` 페이지 신규 생성
- 📊 이상한마케팅 아카데미 구조 클론
- 🎨 케어온 브랜드 컬러 적용
- 🔍 실시간 검색 및 필터링
- 📱 반응형 디자인 최적화
- 🎭 framer-motion 애니메이션

### **v2.0.0** - 랜딩 페이지 완성
- 🎯 `/start-care` 메인 랜딩 페이지 완성
- 🎨 모든 컴포넌트 애니메이션 적용
- 📱 모바일 최적화 완료
- 🖼️ 이미지 최적화 및 파비콘 추가

---

*마지막 업데이트: 2024년 12월*  
*프로젝트 관리자: 케어온 개발팀*

**🎯 케어온(Care On) - 창업자의 든든한 파트너**