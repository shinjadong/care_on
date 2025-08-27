"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

// 교육자 모드 설명:
// - 루트 도메인 접속 시 /start-care 페이지로 리다이렉트합니다.
// - useEffect를 사용하여 클라이언트 사이드에서 즉시 리다이렉트를 수행합니다.
// - 이는 검색엔진이나 소셜미디어에서 공유될 때 메인 랜딩페이지로 안내하는 역할을 합니다.

export default function MainPage() {
  const router = useRouter()
  
  useEffect(() => {
    // 페이지가 마운트되는 즉시 /start-care로 리다이렉트
    router.replace('/start-care')
  }, [router])

  // 리다이렉트 중 보여줄 로딩 화면
  return (
    <div className="h-screen w-screen bg-gradient-to-b from-[#f7f3ed] to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#148777] mx-auto mb-4"></div>
        <p className="text-gray-600 text-sm">페이지를 불러오고 있습니다...</p>
      </div>
    </div>
  )
}
