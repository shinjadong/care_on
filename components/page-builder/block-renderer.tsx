'use client';

import { useState } from 'react';
import { Block } from '@/types/page-builder';
import { HeadingBlockRenderer } from './blocks/heading-block';
import { TextBlockRenderer } from './blocks/text-block';
import { ImageBlockRenderer } from './blocks/image-block';
import { VideoBlockRenderer } from './blocks/video-block';
import { ButtonBlockRenderer } from './blocks/button-block';
import { SpacerBlockRenderer } from './blocks/spacer-block';
import { HeroBlockRenderer } from './blocks/hero-block';
import { HtmlBlockRenderer } from './blocks/html-block';
import { ChevronUp, ChevronDown, Trash2, Settings, Maximize2 } from 'lucide-react';

interface BlockRendererProps {
  block: Block;
  isEditing?: boolean;
  onUpdate?: (block: Block) => void;
  onDelete?: (id: string) => void;
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

export function BlockRenderer({ 
  block, 
  isEditing = false, 
  onUpdate, 
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false
}: BlockRendererProps) {
  const [showSizeControls, setShowSizeControls] = useState(false);
  const [customWidth, setCustomWidth] = useState(block.settings?.width || '100');
  const [customHeight, setCustomHeight] = useState(block.settings?.height || 'auto');
  const [customPadding, setCustomPadding] = useState({
    top: block.settings?.padding?.top || 0,
    right: block.settings?.padding?.right || 0,
    bottom: block.settings?.padding?.bottom || 0,
    left: block.settings?.padding?.left || 0,
  });

  const renderBlock = (block: Block) => {
    switch (block.type) {
      case 'heading':
        return <HeadingBlockRenderer block={block} isEditing={isEditing} onUpdate={onUpdate} />;
      case 'text':
        return <TextBlockRenderer block={block} isEditing={isEditing} onUpdate={onUpdate} />;
      case 'image':
        return <ImageBlockRenderer block={block} isEditing={isEditing} onUpdate={onUpdate} />;
      case 'video':
        return <VideoBlockRenderer block={block} isEditing={isEditing} onUpdate={onUpdate} />;
      case 'button':
        return <ButtonBlockRenderer block={block} isEditing={isEditing} onUpdate={onUpdate} />;
      case 'spacer':
        return <SpacerBlockRenderer block={block} isEditing={isEditing} onUpdate={onUpdate} />;
      case 'hero':
        return <HeroBlockRenderer block={block} isEditing={isEditing} onUpdate={onUpdate} />;
      case 'html':
        return <HtmlBlockRenderer block={block} isEditing={isEditing} onUpdate={onUpdate} />;
      default:
        return <div>Unknown block type</div>;
    }
  };

  const handleSizeUpdate = () => {
    onUpdate?.({
      ...block,
      settings: {
        ...block.settings,
        width: customWidth,
        height: customHeight !== 'auto' ? customHeight : undefined,
        padding: customPadding,
      },
    });
    setShowSizeControls(false);
  };

  const getBlockStyles = (): React.CSSProperties => {
    const settings = block.settings || {};
    
    return {
      width: settings.width && settings.width !== '100' ? 
        (settings.width.includes('%') || settings.width.includes('px') ? settings.width : `${settings.width}%`) : 
        '100%',
      height: settings.height && settings.height !== 'auto' ? 
        (settings.height.includes('px') ? settings.height : `${settings.height}px`) : 
        'auto',
      padding: `${customPadding.top}px ${customPadding.right}px ${customPadding.bottom}px ${customPadding.left}px`,
      backgroundColor: settings.backgroundColor,
      color: settings.textColor,
      textAlign: settings.alignment as any,
    };
  };

  // 사이즈 컨트롤 패널
  const SizeControlsPanel = () => (
    <div className="absolute top-0 right-0 z-20 bg-white border rounded-lg shadow-lg p-4 min-w-[280px]" 
         onClick={e => e.stopPropagation()}>
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-sm">크기 및 간격 조정</h4>
          <button 
            onClick={() => setShowSizeControls(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* 너비 설정 */}
        <div>
          <label className="block text-xs font-medium mb-1">너비</label>
          <div className="flex gap-2">
            <select
              value={customWidth}
              onChange={(e) => setCustomWidth(e.target.value)}
              className="flex-1 text-xs border rounded px-2 py-1"
            >
              <option value="25">25%</option>
              <option value="50">50%</option>
              <option value="75">75%</option>
              <option value="100">100%</option>
              <option value="custom">사용자정의</option>
            </select>
            {customWidth === 'custom' && (
              <input
                type="text"
                placeholder="예: 300px"
                className="flex-1 text-xs border rounded px-2 py-1"
                onChange={(e) => setCustomWidth(e.target.value)}
              />
            )}
          </div>
        </div>

        {/* 높이 설정 */}
        <div>
          <label className="block text-xs font-medium mb-1">높이</label>
          <div className="flex gap-2">
            <select
              value={customHeight}
              onChange={(e) => setCustomHeight(e.target.value)}
              className="flex-1 text-xs border rounded px-2 py-1"
            >
              <option value="auto">자동</option>
              <option value="200">200px</option>
              <option value="300">300px</option>
              <option value="400">400px</option>
              <option value="500">500px</option>
              <option value="custom">사용자정의</option>
            </select>
            {customHeight === 'custom' && (
              <input
                type="text"
                placeholder="예: 250px"
                className="flex-1 text-xs border rounded px-2 py-1"
                onChange={(e) => setCustomHeight(e.target.value)}
              />
            )}
          </div>
        </div>

        {/* 패딩 설정 */}
        <div>
          <label className="block text-xs font-medium mb-2">패딩 (px)</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="상"
              value={customPadding.top}
              onChange={(e) => setCustomPadding(prev => ({...prev, top: parseInt(e.target.value) || 0}))}
              className="text-xs border rounded px-2 py-1"
            />
            <input
              type="number"
              placeholder="우"
              value={customPadding.right}
              onChange={(e) => setCustomPadding(prev => ({...prev, right: parseInt(e.target.value) || 0}))}
              className="text-xs border rounded px-2 py-1"
            />
            <input
              type="number"
              placeholder="하"
              value={customPadding.bottom}
              onChange={(e) => setCustomPadding(prev => ({...prev, bottom: parseInt(e.target.value) || 0}))}
              className="text-xs border rounded px-2 py-1"
            />
            <input
              type="number"
              placeholder="좌"
              value={customPadding.left}
              onChange={(e) => setCustomPadding(prev => ({...prev, left: parseInt(e.target.value) || 0}))}
              className="text-xs border rounded px-2 py-1"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={handleSizeUpdate}
            className="flex-1 bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
          >
            적용
          </button>
          <button
            onClick={() => setShowSizeControls(false)}
            className="flex-1 bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div 
      className={`block-wrapper relative group w-full ${isEditing ? 'border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 max-w-7xl mx-auto' : 'max-w-none'}`}
      style={{
        ...getBlockStyles(),
        width: isEditing ? getBlockStyles().width : '100%',
      }}
    >
      {isEditing && (
        <>
          {/* 레이아웃 컨트롤 버튼들 - 하단 우측 */}
          <div className="absolute bottom-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center space-x-1 bg-white rounded shadow-lg border">
              {/* 크기 조절 버튼 */}
              <button
                onClick={() => setShowSizeControls(!showSizeControls)}
                className="p-2 rounded transition-colors bg-purple-500 text-white hover:bg-purple-600"
                title="크기 조절"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              
              {/* 위로 이동 버튼 */}
              <button
                onClick={() => onMoveUp?.(block.id)}
                disabled={!canMoveUp}
                className={`p-2 rounded transition-colors ${
                  canMoveUp
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                title="위로 이동"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              
              {/* 아래로 이동 버튼 */}
              <button
                onClick={() => onMoveDown?.(block.id)}
                disabled={!canMoveDown}
                className={`p-2 rounded transition-colors ${
                  canMoveDown
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                title="아래로 이동"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {/* 삭제 버튼 */}
              <button
                onClick={() => onDelete?.(block.id)}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                title="삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 크기 조절 패널 */}
          {showSizeControls && <SizeControlsPanel />}

          {/* 드래그 핸들 - 중앙 좌측 */}
          <div className="absolute top-1/2 left-1 -translate-y-1/2 z-10 bg-gray-800 text-white p-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="cursor-move p-1" title="드래그하여 순서 변경">
              ⋮⋮
            </div>
          </div>
        </>
      )}
      
      <div className={isEditing ? 'min-h-[20px]' : ''}>
        {renderBlock(block)}
      </div>
    </div>
  );
}