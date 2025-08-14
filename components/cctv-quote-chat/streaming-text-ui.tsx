"use client"

import { useState, useEffect, useRef } from "react"

interface StreamingTextProps {
  text: string
  speed?: number
  onFinished?: () => void
  className?: string
}

export function StreamingText({ text, speed = 30, onFinished, className }: StreamingTextProps) {
  const [displayedText, setDisplayedText] = useState("")
  const fullTextRef = useRef(text)
  const indexRef = useRef(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fullTextRef.current = text
    setDisplayedText("")
    indexRef.current = 0
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    const stream = () => {
      if (indexRef.current < fullTextRef.current.length) {
        const char = fullTextRef.current[indexRef.current]
        // Handle HTML tags like <br/> to render them at once
        if (char === "<") {
          const closingTagIndex = fullTextRef.current.indexOf(">", indexRef.current)
          if (closingTagIndex !== -1) {
            const tag = fullTextRef.current.substring(indexRef.current, closingTagIndex + 1)
            setDisplayedText((prev) => prev + tag)
            indexRef.current = closingTagIndex + 1
          } else {
            // Fallback for malformed tags
            setDisplayedText((prev) => prev + char)
            indexRef.current += 1
          }
        } else {
          setDisplayedText((prev) => prev + char)
          indexRef.current += 1
        }
        timeoutRef.current = setTimeout(stream, speed)
      } else {
        // Call the onFinished callback once the animation is complete
        onFinished?.()
      }
    }

    timeoutRef.current = setTimeout(stream, 100) // Initial delay

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [text, speed, onFinished])

  return <div className={className} dangerouslySetInnerHTML={{ __html: displayedText }} />
}
