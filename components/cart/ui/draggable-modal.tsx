'use client'

import { useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './dialog'
import { Button } from './button'
import { X } from 'lucide-react'

interface DraggableModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  triggerElement?: HTMLElement | null
}

export function DraggableModal({ isOpen, onOpenChange, title, children, footer, triggerElement }: DraggableModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationOrigin, setAnimationOrigin] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (!isOpen) {
      // 모달이 닫힐 때 위치 초기화
      setPosition(null)
      setIsAnimating(false)
      setAnimationOrigin(null)
    } else if (triggerElement) {
      // 모달이 열릴 때 트리거 버튼의 위치를 가져옴
      const rect = triggerElement.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      // 뷰포트 중앙 좌표 계산
      const viewportCenterX = window.innerWidth / 2
      const viewportCenterY = window.innerHeight / 2
      
      // 버튼 위치에서 화면 중앙까지의 오프셋 계산
      const offsetX = centerX - viewportCenterX
      const offsetY = centerY - viewportCenterY
      
      setAnimationOrigin({ x: offsetX, y: offsetY })
      setIsAnimating(true)
      
      // 애니메이션 완료 후 isAnimating만 false로 (animationOrigin은 유지하여 깜빡임 방지)
      setTimeout(() => {
        setIsAnimating(false)
      }, 600) // 애니메이션 duration과 동일
    }
  }, [isOpen, triggerElement])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!modalRef.current) return

    const rect = modalRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setIsDragging(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !modalRef.current) return

      const newX = e.clientX - dragOffset.x
      const newY = e.clientY - dragOffset.y

      // 화면 밖으로 나가지 않도록 제한
      const rect = modalRef.current.getBoundingClientRect()
      const maxX = window.innerWidth - rect.width
      const maxY = window.innerHeight - rect.height

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  // 애니메이션 스타일 계산
  const getAnimationStyle = () => {
    if (isDragging && position) {
      return {
        position: 'fixed' as const,
        left: '50%',
        top: '50%',
        transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
        cursor: 'grabbing',
      }
    }

    if (isAnimating && animationOrigin) {
      // 애니메이션 진행 중: CSS animation 사용
      return {
        position: 'fixed' as const,
        left: '50%',
        top: '50%',
        '--origin-x': `${animationOrigin.x}px`,
        '--origin-y': `${animationOrigin.y}px`,
        animation: 'modalSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      } as React.CSSProperties
    }

    // 애니메이션 완료 후 또는 기본 상태: 항상 중앙 위치 유지
    return {
      position: 'fixed' as const,
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      cursor: 'default',
    }
  }

  return (
    <>
      <style jsx global>{`
        @keyframes modalSlideUp {
          0% {
            opacity: 0;
            transform: translate(calc(-50% + var(--origin-x)), calc(-50% + var(--origin-y))) scale(0.7);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent
          ref={modalRef}
          className="sm:max-w-md [&>button]:hidden data-[state=open]:animate-none data-[state=closed]:animate-none"
          style={getAnimationStyle()}
        >
        <DialogHeader
          ref={headerRef}
          className="cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
        >
          <DialogTitle className="flex items-center justify-between">
            <span>{title}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onOpenChange(false)}
            >
              <X size={16} />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {children}
        </div>

        {footer && (
          <DialogFooter>
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
    </>
  )
}
