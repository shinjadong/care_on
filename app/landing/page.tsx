import React from "react";
import { BlockRenderer } from "@/components/page-builder/block-renderer";
import { getPageBySlug } from "@/lib/api/pages";
import Link from "next/link";

// 🚀 성능 최적화를 위한 캐시 설정
export const revalidate = 300; // 5분마다 갱신
export const dynamic = 'force-static'; // 정적 생성 강제

/**
 * 케어온 랜딩 페이지 - 페이지 빌더 기반
 */
export default async function LandingPage() {
  try {
    // 🔄 데이터베이스에서 페이지 데이터 조회
    const pageData = await getPageBySlug('landing');
    
    if (!pageData || !pageData.blocks || pageData.blocks.length === 0) {
      // 페이지 데이터가 없으면 편집 모드로 안내
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="mb-6">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              페이지를 생성해주세요
            </h1>
            <p className="text-gray-600 mb-6">
              아직 랜딩 페이지 콘텐츠가 없습니다.<br />
              페이지 편집기에서 콘텐츠를 추가해보세요.
            </p>
            <Link
              href="/landing/edit"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>페이지 편집하기</span>
            </Link>
          </div>
        </div>
      );
    }

    // 블록 데이터 검증
    const validBlocks = pageData.blocks.filter(block => {
      try {
        return block && block.id && block.type && block.content;
      } catch {
        return false;
      }
    });

    if (validBlocks.length === 0) {
      // 유효한 블록이 없으면 편집 모드로 안내
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="mb-6">
              <svg className="w-16 h-16 mx-auto text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              페이지 데이터에 문제가 있습니다
            </h1>
            <p className="text-gray-600 mb-6">
              저장된 데이터가 손상되었습니다.<br />
              편집기에서 새로 작성해주세요.
            </p>
            <Link
              href="/landing/edit"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>페이지 편집하기</span>
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-white w-full" style={{ width: '100%', margin: 0, padding: 0 }}>
        {/* 페이지 빌더로 생성된 블록들 렌더링 - 전체 너비 */}
        <div className="space-y-0 w-full" style={{ width: '100%', margin: 0, padding: 0 }}>
          {validBlocks.map((block) => (
            <BlockRenderer
              key={block.id}
              block={block}
              isEditing={false}
            />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('❌ Error loading landing page:', error);
    
    // 에러 발생 시 편집 모드로 안내
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-6">
            <svg className="w-16 h-16 mx-auto text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            페이지 로딩 오류
          </h1>
          <p className="text-gray-600 mb-6">
            페이지를 불러오는 중 문제가 발생했습니다.<br />
            페이지 편집기에서 새로 생성해보세요.
          </p>
          <Link
            href="/landing/edit"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>페이지 편집하기</span>
          </Link>
        </div>
      </div>
    );
  }
}