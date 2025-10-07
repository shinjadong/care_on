import { Config, ComponentConfig } from '@measured/puck';
import { HeadingBlockRenderer } from './blocks/heading-block';
import { TextBlockRenderer } from './blocks/text-block';
import { ImageBlockRenderer } from './blocks/image-block';
import { VideoBlockRenderer } from './blocks/video-block';
import { ButtonBlockRenderer } from './blocks/button-block';
import { SpacerBlockRenderer } from './blocks/spacer-block';
import { HeroBlockRenderer } from './blocks/hero-block';
import { HtmlBlockRenderer } from './blocks/html-block';
import { ColumnsBlockRenderer } from './blocks/columns-block';
import { GalleryBlockRenderer } from './blocks/gallery-block';
import { CardBlockRenderer } from './blocks/card-block';
import { FormBlockRenderer } from './blocks/form-block';

// Puck 컴포넌트 어댑터: 기존 블록을 Puck 컴포넌트로 변환
const HeadingComponent: ComponentConfig<{
  text: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  fontSize?: number;
  color?: string;
  letterSpacing?: number;
  lineHeight?: number;
  fontWeight?: number;
  textAlign?: string;
}> = {
  fields: {
    text: { type: "text", label: "📝 제목 텍스트" },
    level: { 
      type: "select", 
      label: "📊 제목 레벨",
      options: [
        { label: "H1 - 가장 큰 제목", value: 1 },
        { label: "H2 - 큰 제목", value: 2 },
        { label: "H3 - 중간 제목", value: 3 },
        { label: "H4 - 작은 제목", value: 4 },
        { label: "H5 - 더 작은 제목", value: 5 },
        { label: "H6 - 가장 작은 제목", value: 6 },
      ]
    },
    fontSize: { 
      type: "number",
      label: "📏 폰트 크기 (px)",
      min: 12,
      max: 84
    },
    color: { 
      type: "text", 
      label: "🎨 텍스트 색상",
      placeholder: "#000000"
    },
    letterSpacing: {
      type: "number",
      label: "📐 자간 (px)",
      min: -3,
      max: 8,
      step: 0.1
    },
    lineHeight: {
      type: "number", 
      label: "📏 행간",
      min: 1.0,
      max: 2.5,
      step: 0.1
    },
    fontWeight: {
      type: "select",
      label: "💪 굵기",
      options: [
        { label: "얇게 (100)", value: 100 },
        { label: "연하게 (300)", value: 300 },
        { label: "보통 (400)", value: 400 },
        { label: "준굵게 (600)", value: 600 },
        { label: "굵게 (700)", value: 700 },
        { label: "매우굵게 (900)", value: 900 }
      ]
    },
    textAlign: {
      type: "radio",
      label: "📍 정렬",
      options: [
        { label: "⬅️ 왼쪽", value: "left" },
        { label: "🎯 가운데", value: "center" },
        { label: "➡️ 오른쪽", value: "right" }
      ]
    }
  },
  defaultProps: {
    text: "새 제목",
    level: 2,
    fontSize: 32,
    color: "#000000",
    letterSpacing: 0,
    lineHeight: 1.2,
    fontWeight: 700,
    textAlign: "left"
  },
  render: ({ text, level, fontSize, color, letterSpacing, lineHeight, fontWeight, textAlign }) => {
    const block = {
      id: 'puck-heading',
      type: 'heading',
      content: { 
        text, 
        level, 
        fontSize: fontSize?.toString(), 
        color, 
        letterSpacing: letterSpacing?.toString(), 
        lineHeight: lineHeight?.toString(), 
        fontWeight: fontWeight?.toString(), 
        textAlign 
      }
    } as any;
    
    return <HeadingBlockRenderer block={block} isEditing={false} />;
  }
};

