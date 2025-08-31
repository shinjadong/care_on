'use client';

import { Block } from '@/types/page-builder';
import { HeadingBlockRenderer } from './blocks/heading-block';
import { TextBlockRenderer } from './blocks/text-block';
import { ImageBlockRenderer } from './blocks/image-block';
import { VideoBlockRenderer } from './blocks/video-block';
import { ButtonBlockRenderer } from './blocks/button-block';
import { SpacerBlockRenderer } from './blocks/spacer-block';
import { HeroBlockRenderer } from './blocks/hero-block';
import { HtmlBlockRenderer } from './blocks/html-block';
import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react';

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

  const blockStyles: React.CSSProperties = {
    padding: block.settings?.padding ? 
      `${block.settings.padding.top || 0}px ${block.settings.padding.right || 0}px ${block.settings.padding.bottom || 0}px ${block.settings.padding.left || 0}px` : undefined,
    margin: block.settings?.margin ? 
      `${block.settings.margin.top || 0}px ${block.settings.margin.right || 0}px ${block.settings.margin.bottom || 0}px ${block.settings.margin.left || 0}px` : undefined,
    backgroundColor: block.settings?.backgroundColor,
    color: block.settings?.textColor,
    textAlign: block.settings?.alignment,
  };

  return (
    <div 
      className={`block-wrapper ${isEditing ? 'relative group' : ''} ${block.settings?.width === 'full' ? 'w-full' : block.settings?.width === 'wide' ? 'max-w-6xl mx-auto' : 'max-w-4xl mx-auto'}`}
      style={blockStyles}
    >
      {isEditing && (
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center space-x-1">
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
      )}
      {renderBlock(block)}
    </div>
  );
}