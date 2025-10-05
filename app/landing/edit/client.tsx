'use client';

import { useState, useEffect } from "react";
import { PageBuilder } from "@/components/page-builder/page-builder";
import { PuckPageBuilder } from "@/components/page-builder/puck-page-builder";
import { Block } from "@/types/page-builder";
import { Button } from "@/components/ui/button";
import { Zap, Settings, ArrowRight } from "lucide-react";

interface LandingEditClientProps {
  initialBlocks: Block[];
}

export function LandingEditClient({ initialBlocks }: LandingEditClientProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [editorMode, setEditorMode] = useState<'classic' | 'puck' | 'select'>('select'); // 기본값을 선택 화면으로

  // 블록 저장 핸들러
  const handleSaveBlocks = async (updatedBlocks: Block[]) => {
    try {
      console.log('💾 블록 저장 시작:', updatedBlocks.length, '개');

      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: 'landing',
          title: '케어온 랜딩 페이지',
          blocks: updatedBlocks,
        }),
      });

      const result = await response.json();
      if (result.success) {
        console.log('✅ 페이지 저장 완료!');
        setBlocks(updatedBlocks);
        alert('✅ 페이지가 성공적으로 저장되었습니다!');
      } else {
        throw new Error(result.error || '저장 실패');
      }
    } catch (error) {
      console.error('❌ 저장 실패:', error);
      alert('❌ 저장에 실패했습니다: ' + error);
    }
  };

  return (
    <div className="min-h-screen relative">
      {editorMode === 'select' && (
        <div className="min-h-screen glass-container flex items-center justify-center p-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold glass-text-primary mb-6">
              랜딩 페이지 편집기
            </h1>
            <p className="text-xl glass-text-secondary mb-12">
              어떤 편집기를 사용하시겠어요?
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Puck 에디터 */}
              <div className="social-card p-8">
                <div className="mb-6">
                  <Zap className="w-16 h-16 mx-auto glass-text-primary mb-4" />
                  <h2 className="text-2xl font-bold glass-text-primary mb-3">
                    Puck 에디터
                  </h2>
                  <p className="glass-text-secondary mb-4">
                    직관적인 드래그앤드롭 편집
                  </p>
                  <ul className="text-sm glass-text-secondary space-y-2">
                    <li>• 실시간 미리보기</li>
                    <li>• 넓이-패딩 자동 연동</li>
                    <li>• 클릭 편집 지원</li>
                  </ul>
                </div>
                <Button
                  onClick={() => setEditorMode('puck')}
                  className="social-button w-full glass-bg-primary"
                >
                  Puck 에디터 시작
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>

              {/* 클래식 에디터 */}
              <div className="social-card p-8">
                <div className="mb-6">
                  <Settings className="w-16 h-16 mx-auto glass-text-primary mb-4" />
                  <h2 className="text-2xl font-bold glass-text-primary mb-3">
                    클래식 에디터
                  </h2>
                  <p className="glass-text-secondary mb-4">
                    세밀한 설정과 고급 기능
                  </p>
                  <ul className="text-sm glass-text-secondary space-y-2">
                    <li>• 코드 레벨 편집</li>
                    <li>• 고급 설정 옵션</li>
                    <li>• 템플릿 갤러리</li>
                  </ul>
                </div>
                <Button
                  onClick={() => setEditorMode('classic')}
                  className="social-button w-full glass-bg-secondary"
                >
                  클래식 에디터 시작
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>

            <div className="mt-12">
              <Button
                onClick={() => window.history.back()}
                className="social-button glass-text-secondary"
              >
                ← 돌아가기
              </Button>
            </div>
          </div>
        </div>
      )}

      {editorMode === 'puck' && (
        <PuckPageBuilder
          initialBlocks={blocks}
          onSave={handleSaveBlocks}
          onBack={() => setEditorMode('select')}
        />
      )}

      {editorMode === 'classic' && (
        <PageBuilder
          initialBlocks={blocks}
          onSave={handleSaveBlocks}
          onBack={() => setEditorMode('select')}
        />
      )}
    </div>
  );
}