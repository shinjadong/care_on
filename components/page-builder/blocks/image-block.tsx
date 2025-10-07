"use client"

import { useState, useCallback, useEffect } from 'react'
import { Block } from '@/types/page-builder'
import { Upload, Settings, X, Plus, Trash2, MoveUp, MoveDown, Image as ImageIcon, Grid, FolderOpen } from 'lucide-react'
import { FileUploader } from '@/components/ui/file-uploader'
import { FileManager } from '../file-manager'

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
  link?: string
  linkTarget?: '_blank' | '_self'
}

interface ImageBlockRendererProps {
  block: Block
  isEditing?: boolean
  onUpdate?: (block: Block) => void
}

// 캔바 스타일 헬퍼 함수들
const getShadowClass = (shadow: string) => {
  const shadowMap = {
    'none': '',
    'sm': 'shadow-sm',
    'md': 'shadow-md',
    'lg': 'shadow-lg',
    'xl': 'shadow-xl'
  }
  return shadowMap[shadow as keyof typeof shadowMap] || ''
}

const getHoverEffectClass = (effect: string) => {
  const effectMap = {
    'none': '',
    'scale': 'hover:scale-105',
    'rotate': 'hover:rotate-3',
    'brightness': 'hover:brightness-110',
    'blur': 'hover:blur-[1px]'
  }
  return effectMap[effect as keyof typeof effectMap] || 'hover:scale-105'
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
  const [showFileManager, setShowFileManager] = useState(false)
  const [displayMode, setDisplayMode] = useState<'single' | 'story'>(
    block.content.images ? 'story' : 'single'
  )

  // Puck에서 전달받은 스타일 프로퍼티들 (캔바 스타일)
  const [containerWidth, setContainerWidth] = useState(block.content.containerWidth || 100)
  const [padding, setPadding] = useState(block.content.padding || 16)
  const [borderRadius, setBorderRadius] = useState(block.content.borderRadius || 12)
  const [aspectRatio, setAspectRatio] = useState(block.content.aspectRatio || 'auto')
  const [imageAlign, setImageAlign] = useState(block.content.imageAlign || 'center')
  const [opacity, setOpacity] = useState(block.content.opacity || 100)
  const [rotation, setRotation] = useState(block.content.rotation || 0)
  const [shadow, setShadow] = useState(block.content.shadow || 'none')
  const [zIndex, setZIndex] = useState(block.content.zIndex || 1)
  const [hoverEffect, setHoverEffect] = useState(block.content.hoverEffect || 'scale')

  // Puck 설정값 변경 감지 (캔바 스타일)
  useEffect(() => {
    console.log('🎛️ Puck 캔바 스타일 설정 업데이트:', {
      blockId: block.id,
      containerWidth: block.content.containerWidth,
      padding: block.content.padding,
      borderRadius: block.content.borderRadius,
      aspectRatio: block.content.aspectRatio,
      imageAlign: block.content.imageAlign,
      opacity: block.content.opacity,
      rotation: block.content.rotation,
      shadow: block.content.shadow,
      zIndex: block.content.zIndex,
      hoverEffect: block.content.hoverEffect
    })

    console.log('🔍 ImageAlign 상태 추적:', {
      fromContent: block.content.imageAlign,
      currentState: imageAlign,
      willSetTo: block.content.imageAlign || 'center'
    })

    setContainerWidth(block.content.containerWidth || 100)
    setPadding(block.content.padding || 16)
    setBorderRadius(block.content.borderRadius || 12)
    setAspectRatio(block.content.aspectRatio || 'auto')
    setImageAlign(block.content.imageAlign || 'center')
    setOpacity(block.content.opacity || 100)
    setRotation(block.content.rotation || 0)
    setShadow(block.content.shadow || 'none')
    setZIndex(block.content.zIndex || 1)
    setHoverEffect(block.content.hoverEffect || 'scale')
  }, [block.content.containerWidth, block.content.padding, block.content.borderRadius, block.content.aspectRatio, block.content.imageAlign, block.content.opacity, block.content.rotation, block.content.shadow, block.content.zIndex, block.content.hoverEffect, block.id])

  const handleSave = useCallback(() => {
    onUpdate?.({
      ...block,
      content: {
        ...block.content,
        images,
        displayMode,
        containerWidth,
        padding,
        borderRadius,
        aspectRatio,
        imageAlign,
        opacity,
        rotation,
        shadow,
        zIndex,
        hoverEffect
      }
    })
    setIsEditingImages(false)
  }, [block, images, displayMode, containerWidth, padding, borderRadius, aspectRatio, imageAlign, opacity, rotation, shadow, zIndex, hoverEffect, onUpdate])

  const handleCancel = useCallback(() => {
    setImages(block.content.images || [])
    setIsEditingImages(false)
    setUploadError(null)
  }, [block.content.images])

  // 파일 매니저에서 파일 선택 시
  const handleFileSelect = (url: string, type: 'image' | 'video') => {
    if (type === 'image') {
      const filename = url.split('/').pop() || ''

      // 특정 이미지 교체인지 확인
      const editingImageId = (window as any).currentEditingImageId

      if (editingImageId) {
        // 기존 이미지 교체
        setImages(prev => prev.map(img =>
          img.id === editingImageId
            ? { ...img, src: url, alt: filename }
            : img
        ))
        // 교체 완료 후 ID 초기화
        delete (window as any).currentEditingImageId
      } else {
        // 새 이미지 추가
        const newImage: StoryImage = {
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          src: url,
          alt: filename,
          caption: '',
          width: 743,
          height: undefined
        }

        if (displayMode === 'single') {
          setImages([newImage]);
        } else {
          setImages(prev => [...prev, newImage]);
        }
      }
    }
    setShowFileManager(false);
  };

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

        {/* 레이아웃 설정 */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium mb-3 text-blue-800">레이아웃 설정</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                컨테이너 넓이: {containerWidth}%
              </label>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={containerWidth}
                onChange={(e) => {
                  const newWidth = parseInt(e.target.value)
                  const newPadding = Math.max(8, Math.floor((100 - newWidth) / 4))

                  // 로컬 state 즉시 업데이트
                  setContainerWidth(newWidth)
                  setPadding(newPadding)

                  // Puck에도 즉시 반영
                  onUpdate?.({
                    ...block,
                    content: {
                      ...block.content,
                      containerWidth: newWidth,
                      padding: newPadding
                    }
                  })
                }}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                패딩: {padding}px
              </label>
              <input
                type="range"
                min="0"
                max="50"
                step="2"
                value={padding}
                onChange={(e) => {
                  const newPadding = parseInt(e.target.value)

                  // 로컬 state 즉시 업데이트
                  setPadding(newPadding)

                  // Puck에도 즉시 반영
                  onUpdate?.({
                    ...block,
                    content: {
                      ...block.content,
                      padding: newPadding
                    }
                  })
                }}
                className="w-full"
              />
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-2">
            💡 넓이를 줄이면 자동으로 패딩이 증가됩니다
          </p>
        </div>

        {/* 캔바 스타일 컨트롤 - 정렬, 투명도, 회전 */}
        <div className="mb-6 p-4 bg-purple-50 rounded-lg">
          <h4 className="font-medium mb-3 text-purple-800">캔바 스타일 컨트롤</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">정렬</label>
              <div className="flex gap-1">
                {['left', 'center', 'right'].map((align) => (
                  <button
                    key={align}
                    onClick={() => {
                      setImageAlign(align as 'left' | 'center' | 'right')
                      onUpdate?.({
                        ...block,
                        content: { ...block.content, imageAlign: align }
                      })
                    }}
                    className={`px-3 py-1 text-xs rounded transition-colors ${
                      imageAlign === align
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {align === 'left' && '⬅️'}
                    {align === 'center' && '🎯'}
                    {align === 'right' && '➡️'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                투명도: {opacity}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={opacity}
                onChange={(e) => {
                  const newOpacity = parseInt(e.target.value)
                  setOpacity(newOpacity)
                  onUpdate?.({
                    ...block,
                    content: { ...block.content, opacity: newOpacity }
                  })
                }}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                회전: {rotation}°
              </label>
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={rotation}
                onChange={(e) => {
                  const newRotation = parseInt(e.target.value)
                  setRotation(newRotation)
                  onUpdate?.({
                    ...block,
                    content: { ...block.content, rotation: newRotation }
                  })
                }}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* 이미지 추가 옵션 */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-3">이미지 추가</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* 파일 업로드 */}
            <FileUploader
              accept="image/*"
              multiple={displayMode === 'story'}
              onUpload={handleFileUpload}
            >
              <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer">
                <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">파일 업로드</p>
              </div>
            </FileUploader>

            {/* 스토리지에서 선택 */}
            <button
              onClick={() => setShowFileManager(true)}
              className="text-center p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <FolderOpen className="w-6 h-6 mx-auto text-blue-500 mb-2" />
              <p className="text-sm text-blue-700 font-medium">스토리지에서 선택</p>
            </button>

            {/* URL로 추가 */}
            <button
              onClick={handleAddImageByUrl}
              className="text-center p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <Plus className="w-6 h-6 mx-auto text-green-500 mb-2" />
              <p className="text-sm text-green-700 font-medium">URL로 추가</p>
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
                  {/* 빠른 교체 버튼들 */}
                  <div className="flex gap-2 mb-2">
                    <FileUploader
                      accept="image/*"
                      multiple={false}
                      onUpload={(results) => {
                        if (results.length > 0) {
                          handleUpdateImage(image.id, { src: results[0].url })
                        }
                      }}
                    >
                      <button className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors">
                        📁 파일 선택
                      </button>
                    </FileUploader>
                    <button
                      onClick={() => {
                        setShowFileManager(true)
                        // 파일 매니저에서 선택 시 현재 이미지 교체하도록 설정
                        window.currentEditingImageId = image.id
                      }}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                    >
                      🗂️ 스토리지
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="이미지 URL을 직접 입력하세요"
                    value={image.src || ''}
                    onChange={(e) => handleUpdateImage(image.id, { src: e.target.value })}
                    className="w-full px-3 py-2 text-sm border-2 border-blue-300 rounded-lg font-medium bg-blue-50"
                  />
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
                  <input
                    type="text"
                    placeholder="클릭 시 이동할 링크 (선택사항)"
                    value={image.link || ''}
                    onChange={(e) => handleUpdateImage(image.id, { link: e.target.value })}
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
                    <select
                      value={image.linkTarget || '_blank'}
                      onChange={(e) => handleUpdateImage(image.id, { linkTarget: e.target.value as '_blank' | '_self' })}
                      className="px-2 py-1 text-sm border border-gray-300 rounded"
                      disabled={!image.link}
                    >
                      <option value="_blank">새 창</option>
                      <option value="_self">같은 창</option>
                    </select>
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

        {/* 파일 매니저 - 선택 모드 */}
        <FileManager
          isOpen={showFileManager}
          onClose={() => setShowFileManager(false)}
          onSelectFile={handleFileSelect}
          fileType="image"
          mode="select"
        />
      </div>
    )
  }

  // 보기 모드
  return (
    <div className="image-block relative group m-0 p-0" style={{ margin: 0, padding: 0 }}>
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
                onClick={() => setIsEditingImages(true)}
                className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                title="이미지 편집"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* 이미지 렌더링 - block-renderer에서 정렬 처리 */}
      <div
        className="w-full"
        style={{
          opacity: opacity / 100,
          transform: `rotate(${rotation}deg)`,
          zIndex: zIndex
        }}
      >
        {images.length > 0 ? (
          displayMode === 'single' ? (
            // 단일 이미지 모드 - 강제 중앙 정렬
            <div className="w-full flex justify-center">
              {images.map((image) => (
                <div key={image.id}>
                  {image.link && !isEditing ? (
                    <a
                      href={image.link}
                      target={image.linkTarget || '_blank'}
                      rel="noopener noreferrer"
                      className="inline-block cursor-pointer hover:opacity-90 transition-opacity"
                      style={{ display: 'block' }}
                    >
                      <img
                        src={image.src}
                        alt={image.alt || ''}
                        style={{
                          width: containerWidth === 100 ? '100%' : 'auto',
                        maxWidth: '100%',
                          height: 'auto',
                          borderRadius: containerWidth < 100 ? `${borderRadius}px` : '0',
                          aspectRatio: aspectRatio !== 'auto' ? aspectRatio : undefined,
                          objectFit: aspectRatio !== 'auto' ? 'cover' : 'contain',
                          display: 'block',
                          transition: 'all 0.3s ease'
                        }}
                        className={`${getShadowClass(shadow)} ${getHoverEffectClass(hoverEffect)} transition-all duration-300 ease-out`}
                      />
                    </a>
                  ) : (
                    <img
                      src={image.src}
                      alt={image.alt || ''}
                      onClick={() => isEditing && setIsEditingImages(true)}
                      style={{
                        width: containerWidth === 100 ? '100%' : 'auto',
                        maxWidth: '100%',
                        height: 'auto',
                        borderRadius: containerWidth < 100 ? `${borderRadius}px` : '0',
                        aspectRatio: aspectRatio !== 'auto' ? aspectRatio : undefined,
                        objectFit: aspectRatio !== 'auto' ? 'cover' : 'contain',
                        display: 'block',
                        cursor: isEditing ? 'pointer' : 'default',
                        transition: 'all 0.3s ease'
                      }}
                      className={`glass-container ${getShadowClass(shadow)} ${getHoverEffectClass(hoverEffect)} ${isEditing ? 'hover:opacity-80' : ''} transition-all duration-300 ease-out`}
                    />
                  )}
                  {image.caption && (
                    <p className="text-sm text-gray-600 mt-3 italic px-4">
                      {image.caption}
                    </p>
                  )}
                  {isEditing && (
                    <div className="mt-2 px-4">
                      <p className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-center">
                        💡 이미지를 클릭하여 편집하세요
                      </p>
                    </div>
                  )}
                  {image.link && (
                    <p className="text-xs text-blue-600 mt-1 opacity-75">
                      🔗 클릭 시 이동: {image.link}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // 스토리 모드 - 강제 중앙 정렬
            <div className="flex flex-col space-y-4 items-center">
              {images.map((image, index) => (
                <div key={image.id} className="mb-4" style={{ width: containerWidth === 100 ? '100%' : 'auto' }}>
                  {image.link && !isEditing ? (
                    <a
                      href={image.link}
                      target={image.linkTarget || '_blank'}
                      rel="noopener noreferrer"
                      className="inline-block cursor-pointer hover:opacity-90 transition-opacity w-full"
                      style={{ display: 'block' }}
                    >
                      <img
                        src={image.src}
                        alt={image.alt || ''}
                        style={{
                          width: containerWidth === 100 ? '100%' : 'auto',
                        maxWidth: '100%',
                          height: 'auto',
                          borderRadius: containerWidth < 100 ? `${borderRadius}px` : '0',
                          aspectRatio: aspectRatio !== 'auto' ? aspectRatio : undefined,
                          objectFit: aspectRatio !== 'auto' ? 'cover' : 'contain',
                          display: 'block',
                          marginBottom: index < images.length - 1 ? `${padding / 2}px` : '0',
                          transition: 'all 0.3s ease'
                        }}
                        className={`${getShadowClass(shadow)} ${getHoverEffectClass(hoverEffect)} transition-all duration-300 ease-out`}
                      />
                    </a>
                  ) : (
                    <img
                      src={image.src}
                      alt={image.alt || ''}
                      onClick={() => isEditing && setIsEditingImages(true)}
                      style={{
                        width: containerWidth === 100 ? '100%' : 'auto',
                        maxWidth: '100%',
                        height: 'auto',
                        borderRadius: containerWidth < 100 ? `${borderRadius}px` : '0',
                        aspectRatio: aspectRatio !== 'auto' ? aspectRatio : undefined,
                        objectFit: aspectRatio !== 'auto' ? 'cover' : 'contain',
                        display: 'block',
                        marginBottom: index < images.length - 1 ? `${padding / 2}px` : '0',
                        cursor: isEditing ? 'pointer' : 'default',
                        transition: 'all 0.3s ease'
                      }}
                      className={`${isEditing ? 'hover:opacity-80 transition-all' : ''}`}
                    />
                  )}
                  {image.caption && (
                    <p className="text-sm text-gray-600 mt-2 italic px-4">
                      {image.caption}
                    </p>
                  )}
                  {isEditing && (
                    <div className="mt-2 px-4">
                      <p className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-center">
                        💡 이미지를 클릭하여 편집하세요
                      </p>
                    </div>
                  )}
                  {image.link && !isEditing && (
                    <p className="text-xs text-blue-600 mt-1 opacity-75">
                      🔗 클릭하여 이동
                    </p>
                  )}
                </div>
              ))}
            </div>
          )
        ) : (
          isEditing && (
            <div
              className="text-center py-12 text-gray-500 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
              onClick={() => setIsEditingImages(true)}
            >
              <div className="mb-4">
                <ImageIcon className="w-16 h-16 mx-auto text-blue-400" />
              </div>
              <p className="text-lg font-medium text-blue-600">이미지 추가</p>
              <p className="text-sm mt-1 text-blue-500">클릭해서 이미지를 선택하세요</p>
              <div className="flex gap-2 justify-center mt-6">
                <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  📁 파일 업로드
                </div>
                <div className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  🗂️ 스토리지 선택
                </div>
                <div className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  🔗 URL 입력
                </div>
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
        fileType="image"
        mode="select"
      />
    </div>
  )
}
