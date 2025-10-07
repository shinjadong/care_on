"use client"

import { useState, useEffect } from 'react'
import { X, Search, Clock, HardDrive } from 'lucide-react'

interface StorageImage {
  url: string
  filename: string
  size: number
  uploadedAt: string
}

interface StorageImageGalleryProps {
  isOpen: boolean
  onClose: () => void
  onSelectImage: (imageUrl: string) => void
  multiple?: boolean
}

export function StorageImageGallery({
  isOpen,
  onClose,
  onSelectImage,
  multiple = false
}: StorageImageGalleryProps) {
  const [images, setImages] = useState<StorageImage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedImages, setSelectedImages] = useState<string[]>([])

  // 이미지 목록 로드
  useEffect(() => {
    if (isOpen) {
      loadImages()
    }
  }, [isOpen])

  const loadImages = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/storage-images')
      const result = await response.json()
      
      if (result.success) {
        setImages(result.data)
      } else {
        setError(result.error || 'Failed to load images')
      }
    } catch (err) {
      console.error('Error loading images:', err)
      setError('Failed to load images')
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredImages = images.filter(image =>
    image.filename.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleImageClick = (imageUrl: string) => {
    if (multiple) {
      setSelectedImages(prev => {
        if (prev.includes(imageUrl)) {
          return prev.filter(url => url !== imageUrl)
        } else {
          return [...prev, imageUrl]
        }
      })
    } else {
      onSelectImage(imageUrl)
      onClose()
    }
  }

  const handleSelectMultiple = () => {
    selectedImages.forEach(url => onSelectImage(url))
    setSelectedImages([])
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <HardDrive className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            <h2 className="text-lg sm:text-xl font-semibold">
              <span className="hidden sm:inline">Supabase Storage</span>
              <span className="sm:hidden">이미지 선택</span>
            </h2>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {filteredImages.length}개
            </span>
          </div>
          <div className="flex items-center space-x-3">
            {multiple && selectedImages.length > 0 && (
              <button
                onClick={handleSelectMultiple}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                {selectedImages.length}개 선택완료
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 검색 */}
        <div className="px-6 py-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="이미지 파일명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 이미지 그리드 */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">이미지를 불러오는 중...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-2">⚠️ 오류 발생</div>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={loadImages}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                다시 시도
              </button>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <HardDrive className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              {searchTerm ? (
                <>
                  <p className="text-lg font-medium">검색 결과가 없습니다</p>
                  <p className="text-sm">'{searchTerm}'와 일치하는 이미지가 없습니다</p>
                </>
              ) : (
                <>
                  <p className="text-lg font-medium">저장된 이미지가 없습니다</p>
                  <p className="text-sm">이미지를 업로드하면 여기에 표시됩니다</p>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4">
              {filteredImages.map((image) => (
                <div
                  key={image.url}
                  className={`group relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                    multiple && selectedImages.includes(image.url)
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleImageClick(image.url)}
                >
                  {/* 이미지 */}
                  <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.filename}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* 선택 표시 */}
                  {multiple && selectedImages.includes(image.url) && (
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        ✓
                      </div>
                    </div>
                  )}
                  
                  {/* 오버레이 정보 */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-medium truncate mb-1">
                      {image.filename}
                    </p>
                    <div className="flex items-center text-white/80 text-xs space-x-3">
                      <span className="flex items-center">
                        <HardDrive className="w-3 h-3 mr-1" />
                        {formatFileSize(image.size)}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(image.uploadedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              총 {filteredImages.length}개의 이미지 
              {searchTerm && ` (${images.length}개 중 검색결과)`}
            </div>
            <div className="text-xs">
              {multiple ? '이미지를 클릭하여 다중 선택' : '이미지를 클릭하여 선택'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
