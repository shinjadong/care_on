"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

interface BlogGeneratorLoadingProps {
  isGenerating: boolean;
}

export function BlogGeneratorLoading({ isGenerating }: BlogGeneratorLoadingProps) {
  const [progress, setProgress] = useState(0);
  
  // 로딩 진행 상태 시뮬레이션
  useEffect(() => {
    if (isGenerating) {
      // 초기 진행률 설정
      setProgress(10);
      
      // 단계별 진행률 업데이트
      const timer1 = setTimeout(() => setProgress(30), 2000);
      const timer2 = setTimeout(() => setProgress(50), 5000);
      const timer3 = setTimeout(() => setProgress(70), 8000);
      const timer4 = setTimeout(() => setProgress(90), 12000);
      
      // 클린업 함수
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    } else {
      // 데이터 로딩 중인 경우 빠르게 진행
      setProgress(30);
      const timer = setTimeout(() => setProgress(90), 1000);
      return () => clearTimeout(timer);
    }
  }, [isGenerating]);
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <h3 className="text-lg font-medium mb-2">
            {isGenerating ? "블로그 글 생성 중..." : "블로그 데이터 로딩 중..."}
          </h3>
          <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
            {isGenerating
              ? "AI가 유튜브 영상 내용을 분석하여 고품질 블로그 글을 생성하고 있습니다. 이 작업은 최대 1분 정도 소요될 수 있습니다."
              : "블로그 데이터를 불러오고 있습니다. 잠시만 기다려주세요."}
          </p>
          
          <div className="w-full max-w-md">
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            {isGenerating ? (
              <div className="space-y-2">
                {progress < 30 && <p>✓ 영상 데이터 분석 중...</p>}
                {progress >= 30 && <p>✓ 영상 데이터 분석 완료</p>}
                
                {progress < 50 && progress >= 30 && <p>✓ 블로그 구조 생성 중...</p>}
                {progress >= 50 && <p>✓ 블로그 구조 생성 완료</p>}
                
                {progress < 70 && progress >= 50 && <p>✓ 콘텐츠 작성 중...</p>}
                {progress >= 70 && <p>✓ 콘텐츠 작성 완료</p>}
                
                {progress < 90 && progress >= 70 && <p>✓ SEO 최적화 중...</p>}
                {progress >= 90 && <p>✓ SEO 최적화 완료</p>}
              </div>
            ) : (
              <p>데이터 로딩 중...</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 