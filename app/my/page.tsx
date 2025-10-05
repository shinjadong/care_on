'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  User, 
  Phone, 
  Search,
  AlertCircle,
  FileText,
  Building
} from 'lucide-react'

export default function MyPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  })
  const [step, setStep] = useState(1) // 1: 이름 입력, 2: 전화번호 입력
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step === 1) {
      // 1단계: 이름 입력 검증
      if (!formData.name.trim()) {
        setError('이름을 입력해주세요.')
        return
      }
      setError('')
      setStep(2) // 전화번호 입력 단계로
    } else {
      // 2단계: 전화번호 입력 후 견적서 조회
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    if (!formData.phone.trim()) {
      setError('전화번호를 입력해주세요.')
      return
    }

    setLoading(true)
    setError('')

    try {
      // 고객 정보 검증
      const response = await fetch('/api/contract/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.replace(/[^0-9]/g, '')
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        if (data.customer) {
          // 견적서가 있으면 견적 페이지로, 계약이 활성이면 서비스 페이지로
          if (data.customer.status === 'active') {
            router.push(`/my/services?c=${data.customer.customer_number}`)
          } else {
            router.push(`/my/quotes?c=${data.customer.customer_number}`)
          }
        } else {
          setError('정보를 다시 확인해주세요.')
        }
      } else {
        setError('조회 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('고객 조회 오류:', error)
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    setStep(1)
    setError('')
  }

  const handlePhoneChange = (value: string) => {
    // 전화번호 자동 포맷팅
    const numbers = value.replace(/[^0-9]/g, '')
    let formatted = numbers
    
    if (numbers.length >= 3) {
      if (numbers.length >= 7) {
        formatted = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
      } else {
        formatted = `${numbers.slice(0, 3)}-${numbers.slice(3)}`
      }
    }
    
    setFormData({ ...formData, phone: formatted })
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* 단계별 제목 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">
            {step === 1 ? '성함을 입력해주세요' : '전화번호를 입력해주세요'}
          </h1>
        </div>

        {/* 단계별 폼 */}
        <form onSubmit={handleNextStep} className="space-y-6">
          {step === 1 ? (
            /* 1단계: 이름 입력 */
            <div>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="이름"
                className="w-full text-center text-xl py-4 border-2 border-gray-300 rounded-2xl focus:border-primary transition-colors"
                autoFocus
                required
              />
            </div>
          ) : (
            /* 2단계: 전화번호 입력 */
            <div>
              <div className="text-center mb-4 text-gray-600">
                {formData.name}님
              </div>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="전화번호"
                className="w-full text-center text-xl py-4 border-2 border-gray-300 rounded-2xl focus:border-primary transition-colors"
                maxLength={13}
                autoFocus
                required
              />
            </div>
          )}

          {/* 버튼들 */}
          <div className="space-y-3">
            {step === 2 && (
              <Button 
                type="button"
                onClick={handleBack}
                variant="outline"
                className="w-full py-3 text-lg rounded-2xl"
              >
                이전
              </Button>
            )}
            
            <Button
              type="submit"
              className="w-full py-4 text-xl rounded-2xl bg-primary hover:bg-primary/90 transition-colors"
              disabled={
                loading ||
                (step === 1 && !formData.name.trim()) ||
                (step === 2 && !formData.phone.trim())
              }
            >
              {loading ? '확인 중...' : step === 1 ? '다음' : '견적서 확인'}
            </Button>
          </div>

          {/* 간단한 오류 메시지 */}
          {error && (
            <div className="text-center text-red-500 text-sm mt-4">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}