"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Upload, ImageIcon, Video, Youtube } from "lucide-react"

interface MediaFile {
  id: string
  url: string
  type: "image" | "video"
  fileName: string
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
    })),
  )
  const [videos, setVideos] = useState<MediaFile[]>(
    initialVideos.map((url, index) => ({
      id: `vid-${index}`,
      url,
      type: "video" as const,
      fileName: url.split("/").pop() || "",
    })),
  )
  const [youtubeUrls, setYoutubeUrls] = useState<string[]>(initialYoutubeUrls)
  const [youtubeInput, setYoutubeInput] = useState("")
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const updateParent = (newImages: MediaFile[], newVideos: MediaFile[], newYoutubeUrls: string[]) => {
    onMediaChange(
      newImages.map((img) => img.url),
      newVideos.map((vid) => vid.url),
      newYoutubeUrls,
    )
  }

  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return

    setUploading(true)
    const newImages: MediaFile[] = []
    const newVideos: MediaFile[] = []

    for (const file of Array.from(files)) {
      try {
        const maxSize = 100 * 1024 * 1024 // 100MB
        if (file.size > maxSize) {
          alert(`파일 크기가 너무 큽니다: ${file.name} (최대 100MB)`)
          continue
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

        const mediaFile: MediaFile = {
          id: `${Date.now()}-${Math.random()}`,
          url: result.url,
          type: file.type.startsWith("image/") ? "image" : "video",
          fileName: result.fileName,
        }

        if (mediaFile.type === "image") {
          newImages.push(mediaFile)
        } else {
          newVideos.push(mediaFile)
        }
      } catch (error) {
        console.error("Upload error:", error)
        const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류"
        alert(`파일 업로드 실패: ${file.name} - ${errorMessage}`)
      }
    }

    const updatedImages = [...images, ...newImages]
    const updatedVideos = [...videos, ...newVideos]

    setImages(updatedImages)
    setVideos(updatedVideos)
    updateParent(updatedImages, updatedVideos, youtubeUrls)
    setUploading(false)
  }

  const removeMedia = async (id: string, type: "image" | "video") => {
    const mediaArray = type === "image" ? images : videos
    const mediaItem = mediaArray.find((item) => item.id === id)

    if (mediaItem) {
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
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            className="hidden"
          />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 mb-4">이미지나 동영상을 드래그하거나 클릭하여 업로드하세요</p>
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading ? "업로드 중..." : "파일 선택"}
          </Button>
          <p className="text-xs text-gray-500 mt-2">최대 100MB, JPG, PNG, GIF, MP4, WebM 지원</p>
        </div>
      </div>

      {/* YouTube URL Section */}
      <div>
        <Label className="text-sm font-medium mb-2 block">YouTube 동영상 링크</Label>
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="YouTube URL을 입력하세요"
            value={youtubeInput}
            onChange={(e) => setYoutubeInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addYoutubeUrl()}
          />
          <Button type="button" onClick={addYoutubeUrl} variant="outline">
            <Youtube className="h-4 w-4 mr-2" />
            추가
          </Button>
        </div>
      </div>

      {/* Preview Section */}
      {(images.length > 0 || videos.length > 0 || youtubeUrls.length > 0) && (
        <div className="space-y-4">
          <Label className="text-sm font-medium">미리보기</Label>

          {/* Images */}
          {images.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <ImageIcon className="h-4 w-4 mr-1" />
                이미지 ({images.length})
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt="업로드된 이미지"
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeMedia(image.id, "image")}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Video className="h-4 w-4 mr-1" />
                동영상 ({videos.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos.map((video) => (
                  <div key={video.id} className="relative group">
                    <video src={video.url} className="w-full h-32 object-cover rounded-lg" controls />
                    <button
                      type="button"
                      onClick={() => removeMedia(video.id, "video")}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Youtube className="h-4 w-4 mr-1" />
                YouTube 동영상 ({youtubeUrls.length})
              </h4>
              <div className="space-y-4">
                {youtubeUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-video">
                      <iframe src={getYoutubeEmbedUrl(url)} className="w-full h-full rounded-lg" allowFullScreen />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeYoutubeUrl(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
