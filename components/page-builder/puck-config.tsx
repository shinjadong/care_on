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
  fontSize?: string;
  color?: string;
  letterSpacing?: string;
  lineHeight?: string;
  fontWeight?: string;
  textAlign?: string;
  fontFamily?: string;
}> = {
  fields: {
    text: { type: "text", label: "제목 텍스트" },
    level: { 
      type: "select", 
      label: "제목 레벨",
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
      type: "select",
      label: "폰트 크기",
      options: [
        { label: "기본값", value: "default" },
        { label: "16px", value: "16" },
        { label: "20px", value: "20" },
        { label: "24px", value: "24" },
        { label: "32px", value: "32" },
        { label: "48px", value: "48" },
        { label: "64px", value: "64" }
      ]
    },
    color: { type: "text", label: "텍스트 색상" },
    textAlign: {
      type: "radio",
      label: "정렬",
      options: [
        { label: "왼쪽", value: "left" },
        { label: "가운데", value: "center" },
        { label: "오른쪽", value: "right" }
      ]
    }
  },
  defaultProps: {
    text: "새 제목",
    level: 2,
    fontSize: "default",
    color: "#000000",
    textAlign: "left"
  },
  render: ({ text, level, fontSize, color, letterSpacing, lineHeight, fontWeight, textAlign, fontFamily }) => {
    // 기존 HeadingBlockRenderer 로직 재사용
    const block = {
      id: 'puck-heading',
      type: 'heading',
      content: { text, level, fontSize, color, letterSpacing, lineHeight, fontWeight, textAlign, fontFamily }
    } as any;
    
    return <HeadingBlockRenderer block={block} isEditing={false} />;
  }
};

const TextComponent: ComponentConfig<{
  text: string;
  format?: 'plain' | 'markdown';
  fontSize?: string;
  color?: string;
  letterSpacing?: string;
  lineHeight?: string;
  fontWeight?: string;
  textAlign?: string;
}> = {
  fields: {
    text: { type: "textarea", label: "텍스트 내용" },
    format: {
      type: "radio",
      label: "형식",
      options: [
        { label: "일반 텍스트", value: "plain" },
        { label: "마크다운", value: "markdown" }
      ]
    },
    fontSize: { 
      type: "text",
      label: "폰트 크기 (px)"
    },
    color: { type: "text", label: "텍스트 색상" },
    textAlign: {
      type: "radio", 
      label: "정렬",
      options: [
        { label: "왼쪽", value: "left" },
        { label: "가운데", value: "center" },
        { label: "오른쪽", value: "right" }
      ]
    }
  },
  defaultProps: {
    text: "새 텍스트를 입력하세요...",
    format: "plain",
    fontSize: "16",
    color: "#000000",
    textAlign: "left"
  },
  render: ({ text, format, fontSize, color, letterSpacing, lineHeight, fontWeight, textAlign }) => {
    const block = {
      id: 'puck-text',
      type: 'text',
      content: { text, format, fontSize, color, letterSpacing, lineHeight, fontWeight, textAlign }
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
    images: {
      type: "array",
      label: "이미지 목록",
      arrayFields: {
        src: { type: "text", label: "이미지 URL" },
        alt: { type: "text", label: "설명 (ALT)" },
        caption: { type: "text", label: "캡션" },
        link: { type: "text", label: "링크 URL" }
      }
    }
  },
  defaultProps: {
    displayMode: "single",
    images: []
  },
  render: ({ images, displayMode }) => {
    const block = {
      id: 'puck-image',
      type: 'image',
      content: { images, displayMode }
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
}> = {
  fields: {
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
    },
    size: {
      type: "select",
      label: "크기", 
      options: [
        { label: "작게", value: "sm" },
        { label: "보통", value: "default" },
        { label: "크게", value: "lg" }
      ]
    }
  },
  defaultProps: {
    text: "버튼",
    link: "#",
    variant: "default",
    size: "default"
  },
  render: ({ text, link, variant, size }) => {
    const block = {
      id: 'puck-button',
      type: 'button',
      content: { text, link, variant, size }
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

// Puck 설정
export const puckConfig: Config = {
  components: {
    Hero: HeroComponent,
    Heading: HeadingComponent,
    Text: TextComponent,
    Image: ImageComponent,
    Button: ButtonComponent,
    Spacer: SpacerComponent,
  },
  categories: {
    layout: {
      title: "레이아웃",
      components: ["Hero", "Spacer"]
    },
    content: {
      title: "콘텐츠", 
      components: ["Heading", "Text", "Image"]
    },
    interactive: {
      title: "인터랙티브",
      components: ["Button"]
    }
  }
};