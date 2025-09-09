'use client';

import { useState } from 'react';
import { Puck, Data } from '@measured/puck';
import { puckConfig } from './puck-config-simple';
import { Block } from '@/types/page-builder';
import { Button } from '@/components/ui/button';
import { Save, Eye, Edit, ArrowLeft } from 'lucide-react';

interface PuckPageBuilderProps {
  initialBlocks?: Block[];
  onSave?: (blocks: Block[]) => void;
  onBack?: () => void;
}

export function PuckPageBuilder({ initialBlocks = [], onSave, onBack }: PuckPageBuilderProps) {
  // 간단한 초기 데이터로 시작
  const [data, setData] = useState<Data>({
    content: [
      {
        type: "제목",
        props: {
          id: "demo-heading",
          text: "케어온과 함께 시작하세요",
          level: 1,
          fontSize: 48,
          color: "#1f2937",
          textAlign: "center",
          fontWeight: 700
        }
      },
      {
        type: "텍스트",
        props: {
          id: "demo-text", 
          text: "전문적인 비즈니스 솔루션으로 안전한 창업을 시작하세요",
          fontSize: 18,
          color: "#6b7280",
          textAlign: "center",
          lineHeight: 1.6
        }
      }
    ],
    root: { props: { title: "케어온 랜딩 페이지" } }
  });

  const handleSave = () => {
    // 간단한 저장 로직 - 나중에 변환 로직 추가
    console.log('🔥 Puck 데이터 저장:', data);
    console.log('🔥 현재 컨텐츠 수:', data.content.length);
    alert('Puck 에디터에서 저장되었습니다!');
  };

  // 디버깅용 로그
  console.log('🔥 Puck 에디터 렌더링:', { 
    configLoaded: !!puckConfig, 
    componentsCount: Object.keys(puckConfig.components).length,
    dataContentLength: data.content.length 
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 툴바 */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                에디터 선택
              </Button>
            )}
            <h1 className="text-2xl font-bold text-gray-900">Puck 페이지 빌더</h1>
            <span className="text-sm px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">
              🆕 캔바 수준 WYSIWYG
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
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
      <div className="h-[calc(100vh-80px)] relative">
        <div className="absolute inset-4 bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">🚧</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Puck 에디터 로딩 중...</h3>
            <p className="text-sm text-gray-500">
              브라우저 콘솔을 확인해주세요 (F12)
            </p>
          </div>
        </div>
        
        <div className="relative z-10">
          <Puck
            config={puckConfig}
            data={data}
            onPublish={handleSave}
            onChange={(newData) => {
              console.log('🔥 Puck 데이터 변경:', newData);
              setData(newData);
            }}
          />
        </div>
      </div>
    </div>
  );
}