자동님,
올려주신 프로젝트(Next 15 + Tailwind + Radix 구성)를 기준으로 **추가 라이브러리 없이** 바로 쓸 수 있는 “iOS 룩&필” 패치를 준비했습니다. **브랜드 포인트 컬러 `#148777`는 극미량**만 쓰도록 **별도 `--brand` 토큰**을 도입하고, 기존 `--primary` 등 전역 토큰은 그대로 둡니다(현재 globals.css의 토큰 구조 유지).
또한, `lucide-react`가 설치되어 있어 기본 아이콘은 그걸 사용하고(원하면 Ionicons로 교체 가능), 경량 iOS 컴포넌트(탑 네비, 탭바, 세그먼티드, 스위치)를 Radix로 구현합니다.

> 요약(지금 바로 적용)
>
> 1. `globals.css`에 **brand 토큰 + iOS 유틸리티** 추가
> 2. `tailwind.config.ts`에 **brand 색상 등록**
> 3. `components/ios/*` 4종 컴포넌트 추가(네비, 탭바, 세그먼티드, 스위치)
> 4. 데모 페이지 1개 추가
>    ※ 라우트/경로 alias `@/*`가 이미 잡혀 있으니 그대로 사용합니다.
>    ※ iPhone 기본 폭 대응이 필요하면 별도 모바일 Tailwind 설정(`xs: 375px`)도 이미 있으니 참고 가능합니다.

---

## 1) `globals.css` 패치 (brand 토큰 + iOS 유틸리티)

> **추가/수정 위치**: 파일 맨 아래에 붙여넣어도 됩니다. 기존 토큰은 손대지 않습니다.

```css
/* ---- iOS brand token & utilities (append) ---- */
@layer base {
  :root {
    /* #148777 -> HSL(171 74% 30%) */
    --brand: 171 74% 30%;
    --brand-foreground: 0 0% 100%;
  }
  .dark {
    /* 다크 모드에서는 살짝 더 밝게(가독성 ↑) */
    --brand: 171 60% 40%;
    --brand-foreground: 0 0% 100%;
  }
}

@layer utilities {
  /* iOS Safe Area */
  .safe-top { padding-top: max(12px, env(safe-area-inset-top)); }
  .safe-bottom { padding-bottom: max(12px, env(safe-area-inset-bottom)); }

  /* iOS 감성: 반투명 + 블러 네비/탭바 */
  .ios-blur {
    backdrop-filter: saturate(180%) blur(20px);
    -webkit-backdrop-filter: saturate(180%) blur(20px);
    background: rgba(255,255,255,.7);
  }
  .dark .ios-blur { background: rgba(22,22,22,.6); }

  /* 터치/모멘텀 스크롤 */
  .ios-content {
    -webkit-overflow-scrolling: touch;
    overscroll-behavior-y: contain;
    touch-action: manipulation;
  }

  /* iOS 탭/선택 강조에 brand 극미량 사용 */
  .text-brand { color: hsl(var(--brand)); }
  .bg-brand { background-color: hsl(var(--brand)); }
  .ring-brand { --tw-ring-color: hsl(var(--brand)); }
  .brand-foreground { color: hsl(var(--brand-foreground)); }
}

/* 터치 하이라이트 제거 (모바일) */
* { -webkit-tap-highlight-color: transparent; }
```

* **브랜드 대비 참고**: `#148777` 배경 위 흰색 텍스트 대비비율 ≈ **4.41:1**(큰/볼드 텍스트에는 적합, 일반 본문은 살짝 부족). 본문 칩/배지에 쓰면 `--brand`를 약간 더 어둡게(예: L=28%) 조정하거나 라지 텍스트에만 쓰도록 운용하세요.

---

## 2) `tailwind.config.ts` 패치 (brand 색 등록)

> 기존 테마 구조는 유지하고 **색상만 확장**합니다. `fontFamily`, `content` 등은 그대로 둡니다.

```ts
// tailwind.config.ts - extend.colors에 brand 추가
extend: {
  // ...기존 설정 유지...
  colors: {
    // 기존 color 맵 유지
    border: "hsl(var(--border))",
    input: "hsl(var(--input))",
    ring: "hsl(var(--ring))",
    background: "hsl(var(--background))",
    foreground: "hsl(var(--foreground))",
    primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
    secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
    destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
    success: { DEFAULT: "hsl(var(--success))", foreground: "hsl(var(--primary-foreground))" },
    warning: { DEFAULT: "hsl(var(--warning))", foreground: "hsl(var(--secondary-foreground))" },
    muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
    accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
    popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
    card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },

    /* ✅ 신규: 극미량 포인트용 brand */
    brand: {
      DEFAULT: "hsl(var(--brand))",
      foreground: "hsl(var(--brand-foreground))",
    },
  },
  // ...기존 extend 나머지...
}
```

