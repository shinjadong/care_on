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
import { ChevronUp, ChevronDown, Trash2, Settings, Maximize2, Zap } from 'lucide-react';
import { MotionWrapper, animationPresets } from './motion-wrapper';

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
  const [animationSettings, setAnimationSettings] = useState({
    type: block.settings?.animation?.type || 'none',
    duration: block.settings?.animation?.duration || 0.6,
    delay: block.settings?.animation?.delay || 0,
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
        animation: animationSettings,
      },
    });
    setShowSizeControls(false);
  };

  const getBlockStyles = (): React.CSSProperties => {
    const settings = block.settings || {};

    return {
      padding: `${customPadding.top}px ${customPadding.right}px ${customPadding.bottom}px ${customPadding.left}px`,
      backgroundColor: settings.backgroundColor,
      color: settings.textColor,
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

        {/* 애니메이션 설정 */}
        <div>
          <label className="block text-xs font-medium mb-2">애니메이션</label>
          <div className="space-y-2">
            <select
              value={animationSettings.type}
              onChange={(e) => setAnimationSettings(prev => ({...prev, type: e.target.value}))}
              className="w-full text-xs border rounded px-2 py-1"
            >
              <option value="none">애니메이션 없음</option>
              <option value="fadeIn">페이드 인</option>
              <option value="slideUp">위로 슬라이드</option>
              <option value="slideDown">아래로 슬라이드</option>
              <option value="slideLeft">좌로 슬라이드</option>
              <option value="slideRight">우로 슬라이드</option>
              <option value="scale">확대</option>
              <option value="bounce">바운스</option>
              <option value="rotate">회전</option>
            </select>
            
            {animationSettings.type !== 'none' && (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="3"
                  value={animationSettings.duration}
                  onChange={(e) => setAnimationSettings(prev => ({...prev, duration: parseFloat(e.target.value)}))}
                  className="text-xs border rounded px-2 py-1"
                  placeholder="지속시간(초)"
                />
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  value={animationSettings.delay}
                  onChange={(e) => setAnimationSettings(prev => ({...prev, delay: parseFloat(e.target.value)}))}
                  className="text-xs border rounded px-2 py-1"
                  placeholder="지연시간(초)"
                />
              </div>
            )}
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
      className={`block-wrapper relative group w-full ${isEditing ? 'border-2 border-dashed border-gray-300 hover:border-gray-400' : ''}`}
      style={{
        width: '100%',
        margin: 0,
        padding: isEditing ? '8px' : '0'
      }}
    >
      {isEditing && (
        <>
          {/* 애니메이션 퀵 버튼 - 상단 중앙 */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-15 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center space-x-1 bg-white rounded shadow-lg border">
              <button
                onClick={() => {
                  const nextAnimation = animationSettings.type === 'none' ? 'fadeIn' : 
                    animationSettings.type === 'fadeIn' ? 'slideUp' :
                    animationSettings.type === 'slideUp' ? 'scale' :
                    animationSettings.type === 'scale' ? 'bounce' : 'none';
                  
                  const newSettings = { ...animationSettings, type: nextAnimation };
                  setAnimationSettings(newSettings);
                  
                  // 즉시 적용
                  onUpdate?.({
                    ...block,
                    settings: {
                      ...block.settings,
                      animation: newSettings as any,
                    },
                  });
                }}
                className={`p-2 rounded transition-colors ${
                  animationSettings.type !== 'none' 
                    ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                    : 'bg-gray-400 text-white hover:bg-gray-500'
                }`}
                title={`애니메이션: ${animationSettings.type}`}
              >
                <Zap className="w-4 h-4" />
              </button>
            </div>
          </div>

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
      
      <MotionWrapper block={block} isEditing={isEditing}>
        <div
          className={`${isEditing ? 'min-h-[20px]' : ''} w-full`}
          style={{
            ...getBlockStyles(),
            display: 'flex',
            justifyContent:
              block.content?.imageAlign === 'left' ? 'flex-start' :
              block.content?.imageAlign === 'right' ? 'flex-end' : 'center',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <div
            style={{
              width: block.settings?.width ?
                (block.settings.width.includes('%') || block.settings.width.includes('px') ?
                  block.settings.width : `${block.settings.width}%`) : '100%',
              textAlign:
                block.content?.imageAlign === 'left' ? 'left' :
                block.content?.imageAlign === 'right' ? 'right' : 'center'
            }}
          >
            {renderBlock(block)}
          </div>
        </div>
      </MotionWrapper>
    </div>
  );
}