const TextComponent: ComponentConfig<{
  text: string;
  format?: 'plain' | 'markdown';
  fontSize?: number;
  color?: string;
  letterSpacing?: number;
  lineHeight?: number;
  fontWeight?: number;
  textAlign?: string;
}> = {
  fields: {
    text: { type: "textarea", label: "📝 텍스트 내용" },
    format: {
      type: "radio",
      label: "📄 형식",
      options: [
        { label: "일반 텍스트", value: "plain" },
        { label: "마크다운", value: "markdown" }
      ]
    },
    fontSize: { 
      type: "number",
      label: "📏 폰트 크기 (px)",
      min: 8,
      max: 72
    },
    color: { 
      type: "text", 
      label: "🎨 텍스트 색상",
      placeholder: "#000000"
    },
    letterSpacing: {
      type: "number",
      label: "📐 자간 (px)", 
      min: -5,
      max: 10,
      step: 0.1
    },
    lineHeight: {
      type: "number",
      label: "📏 행간",
      min: 1.0,
      max: 3.0,
      step: 0.1
    },
    fontWeight: {
      type: "select",
      label: "💪 굵기",
      options: [
        { label: "얇게 (100)", value: 100 },
        { label: "연하게 (300)", value: 300 },
        { label: "보통 (400)", value: 400 },
        { label: "중간 (500)", value: 500 },
        { label: "준굵게 (600)", value: 600 },
        { label: "굵게 (700)", value: 700 },
        { label: "매우굵게 (900)", value: 900 }
      ]
    },
    textAlign: {
      type: "radio", 
      label: "📍 정렬",
      options: [
        { label: "⬅️ 왼쪽", value: "left" },
        { label: "🎯 가운데", value: "center" },
        { label: "➡️ 오른쪽", value: "right" }
      ]
    }
  },
  defaultProps: {
    text: "새 텍스트를 입력하세요...",
    format: "plain",
    fontSize: 16,
    color: "#000000",
    letterSpacing: 0,
    lineHeight: 1.5,
    fontWeight: 400,
    textAlign: "left"
  },
  render: ({ text, format, fontSize, color, letterSpacing, lineHeight, fontWeight, textAlign }) => {
    const block = {
      id: 'puck-text',
      type: 'text',
      content: { 
        text, 
        format, 
        fontSize: fontSize?.toString(), 
        color, 
        letterSpacing: letterSpacing?.toString(), 
        lineHeight: lineHeight?.toString(), 
        fontWeight: fontWeight?.toString(), 
        textAlign 
      }
    } as any;
    
    return <TextBlockRenderer block={block} isEditing={false} />;
  }
};

