import { Config, ComponentConfig } from '@measured/puck';
import { ColorPickerField, SliderField, SafeHtmlField } from './enhanced-puck-fields';

// 향상된 제목 컴포넌트 (컬러 피커 + 슬라이더)
const HeadingComponent: ComponentConfig<{
  name?: string;
  text: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  color: string;
  fontSize: number;
  textAlign: string;
  fontWeight: number;
}> = {
  label: "📝 제목",
  fields: {
    name: { type: "text", label: "🏷️ 블록 이름 (Outline용)" },
    text: { type: "text", label: "제목 텍스트" },
    level: { 
      type: "select", 
      label: "제목 레벨",
      options: [
        { label: "🔥 H1", value: 1 },
        { label: "⭐ H2", value: 2 },
        { label: "✨ H3", value: 3 },
        { label: "💫 H4", value: 4 },
        { label: "🌟 H5", value: 5 },
        { label: "⚡ H6", value: 6 },
      ]
    },
    fontSize: { 
      type: "custom",
      label: "폰트 크기",
      render: (props) => <SliderField {...props} min={12} max={84} step={1} />
    },
    color: { 
      type: "custom",
      label: "텍스트 색상",
      render: ColorPickerField
    },
    fontWeight: {
      type: "custom",
      label: "굵기",
      render: (props) => <SliderField {...props} min={100} max={900} step={100} />
    },
    textAlign: {
      type: "radio",
      label: "정렬",
      options: [
        { label: "⬅️ 왼쪽", value: "left" },
        { label: "🎯 가운데", value: "center" },
        { label: "➡️ 오른쪽", value: "right" }
      ]
    }
  },
  defaultProps: {
    name: "",
    text: "새 제목",
    level: 2,
    fontSize: 32,
    color: "#1f2937",
    fontWeight: 700,
    textAlign: "center"
  },
  getItemSummary: (props) => {
    return props.name || props.text?.slice(0, 20) || '제목';
  },
  render: ({ text, level, color, fontSize, textAlign, fontWeight }) => {
    const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
    return (
      <HeadingTag
        style={{
          fontSize: `${fontSize}px`,
          color,
          textAlign: textAlign as any,
          fontWeight,
          margin: 0,
          padding: "20px 0",
          lineHeight: 1.2
        }}
      >
        {text}
      </HeadingTag>
    );
  }
};

// 향상된 텍스트 컴포넌트 (컬러 피커 + 슬라이더)
const TextComponent: ComponentConfig<{
  name?: string;
  text: string;
  fontSize: number;
  color: string;
  textAlign: string;
  lineHeight: number;
  fontWeight: number;
}> = {
  label: "📄 텍스트",
  fields: {
    name: { type: "text", label: "🏷️ 블록 이름 (Outline용)" },
    text: { type: "textarea", label: "텍스트 내용" },
    fontSize: { 
      type: "custom",
      label: "폰트 크기",
      render: (props) => <SliderField {...props} min={8} max={72} step={1} />
    },
    color: { 
      type: "custom",
      label: "텍스트 색상",
      render: ColorPickerField
    },
    lineHeight: {
      type: "custom",
      label: "행간",
      render: (props) => <SliderField {...props} min={1.0} max={3.0} step={0.1} />
    },
    fontWeight: {
      type: "custom", 
      label: "굵기",
      render: (props) => <SliderField {...props} min={100} max={900} step={100} />
    },
    textAlign: {
      type: "radio", 
      label: "정렬",
      options: [
        { label: "⬅️ 왼쪽", value: "left" },
        { label: "🎯 가운데", value: "center" },
        { label: "➡️ 오른쪽", value: "right" }
      ]
    }
  },
  defaultProps: {
    name: "",
    text: "새 텍스트를 입력하세요...",
    fontSize: 16,
    color: "#374151",
    lineHeight: 1.6,
    fontWeight: 400,
    textAlign: "left"
  },
  getItemSummary: (props) => {
    return props.name || props.text?.slice(0, 25) || '텍스트';
  },
  render: ({ text, fontSize, color, textAlign, lineHeight, fontWeight }) => {
    return (
      <div
        style={{
          fontSize: `${fontSize}px`,
          color,
          textAlign: textAlign as any,
          lineHeight,
          fontWeight,
          margin: 0,
          padding: "20px",
          whiteSpace: 'pre-wrap'
        }}
      >
        {text}
      </div>
    );
  }
};

