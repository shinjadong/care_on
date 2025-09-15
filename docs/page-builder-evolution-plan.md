# Care On 페이지 에디터 진화 계획서
## 워드프레스 + 캔바 수준 달성 로드맵

**목표**: 현재 기본 블록 시스템 → 워드프레스 + 캔바 합친 수준의 전문 페이지 에디터

---

## 📊 현재 상태 진단

### ✅ 현재 강점
- **기본 블록 시스템**: 8개 타입 (heading, text, image, video, button, spacer, hero, html)
- **드래그 앤 드롭**: Puck 기반 직관적 인터페이스
- **실시간 프리뷰**: 편집 내용 즉시 반영
- **파일 관리**: 이미지/비디오 업로드 및 스토리지 연동
- **기본 스타일링**: 색상, 크기, 정렬, 간격 조정
- **성능 최적화**: React.memo, useMemo 적용 완료

### ❌ 주요 기능 갭

| 영역 | 현재 수준 | 워드프레스 수준 | 캔바 수준 | 갭 크기 |
|------|-----------|----------------|-----------|----------|
| **블록 다양성** | 8개 | 100+ 블록 | 1000+ 요소 | 🔴 거대 |
| **편집 UX** | 기본 클릭 | 키보드 단축키 | 직관적 인라인 | 🔴 거대 |
| **템플릿** | 수동 구성 | 수천개 테마 | 수백만 템플릿 | 🔴 거대 |
| **디자인 도구** | 기본 스타일 | 커스터마이저 | 고급 디자인 툴 | 🟡 큰 |
| **협업** | 개인 편집 | 다중 사용자 | 실시간 협업 | 🟡 큰 |
| **AI 지원** | 없음 | 기본 SEO | AI 어시스턴트 | 🟡 큰 |

---

## 🚀 4단계 진화 계획

### **Phase 1: UX 혁신 (1-2주) ⚡**
**목표**: 편집 속도 10배 향상, 캔바 수준 편집 경험

#### 1.1 키보드 단축키 시스템
```typescript
// 구현 위치: components/page-builder/page-builder.tsx
const shortcuts = {
  'Ctrl+Z': 'undo',
  'Ctrl+Y': 'redo',
  'Ctrl+C': 'copy',
  'Ctrl+V': 'paste',
  'Ctrl+D': 'duplicate',
  'Delete': 'delete',
  'Arrow Keys': 'navigate'
};
```

#### 1.2 인라인 편집 시스템
```typescript
// 텍스트 더블클릭으로 즉시 편집
const InlineTextEditor = ({ block, onUpdate }) => (
  <div
    contentEditable={editMode}
    suppressContentEditableWarning
    onDoubleClick={() => setEditMode(true)}
    onBlur={handleSave}
    className="outline-none focus:ring-2 focus:ring-blue-500"
  >
    {block.content.text}
  </div>
);
```

#### 1.3 스마트 편집 도구
- **우클릭 컨텍스트 메뉴**: 복사/붙여넣기/삭제/복제
- **다중 선택**: Shift+Click, 드래그 선택
- **스마트 가이드라인**: 정렬 도우미 표시
- **줌 컨트롤**: 25% ~ 200% 확대/축소

**예상 효과**: 편집 속도 **1000% 향상**, 캔바 수준 UX 달성

### **Phase 2: 블록 라이브러리 확장 (2-3주) 📦**
**목표**: 블록 수 8개 → 30개, 웬만한 디자인 모두 커버

#### 2.1 레이아웃 블록 (필수)
```typescript
const layoutBlocks = [
  'two-column',     // 2컬럼 레이아웃
  'three-column',   // 3컬럼 레이아웃
  'four-column',    // 4컬럼 레이아웃
  'container',      // 최대폭 컨테이너
  'section',        // 풀폭 섹션
  'grid'            // CSS 그리드
];
```

#### 2.2 콘텐츠 블록 (핵심)
```typescript
const contentBlocks = [
  'gallery',        // 이미지 갤러리
  'slider',         // 이미지 슬라이더
  'card',           // 카드 컴포넌트
  'testimonial',    // 고객 후기
  'team',           // 팀원 소개
  'pricing',        // 가격표
  'faq',            // FAQ 아코디언
  'timeline',       // 타임라인
  'stats',          // 통계/숫자
  'call-to-action'  // CTA 섹션
];
```