> **왜 `--primary`를 안바꿨나?**
> 프로젝트의 `globals.css`는 토큰 기반(Shadcn 스타일)이고, `--primary`를 바꾸면 버튼·링크 등 전체 톤이 브랜드색으로 물들 위험이 있습니다. 따라서 \*\*별도 `--brand`\*\*만 만들고, **선택 상태/포커스/강조에만** 쓰면 “극미량 포인트” 원칙을 지킬 수 있습니다.

---

## 3) iOS 컴포넌트 4종 (Radix 기반, Zero-deps)

> 경로는 `@/components/ios/*` (경로 alias 가능).
> 아이콘은 우선 `lucide-react` 사용(이미 설치됨).

### 3-1) `components/ios/IOSNav.tsx`

```tsx
'use client';
import React from 'react';

type Props = {
  title?: string;
  right?: React.ReactNode; // 우측 액션(예: 저장)
  left?: React.ReactNode;  // 좌측(예: 뒤로가기)
};
export default function IOSNav({ title, right, left }: Props) {
  return (
    <header className="sticky top-0 z-50 ios-blur safe-top border-b border-border">
      <div className="mx-auto max-w-screen-md px-4 h-11 flex items-center justify-between">
        <div className="min-w-[44px] flex items-center">{left}</div>
        <div className="text-sm font-medium">{title}</div>
        <div className="min-w-[44px] flex items-center justify-end">{right}</div>
      </div>
    </header>
  );
}
```

### 3-2) `components/ios/IOSTabBar.tsx`

```tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { Home, User2 } from 'lucide-react';

type Item = { href: string; label: string; icon: React.ReactNode; active?: boolean };
type Props = { items: Item[] };

export default function IOSTabBar({ items }: Props) {
  return (
    <nav className="sticky bottom-0 z-50 ios-blur safe-bottom border-t border-border">
      <div className="mx-auto max-w-screen-md px-6 h-12 grid grid-cols-5">
        {items.map((it, i) => (
          <Link key={i} href={it.href} className="flex flex-col items-center justify-center text-xs">
            <span className={it.active ? 'text-brand' : 'text-muted-foreground'}>{it.icon}</span>
            <span className={it.active ? 'text-brand' : 'text-muted-foreground'}>{it.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

// 사용 예: items={[{href:'/', label:'홈', icon:<Home size={20}/>, active:true},{href:'/me', label:'내 정보', icon:<User2 size={20}/>}]}
```

### 3-3) `components/ios/IOSSegmented.tsx`

```tsx
'use client';
import * as ToggleGroup from '@radix-ui/react-toggle-group';

type Item = { label: string; value: string };
type Props = {
  items: Item[];
  value: string;
  onValueChange: (v: string) => void;
  className?: string;
};

export default function IOSSegmented({ items, value, onValueChange, className }: Props) {
  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      onValueChange={(v) => v && onValueChange(v)}
      className={`inline-flex p-1 rounded-xl bg-muted ${className ?? ''}`}
      aria-label="세그먼트"
    >
      {items.map((it) => (
        <ToggleGroup.Item
          key={it.value}
          value={it.value}
          className="
            px-3 h-8 rounded-lg text-xs font-medium
            data-[state=on]:bg-brand data-[state=on]:text-white
            data-[state=off]:text-foreground
            transition shadow-sm
          "
        >
          {it.label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
```

### 3-4) `components/ios/IOSSwitch.tsx`

```tsx
'use client';
import * as Switch from '@radix-ui/react-switch';

type Props = { checked: boolean; onCheckedChange: (v: boolean) => void };

export default function IOSSwitch({ checked, onCheckedChange }: Props) {
  return (
    <Switch.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      className="
        relative inline-flex h-7 w-12 cursor-pointer rounded-full
        bg-muted data-[state=checked]:bg-brand transition
      "
    >
      <Switch.Thumb
        className="
          pointer-events-none block h-6 w-6 rounded-full bg-white shadow
          translate-x-0 data-[state=checked]:translate-x-5
          transition will-change-transform
        "
      />
    </Switch.Root>
  );
}
```

---

## 4) 데모 페이지 (App Router)

