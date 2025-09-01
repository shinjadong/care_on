import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ConditionalFooter } from "@/components/conditional-footer"
import { Header } from "@/components/header"
import { FloatingBanner } from "@/components/floating-banner"
import { FloatingCTAButton } from "@/components/floating-cta-button"
import { ClientAuthProvider } from "@/components/providers/auth-provider"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "케어온 - 사장님의 모든 것",
  description: "케어온과 함께 안전한 창업을 시작하세요. CCTV 보안, 창업 컨설팅, 1년 보장 시스템으로 95% 생존율을 달성했습니다.",
  keywords: "창업지원, 창업컨설팅, CCTV보안, 사업자보험, 창업안전망, 스타트업, 비즈니스플랫폼",
  generator: "케어온",
  authors: [{ name: "케어온 개발팀" }],
  creator: "케어온",
  publisher: "케어온",
  // 외부 URL에서 파비콘을 가져오도록 설정 - 브라우저 탭의 작은 아이콘
  icons: {
    icon: "https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%EC%BC%80%EC%96%B4%EC%98%A8%EB%A1%9C%EA%B3%A0-%EC%97%AC%EB%B0%B1%EC%A0%9C%EA%B1%B0-mint.png",
  },
  openGraph: {
    title: "케어온 - 사장님의 모든 것",
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
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
          forcedTheme="light"
        >
          <ClientAuthProvider>
            <Header />
            {children}
            <ConditionalFooter />
            <FloatingBanner />
          </ClientAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
