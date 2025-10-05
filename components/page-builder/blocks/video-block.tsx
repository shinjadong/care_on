'use client';

import { useState, useCallback } from 'react';
import { Block } from '@/types/page-builder';
import { Play, Settings, X, AlertCircle, Cloud, LinkIcon, FolderOpen, Video } from 'lucide-react';
import { FileUploader } from '@/components/ui/file-uploader';
import { FileManager } from '../file-manager';

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
  const [videoData, setVideoData] = useState({
    src: block.content.src || '',
    type: block.content.type || 'youtube',
    width: block.content.width || 'auto',
    height: block.content.height || 'auto',
    autoplay: block.content.autoplay || false,
    muted: block.content.muted || true,
    loop: block.content.loop || false,
    controls: block.content.controls !== false, // 기본값 true
  });
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadSource, setUploadSource] = useState<'url' | 'upload' | 'storage'>('url');
  const [showFileManager, setShowFileManager] = useState(false);

  const handleSave = useCallback(() => {
    if (!videoData.src) {
      setVideoError('동영상 URL을 입력해주세요.');
      return;
    }

    if (videoData.type === 'youtube' && !isValidYouTubeUrl(videoData.src)) {
      setVideoError('올바른 YouTube URL을 입력해주세요.');
      return;
    }

    if (videoData.type === 'direct' && !isValidDirectVideoUrl(videoData.src)) {
      setVideoError('올바른 동영상 파일 URL을 입력해주세요.');
      return;
    }

    onUpdate?.({
      ...block,
      content: videoData,
    });
    setIsEditingVideo(false);
    setVideoError(null);
  }, [block, videoData, onUpdate]);

  const handleFileSelect = (url: string, type: 'image' | 'video') => {
    if (type === 'video') {
      setVideoData(prev => ({ 
        ...prev, 
        src: url, 
        type: 'direct' 
      }));
      setUploadSource('storage');
    }
    setShowFileManager(false);
  };

  const handleFileUpload = async (files: FileList) => {
    setVideoError(null);
    
    try {
      const file = files[0]; // 비디오는 하나씩만
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }
      
      const result = await response.json();
      if (result.success) {
        setVideoData(prev => ({ 
          ...prev, 
          src: result.data.url, 
          type: 'direct' 
        }));
        setUploadSource('upload');
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setVideoError(error instanceof Error ? error.message : 'Upload failed');
    }
  };

  const isValidYouTubeUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be');
    } catch {
      return false;
    }
  };

  const isValidDirectVideoUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname.toLowerCase();
      return ['mp4', 'webm', 'avi', 'mov', 'mkv'].some(ext => pathname.endsWith(`.${ext}`));
    } catch {
      return false;
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtu.be')) {
        return `https://www.youtube.com/embed/${urlObj.pathname.slice(1)}`;
      }
      if (urlObj.hostname.includes('youtube.com')) {
        const videoId = urlObj.searchParams.get('v');
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
      }
    } catch {
      return url;
    }
    return url;
  };

  const getVideoStyle = (): React.CSSProperties => {
    return {
      width: videoData.width === 'auto' ? '100%' : 
        typeof videoData.width === 'string' && videoData.width.includes('px') ? videoData.width : `${videoData.width}px`,
      height: videoData.height === 'auto' ? 'auto' : 
        typeof videoData.height === 'string' && videoData.height.includes('px') ? videoData.height : `${videoData.height}px`,
      maxWidth: '100%',
      margin: 0,
      padding: 0,
      display: 'block',
    };
  };

  if (isEditing && isEditingVideo) {
    return (
      <div className="space-y-6 p-6 border rounded-lg bg-white shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">동영상 편집</h3>
          <button
            onClick={() => {
              setVideoData(block.content);
              setIsEditingVideo(false);
              setVideoError(null);
            }}
            className="p-2 text-gray-600 hover:text-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {videoError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            {videoError}
          </div>
        )}

        {/* 동영상 소스 선택 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">동영상 소스</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* URL 입력 */}
              <button
                onClick={() => setUploadSource('url')}
                className={`p-4 border-2 border-dashed rounded-lg text-center transition-colors ${
                  uploadSource === 'url' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                <LinkIcon className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <p className="text-sm font-medium">URL로 추가</p>
                <p className="text-xs text-gray-500">YouTube, 직링크</p>
              </button>

              {/* 스토리지에서 선택 */}
              <button
                onClick={() => {
                  setUploadSource('storage');
                  setShowFileManager(true);
                }}
                className={`p-4 border-2 border-dashed rounded-lg text-center transition-colors ${
                  uploadSource === 'storage' 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-300 hover:border-purple-400'
                }`}
              >
                <FolderOpen className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                <p className="text-sm font-medium">스토리지에서 선택</p>
                <p className="text-xs text-gray-500">업로드된 동영상</p>
              </button>

              {/* 파일 업로드 */}
              <div className={`border-2 border-dashed rounded-lg transition-colors ${
                uploadSource === 'upload' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-300 hover:border-green-400'
              }`}>
                <FileUploader
                  accept="video/*"
                  multiple={false}
                  onUpload={handleFileUpload}
                >
                  <div className="text-center p-4 cursor-pointer">
                    <Cloud className="w-6 h-6 mx-auto mb-2 text-green-500" />
                    <p className="text-sm font-medium">파일 업로드</p>
                    <p className="text-xs text-gray-500">MP4, WebM, MOV</p>
                  </div>
                </FileUploader>
              </div>
            </div>
          </div>

          {/* URL 입력 (URL 모드일 때) */}
          {uploadSource === 'url' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">동영상 URL</label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={videoData.src}
                  onChange={(e) => setVideoData(prev => ({ ...prev, src: e.target.value }))}
                  placeholder="https://www.youtube.com/watch?v=... 또는 https://example.com/video.mp4"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => setVideoData(prev => ({ ...prev, type: 'youtube' }))}
                    className={`px-3 py-1 text-sm rounded ${
                      videoData.type === 'youtube' 
                        ? 'bg-red-100 text-red-700 border border-red-300' 
                        : 'bg-gray-100 text-gray-700 border border-gray-300'
                    }`}
                  >
                    YouTube
                  </button>
                  <button
                    onClick={() => setVideoData(prev => ({ ...prev, type: 'direct' }))}
                    className={`px-3 py-1 text-sm rounded ${
                      videoData.type === 'direct' 
                        ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                        : 'bg-gray-100 text-gray-700 border border-gray-300'
                    }`}
                  >
                    직접 링크
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 동영상 설정 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">너비</label>
              <input
                type="text"
                value={videoData.width}
                onChange={(e) => setVideoData(prev => ({ ...prev, width: e.target.value }))}
                placeholder="auto, 100%, 800px"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">높이</label>
              <input
                type="text"
                value={videoData.height}
                onChange={(e) => setVideoData(prev => ({ ...prev, height: e.target.value }))}
                placeholder="auto, 450px"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">옵션</label>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={videoData.autoplay}
                    onChange={(e) => setVideoData(prev => ({ ...prev, autoplay: e.target.checked }))}
                    className="mr-2"
                  />
                  자동재생
                </label>
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={videoData.muted}
                    onChange={(e) => setVideoData(prev => ({ ...prev, muted: e.target.checked }))}
                    className="mr-2"
                  />
                  음소거
                </label>
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={videoData.loop}
                    onChange={(e) => setVideoData(prev => ({ ...prev, loop: e.target.checked }))}
                    className="mr-2"
                  />
                  반복재생
                </label>
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={videoData.controls}
                    onChange={(e) => setVideoData(prev => ({ ...prev, controls: e.target.checked }))}
                    className="mr-2"
                  />
                  컨트롤 표시
                </label>
              </div>
            </div>
          </div>

          {/* 미리보기 */}
          {videoData.src && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <label className="block text-sm font-medium text-gray-700 mb-2">미리보기</label>
              <div className="bg-black rounded-lg overflow-hidden">
                {videoData.type === 'youtube' ? (
                  <iframe
                    src={getYouTubeEmbedUrl(videoData.src)}
                    style={getVideoStyle()}
                    className="w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onLoad={() => setIsLoading(false)}
                    onError={() => setVideoError('동영상을 불러올 수 없습니다.')}
                  />
                ) : (
                  <video
                    src={videoData.src}
                    style={getVideoStyle()}
                    className="w-full"
                    controls={videoData.controls}
                    autoPlay={videoData.autoplay}
                    muted={videoData.muted}
                    loop={videoData.loop}
                    playsInline
                    onLoad={() => setIsLoading(false)}
                    onError={() => setVideoError('동영상을 불러올 수 없습니다.')}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* 버튼 */}
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            저장
          </button>
          <button
            onClick={() => {
              setVideoData(block.content);
              setIsEditingVideo(false);
              setVideoError(null);
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            취소
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="video-block relative group m-0 p-0" style={{ margin: 0, padding: 0 }}>
      {isEditing && (
        <>
          {/* 미디어 관련 버튼 - 상단 좌측 */}
          <div className="absolute top-2 left-2 z-15 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center space-x-1 bg-white rounded shadow-lg border">
              <button
                onClick={() => setShowFileManager(true)}
                className="p-2 rounded transition-colors bg-purple-500 text-white hover:bg-purple-600"
                title="스토리지에서 선택"
              >
                <FolderOpen className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 편집 기능 버튼 - 상단 우측 */}
          <div className="absolute top-2 right-2 z-15 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center space-x-1 bg-white rounded shadow-lg border">
              <button
                onClick={() => setIsEditingVideo(true)}
                className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                title="동영상 편집"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* 동영상 렌더링 */}
      <div className="w-full">
        {videoData.src ? (
          <div className="bg-black rounded-lg overflow-hidden" style={{ margin: 0, padding: 0 }}>
            {videoData.type === 'youtube' ? (
              <iframe
                src={getYouTubeEmbedUrl(videoData.src)}
                style={getVideoStyle()}
                className="w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => setIsLoading(false)}
                onError={() => setVideoError('동영상을 불러올 수 없습니다.')}
              />
            ) : (
              <video
                src={videoData.src}
                style={getVideoStyle()}
                className="w-full"
                controls={videoData.controls}
                autoPlay={videoData.autoplay}
                muted={videoData.muted}
                loop={videoData.loop}
                playsInline
                onLoad={() => setIsLoading(false)}
                onError={() => setVideoError('동영상을 불러올 수 없습니다.')}
              />
            )}
          </div>
        ) : (
          isEditing && (
            <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="mb-4">
                <Play className="w-12 h-12 mx-auto text-gray-400" />
              </div>
              <p className="text-lg font-medium">동영상 블록</p>
              <p className="text-sm mt-1">동영상을 추가하여 콘텐츠를 만들어보세요</p>
              <div className="flex gap-2 justify-center mt-4">
                <button
                  onClick={() => setShowFileManager(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                >
                  <FolderOpen className="w-4 h-4 mr-2 inline" />
                  스토리지에서 선택
                </button>
                <button
                  onClick={() => setIsEditingVideo(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  동영상 추가
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {/* 파일 매니저 - 선택 모드 */}
      <FileManager
        isOpen={showFileManager}
        onClose={() => setShowFileManager(false)}
        onSelectFile={handleFileSelect}
        fileType="video"
        mode="select"
      />
    </div>
  );
}