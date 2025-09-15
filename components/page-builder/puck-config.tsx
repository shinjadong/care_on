import { Config, ComponentConfig } from '@measured/puck';
import { HeadingBlockRenderer } from './blocks/heading-block';
import { TextBlockRenderer } from './blocks/text-block';
import { ImageBlockRenderer } from './blocks/image-block';
import { VideoBlockRenderer } from './blocks/video-block';
import { ButtonBlockRenderer } from './blocks/button-block';
import { SpacerBlockRenderer } from './blocks/spacer-block';
import { HeroBlockRenderer } from './blocks/hero-block';
import { HtmlBlockRenderer } from './blocks/html-block';

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
    padding: 16,
    borderRadius: 12,
    aspectRatio: "auto"
  },
  render: ({ images, displayMode, containerWidth, padding, borderRadius, aspectRatio }) => {
    // 넓이에 따른 자동 패딩 계산
    const autoPadding = containerWidth
      ? Math.max(8, Math.floor((100 - containerWidth) / 4))
      : padding

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
        aspectRatio
      },
      settings: {
        margin: { top: 0, bottom: 0 }
      }
    } as any;

    return <ImageBlockRenderer block={block} isEditing={true} />;
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
      components: ["히어로 섹션", "공백"]
    },
    content: {
      title: "📝 콘텐츠", 
      components: ["제목", "텍스트", "이미지"]
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