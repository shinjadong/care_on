import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { TRPCProvider } from '@/components/providers/TRPCProvider'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CareOn - 창업자 종합 비즈니스 플랫폼',
  description: 'Clean Architecture로 구축된 차세대 비즈니스 플랫폼',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <TRPCProvider>
          {children}
          <Toaster position="top-center" richColors />
        </TRPCProvider>
      </body>
    </html>
  )
}
