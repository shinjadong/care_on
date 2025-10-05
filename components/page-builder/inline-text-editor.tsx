"use client"

import { useState, useEffect, useRef, useCallback } from 'react';
import { Block } from '@/types/page-builder';

interface InlineTextEditorProps {
  block: Block;
  onUpdate?: (block: Block) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function InlineTextEditor({
  block,
  onUpdate,
  placeholder = "텍스트를 입력하세요...",
  className = "",
  style = {}
}: InlineTextEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(block.content.text || '');
  const textRef = useRef<HTMLDivElement>(null);

  // 편집 시작
  const startEditing = useCallback(() => {
    setIsEditing(true);
    setContent(block.content.text || '');
  }, [block.content.text]);

  // 편집 저장
  const saveChanges = useCallback(() => {
    if (onUpdate && content !== block.content.text) {
      onUpdate({
        ...block,
        content: {
          ...block.content,
          text: content
        }
      });
    }
    setIsEditing(false);
  }, [block, content, onUpdate]);

  // 편집 취소
  const cancelEditing = useCallback(() => {
    setContent(block.content.text || '');
    setIsEditing(false);
  }, [block.content.text]);

  // 키보드 이벤트 처리
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveChanges();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEditing();
    }
  }, [saveChanges, cancelEditing]);

  // 편집 모드 시 포커스
  useEffect(() => {
    if (isEditing && textRef.current) {
      textRef.current.focus();

      // 텍스트 전체 선택
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(textRef.current);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <div
        ref={textRef}
        contentEditable
        suppressContentEditableWarning
        className={`outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-2 py-1 transition-all ${className}`}
        style={{
          ...style,
          minHeight: '1.5em',
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
          border: '1px solid rgba(59, 130, 246, 0.2)'
        }}
        onInput={(e) => setContent((e.target as HTMLDivElement).textContent || '')}
        onBlur={saveChanges}
        onKeyDown={handleKeyDown}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <div
      className={`cursor-text hover:bg-blue-50 hover:bg-opacity-50 rounded px-2 py-1 transition-all min-h-[1.5em] ${className}`}
      style={style}
      onDoubleClick={startEditing}
      title="더블클릭하여 편집"
    >
      {content || (
        <span className="text-gray-400 italic">
          {placeholder}
        </span>
      )}
    </div>
  );
}