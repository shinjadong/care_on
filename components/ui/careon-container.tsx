import type React from "react"
interface CareonContainerProps {
  children: React.ReactNode
}

export function CareonContainer({ children }: CareonContainerProps) {
  return (
    <div className="min-h-screen bg-[#fbfbfb] flex flex-col max-w-md mx-auto relative">
      {/* Main Content */}
      <div className="flex-1 flex flex-col pt-8 pb-6">{children}</div>
    </div>
  )
}
