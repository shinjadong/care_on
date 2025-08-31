'use client';

import { useState } from 'react';
import { Block } from '@/types/page-builder';

interface SpacerBlockRendererProps {
  block: Block;
  isEditing?: boolean;
  onUpdate?: (block: Block) => void;
}

export function SpacerBlockRenderer({ block, isEditing, onUpdate }: SpacerBlockRendererProps) {
  const [isEditingHeight, setIsEditingHeight] = useState(false);
  const [height, setHeight] = useState(block.content.height);

  const handleSave = () => {
    onUpdate?.({
      ...block,
      content: {
        height,
      },
    });
    setIsEditingHeight(false);
  };

  if (isEditing && isEditingHeight) {
    return (
      <div className="space-y-2 p-4 border rounded">
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
    <div
      className={`${isEditing ? 'cursor-pointer hover:bg-gray-100 border-dashed border-2 border-gray-300' : ''}`}
      style={{ height: `${block.content.height}px` }}
      onClick={() => isEditing && setIsEditingHeight(true)}
    >
      {isEditing && (
        <div className="flex items-center justify-center h-full text-gray-500 text-sm">
          공백 ({block.content.height}px)
        </div>
      )}
    </div>
  );
}