# CareOn CSS Style Guide

**업데이트:** 2025-09-15
**상태:** ✅ 통합 완료 + 🌟 Glassmorphic UI 추가
**개발 서버:** http://localhost:3000
**데모 페이지:** http://localhost:3000/glass-demo

## 📋 통합 작업 완료 사항

### ✅ Phase 1 완료
- [x] 중복 `globals.css` 파일 통합 (`styles/globals.css` 제거)
- [x] 불필요한 CSS 섹션 제거 (KBoard, Apple Music 스타일 등)
- [x] CSS 변수 정리 및 브랜드 색상 통합
- [x] Tailwind config에 디자인 토큰 추가
- [x] 통합된 시스템으로 개발 서버 실행 성공

---

## 🎨 CareOn 디자인 시스템

### 브랜드 색상
```css
/* Primary - CareOn 브랜드 그린 */
--primary: 171 74% 30%; /* #148777 */

/* 사용법 */
.bg-brand        /* 브랜드 배경색 */
.text-brand      /* 브랜드 텍스트 색상 */
.border-brand    /* 브랜드 테두리 */
.ring-brand      /* 브랜드 포커스 링 */
```

### 타이포그래피 시스템
```css
/* 반응형 폰트 사이즈 (하드코딩 값 대체) */
text-hero        /* clamp(3rem, 8vw, 6rem) - 히어로 제목 */
text-hero-mobile /* clamp(2.5rem, 6vw, 5rem) - 모바일 히어로 */
text-display     /* clamp(2.5rem, 5vw, 4rem) - 디스플레이 텍스트 */
```

### 간격 시스템
```css
/* 특정 컴포넌트용 간격 (하드코딩 값 대체) */
w-phone-w        /* 260px - 모바일 폰 너비 */
w-phone-w-sm     /* 280px - 작은 모바일 폰 너비 */
h-phone-h        /* 530px - 모바일 폰 높이 */
h-phone-h-sm     /* 570px - 작은 모바일 폰 높이 */
p-section        /* 80px - 섹션 패딩 */
p-section-sm     /* 60px - 작은 섹션 패딩 */
```

### 애니메이션 시스템
```css
/* CareOn 표준 애니메이션 */
animate-slide-down         /* 위에서 슬라이드 */
animate-fade-in           /* 페이드인 + 살짝 위로 */
animate-bounce-slow       /* 느린 바운스 */
animate-slide-up-from-bottom /* 아래에서 슬라이드업 */
```

---

## 🛠️ 권장 사용 패턴

### ✅ 권장하는 방식

#### 1. 색상 사용
```tsx
// ✅ 좋은 예시
<button className="bg-brand text-brand-foreground hover:bg-brand/90">
  CareOn 버튼
</button>

// ❌ 피해야 할 예시
<button style={{backgroundColor: '#148777'}}>
```

#### 2. 카드 컴포넌트
```tsx
// ✅ 새로운 CareOn 컴포넌트 시스템
<div className="careon-card">
  <div className="careon-card-header">
    <h3 className="careon-title">제목</h3>
    <p className="careon-subtitle">부제목</p>
  </div>
  <div className="careon-card-body">
    내용
  </div>
</div>
```

#### 3. 폼 요소
```tsx
// ✅ 통합된 폼 스타일
<div>
  <label className="careon-label">라벨</label>
  <input className="careon-input" placeholder="입력하세요" />
</div>
```

#### 4. 상태 표시
```tsx
// ✅ 표준 상태 클래스
<span className="status-success">성공</span>
<span className="status-warning">경고</span>
<span className="status-error">오류</span>
<span className="status-info">정보</span>
```

### ❌ 피해야 할 패턴

#### 1. 하드코딩된 크기
```tsx
// ❌ 피해야 할 예시
<div className="w-[260px] h-[530px]">

// ✅ 대신 이렇게
<div className="w-phone-w h-phone-h">
```

#### 2. 인라인 스타일
```tsx
// ❌ 피해야 할 예시
<div style={{color: '#148777', fontSize: 'clamp(3rem, 8vw, 6rem)'}}>

// ✅ 대신 이렇게
<div className="text-brand text-hero">
```

#### 3. 커스텀 CSS 클래스
```tsx
// ❌ 피해야 할 예시 (기존 Apple Music 스타일)
<div className="hero-content-headline typography-hero-headline">

// ✅ 대신 이렇게
<div className="text-hero font-bold text-brand">
```

---

## 🎯 관리자 대시보드 전용