// 향상된 버튼 컴포넌트 (여백 조절)
const ButtonComponent: ComponentConfig<{
  name?: string;
  text: string;
  link: string;
  variant: 'default' | 'outline';
  size: 'sm' | 'default' | 'lg';
  alignment: 'left' | 'center' | 'right';
  marginTop: number;
  marginBottom: number;
}> = {
  label: "🔘 버튼",
  fields: {
    name: { type: "text", label: "🏷️ 블록 이름 (Outline용)" },
    text: { type: "text", label: "버튼 텍스트" },
    link: { type: "text", label: "링크 URL" },
    variant: {
      type: "select",
      label: "스타일",
      options: [
        { label: "🟦 기본", value: "default" },
        { label: "⚪ 테두리", value: "outline" }
      ]
    },
    size: {
      type: "select",
      label: "크기", 
      options: [
        { label: "🤏 작게", value: "sm" },
        { label: "📦 보통", value: "default" },
        { label: "🎯 크게", value: "lg" }
      ]
    },
    alignment: {
      type: "radio",
      label: "정렬",
      options: [
        { label: "⬅️ 왼쪽", value: "left" },
        { label: "🎯 가운데", value: "center" },
        { label: "➡️ 오른쪽", value: "right" }
      ]
    },
    marginTop: {
      type: "custom",
      label: "위 여백",
      render: (props) => <SliderField {...props} min={0} max={100} step={5} />
    },
    marginBottom: {
      type: "custom",
      label: "아래 여백", 
      render: (props) => <SliderField {...props} min={0} max={100} step={5} />
    }
  },
  defaultProps: {
    name: "",
    text: "클릭하세요",
    link: "#",
    variant: "default",
    size: "default",
    alignment: "center",
    marginTop: 20,
    marginBottom: 20
  },
  getItemSummary: (props) => {
    return props.name || `🔘 ${props.text}`;
  },
  render: ({ text, link, variant, size, alignment, marginTop, marginBottom }) => {
    const sizeMap = {
      sm: { padding: "8px 16px", fontSize: "14px" },
      default: { padding: "12px 24px", fontSize: "16px" },
      lg: { padding: "16px 32px", fontSize: "18px" }
    };

    const variantMap = {
      default: { 
        backgroundColor: "#3b82f6", 
        color: "white", 
        border: "none" 
      },
      outline: { 
        backgroundColor: "transparent", 
        color: "#3b82f6", 
        border: "2px solid #3b82f6" 
      }
    };

    return (
      <div style={{ 
        textAlign: alignment,
        marginTop: `${marginTop}px`,
        marginBottom: `${marginBottom}px`
      }}>
        <a
          href={link}
          style={{
            display: "inline-block",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s",
            ...sizeMap[size],
            ...variantMap[variant]
          }}
        >
          {text}
        </a>
      </div>
    );
  }
};

