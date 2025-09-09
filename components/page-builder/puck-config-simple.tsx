import { Config, ComponentConfig } from '@measured/puck';

// 간단한 순수 Puck 컴포넌트들 (기존 렌더러 없이)
const HeadingComponent: ComponentConfig<{
  name?: string;
  text: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  color: string;
  fontSize: number;
  textAlign: string;
}> = {
  fields: {
    name: { type: "text", label: "🏷️ 블록 이름 (Outline용)", placeholder: "예: 메인 제목" },
    text: { type: "text", label: "📝 제목 텍스트" },
    level: { 
      type: "select", 
      label: "📊 제목 레벨",
      options: [
        { label: "🔥 H1 - 가장 큰 제목", value: 1 },
        { label: "⭐ H2 - 큰 제목", value: 2 },
        { label: "✨ H3 - 중간 제목", value: 3 },
        { label: "💫 H4 - 작은 제목", value: 4 },
        { label: "🌟 H5 - 더 작은 제목", value: 5 },
        { label: "⚡ H6 - 가장 작은 제목", value: 6 },
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
      label: "🎨 텍스트 색상"
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
    name: "",
    text: "새 제목",
    level: 2,
    fontSize: 32,
    color: "#1f2937",
    textAlign: "center"
  },
  // Outline에서 표시될 이름 커스터마이징
  getItemSummary: (props) => {
    return props.name || `${props.text?.slice(0, 20)}${props.text?.length > 20 ? '...' : ''}` || '제목';
  },
  render: ({ text, level, color, fontSize, textAlign }) => {
    const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
    return (
      <HeadingTag
        style={{
          fontSize: `${fontSize}px`,
          color,
          textAlign: textAlign as any,
          margin: 0,
          padding: "20px 0",
          fontWeight: level <= 2 ? 700 : 600,
          lineHeight: 1.2
        }}
      >
        {text}
      </HeadingTag>
    );
  }
};

const TextComponent: ComponentConfig<{
  name?: string;
  text: string;
  fontSize: number;
  color: string;
  textAlign: string;
  lineHeight: number;
}> = {
  fields: {
    name: { type: "text", label: "🏷️ 블록 이름 (Outline용)", placeholder: "예: 소개 텍스트" },
    text: { type: "textarea", label: "📝 텍스트 내용" },
    fontSize: { 
      type: "number",
      label: "📏 폰트 크기 (px)",
      min: 8,
      max: 72
    },
    color: { 
      type: "text", 
      label: "🎨 텍스트 색상"
    },
    lineHeight: {
      type: "number",
      label: "📏 행간",
      min: 1.0,
      max: 3.0,
      step: 0.1
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
    name: "",
    text: "새 텍스트를 입력하세요...",
    fontSize: 16,
    color: "#374151",
    lineHeight: 1.6,
    textAlign: "left"
  },
  // Outline에서 표시될 이름 커스터마이징
  getItemSummary: (props) => {
    return props.name || `${props.text?.slice(0, 25)}${props.text?.length > 25 ? '...' : ''}` || '텍스트';
  },
  render: ({ text, fontSize, color, textAlign, lineHeight }) => {
    return (
      <div
        style={{
          fontSize: `${fontSize}px`,
          color,
          textAlign: textAlign as any,
          lineHeight,
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

const ButtonComponent: ComponentConfig<{
  name?: string;
  text: string;
  link: string;
  variant: 'default' | 'outline';
  size: 'sm' | 'default' | 'lg';
}> = {
  fields: {
    name: { type: "text", label: "🏷️ 블록 이름 (Outline용)", placeholder: "예: CTA 버튼" },
    text: { type: "text", label: "🔘 버튼 텍스트" },
    link: { type: "text", label: "🔗 링크 URL" },
    variant: {
      type: "select",
      label: "🎨 스타일",
      options: [
        { label: "🟦 기본", value: "default" },
        { label: "⚪ 테두리", value: "outline" }
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
    }
  },
  defaultProps: {
    name: "",
    text: "클릭하세요",
    link: "#",
    variant: "default",
    size: "default"
  },
  // Outline에서 표시될 이름 커스터마이징
  getItemSummary: (props) => {
    return props.name || `🔘 ${props.text}` || '버튼';
  },
  render: ({ text, link, variant, size }) => {
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
      <div style={{ textAlign: "center", padding: "20px 0" }}>
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

const SpacerComponent: ComponentConfig<{
  name?: string;
  height: number;
}> = {
  fields: {
    name: { type: "text", label: "🏷️ 블록 이름 (Outline용)", placeholder: "예: 섹션 구분" },
    height: { 
      type: "number", 
      label: "📏 높이 (px)",
      min: 10,
      max: 500 
    }
  },
  defaultProps: {
    name: "",
    height: 50
  },
  // Outline에서 표시될 이름 커스터마이징
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

const ImageComponent: ComponentConfig<{
  name?: string;
  src: string;
  alt: string;
  width: number;
}> = {
  fields: {
    name: { type: "text", label: "🏷️ 블록 이름 (Outline용)", placeholder: "예: 메인 이미지" },
    src: { type: "text", label: "🖼️ 이미지 URL" },
    alt: { type: "text", label: "📝 설명 (ALT)" },
    width: {
      type: "number",
      label: "📏 너비 (px)",
      min: 100,
      max: 1200
    }
  },
  defaultProps: {
    name: "",
    src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    alt: "샘플 이미지",
    width: 800
  },
  // Outline에서 표시될 이름 커스터마이징
  getItemSummary: (props) => {
    return props.name || `🖼️ ${props.alt}` || '이미지';
  },
  render: ({ src, alt, width }) => {
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <img
          src={src}
          alt={alt}
          style={{
            width: `${width}px`,
            maxWidth: "100%",
            height: "auto",
            borderRadius: "8px",
            margin: "0 auto",
            display: "block"
          }}
        />
      </div>
    );
  }
};

// 간단한 Puck 설정
export const puckConfig: Config = {
  components: {
    "제목": HeadingComponent,
    "텍스트": TextComponent,
    "버튼": ButtonComponent,
    "공백": SpacerComponent,
    "이미지": ImageComponent,
  },
  categories: {
    content: {
      title: "📝 콘텐츠", 
      components: ["제목", "텍스트", "이미지"]
    },
    interactive: {
      title: "🎯 인터랙티브",
      components: ["버튼"]
    },
    layout: {
      title: "📐 레이아웃",
      components: ["공백"]
    }
  }
};