### 사이드바 스타일링
```tsx
// 관리자 사이드바 컴포넌트
<div className="admin-sidebar">
  <nav>
    <a href="/admin" className="admin-nav-item active">대시보드</a>
    <a href="/admin/users" className="admin-nav-item">사용자</a>
  </nav>
</div>
```

### 차트 색상
```tsx
// Recharts 등에서 사용할 색상
const CHART_COLORS = [
  'hsl(var(--chart-1))', // 브랜드 색상 1
  'hsl(var(--chart-2))', // 브랜드 색상 2
  'hsl(var(--chart-3))', // 브랜드 색상 3
  'hsl(var(--chart-4))', // 보조 색상 1
  'hsl(var(--chart-5))', // 보조 색상 2
]
```

---

## 📱 반응형 디자인

### 모바일 우선 유틸리티
```tsx
// 모바일에서 세로 스택, 데스크톱에서 가로 배치
<div className="flex flex-col sm:flex-row careon-mobile-stack">

// 모바일에서 전체 너비
<button className="careon-mobile-full sm:w-auto">
```

### iOS 스타일 유틸리티
```tsx
// iOS 스타일 블러 효과
<header className="ios-blur">

// iOS Safe Area 대응
<div className="safe-top safe-bottom">
```

---

## 🔄 마이그레이션 가이드

### 기존 컴포넌트 업데이트 방법

#### Before (기존)
```tsx
<div className="section hero-sticky-container">
  <div className="hero-content-container">
    <h1 className="typography-hero-headline" style={{fontSize: 'clamp(3rem, 8vw, 6rem)'}}>
      제목
    </h1>
  </div>
</div>
```

#### After (새로운 방식)
```tsx
<div className="py-section">
  <div className="max-w-4xl mx-auto bg-black/30 backdrop-blur-md rounded-3xl p-hero-padding">
    <h1 className="text-hero font-bold text-white">
      제목
    </h1>
  </div>
</div>
```

### 우선순위별 마이그레이션

#### 🔴 우선순위 HIGH
1. **자주 사용되는 컴포넌트**
   - `components/ui/*` → 이미 최신 상태 ✅
   - `components/what/BusinessTypeSelector` → 이미 최신 상태 ✅

#### 🟡 우선순위 MEDIUM
2. **히어로 섹션들**
   - `components/services/hero.tsx`
   - `components/start-care/hero-section.tsx`

#### 🟢 우선순위 LOW
3. **기타 컴포넌트들**
   - 사용 빈도가 낮은 컴포넌트들

---

## 🧪 테스트 및 검증

### 개발 서버 확인
```bash
npm run dev
# ✅ http://localhost:3000 에서 실행 중
```

### 주요 페이지 테스트 체크리스트
- [ ] `/` - 메인 페이지
- [ ] `/admin` - 관리자 대시보드
- [ ] `/admin/customers` - 고객 관리
- [ ] `/services/cctv` - 서비스 페이지
- [ ] 다크모드 토글 테스트

### CSS 로드 확인
```bash
# 개발자 도구에서 확인
- globals.css 로드 확인
- CSS 변수 적용 확인 (--brand, --primary 등)
- Tailwind 클래스 작동 확인
```

---

## 📚 다음 단계

### Phase 2: 점진적 컴포넌트 마이그레이션
1. 히어로 섹션 컴포넌트들 우선 업데이트
2. 각 컴포넌트별 테스트 진행
3. 시각적 변화 검증

### Phase 3: 성능 최적화
1. 사용하지 않는 CSS 제거
2. Critical CSS 분리
3. Bundle 사이즈 최적화

---

## 🚨 주의사항

### 커밋 가이드라인
- 스타일 변경사항은 별도 PR로 분리
- 각 컴포넌트 변경 후 해당 페이지 테스트 완료
- 시각적 변화가 있는 경우 스크린샷 첨부

### 브레이킹 체인지 대응
- 기존 커스텀 CSS 클래스에 의존하는 코드 주의
- 점진적 마이그레이션으로 리스크 최소화
- 각 단계별 충분한 테스트 진행

---

## ✨ 최종 정리

✅ **CareOn 프로젝트 CSS 통일화 Phase 1 완료!**

- **단일 globals.css**: 모든 스타일이 `app/globals.css`에 통합
- **브랜드 색상 시스템**: `--brand` 변수로 일관된 색상 관리
- **디자인 토큰**: 하드코딩된 값들이 Tailwind config로 이동
- **컴포넌트 시스템**: `careon-*` 클래스로 표준화
- **개발 효율성**: 일관된 스타일링 패턴으로 개발 속도 향상

이제 프로젝트 전체에서 **하나의 통일된 CSS 시스템**을 사용할 수 있습니다! 🎉