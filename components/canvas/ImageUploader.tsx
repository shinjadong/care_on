'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, X, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ImageFile {
  file: File
  preview: string
  id: string
}

interface ImageUploaderProps {
  onImagesSelected: (files: File[]) => void
  maxImages?: number
  maxSizeMB?: number
}

export function ImageUploader({
  onImagesSelected,
  maxImages = 10,
  maxSizeMB = 5,
}: ImageUploaderProps) {
  const [images, setImages] = useState<ImageFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return `${file.name}은(는) 이미지 파일이 아닙니다.`
    }

    // Check file size
    const maxSize = maxSizeMB * 1024 * 1024
    if (file.size > maxSize) {
      return `${file.name}의 크기가 ${maxSizeMB}MB를 초과합니다. (${(file.size / 1024 / 1024).toFixed(2)}MB)`
    }

    return null
  }

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return

      setError(null)

      // Convert FileList to Array
      const fileArray = Array.from(files)

      // Check max images
      if (images.length + fileArray.length > maxImages) {
        setError(`최대 ${maxImages}개의 이미지만 업로드할 수 있습니다.`)
        return
      }

      // Validate and process files
      const validFiles: ImageFile[] = []
      const errors: string[] = []

      fileArray.forEach((file) => {
        const validationError = validateFile(file)
        if (validationError) {
          errors.push(validationError)
        } else {
          const id = Math.random().toString(36).substring(7)
          const preview = URL.createObjectURL(file)
          validFiles.push({ file, preview, id })
        }
      })

      if (errors.length > 0) {
        setError(errors.join('\n'))
      }

      if (validFiles.length > 0) {
        const newImages = [...images, ...validFiles]
        setImages(newImages)
        onImagesSelected(newImages.map((img) => img.file))
      }
    },
    [images, maxImages, maxSizeMB, onImagesSelected]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files)
    },
    [handleFiles]
  )

  const removeImage = useCallback(
    (id: string) => {
      const newImages = images.filter((img) => img.id !== id)
      setImages(newImages)
      onImagesSelected(newImages.map((img) => img.file))

      // Revoke object URL to free memory
      const removed = images.find((img) => img.id === id)
      if (removed) {
        URL.revokeObjectURL(removed.preview)
      }
    },
    [images, onImagesSelected]
  )

  const clearAll = useCallback(() => {
    images.forEach((img) => URL.revokeObjectURL(img.preview))
    setImages([])
    onImagesSelected([])
    setError(null)
  }, [images, onImagesSelected])

  return (
    <div className="w-full space-y-4">
      {/* Upload Area */}
      <Card
        className={cn(
          'border-2 border-dashed p-8 text-center transition-colors',
          isDragging && 'border-primary bg-primary/5',
          error && 'border-destructive'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileInput}
        />

        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-primary/10 p-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">이미지를 업로드하세요</h3>
            <p className="text-sm text-muted-foreground">
              드래그 앤 드롭하거나 클릭하여 선택하세요
            </p>
            <p className="text-xs text-muted-foreground">
              최대 {maxImages}개 · 파일당 최대 {maxSizeMB}MB · JPG, PNG, WebP
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            파일 선택
          </Button>
        </div>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          <pre className="whitespace-pre-wrap font-sans">{error}</pre>
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              선택된 이미지 ({images.length}/{maxImages})
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearAll}
            >
              모두 제거
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {images.map((image) => (
              <div key={image.id} className="group relative aspect-square">
                <img
                  src={image.preview}
                  alt={image.file.name}
                  className="h-full w-full rounded-lg object-cover"
                />

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute right-2 top-2 rounded-full bg-destructive p-1 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-4 w-4 text-destructive-foreground" />
                </button>

                {/* File info overlay */}
                <div className="absolute bottom-0 left-0 right-0 rounded-b-lg bg-black/60 p-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="truncate">{image.file.name}</p>
                  <p>{(image.file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
