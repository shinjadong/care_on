'use client';

import { useState, useCallback } from 'react';
import { Block } from '@/types/page-builder';
import { Play, Settings, X, AlertCircle, Cloud, LinkIcon } from 'lucide-react';
import { FileUploader } from '@/components/ui/file-uploader';
// UploadResult 타입 정의
interface UploadResult {
  url: string
  filename: string
  originalFilename: string
}

interface VideoBlockRendererProps {
  block: Block;
  isEditing?: boolean;
  onUpdate?: (block: Block) => void;
}

export function VideoBlockRenderer({ block, isEditing, onUpdate }: VideoBlockRendererProps) {
  const [isEditingVideo, setIsEditingVideo] = useState(false);
  const [videoData, setVideoData] = useState(block.content);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadSource, setUploadSource] = useState<'url' | 'upload'>('url');

  const handleSave = useCallback(() => {
    // URL 유효성 검사
    if (!videoData.src) {
      setVideoError('동영상 URL을 입력해주세요.');
      return;
    }

    if (!isValidVideoUrl(videoData.src)) {
      setVideoError('올바른 동영상 URL을 입력해주세요.');
      return;
    }

    onUpdate?.({
      ...block,
      content: videoData,
    });
    setIsEditingVideo(false);
    setVideoError(null);
  }, [block, videoData, onUpdate]);

  const isValidVideoUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      
      // YouTube URLs
      if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
        return true;
      }
      
      // Vimeo URLs
      if (hostname.includes('vimeo.com')) {
        return true;
      }
      
      // 직접 비디오 파일
      const pathname = urlObj.pathname.toLowerCase();
      if (pathname.endsWith('.mp4') || pathname.endsWith('.webm') || pathname.endsWith('.ogg')) {
        return true;
      }

      return false;
    } catch {
      return false;
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    if (!match) return null;
    
    const videoId = match[1];
    const params = new URLSearchParams();
    
    if (videoData.autoplay) params.set('autoplay', '1');
    if (videoData.loop) params.set('loop', '1');
    if (videoData.muted) params.set('mute', '1');
    if (videoData.controls === false) params.set('controls', '0');
    
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  };

  const getVimeoEmbedUrl = (url: string) => {
    const regex = /(?:vimeo\.com\/)([0-9]+)/;
    const match = url.match(regex);
    if (!match) return null;
    
    const videoId = match[1];
    const params = new URLSearchParams();
    
    if (videoData.autoplay) params.set('autoplay', '1');
    if (videoData.loop) params.set('loop', '1');
    if (videoData.muted) params.set('muted', '1');
    
    return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
  };

  const detectVideoType = (url: string): 'youtube' | 'vimeo' | 'url' => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('vimeo.com')) return 'vimeo';
    return 'url';
  };

  const handleUrlChange = (url: string) => {
    setVideoData({ 
      ...videoData, 
      src: url,
      type: detectVideoType(url)
    });
    setVideoError(null);
  };

  const handleSupabaseUpload = useCallback((result: UploadResult) => {
    if (result.data) {
      setVideoData({
        ...videoData,
        src: result.data.publicUrl,
        type: 'url' // Supabase에서 업로드된 파일은 직접 URL로 처리
      });
      setVideoError(null);
    }
  }, [videoData]);

  const handleUploadError = useCallback((error: string) => {
    setVideoError(error);
  }, []);

  const resetToDefault = () => {
    setVideoData(block.content);
    setVideoError(null);
  };

  const renderVideoPreview = () => {
    return (
      <div className="flex flex-col items-center justify-center text-gray-500">
        <Play className="w-12 h-12 mb-2" />
        <span className="text-sm">미리보기는 저장 후 확인 가능</span>
      </div>
    );
  };

  if (isEditing && isEditingVideo) {
    return (
      <div className="space-y-6 p-6 border-2 border-blue-200 rounded-lg bg-blue-50/50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">동영상 설정</h3>
          <button
            onClick={() => {
              resetToDefault();
              setIsEditingVideo(false);
            }}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {videoError && (
          <div className="p-3 bg-red-100 border border-red-300 rounded-md text-red-700 text-sm flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            {videoError}
          </div>
        )}

        {/* 업로드 방식 선택 */}
        <div>
          <label className="block text-sm font-medium mb-3">동영상 추가 방식</label>
          <div className="flex space-x-2">
            <button
              onClick={() => setUploadSource('url')}
              className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg border-2 transition-colors ${
                uploadSource === 'url' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <LinkIcon className="w-5 h-5 mr-2" />
              URL 링크
            </button>
            <button
              onClick={() => setUploadSource('upload')}
              className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg border-2 transition-colors ${
                uploadSource === 'upload' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Cloud className="w-5 h-5 mr-2" />
              클라우드 업로드
            </button>
          </div>
        </div>

        {uploadSource === 'url' ? (
          <div>
            <label className="block text-sm font-medium mb-2">동영상 URL</label>
            <input
              type="url"
              value={videoData.src}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://youtube.com/watch?v=... 또는 https://vimeo.com/... 또는 https://example.com/video.mp4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              YouTube, Vimeo, 직접 MP4/WebM/OGG 파일 지원
            </p>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-2">
              동영상 파일 업로드 (Supabase Storage)
            </label>
            <FileUploader
              onUploadComplete={handleSupabaseUpload}
              onUploadError={handleUploadError}
              accept="video/*"
              maxSize={1000 * 1024 * 1024} // 1000MB
              folder="videos"
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-2">
              📁 업로드된 파일은 Supabase Storage의 careon/videos 폴더에 저장됩니다
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">동영상 타입</label>
          <select
            value={videoData.type}
            onChange={(e) => setVideoData({ ...videoData, type: e.target.value as 'url' | 'youtube' | 'vimeo' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="youtube">YouTube</option>
            <option value="vimeo">Vimeo</option>
            <option value="url">직접 파일 URL</option>
          </select>
        </div>

        {/* 미리보기 */}
        {videoData.src && isValidVideoUrl(videoData.src) && (
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-100 p-2 text-sm font-medium">미리보기</div>
            <div className="p-4 bg-white">
              <div className="aspect-video bg-gray-100 rounded flex items-center justify-center">
                {renderVideoPreview()}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={videoData.autoplay || false}
              onChange={(e) => setVideoData({ ...videoData, autoplay: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm">자동 재생</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={videoData.loop || false}
              onChange={(e) => setVideoData({ ...videoData, loop: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm">반복 재생</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={videoData.muted || false}
              onChange={(e) => setVideoData({ ...videoData, muted: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm">음소거</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={videoData.controls !== false}
              onChange={(e) => setVideoData({ ...videoData, controls: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm">컨트롤 표시</span>
          </label>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <button
            onClick={handleSave}
            disabled={!videoData.src}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            저장
          </button>
          <button
            onClick={() => {
              resetToDefault();
              setIsEditingVideo(false);
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 font-medium"
          >
            취소
          </button>
        </div>
      </div>
    );
  }

  const renderVideo = () => {
    if (!block.content.src) {
      return (
        <div 
          className={`w-full aspect-video bg-gray-100 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 ${isEditing ? 'hover:border-blue-400 hover:bg-blue-50 cursor-pointer' : ''}`}
          onClick={() => isEditing && setIsEditingVideo(true)}
        >
          <Play className="w-16 h-16 text-gray-400 mb-2" />
          <span className="text-gray-500 text-sm text-center">
            {isEditing ? '클릭하여 동영상을 추가하세요' : '동영상이 없습니다'}
            <br />
            <span className="text-xs">YouTube, Vimeo, MP4 지원</span>
          </span>
        </div>
      );
    }

    const commonProps = {
      width: "100%",
      height: "100%",
      className: "rounded-lg",
      onLoad: () => setIsLoading(false),
      onError: () => {
        setVideoError('동영상을 불러올 수 없습니다.');
        setIsLoading(false);
      },
    };

    let embedUrl: string | null = null;

    switch (block.content.type) {
      case 'youtube':
        embedUrl = getYouTubeEmbedUrl(block.content.src);
        break;
      case 'vimeo':
        embedUrl = getVimeoEmbedUrl(block.content.src);
        break;
      case 'url':
      default:
        break;
    }

    return (
      <div className="relative group aspect-video">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {videoError ? (
          <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
            <AlertCircle className="w-12 h-12 text-red-400 mb-2" />
            <span className="text-red-500 text-sm text-center">
              {videoError}
              <br />
              {isEditing && '클릭하여 다시 설정하세요'}
            </span>
          </div>
        ) : (
          <>
            {(block.content.type === 'youtube' || block.content.type === 'vimeo') && embedUrl ? (
              <iframe
                {...commonProps}
                src={embedUrl}
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
              />
            ) : (
              <video
                {...commonProps}
                src={block.content.src}
                autoPlay={block.content.autoplay}
                loop={block.content.loop}
                muted={block.content.muted}
                controls={block.content.controls !== false}
                playsInline
              />
            )}

            {isEditing && !videoError && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setIsEditingVideo(true)}
                  className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 shadow-lg"
                  title="동영상 설정"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Supabase Storage 표시 */}
            {block.content.src.includes('supabase') && (
              <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs flex items-center">
                  <Cloud className="w-3 h-3 mr-1" />
                  Supabase
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div
      className={`${isEditing && !isEditingVideo ? 'cursor-pointer hover:ring-2 hover:ring-blue-400 hover:ring-opacity-50 rounded-lg transition-all' : ''}`}
      onClick={() => isEditing && !isEditingVideo && !videoError && setIsEditingVideo(true)}
    >
      {renderVideo()}
    </div>
  );
}