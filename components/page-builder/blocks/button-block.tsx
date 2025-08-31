'use client';

import { useState } from 'react';
import { Block } from '@/types/page-builder';
import { Button } from '@/components/ui/button';

interface ButtonBlockRendererProps {
  block: Block;
  isEditing?: boolean;
  onUpdate?: (block: Block) => void;
}

export function ButtonBlockRenderer({ block, isEditing, onUpdate }: ButtonBlockRendererProps) {
  const [isEditingButton, setIsEditingButton] = useState(false);
  const [buttonData, setButtonData] = useState(block.content);

  const handleSave = () => {
    onUpdate?.({
      ...block,
      content: buttonData,
    });
    setIsEditingButton(false);
  };

  if (isEditing && isEditingButton) {
    return (
      <div className="space-y-4 p-4 border rounded">
        <div>
          <label className="block text-sm font-medium mb-2">버튼 텍스트</label>
          <input
            type="text"
            value={buttonData.text}
            onChange={(e) => setButtonData({ ...buttonData, text: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">링크 URL</label>
          <input
            type="text"
            value={buttonData.link}
            onChange={(e) => setButtonData({ ...buttonData, link: e.target.value })}
            placeholder="https://example.com"
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">스타일</label>
            <select
              value={buttonData.variant || 'default'}
              onChange={(e) => setButtonData({ ...buttonData, variant: e.target.value as 'default' | 'secondary' | 'outline' | 'ghost' })}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="default">Default (Primary)</option>
              <option value="secondary">Secondary</option>
              <option value="outline">Outline</option>
              <option value="ghost">Ghost</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">크기</label>
            <select
              value={buttonData.size || 'default'}
              onChange={(e) => setButtonData({ ...buttonData, size: e.target.value as 'default' | 'sm' | 'lg' })}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="sm">Small</option>
              <option value="default">Medium (Default)</option>
              <option value="lg">Large</option>
            </select>
          </div>
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
              setButtonData(block.content);
              setIsEditingButton(false);
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
      className={`${isEditing ? 'cursor-pointer hover:opacity-80' : ''}`}
      onClick={() => isEditing && setIsEditingButton(true)}
    >
      <Button
        variant={block.content.variant || 'default'}
        size={block.content.size || 'default'}
        onClick={() => !isEditing && window.open(block.content.link, '_blank')}
        className="pointer-events-none"
      >
        {block.content.text}
      </Button>
    </div>
  );
}