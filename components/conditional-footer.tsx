"use client"

import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"

/**
 * ConditionalFooter
 * 목적: 특정 경로(`/what`)에서는 푸터를 로드하지 않음
 * 교육자 모드 비유: 공연 마지막 인사(푸터)를 어떤 장면(`/what`)에서는 건너뛰는 무대 연출
 */
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
