import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Footer } from "@/components/backup/footer"
import { Header } from "@/components/backup/header"

export const metadata: Metadata = {
  title: "케어온 - 창업자의 든든한 파트너",
  description: "창업 초기의 위험을 보호하는 안전망. 케어온과 함께 안전한 창업을 시작하세요. CCTV 보안, 창업 컨설팅, 1년 보장 시스템으로 95% 생존율을 달성했습니다.",
  keywords: "창업지원, 창업컨설팅, CCTV보안, 사업자보험, 창업안전망, 스타트업, 비즈니스플랫폼",
  generator: "케어온",
  authors: [{ name: "케어온 개발팀" }],
  creator: "케어온",
  publisher: "케어온",
  openGraph: {
    title: "케어온 - 창업자의 든든한 파트너",
    description: "창업 초기의 위험을 보호하는 안전망. 95% 생존율을 달성한 검증된 시스템.",
    type: "website",
    locale: "ko_KR",
  },
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
