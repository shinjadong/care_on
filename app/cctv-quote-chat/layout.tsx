import type React from "react"
import "../globals.css"

export const metadata = {
  title: "케어온 CCTV 무료 견적",
  description: "AI 챗봇을 통해 쉽고 빠르게 CCTV 렌탈 견적을 받아보세요.",
}

export default function CctvQuoteChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This layout provides a focused chat interface by not rendering the main Header and Footer.
  // The <html>, <head>, and <body> tags are inherited from the root layout,
  // so they are removed from here to prevent conflicts and resolve the error.
  return <>{children}</>
}
