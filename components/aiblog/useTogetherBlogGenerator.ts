"use client"

import { useState, useCallback } from 'react';
import { generateExternalBlog, ExternalBlogResponse } from '@/lib/services/blogService';

/**
 * 자동 AI 블로그 생성 훅 반환 타입
 */
interface UseTogetherBlogGeneratorReturn {
  blogContent: string;
  isLoading: boolean;
  error: string | null;
  generateBlog: (title: string, keywords: string, blogType?: string) => Promise<void>;
  reset: () => void;
}

/**
 * 자동 AI 블로그 생성 API를 사용하는 React 훅
 * 
 * @returns 블로그 생성 관련 상태와 함수
 */
export function useTogetherBlogGenerator(): UseTogetherBlogGeneratorReturn {
  // 상태 관리
  const [blogContent, setBlogContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 블로그 생성 함수
   * 
   * @param title 블로그 제목 키워드
   * @param keywords 관련 키워드 (쉼표로 구분)
   * @param blogType 블로그 유형 (info-text, used-review, visit-review)
   */
  const generateBlog = useCallback(async (title: string, keywords: string, blogType: string = 'info-text') => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("API 호출 시작:", { title, keywords, blogType });
      
      // API 호출
      const response = await generateExternalBlog({
        title_keyword: title,
        keyword_related: keywords,
        promptType: blogType,
        typeId: blogType
      });
      
      console.log("API 응답:", response);
      
      // 응답 처리
      if (response.status === 'success') {
        setBlogContent(response.content);
      } else {
        throw new Error(response.message || '블로그 생성에 실패했습니다.');
      }
    } catch (err) {
      console.error('블로그 생성 오류:', err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 상태 초기화 함수
   */
  const reset = useCallback(() => {
    setBlogContent('');
    setError(null);
  }, []);

  return {
    blogContent,
    isLoading,
    error,
    generateBlog,
    reset
  };
}

export default useTogetherBlogGenerator; 