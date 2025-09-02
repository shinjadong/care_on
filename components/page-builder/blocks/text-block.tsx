'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Block } from '@/types/page-builder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Type, Settings, X, Eye, Edit3, AlignLeft, AlignCenter, AlignRight, Bold, Italic } from 'lucide-react';

interface TextBlockRendererProps {
  block: Block;
  isEditing?: boolean;
  onUpdate?: (block: Block) => void;
}

export function TextBlockRenderer({ block, isEditing, onUpdate }: TextBlockRendererProps) {
  const [isEditingText, setIsEditingText] = useState(false);
  const [showTypography, setShowTypography] = useState(false);
  const [textData, setTextData] = useState({
    text: block.content.text || '',
    format: block.content.format || 'plain',
    fontSize: block.content.fontSize || '16',
    color: block.content.color || '#000000',
    letterSpacing: block.content.letterSpacing || 'normal',
    lineHeight: block.content.lineHeight || '1.5',
    fontWeight: block.content.fontWeight || '400',
    textAlign: block.content.textAlign || 'left',
    fontFamily: block.content.fontFamily || 'default',
  });

  // 🔄 블록 내용이 변경될 때 상태 동기화
  useEffect(() => {
    setTextData({
      text: block.content.text || '',
      format: block.content.format || 'plain',
      fontSize: block.content.fontSize || '16',
      color: block.content.color || '#000000',
      letterSpacing: block.content.letterSpacing || 'normal',
      lineHeight: block.content.lineHeight || '1.5',
      fontWeight: block.content.fontWeight || '400',
      textAlign: block.content.textAlign || 'left',
      fontFamily: block.content.fontFamily || 'default',
    });
  }, [block.content]);
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
    setShowTypography(false);
  }, [block, textData, onUpdate]);

  const resetToDefault = () => {
    setTextData({
      text: block.content.text || '',
      format: block.content.format || 'plain',
      fontSize: block.content.fontSize || '16',
      color: block.content.color || '#000000',
      letterSpacing: block.content.letterSpacing || 'normal',
      lineHeight: block.content.lineHeight || '1.5',
      fontWeight: block.content.fontWeight || '400',
      textAlign: block.content.textAlign || 'left',
      fontFamily: block.content.fontFamily || 'default',
    });
    setShowPreview(false);
    setIsEditingText(false);
    setShowTypography(false);
  };

  const getTextStyle = (): React.CSSProperties => {
    return {
      fontSize: `${textData.fontSize}px`,
      color: textData.color,
      letterSpacing: textData.letterSpacing === 'normal' ? 'normal' : `${textData.letterSpacing}px`,
      lineHeight: textData.lineHeight,
      fontWeight: textData.fontWeight,
      textAlign: textData.textAlign as any,
      fontFamily: textData.fontFamily === 'default' ? undefined : textData.fontFamily,
      margin: 0,
      padding: 0,
    };
  };

  // 자동 높이 조정
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [textData.text]);

  if (isEditing && isEditingText) {
    return (
      <div className="space-y-4 p-6 border rounded-lg bg-white shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
          {/* Editor */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold">텍스트 편집</span>
                <select
                  value={textData.format}
                  onChange={(e) => setTextData(prev => ({ ...prev, format: e.target.value as 'plain' | 'markdown' }))}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="plain">일반 텍스트</option>
                  <option value="markdown">마크다운</option>
                </select>
              </div>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center text-sm text-blue-600 hover:underline"
              >
                {showPreview ? <Edit3 className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                {showPreview ? '편집' : '미리보기'}
              </button>
            </div>
            
            <textarea
              ref={textareaRef}
              value={textData.text}
              onChange={(e) => setTextData(prev => ({ ...prev, text: e.target.value }))}
              className="flex-1 w-full p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="텍스트를 입력하세요..."
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                  e.preventDefault();
                  handleSave();
                }
                if (e.key === 'Tab' && textData.format === 'markdown') {
                  e.preventDefault();
                  const target = e.target as HTMLTextAreaElement;
                  const start = target.selectionStart;
                  const end = target.selectionEnd;
                  const newText = textData.text.substring(0, start) + '  ' + textData.text.substring(end);
                  setTextData(prev => ({ ...prev, text: newText }));
                  setTimeout(() => {
                    target.setSelectionRange(start + 2, start + 2);
                  }, 0);
                }
              }}
            />
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                {textData.format === 'markdown' ? '마크다운 문법을 지원합니다. Tab 키로 들여쓰기, Cmd/Ctrl + Enter로 저장할 수 있습니다.' : '일반 텍스트입니다.'}
              </p>
            </div>
          </div>
          
          {/* Preview */}
          {showPreview && (
            <div className="flex-1">
              <div className="h-full">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold">미리보기</span>
                </div>
                <div className="prose prose-sm max-w-none p-3 h-full overflow-y-auto rounded-md border bg-gray-50" style={getTextStyle()}>
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

        {/* Typography Controls */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h4 className="font-medium mb-4 flex items-center">
            <Type className="w-4 h-4 mr-2" />
            타이포그래피
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Font Size */}
            <div>
              <label className="block text-xs font-medium mb-1">크기 (px)</label>
              <input
                type="number"
                value={textData.fontSize}
                onChange={(e) => setTextData(prev => ({ ...prev, fontSize: e.target.value }))}
                className="w-full text-sm border rounded px-2 py-1"
                min="8"
                max="72"
              />
            </div>

            {/* Text Color */}
            <div>
              <label className="block text-xs font-medium mb-1">색상</label>
              <input
                type="color"
                value={textData.color}
                onChange={(e) => setTextData(prev => ({ ...prev, color: e.target.value }))}
                className="w-full h-8 border rounded cursor-pointer"
              />
            </div>

            {/* Letter Spacing */}
            <div>
              <label className="block text-xs font-medium mb-1">자간 (px)</label>
              <input
                type="number"
                step="0.1"
                value={textData.letterSpacing === 'normal' ? 0 : textData.letterSpacing}
                onChange={(e) => setTextData(prev => ({ ...prev, letterSpacing: e.target.value }))}
                className="w-full text-sm border rounded px-2 py-1"
                min="-5"
                max="10"
              />
            </div>

            {/* Line Height */}
            <div>
              <label className="block text-xs font-medium mb-1">행간</label>
              <select
                value={textData.lineHeight}
                onChange={(e) => setTextData(prev => ({ ...prev, lineHeight: e.target.value }))}
                className="w-full text-sm border rounded px-2 py-1"
              >
                <option value="1.0">1.0 (좁게)</option>
                <option value="1.2">1.2</option>
                <option value="1.4">1.4</option>
                <option value="1.5">1.5 (보통)</option>
                <option value="1.6">1.6</option>
                <option value="1.8">1.8</option>
                <option value="2.0">2.0 (넓게)</option>
              </select>
            </div>

            {/* Font Weight */}
            <div>
              <label className="block text-xs font-medium mb-1">굵기</label>
              <select
                value={textData.fontWeight}
                onChange={(e) => setTextData(prev => ({ ...prev, fontWeight: e.target.value }))}
                className="w-full text-sm border rounded px-2 py-1"
              >
                <option value="100">100 (얇게)</option>
                <option value="300">300 (연하게)</option>
                <option value="400">400 (보통)</option>
                <option value="500">500 (중간)</option>
                <option value="600">600 (준굵게)</option>
                <option value="700">700 (굵게)</option>
                <option value="900">900 (매우굵게)</option>
              </select>
            </div>

            {/* Text Alignment */}
            <div>
              <label className="block text-xs font-medium mb-1">정렬</label>
              <div className="flex space-x-1">
                {[
                  { value: 'left', icon: AlignLeft },
                  { value: 'center', icon: AlignCenter },
                  { value: 'right', icon: AlignRight },
                ].map(({ value, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setTextData(prev => ({ ...prev, textAlign: value }))}
                    className={`flex-1 p-2 rounded border ${
                      textData.textAlign === value 
                        ? 'bg-blue-100 border-blue-500 text-blue-700' 
                        : 'bg-white border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 mx-auto" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="border rounded-lg p-4 bg-white">
          <label className="block text-sm font-medium mb-2">실시간 미리보기</label>
          <div className="min-h-[100px] p-4 border rounded bg-gray-50">
            {textData.format === 'markdown' ? (
              <div className="prose prose-lg max-w-none" style={getTextStyle()}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {textData.text || '텍스트를 입력하세요...'}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="whitespace-pre-wrap" style={getTextStyle()}>
                {textData.text || '텍스트를 입력하세요...'}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            저장
          </button>
          <button
            onClick={resetToDefault}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            취소
          </button>
        </div>
      </div>
    );
  }

  // Typography Quick Panel
  const TypographyQuickPanel = () => (
    <div className="absolute top-0 right-0 z-20 bg-white border rounded-lg shadow-lg p-4 min-w-[320px]" 
         onClick={e => e.stopPropagation()}>
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-sm flex items-center">
            <Type className="w-4 h-4 mr-2" />
            타이포그래피
          </h4>
          <button 
            onClick={() => setShowTypography(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">크기</label>
            <input
              type="number"
              value={textData.fontSize}
              onChange={(e) => setTextData(prev => ({ ...prev, fontSize: e.target.value }))}
              className="w-full text-xs border rounded px-2 py-1"
              min="8"
              max="72"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">색상</label>
            <input
              type="color"
              value={textData.color}
              onChange={(e) => setTextData(prev => ({ ...prev, color: e.target.value }))}
              className="w-full h-8 border rounded cursor-pointer"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">자간</label>
            <input
              type="number"
              step="0.1"
              value={textData.letterSpacing === 'normal' ? 0 : textData.letterSpacing}
              onChange={(e) => setTextData(prev => ({ ...prev, letterSpacing: e.target.value }))}
              className="w-full text-xs border rounded px-2 py-1"
              min="-2"
              max="5"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">행간</label>
            <select
              value={textData.lineHeight}
              onChange={(e) => setTextData(prev => ({ ...prev, lineHeight: e.target.value }))}
              className="w-full text-xs border rounded px-2 py-1"
            >
              <option value="1.0">1.0</option>
              <option value="1.2">1.2</option>
              <option value="1.4">1.4</option>
              <option value="1.5">1.5</option>
              <option value="1.6">1.6</option>
              <option value="1.8">1.8</option>
              <option value="2.0">2.0</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => {
            onUpdate?.({
              ...block,
              content: textData,
            });
            setShowTypography(false);
          }}
          className="w-full bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
        >
          즉시 적용
        </button>
      </div>
    </div>
  );

  // Quick Format Buttons
  const QuickFormatButtons = () => (
    <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="flex items-center space-x-1 bg-white/90 backdrop-blur rounded shadow border">
        <button
          onClick={() => setTextData(prev => ({ ...prev, fontWeight: prev.fontWeight === '700' ? '400' : '700' }))}
          className={`p-2 rounded transition-colors ${
            textData.fontWeight === '700' 
              ? 'bg-blue-500 text-white' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          title="굵게"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => setTextData(prev => ({ ...prev, fontStyle: prev.fontStyle === 'italic' ? 'normal' : 'italic' }))}
          className="p-2 rounded transition-colors text-gray-600 hover:bg-gray-100"
          title="기울임"
        >
          <Italic className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  if (!isEditing) {
    // Display mode
    if (textData.format === 'markdown') {
      return (
        <div className="prose prose-lg max-w-none m-0 p-0" style={{ margin: 0, padding: 0 }}>
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
                <img src={src} alt={alt} className="max-w-full h-auto rounded-lg" {...props} />
              ),
            }}
          >
            {textData.text}
          </ReactMarkdown>
        </div>
      );
    }
    
    return (
      <div className="whitespace-pre-wrap leading-relaxed m-0 p-0" style={{ margin: 0, padding: 0, ...getTextStyle() }}>
        {textData.text}
      </div>
    );
  };

  // Editing mode display
  return (
    <div className="relative group">
      {/* Quick Controls */}
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center space-x-1 bg-white rounded shadow-lg border">
          <button
            onClick={() => setShowTypography(!showTypography)}
            className="p-2 rounded transition-colors bg-green-500 text-white hover:bg-green-600"
            title="타이포그래피 설정"
          >
            <Type className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsEditingText(true)}
            className="p-2 rounded transition-colors bg-blue-500 text-white hover:bg-blue-600"
            title="텍스트 편집"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showTypography && <TypographyQuickPanel />}
      <QuickFormatButtons />

      {/* Text Display */}
      <div
        className="cursor-pointer hover:bg-gray-100 p-2 rounded min-h-[20px]"
        onClick={() => setIsEditingText(true)}
        style={getTextStyle()}
      >
        {textData.format === 'markdown' ? (
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {textData.text || '텍스트를 입력하세요...'}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="whitespace-pre-wrap">
            {textData.text || '텍스트를 입력하세요...'}
          </div>
        )}
      </div>
    </div>
  );
}