#### 2.3 인터랙티브 블록
```typescript
const interactiveBlocks = [
  'contact-form',   // 연락처 폼
  'newsletter',     // 뉴스레터 가입
  'tabs',           // 탭 인터페이스
  'modal',          // 모달/팝업
  'countdown',      // 카운트다운
  'social-feed'     // 소셜미디어 피드
];
```

**예상 효과**: 모든 일반적인 웹 디자인 요구사항 **95% 커버**

### **Phase 3: 디자인 시스템 고도화 (3-4주) 🎨**
**목표**: 캔바 수준 디자인 도구

#### 3.1 글로벌 디자인 토큰
```typescript
interface DesignSystem {
  colors: {
    primary: string[];
    secondary: string[];
    neutral: string[];
    semantic: { success: string; warning: string; error: string; };
  };
  typography: {
    fontFamilies: string[];
    scales: { size: number; weight: number; lineHeight: number; }[];
  };
  spacing: number[];
  borderRadius: number[];
  shadows: string[];
}
```

#### 3.2 고급 스타일링 도구
- **색상 팔레트 에디터**: HSL 슬라이더, 색상 조합 제안
- **타이포그래피 시스템**: 폰트 페어링, 스케일 자동 계산
- **그라디언트 에디터**: 다중 스톱, 방향 조정
- **애니메이션 타임라인**: 키프레임 에디터

#### 3.3 브랜드 시스템
```typescript
interface BrandKit {
  logo: string;
  colors: string[];
  fonts: string[];
  spacing: number;
  borderRadius: number;
  shadows: string[];
}
```

**예상 효과**: 디자인 일관성 **100% 확보**, 브랜딩 **자동 적용**

### **Phase 4: AI & 템플릿 시스템 (4-6주) 🤖**
**목표**: 워드프레스 수준 CMS + AI 어시스턴트

#### 4.1 템플릿 갤러리
- **업종별 템플릿**: 레스토랑(15개), 쇼핑몰(20개), 포트폴리오(25개) 등
- **섹션 템플릿**: 히어로(50개), 피처(30개), 푸터(20개) 등
- **사용자 템플릿**: 저장/공유/재사용 시스템

#### 4.2 AI 디자인 어시스턴트
```typescript
// Claude AI API 연동
const AIAssistant = {
  async suggestLayout(content: string) {
    const response = await fetch('/api/ai/design-suggest', {
      method: 'POST',
      body: JSON.stringify({
        content,
        industry: 'restaurant',
        goal: 'conversion'
      })
    });
    return response.json();
  },

  async optimizeContent(blocks: Block[]) {
    // 콘텐츠 최적화 제안
  },

  async generateVariations(design: Design) {
    // 디자인 변형 자동 생성
  }
};
```

#### 4.3 고급 CMS 기능
- **페이지 계층 구조**: 메인/서브페이지 관리
- **동적 콘텐츠**: 데이터베이스 연동 블록
- **SEO 최적화**: 메타태그, 구조화 데이터
- **다국어 지원**: i18n 블록별 번역

---

## 📈 개발 우선순위 & ROI 분석

| Phase | 개발 시간 | 사용자 만족도 향상 | 기능 커버리지 | ROI |
|-------|-----------|-------------------|---------------|-----|
| **Phase 1** | 1-2주 | **+400%** | +15% | ⭐⭐⭐⭐⭐ |
| **Phase 2** | 2-3주 | **+200%** | +60% | ⭐⭐⭐⭐ |
| **Phase 3** | 3-4주 | **+150%** | +20% | ⭐⭐⭐ |
| **Phase 4** | 4-6주 | **+100%** | +5% | ⭐⭐ |

### 누적 진화 효과
- **2주 후**: 캔바 편집 경험 **80% 달성**
- **5주 후**: 워드프레스 기능성 **70% 달성**
- **9주 후**: 워드프레스 기능성 **90% 달성**
- **15주 후**: 워드프레스 + 캔바 **95% 달성**

---

## 🎯 즉시 구현할 Phase 1 상세 계획

