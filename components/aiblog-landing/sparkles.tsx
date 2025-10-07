"use client"

import { useEffect, useRef, useState } from "react"
import { useMousePosition } from "@/lib/hooks/use-mouse-position"

interface SparklesProps {
  id?: string
  background?: string
  minSize?: number
  maxSize?: number
  particleDensity?: number
  className?: string
  particleColor?: string
}

export const SparklesCore = ({
  id = "tsparticles",
  background = "transparent",
  minSize = 0.6,
  maxSize = 1.4,
  particleDensity = 100,
  className = "h-full w-full",
  particleColor = "#FFFFFF",
}: SparklesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePosition = useMousePosition()
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })
  const animationRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  const lastFrameTimeRef = useRef<number>(0)

  useEffect(() => {
    if (typeof window === "undefined") return

    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    })

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false })
    if (!ctx) return

    let particles: Particle[] = []
    
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // 화면 크기에 따라 파티클 밀도 계산
    const calculateParticleDensity = () => {
      const area = canvas.width * canvas.height
      const baseArea = 1920 * 1080 // 기준 화면 크기
      const densityFactor = Math.min(1.5, Math.max(0.5, area / baseArea)) // 0.5 ~ 1.5 사이로 제한
      return Math.round(particleDensity * densityFactor)
    }

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      baseSpeedX: number
      baseSpeedY: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * (maxSize - minSize) + minSize
        // 기본 속도를 저장
        this.baseSpeedX = Math.random() * 0.5 - 0.25
        this.baseSpeedY = Math.random() * 0.5 - 0.25
        this.speedX = this.baseSpeedX
        this.speedY = this.baseSpeedY
      }

      update(mouseX: number, mouseY: number) {
        // 이동 로직
        this.x += this.speedX
        this.y += this.speedY

        // 화면 경계 처리
        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height

        // 마우스 인터랙션 (마우스가 있는 경우에만 계산)
        if (mouseX > 0 && mouseY > 0) {
          const dx = mouseX - this.x
          const dy = mouseY - this.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const maxDistance = 100
          
          if (distance < maxDistance) {
            // 거리에 따라 영향력 감소 (거리가 멀수록 약한 영향)
            const force = (1 - distance / maxDistance) * 0.5
            const angle = Math.atan2(dy, dx)
            // 반발력 (미는 힘)으로 작용
            this.speedX = this.baseSpeedX - Math.cos(angle) * force
            this.speedY = this.baseSpeedY - Math.sin(angle) * force
          } else {
            // 마우스 영향 범위 밖이면 기본 속도로 복귀
            this.speedX = this.baseSpeedX
            this.speedY = this.baseSpeedY
          }
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = particleColor
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const init = () => {
      // 화면 크기에 맞는 파티클 수 계산
      const adjustedDensity = calculateParticleDensity()
      particles = []
      for (let i = 0; i < adjustedDensity; i++) {
        particles.push(new Particle())
      }
      particlesRef.current = particles
    }

    const animate = (timestamp: number) => {
      if (!ctx) return
      
      // 프레임 레이트 제한 (60fps 목표)
      const elapsed = timestamp - lastFrameTimeRef.current
      if (elapsed < 16) { // 약 60fps에 해당하는 시간 (ms)
        animationRef.current = requestAnimationFrame(animate)
        return
      }
      
      lastFrameTimeRef.current = timestamp
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 배치 처리를 위한 변수
      const particleCount = particles.length
      const batchSize = 50 // 한 번에 처리할 파티클 수
      
      // 전체 파티클을 작은 배치로 나누어 처리
      for (let i = 0; i < particleCount; i += batchSize) {
        const endIndex = Math.min(i + batchSize, particleCount)
        
        // 업데이트 배치 처리
        for (let j = i; j < endIndex; j++) {
          particles[j].update(mousePosition.x, mousePosition.y)
        }
        
        // 드로잉 배치 처리
        for (let j = i; j < endIndex; j++) {
          particles[j].draw(ctx)
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    init()
    animationRef.current = requestAnimationFrame(animate)

    const handleResize = () => {
      if (typeof window === "undefined") return

      // 디바운스 적용
      if (window.resizeTimeout) {
        clearTimeout(window.resizeTimeout)
      }
      
      window.resizeTimeout = setTimeout(() => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        })
        init() // 파티클 재생성
      }, 200) as unknown as number
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if ((window as any).resizeTimeout) {
        clearTimeout((window as any).resizeTimeout)
      }
    }
  }, [maxSize, minSize, particleColor, particleDensity])

  return (
    <canvas
      ref={canvasRef}
      id={id}
      className={className}
      style={{
        background,
        width: dimensions.width,
        height: dimensions.height,
      }}
    />
  )
}

