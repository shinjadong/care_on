'use client';

import { useState } from 'react';
import { Block, BlockType } from '@/types/page-builder';
import { X, Plus, Eye, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TemplateGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (blocks: Block[]) => void;
}

// 사전 제작된 템플릿 (Tailblocks 기반)
const templates = [
  {
    id: 'hero-cta',
    name: '히어로 + CTA',
    description: '임팩트 있는 메인 섹션',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    category: '랜딩',
    blocks: [
      {
        id: 'hero-1',
        type: 'hero' as BlockType,
        content: {
          title: '혁신적인 비즈니스 솔루션',
          subtitle: '케어온과 함께 성공적인 창업을 시작하세요',
          backgroundImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=1080&fit=crop',
          overlay: true,
          overlayOpacity: 0.6,
          buttons: [
            { text: '무료 체험하기', link: '#trial', variant: 'default', size: 'lg' },
            { text: '더 알아보기', link: '#info', variant: 'outline', size: 'lg' }
          ]
        },
        settings: {
          animation: { type: 'fadeIn', duration: 1.2, delay: 0 },
          padding: { top: 0, right: 0, bottom: 0, left: 0 }
        }
      }
    ]
  },
  {
    id: 'feature-grid',
    name: '기능 소개',
    description: '3개 칼럼 기능 설명',
    thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop',
    category: '콘텐츠',
    blocks: [
      {
        id: 'heading-1',
        type: 'heading' as BlockType,
        content: {
          text: '우리의 핵심 기능',
          level: 2,
          fontSize: '36',
          color: '#1f2937',
          textAlign: 'center',
          fontWeight: '700'
        },
        settings: {
          animation: { type: 'slideUp', duration: 0.8, delay: 0.2 },
          padding: { top: 60, right: 20, bottom: 40, left: 20 }
        }
      },
      {
        id: 'text-1',
        type: 'text' as BlockType,
        content: {
          text: '전문적인 보안 | 24시간 모니터링 | 완벽한 지원\n\nCCTV 설치부터 종합 보험까지, 모든 것을 한 번에 해결하는 통합 솔루션입니다.\n\n✓ 전문가 직접 설치\n✓ 실시간 모니터링\n✓ 365일 고객지원',
          format: 'plain',
          fontSize: '16',
          color: '#6b7280',
          textAlign: 'center',
          lineHeight: '1.6'
        },
        settings: {
          animation: { type: 'slideUp', duration: 0.8, delay: 0.4 },
          padding: { top: 0, right: 20, bottom: 60, left: 20 }
        }
      }
    ]
  },
  {
    id: 'testimonial',
    name: '고객 후기',
    description: '신뢰감을 주는 고객 증언',
    thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop',
    category: '신뢰',
    blocks: [
      {
        id: 'text-testimonial',
        type: 'text' as BlockType,
        content: {
          text: '"케어온 덕분에 안전한 창업을 할 수 있었습니다. 전문가의 꼼꼼한 케어로 모든 걱정이 사라졌어요."\n\n- 김사장님, 카페 운영',
          format: 'plain',
          fontSize: '20',
          color: '#374151',
          textAlign: 'center',
          lineHeight: '1.8',
          fontStyle: 'italic'
        },
        settings: {
          animation: { type: 'scale', duration: 1.0, delay: 0.3 },
          padding: { top: 80, right: 40, bottom: 80, left: 40 }
        }
      }
    ]
  },
  {
    id: 'cta-simple',
    name: '간단한 CTA',
    description: '명확한 행동 유도',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
    category: '전환',
    blocks: [
      {
        id: 'heading-cta',
        type: 'heading' as BlockType,
        content: {
          text: '지금 바로 시작하세요',
          level: 2,
          fontSize: '32',
          color: '#1f2937',
          textAlign: 'center',
          fontWeight: '700'
        },
        settings: {
          animation: { type: 'slideUp', duration: 0.6, delay: 0 },
          padding: { top: 60, right: 20, bottom: 20, left: 20 }
        }
      },
      {
        id: 'button-cta',
        type: 'button' as BlockType,
        content: {
          text: '무료 상담 신청하기',
          link: '#contact',
          variant: 'default',
          size: 'lg'
        },
        settings: {
          animation: { type: 'bounce', duration: 0.8, delay: 0.3 },
          padding: { top: 20, right: 20, bottom: 60, left: 20 }
        }
      }
    ]
  },
  {
    id: 'image-text',
    name: '이미지 + 텍스트',
    description: '시각적 설명 섹션',
    thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop',
    category: '콘텐츠',
    blocks: [
      {
        id: 'image-demo',
        type: 'image' as BlockType,
        content: {
          images: [{
            id: 'demo-img',
            src: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop',
            alt: '케어온 서비스 데모',
            caption: '',
            width: 800,
            height: 600
          }],
          displayMode: 'single'
        },
        settings: {
          animation: { type: 'slideLeft', duration: 0.8, delay: 0 },
          padding: { top: 0, right: 0, bottom: 0, left: 0 }
        }
      },
      {
        id: 'text-description',
        type: 'text' as BlockType,
        content: {
          text: '전문적이고 안전한 서비스\n\n케어온의 모든 서비스는 고객의 성공을 위해 설계되었습니다. 전문가가 직접 설치하고 관리하여 안전하고 효율적인 비즈니스 환경을 제공합니다.',
          format: 'plain',
          fontSize: '18',
          color: '#374151',
          textAlign: 'center',
          lineHeight: '1.7'
        },
        settings: {
          animation: { type: 'slideRight', duration: 0.8, delay: 0.2 },
          padding: { top: 40, right: 40, bottom: 60, left: 40 }
        }
      }
    ]
  }
];

