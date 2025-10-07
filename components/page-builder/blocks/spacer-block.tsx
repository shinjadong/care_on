'use client';

import { useState, useRef, useCallback } from 'react';
import { Block } from '@/types/page-builder';

interface SpacerBlockRendererProps {
  block: Block;
  isEditing?: boolean;
  onUpdate?: (block: Block) => void;
}

export function SpacerBlockRenderer({ block, isEditing, onUpdate }: SpacerBlockRendererProps) {
  const [isEditingHeight, setIsEditingHeight] = useState(false);
  const [height, setHeight] = useState(block.content.height);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const startHeight = useRef(0);

  const handleSave = () => {
    onUpdate?.({
      ...block,
      content: {
        height,
      },
    });
    setIsEditingHeight(false);
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isEditing) return;
    e.preventDefault();
    setIsDragging(true);
    startY.current = e.clientY;
    startHeight.current = height;
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [height, isEditing]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaY = e.clientY - startY.current;
    const newHeight = Math.max(10, Math.min(500, startHeight.current + deltaY));
    setHeight(newHeight);
    
    // 실시간 업데이트
    onUpdate?.({
      ...block,
      content: {
        height: newHeight,
      },
    });
  }, [isDragging, block, onUpdate]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  if (isEditing && isEditingHeight) {
    return (
      <div className="space-y-2 p-4 border rounded bg-white">
        <div>
          <label className="block text-sm font-medium mb-2">높이 (px)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border rounded"
            min="0"
            max="500"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            저장
          </button>
          <button
            onClick={() => {
              setHeight(block.content.height);
              setIsEditingHeight(false);
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            취소
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Spacer Body */}
      <div
        className={`transition-colors relative ${isEditing ? 'cursor-pointer hover:bg-gray-100 border-dashed border-2 border-gray-300 min-h-[20px]' : ''}`}
        style={{ height: `${height}px` }}
        onClick={() => isEditing && setIsEditingHeight(true)}
      >
        {isEditing && (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm select-none">
            <div className="text-center">
              <div className="text-lg">📏</div>
              <div>공백 ({height}px)</div>
              <div className="text-xs text-gray-400 mt-1">클릭하여 편집 또는 아래 핸들을 드래그</div>
            </div>
          </div>
        )}
      </div>

      {/* Resize Handle */}
      {isEditing && (
        <div 
          className={`absolute left-1/2 -translate-x-1/2 -bottom-1 w-20 h-2 bg-blue-500 rounded-full cursor-row-resize hover:bg-blue-600 transition-colors opacity-60 hover:opacity-100 ${isDragging ? 'opacity-100 bg-blue-600' : ''}`}
          onMouseDown={handleMouseDown}
          title="드래그하여 높이 조절"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-xs font-bold">
            ⋮⋮
          </div>
        </div>
      )}

      {/* Dragging Indicator */}
      {isDragging && (
        <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs z-10">
          {height}px
        </div>
      )}
    </div>
  );
}
