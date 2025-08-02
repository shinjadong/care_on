import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Footer } from "@/components/backup/footer"
import { Header } from "@/components/backup/header"

export const metadata: Metadata = {
  title: "케어온 - 신뢰를 케어하다.",
  description: "케어온은 창업자와 사업자 위한 1:1 B2B 비즈니스 플랫폼 입니다.",
  generator: "shinbrothers",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" href="https://spoqa.github.io/spoqa-han-sans/css/SpoqaHanSansNeo.css" />
      </head>
      <body className="font-sans">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
