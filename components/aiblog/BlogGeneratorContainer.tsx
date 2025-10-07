"use client"

import { useEffect, useState } from "react";
import { BlogGeneratorProvider, useBlogGenerator } from "./BlogGeneratorContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2, Copy, ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { TogetherBlogGenerator } from "./TogetherBlogGenerator";
import { TypingAnimation } from "@/components/ui/TypingAnimation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface BlogGeneratorContainerProps {
  videoId: string;
}

// 컨테이너의 내부 구현
function BlogGeneratorContainerInner() {
  const { state, fetchBlogContent } = useBlogGenerator();
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  // 컴포넌트 마운트 시 블로그 콘텐츠 조회
  useEffect(() => {
    if (state.videoId) {
      fetchBlogContent();
    }
  }, [state.videoId, fetchBlogContent]);
  
  // 콘텐츠 복사 핸들러
  const handleCopy = () => {
    if (state.blogContent?.content) {
      navigator.clipboard.writeText(state.blogContent.content);
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
  
  // 로딩 중이거나 생성 중인 경우
  if (state.isLoading || state.isGenerating) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {state.isGenerating ? "블로그 글 생성 중..." : "블로그 데이터 로딩 중..."}
            </h3>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // 에러가 있는 경우
  if (state.error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>오류 발생</AlertTitle>
        <AlertDescription>{state.error}</AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 왼쪽: 생성 폼 */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>블로그 생성</CardTitle>
            <CardDescription>
              키워드를 입력하여 블로그 콘텐츠를 생성하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TogetherBlogGenerator 
              initialTitle={state.videoId}
              compact={true}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* 오른쪽: 미리보기 */}
      <div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
            <div>
              <CardTitle>미리보기</CardTitle>
              <CardDescription>
                생성된 블로그 콘텐츠 미리보기
              </CardDescription>
            </div>
            {state.blogContent && state.blogContent.status === 'completed' && (
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleFeedback('like')}
                  className="flex items-center"
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  좋아요
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleFeedback('dislike')}
                  className="flex items-center"
                >
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  별로예요
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopy}
                  className="flex items-center"
                >
                  {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copied ? '복사됨' : '복사'}
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="p-6 min-h-[500px] max-h-[700px] overflow-auto">
            {state.blogContent && state.blogContent.status === 'completed' ? (
              <div className="prose max-w-none dark:prose-invert">
                <h1 className="text-2xl font-bold mb-4">{state.blogContent.title || "블로그 제목"}</h1>
                <div dangerouslySetInnerHTML={{ __html: state.blogContent.content || "" }} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <p>블로그를 생성하면 여기에 미리보기가 표시됩니다.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// 컨테이너 컴포넌트
export function BlogGeneratorContainer({ videoId }: BlogGeneratorContainerProps) {
  return (
    <BlogGeneratorProvider videoId={videoId}>
      <BlogGeneratorContainerInner />
    </BlogGeneratorProvider>
  );
} 