"use client"

import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"


const Footer = dynamic(() => import("@/components/footer").then(m => m.Footer), {
  // 동적 임포트로 Footer 컴포넌트 로드
  ssr: false,
})

export function ConditionalFooter() {
  const pathname = usePathname()
  // 이제 /what이 메인 페이지이므로 항상 Footer를 표시
  return <Footer />
}

export default ConditionalFooter
