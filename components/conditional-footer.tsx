"use client"

import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"


const Footer = dynamic(() => import("@/components/footer").then(m => m.Footer), {
  // 동적 임포트: `/what` 경로에선 렌더되지 않아 네트워크/실행 비용도 피함
  ssr: false,
})

export function ConditionalFooter() {
  const pathname = usePathname()
  if (pathname?.startsWith("/what")) {
    return null
  }
  return <Footer />
}

export default ConditionalFooter
