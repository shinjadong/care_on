'use client';

import React, { useState } from 'react';
import { Block } from '@/types/page-builder';

interface HeadingBlockRendererProps {
  block: Block;
  isEditing?: boolean;
  onUpdate?: (block: Block) => void;
}

export function HeadingBlockRenderer({ block, isEditing, onUpdate }: HeadingBlockRendererProps) {
  const [isEditingText, setIsEditingText] = useState(false);
  const [text, setText] = useState(block.content.text);

  const handleSave = () => {
    onUpdate?.({
      ...block,
      content: {
        ...block.content,
        text,
      },
    });
    setIsEditingText(false);
  };

  const HeadingTag = `h${block.content.level}` as keyof React.JSX.IntrinsicElements;

  if (isEditing && isEditingText) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 px-3 py-2 border rounded"
          autoFocus
        />
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          저장
        </button>
        <button
          onClick={() => {
            setText(block.content.text);
            setIsEditingText(false);
          }}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          취소
        </button>
      </div>
    );
  }

  return (
    <HeadingTag
      className={`${isEditing ? 'cursor-pointer hover:bg-gray-100 px-2 py-1 rounded' : ''}`}
      onClick={() => isEditing && setIsEditingText(true)}
    >
      {block.content.text}
    </HeadingTag>
  );
}