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
    // 기존 블록 타입을 Puck 컴포넌트명으로 매핑
    const componentMap: Record<string, string> = {
      'heading': 'Heading',
      'text': 'Text', 
      'image': 'Image',
      'video': 'Video',
      'button': 'Button',
      'spacer': 'Spacer',
      'hero': 'Hero',
      'html': 'Html'
    };

    return {
      type: componentMap[block.type] || 'Text',
      props: {
        id: block.id,
        ...block.content,
        // 기존 settings를 props로 변환
        ...(block.settings || {})
      }
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
    'Heading': 'heading',
    'Text': 'text',
    'Image': 'image', 
    'Video': 'video',
    'Button': 'button',
    'Spacer': 'spacer',
    'Hero': 'hero',
    'Html': 'html'
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
  const [data, setData] = useState<Data>(() => convertBlocksToPuckData(initialBlocks));
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // initialBlocks가 변경될 때 Puck 데이터 업데이트
  useEffect(() => {
    if (initialBlocks.length > 0) {
      setData(convertBlocksToPuckData(initialBlocks));
    }
  }, [initialBlocks]);

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