const ImageComponent: ComponentConfig<{
  images: Array<{
    id: string;
    src: string;
    alt?: string;
    caption?: string;
    width?: number;
    height?: number;
    link?: string;
    linkTarget?: '_blank' | '_self';
  }>;
  displayMode?: 'single' | 'story';
  containerWidth?: number;
  padding?: number;
  borderRadius?: number;
  aspectRatio?: string;
  imageAlign?: 'left' | 'center' | 'right';
  opacity?: number;
  rotation?: number;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  zIndex?: number;
  hoverEffect?: 'none' | 'scale' | 'rotate' | 'brightness' | 'blur';
}> = {
  fields: {
    displayMode: {
      type: "radio",
      label: "표시 방식",
      options: [
        { label: "단일 이미지", value: "single" },
        { label: "스토리 (다중)", value: "story" }
      ]
    },
    containerWidth: {
      type: "number",
      label: "컨테이너 넓이 (%)",
      min: 10,
      max: 100,
      step: 5
    },
    padding: {
      type: "number",
      label: "패딩 (px)",
      min: 0,
      max: 100,
      step: 4
    },
    borderRadius: {
      type: "number",
      label: "모서리 둥글기 (px)",
      min: 0,
      max: 50,
      step: 2
    },
    aspectRatio: {
      type: "select",
      label: "이미지 비율",
      options: [
        { label: "자동", value: "auto" },
        { label: "정사각형 (1:1)", value: "1/1" },
        { label: "가로형 (16:9)", value: "16/9" },
        { label: "세로형 (4:5)", value: "4/5" },
        { label: "인스타그램 (1:1)", value: "1/1" }
      ]
    },
    imageAlign: {
      type: "radio",
      label: "이미지 정렬",
      options: [
        { label: "⬅️ 왼쪽", value: "left" },
        { label: "🎯 가운데", value: "center" },
        { label: "➡️ 오른쪽", value: "right" }
      ]
    },
    opacity: {
      type: "number",
      label: "투명도 (%)",
      min: 0,
      max: 100,
      step: 5
    },
    rotation: {
      type: "number",
      label: "회전 (도)",
      min: -180,
      max: 180,
      step: 1
    },
    shadow: {
      type: "select",
      label: "그림자",
      options: [
        { label: "없음", value: "none" },
        { label: "작게", value: "sm" },
        { label: "보통", value: "md" },
        { label: "크게", value: "lg" },
        { label: "매우 크게", value: "xl" }
      ]
    },
    zIndex: {
      type: "number",
      label: "레이어 순서",
      min: 0,
      max: 100,
      step: 1
    },
    hoverEffect: {
      type: "select",
      label: "호버 효과",
      options: [
        { label: "없음", value: "none" },
        { label: "확대", value: "scale" },
        { label: "회전", value: "rotate" },
        { label: "밝아짐", value: "brightness" },
        { label: "흐려짐", value: "blur" }
      ]
    },
    images: {
      type: "array",
      label: "이미지 목록",
      arrayFields: {
        id: { type: "text", label: "ID" },
        src: { type: "text", label: "이미지 URL" },
        alt: { type: "text", label: "설명 (ALT)" },
        caption: { type: "text", label: "캡션" },
        link: { type: "text", label: "링크 URL" }
      }
    }
  },
  defaultProps: {
    displayMode: "single",
    images: [],
    containerWidth: 100,
    padding: 0, // 기본 패딩 없음 - 페이지 꽉 차게
    borderRadius: 0, // 기본 라운드 없음
    aspectRatio: "auto",
    imageAlign: "center",
    opacity: 100,
    rotation: 0,
    shadow: "none", // 기본 그림자 없음
    zIndex: 1,
    hoverEffect: "none" // 기본 호버 효과 없음
  },
  render: ({ images, displayMode, containerWidth, padding, borderRadius, aspectRatio, imageAlign, opacity, rotation, shadow, zIndex, hoverEffect }) => {
    // 넓이에 따른 자동 패딩 계산 (100%일 때는 패딩 0)
    const autoPadding = containerWidth === 100
      ? 0
      : Math.max(8, Math.floor((100 - containerWidth) / 4))

    const effectivePadding = padding !== undefined ? padding : autoPadding

    const block = {
      id: 'puck-image',
      type: 'image',
      content: {
        images,
        displayMode,
        containerWidth,
        padding: effectivePadding,
        borderRadius,
        aspectRatio,
        imageAlign,
        opacity,
        rotation,
        shadow,
        zIndex,
        hoverEffect
      },
      settings: {
        margin: { top: 0, bottom: 0 }
      }
    } as any;

    return <ImageBlockRenderer block={block} isEditing={false} />;
  }
};

