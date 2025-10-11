'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card } from '@/components/ui/card'

interface Preferences {
  tone: 'formal' | 'casual' | 'professional' | 'friendly'
  length: 'short' | 'medium' | 'long'
}

interface PreferencesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (preferences: Preferences) => void
  initialPreferences?: Preferences
}

const toneOptions = [
  {
    value: 'formal' as const,
    label: '격식체',
    description: '격식 있고 전문적인 어조로, 경어 사용',
  },
  {
    value: 'casual' as const,
    label: '캐주얼',
    description: '친근하고 편안한 어조로, 반말 또는 가벼운 존댓말',
  },
  {
    value: 'professional' as const,
    label: '전문적',
    description: '전문적이면서도 접근하기 쉬운 어조',
  },
  {
    value: 'friendly' as const,
    label: '친근함',
    description: '다정하고 공감하는 어조로, 독자와의 대화처럼',
  },
]

const lengthOptions = [
  {
    value: 'short' as const,
    label: '짧게',
    description: '500-800자 (약 3-5분 읽기 분량)',
  },
  {
    value: 'medium' as const,
    label: '보통',
    description: '1000-1500자 (약 5-8분 읽기 분량)',
  },
  {
    value: 'long' as const,
    label: '길게',
    description: '2000-3000자 (약 10-15분 읽기 분량)',
  },
]

export function PreferencesDialog({
  open,
  onOpenChange,
  onConfirm,
  initialPreferences = {
    tone: 'professional',
    length: 'medium',
  },
}: PreferencesDialogProps) {
  const [tone, setTone] = useState<Preferences['tone']>(initialPreferences.tone)
  const [length, setLength] = useState<Preferences['length']>(
    initialPreferences.length
  )

  const handleConfirm = () => {
    onConfirm({ tone, length })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>블로그 생성 옵션</DialogTitle>
          <DialogDescription>
            원하시는 글의 스타일과 길이를 선택하세요
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Tone Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">글의 어조</Label>
            <RadioGroup value={tone} onValueChange={(v) => setTone(v as typeof tone)}>
              <div className="space-y-2">
                {toneOptions.map((option) => (
                  <Card
                    key={option.value}
                    className={`cursor-pointer transition-colors ${
                      tone === option.value
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setTone(option.value)}
                  >
                    <div className="flex items-start gap-3 p-4">
                      <RadioGroupItem
                        value={option.value}
                        id={`tone-${option.value}`}
                      />
                      <div className="flex-1 space-y-1">
                        <Label
                          htmlFor={`tone-${option.value}`}
                          className="cursor-pointer font-medium"
                        >
                          {option.label}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Length Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">글의 길이</Label>
            <RadioGroup
              value={length}
              onValueChange={(v) => setLength(v as typeof length)}
            >
              <div className="space-y-2">
                {lengthOptions.map((option) => (
                  <Card
                    key={option.value}
                    className={`cursor-pointer transition-colors ${
                      length === option.value
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setLength(option.value)}
                  >
                    <div className="flex items-start gap-3 p-4">
                      <RadioGroupItem
                        value={option.value}
                        id={`length-${option.value}`}
                      />
                      <div className="flex-1 space-y-1">
                        <Label
                          htmlFor={`length-${option.value}`}
                          className="cursor-pointer font-medium"
                        >
                          {option.label}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleConfirm}>확인</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