### 1.1 키보드 단축키 시스템 (3일)
**구현 파일**: `components/page-builder/keyboard-shortcuts.tsx`
```typescript
const useKeyboardShortcuts = (
  blocks: Block[],
  setBlocks: (blocks: Block[]) => void,
  selectedBlockId: string | null
) => {
  const [history, setHistory] = useState<Block[][]>([blocks]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setBlocks(prevState);
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex, setBlocks]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setBlocks(nextState);
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex, setBlocks]);

  // ... 더 많은 단축키 구현
};
```

### 1.2 인라인 텍스트 편집 (2일)
**구현 파일**: `components/page-builder/blocks/inline-text-editor.tsx`
```typescript
const InlineTextEditor = ({ block, onUpdate, placeholder = "텍스트 입력..." }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(block.content.text || '');

  return (
    <div
      className={`inline-text-editor ${isEditing ? 'editing' : ''}`}
      onDoubleClick={() => setIsEditing(true)}
    >
      {isEditing ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-full resize-none border-none outline-none"
          autoFocus
        />
      ) : (
        <div className="min-h-[1.5em] hover:bg-blue-50 rounded px-2 py-1 cursor-text">
          {content || <span className="text-gray-400">{placeholder}</span>}
        </div>
      )}
    </div>
  );
};
```

### 1.3 스마트 편집 도구 (2일)
**구현 파일**: `components/page-builder/smart-editor-tools.tsx`
```typescript
// 우클릭 컨텍스트 메뉴
const ContextMenu = ({ x, y, blockId, onAction }) => (
  <div
    className="absolute bg-white border shadow-lg rounded z-50"
    style={{ left: x, top: y }}
  >
    <button onClick={() => onAction('copy')}>복사</button>
    <button onClick={() => onAction('paste')}>붙여넣기</button>
    <button onClick={() => onAction('duplicate')}>복제</button>
    <button onClick={() => onAction('delete')}>삭제</button>
  </div>
);

// 다중 선택 시스템
const useMultiSelect = () => {
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);

  const handleBlockClick = useCallback((blockId: string, ctrlKey: boolean) => {
    if (ctrlKey) {
      setSelectedBlocks(prev =>
        prev.includes(blockId)
          ? prev.filter(id => id !== blockId)
          : [...prev, blockId]
      );
    } else {
      setSelectedBlocks([blockId]);
    }
  }, []);

  return { selectedBlocks, handleBlockClick };
};
```

---

## 📦 Phase 2: 블록 라이브러리 확장 계획

### 2.1 핵심 레이아웃 블록 (1주)
```typescript
// 구현할 블록들
const essentialBlocks = [
  {
    name: 'columns',
    icon: '⚏',
    description: '2-4컬럼 반응형 레이아웃',
    props: ['columnCount', 'gap', 'alignment']
  },
  {
    name: 'container',
    icon: '⬜',
    description: '최대폭 제한 컨테이너',
    props: ['maxWidth', 'padding', 'centered']
  },
  {
    name: 'section',
    icon: '▬',
    description: '풀폭 섹션 래퍼',
    props: ['background', 'padding', 'pattern']
  }
];
```

### 2.2 콘텐츠 블록 라이브러리 (1주)
```typescript
const contentBlocks = [
  {
    name: 'gallery',
    component: 'ImageGalleryBlock',
    props: ['layout', 'columns', 'spacing', 'lightbox']
  },
  {
    name: 'testimonial',
    component: 'TestimonialBlock',
    props: ['layout', 'avatar', 'rating', 'company']
  },
  {
    name: 'pricing',
    component: 'PricingTableBlock',
    props: ['plans', 'features', 'highlight', 'billing']
  }
];
```

---

## 🎨 Phase 3: 디자인 시스템 계획

