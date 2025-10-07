"use client"

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

// 상태 정의
interface BlogGeneratorState {
  videoId: string;
  isLoading: boolean;
  isGenerating: boolean;
  error: string | null;
  blogContent: BlogContent | null;
  previewMode: boolean;
  blogType: string;
  format: "markdown" | "html";
}

// 블로그 콘텐츠 인터페이스
export interface BlogContent {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  title?: string;
  content?: string;
  format?: 'markdown' | 'html';
  seoKeywords?: string[];
  metaDescription?: string;
  error?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 액션 타입 정의
type BlogGeneratorAction =
  | { type: 'SET_VIDEO_ID'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_GENERATING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_BLOG_CONTENT'; payload: BlogContent | null }
  | { type: 'SET_PREVIEW_MODE'; payload: boolean }
  | { type: 'SET_BLOG_TYPE'; payload: string }
  | { type: 'SET_FORMAT'; payload: "markdown" | "html" }
  | { type: 'RESET_STATE' };

// 초기 상태
const initialState: BlogGeneratorState = {
  videoId: '',
  isLoading: false,
  isGenerating: false,
  error: null,
  blogContent: null,
  previewMode: false,
  blogType: 'standard',
  format: 'markdown',
};

// 리듀서 함수
function blogGeneratorReducer(state: BlogGeneratorState, action: BlogGeneratorAction): BlogGeneratorState {
  switch (action.type) {
    case 'SET_VIDEO_ID':
      return { ...state, videoId: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_GENERATING':
      return { ...state, isGenerating: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_BLOG_CONTENT':
      return { ...state, blogContent: action.payload };
    case 'SET_PREVIEW_MODE':
      return { ...state, previewMode: action.payload };
    case 'SET_BLOG_TYPE':
      return { ...state, blogType: action.payload };
    case 'SET_FORMAT':
      return { ...state, format: action.payload };
    case 'RESET_STATE':
      return { ...initialState, videoId: state.videoId };
    default:
      return state;
  }
}

// 컨텍스트 생성
interface BlogGeneratorContextType {
  state: BlogGeneratorState;
  dispatch: React.Dispatch<BlogGeneratorAction>;
  generateBlog: (options?: { blogType?: string; format?: "markdown" | "html" }) => Promise<void>;
  fetchBlogContent: () => Promise<void>;
  resetState: () => void;
}

const BlogGeneratorContext = createContext<BlogGeneratorContextType | undefined>(undefined);

// 컨텍스트 프로바이더 컴포넌트
export function BlogGeneratorProvider({ children, videoId }: { children: ReactNode; videoId: string }) {
  const [state, dispatch] = useReducer(blogGeneratorReducer, {
    ...initialState,
    videoId,
  });
  const { toast } = useToast();

  // 블로그 생성 함수
  const generateBlog = async (options?: { blogType?: string; format?: "markdown" | "html" }) => {
    try {
      dispatch({ type: 'SET_GENERATING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      // 옵션 설정
      if (options?.blogType) {
        dispatch({ type: 'SET_BLOG_TYPE', payload: options.blogType });
      }
      
      if (options?.format) {
        dispatch({ type: 'SET_FORMAT', payload: options.format });
      }
      
      // API 호출
      const response = await axios.post('/api/generate-blog', {
        videoId: state.videoId,
        blogType: options?.blogType || state.blogType,
        format: options?.format || state.format,
      });
      
      if (response.data.status === 'success') {
        dispatch({ type: 'SET_BLOG_CONTENT', payload: response.data.data.blogContent });
        toast({
          title: "블로그 생성 완료",
          description: "블로그 글이 성공적으로 생성되었습니다.",
        });
      } else {
        throw new Error(response.data.message || "블로그 생성에 실패했습니다.");
      }
    } catch (error: any) {
      console.error("블로그 생성 오류:", error);
      dispatch({ type: 'SET_ERROR', payload: error.message || "블로그 생성 중 오류가 발생했습니다." });
      toast({
        title: "블로그 생성 실패",
        description: error.message || "블로그 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      dispatch({ type: 'SET_GENERATING', payload: false });
    }
  };

  // 블로그 콘텐츠 조회 함수
  const fetchBlogContent = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      // API 호출
      const response = await axios.get(`/api/generate-blog?videoId=${state.videoId}`);
      
      if (response.data.status === 'success') {
        dispatch({ type: 'SET_BLOG_CONTENT', payload: response.data.data.blogContent });
      } else {
        throw new Error(response.data.message || "블로그 콘텐츠 조회에 실패했습니다.");
      }
    } catch (error: any) {
      console.error("블로그 콘텐츠 조회 오류:", error);
      
      // 404 오류는 블로그가 아직 생성되지 않은 것이므로 에러 메시지를 표시하지 않음
      if (error.response && error.response.status === 404) {
        dispatch({ type: 'SET_BLOG_CONTENT', payload: null });
      } else {
        dispatch({ type: 'SET_ERROR', payload: error.message || "블로그 콘텐츠 조회 중 오류가 발생했습니다." });
        toast({
          title: "블로그 콘텐츠 조회 실패",
          description: error.message || "블로그 콘텐츠 조회 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // 상태 초기화 함수
  const resetState = () => {
    dispatch({ type: 'RESET_STATE' });
  };

  return (
    <BlogGeneratorContext.Provider
      value={{
        state,
        dispatch,
        generateBlog,
        fetchBlogContent,
        resetState,
      }}
    >
      {children}
    </BlogGeneratorContext.Provider>
  );
}

// 커스텀 훅
export function useBlogGenerator() {
  const context = useContext(BlogGeneratorContext);
  if (context === undefined) {
    throw new Error("useBlogGenerator must be used within a BlogGeneratorProvider");
  }
  return context;
} 