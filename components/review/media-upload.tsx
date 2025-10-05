"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Upload, ImageIcon, Video, Youtube, Loader2, CheckCircle2, AlertCircle } from "lucide-react"

interface MediaFile {
  id: string
  url: string
  type: "image" | "video"
  fileName: string
  uploadStatus?: "uploading" | "success" | "error"
  uploadProgress?: number
}

interface MediaUploadProps {
  onMediaChange: (images: string[], videos: string[], youtubeUrls: string[]) => void
  initialImages?: string[]
  initialVideos?: string[]
  initialYoutubeUrls?: string[]
}

export function MediaUpload({
  onMediaChange,
  initialImages = [],
  initialVideos = [],
  initialYoutubeUrls = [],
}: MediaUploadProps) {
  const [images, setImages] = useState<MediaFile[]>(
    initialImages.map((url, index) => ({
      id: `img-${index}`,
      url,
      type: "image" as const,
      fileName: url.split("/").pop() || "",
      uploadStatus: "success" as const,
    })),
  )
  const [videos, setVideos] = useState<MediaFile[]>(
    initialVideos.map((url, index) => ({
      id: `vid-${index}`,
      url,
      type: "video" as const,
      fileName: url.split("/").pop() || "",
      uploadStatus: "success" as const,
    })),
  )
  const [youtubeUrls, setYoutubeUrls] = useState<string[]>(initialYoutubeUrls)
  const [youtubeInput, setYoutubeInput] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const updateParent = (newImages: MediaFile[], newVideos: MediaFile[], newYoutubeUrls: string[]) => {
    onMediaChange(
      newImages.filter(img => img.uploadStatus === "success").map((img) => img.url),
      newVideos.filter(vid => vid.uploadStatus === "success").map((vid) => vid.url),
      newYoutubeUrls,
    )
  }

  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return

    const tempFiles: MediaFile[] = []
    
    // 먼저 임시 파일 객체들을 생성하고 UI에 표시
    for (const file of Array.from(files)) {
      const tempId = `${Date.now()}-${Math.random()}`
      const tempFile: MediaFile = {
        id: tempId,
        url: URL.createObjectURL(file), // 임시 미리보기 URL
        type: file.type.startsWith("image/") ? "image" : "video",
        fileName: file.name,
        uploadStatus: "uploading",
        uploadProgress: 0,
      }
      tempFiles.push(tempFile)
    }

    // UI 즉시 업데이트
    if (tempFiles.some(f => f.type === "image")) {
      setImages(prev => [...prev, ...tempFiles.filter(f => f.type === "image")])
    }
    if (tempFiles.some(f => f.type === "video")) {
      setVideos(prev => [...prev, ...tempFiles.filter(f => f.type === "video")])
    }

    // 실제 업로드 진행
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const tempFile = tempFiles[i]
      
      try {
        const maxSize = 100 * 1024 * 1024 // 100MB
        if (file.size > maxSize) {
          throw new Error(`파일 크기가 너무 큽니다 (최대 100MB)`)
        }

        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        let result
        try {
          result = await response.json()
        } catch (jsonError) {
          console.error("JSON parsing error:", jsonError)
          throw new Error("서버에서 올바르지 않은 응답을 받았습니다")
        }

        if (!response.ok) {
          throw new Error(result.error || "업로드 실패")
        }

        // 성공 시 실제 URL로 업데이트
        const updateFile = (files: MediaFile[]) =>
          files.map(f => f.id === tempFile.id 
            ? { ...f, url: result.url, fileName: result.fileName, uploadStatus: "success" as const }
            : f
          )

        if (tempFile.type === "image") {
          setImages(prev => {
            const updated = updateFile(prev)
            updateParent(updated, videos, youtubeUrls)
            return updated
          })
        } else {
          setVideos(prev => {
            const updated = updateFile(prev)
            updateParent(images, updated, youtubeUrls)
            return updated
          })
        }
      } catch (error) {
        console.error("Upload error:", error)
        const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류"
        
        // 에러 상태로 업데이트
        const updateFile = (files: MediaFile[]) =>
          files.map(f => f.id === tempFile.id 
            ? { ...f, uploadStatus: "error" as const }
            : f
          )

        if (tempFile.type === "image") {
          setImages(prev => updateFile(prev))
        } else {
          setVideos(prev => updateFile(prev))
        }
        
        alert(`${file.name}: ${errorMessage}`)
      }
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  const removeMedia = async (id: string, type: "image" | "video") => {
    const mediaArray = type === "image" ? images : videos
    const mediaItem = mediaArray.find((item) => item.id === id)

    if (mediaItem && mediaItem.uploadStatus === "success") {
      try {
        await fetch(`/api/upload?fileName=${mediaItem.fileName}`, {
          method: "DELETE",
        })
      } catch (error) {
        console.error("Delete error:", error)
      }
    }

    if (type === "image") {
      const updatedImages = images.filter((img) => img.id !== id)
      setImages(updatedImages)
      updateParent(updatedImages, videos, youtubeUrls)
    } else {
      const updatedVideos = videos.filter((vid) => vid.id !== id)
      setVideos(updatedVideos)
      updateParent(images, updatedVideos, youtubeUrls)
    }
  }

  const addYoutubeUrl = () => {
    if (!youtubeInput.trim()) return

    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
    if (!youtubeRegex.test(youtubeInput)) {
      alert("올바른 YouTube URL을 입력해주세요")
      return
    }

    const updatedYoutubeUrls = [...youtubeUrls, youtubeInput.trim()]
    setYoutubeUrls(updatedYoutubeUrls)
    updateParent(images, videos, updatedYoutubeUrls)
    setYoutubeInput("")
  }

  const removeYoutubeUrl = (index: number) => {
    const updatedYoutubeUrls = youtubeUrls.filter((_, i) => i !== index)
    setYoutubeUrls(updatedYoutubeUrls)
    updateParent(images, videos, updatedYoutubeUrls)
  }

  const getYoutubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : url
  }

  return (
    <div className="space-y-6">
      {/* File Upload Section */}
      <div>
        <Label className="text-sm font-medium mb-2 block">이미지 및 동영상 업로드</Label>
        <div 
          className={`
            border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
            ${dragActive 
              ? "border-brand bg-brand/5 scale-[1.02]" 
              : "border-gray-300 hover:border-gray-400 bg-gray-50/50"
            }
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            className="hidden"
          />
          <Upload className={`mx-auto h-12 w-12 mb-4 transition-colors ${
            dragActive ? "text-brand" : "text-gray-400"
          }`} />
          <p className="text-sm text-gray-700 font-medium mb-2">
            {dragActive ? "여기에 놓으세요!" : "클릭하거나 파일을 드래그하세요"}
          </p>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            className="hover:bg-brand hover:text-white hover:border-brand transition-colors"
          >
            파일 선택
          </Button>
          <p className="text-xs text-gray-500 mt-3">최대 100MB, JPG, PNG, GIF, MP4, WebM 지원</p>
        </div>
      </div>

      {/* YouTube URL Section */}
      <div>
        <Label className="text-sm font-medium mb-2 block">YouTube 링크</Label>
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="YouTube URL을 입력하세요"
            value={youtubeInput}
            onChange={(e) => setYoutubeInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addYoutubeUrl())}
            className="focus:border-brand focus:ring-1 focus:ring-brand"
          />
          <Button type="button" onClick={addYoutubeUrl} variant="outline" className="hover:bg-brand hover:text-white hover:border-brand">
            <Youtube className="h-4 w-4 mr-2" />
            추가
          </Button>
        </div>
      </div>

      {/* Preview Section */}
      {(images.length > 0 || videos.length > 0 || youtubeUrls.length > 0) && (
        <div className="space-y-6 p-4 bg-gray-50 rounded-xl">
          <Label className="text-sm font-medium">업로드된 미디어</Label>

          {/* Images */}
          {images.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <ImageIcon className="h-4 w-4 mr-2" />
                이미지 ({images.filter(i => i.uploadStatus === "success").length}/{images.length})
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt="업로드된 이미지"
                        className="w-full h-full object-cover"
                      />
                      
                      {/* 업로드 상태 오버레이 */}
                      {image.uploadStatus === "uploading" && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <div className="text-center">
                            <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-2" />
                            <p className="text-xs text-white">업로드 중...</p>
                          </div>
                        </div>
                      )}
                      
                      {image.uploadStatus === "error" && (
                        <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center">
                          <AlertCircle className="w-8 h-8 text-white" />
                        </div>
                      )}
                      
                      {image.uploadStatus === "success" && (
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => removeMedia(image.id, "image")}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Videos */}
          {videos.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <Video className="h-4 w-4 mr-2" />
                동영상 ({videos.filter(v => v.uploadStatus === "success").length}/{videos.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {videos.map((video) => (
                  <div key={video.id} className="relative group">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                      {video.uploadStatus === "success" ? (
                        <video src={video.url} className="w-full h-full object-cover" controls />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {video.uploadStatus === "uploading" ? (
                            <div className="text-center">
                              <Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-2" />
                              <p className="text-xs text-gray-500">업로드 중...</p>
                            </div>
                          ) : (
                            <AlertCircle className="w-8 h-8 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMedia(video.id, "video")}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* YouTube Videos */}
          {youtubeUrls.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <Youtube className="h-4 w-4 mr-2" />
                YouTube 동영상 ({youtubeUrls.length})
              </h4>
              <div className="space-y-3">
                {youtubeUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <iframe src={getYoutubeEmbedUrl(url)} className="w-full h-full" allowFullScreen />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeYoutubeUrl(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}