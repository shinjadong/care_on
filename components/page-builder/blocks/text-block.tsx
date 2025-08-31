'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Block } from '@/types/page-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Type, Settings, X, Eye, Edit3 } from 'lucide-react';

interface TextBlockRendererProps {
  block: Block;
  isEditing?: boolean;
  onUpdate?: (block: Block) => void;
}

export function TextBlockRenderer({ block, isEditing, onUpdate }: TextBlockRendererProps) {
  const [isEditingText, setIsEditingText] = useState(false);
  const [textData, setTextData] = useState(block.content);
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSave = useCallback(() => {
    if (!textData.text.trim()) {
      return;
    }

    onUpdate?.({
      ...block,
      content: textData,
    });
    setIsEditingText(false);
  }, [block, textData, onUpdate]);

  const resetToDefault = () => {
    setTextData(block.content);
    setShowPreview(false);
  };

  // 자동 높이 조정
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [textData.text, isEditingText]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      
      setTextData({
        ...textData,
        text: value.substring(0, start) + '  ' + value.substring(end)
      });
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
    
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSave();
    }
  };

  if (isEditing && isEditingText) {
    return (
      <div className="space-y-4 p-4 border rounded-lg bg-gray-50 shadow-inner">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center">
            <Type className="w-5 h-5 mr-2" />
            텍스트 블록 편집
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              저장
            </button>
            <button
              onClick={() => {
                resetToDefault();
                setIsEditingText(false);
              }}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full"
              title="취소"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="flex-1 space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">텍스트 포맷</label>
              <select
                value={textData.format}
                onChange={(e) => setTextData({ ...textData, format: e.target.value as 'plain' | 'markdown' })}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="plain">일반 텍스트</option>
                <option value="markdown">마크다운</option>
              </select>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium">
                  {textData.format === 'markdown' ? '마크다운 소스' : '텍스트 내용'}
                </label>
                {textData.format === 'markdown' && (
                  <button
                    onClick={() => setShowPreview(true)}
                    className="text-sm text-blue-600 hover:underline flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-1" /> 미리보기
                  </button>
                )}
              </div>
              <textarea
                ref={textareaRef}
                value={textData.text}
                onChange={(e) => setTextData({ ...textData, text: e.target.value })}
                onKeyDown={handleKeyDown}
                className="w-full p-3 border rounded-md font-mono text-sm min-h-[200px] resize-none overflow-hidden"
                placeholder="여기에 내용을 입력하세요..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {textData.format === 'markdown' ? '마크다운 문법을 지원합니다. Tab 키로 들여쓰기, Cmd/Ctrl + Enter로 저장할 수 있습니다.' : '일반 텍스트입니다.'}
              </p>
            </div>
          </div>
          
          {showPreview && (
            <div className="flex-1">
              <div className="h-full">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold">미리보기</span>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    <Edit3 className="w-4 h-4 mr-1 inline" /> 편집기로 돌아가기
                  </button>
                </div>
                <div className="prose prose-sm max-w-none p-3 h-full overflow-y-auto rounded-md border bg-gray-50">
                  {textData.text.trim() ? (
                    textData.format === 'markdown' ? (
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                      >
                        {textData.text}
                      </ReactMarkdown>
                    ) : (
                      <div className="whitespace-pre-wrap">{textData.text}</div>
                    )
                  ) : (
                    <div className="text-gray-400">내용을 입력하면 여기에 미리보기가 표시됩니다.</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (!block.content.text.trim()) {
      return (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-lg text-center min-h-[100px]">
          <Type className="w-10 h-10 text-gray-400 mb-2" />
          <span className="text-gray-500 text-sm text-center">
            {isEditing ? '클릭하여 텍스트를 추가하세요' : '텍스트가 없습니다'}
          </span>
        </div>
      );
    }

    if (block.content.format === 'markdown') {
      return (
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              // 링크는 새 탭에서 열기
              a: ({ href, children, ...props }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                  {children}
                </a>
              ),
              // 이미지 최적화
              img: ({ src, alt, ...props }) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt={alt} className="max-w-full h-auto rounded-lg" {...props} />
              ),
            }}
          >
            {block.content.text}
          </ReactMarkdown>
        </div>
      );
    }
    
    return (
      <div className="whitespace-pre-wrap leading-relaxed">
        {block.content.text}
      </div>
    );
  };

  return (
    <div className="relative group">
      <div
        className={`${isEditing ? 'cursor-pointer hover:ring-2 hover:ring-blue-400 hover:ring-opacity-50 rounded-lg transition-all p-2' : ''}`}
        onClick={() => isEditing && setIsEditingText(true)}
      >
        {renderContent()}
      </div>

      {isEditing && block.content.text.trim() && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditingText(true);
            }}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 shadow-lg"
            title="텍스트 편집"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
