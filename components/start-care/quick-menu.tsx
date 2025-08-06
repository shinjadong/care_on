"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function QuickMenu() {
  const [isOpen, setIsOpen] = useState(true)

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-4 right-4 bg-teal-600 hover:bg-teal-700 rounded-full h-16 w-16 shadow-lg z-50"
        onClick={() => setIsOpen(true)}
      >
        메뉴
      </Button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 w-72 bg-white rounded-lg shadow-2xl z-50 border border-gray-200">
      <div className="p-4 bg-gray-50 rounded-t-lg">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">필요할때 다시 열래요</p>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-4">
        <div className="text-center">
          <div className="flex justify-center space-x-2 mb-2">
            <span className="bg-teal-100 text-teal-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">1:1 맞춤</span>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              컨설팅 과정
            </span>
          </div>
          <strong className="text-lg font-bold">49기 케어온 아카데미</strong>
        </div>
        <div className="text-sm text-gray-600 space-y-1 my-4">
          <p>신청 접수: 07/30 (수) 까지</p>
          <p>합격 발표: 다음주 수요일 오후 6시</p>
          <p>교육 기간: 08/04 (월) 시작</p>
          <p>가격: 595만원 (2달 과정) / 880만원 (3달 과정)</p>
        </div>
        <div className="bg-teal-50 text-teal-800 text-center p-3 rounded-lg mb-4">
          <p className="text-sm">
            지금까지 <strong>3,139명의 사업자</strong>가 함께했어요
          </p>
          <p className="text-sm font-bold">
            이제 딱 <strong>2자리 남았습니다</strong>
          </p>
        </div>
        <div className="flex flex-col space-y-2">
          <a href="https://forms.gle/xUcRxNYcFnYGZjga7" target="_blank" rel="noopener noreferrer" className="w-full">
            <Button className="w-full bg-teal-600 hover:bg-teal-700">지금 신청하기</Button>
          </a>
          <Button variant="outline" className="w-full bg-transparent">
            후기 확인하기
          </Button>
        </div>
      </div>
    </div>
  )
} 