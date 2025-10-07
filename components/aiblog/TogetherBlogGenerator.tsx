"use client"

import { useState } from 'react';
import { useTogetherBlogGenerator } from './useTogetherBlogGenerator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, FileText, Copy, ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

/**
 * 블로그 생성 컴포넌트 Props
 */
interface TogetherBlogGeneratorProps {
  initialTitle?: string;
  initialKeywords?: string;
  compact?: boolean; // 간결한 UI 모드 (미리보기 영역이 외부에 있는 경우)
}

/**
 * 자동AI 블로그 자동화 컴포넌트
 */
export function TogetherBlogGenerator({ 
  initialTitle = '', 
  initialKeywords = '',
  compact = false
}: TogetherBlogGeneratorProps) {
  // 상태 관리
  const [title, setTitle] = useState<string>(initialTitle);
  const [keywords, setKeywords] = useState<string>(initialKeywords);
  const [blogType, setBlogType] = useState<string>('info-text');
  const [copied, setCopied] = useState<boolean>(false);
  const { blogContent, isLoading, error, generateBlog, reset } = useTogetherBlogGenerator();
  const { toast } = useToast();

  // 블로그 생성 핸들러
  const handleGenerateBlog = async () => {
    if (!title.trim()) {
      toast({
        title: "제목 키워드를 입력해주세요",
        variant: "destructive",
      });
      return;
    }
    
    console.log("블로그 생성 시작:", { title, keywords, blogType });
    try {
      // 로딩 상태 표시
      toast({
        title: "블로그 생성 중...",
        description: "잠시만 기다려주세요.",
      });
      
      await generateBlog(title, keywords, blogType);
      console.log("블로그 생성 완료");
      
      // 성공 메시지
      if (!error) {
        toast({
          title: "블로그 생성 완료",
          description: "블로그가 성공적으로 생성되었습니다.",
        });
      }
    } catch (error) {
      console.error("블로그 생성 오류:", error);
      toast({
        title: "블로그 생성 실패",
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  // 폼 초기화 핸들러
  const handleReset = () => {
    setTitle('');
    setKeywords('');
    reset();
  };

  // 콘텐츠 복사 핸들러
  const handleCopy = () => {
    if (blogContent) {
      navigator.clipboard.writeText(blogContent);
      setCopied(true);
      toast({
        title: "복사 완료",
        description: "블로그 콘텐츠가 클립보드에 복사되었습니다.",
      });
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  // 피드백 핸들러
  const handleFeedback = (type: 'like' | 'dislike') => {
    toast({
      title: type === 'like' ? "좋아요" : "별로예요",
      description: "소중한 피드백 감사합니다.",
    });
  };

  // HTML 콘텐츠에서 텍스트만 추출하는 함수
  const extractTextFromHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '');
  };

  // 블로그 콘텐츠에서 모델의 생각 과정을 제거하고 최종 결과만 반환하는 함수
  const getCleanedContent = (content: string) => {
    if (!content) return '';
    
    // 모델의 생각 과정을 나타내는 패턴 제거
    let cleanedContent = content;
    
    // "생각 중..." 또는 "분석 중..." 등의 패턴 제거
    cleanedContent = cleanedContent.replace(/^(생각 중|분석 중|고민 중).*$/gm, '');
    
    // 중간 과정 제거 (예: "1. 먼저 ~ 2. 다음으로 ~" 형태의 생각 과정)
    cleanedContent = cleanedContent.replace(/^(단계|스텝|Step) \d+:.*$/gm, '');
    
    // 불필요한 빈 줄 제거
    cleanedContent = cleanedContent.replace(/\n{3,}/g, '\n\n');
    
    return cleanedContent.trim();
  };

  // 간결한 UI 모드 (미리보기 영역이 외부에 있는 경우)
  if (compact) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="blog-type">글 타입 선택<span className="text-red-500 ml-1">*</span></Label>
          <div className="flex flex-wrap gap-2 mt-2 p-2 bg-slate-50 dark:bg-slate-900 rounded-md">
            <div 
              className={`px-4 py-2 rounded-md cursor-pointer ${blogType === 'used-review' ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800'}`}
              onClick={() => setBlogType('used-review')}
            >
              제품 사용 후기
            </div>
            <div 
              className={`px-4 py-2 rounded-md cursor-pointer ${blogType === 'visit-review' ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800'}`}
              onClick={() => setBlogType('visit-review')}
            >
              방문 후기
            </div>
            <div 
              className={`px-4 py-2 rounded-md cursor-pointer ${blogType === 'info-text' ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800'}`}
              onClick={() => setBlogType('info-text')}
            >
              정보성 글
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex flex-col">
            <Label htmlFor="title">작성할 글 주제<span className="text-red-500 ml-1">*</span></Label>
            <p className="text-sm text-muted-foreground mb-2">문장보다 대표 키워드를 입력하면 글의 완성도가 높아져요.</p>
          </div>
          <Input
            id="title"
            placeholder="예: 광주 CCTV설치, 바로 여기에서"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
            className="bg-slate-50 dark:bg-slate-900"
          />
          <div className="text-right text-xs text-muted-foreground">
            {title.length}/100
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex flex-col">
            <Label htmlFor="keywords">연관 키워드<span className="text-red-500 ml-1">*</span></Label>
            <p className="text-sm text-muted-foreground mb-2">쉼표로 구분하여 입력하세요.</p>
          </div>
          <Input
            id="keywords"
            placeholder="예: CCTV설치, CCTV설치비용, 광주CCTV"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            disabled={isLoading}
            className="bg-slate-50 dark:bg-slate-900"
          />
          <div className="text-right text-xs text-muted-foreground">
            {keywords.length}/100
          </div>
        </div>
        
        <Button 
          onClick={handleGenerateBlog} 
          disabled={isLoading} 
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              생성 중...
            </>
          ) : (
            <div className="flex items-center justify-center">
              <span className="mr-2">블로그 생성하기</span>
              <FileText className="h-4 w-4" />
            </div>
          )}
        </Button>
        
        {error && (
          <Alert variant="destructive">
            <AlertTitle>오류 발생</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    );
  }

  // 기본 UI 모드 (전체 기능 포함)
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="blog-type">글 타입 선택<span className="text-red-500 ml-1">*</span></Label>
          <div className="flex flex-wrap gap-2 mt-2 p-2 bg-slate-50 dark:bg-slate-900 rounded-md">
            <div 
              className={`px-4 py-2 rounded-md cursor-pointer ${blogType === 'used-review' ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800'}`}
              onClick={() => setBlogType('used-review')}
            >
              제품 사용 후기
            </div>
            <div 
              className={`px-4 py-2 rounded-md cursor-pointer ${blogType === 'visit-review' ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800'}`}
              onClick={() => setBlogType('visit-review')}
            >
              방문 후기
            </div>
            <div 
              className={`px-4 py-2 rounded-md cursor-pointer ${blogType === 'info-text' ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800'}`}
              onClick={() => setBlogType('info-text')}
            >
              정보성 글
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex flex-col">
            <Label htmlFor="title">작성할 글 주제<span className="text-red-500 ml-1">*</span></Label>
            <p className="text-sm text-muted-foreground mb-2">문장보다 대표 키워드를 입력하면 글의 완성도가 높아져요.</p>
          </div>
          <Input
            id="title"
            placeholder="예: 광주 CCTV설치, 바로 여기에서"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
            className="bg-slate-50 dark:bg-slate-900"
          />
          <div className="text-right text-xs text-muted-foreground">
            {title.length}/100
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex flex-col">
            <Label htmlFor="keywords">연관 키워드<span className="text-red-500 ml-1">*</span></Label>
            <p className="text-sm text-muted-foreground mb-2">쉼표로 구분하여 입력하세요.</p>
          </div>
          <Input
            id="keywords"
            placeholder="예: CCTV설치, CCTV설치비용, 광주CCTV"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            disabled={isLoading}
            className="bg-slate-50 dark:bg-slate-900"
          />
          <div className="text-right text-xs text-muted-foreground">
            {keywords.length}/100
          </div>
        </div>
        
        <Button 
          onClick={handleGenerateBlog} 
          disabled={isLoading} 
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              생성 중...
            </>
          ) : (
            <div className="flex items-center justify-center">
              <span className="mr-2">블로그 생성하기</span>
              <FileText className="h-4 w-4" />
            </div>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>오류 발생</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <div className="py-10">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-center text-muted-foreground">
              블로그 콘텐츠를 생성하고 있어요...
            </p>
          </div>
        </div>
      )}

      {blogContent && !isLoading && (
        <div className="border rounded-lg overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <div className="space-y-1">
              <h3 className="text-lg font-medium">생성된 블로그</h3>
              <p className="text-sm text-muted-foreground">
                아래 내용을 복사하여 블로그에 붙여넣으세요.
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline" 
                size="sm" 
                onClick={handleCopy}
              >
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? '복사됨' : '복사'}
              </Button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="prose max-w-none dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: getCleanedContent(blogContent) }} />
            </div>
          </div>
          
          <div className="border-t p-4 flex justify-between">
            <Button 
              variant="outline" 
              onClick={handleReset}
            >
              새로 작성하기
            </Button>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => handleFeedback('like')}
                className="flex items-center"
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                좋아요
              </Button>
              <Button
                variant="outline"
                onClick={() => handleFeedback('dislike')}
                className="flex items-center"
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                별로예요
              </Button>
              <Button 
                onClick={handleCopy}
                variant="default"
              >
                {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                {copied ? '복사됨' : '내용 복사'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TogetherBlogGenerator; 