const HeroComponent: ComponentConfig<{
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  buttons?: Array<{
    text: string;
    link: string;
    variant?: string;
    size?: string;
  }>;
}> = {
  fields: {
    title: { type: "text", label: "제목" },
    subtitle: { type: "text", label: "부제목" },
    backgroundImage: { type: "text", label: "배경 이미지 URL" },
    backgroundVideo: { type: "text", label: "배경 동영상 URL" },
    overlay: { type: "radio", label: "오버레이", options: [
      { label: "사용", value: true },
      { label: "사용 안함", value: false }
    ]},
    overlayOpacity: { type: "number", label: "오버레이 투명도", min: 0, max: 1, step: 0.1 },
    buttons: {
      type: "array",
      label: "버튼 목록",
      arrayFields: {
        text: { type: "text", label: "버튼 텍스트" },
        link: { type: "text", label: "링크 URL" },
        variant: { 
          type: "select", 
          label: "스타일",
          options: [
            { label: "기본", value: "default" },
            { label: "테두리", value: "outline" },
            { label: "투명", value: "ghost" }
          ]
        }
      }
    }
  },
  defaultProps: {
    title: "새 히어로 섹션",
    subtitle: "부제목을 입력하세요",
    overlay: false,
    overlayOpacity: 0.5,
    buttons: []
  },
  render: ({ title, subtitle, backgroundImage, backgroundVideo, overlay, overlayOpacity, buttons }) => {
    const block = {
      id: 'puck-hero',
      type: 'hero',
      content: { title, subtitle, backgroundImage, backgroundVideo, overlay, overlayOpacity, buttons }
    } as any;
    
    return <HeroBlockRenderer block={block} isEditing={false} />;
  }
};

const ButtonComponent: ComponentConfig<{
  text: string;
  link: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  alignment?: 'left' | 'center' | 'right';
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
}> = {
  fields: {
    text: { type: "text", label: "🔘 버튼 텍스트" },
    link: { type: "text", label: "🔗 링크 URL" },
    variant: {
      type: "select",
      label: "🎨 스타일",
      options: [
        { label: "🟦 기본", value: "default" },
        { label: "⚪ 테두리", value: "outline" },
        { label: "👻 투명", value: "ghost" }
      ]
    },
    size: {
      type: "select",
      label: "📏 크기", 
      options: [
        { label: "🤏 작게", value: "sm" },
        { label: "📦 보통", value: "default" },
        { label: "🎯 크게", value: "lg" }
      ]
    },
    alignment: {
      type: "radio",
      label: "📍 정렬",
      options: [
        { label: "⬅️ 왼쪽", value: "left" },
        { label: "🎯 가운데", value: "center" },
        { label: "➡️ 오른쪽", value: "right" }
      ]
    },
    marginTop: {
      type: "number",
      label: "⬆️ 위 여백 (px)",
      min: 0,
      max: 100
    },
    marginBottom: {
      type: "number",
      label: "⬇️ 아래 여백 (px)",
      min: 0,
      max: 100
    },
    marginLeft: {
      type: "number",
      label: "⬅️ 왼쪽 여백 (px)",
      min: 0,
      max: 100
    },
    marginRight: {
      type: "number",
      label: "➡️ 오른쪽 여백 (px)",
      min: 0,
      max: 100
    }
  },
  defaultProps: {
    text: "버튼",
    link: "#",
    variant: "default",
    size: "default",
    alignment: "center",
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0
  },
  render: ({ text, link, variant, size, alignment, marginTop, marginBottom, marginLeft, marginRight }) => {
    const block = {
      id: 'puck-button',
      type: 'button',
      content: { text, link, variant, size, alignment },
      settings: {
        padding: {
          top: marginTop || 0,
          bottom: marginBottom || 0,
          left: marginLeft || 0,
          right: marginRight || 0
        }
      }
    } as any;
    
    return <ButtonBlockRenderer block={block} isEditing={false} />;
  }
};

const SpacerComponent: ComponentConfig<{
  height: number;
}> = {
  fields: {
    height: { 
      type: "number", 
      label: "높이 (px)",
      min: 10,
      max: 500 
    }
  },
  defaultProps: {
    height: 50
  },
  render: ({ height }) => {
    const block = {
      id: 'puck-spacer',
      type: 'spacer',
      content: { height }
    } as any;
    
    return <SpacerBlockRenderer block={block} isEditing={false} />;
  }
};