> 경로: `app/(demo)/ios/page.tsx` (또는 원하는 경로). Next 15(App Router)에서 클라이언트 UI이므로 `'use client'` 사용.

```tsx
'use client';
import React from 'react';
import IOSNav from '@/components/ios/IOSNav';
import IOSTabBar from '@/components/ios/IOSTabBar';
import IOSSegmented from '@/components/ios/IOSSegmented';
import IOSSwitch from '@/components/ios/IOSSwitch';
import { Home, User2 } from 'lucide-react';

export default function Page() {
  const [seg, setSeg] = React.useState('a');
  const [on, setOn] = React.useState(true);

  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">
      <IOSNav title="iOS 스타일" right={<button className="text-brand text-sm">완료</button>} />

      <main className="flex-1 ios-content mx-auto max-w-screen-md px-4 py-4 space-y-6">
        <section className="space-y-3">
          <h2 className="text-sm font-semibold">Segmented</h2>
          <IOSSegmented
            items={[{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }, { label: 'C', value: 'c' }]}
            value={seg}
            onValueChange={setSeg}
          />
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold">Switch</h2>
          <div className="flex items-center gap-3">
            <IOSSwitch checked={on} onCheckedChange={setOn} />
            <span className="text-sm">{on ? '켜짐' : '꺼짐'}</span>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold">버튼(포인트 최소)</h2>
          <button className="bg-brand brand-foreground px-4 h-9 rounded-lg text-sm font-medium shadow-sm">
            확인
          </button>
        </section>
      </main>

      <IOSTabBar
        items={[
          { href: '#', label: '홈', icon: <Home size={20} />, active: true },
          { href: '#', label: '내 정보', icon: <User2 size={20} /> },
        ]}
      />
    </div>
  );
}
```

---

## 5) 폰트/규격 메모 (선택)

* 현재 Tailwind 기본 폰트가 `"Spoqa Han Sans Neo"`로 설정되어 있습니다. iOS 느낌을 더 내려면 `-apple-system` 계열 시스템 폰트 스택을 “대체 클래스”로 제공할 수 있습니다(기본은 유지). 원하면 `.font-ios` 유틸리티를 추가해 특정 페이지/섹션에만 적용하세요.
* `tailwind.config.mobile.js`의 `xs: '375px'` 브레이크포인트는 iPhone 기본 폭 기준 컴포넌트 미세 조정에 유용합니다(세그먼티드 너비, 탭 라벨 숨김 등).

```css
/* globals.css에 추가(선택) */
@layer utilities {
  .font-ios {
    font-family: -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }
}
```

---

## 6) 선택: 아이콘을 Ionicons로(더 쿠퍼티노스럽게)

지금은 `lucide-react`를 쓰고 있지만 필요 시 `ionicons` 패키지를 추가해 iOS/Material 듀얼 스킨 아이콘을 쓸 수 있습니다.

```bash
pnpm add ionicons
```

그리고 탭바에서 `<HomeOutline />` 등으로 교체하면 느낌이 더 가까워집니다. (설치 선택사항)

---

## 7) 품질/접근성 가이드

* **대비**: `#148777` + 흰 텍스트 대비 ≈ 4.41:1 → 버튼 라벨(대형/볼드) 중심 사용 권장. 본문 텍스트가 올라가는 경우엔 약간 더 어두운 톤으로(예: L≈28%)만.
* **안전영역**: 헤더/탭바에 `.safe-top`, `.safe-bottom`을 항상 포함하세요(노치/다이내믹 아일랜드 대응).
* **퍼포먼스**: 블러는 상단/하단 바에만 제한해 과도한 리페인트를 피합니다.
* **SSR/라우터**: 본문은 서버 컴포넌트로 두고, 상호작용 컴포넌트에만 `'use client'`를 적용하면 하이드레이션 비용을 줄일 수 있습니다(현 설정 호환).

---

## 8) 지금 프로젝트 상태 점검 포인트

* Next.js `15.2.4`, React `19`, Tailwind `3.4.x` 구조로 App Router에서 그대로 동작합니다.
* 전역 디자인 토큰(`globals.css`)은 HSL 변수 기반이라 brand 토큰 추가가 안전합니다.
* 컴포넌트/페이지 경로 alias `@/*` 사용 가능(이미 설정됨).

---

필요하면 위 변경분을 반영한 **완성 파일 묶음**(패치/zip)도 만들어 드릴 수 있어요.
다음으로, 실제 화면(홈/설정/상세) 3종 템플릿을 iOS HIG에 맞춘 **탭 기반 샘플 라우팅**으로 확장해 드릴게요.
