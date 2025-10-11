'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import ReactMarkdown from 'react-markdown'
import { Eye, Edit, Save, Send } from 'lucide-react'

interface BlogEditorProps {
  title: string
  content: string
  tags?: string[]
  onTitleChange: (title: string) => void
  onContentChange: (content: string) => void
  onSave?: () => void
  onPublish?: () => void
  readOnly?: boolean
}

export function BlogEditor({
  title,
  content,
  tags = [],
  onTitleChange,
  onContentChange,
  onSave,
  onPublish,
  readOnly = false,
}: BlogEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')

  return (
    <Card className="flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">블로그 에디터</h2>
          {tags.length > 0 && (
            <div className="flex gap-1">
              {tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge variant="secondary">+{tags.length - 3}</Badge>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!readOnly && onSave && (
            <Button variant="outline" size="sm" onClick={onSave}>
              <Save className="mr-2 h-4 w-4" />
              저장
            </Button>
          )}
          {!readOnly && onPublish && (
            <Button size="sm" onClick={onPublish}>
              <Send className="mr-2 h-4 w-4" />
              발행
            </Button>
          )}
        </div>
      </div>

      {/* Title Editor */}
      <div className="border-b p-4">
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="블로그 제목을 입력하세요"
          className="text-2xl font-bold border-none shadow-none focus-visible:ring-0"
          readOnly={readOnly}
        />
      </div>

      {/* Content Editor/Preview */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as typeof activeTab)}
        className="flex flex-1 flex-col"
      >
        <div className="border-b px-4">
          <TabsList>
            <TabsTrigger value="edit" className="gap-2">
              <Edit className="h-4 w-4" />
              편집
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2">
              <Eye className="h-4 w-4" />
              미리보기
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="edit" className="flex-1 p-0 mt-0">
          <Textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="마크다운 형식으로 내용을 작성하세요..."
            className="min-h-[500px] resize-none rounded-none border-none shadow-none focus-visible:ring-0 font-mono"
            readOnly={readOnly}
          />
        </TabsContent>

        <TabsContent value="preview" className="flex-1 p-0 mt-0">
          <div className="prose prose-slate max-w-none p-6 overflow-auto max-h-[500px]">
            {content ? (
              <ReactMarkdown>{content}</ReactMarkdown>
            ) : (
              <p className="text-muted-foreground italic">
                미리보기할 내용이 없습니다.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer Info */}
      <div className="border-t bg-muted/30 px-4 py-2 text-sm text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>마크다운 지원: **굵게**, *기울임*, # 제목</span>
          <span>{content.length} 글자</span>
        </div>
      </div>
    </Card>
  )
}
