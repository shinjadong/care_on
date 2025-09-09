'use client';

import { useState, useEffect } from 'react';
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
  // 기존 블록을 Puck 형식으로 변환하여 불러오기
  const convertBlocksToPuckData = (blocks: Block[]): Data => {
    console.log('🔄 기존 블록들을 Puck 형식으로 변환:', blocks.length, '개');
    
    const content = blocks.map((block, index) => {
      const blockTypeMap: Record<string, string> = {
        'heading': '제목',
        'text': '텍스트',
        'button': '버튼',
        'spacer': '공백',
        'image': '이미지',
        'hero': '제목', // hero는 제목으로 임시 변환
        'html': '텍스트' // html은 텍스트로 임시 변환
      };

      const puckType = blockTypeMap[block.type] || '텍스트';
      let puckProps: any = { id: block.id };

      switch (block.type) {
        case 'heading':
          puckProps = {
            id: block.id,
            text: block.content.text || '제목',
            level: block.content.level || 2,
            fontSize: parseInt(block.content.fontSize) || 32,
            color: block.content.color || '#000000',
            textAlign: block.content.textAlign || 'center'
          };
          break;

        case 'text':
          puckProps = {
            id: block.id,
            text: block.content.text || '텍스트',
            fontSize: parseInt(block.content.fontSize) || 16,
            color: block.content.color || '#000000',
            textAlign: block.content.textAlign || 'left',
            lineHeight: parseFloat(block.content.lineHeight) || 1.6
          };
          break;

        case 'button':
          puckProps = {
            id: block.id,
            text: block.content.text || '버튼',
            link: block.content.link || '#',
            variant: block.content.variant || 'default',
            size: block.content.size || 'default'
          };
          break;

        case 'spacer':
          puckProps = {
            id: block.id,
            height: block.content.height || 50
          };
          break;

        case 'image':
          const firstImage = block.content.images?.[0];
          puckProps = {
            id: block.id,
            src: firstImage?.src || 'https://via.placeholder.com/800x600',
            alt: firstImage?.alt || '이미지',
            width: firstImage?.width || 800
          };
          break;

        case 'hero':
          // 히어로를 제목으로 변환
          puckProps = {
            id: block.id,
            text: block.content.title || '히어로 제목',
            level: 1,
            fontSize: 48,
            color: '#ffffff',
            textAlign: 'center'
          };
          break;

        case 'html':
          // HTML을 텍스트로 변환
          puckProps = {
            id: block.id,
            text: block.content.html?.replace(/<[^>]*>/g, '') || 'HTML 내용',
            fontSize: 16,
            color: '#000000',
            textAlign: 'left',
            lineHeight: 1.6
          };
          break;

        default:
          puckProps = {
            id: block.id,
            text: '변환된 콘텐츠',
            fontSize: 16,
            color: '#000000',
            textAlign: 'left',
            lineHeight: 1.6
          };
      }

      return {
        type: puckType,
        props: puckProps
      };
    });

    return {
      content,
      root: { props: { title: "케어온 랜딩 페이지" } }
    };
  };

  const [data, setData] = useState<Data>(() => {
    // 기존 블록이 있으면 변환하여 사용, 없으면 샘플 데이터
    if (initialBlocks.length > 0) {
      return convertBlocksToPuckData(initialBlocks);
    }
    
    return {
      content: [
        {
          type: "제목",
          props: {
            id: "demo-heading",
            text: "케어온과 함께 시작하세요",
            level: 1,
            fontSize: 48,
            color: "#1f2937",
            textAlign: "center"
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
    };
  });

  // initialBlocks가 변경될 때마다 Puck 데이터 업데이트
  useEffect(() => {
    console.log('🔄 initialBlocks 변경 감지:', initialBlocks.length, '개');
    if (initialBlocks.length > 0) {
      const convertedData = convertBlocksToPuckData(initialBlocks);
      console.log('🔄 변환된 Puck 데이터:', convertedData);
      setData(convertedData);
    }
  }, [initialBlocks]);

  const handleSave = async () => {
    try {
      console.log('🔥 Puck 데이터 저장 시작:', data);
      
      // Puck 데이터를 기존 블록 형식으로 변환
      const convertedBlocks = data.content.map((item, index) => {
        const typeMap: Record<string, string> = {
          '제목': 'heading',
          '텍스트': 'text',
          '버튼': 'button',
          '공백': 'spacer',
          '이미지': 'image'
        };

        const blockType = typeMap[item.type] || 'text';
        const props = item.props as any;

        let content: any = {};
        
        switch (item.type) {
          case '제목':
            content = {
              text: props.text || '제목',
              level: props.level || 2,
              fontSize: props.fontSize?.toString() || '32',
              color: props.color || '#000000',
              textAlign: props.textAlign || 'center',
              fontWeight: props.fontWeight?.toString() || '700'
            };
            break;
          
          case '텍스트':
            content = {
              text: props.text || '텍스트',
              format: 'plain',
              fontSize: props.fontSize?.toString() || '16',
              color: props.color || '#000000',
              textAlign: props.textAlign || 'left',
              lineHeight: props.lineHeight?.toString() || '1.6'
            };
            break;
          
          case '버튼':
            content = {
              text: props.text || '버튼',
              link: props.link || '#',
              variant: props.variant || 'default',
              size: props.size || 'default'
            };
            break;
          
          case '공백':
            content = {
              height: props.height || 50
            };
            break;
          
          case '이미지':
            content = {
              images: [{
                id: `img-${Date.now()}`,
                src: props.src || 'https://via.placeholder.com/800x600',
                alt: props.alt || '이미지',
                width: props.width || 800
              }],
              displayMode: 'single'
            };
            break;
          
          default:
            content = props;
        }

        return {
          id: props.id || `block-${Date.now()}-${index}`,
          type: blockType,
          content,
          settings: {
            padding: { top: 0, right: 0, bottom: 0, left: 0 },
            animation: { type: 'none', duration: 0.6, delay: 0 }
          }
        };
      });

      console.log('🔄 변환된 블록들:', convertedBlocks);

      // 실제 저장 API 호출 (edit 페이지의 handleSave와 동일한 로직)
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: 'landing',
          title: '케어온 랜딩 페이지',
          blocks: convertedBlocks,
        }),
      });

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Puck 에디터 저장 완료!');
        alert('✅ 페이지가 성공적으로 저장되었습니다!\n\n/landing 페이지에서 확인하세요.');
      } else {
        throw new Error('저장 실패: ' + result.error);
      }

    } catch (error) {
      console.error('❌ Puck 에디터 저장 실패:', error);
      alert('❌ 저장에 실패했습니다:\n' + error);
    }
  };

  // 디버깅용 로그
  console.log('🔥 Puck 에디터 상태:', { 
    initialBlocksCount: initialBlocks.length,
    configLoaded: !!puckConfig, 
    componentsCount: Object.keys(puckConfig.components).length,
    dataContentLength: data.content.length,
    currentData: data
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