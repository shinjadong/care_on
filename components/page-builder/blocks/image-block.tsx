"use client"

import { useState, useCallback } from 'react'
import { Block } from '@/types/page-builder'
import { Upload, Settings, X, Plus, Trash2, MoveUp, MoveDown, Image as ImageIcon, Grid } from 'lucide-react'
import { FileUploader } from '@/components/ui/file-uploader'
import { StorageImageGallery } from '@/components/ui/storage-image-gallery'

// UploadResult 타입 정의
interface UploadResult {
  url: string
  filename: string
  originalFilename: string
}

interface StoryImage {
  id: string
  src: string
  alt?: string
  caption?: string
  width?: number
  height?: number
}

interface ImageBlockRendererProps {
  block: Block
  isEditing?: boolean
  onUpdate?: (block: Block) => void
}

export function ImageBlockRenderer({ block, isEditing, onUpdate }: ImageBlockRendererProps) {
  const [isEditingImages, setIsEditingImages] = useState(false)
  const [images, setImages] = useState<StoryImage[]>(
    block.content.images || (block.content.src ? [{
      id: 'legacy-img',
      src: block.content.src,
      alt: block.content.alt || '',
      caption: block.content.caption || '',
      width: block.content.width || 743,
      height: block.content.height
    }] : [])
  )
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [showImageGallery, setShowImageGallery] = useState(false)
  const [displayMode, setDisplayMode] = useState<'single' | 'story'>(
    block.content.images ? 'story' : 'single'
  )

  const handleSave = useCallback(() => {
    onUpdate?.({
      ...block,
      content: {
        ...block.content,
        images,
        displayMode
      }
    })
    setIsEditingImages(false)
  }, [block, images, displayMode, onUpdate])

  const handleCancel = useCallback(() => {
    setImages(block.content.images || [])
    setIsEditingImages(false)
    setUploadError(null)
  }, [block.content.images])

  // 이미지 업로드 핸들러
  const handleFileUpload = async (files: FileList) => {
    setUploadError(null)
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        
        const response = await fetch('/api/media/upload', {
          method: 'POST',
          body: formData
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Upload failed')
        }
        
        const result = await response.json()
        if (result.success) {
          return {
            url: result.data.url,
            filename: result.data.filename,
            originalFilename: result.data.originalFilename
          }
        } else {
          throw new Error(result.error || 'Upload failed')
        }
      })
      
      const uploadResults = await Promise.all(uploadPromises)
      
      const newImages: StoryImage[] = uploadResults.map(result => ({
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        src: result.url,
        alt: result.originalFilename,
        caption: '',
        width: 743,
        height: undefined
      }))
      
      setImages(prev => [...prev, ...newImages])
      
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError(error instanceof Error ? error.message : 'Upload failed')
    }
  }

  // 이미지 URL로 추가
  const handleAddImageByUrl = () => {
    const url = prompt('이미지 URL을 입력하세요:')
    if (url) {
      const newImage: StoryImage = {
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        src: url,
        alt: '',
        caption: '',
        width: 743,
        height: undefined
      }
      setImages(prev => [...prev, newImage])
    }
  }

  // 갤러리에서 이미지 선택
  const handleSelectFromGallery = (imageUrl: string) => {
    const filename = imageUrl.split('/').pop() || ''
    const newImage: StoryImage = {
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      src: imageUrl,
      alt: filename,
      caption: '',
      width: 743,
      height: undefined
    }
    setImages(prev => [...prev, newImage])
  }

  // 이미지 삭제
  const handleDeleteImage = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId))
  }

  // 이미지 순서 변경
  const handleMoveImage = (imageId: string, direction: 'up' | 'down') => {
    setImages(prev => {
      const currentIndex = prev.findIndex(img => img.id === imageId)
      if (currentIndex === -1) return prev
      
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
      if (newIndex < 0 || newIndex >= prev.length) return prev
      
      const newImages = [...prev]
      const [movedImage] = newImages.splice(currentIndex, 1)
      newImages.splice(newIndex, 0, movedImage)
      
      return newImages
    })
  }

  // 이미지 속성 업데이트
  const handleUpdateImage = (imageId: string, updates: Partial<StoryImage>) => {
    setImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, ...updates } : img
    ))
  }

  if (isEditing && isEditingImages) {
    return (
      <div className="border-2 border-blue-300 rounded-lg p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            이미지 편집기
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              저장
            </button>
            <button
              onClick={handleCancel}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 디스플레이 모드 선택 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">표시 방식</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="single"
                checked={displayMode === 'single'}
                onChange={(e) => setDisplayMode(e.target.value as 'single' | 'story')}
                className="mr-2"
              />
              <ImageIcon className="w-4 h-4 mr-1" />
              단일 이미지
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="story"
                checked={displayMode === 'story'}
                onChange={(e) => setDisplayMode(e.target.value as 'single' | 'story')}
                className="mr-2"
              />
              <Grid className="w-4 h-4 mr-1" />
              스토리 (다중 이미지)
            </label>
          </div>
        </div>

        {uploadError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            업로드 오류: {uploadError}
          </div>
        )}

        {/* 이미지 업로드 영역 */}
        <div className="mb-6">
          <FileUploader
            accept="image/*"
            multiple={displayMode === 'story'}
            onUpload={handleFileUpload}
            className="mb-4"
          >
            <div className="text-center">
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">
                이미지를 드래그하거나 클릭하여 업로드
              </p>
              <p className="text-sm text-gray-500 mt-1">
                JPG, PNG, GIF 지원 (최대 10MB)
                {displayMode === 'story' && ' | 여러 파일 선택 가능'}
              </p>
            </div>
          </FileUploader>
          
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              onClick={handleAddImageByUrl}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              URL 추가
            </button>
            <button
              onClick={() => setShowImageGallery(true)}
              className="px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded hover:bg-blue-100 transition-colors text-sm"
            >
              <ImageIcon className="w-4 h-4 inline mr-2" />
              Storage에서 선택
            </button>
          </div>
        </div>

        {/* 이미지 리스트 */}
        <div className="space-y-4">
          {images.map((image, index) => (
            <div key={image.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-start space-x-4">
                <img
                  src={image.src}
                  alt={image.alt || ''}
                  className="w-24 h-24 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f0f0f0"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E'
                  }}
                />
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    placeholder="이미지 설명 (ALT 텍스트)"
                    value={image.alt || ''}
                    onChange={(e) => handleUpdateImage(image.id, { alt: e.target.value })}
                    className="w-full px-3 py-1 text-sm border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    placeholder="캡션 (선택사항)"
                    value={image.caption || ''}
                    onChange={(e) => handleUpdateImage(image.id, { caption: e.target.value })}
                    className="w-full px-3 py-1 text-sm border border-gray-300 rounded"
                  />
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="너비"
                      value={image.width || ''}
                      onChange={(e) => handleUpdateImage(image.id, { width: parseInt(e.target.value) || undefined })}
                      className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                    <input
                      type="number"
                      placeholder="높이"
                      value={image.height || ''}
                      onChange={(e) => handleUpdateImage(image.id, { height: parseInt(e.target.value) || undefined })}
                      className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  </div>
                </div>
                {displayMode === 'story' && (
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => handleMoveImage(image.id, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <MoveUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveImage(image.id, 'down')}
                      disabled={index === images.length - 1}
                      className="p-1 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <MoveDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {displayMode === 'single' && images.length === 1 && (
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    className="p-1 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            이미지를 추가하여 블록을 구성해보세요.
          </div>
        )}

        {/* 이미지 갤러리 모달 */}
        <StorageImageGallery
          isOpen={showImageGallery}
          onClose={() => setShowImageGallery(false)}
          onSelectImage={handleSelectFromGallery}
          multiple={displayMode === 'story'}
        />
      </div>
    )
  }

  // 보기 모드
  return (
    <div className="image-block relative group">
      {isEditing && (
        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditingImages(true)}
            className="p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            title="이미지 편집"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 이미지 렌더링 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {images.length > 0 ? (
          displayMode === 'single' ? (
            // 단일 이미지 모드
            <div className="text-center">
              {images.map((image) => (
                <div key={image.id}>
                  <img
                    src={image.src}
                    alt={image.alt || ''}
                    style={{
                      width: image.width ? `min(${image.width}px, 100%)` : 'auto',
                      height: image.height ? `${image.height}px` : 'auto',
                      maxWidth: '100%'
                    }}
                    className="mx-auto rounded-lg shadow-sm w-full sm:w-auto"
                  />
                  {image.caption && (
                    <p className="text-sm text-gray-600 mt-3 italic px-4">
                      {image.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // 스토리 모드 (와디즈 스타일) - 모바일 최적화
            <div className="space-y-0">
              {images.map((image) => (
                <div key={image.id} className="text-center">
                  <img
                    src={image.src}
                    alt={image.alt || ''}
                    style={{
                      display: 'block',
                      verticalAlign: 'top',
                      margin: '5px auto',
                      textAlign: 'center',
                      width: image.width ? `min(${image.width}px, 100%)` : 'auto',
                      height: image.height ? `${image.height}px` : 'auto',
                      maxWidth: '100%'
                    }}
                    className="story-image w-full sm:w-auto"
                  />
                  {image.caption && (
                    <p className="text-sm text-gray-600 mt-2 italic px-4">
                      {image.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )
        ) : (
          isEditing && (
            <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="mb-4">
                <Upload className="w-12 h-12 mx-auto text-gray-400" />
              </div>
              <p className="text-lg font-medium">이미지 블록</p>
              <p className="text-sm mt-1">이미지를 추가하여 콘텐츠를 만들어보세요</p>
              <button
                onClick={() => setIsEditingImages(true)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                이미지 추가하기
              </button>
            </div>
          )
        )}
      </div>
    </div>
  )
}