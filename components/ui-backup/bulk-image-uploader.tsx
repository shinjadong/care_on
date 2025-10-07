"use client"

import { useState } from 'react'
import { Upload, X, CheckCircle, AlertCircle, Trash2 } from 'lucide-react'

interface UploadItem {
  file: File
  status: 'pending' | 'uploading' | 'success' | 'error'
  url?: string
  error?: string
  progress?: number
}

interface BulkImageUploaderProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export function BulkImageUploader({ isOpen, onClose, onComplete }: BulkImageUploaderProps) {
  const [uploadItems, setUploadItems] = useState<UploadItem[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    )
    
    if (files.length > 0) {
      addFiles(files)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const imageFiles = Array.from(files).filter(file => 
        file.type.startsWith('image/')
      )
      addFiles(imageFiles)
    }
  }

  const addFiles = (files: File[]) => {
    const newItems: UploadItem[] = files.map(file => ({
      file,
      status: 'pending'
    }))
    setUploadItems(prev => [...prev, ...newItems])
  }

  const removeFile = (index: number) => {
    setUploadItems(prev => prev.filter((_, i) => i !== index))
  }

  const uploadAll = async () => {
    if (uploadItems.length === 0) return
    
    setIsUploading(true)
    
    for (let i = 0; i < uploadItems.length; i++) {
      const item = uploadItems[i]
      if (item.status !== 'pending') continue
      
      try {
        // 상태를 uploading으로 변경
        setUploadItems(prev => prev.map((prevItem, idx) => 
          idx === i ? { ...prevItem, status: 'uploading' } : prevItem
        ))

        const formData = new FormData()
        formData.append('file', item.file)
        
        const response = await fetch('/api/media/upload', {
          method: 'POST',
          body: formData
        })
        
        const result = await response.json()
        
        if (result.success) {
          // 성공
          setUploadItems(prev => prev.map((prevItem, idx) => 
            idx === i ? { 
              ...prevItem, 
              status: 'success',
              url: result.data.url 
            } : prevItem
          ))
        } else {
          // 실패
          setUploadItems(prev => prev.map((prevItem, idx) => 
            idx === i ? { 
              ...prevItem, 
              status: 'error',
              error: result.error || 'Upload failed' 
            } : prevItem
          ))
        }
      } catch (error) {
        // 에러
        setUploadItems(prev => prev.map((prevItem, idx) => 
          idx === i ? { 
            ...prevItem, 
            status: 'error',
            error: error instanceof Error ? error.message : 'Upload failed' 
          } : prevItem
        ))
      }
    }
    
    setIsUploading(false)
    onComplete()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusIcon = (status: UploadItem['status']) => {
    switch (status) {
      case 'pending':
        return <Upload className="w-4 h-4 text-gray-400" />
      case 'uploading':
        return <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />
    }
  }

  const clearCompleted = () => {
    setUploadItems(prev => prev.filter(item => item.status === 'pending' || item.status === 'uploading'))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">이미지 대량 업로드</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 업로드 영역 */}
        <div className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="bulk-file-input"
            />
            <label htmlFor="bulk-file-input" className="cursor-pointer">
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                이미지를 드래그하거나 클릭하여 선택
              </p>
              <p className="text-sm text-gray-500">
                JPG, PNG, GIF, WEBP 지원 (개당 최대 10MB)
              </p>
            </label>
          </div>
        </div>

        {/* 파일 목록 */}
        {uploadItems.length > 0 && (
          <div className="flex-1 overflow-auto px-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">
                업로드 목록 ({uploadItems.length}개)
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={clearCompleted}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  완료된 항목 제거
                </button>
              </div>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {uploadItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    {getStatusIcon(item.status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(item.file.size)}
                    </p>
                    {item.error && (
                      <p className="text-xs text-red-600 mt-1">
                        {item.error}
                      </p>
                    )}
                  </div>
                  
                  {item.status === 'pending' && (
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  
                  {item.status === 'success' && item.url && (
                    <img
                      src={item.url}
                      alt=""
                      className="w-8 h-8 object-cover rounded"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 푸터 */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {uploadItems.filter(item => item.status === 'success').length}개 업로드 완료 / 총 {uploadItems.length}개
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={uploadAll}
                disabled={uploadItems.length === 0 || isUploading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUploading ? '업로드 중...' : `${uploadItems.filter(item => item.status === 'pending').length}개 업로드`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
