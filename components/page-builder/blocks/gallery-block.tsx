"use client"

import { useState, useEffect, useCallback } from 'react';
import { Block } from '@/types/page-builder';
import { Images, Settings, X, Plus, Trash2, Grid, Sliders } from 'lucide-react';
import { FileManager } from '../file-manager';

interface GalleryBlockRendererProps {
  block: Block;
  isEditing?: boolean;
  onUpdate?: (block: Block) => void;
}

interface GalleryImage {
  id: string;
  src: string;
  alt?: string;
  caption?: string;
}

export function GalleryBlockRenderer({ block, isEditing, onUpdate }: GalleryBlockRendererProps) {
  const [isEditingGallery, setIsEditingGallery] = useState(false);
  const [showFileManager, setShowFileManager] = useState(false);
  const [images, setImages] = useState<GalleryImage[]>(
    block.content.images || []
  );
  const [layout, setLayout] = useState(block.content.layout || 'grid');
  const [columns, setColumns] = useState(block.content.columns || 3);
  const [spacing, setSpacing] = useState(block.content.spacing || 8);
  const [aspectRatio, setAspectRatio] = useState(block.content.aspectRatio || 'square');

  // 블록 내용 동기화
  useEffect(() => {
    setImages(block.content.images || []);
    setLayout(block.content.layout || 'grid');
    setColumns(block.content.columns || 3);
    setSpacing(block.content.spacing || 8);
    setAspectRatio(block.content.aspectRatio || 'square');
  }, [block.content]);

  // 저장 함수
  const handleSave = useCallback(() => {
    onUpdate?.({
      ...block,
      content: {
        ...block.content,
        images,
        layout,
        columns,
        spacing,
        aspectRatio
      }
    });
    setIsEditingGallery(false);
  }, [block, images, layout, columns, spacing, aspectRatio, onUpdate]);

  // 이미지 추가
  const handleFileSelect = useCallback((url: string, type: 'image' | 'video') => {
    if (type === 'image') {
      const newImage: GalleryImage = {
        id: `img-${Date.now()}`,
        src: url,
        alt: '',
        caption: ''
      };
      setImages(prev => [...prev, newImage]);
    }
    setShowFileManager(false);
  }, []);

  // 이미지 삭제
  const removeImage = useCallback((imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  }, []);

  // 이미지 정보 업데이트
  const updateImageInfo = useCallback((imageId: string, field: 'alt' | 'caption', value: string) => {
    setImages(prev => prev.map(img =>
      img.id === imageId ? { ...img, [field]: value } : img
    ));
  }, []);

  if (isEditing && isEditingGallery) {
    return (
      <div className="border-2 border-purple-300 rounded-lg p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            이미지 갤러리 편집기
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              저장
            </button>
            <button
              onClick={() => setIsEditingGallery(false)}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 갤러리 설정 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">레이아웃</label>
            <select
              value={layout}
              onChange={(e) => setLayout(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="grid">그리드</option>
              <option value="masonry">벽돌식</option>
              <option value="slider">슬라이더</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              컬럼 수: {columns}개
            </label>
            <input
              type="range"
              min="1"
              max="6"
              value={columns}
              onChange={(e) => setColumns(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              간격: {spacing}px
            </label>
            <input
              type="range"
              min="0"
              max="32"
              step="4"
              value={spacing}
              onChange={(e) => setSpacing(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">비율</label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="square">정사각형</option>
              <option value="landscape">가로형</option>
              <option value="portrait">세로형</option>
              <option value="auto">자동</option>
            </select>
          </div>
        </div>

        {/* 이미지 추가 */}
        <div className="mb-6">
          <button
            onClick={() => setShowFileManager(true)}
            className="w-full py-4 border-2 border-dashed border-purple-300 rounded-lg text-purple-600 hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <Plus className="w-6 h-6 mx-auto mb-2" />
            이미지 추가
          </button>
        </div>

        {/* 이미지 목록 */}
        {images.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">이미지 목록 ({images.length}개)</h4>
            <div className="max-h-64 overflow-y-auto space-y-3">
              {images.map((image, index) => (
                <div key={image.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      placeholder="이미지 설명 (Alt Text)"
                      value={image.alt || ''}
                      onChange={(e) => updateImageInfo(image.id, 'alt', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      placeholder="캡션 (선택사항)"
                      value={image.caption || ''}
                      onChange={(e) => updateImageInfo(image.id, 'caption', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  </div>
                  <button
                    onClick={() => removeImage(image.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 파일 매니저 */}
        <FileManager
          isOpen={showFileManager}
          onClose={() => setShowFileManager(false)}
          onSelectFile={handleFileSelect}
          fileType="image"
          mode="select"
        />
      </div>
    );
  }

  // 보기 모드
  return (
    <div className="gallery-block relative group">
      {isEditing && (
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditingGallery(true)}
            className="p-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            title="갤러리 편집"
          >
            <Images className="w-4 h-4" />
          </button>
        </div>
      )}

      {images.length > 0 ? (
        layout === 'grid' ? (
          // 그리드 레이아웃
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gap: `${spacing}px`
            }}
          >
            {images.map((image) => (
              <div key={image.id} className="overflow-hidden rounded-lg">
                <img
                  src={image.src}
                  alt={image.alt}
                  className={`w-full object-cover transition-transform hover:scale-105 ${
                    aspectRatio === 'square' ? 'aspect-square' :
                    aspectRatio === 'landscape' ? 'aspect-video' :
                    aspectRatio === 'portrait' ? 'aspect-[3/4]' : ''
                  }`}
                />
                {image.caption && (
                  <p className="text-sm text-gray-600 mt-2 px-2">
                    {image.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : layout === 'slider' ? (
          // 슬라이더 레이아웃
          <div className="overflow-hidden rounded-lg">
            <div className="flex transition-transform duration-300">
              {images.map((image) => (
                <div key={image.id} className="flex-shrink-0 w-full">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-64 object-cover"
                  />
                  {image.caption && (
                    <p className="text-center text-sm text-gray-600 mt-2 px-4">
                      {image.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          // 벽돌식 레이아웃
          <div
            className="columns-auto"
            style={{
              columnCount: columns,
              columnGap: `${spacing}px`
            }}
          >
            {images.map((image) => (
              <div key={image.id} className="break-inside-avoid mb-4">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full rounded-lg"
                />
                {image.caption && (
                  <p className="text-sm text-gray-600 mt-2 px-2">
                    {image.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        isEditing && (
          <div
            className="text-center py-12 text-gray-500 border-2 border-dashed border-purple-300 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all"
            onClick={() => setIsEditingGallery(true)}
          >
            <Images className="w-16 h-16 mx-auto text-purple-400 mb-4" />
            <p className="text-lg font-medium text-purple-600">이미지 갤러리 추가</p>
            <p className="text-sm mt-1 text-purple-500">클릭해서 이미지 갤러리를 만드세요</p>
          </div>
        )
      )}
    </div>
  );
}