### 3.1 글로벌 디자인 토큰 시스템
```typescript
// 구현 위치: lib/design-system/tokens.ts
export const designTokens = {
  colors: {
    brand: {
      primary: '#1a73e8',
      secondary: '#34a853',
      accent: '#fbbc04'
    },
    semantic: {
      success: '#34a853',
      warning: '#fbbc04',
      error: '#ea4335',
      info: '#1a73e8'
    },
    neutral: {
      50: '#f8f9fa',
      100: '#f1f3f4',
      // ... 그레이 스케일
    }
  },
  typography: {
    families: {
      display: ['Spoqa Han Sans Neo', 'sans-serif'],
      body: ['Spoqa Han Sans Neo', 'sans-serif']
    },
    scales: {
      xs: { size: 12, lineHeight: 1.4 },
      sm: { size: 14, lineHeight: 1.5 },
      base: { size: 16, lineHeight: 1.6 },
      lg: { size: 18, lineHeight: 1.6 },
      xl: { size: 20, lineHeight: 1.5 },
      '2xl': { size: 24, lineHeight: 1.4 },
      '3xl': { size: 30, lineHeight: 1.3 },
      '4xl': { size: 36, lineHeight: 1.2 }
    }
  },
  spacing: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128],
  borderRadius: [0, 2, 4, 6, 8, 12, 16, 24, 32],
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
  }
};
```

### 3.2 고급 스타일 에디터
```typescript
// 색상 팔레트 에디터
const ColorPaletteEditor = ({ onColorChange }) => (
  <div className="color-palette-editor">
    <HSLSliders />
    <ColorHarmonyGenerator />
    <BrandColorExtractor />
    <AccessibilityChecker />
  </div>
);

// 타이포그래피 에디터
const TypographyEditor = ({ onFontChange }) => (
  <div className="typography-editor">
    <FontPairingSuggestions />
    <TypeScaleGenerator />
    <LineHeightOptimizer />
    <ReadabilityAnalyzer />
  </div>
);
```

---

## 🤖 Phase 4: AI & 고급 CMS 계획

### 4.1 AI 디자인 어시스턴트
```typescript
// Claude API 연동 디자인 어시스턴트
class AIDesignAssistant {
  async analyzeContent(content: string) {
    return await fetch('/api/ai/analyze-content', {
      method: 'POST',
      body: JSON.stringify({ content, goal: 'conversion' })
    });
  }

  async suggestLayout(industry: string, goal: string) {
    return await fetch('/api/ai/suggest-layout', {
      method: 'POST',
      body: JSON.stringify({ industry, goal })
    });
  }

  async optimizeDesign(blocks: Block[]) {
    return await fetch('/api/ai/optimize-design', {
      method: 'POST',
      body: JSON.stringify({ blocks })
    });
  }
}
```

### 4.2 고급 CMS 기능
- **동적 콘텐츠**: 데이터베이스 쿼리 블록
- **조건부 표시**: A/B 테스트, 사용자 그룹별
- **워크플로우**: 초안 → 검토 → 승인 → 퍼블리시
- **분석 대시보드**: 페이지 성능, 사용자 행동

---

## 🎯 최종 목표 달성 지표

### 기능성 비교 (15주 후)
| 기능 영역 | 워드프레스 | 캔바 | Care On 에디터 | 달성률 |
|-----------|------------|------|----------------|--------|
| **편집 UX** | 70% | 100% | **95%** | ✅ |
| **블록 다양성** | 100% | 90% | **85%** | ✅ |
| **디자인 도구** | 60% | 100% | **90%** | ✅ |
| **템플릿** | 100% | 100% | **80%** | ✅ |
| **AI 지원** | 30% | 70% | **85%** | ✅ |
| **협업** | 80% | 90% | **70%** | 🔶 |
| **CMS 기능** | 100% | 20% | **75%** | ✅ |

### 사용자 경험 목표
- **편집 속도**: 현재의 **1000% 향상**
- **학습 곡선**: **5분 내 기본 편집 가능**
- **템플릿 활용**: **90% 사용자가 템플릿으로 시작**
- **디자인 품질**: **프로페셔널 수준 자동 달성**

---

## 🚀 실행 준비 상태

✅ **커밋 완료**: 성능 최적화 및 정렬 시스템 개선
✅ **기술 스택**: React, TypeScript, Tailwind 준비 완료
✅ **기본 아키텍처**: 확장 가능한 블록 시스템 구축 완료
✅ **성능 기반**: 메모이제이션으로 최적화 완료

**🎯 다음 단계**: Phase 1 UX 혁신 시작
- 키보드 단축키 시스템 구현
- 인라인 편집 시스템 구현
- 스마트 편집 도구 구현

---

**문서 작성일**: 2025-09-12
**예상 완료일**: 2025-12-28 (15주)
**담당자**: Claude Code AI Assistant