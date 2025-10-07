"use client"

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Smartphone, Tablet, Laptop, FileCode, Upload, X, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { TypeAnimation } from 'react-type-animation';
import './BlogPreview.css';

// 동적 import로 변경 (CommonJS/ESM 오류 해결)
const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false });

// 기존 타이핑 애니메이션 컴포넌트 (참고용으로 유지)
interface TypingAnimationProps {
  content: string;
  htmlContent?: boolean;
  onComplete?: () => void;
  speed?: number;
}

const TypingAnimationLegacy: React.FC<TypingAnimationProps> = ({ 
  content, 
  htmlContent = false, 
  onComplete, 
  speed = 20 
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [index, setIndex] = useState(0);
  
  useEffect(() => {
    if (index < content.length) {
      const timer = setTimeout(() => {
        setDisplayedContent(content.substring(0, index + 1));
        setIndex(index + 1);
      }, speed);
      
      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [content, index, onComplete, speed]);
  
  return (
    <div>
      {htmlContent ? (
        <div dangerouslySetInnerHTML={{ __html: displayedContent }} />
      ) : (
        <div>{displayedContent}</div>
      )}
    </div>
  );
};

interface BlogPreviewProps {
  content: string;
  title?: string;
  format?: 'markdown' | 'html';
  animate?: boolean;
  imageUrls?: string[]; // 이미지 URL 배열 추가
  imageLayout?: 'auto' | 'balanced' | 'top-heavy' | 'bottom-heavy'; // 이미지 배치 스타일
  imageSize?: 'small' | 'medium' | 'large'; // 이미지 크기
  onImagesChange?: (images: string[]) => void; // 이미지 변경 콜백
  onImageLayoutChange?: (layout: string) => void; // 레이아웃 변경 콜백
  onImageSizeChange?: (size: string) => void; // 크기 변경 콜백
}

// 이미지 URL 추출 함수 개선
const extractImageUrls = (html: string): string[] => {
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  const urls: string[] = [];
  let match;
  
  while ((match = imgRegex.exec(html)) !== null) {
    if (match[1] && !urls.includes(match[1])) {
      urls.push(match[1]);
    }
  }
  
  return urls;
};

// HTML 콘텐츠 정리 함수 - 코드 블록 및 불필요한 태그 처리
const cleanHtmlContent = (html: string): string => {
  // 코드 블록 처리 (```html 등의 마크다운 코드 블록 제거)
  let cleaned = html.replace(/```(\w+)?\n([\s\S]*?)\n```/g, (match, language, code) => {
    return `<pre class="code-block ${language || ''}"><code>${code}</code></pre>`;
  });
  
  // 백틱으로 둘러싸인 인라인 코드 처리
  cleaned = cleaned.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  return cleaned;
};

// HTML 콘텐츠에 지연 로딩 및 Next.js Image 최적화 적용
const optimizeHtmlImages = (html: string): string => {
  // 이미지 태그를 찾아서 loading="lazy" 속성 추가
  return html.replace(/<img/g, '<img loading="lazy"');
};

// 마크다운을 네이버 블로그 호환 텍스트로 변환
const convertMarkdownToNaverHTML = (markdown: string): string => {
  // 기본적인 마크다운 변환 (제목, 강조, 링크 등)
  let naverHTML = markdown
    // 제목 변환
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    // 강조 변환
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/\*(.*?)\*/g, '<i>$1</i>')
    // 링크 변환
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
    // 이미지 변환
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />')
    // 목록 변환 (간단한 처리)
    .replace(/^\- (.*$)/gm, '<li>$1</li>')
    .replace(/^[0-9]+\. (.*$)/gm, '<li>$1</li>');
  
  // 단락 처리
  naverHTML = naverHTML.split('\n\n')
    .map(para => {
      if (!para.trim()) return '';
      if (para.startsWith('<h') || para.startsWith('<li>') || para.startsWith('<img')) {
        return para;
      }
      return `<p>${para}</p>`;
    })
    .join('\n\n');
  
  return naverHTML;
};

// 네이버 블로그용 HTML 변환 함수
const convertHtmlToNaverHTML = (html: string): string => {
  if (!html) return '';
  
  let converted = html;
  
  // 이미지 태그 처리
  converted = converted.replace(/<img(.*?)src="(.*?)"(.*?)>/g, (match, p1, src, p3) => {
    // 이미지 URL이 상대 경로인 경우 절대 경로로 변환
    const absoluteSrc = src.startsWith('http') ? src : new URL(src, window.location.origin).href;
    return `<img${p1}src="${absoluteSrc}"${p3} style="max-width:100%; height:auto; margin:10px 0;">`;
  });
  
  // 네이버 블로그에 맞게 스타일 조정
  converted = converted.replace(/<p>(.*?)<\/p>/g, '<p style="margin-bottom:1em;">$1</p>');
  converted = converted.replace(/<h([1-6])>(.*?)<\/h\1>/g, '<h$1 style="margin-top:1.5em; margin-bottom:0.5em; font-weight:bold;">$2</h$1>');
  
  return converted;
};

// 텍스트 양에 따른 이미지 배치 함수
const distributeImages = (content: string, images: string[], layout: string = 'auto', imageSize: string = 'medium'): string => {
  if (!content || !images || images.length === 0) {
    return content;
  }
  
  console.log('distributeImages 함수 호출됨: 이미지 개수', images.length);
  console.log('이미지 URL 목록:', images);
  
  // 이미지 중복 제거 (Set 사용)
  const uniqueImagesSet = new Set(images);
  const uniqueImages = Array.from(uniqueImagesSet);
  
  console.log('중복 제거 후 이미지 개수:', uniqueImages.length);
  
  // 이미지가 없으면 원본 콘텐츠 반환
  if (uniqueImages.length === 0) {
    return content;
  }
  
  // 이미지 크기 클래스 설정
  const sizeClass = {
    'small': 'blog-image-small',
    'medium': 'blog-image-medium',
    'large': 'blog-image-large'
  }[imageSize] || 'blog-image-medium';
  
  // 콘텐츠에 이미 포함된 이미지 URL 추출
  const existingImgRegex = /<img[^>]+src="([^">]+)"/g;
  const existingImgUrls = new Set<string>();
  let match;
  while ((match = existingImgRegex.exec(content)) !== null) {
    if (match[1]) {
      existingImgUrls.add(match[1]);
    }
  }
  
  // 마크다운 이미지 URL 추출
  const mdImgRegex = /!\[.*?\]\((.*?)\)/g;
  while ((match = mdImgRegex.exec(content)) !== null) {
    if (match[1]) {
      existingImgUrls.add(match[1]);
    }
  }
  
  console.log('콘텐츠에 이미 포함된 이미지 URL:', Array.from(existingImgUrls));
  
  // 아직 사용되지 않은 이미지만 필터링
  const unusedImages = uniqueImages.filter(url => !existingImgUrls.has(url));
  console.log('아직 사용되지 않은 이미지 개수:', unusedImages.length);
  
  // 남은 이미지 배열 (아직 삽입되지 않은 이미지들)
  let remainingImages = [...unusedImages];
  
  // 단락 분리
  const paragraphs = content.split(/<p>|<\/p>/).filter(p => p.trim().length > 0);
  
  // 레이아웃에 따른 이미지 삽입 위치 결정
  let insertPositions: number[] = [];
  
  if (layout === 'top-heavy') {
    // 상단에 이미지 집중
    const firstThird = Math.max(1, Math.floor(paragraphs.length / 3));
    for (let i = 0; i < unusedImages.length; i++) {
      const pos = Math.min(i, firstThird - 1);
      insertPositions.push(pos);
    }
  } else if (layout === 'bottom-heavy') {
    // 하단에 이미지 집중
    const twoThirds = Math.max(1, Math.floor(paragraphs.length * 2 / 3));
    for (let i = 0; i < unusedImages.length; i++) {
      const pos = Math.min(twoThirds + i, paragraphs.length - 1);
      insertPositions.push(pos);
    }
  } else if (layout === 'balanced' || layout === 'auto') {
    // 균등 분배 (기본값)
    if (paragraphs.length <= unusedImages.length) {
      // 단락보다 이미지가 많거나 같으면 각 단락 뒤에 이미지 배치
      insertPositions = Array.from({ length: paragraphs.length }, (_, i) => i);
    } else {
      // 단락이 이미지보다 많으면 균등하게 분배
      const step = Math.floor(paragraphs.length / (unusedImages.length + 1));
      for (let i = 0; i < unusedImages.length; i++) {
        // 이미지 간 간격을 균등하게 유지
        const position = Math.floor((i + 1) * (paragraphs.length / (unusedImages.length + 1)));
        if (position > 0 && position < paragraphs.length) {
          insertPositions.push(position);
        }
      }
    }
  }
  
  // 중복 위치 제거 및 정렬
  insertPositions = Array.from(new Set(insertPositions)).sort((a, b) => a - b);
  
  console.log('이미지 삽입 위치:', insertPositions);
  
  // 이미지가 삽입된 단락 배열 생성
  let result: string[] = [];
  let imageIndex = 0;
  
  // 각 단락 처리
  for (let i = 0; i < paragraphs.length; i++) {
    // 현재 단락 추가
    if (paragraphs[i].trim()) {
      result.push(`<p>${paragraphs[i]}</p>`);
    }
    
    // 이미지 삽입 위치인 경우 이미지 추가
    if (insertPositions.includes(i) && remainingImages.length > 0) {
      const imgUrl = remainingImages.shift(); // 남은 이미지 중 첫 번째 이미지 사용
      if (imgUrl) {
        result.push(`<div class="blog-image-container">
          <img src="${imgUrl}" alt="블로그 이미지 ${imageIndex + 1}" class="blog-image ${sizeClass}" loading="lazy" />
        </div>`);
        imageIndex++;
      }
    }
  }
  
  // 남은 이미지가 있으면 콘텐츠 끝에 추가
  remainingImages.forEach((imgUrl, idx) => {
    result.push(`<div class="blog-image-container">
      <img src="${imgUrl}" alt="블로그 이미지 ${imageIndex + idx + 1}" class="blog-image ${sizeClass}" loading="lazy" />
    </div>`);
  });
  
  console.log('최종 이미지 삽입 개수:', imageIndex + remainingImages.length);
  
  return result.join('\n');
};

