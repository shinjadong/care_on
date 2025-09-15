'use client';

import React, { useState, useEffect } from 'react';
import { InlineTextEditor } from '../inline-text-editor';
import { Block } from '@/types/page-builder';
import { Type, Settings, X, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface HeadingBlockRendererProps {
  block: Block;
  isEditing?: boolean;
  onUpdate?: (block: Block) => void;
}

export function HeadingBlockRenderer({ block, isEditing, onUpdate }: HeadingBlockRendererProps) {
  const [isEditingText, setIsEditingText] = useState(false);
  const [showTypography, setShowTypography] = useState(false);
  const [headingData, setHeadingData] = useState({
    text: block.content.text,
    level: block.content.level,
    fontSize: block.content.fontSize || 'default',
    color: block.content.color || '#000000',
    letterSpacing: block.content.letterSpacing || 'normal',
    lineHeight: block.content.lineHeight || 'normal',
    fontWeight: block.content.fontWeight || 'bold',
    textAlign: block.content.textAlign || 'left',
    fontFamily: block.content.fontFamily || 'default',
  });

  // 🔄 블록 내용이 변경될 때 상태 동기화
  useEffect(() => {
    setHeadingData({
      text: block.content.text,
      level: block.content.level,
      fontSize: block.content.fontSize || 'default',
      color: block.content.color || '#000000',
      letterSpacing: block.content.letterSpacing || 'normal',
      lineHeight: block.content.lineHeight || 'normal',
      fontWeight: block.content.fontWeight || 'bold',
      textAlign: block.content.textAlign || 'left',
      fontFamily: block.content.fontFamily || 'default',
    });
  }, [block.content]);

  const handleSave = () => {
    onUpdate?.({
      ...block,
      content: {
        ...headingData,
      },
    });
    setIsEditingText(false);
    setShowTypography(false);
  };

  const HeadingTag = `h${headingData.level}` as keyof React.JSX.IntrinsicElements;

  const getHeadingStyle = (): React.CSSProperties => {
    return {
      margin: 0,
      padding: 0,
      fontSize: headingData.fontSize === 'default' ? undefined : 
        headingData.fontSize.includes('px') ? headingData.fontSize : `${headingData.fontSize}px`,
      color: headingData.color,
      letterSpacing: headingData.letterSpacing === 'normal' ? 'normal' :
        headingData.letterSpacing.includes('px') ? headingData.letterSpacing : `${headingData.letterSpacing}px`,
      lineHeight: headingData.lineHeight === 'normal' ? 'normal' : headingData.lineHeight,
      fontWeight: headingData.fontWeight,
      textAlign: headingData.textAlign as any,
      fontFamily: headingData.fontFamily === 'default' ? undefined : headingData.fontFamily,
    };
  };

  if (isEditing && isEditingText) {
    return (
      <div className="space-y-4 p-6 border rounded-lg bg-white shadow-lg">
        {/* Text Input */}
        <div>
          <label className="block text-sm font-medium mb-2">제목 텍스트</label>
          <input
            type="text"
            value={headingData.text}
            onChange={(e) => setHeadingData(prev => ({ ...prev, text: e.target.value }))}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="제목을 입력하세요..."
          />
        </div>

        {/* Heading Level */}
        <div>
          <label className="block text-sm font-medium mb-2">제목 레벨</label>
          <select
            value={headingData.level}
            onChange={(e) => setHeadingData(prev => ({ ...prev, level: parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6 }))}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={1}>H1 - 가장 큰 제목</option>
            <option value={2}>H2 - 큰 제목</option>
            <option value={3}>H3 - 중간 제목</option>
            <option value={4}>H4 - 작은 제목</option>
            <option value={5}>H5 - 더 작은 제목</option>
            <option value={6}>H6 - 가장 작은 제목</option>
          </select>
        </div>

        {/* Typography Controls */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium flex items-center">
              <Type className="w-4 h-4 mr-2" />
              타이포그래피
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Font Size */}
            <div>
              <label className="block text-xs font-medium mb-1">폰트 크기</label>
              <select
                value={headingData.fontSize}
                onChange={(e) => setHeadingData(prev => ({ ...prev, fontSize: e.target.value }))}
                className="w-full text-sm border rounded px-2 py-1"
              >
                <option value="default">기본값</option>
                <option value="12">12px</option>
                <option value="14">14px</option>
                <option value="16">16px</option>
                <option value="18">18px</option>
                <option value="20">20px</option>
                <option value="24">24px</option>
                <option value="28">28px</option>
                <option value="32">32px</option>
                <option value="36">36px</option>
                <option value="48">48px</option>
                <option value="64">64px</option>
                <option value="custom">사용자정의</option>
              </select>
              {headingData.fontSize === 'custom' && (
                <input
                  type="text"
                  placeholder="예: 42px"
                  className="w-full text-sm border rounded px-2 py-1 mt-1"
                  onChange={(e) => setHeadingData(prev => ({ ...prev, fontSize: e.target.value }))}
                />
              )}
            </div>

            {/* Font Weight */}
            <div>
              <label className="block text-xs font-medium mb-1">폰트 굵기</label>
              <select
                value={headingData.fontWeight}
                onChange={(e) => setHeadingData(prev => ({ ...prev, fontWeight: e.target.value }))}
                className="w-full text-sm border rounded px-2 py-1"
              >
                <option value="100">100 - Thin</option>
                <option value="200">200 - Extra Light</option>
                <option value="300">300 - Light</option>
                <option value="400">400 - Regular</option>
                <option value="500">500 - Medium</option>
                <option value="600">600 - Semi Bold</option>
                <option value="700">700 - Bold</option>
                <option value="800">800 - Extra Bold</option>
                <option value="900">900 - Black</option>
              </select>
            </div>

            {/* Text Color */}
            <div>
              <label className="block text-xs font-medium mb-1">텍스트 색상</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={headingData.color}
                  onChange={(e) => setHeadingData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-10 h-8 border rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={headingData.color}
                  onChange={(e) => setHeadingData(prev => ({ ...prev, color: e.target.value }))}
                  className="flex-1 text-sm border rounded px-2 py-1"
                  placeholder="#000000"
                />
              </div>
            </div>

            {/* Text Alignment */}
            <div>
              <label className="block text-xs font-medium mb-1">정렬</label>
              <div className="flex space-x-1">
                {[
                  { value: 'left', icon: AlignLeft, label: '왼쪽' },
                  { value: 'center', icon: AlignCenter, label: '가운데' },
                  { value: 'right', icon: AlignRight, label: '오른쪽' },
                ].map(({ value, icon: Icon, label }) => (
                  <button
                    key={value}
                    onClick={() => setHeadingData(prev => ({ ...prev, textAlign: value }))}
                    className={`flex-1 p-2 rounded border text-sm ${
                      headingData.textAlign === value 
                        ? 'bg-blue-100 border-blue-500 text-blue-700' 
                        : 'bg-white border-gray-300 hover:bg-gray-50'
                    }`}
                    title={label}
                  >
                    <Icon className="w-4 h-4 mx-auto" />
                  </button>
                ))}
              </div>
            </div>

            {/* Letter Spacing */}
            <div>
              <label className="block text-xs font-medium mb-1">자간</label>
              <select
                value={headingData.letterSpacing}
                onChange={(e) => setHeadingData(prev => ({ ...prev, letterSpacing: e.target.value }))}
                className="w-full text-sm border rounded px-2 py-1"
              >
                <option value="normal">기본값</option>
                <option value="-2">-2px (좁게)</option>
                <option value="-1">-1px</option>
                <option value="0">0px</option>
                <option value="1">1px</option>
                <option value="2">2px</option>
                <option value="3">3px</option>
                <option value="4">4px (넓게)</option>
                <option value="custom">사용자정의</option>
              </select>
              {headingData.letterSpacing === 'custom' && (
                <input
                  type="text"
                  placeholder="예: 1.5px"
                  className="w-full text-sm border rounded px-2 py-1 mt-1"
                  onChange={(e) => setHeadingData(prev => ({ ...prev, letterSpacing: e.target.value }))}
                />
              )}
            </div>

            {/* Line Height */}
            <div>
              <label className="block text-xs font-medium mb-1">행간</label>
              <select
                value={headingData.lineHeight}
                onChange={(e) => setHeadingData(prev => ({ ...prev, lineHeight: e.target.value }))}
                className="w-full text-sm border rounded px-2 py-1"
              >
                <option value="normal">기본값</option>
                <option value="1">1.0 (좁게)</option>
                <option value="1.1">1.1</option>
                <option value="1.2">1.2</option>
                <option value="1.3">1.3</option>
                <option value="1.4">1.4</option>
                <option value="1.5">1.5 (보통)</option>
                <option value="1.6">1.6</option>
                <option value="1.8">1.8</option>
                <option value="2.0">2.0 (넓게)</option>
                <option value="custom">사용자정의</option>
              </select>
              {headingData.lineHeight === 'custom' && (
                <input
                  type="text"
                  placeholder="예: 1.75"
                  className="w-full text-sm border rounded px-2 py-1 mt-1"
                  onChange={(e) => setHeadingData(prev => ({ ...prev, lineHeight: e.target.value }))}
                />
              )}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="border rounded-lg p-4 bg-white">
          <label className="block text-sm font-medium mb-2">미리보기</label>
          <HeadingTag style={getHeadingStyle()}>
            {headingData.text || '제목을 입력하세요...'}
          </HeadingTag>
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
            onClick={() => {
              setHeadingData({
                text: block.content.text,
                level: block.content.level,
                fontSize: block.content.fontSize || 'default',
                color: block.content.color || '#000000',
                letterSpacing: block.content.letterSpacing || 'normal',
                lineHeight: block.content.lineHeight || 'normal',
                fontWeight: block.content.fontWeight || 'bold',
                textAlign: block.content.textAlign || 'left',
                fontFamily: block.content.fontFamily || 'default',
              });
              setIsEditingText(false);
              setShowTypography(false);
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
      {/* 편집 컨트롤 분산 배치 */}
      {isEditing && (
        <>
          {/* 타이포그래피 버튼 - 상단 좌측 */}
          <div className="absolute top-2 left-2 z-15 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center space-x-1 bg-white rounded shadow-lg border">
              <button
                onClick={() => setShowTypography(!showTypography)}
                className="p-2 rounded transition-colors bg-green-500 text-white hover:bg-green-600"
                title="타이포그래피 설정"
              >
                <Type className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 편집 기능 버튼 - 상단 우측 */}
          <div className="absolute top-2 right-2 z-15 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center space-x-1 bg-white rounded shadow-lg border">
              <button
                onClick={() => setIsEditingText(true)}
                className="p-2 rounded transition-colors bg-blue-500 text-white hover:bg-blue-600"
                title="텍스트 편집"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Typography Quick Panel */}
      {isEditing && showTypography && (
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
              {/* Quick Size */}
              <div>
                <label className="block text-xs font-medium mb-1">크기</label>
                <select
                  value={headingData.fontSize}
                  onChange={(e) => setHeadingData(prev => ({ ...prev, fontSize: e.target.value }))}
                  className="w-full text-xs border rounded px-2 py-1"
                >
                  <option value="default">기본</option>
                  <option value="16">16px</option>
                  <option value="20">20px</option>
                  <option value="24">24px</option>
                  <option value="32">32px</option>
                  <option value="48">48px</option>
                </select>
              </div>

              {/* Quick Color */}
              <div>
                <label className="block text-xs font-medium mb-1">색상</label>
                <input
                  type="color"
                  value={headingData.color}
                  onChange={(e) => setHeadingData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full h-8 border rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Quick Apply */}
            <button
              onClick={() => {
                onUpdate?.({
                  ...block,
                  content: headingData,
                });
                setShowTypography(false);
              }}
              className="w-full bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
            >
              즉시 적용
            </button>
          </div>
        </div>
      )}

      {/* Heading Display */}
      <HeadingTag
        className={`m-0 p-0 ${isEditing ? 'cursor-pointer hover:bg-gray-100 px-2 py-1 rounded group' : ''}`}
        onClick={() => isEditing && setIsEditingText(true)}
        style={getHeadingStyle()}
      >
        {headingData.text}
      </HeadingTag>
    </div>
  );
}