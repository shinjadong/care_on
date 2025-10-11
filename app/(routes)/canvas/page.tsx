'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ImageUploader } from '@/components/canvas/ImageUploader'
import { PreferencesDialog } from '@/components/canvas/PreferencesDialog'
import { BlogEditor } from '@/components/canvas/BlogEditor'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Loader2, Sparkles, ArrowRight, ImagePlus } from 'lucide-react'
import { toast } from 'sonner'
import { trpc } from '@/lib/presentation/api/trpc/client'

interface Preferences {
  tone: 'formal' | 'casual' | 'professional' | 'friendly'
  length: 'short' | 'medium' | 'long'
}

interface GeneratedBlog {
  id: string
  title: string
  content: string
  tags: string[]
  status: string
}

export default function CanvasPage() {
  const router = useRouter()
  const [step, setStep] = useState<'upload' | 'generating' | 'editing'>('upload')
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [preferencesOpen, setPreferencesOpen] = useState(false)
  const [preferences, setPreferences] = useState<Preferences>({
    tone: 'professional',
    length: 'medium',
  })
  const [generatedBlog, setGeneratedBlog] = useState<GeneratedBlog | null>(null)

  // tRPC mutations
  const generateBlogMutation = trpc.canvas.generateBlog.useMutation()
  const updateMutation = trpc.canvas.update.useMutation()
  const publishMutation = trpc.canvas.publish.useMutation()

  const handleImagesSelected = (files: File[]) => {
    setSelectedImages(files)
  }

  const handleGenerateClick = () => {
    if (selectedImages.length === 0) {
      toast.error('최소 1개 이상의 이미지를 업로드해주세요')
      return
    }
    setPreferencesOpen(true)
  }

  const handlePreferencesConfirm = async (prefs: Preferences) => {
    setPreferences(prefs)
    setPreferencesOpen(false)
    await generateBlog(prefs)
  }

  const generateBlog = async (prefs: Preferences) => {
    setStep('generating')

    try {
      // Convert files to base64
      const imagesData = await Promise.all(
        selectedImages.map(async (file) => {
          const buffer = await file.arrayBuffer()
          const base64 = Buffer.from(buffer).toString('base64')
          return {
            name: file.name,
            type: file.type,
            size: file.size,
            data: base64,
          }
        })
      )

      // Call tRPC API to generate blog with AI
      const result = await generateBlogMutation.mutateAsync({
        images: imagesData,
        preferences: prefs,
      })

      // Set generated blog from API response
      const generatedBlog: GeneratedBlog = {
        id: result.id,
        title: result.title,
        content: result.content,
        tags: result.metadata?.tags || [],
        status: result.status,
      }

      setGeneratedBlog(generatedBlog)
      setStep('editing')
      toast.success('블로그가 성공적으로 생성되었습니다!')
    } catch (error) {
      console.error('블로그 생성 실패:', error)
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다'
      toast.error(`블로그 생성 실패: ${errorMessage}`)
      setStep('upload')
    }
  }

  const handleTitleChange = (newTitle: string) => {
    if (generatedBlog) {
      setGeneratedBlog({ ...generatedBlog, title: newTitle })
    }
  }

  const handleContentChange = (newContent: string) => {
    if (generatedBlog) {
      setGeneratedBlog({ ...generatedBlog, content: newContent })
    }
  }

  const handleSave = async () => {
    if (!generatedBlog) return

    try {
      // Call tRPC API to save blog
      await updateMutation.mutateAsync({
        id: generatedBlog.id,
        title: generatedBlog.title,
        content: generatedBlog.content,
      })

      toast.success('블로그가 저장되었습니다')
    } catch (error) {
      console.error('저장 실패:', error)
      const errorMessage = error instanceof Error ? error.message : '저장에 실패했습니다'
      toast.error(errorMessage)
    }
  }

  const handlePublish = async () => {
    if (!generatedBlog) return

    try {
      // Call tRPC API to publish blog
      await publishMutation.mutateAsync({ id: generatedBlog.id })

      toast.success('블로그가 발행되었습니다!')
      router.push('/my/blogs')
    } catch (error) {
      console.error('발행 실패:', error)
      const errorMessage = error instanceof Error ? error.message : '발행에 실패했습니다'
      toast.error(errorMessage)
    }
  }

  const handleRegenerate = () => {
    setPreferencesOpen(true)
  }

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI 블로그 생성</h1>
        <p className="text-muted-foreground">
          이미지를 업로드하면 AI가 자동으로 맥락에 맞는 블로그를 생성합니다
        </p>
      </div>

      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 ${
              step === 'upload' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                step === 'upload'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              1
            </div>
            <span className="font-medium">이미지 업로드</span>
          </div>

          <ArrowRight className="text-muted-foreground" />

          <div
            className={`flex items-center gap-2 ${
              step === 'generating' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                step === 'generating'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              2
            </div>
            <span className="font-medium">AI 생성</span>
          </div>

          <ArrowRight className="text-muted-foreground" />

          <div
            className={`flex items-center gap-2 ${
              step === 'editing' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                step === 'editing'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              3
            </div>
            <span className="font-medium">편집 & 발행</span>
          </div>
        </div>
      </div>

      {/* Content */}
      {step === 'upload' && (
        <div className="space-y-6">
          <ImageUploader onImagesSelected={handleImagesSelected} />

          {selectedImages.length > 0 && (
            <div className="flex justify-end">
              <Button size="lg" onClick={handleGenerateClick}>
                <Sparkles className="mr-2 h-5 w-5" />
                AI 블로그 생성하기
              </Button>
            </div>
          )}
        </div>
      )}

      {step === 'generating' && (
        <Card className="p-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <h2 className="text-2xl font-semibold">블로그를 생성하고 있습니다...</h2>
            <p className="text-muted-foreground max-w-md">
              업로드하신 이미지를 분석하고, 사업체 정보를 바탕으로 맥락에 맞는
              블로그를 작성하고 있습니다. 잠시만 기다려주세요.
            </p>
            <div className="flex gap-2 mt-4">
              <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 rounded-full bg-primary animate-bounce"></div>
            </div>
          </div>
        </Card>
      )}

      {step === 'editing' && generatedBlog && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setStep('upload')}>
                <ImagePlus className="mr-2 h-4 w-4" />
                새로 만들기
              </Button>
              <Button variant="outline" size="sm" onClick={handleRegenerate}>
                <Sparkles className="mr-2 h-4 w-4" />
                다시 생성
              </Button>
            </div>
          </div>

          <BlogEditor
            title={generatedBlog.title}
            content={generatedBlog.content}
            tags={generatedBlog.tags}
            onTitleChange={handleTitleChange}
            onContentChange={handleContentChange}
            onSave={handleSave}
            onPublish={handlePublish}
          />
        </div>
      )}

      {/* Preferences Dialog */}
      <PreferencesDialog
        open={preferencesOpen}
        onOpenChange={setPreferencesOpen}
        onConfirm={handlePreferencesConfirm}
        initialPreferences={preferences}
      />
    </div>
  )
}