// 이미지 관리 컴포넌트
interface ImageManagerProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  layout: string;
  onLayoutChange: (layout: string) => void;
  imageSize: string;
  onImageSizeChange: (size: string) => void;
}

const ImageManager: React.FC<ImageManagerProps> = ({ 
  images, 
  onImagesChange, 
  layout, 
  onLayoutChange, 
  imageSize, 
  onImageSizeChange 
}) => {
  const { toast } = useToast();
  
  // 이미지 업로드 처리
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    const promises = files.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target && typeof e.target.result === 'string') {
            resolve(e.target.result);
          }
        };
        reader.readAsDataURL(file);
      });
    });
    
    Promise.all(promises).then(results => {
      onImagesChange([...images, ...results]);
      toast({
        title: "이미지 추가 완료",
        description: `${results.length}개의 이미지가 추가되었습니다.`,
        duration: 3000,
      });
    });
  };
  
  // 이미지 제거
  const handleImageRemove = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
    toast({
      title: "이미지 제거",
      description: "이미지가 제거되었습니다.",
      duration: 2000,
    });
  };
  
  // 이미지 순서 변경 (위로)
  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const newImages = [...images];
    const temp = newImages[index];
    newImages[index] = newImages[index - 1];
    newImages[index - 1] = temp;
    onImagesChange(newImages);
  };
  
  // 이미지 순서 변경 (아래로)
  const handleMoveDown = (index: number) => {
    if (index >= images.length - 1) return;
    const newImages = [...images];
    const temp = newImages[index];
    newImages[index] = newImages[index + 1];
    newImages[index + 1] = temp;
    onImagesChange(newImages);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <h4 className="text-sm font-medium">이미지 배치</h4>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={layout === 'auto' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => onLayoutChange('auto')}
          >
            자동
          </Button>
          <Button 
            variant={layout === 'balanced' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => onLayoutChange('balanced')}
          >
            균형
          </Button>
          <Button 
            variant={layout === 'top-heavy' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => onLayoutChange('top-heavy')}
          >
            상단 집중
          </Button>
          <Button 
            variant={layout === 'bottom-heavy' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => onLayoutChange('bottom-heavy')}
          >
            하단 집중
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col space-y-2">
        <h4 className="text-sm font-medium">이미지 크기</h4>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={imageSize === 'small' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => onImageSizeChange('small')}
          >
            작게
          </Button>
          <Button 
            variant={imageSize === 'medium' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => onImageSizeChange('medium')}
          >
            중간
          </Button>
          <Button 
            variant={imageSize === 'large' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => onImageSizeChange('large')}
          >
            크게
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium">이미지 관리 ({images.length}개)</h4>
          <div className="relative">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Upload size={14} />
              이미지 추가
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="이미지 파일 업로드"
                title="이미지 파일 선택"
              />
            </Button>
          </div>
        </div>
        
        {images.length === 0 ? (
          <div className="text-center py-8 border border-dashed rounded-md text-muted-foreground">
            이미지가 없습니다. 이미지를 추가해주세요.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
            {images.map((image, index) => (
              <div key={index} className="relative group border rounded-md overflow-hidden">
                <img 
                  src={image} 
                  alt={`이미지 ${index + 1}`} 
                  className="w-full h-24 object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  {index > 0 && (
                    <Button size="icon" variant="ghost" onClick={() => handleMoveUp(index)} className="h-8 w-8 text-white">
                      <ArrowUp size={14} />
                    </Button>
                  )}
                  {index < images.length - 1 && (
                    <Button size="icon" variant="ghost" onClick={() => handleMoveDown(index)} className="h-8 w-8 text-white">
                      <ArrowDown size={14} />
                    </Button>
                  )}
                  <Button size="icon" variant="ghost" onClick={() => handleImageRemove(index)} className="h-8 w-8 text-white">
                    <X size={14} />
                  </Button>
                </div>
                <div className="absolute top-0 left-0 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-br">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const BlogPreview = ({ 
  content, 
  title = "블로그 미리보기", 
  format = 'html',
  animate = false,
  imageUrls = [],
  imageLayout = 'auto',
  imageSize = 'medium',
  onImagesChange,
  onImageLayoutChange,
  onImageSizeChange
}: BlogPreviewProps) => {
  const [copied, setCopied] = useState(false);
  // viewMode 상태 제거하고 기본값으로 'desktop' 설정
  const viewMode = 'desktop'; // 기본값으로 고정
  const [processedContent, setProcessedContent] = useState('');
  const [naverContent, setNaverContent] = useState('');
  const [showAnimation, setShowAnimation] = useState(animate);
  const [animationComplete, setAnimationComplete] = useState(!animate);
  const [displayImageUrl, setDisplayImageUrl] = useState<string | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const { toast } = useToast();
  
  // 이미지 관리 상태
  const [localImageUrls, setLocalImageUrls] = useState<string[]>([]);
  const [localImageLayout, setLocalImageLayout] = useState<string>(imageLayout);
  const [localImageSize, setLocalImageSize] = useState<string>(imageSize);
  
  // 이미지 URL 변경 시 상태 업데이트 (중복 제거)
  useEffect(() => {
    if (imageUrls && imageUrls.length > 0) {
      // 중복 제거
      const uniqueImages = Array.from(new Set(imageUrls));
      console.log('원본 이미지 수:', imageUrls.length, '중복 제거 후:', uniqueImages.length);
      setLocalImageUrls(uniqueImages);
    }
  }, [imageUrls]);
  
  // 애니메이션 완료 핸들러
  const handleAnimationComplete = useCallback(() => {
    console.log('애니메이션 완료 핸들러 호출');
    setAnimationComplete(true);
    setShowAnimation(false);
  }, []);
  
  // 이미지 로드 핸들러
  const handleImageLoad = useCallback(() => {
    setImagesLoaded(prev => prev + 1);
  }, []);
  
  // animate prop이 변경될 때 showAnimation 상태 업데이트
  useEffect(() => {
    console.log('BlogPreview: animate prop 변경됨:', animate);
    setShowAnimation(animate);
    setAnimationComplete(!animate);
  }, [animate]);
  
  // 콘텐츠 변경 시 애니메이션 상태 리셋
  useEffect(() => {
    if (content) {
      console.log('BlogPreview: 새 콘텐츠 감지됨, 애니메이션 상태 리셋');
      if (animate) {
        setShowAnimation(true);
        setAnimationComplete(false);
      } else {
        setShowAnimation(false);
        setAnimationComplete(true);
      }
    }
  }, [content, animate]);
  
  // 콘텐츠 처리
  useEffect(() => {
    if (!content) {
      console.log('BlogPreview: 콘텐츠가 없습니다');
      return;
    }
    
    console.log('BlogPreview: 콘텐츠 처리 시작', format);
    
    // 콘텐츠 형식에 따른 처리
    let processed = content;
    
    // JSON 형식인지 확인하고 파싱
    try {
      if (typeof content === 'string' && content.trim().startsWith('{') && content.trim().endsWith('}')) {
        console.log('BlogPreview: JSON 형식 감지됨, 파싱 시도');
        const jsonContent = JSON.parse(content);
        if (jsonContent.content) {
          console.log('BlogPreview: JSON에서 content 필드 추출 성공');
          processed = jsonContent.content;
        }
      }
    } catch (error) {
      console.error('BlogPreview: JSON 파싱 오류', error);
      // 파싱 실패 시 원본 콘텐츠 사용
      processed = content;
    }
    
    // 마크다운 코드 블록 표시(```) 제거
    if (typeof processed === 'string') {
      // ```html과 같은 코드 블록 표시 제거
      processed = processed.replace(/```(\w*)\s*\n/g, '');
      processed = processed.replace(/```\s*$/g, '');
      
      // 백틱이 포함된 내용 정리
      processed = processed.replace(/`([^`]+)`/g, '$1');
    }
    
    // HTML 형식인 경우 추가 처리 없이 그대로 사용
    if (format === 'html') {
      console.log('BlogPreview: HTML 형식 콘텐츠 처리');
      // processed는 이미 JSON 파싱 단계에서 처리되었으므로 여기서는 추가 처리 필요 없음
    } 
    // 마크다운 형식인 경우 이미지 URL 추가
    else if (format === 'markdown') {
      // 마크다운에서 이미지 태그가 없거나 부족한 경우 이미지 URL을 추가
      if (localImageUrls && localImageUrls.length > 0) {
        // 마크다운에서 이미지 태그 개수 확인
        const markdownImgCount = (processed.match(/!\[.*?\]\((.*?)\)/g) || []).length;
        
        // 이미지 태그가 없거나 업로드된 이미지보다 적은 경우
        if (markdownImgCount < localImageUrls.length) {
          // 마크다운 콘텐츠를 단락으로 분할
          const paragraphs = processed.split('\n\n');
          const totalParagraphs = paragraphs.length;
          
          // 이미지를 삽입할 위치 계산 (균등 분포)
          const imagePositions = [];
          const imageCount = Math.min(localImageUrls.length, Math.floor(totalParagraphs / 2)); // 너무 많은 이미지 방지
          
          for (let i = 0; i < imageCount; i++) {
            // 이미지 간 간격을 균등하게 유지
            const position = Math.floor((i + 1) * (totalParagraphs / (imageCount + 1)));
            if (position > 0 && position < totalParagraphs) {
              imagePositions.push(position);
            }
          }
          
          // 이미지 삽입
          let imageIndex = markdownImgCount; // 기존 이미지 개수부터 시작
          for (const position of imagePositions) {
            if (imageIndex < localImageUrls.length) {
              paragraphs[position] = paragraphs[position] + 
                `\n\n![블로그 이미지 ${imageIndex + 1}](${localImageUrls[imageIndex]})\n\n`;
              imageIndex++;
            }
          }
          
          // 남은 이미지가 있으면 마지막에 추가
          while (imageIndex < localImageUrls.length && imageIndex < 5) { // 최대 5개 이미지로 제한
            paragraphs.push(`![블로그 이미지 ${imageIndex + 1}](${localImageUrls[imageIndex]})\n\n`);
            imageIndex++;
          }
          
          // 수정된 콘텐츠 재조합
          processed = paragraphs.join('\n\n');
        }
      }
    }
    
    console.log('BlogPreview: 처리된 콘텐츠 길이', processed.length);
    setProcessedContent(processed);
    
    // 애니메이션이 활성화되지 않은 경우 바로 완료 상태로 설정
    if (!animate) {
      setAnimationComplete(true);
    }
  }, [content, format, localImageUrls, animate]);
  
  // 네이버 블로그용 콘텐츠 변환
  useEffect(() => {
    if (!content) {
      console.log('BlogPreview: 콘텐츠가 없습니다');
      return;
    }
    
    const naverProcessed = format === 'markdown' 
      ? convertMarkdownToNaverHTML(processedContent) // 이미지가 추가된 콘텐츠 사용
      : convertHtmlToNaverHTML(processedContent);
    setNaverContent(naverProcessed);
  }, [content, format, processedContent]);
  
  // 이미지 URL 설정
  useEffect(() => {
    if (localImageUrls && localImageUrls.length > 0) {
      // 외부에서 전달받은 이미지 URL 사용
      setDisplayImageUrl(localImageUrls[0]);
    } else {
      // 콘텐츠에서 이미지 URL 추출
      const extractedUrls = format === 'html' 
        ? extractImageUrls(processedContent)
        : processedContent.match(/!\[.*?\]\((.*?)\)/g)?.map(match => {
            const url = match.match(/!\[.*?\]\((.*?)\)/)?.[1];
            return url || '';
          }) || [];
      
      if (extractedUrls.length > 0) {
        // 중복 제거
        const uniqueUrls = Array.from(new Set(extractedUrls));
        setLocalImageUrls(uniqueUrls);
        setDisplayImageUrl(uniqueUrls[0]);
      }
    }
  }, [content, format, processedContent, localImageUrls]);
  
  // 복사 버튼 클릭 핸들러
  const handleCopy = async () => {
    try {
      // 임시 요소 생성
      const tempElement = document.createElement('div');
      
      // 네이버 블로그 호환 콘텐츠 사용
      tempElement.innerHTML = naverContent;
      
      // 이미지 URL을 절대 경로로 변환
      const images = tempElement.querySelectorAll('img');
      images.forEach(img => {
        // 상대 경로를 절대 경로로 변환
        if (img.src && !img.src.startsWith('http')) {
          img.src = new URL(img.src, window.location.origin).href;
        }
        
        // 이미지 스타일 추가
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.margin = '10px 0';
      });
      
      // 임시 요소를 body에 추가 (화면에 보이지 않게)
      tempElement.style.position = 'absolute';
      tempElement.style.left = '-9999px';
      document.body.appendChild(tempElement);
      
      // 텍스트 선택
      const range = document.createRange();
      range.selectNodeContents(tempElement);
      
      const selection = window.getSelection();
      if (!selection) throw new Error('선택 객체를 가져올 수 없습니다');
      
      selection.removeAllRanges();
      selection.addRange(range);
      
      // 복사 시도
      try {
        // document.execCommand 방식 시도
        if (document.execCommand('copy')) {
          toast({
            title: "복사 완료!",
            description: "콘텐츠가 복사되었습니다. 네이버 블로그에 붙여넣기 하세요.",
            duration: 3000,
          });
          
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      } catch (execError) {
        console.error('execCommand 오류:', execError);
        
        // 폴백: 텍스트만 복사
        try {
          // HTML 형식으로 클립보드에 복사 시도
          try {
            const clipboardItem = new ClipboardItem({
              'text/html': new Blob([tempElement.innerHTML], { type: 'text/html' }),
              'text/plain': new Blob([tempElement.innerText], { type: 'text/plain' })
            });
            
            await navigator.clipboard.write([clipboardItem]);
            
            toast({
              title: "복사 완료!",
              description: "콘텐츠가 복사되었습니다. 네이버 블로그에 붙여넣기 하세요.",
              duration: 3000,
            });
            
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch (htmlError) {
            console.error('HTML 복사 오류:', htmlError);
            
            // HTML 복사 실패 시 텍스트만 복사
            const plainText = tempElement.innerText || tempElement.textContent || '';
            await navigator.clipboard.writeText(plainText);
            
            toast({
              title: "텍스트만 복사됨",
              description: "서식 없이 텍스트만 복사되었습니다.",
              duration: 3000,
            });
            
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }
        } catch (clipboardError) {
          console.error('클립보드 API 오류:', clipboardError);
          toast({
            title: "복사 실패",
            description: "콘텐츠를 복사할 수 없습니다. 다시 시도해주세요.",
            duration: 3000,
          });
        }
      } finally {
        // 임시 요소 제거
        document.body.removeChild(tempElement);
      }
    } catch (error) {
      console.error('복사 처리 중 오류 발생:', error);
      
      // 최종 폴백: 기본 텍스트 복사 시도
      try {
        // HTML 태그 제거 및 콘텐츠 정리
        const cleanedContent = processedContent.replace(/<[^>]*>/g, '');
        await navigator.clipboard.writeText(cleanedContent);
        
        toast({
          title: "텍스트만 복사됨",
          description: "서식을 유지한 복사에 실패하여 텍스트만 복사되었습니다.",
          duration: 3000,
        });
        
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (finalError) {
        console.error('최종 복사 실패:', finalError);
        toast({
          title: "복사 실패",
          description: "콘텐츠를 복사할 수 없습니다. 다시 시도해주세요.",
          duration: 3000,
        });
      }
    }
  };
  
  // 뷰포트 크기에 따른 클래스 설정
  const containerClasses = cn(
    "bg-white dark:bg-slate-900 rounded-lg overflow-hidden transition-all duration-300 w-full"
  );
  
  // HTML 콘텐츠 안전하게 렌더링
  const renderHTML = () => {
    return { __html: processedContent };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      
      <Card>
        <CardContent className="p-6 blog-content">
          {showAnimation ? (
            <div className="blog-content-container">
              <TypeAnimation
                sequence={[
                  format === 'html' ? processedContent.replace(/<[^>]*>/g, '') : processedContent,
                  1000, // 애니메이션 완료 후 1초 대기
                  () => {
                    // 애니메이션 완료 후 콜백 함수
                    console.log('애니메이션 완료');
                    handleAnimationComplete();
                  }
                ]}
                speed={75} // 속도: 50-99 사이 값 (높을수록 빠름, 75는 적당한 속도)
                style={{ 
                  whiteSpace: 'pre-wrap',
                  display: 'block',
                  width: '100%',
                  fontSize: '15px',
                  lineHeight: '1.8'
                }}
                wrapper="div"
                cursor={true} // 타이핑 커서 표시
                repeat={0}
                className="blog-content-animated"
              />
              <div className="typing-effects-container">
                <div className="typing-sparks"></div>
                <div className="typing-glow"></div>
              </div>
            </div>
          ) : (
            format === 'markdown' ? (
              <Suspense fallback={<div>로딩 중...</div>}>
                <ReactMarkdown 
                  components={{
                    img: ({ node, ...props }) => {
                      // 이미지 URL이 있는지 확인
                      if (!props.src) return null;
                      
                      // 이미지 크기 클래스 설정
                      const sizeClass = `blog-image-${localImageSize}`;
                      
                      return (
                        <div className="blog-image-container">
                          <img 
                            src={props.src} 
                            alt={props.alt || "블로그 이미지"} 
                            className={`blog-image ${sizeClass}`}
                            loading="lazy"
                            onLoad={handleImageLoad}
                          />
                        </div>
                      );
                    }
                  }}
                >
                  {processedContent}
                </ReactMarkdown>
              </Suspense>
            ) : (
              <div 
                dangerouslySetInnerHTML={renderHTML()} 
                className="blog-preview-content"
              />
            )
          )}
        </CardContent>
      </Card>
      
      <Button
        className="w-full"
        onClick={handleCopy}
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 mr-2" />
            복사됨
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 mr-2" />
            콘텐츠 복사하기
          </>
        )}
      </Button>
    </div>
  );
}; 