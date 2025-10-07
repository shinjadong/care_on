"use client";

import { useState, useRef, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import axios from 'axios';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import '@/styles/image-uploader.css';

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
  onImagesChange?: (images: { url: string; preview: string }[]) => void;
  className?: string;
}

const ImageUploader = ({ onImageUpload, onImagesChange, className = "" }: ImageUploaderProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<{ url: string; preview: string }[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  // 파일 선택 핸들러
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // 성공적으로 업로드된 이미지 수 추적
      let successCount = 0;
      const newUploadedImages: { url: string; preview: string }[] = [...uploadedImages];
      
      // 각 파일 업로드
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // 진행 상황 업데이트
        setUploadProgress(Math.round((i / files.length) * 100));
        
        try {
          // 미리보기 URL 생성
          const previewUrl = URL.createObjectURL(file);
          
          // FormData를 사용하여 서버에 직접 업로드
          const formData = new FormData();
          formData.append('file', file);
          
          const { data } = await axios.post('/api/aiblog/upload-image', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            timeout: 60000  // 30MB 이미지 업로드를 위해 60초로 증가
          });

          if (!data.success) {
            throw new Error(data.error || '이미지 업로드에 실패했습니다.');
          }

          // 업로드된 이미지 URL 저장
          const imageUrl = data.data.url;
          const newImage = { url: imageUrl, preview: previewUrl };
          newUploadedImages.push(newImage);
          onImageUpload(imageUrl);
          successCount++;
        } catch (uploadError) {
          console.error(`파일 ${file.name} 업로드 오류:`, uploadError);
          toast({
            title: `파일 ${file.name} 업로드 실패`,
            description: uploadError instanceof Error ? uploadError.message : '알 수 없는 오류가 발생했습니다.',
            variant: "destructive",
          });
        }
      }
      
      setUploadProgress(100);
      setUploadedImages(newUploadedImages);
      
      // 부모 컴포넌트에 이미지 변경 알림
      if (onImagesChange) {
        onImagesChange(newUploadedImages);
      }
      
      if (successCount > 0) {
        toast({
          title: "이미지 업로드 성공",
          description: `${successCount}개의 이미지가 성공적으로 업로드되었습니다.`,
        });
      }
      
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      toast({
        title: "이미지 업로드 실패",
        description: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // 이미지 제거 핸들러
  const removeImage = (index: number) => {
    const newUploadedImages = [...uploadedImages];
    
    // 미리보기 URL 해제
    URL.revokeObjectURL(uploadedImages[index].preview);
    
    // 배열에서 제거
    newUploadedImages.splice(index, 1);
    setUploadedImages(newUploadedImages);
    
    // 부모 컴포넌트에 이미지 변경 알림
    if (onImagesChange) {
      onImagesChange(newUploadedImages);
    }
  };

  // 파일 선택 창 열기
  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            type="button" 
            onClick={openFileSelector}
            disabled={isUploading}
            variant="outline"
            className="flex items-center gap-2"
            aria-label="이미지 업로드"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>업로드 중...</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                <span>이미지 업로드</span>
              </>
            )}
          </Button>
          <label htmlFor="image-upload" className="sr-only">이미지 파일 선택</label>
          <input
            id="image-upload"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
          />
        </div>
        
        {uploadedImages.length > 0 && (
          <Badge variant="outline" className="ml-2">
            {uploadedImages.length}개의 이미지
          </Badge>
        )}
      </div>

      {/* 업로드 진행 상태 표시 */}
      {isUploading && (
        <div className="w-full mt-2">
          <div className="progress-bar">
            <div 
              className={`progress-bar-fill progress-bar-fill-${Math.round(uploadProgress / 10) * 10}`}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {uploadProgress}% 완료
          </p>
        </div>
      )}

      {/* 업로드된 이미지 미리보기 */}
      {uploadedImages.length > 0 && (
        <div className="image-preview-container gap-4 mt-4">
          {uploadedImages.map((image, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-2">
                <div className="relative aspect-square">
                  <Image
                    src={image.preview}
                    alt={`업로드된 이미지 ${index + 1}`}
                    fill
                    className="object-cover rounded"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 rounded-full"
                    onClick={() => removeImage(index)}
                    aria-label={`이미지 ${index + 1} 삭제`}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 이미지가 없을 때 안내 */}
      {uploadedImages.length === 0 && (
        <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              블로그에 포함할 이미지를 업로드하세요
            </p>
            <p className="text-xs text-gray-400 mt-1">
              PNG, JPG, GIF 파일 지원
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export { ImageUploader };