// HTML 컴포넌트 추가
// 컬럼 레이아웃 컴포넌트
const ColumnsComponent: ComponentConfig<{
  columnCount: number;
  gap: number;
  alignment: string;
}> = {
  fields: {
    columnCount: {
      type: "select",
      label: "⚏ 컬럼 수",
      options: [
        { label: "2컬럼", value: 2 },
        { label: "3컬럼", value: 3 },
        { label: "4컬럼", value: 4 }
      ]
    },
    gap: {
      type: "number",
      label: "📐 간격 (px)",
      min: 0,
      max: 48
    },
    alignment: {
      type: "select",
      label: "🎯 정렬",
      options: [
        { label: "늘어뜨리기", value: "stretch" },
        { label: "상단 정렬", value: "start" },
        { label: "중앙 정렬", value: "center" },
        { label: "하단 정렬", value: "end" }
      ]
    }
  },
  defaultProps: {
    columnCount: 2,
    gap: 16,
    alignment: "stretch"
  },
  render: ({ columnCount, gap, alignment }) => {
    const block = {
      id: 'puck-columns',
      type: 'columns',
      content: {
        columnCount,
        gap,
        alignment,
        columns: Array.from({ length: columnCount }, (_, i) => ({
          id: `col-${i + 1}`,
          content: `${i + 1}번째 컬럼 내용을 여기에 입력하세요`
        }))
      }
    } as any;

    return <ColumnsBlockRenderer block={block} isEditing={false} />;
  }
};

// 이미지 갤러리 컴포넌트
const GalleryComponent: ComponentConfig<{
  layout: string;
  columns: number;
  spacing: number;
}> = {
  fields: {
    layout: {
      type: "select",
      label: "🖼️ 레이아웃",
      options: [
        { label: "그리드", value: "grid" },
        { label: "벽돌식", value: "masonry" },
        { label: "슬라이더", value: "slider" }
      ]
    },
    columns: {
      type: "number",
      label: "📊 컬럼 수",
      min: 1,
      max: 6
    },
    spacing: {
      type: "number",
      label: "📐 간격 (px)",
      min: 0,
      max: 32
    }
  },
  defaultProps: {
    layout: "grid",
    columns: 3,
    spacing: 8
  },
  render: ({ layout, columns, spacing }) => {
    const block = {
      id: 'puck-gallery',
      type: 'gallery',
      content: {
        layout,
        columns,
        spacing,
        images: [
          {
            id: 'sample-1',
            src: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400&h=300&fit=crop',
            alt: '샘플 이미지 1'
          },
          {
            id: 'sample-2',
            src: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
            alt: '샘플 이미지 2'
          }
        ]
      }
    } as any;

    return <GalleryBlockRenderer block={block} isEditing={false} />;
  }
};

const HtmlComponent: ComponentConfig<{
  html: string;
}> = {
  fields: {
    html: { 
      type: "textarea", 
      label: "HTML 코드",
      placeholder: "<div>HTML 코드를 입력하세요</div>"
    }
  },
  defaultProps: {
    html: "<p>HTML 코드를 입력하세요</p>"
  },
  render: ({ html }) => {
    const block = {
      id: 'puck-html',
      type: 'html',
      content: { html }
    } as any;
    
    return <HtmlBlockRenderer block={block} isEditing={false} />;
  }
};

// Puck 설정 - 한국어 커스터마이징
export const puckConfig: Config = {
  components: {
    "히어로 섹션": HeroComponent,
    "컬럼 레이아웃": ColumnsComponent,
    "이미지 갤러리": GalleryComponent,
    "제목": HeadingComponent,
    "텍스트": TextComponent,
    "이미지": ImageComponent,
    "버튼": ButtonComponent,
    "공백": SpacerComponent,
    "HTML 코드": HtmlComponent,
  },
  categories: {
    layout: {
      title: "📐 레이아웃",
      components: ["히어로 섹션", "컬럼 레이아웃", "공백"]
    },
    content: {
      title: "📝 콘텐츠",
      components: ["제목", "텍스트", "이미지", "이미지 갤러리"]
    },
    interactive: {
      title: "🎯 인터랙티브",
      components: ["버튼", "HTML 코드"]
    }
  },
  root: {
    fields: {
      title: { type: "text", label: "페이지 제목" }
    },
    defaultProps: {
      title: "케어온 랜딩 페이지"
    }
  }
};
