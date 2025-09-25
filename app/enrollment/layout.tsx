"use client"

import type React from "react"
import { useEffect } from "react"

export default function EnrollmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // enrollment 페이지에서 footer를 숨기기
    const footer = document.querySelector('footer')
    const floatingBanner = document.querySelector('.floating-banner')

    if (footer) {
      footer.style.display = 'none'
    }
    if (floatingBanner) {
      floatingBanner.style.display = 'none'
    }

    // cleanup: 다른 페이지로 이동할 때 footer를 다시 보이게 하기
    return () => {
      if (footer) {
        footer.style.display = ''
      }
      if (floatingBanner) {
        floatingBanner.style.display = ''
      }
    }
  }, [])

  return (
    <>
      {children}
    </>
  )
}