const categories = [
  { id: 'all', name: '전체' },
  { id: '랜딩', name: '히어로' },
  { id: '콘텐츠', name: '콘텐츠' },
  { id: '신뢰', name: '신뢰성' },
  { id: '전환', name: 'CTA' },
];

export function TemplateGallery({ isOpen, onClose, onSelectTemplate }: TemplateGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewTemplate, setPreviewTemplate] = useState<typeof templates[0] | null>(null);

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const handleSelectTemplate = (template: typeof templates[0]) => {
    const blocksWithNewIds = template.blocks.map(block => ({
      ...block,
      id: `${block.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }));
    
    onSelectTemplate(blocksWithNewIds);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Plus className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">템플릿 갤러리</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories */}
        <div className="p-6 border-b">
          <div className="flex space-x-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Template Grid */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleSelectTemplate(template)}
              >
                {/* Thumbnail */}
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {template.blocks.length}개 블록
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewTemplate(template);
                        }}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        미리보기
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectTemplate(template);
                        }}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        사용하기
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 text-center">
          <p className="text-sm text-gray-600">
            총 {filteredTemplates.length}개 템플릿 | 클릭하여 즉시 추가
          </p>
        </div>
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">{previewTemplate.name}</h3>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-4">
                {previewTemplate.blocks.map((block, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium capitalize">{block.type} 블록</span>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {block.settings?.animation?.type || '애니메이션 없음'}
                      </span>
                    </div>
                    {block.type === 'text' && (
                      <p className="text-sm text-gray-600">{block.content.text?.slice(0, 100)}...</p>
                    )}
                    {block.type === 'heading' && (
                      <h4 className="text-lg font-semibold">{block.content.text}</h4>
                    )}
                    {block.type === 'hero' && (
                      <div>
                        <h4 className="text-lg font-bold mb-1">{block.content.title}</h4>
                        <p className="text-sm text-gray-600">{block.content.subtitle}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t">
              <Button 
                onClick={() => {
                  handleSelectTemplate(previewTemplate);
                  setPreviewTemplate(null);
                }}
                className="w-full"
              >
                이 템플릿 사용하기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}