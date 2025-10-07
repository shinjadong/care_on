"use client"

import { useState } from "react";
import { useBlogGenerator } from "./BlogGeneratorContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, FileText } from "lucide-react";

export function BlogGeneratorForm() {
  const { state, generateBlog, resetState } = useBlogGenerator();
  const [blogType, setBlogType] = useState(state.blogType);
  const [format, setFormat] = useState<"markdown" | "html">(state.format);
  
  // 블로그 생성 핸들러
  const handleGenerateBlog = async () => {
    await generateBlog({
      blogType,
      format,
    });
  };
  
  // 재생성 핸들러
  const handleRegenerateBlog = async () => {
    resetState();
    await generateBlog({
      blogType,
      format,
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="blog-type">블로그 유형</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div 
                  className={`flex flex-col items-center justify-between rounded-md border-2 ${blogType === 'standard' ? 'border-primary' : 'border-muted'} bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer`}
                  onClick={() => setBlogType('standard')}
                >
                  <FileText className="mb-2 h-6 w-6" />
                  <span className="font-semibold">표준</span>
                  <span className="text-xs text-muted-foreground">
                    균형 잡힌 정보 제공 스타일
                  </span>
                </div>
                
                <div 
                  className={`flex flex-col items-center justify-between rounded-md border-2 ${blogType === 'seo' ? 'border-primary' : 'border-muted'} bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer`}
                  onClick={() => setBlogType('seo')}
                >
                  <FileText className="mb-2 h-6 w-6" />
                  <span className="font-semibold">SEO 최적화</span>
                  <span className="text-xs text-muted-foreground">
                    검색엔진 최적화에 중점
                  </span>
                </div>
                
                <div 
                  className={`flex flex-col items-center justify-between rounded-md border-2 ${blogType === 'storytelling' ? 'border-primary' : 'border-muted'} bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer`}
                  onClick={() => setBlogType('storytelling')}
                >
                  <FileText className="mb-2 h-6 w-6" />
                  <span className="font-semibold">스토리텔링</span>
                  <span className="text-xs text-muted-foreground">
                    감성적인 이야기 중심
                  </span>
                </div>
                
                <div 
                  className={`flex flex-col items-center justify-between rounded-md border-2 ${blogType === 'tutorial' ? 'border-primary' : 'border-muted'} bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer`}
                  onClick={() => setBlogType('tutorial')}
                >
                  <FileText className="mb-2 h-6 w-6" />
                  <span className="font-semibold">튜토리얼</span>
                  <span className="text-xs text-muted-foreground">
                    단계별 가이드 형식
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="format">출력 형식</Label>
              <Select
                value={format}
                onValueChange={(value) => setFormat(value as "markdown" | "html")}
              >
                <SelectTrigger id="format">
                  <SelectValue placeholder="출력 형식 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="markdown">마크다운</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-center">
        {state.blogContent && state.blogContent.status === 'completed' ? (
          <Button
            onClick={handleRegenerateBlog}
            disabled={state.isGenerating}
            className="w-full"
          >
            {state.isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                블로그 재생성 중...
              </>
            ) : (
              "블로그 재생성"
            )}
          </Button>
        ) : (
          <Button
            onClick={handleGenerateBlog}
            disabled={state.isGenerating}
            className="w-full"
          >
            {state.isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                블로그 생성 중...
              </>
            ) : (
              "블로그 생성"
            )}
          </Button>
        )}
      </div>
    </div>
  );
} 