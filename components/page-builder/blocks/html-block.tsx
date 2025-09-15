'use client';

import { useState } from 'react';
import { Block } from '@/types/page-builder';
import { MessageSquare, Wand2, Save, X, Code, Sparkles } from 'lucide-react';

interface HtmlBlockRendererProps {
  block: Block;
  isEditing?: boolean;
  onUpdate?: (block: Block) => void;
}

export function HtmlBlockRenderer({ block, isEditing, onUpdate }: HtmlBlockRendererProps) {
  const [isEditingHTML, setIsEditingHTML] = useState(false);
  const [html, setHtml] = useState(block.content.html);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);

  const handleSave = () => {
    onUpdate?.({
      ...block,
      content: {
        html,
      },
    });
    setIsEditingHTML(false);
  };

  // Claude AI API로 HTML 코드 생성/수정
  const handleAiAssist = async () => {
    if (!aiPrompt.trim()) {
      alert('수정하고 싶은 내용을 입력해주세요.');
      return;
    }

    setIsAiLoading(true);
    try {
      // Claude API 호출
      const response = await fetch('/api/ai/html-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          currentHtml: html,
          context: 'HTML 블록 편집'
        })
      });

      const data = await response.json();
      if (data.success) {
        setHtml(data.html);
        setAiPrompt('');
      } else {
        alert('AI 도움 요청에 실패했습니다: ' + data.error);
      }
    } catch (error) {
      console.error('AI API 오류:', error);
      alert('AI 서비스에 일시적 문제가 발생했습니다.');
    } finally {
      setIsAiLoading(false);
    }
  };

  if (isEditing && isEditingHTML) {
    return (
      <div className="glass-card p-6 space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Code className="w-6 h-6 text-teal-600" />
            <h3 className="text-lg font-bold glass-text-primary">HTML 블록 편집</h3>
          </div>
          <button
            onClick={() => setShowAiChat(!showAiChat)}
            className={`social-button px-4 py-2 rounded-full ${showAiChat ? 'glass-bg-primary' : 'glass-bg-accent'}`}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI 도우미
          </button>
        </div>

        {/* Claude AI 도우미 */}
        {showAiChat && (
          <div className="glass-container-soft p-4 space-y-4">
            <div className="flex items-center space-x-2 mb-3">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <h4 className="font-medium text-purple-800">Claude AI와 대화하며 HTML 편집</h4>
            </div>

            <div className="space-y-3">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="예: 버튼을 더 크게 만들어줘, 색상을 파란색으로 변경해줘, 반응형으로 만들어줘..."
                className="w-full px-3 py-3 glass-input rounded-lg resize-none"
                rows={3}
              />

              <button
                onClick={handleAiAssist}
                disabled={isAiLoading || !aiPrompt.trim()}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  isAiLoading
                    ? 'glass-container glass-text-muted opacity-50'
                    : 'social-button glass-bg-primary glass-text-primary hover:scale-[1.02]'
                }`}
              >
                {isAiLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    <span>Claude가 작업 중...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Wand2 className="w-4 h-4" />
                    <span>Claude에게 요청하기</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        )}

        {/* HTML 코드 편집 */}
        <div>
          <label className="block text-sm font-medium glass-text-primary mb-3">HTML 코드</label>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            className="w-full px-4 py-3 glass-input font-mono text-sm leading-relaxed"
            rows={15}
            placeholder="<div>HTML 코드를 입력하세요...</div>"
          />
        </div>

        {/* 미리보기 */}
        <div>
          <label className="block text-sm font-medium glass-text-primary mb-3">미리보기</label>
          <div className="glass-container-soft p-4 rounded-lg min-h-[100px] border-2 border-dashed border-gray-300">
            <div dangerouslySetInnerHTML={{ __html: html || '<p class="text-gray-500">미리보기가 여기에 표시됩니다</p>' }} />
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 social-button glass-bg-primary py-3 rounded-lg font-bold"
          >
            <Save className="w-4 h-4 mr-2" />
            적용하기
          </button>
          <button
            onClick={() => {
              setHtml(block.content.html);
              setIsEditingHTML(false);
              setShowAiChat(false);
              setAiPrompt('');
            }}
            className="px-6 social-button glass-text-secondary py-3 rounded-lg"
          >
            <X className="w-4 h-4 mr-2" />
            취소
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${isEditing ? 'cursor-pointer hover:bg-gray-50 p-2 rounded border border-transparent hover:border-gray-200' : ''}`}
      onClick={() => isEditing && setIsEditingHTML(true)}
      dangerouslySetInnerHTML={{ __html: block.content.html }}
    />
  );
}