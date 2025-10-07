"use client"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2, Sparkles } from "lucide-react";
import { ImageUploader } from "./ImageUploader";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

interface KeywordBlogGeneratorProps {
  onBlogGenerated?: (content: string) => void;
}

export function KeywordBlogGenerator({ onBlogGenerated }: KeywordBlogGeneratorProps) {
  const [keyword, setKeyword] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageUpload = (url: string) => {
    setImageUrls(prev => [...prev, url]);
  };

  const handleImagesChange = (images: { url: string; preview: string }[]) => {
    setImageUrls(images.map(img => img.url));
  };

  const handleGenerate = async () => {
    if (!keyword.trim()) {
      toast({
        title: "키워드 입력 필요",
        description: "블로그 주제 키워드를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedContent(null);

    try {
      const response = await axios.post('/api/aiblog/generate', {
        keyword: keyword.trim(),
        imageUrls: imageUrls,
        model: 'gpt-4',
        temperature: 0.7
      }, {
        timeout: 120000 // 2분
      });

      if (response.data.success && response.data.data?.content) {
        const content = response.data.data.content;
        setGeneratedContent(content);

        if (onBlogGenerated) {
          onBlogGenerated(content);
        }

        toast({
          title: "생성 완료!",
          description: `"${response.data.data.title}" 블로그가 생성되었습니다.`
        });
      } else {
        throw new Error(response.data.error || '블로그 생성에 실패했습니다.');
      }
    } catch (err) {
      console.error('블로그 생성 오류:', err);
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : '블로그 생성 중 오류가 발생했습니다.';

      setError(errorMessage);
      toast({
        title: "생성 실패",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI 블로그 생성</CardTitle>
          <CardDescription>
            키워드와 이미지를 입력하면 AI가 SEO 최적화된 블로그를 자동으로 작성합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 키워드 입력 */}
          <div className="space-y-2">
            <Label htmlFor="keyword">블로그 주제 키워드 *</Label>
            <Input
              id="keyword"
              placeholder="예: 창업 성공 전략, 마케팅 노하우"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              disabled={isGenerating}
              maxLength={100}
            />
            <p className="text-xs text-gray-500">
              {keyword.length}/100
            </p>
          </div>

          {/* 이미지 업로드 */}
          <div className="space-y-2">
            <Label>이미지 업로드 (선택사항)</Label>
            <ImageUploader
              onImageUpload={handleImageUpload}
              onImagesChange={handleImagesChange}
            />
            <p className="text-xs text-gray-500">
              이미지를 업로드하면 AI가 이미지를 분석하여 블로그 내용에 자연스럽게 포함시킵니다.
            </p>
          </div>

          {/* 생성 버튼 */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !keyword.trim()}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                AI가 블로그를 작성 중입니다...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                블로그 생성하기
              </>
            )}
          </Button>

          {/* 에러 표시 */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>오류 발생</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* 생성 완료 메시지 */}
          {generatedContent && (
            <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertTitle>생성 완료!</AlertTitle>
              <AlertDescription>
                블로그가 성공적으로 생성되었습니다. 오른쪽 미리보기에서 확인하세요.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
