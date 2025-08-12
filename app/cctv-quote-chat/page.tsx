"use client"
import dynamic from "next/dynamic"
import { WhenVisible } from "@/components/common/when-visible"

// 교육자 모드 설명:
// - 채팅 UI는 초기 진입 시 불필요할 수 있습니다. 사용자 시야에 들어올 때만 로드하여 초기 JS를 줄입니다.
const CCTVRentalQuote = dynamic(
  () => import("@/components/cctv-quote-chat/cctv-quote-chat-ui").then(m => m.default),
  { ssr: false }
)

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <WhenVisible minHeight={420}>
        <CCTVRentalQuote />
      </WhenVisible>
    </main>
  )
}
