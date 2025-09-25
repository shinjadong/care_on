import type React from "react"
interface CareonContainerProps {
  children: React.ReactNode
}

export function CareonContainer({ children }: CareonContainerProps) {
  return (
    <div className="h-screen bg-[#fbfbfb] flex flex-col max-w-md mx-auto relative overflow-hidden">
      {/* Main Content - 전체 높이를 차지하며 내부에서 스크롤과 버튼 고정 처리 */}
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  )
}
