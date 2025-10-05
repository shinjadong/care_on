import { Suspense } from "react";
import { getPageBySlug } from "@/lib/api/pages";
import { Block } from "@/types/page-builder";
import { LandingEditClient } from "./client";

// 동적 렌더링 강제 (Supabase cookies 사용)
export const dynamic = 'force-dynamic';

// 서버사이드 렌더링으로 성능 최적화
export default async function LandingEditPage() {
  let initialBlocks: Block[] = [];

  try {
    const pageData = await getPageBySlug('landing');
    if (pageData && pageData.blocks && pageData.blocks.length > 0) {
      // 서버에서 미리 블록 데이터 처리
      initialBlocks = pageData.blocks.filter((block: any) => {
        return block.id && block.type && block.content;
      });
    }
  } catch (error) {
    console.error('서버사이드 페이지 로드 실패:', error);
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen glass-container flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="glass-text-secondary">편집기를 준비하고 있습니다...</p>
        </div>
      </div>
    }>
      <LandingEditClient initialBlocks={initialBlocks} />
    </Suspense>
  );
}