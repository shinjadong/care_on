"use client"
import Link from "next/link"
import { useState } from "react"
import { Phone, MessageCircle, Send, Building2, CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  const [showSMSForm, setShowSMSForm] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSMSSend = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      alert("올바른 전화번호를 입력해주세요.")
      return
    }

    setIsLoading(true)
    setStatus('idle')

    try {
      // SMS 전송 로직 (기존 SMS API 활용)
      const smsMessage = message || "케어온에 문의드립니다."
      
      // 여기에 실제 SMS 전송 API 호출
      // 임시로 setTimeout으로 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setStatus('success')
      setTimeout(() => {
        setShowSMSForm(false)
        setPhoneNumber("")
        setMessage("")
        setStatus('idle')
      }, 2000)
    } catch (error) {
      setStatus('error')
      console.error('SMS 전송 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <footer className="bg-gradient-to-b from-gray-800 to-gray-900 text-gray-400 py-16 relative overflow-hidden">
        {/* 배경 패턴 */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* CTA 섹션 */}
          <div className="bg-gradient-to-r from-[#148777] to-[#0f6b5c] rounded-2xl p-8 md:p-12 mb-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              창업, 혼자 고민하지 마세요
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-95">
              케어온이 함께합니다. 지금 바로 문의하세요!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="tel:1866-1845"
                className="inline-flex items-center justify-center bg-white text-[#148777] hover:bg-gray-100 font-bold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 gap-3"
              >
                <Phone className="w-5 h-5" />
                1866-1845 전화하기
              </a>
              
              <Button
                onClick={() => setShowSMSForm(!showSMSForm)}
                className="bg-[#0f6b5c] text-white hover:bg-[#0a5448] font-bold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
              >
                <MessageCircle className="w-5 h-5" />
                문자로 문의하기
              </Button>
            </div>

            {/* 운영시간 안내 */}
            <div className="mt-8 p-4 bg-white/10 rounded-xl backdrop-blur-sm inline-block">
              <p className="text-sm">
                <span className="font-semibold">상담 가능 시간:</span> 평일 09:00 - 18:00 | 주말/공휴일 휴무
              </p>
            </div>
          </div>

          {/* 기존 푸터 정보 */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-8 h-8 text-[#148777]" />
                <p className="text-2xl font-bold text-white">케어온</p>
              </div>
              
              <address className="not-italic text-sm space-y-1.5">
                <p className="text-gray-300">대표자 : 신예준</p>
                <p>
                  경상남도 창원시 사화로80번길20, 201호 (팔용동)
                </p>
                <p>이메일 : siwwyy1012@gmail.com | 전화 : 1866-1845</p>
                <p>사업자등록번호 : 609-41-95762</p>
                <p>통신판매업 신고번호 : 2024-창원의창-0453호</p>
              </address>
              
              <p className="text-xs mt-6 text-gray-500">
                COPYRIGHT© 2024 케어온. ALL RIGHT RESERVED.
              </p>
            </div>
            
            <div className="flex flex-col space-y-3">
              <h3 className="text-white font-semibold mb-2">바로가기</h3>
              <Link href="/privacy" className="hover:text-[#148777] transition-colors duration-200 flex items-center gap-2">
                개인정보 처리방침
              </Link>
              <Link href="/terms" className="hover:text-[#148777] transition-colors duration-200 flex items-center gap-2">
                이용약관
              </Link>
              <Link href="/notice" className="hover:text-[#148777] transition-colors duration-200 flex items-center gap-2">
                공지사항
              </Link>
              <Link href="/review" className="hover:text-[#148777] transition-colors duration-200 flex items-center gap-2">
                고객 후기
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* SMS 문의 모달 */}
      {showSMSForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in slide-in-from-bottom-5 duration-300">
            <button
              onClick={() => setShowSMSForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#148777]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-[#148777]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">문자 문의</h3>
              <p className="text-gray-600 mt-2">1866-1845로 문자가 전송됩니다</p>
            </div>
            
            {status === 'success' ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-800">문의가 전송되었습니다!</p>
                <p className="text-gray-600 mt-2">곧 연락드리겠습니다.</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      연락받으실 전화번호 *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="01012345678"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#148777] focus:border-transparent transition-all duration-200"
                      maxLength={11}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      문의 내용 (선택)
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="문의하실 내용을 입력해주세요..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#148777] focus:border-transparent transition-all duration-200 resize-none"
                      rows={4}
                      maxLength={200}
                    />
                    <p className="text-xs text-gray-500 mt-1 text-right">{message.length}/200</p>
                  </div>
                </div>
                
                <Button
                  onClick={handleSMSSend}
                  disabled={isLoading || !phoneNumber}
                  className="w-full bg-[#148777] hover:bg-[#0f6b5c] text-white font-bold py-4 rounded-lg mt-6 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      전송 중...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      문자 전송하기
                    </>
                  )}
                </Button>
                
                {status === 'error' && (
                  <p className="text-red-500 text-sm text-center mt-4">
                    전송에 실패했습니다. 잠시 후 다시 시도해주세요.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}