import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function MainPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center pt-20">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">케어온 B2B 렌탈 서비스</h1>
        <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          사업에 필요한 모든 것, 케어온에서 한번에 해결하세요.
          <br />
          최고의 파트너사들과 함께하는 프리미엄 렌탈 서비스를 경험해보세요.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild size="lg" variant="secondary">
            <Link href="#">렌탈 서비스 둘러보기</Link>
          </Button>
          <Button asChild size="lg">
            <Link href="/start-care">스타트케어 바로가기</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
