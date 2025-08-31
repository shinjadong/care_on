'use client';

import { useState, useEffect } from "react";
import { PageBuilder } from "@/components/page-builder/page-builder";
import { Block } from "@/types/page-builder";

// 관리자용 랜딩 페이지 편집기
export default function LandingEditPage() {
  const [initialBlocks, setInitialBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 컴포넌트 마운트 시 기존 페이지 데이터 불러오기
  useEffect(() => {
    const loadPageData = async () => {
      try {
        const response = await fetch('/api/pages/landing');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data && result.data.blocks && result.data.blocks.length > 0) {
            console.log('✅ 서버에서 페이지 데이터 불러오기 성공:', result.data.blocks.length, '개 블록');
            setInitialBlocks(result.data.blocks);
          } else {
            console.log('📝 서버에 페이지 데이터 없음, 빈 페이지로 시작');
            setInitialBlocks([]);
          }
        } else {
          console.log('❌ 페이지 데이터 조회 실패, 빈 페이지로 시작');
          setInitialBlocks([]);
        }
      } catch (error) {
        console.error('❌ 페이지 데이터 불러오기 중 오류:', error);
        setInitialBlocks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPageData();
  }, []);

  // 페이지 저장 핸들러
  const handleSave = async (blocks: Block[]) => {
    try {
      console.log('💾 페이지 저장 시작:', blocks.length, '개 블록');
      
      // API 엔드포인트 호출
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: 'landing',
          title: '케어온 랜딩 페이지',
          blocks: blocks,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ 서버 응답 에러:', errorText);
        throw new Error(`서버 오류: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ 서버 응답:', result);
      
      if (result.success) {
        // 저장 성공 메시지
        console.log('✅ 페이지 저장 완료:', blocks.length, '개 블록');
        alert('페이지가 성공적으로 저장되었습니다!');
      } else {
        throw new Error('저장 실패: ' + result.error);
      }
      
    } catch (error) {
      console.error('❌ 페이지 저장 실패:', error);
      alert('페이지 저장에 실패했습니다. 다시 시도해주세요.\n\n오류: ' + error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">페이지 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 편집자 헤더 - 모바일 최적화 */}
      <div className="bg-white border-b px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              <span className="hidden sm:inline">랜딩 페이지 편집기</span>
              <span className="sm:hidden">페이지 편집</span>
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Live
            </span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <a 
              href="/landing" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span className="hidden sm:inline">실제 페이지 보기</span>
              <span className="sm:hidden">미리보기</span>
            </a>
            <div className="text-xs sm:text-sm text-gray-500 hidden lg:block">
              편집 후 저장하면 실제 웹사이트에 바로 반영됩니다
            </div>
          </div>
        </div>
      </div>

      {/* 페이지 빌더 */}
      <PageBuilder initialBlocks={initialBlocks} onSave={handleSave} />
    </div>
  );
}