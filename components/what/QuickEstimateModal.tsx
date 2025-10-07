"use client"

import { useState } from "react"
import { X, Phone, Clock, Calendar, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface QuickEstimateModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function QuickEstimateModal({ isOpen, onClose }: QuickEstimateModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: { first: "010", middle: "", last: "" },
    callDate: "",
    callTime: "",
    memo: ""
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const timeSlots = [
    { value: "09:00", label: "오전 9시" },
    { value: "10:00", label: "오전 10시" },
    { value: "11:00", label: "오전 11시" },
    { value: "12:00", label: "오후 12시" },
    { value: "13:00", label: "오후 1시" },
    { value: "14:00", label: "오후 2시" },
    { value: "15:00", label: "오후 3시" },
    { value: "16:00", label: "오후 4시" },
    { value: "17:00", label: "오후 5시" },
    { value: "18:00", label: "오후 6시" },
    { value: "19:00", label: "오후 7시" },
    { value: "20:00", label: "오후 8시" }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const phoneNumber = `${formData.phoneNumber.first}-${formData.phoneNumber.middle}-${formData.phoneNumber.last}`
    
    if (!formData.name || !formData.phoneNumber.middle || !formData.phoneNumber.last || !formData.callDate || !formData.callTime) {
      setError("필수 항목을 모두 입력해주세요.")
      return
    }

    try {
      setLoading(true)
      const supabase = createClient()
      
      const { error } = await supabase
        .from("quick_estimates")
        .insert({
          name: formData.name,
          phone_number: phoneNumber,
          call_datetime: `${formData.callDate}T${formData.callTime}:00`,
          memo: formData.memo || null
        })

      if (error) throw error
      
      setSuccess(true)
      setTimeout(() => {
        onClose()
        setSuccess(false)
        setFormData({
          name: "",
          phoneNumber: { first: "010", middle: "", last: "" },
          callDate: "",
          callTime: "",
          memo: ""
        })
      }, 2000)
    } catch (err: any) {
      setError(`신청 중 오류가 발생했습니다: ${err?.message ?? "알 수 없는 오류"}`)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  if (success) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">신청이 완료되었습니다!</h3>
          <p className="text-gray-600">곧 전화드리겠습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* 헤더 */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Phone className="w-5 h-5 text-teal-600" />
                간편 사전견적 신청
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                전화상담을 통해 빠르게 진행할 수 있습니다
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 안내 메시지 */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Phone className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-blue-900 mb-1">간편한 전화상담 절차</p>
                <ul className="text-blue-700 space-y-1">
                  <li>• 가입 가능 여부 즉시 확인</li>
                  <li>• 맞춤 상품 추천 및 견적 안내</li>
                  <li>• 방문 실사 일정 조율</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 폼 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 이름 */}
            <div>
              <label className="block text-sm font-medium mb-1">이름 *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
                required
              />
            </div>

            {/* 연락처 */}
            <div>
              <label className="block text-sm font-medium mb-1">연락처 *</label>
              <div className="flex gap-2">
                <select 
                  value={formData.phoneNumber.first}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: { ...formData.phoneNumber, first: e.target.value }})}
                  className="w-24 rounded-xl border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
                >
                  <option value="010">010</option>
                  <option value="011">011</option>
                  <option value="016">016</option>
                  <option value="017">017</option>
                  <option value="018">018</option>
                  <option value="019">019</option>
                </select>
                <span className="flex items-center">-</span>
                <input 
                  type="tel"
                  maxLength={4}
                  placeholder="0000"
                  value={formData.phoneNumber.middle}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: { ...formData.phoneNumber, middle: e.target.value.replace(/\D/g, '') }})}
                  className="flex-1 rounded-xl border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
                  required
                />
                <span className="flex items-center">-</span>
                <input 
                  type="tel"
                  maxLength={4}
                  placeholder="0000"
                  value={formData.phoneNumber.last}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: { ...formData.phoneNumber, last: e.target.value.replace(/\D/g, '') }})}
                  className="flex-1 rounded-xl border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* 통화 희망 일자 */}
            <div>
              <label className="block text-sm font-medium mb-1">
                <Calendar className="inline w-4 h-4 mr-1" />
                통화 희망 일자 *
              </label>
              <input 
                type="date"
                value={formData.callDate}
                onChange={(e) => setFormData({ ...formData, callDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
                required
              />
            </div>

            {/* 통화 희망 시간 */}
            <div>
              <label className="block text-sm font-medium mb-1">
                <Clock className="inline w-4 h-4 mr-1" />
                통화 희망 시간 *
              </label>
              <select
                value={formData.callTime}
                onChange={(e) => setFormData({ ...formData, callTime: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
                required
              >
                <option value="">시간을 선택하세요</option>
                {timeSlots.map(slot => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 메모 */}
            <div>
              <label className="block text-sm font-medium mb-1">문의사항 (선택)</label>
              <textarea
                value={formData.memo}
                onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                placeholder="궁금하신 점이나 상담시 참고사항을 입력해주세요"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-black focus:outline-none h-20 resize-none"
              />
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* 버튼 */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-teal-600 px-4 py-2.5 text-white hover:bg-teal-700 transition-colors disabled:opacity-50"
              >
                {loading ? "신청 중..." : "상담 신청"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