// HTML 블록 (보안 강화)
const HtmlComponent: ComponentConfig<{
  name?: string;
  html: string;
}> = {
  label: "💻 HTML 코드",
  fields: {
    name: { type: "text", label: "🏷️ 블록 이름 (Outline용)" },
    html: {
      type: "custom",
      label: "HTML 코드",
      render: SafeHtmlField
    }
  },
  defaultProps: {
    name: "",
    html: "<p>HTML 코드를 입력하세요</p>"
  },
  getItemSummary: (props) => {
    const textContent = props.html?.replace(/<[^>]*>/g, '').slice(0, 20);
    return props.name || `💻 ${textContent}` || 'HTML';
  },
  render: ({ html }) => {
    return (
      <div
        style={{ margin: 0, padding: "20px 0" }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
};

// 향상된 이미지 컴포넌트 (배경 모드 추가)
const ImageComponent: ComponentConfig<{
  name?: string;
  src: string;
  alt: string;
  width: number;
  alignment: string;
  isBackground: boolean;
  backgroundHeight: number;
}> = {
  label: "🖼️ 이미지",
  fields: {
    name: { type: "text", label: "🏷️ 블록 이름 (Outline용)" },
    src: { type: "text", label: "이미지 URL" },
    alt: { type: "text", label: "설명 (ALT)" },
    width: {
      type: "custom",
      label: "너비 (px)",
      render: (props) => <SliderField {...props} min={100} max={1200} step={50} />
    },
    alignment: {
      type: "radio",
      label: "정렬",
      options: [
        { label: "⬅️ 왼쪽", value: "left" },
        { label: "🎯 가운데", value: "center" },
        { label: "➡️ 오른쪽", value: "right" }
      ]
    },
    isBackground: {
      type: "radio",
      label: "배경 모드",
      options: [
        { label: "🖼️ 일반 이미지", value: false },
        { label: "🌄 배경으로 사용", value: true }
      ]
    },
    backgroundHeight: {
      type: "custom",
      label: "배경 높이 (px)",
      render: (props) => <SliderField {...props} min={200} max={800} step={50} />
    }
  },
  defaultProps: {
    name: "",
    src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    alt: "샘플 이미지",
    width: 800,
    alignment: "center",
    isBackground: false,
    backgroundHeight: 400
  },
  getItemSummary: (props) => {
    return props.name || (props.isBackground ? `🌄 배경: ${props.alt}` : `🖼️ ${props.alt}`);
  },
  render: ({ src, alt, width, alignment, isBackground, backgroundHeight }) => {
    if (isBackground) {
      return (
        <div
          style={{
            height: `${backgroundHeight}px`,
            backgroundImage: `url(${src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 0,
            padding: 0
          }}
        >
          <div style={{ 
            backgroundColor: 'rgba(0,0,0,0.5)', 
            color: 'white', 
            padding: '10px 20px', 
            borderRadius: '8px',
            fontSize: '14px'
          }}>
            배경 이미지: {alt}
          </div>
        </div>
      );
    }

    return (
      <div style={{ 
        textAlign: alignment,
        padding: "20px 0",
        margin: 0
      }}>
        <img
          src={src}
          alt={alt}
          style={{
            width: `${width}px`,
            maxWidth: "100%",
            height: "auto",
            borderRadius: "8px",
            margin: alignment === 'center' ? '0 auto' : 
                   alignment === 'right' ? '0 0 0 auto' : '0',
            display: "block"
          }}
        />
      </div>
    );
  }
};

const SpacerComponent: ComponentConfig<{
  name?: string;
  height: number;
}> = {
  label: "📏 공백",
  fields: {
    name: { type: "text", label: "🏷️ 블록 이름 (Outline용)" },
    height: { 
      type: "custom",
      label: "높이",
      render: (props) => <SliderField {...props} min={10} max={500} step={10} />
    }
  },
  defaultProps: {
    name: "",
    height: 50
  },
  getItemSummary: (props) => {
    return props.name || `📏 공백 (${props.height}px)`;
  },
  render: ({ height }) => {
    return (
      <div
        style={{
          height: `${height}px`,
          backgroundColor: 'transparent',
          display: 'block'
        }}
      />
    );
  }
};

// 향상된 Puck 설정
export const enhancedPuckConfig: Config = {
  components: {
    "제목": HeadingComponent,
    "텍스트": TextComponent, 
    "버튼": ButtonComponent,
    "이미지": ImageComponent,
    "HTML": HtmlComponent,
    "공백": SpacerComponent,
  },
  categories: {
    content: {
      title: "📝 콘텐츠", 
      components: ["제목", "텍스트", "이미지"]
    },
    interactive: {
      title: "🎯 인터랙티브",
      components: ["버튼", "HTML"]
    },
    layout: {
      title: "📐 레이아웃",
      components: ["공백"]
    }
  }
};