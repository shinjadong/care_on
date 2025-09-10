"use client"

import { useState, useRef } from "react"
import { Upload, Camera, FileImage, X, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DocumentUploaderProps {
  label: string
  description: string
  accept?: string
  value?: string
  onChange: (url: string) => void
  required?: boolean
  icon?: React.ReactNode
}

export function DocumentUploader({
  label,
  description,
  accept = "image/*",
  value,
  onChange,
  required = false,
  icon
}: DocumentUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 파일 크기 검증 (10MB 제한)
    if (file.size > 10 * 1024 * 1024) {
      setError("파일 크기는 10MB 이하여야 합니다.")
      return
    }

    // 이미지 파일 형식 검증
    if (!file.type.startsWith('image/')) {
      setError("이미지 파일만 업로드 가능합니다.")
      return
    }

    setIsUploading(true)
    setError("")

    try {
      // Supabase Storage에 업로드
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', 'care-on')
      formData.append('folder', 'contracts')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('업로드에 실패했습니다.')
      }

      const result = await response.json()
      onChange(result.url)
    } catch (err) {
      console.error('문서 업로드 오류:', err)
      setError(err instanceof Error ? err.message : '업로드 중 오류가 발생했습니다.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleCameraCapture = () => {
    // 모바일에서 카메라 직접 촬영
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment')
      fileInputRef.current.click()
    }
  }

  const handleFileSelect2 = () => {
    // 갤러리에서 파일 선택
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute('capture')
      fileInputRef.current.click()
    }
  }

  const handleRemove = () => {
    onChange("")
    setError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {icon}
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      </div>
      
      <p className="text-xs text-gray-500">{description}</p>

      {value ? (
        // 업로드된 이미지 표시
        <div className="relative border border-gray-200 rounded-lg overflow-hidden">
          <img 
            src={value} 
            alt={label}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <div className="bg-green-500 text-white p-1.5 rounded-full">
              <CheckCircle className="w-4 h-4" />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-xs">
            {label} 업로드 완료
          </div>
        </div>
      ) : (
        // 업로드 버튼들
        <div className="space-y-3">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <FileImage className="w-12 h-12 text-gray-400" />
              <p className="text-sm text-gray-600">
                {isUploading ? "업로드 중..." : `${label}을(를) 업로드해주세요`}
              </p>
              
              {!isUploading && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCameraCapture}
                    className="flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    카메라로 촬영
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleFileSelect2}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    갤러리에서 선택
                  </Button>
                </div>
              )}
              
              {isUploading && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
                  업로드 중...
                </div>
              )}
            </div>
          </div>
          
          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}