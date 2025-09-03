'use client';

import { useState, useEffect } from 'react';
import { Puck, Data } from '@measured/puck';
import { puckConfig } from './puck-config';
import { Block } from '@/types/page-builder';
import { Button } from '@/components/ui/button';
import { Save, Eye, Edit, ArrowLeft } from 'lucide-react';

// Puck CSS 스타일 import
import '@measured/puck/puck.css';

interface PuckPageBuilderProps {
  initialBlocks?: Block[];
  onSave?: (blocks: Block[]) => void;
  onBack?: () => void;
}

// 기존 블록 데이터를 Puck Data 형식으로 변환
const convertBlocksToPuckData = (blocks: Block[]): Data => {
  const content = blocks.map((block) => {
    // 기존 블록 타입을 Puck 컴포넌트명으로 매핑 (한국어 이름으로)
    const componentMap: Record<string, string> = {
      'heading': '제목',
      'text': '텍스트', 
      'image': '이미지',
      'video': 'Video', // 아직 비디오는 설정 안됨
      'button': '버튼',
      'spacer': '공백',
      'hero': '히어로 섹션',
      'html': 'HTML 코드'
    };

    // 각 블록 타입별로 적절한 props 변환
    let puckProps: any = { id: block.id };

    switch (block.type) {
      case 'heading':
        puckProps = {
          id: block.id,
          text: block.content.text || '새 제목',
          level: block.content.level || 2,
          fontSize: parseInt(block.content.fontSize) || 32,
          color: block.content.color || '#000000',
          letterSpacing: parseFloat(block.content.letterSpacing) || 0,
          lineHeight: parseFloat(block.content.lineHeight) || 1.2,
          fontWeight: parseInt(block.content.fontWeight) || 700,
          textAlign: block.content.textAlign || 'left'
        };
        break;
      
      case 'text':
        puckProps = {
          id: block.id,
          text: block.content.text || '새 텍스트를 입력하세요...',
          format: block.content.format || 'plain',
          fontSize: parseInt(block.content.fontSize) || 16,
          color: block.content.color || '#000000',
          letterSpacing: parseFloat(block.content.letterSpacing) || 0,
          lineHeight: parseFloat(block.content.lineHeight) || 1.5,
          fontWeight: parseInt(block.content.fontWeight) || 400,
          textAlign: block.content.textAlign || 'left'
        };
        break;

      case 'button':
        puckProps = {
          id: block.id,
          text: block.content.text || '버튼',
          link: block.content.link || '#',
          variant: block.content.variant || 'default',
          size: block.content.size || 'default',
          alignment: block.content.alignment || 'center',
          marginTop: block.settings?.padding?.top || 0,
          marginBottom: block.settings?.padding?.bottom || 0,
          marginLeft: block.settings?.padding?.left || 0,
          marginRight: block.settings?.padding?.right || 0
        };
        break;

      case 'spacer':
        puckProps = {
          id: block.id,
          height: block.content.height || 50
        };
        break;

      case 'image':
        puckProps = {
          id: block.id,
          images: block.content.images || [],
          displayMode: block.content.displayMode || 'single'
        };
        break;

      case 'hero':
        puckProps = {
          id: block.id,
          title: block.content.title || '새 히어로 섹션',
          subtitle: block.content.subtitle || '',
          backgroundImage: block.content.backgroundImage || '',
          backgroundVideo: block.content.backgroundVideo || '',
          overlay: block.content.overlay || false,
          overlayOpacity: block.content.overlayOpacity || 0.5,
          buttons: block.content.buttons || []
        };
        break;

      case 'html':
        puckProps = {
          id: block.id,
          html: block.content.html || '<p>HTML 코드를 입력하세요</p>'
        };
        break;

      default:
        puckProps = {
          id: block.id,
          ...block.content
        };
    }

    return {
      type: componentMap[block.type] || '텍스트',
      props: puckProps
    };
  });

  return {
    content,
    root: { props: { title: "케어온 랜딩 페이지" } }
  };
};

// Puck Data를 기존 블록 형식으로 변환
const convertPuckDataToBlocks = (data: Data): Block[] => {
  const reverseComponentMap: Record<string, string> = {
    '제목': 'heading',
    '텍스트': 'text',
    '이미지': 'image', 
    'Video': 'video',
    '버튼': 'button',
    '공백': 'spacer',
    '히어로 섹션': 'hero',
    'HTML 코드': 'html'
  };

  return data.content.map((item, index) => {
    const { id, ...contentProps } = item.props as any;
    
    return {
      id: id || `block-${Date.now()}-${index}`,
      type: reverseComponentMap[item.type] || 'text',
      content: contentProps,
      settings: {
        padding: { top: 0, right: 0, bottom: 0, left: 0 },
        animation: { type: 'none', duration: 0.6, delay: 0 }
      }
    } as Block;
  });
};

export function PuckPageBuilder({ initialBlocks = [], onSave, onBack }: PuckPageBuilderProps) {
  // 초기에는 빈 데이터로 시작 (기존 블록 호환성 문제 방지)
  const [data, setData] = useState<Data>({
    content: [],
    root: { props: { title: "케어온 랜딩 페이지" } }
  });
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // 기존 블록이 있는 경우에만 변환 (안전성을 위해 주석 처리)
  // useEffect(() => {
  //   if (initialBlocks.length > 0) {
  //     setData(convertBlocksToPuckData(initialBlocks));
  //   }
  // }, [initialBlocks]);

  const handleSave = () => {
    const convertedBlocks = convertPuckDataToBlocks(data);
    onSave?.(convertedBlocks);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 툴바 */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                기존 에디터
              </Button>
            )}
            <h1 className="text-2xl font-bold text-gray-900">Puck 페이지 빌더</h1>
            <span className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
              캔바 수준 WYSIWYG
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={isPreviewMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
            >
              {isPreviewMode ? <Edit className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {isPreviewMode ? '편집 모드' : '미리보기'}
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
            >
              <Save className="w-4 h-4 mr-2" />
              저장
            </Button>
          </div>
        </div>
      </div>

      {/* Puck 에디터 */}
      <div className="h-[calc(100vh-80px)]">
        <Puck
          config={puckConfig}
          data={data}
          onPublish={(data: Data) => {
            setData(data);
            handleSave();
          }}
          onChange={setData}
          renderMode={isPreviewMode ? 'preview' : 'edit'}
          headerTitle="케어온 랜딩 페이지"
          headerPath="/landing"
        />
      </div>
    </div>
  );
}