"use client"

import { useRef, useEffect } from "react"

export default function EffectPreviewPage() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.play().catch(() => {})
  }, [])

  return (
    <main className="min-h-screen w-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <video
          ref={videoRef}
          src="/effect-1.mp4"
          controls
          playsInline
          className="w-full h-auto rounded-lg shadow-2xl"
        />
        <p className="text-center text-gray-300 mt-3 text-sm">/public/effect-1.mp4</p>
      </div>
    </main>
  )
}
