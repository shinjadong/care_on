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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('이름과 전화번호를 모두 입력해주세요.')
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
          setError('입력하신 정보와 일치하는 견적서를 찾을 수 없습니다.\n이름과 전화번호를 다시 확인해주세요.')
        }
      } else {
        setError('조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
      }
    } catch (error) {
      console.error('고객 조회 오류:', error)
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* 로고/제목 */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            CareOn 고객센터
          </h1>
          <p className="text-gray-600">
            견적서 확인 및 서비스 현황을 조회하세요
          </p>
        </div>

        {/* 인증 폼 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center">
              <FileText className="h-5 w-5 mr-2" />
              정보 입력
            </CardTitle>
            <CardDescription className="text-center">
              견적서 확인을 위해 정보를 입력해주세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 이름 입력 */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  이름 <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="홍길동"
                  className="text-lg py-6"
                  autoFocus
                  required
                />
              </div>

              {/* 전화번호 입력 */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  전화번호 <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="010-1234-5678"
                  className="text-lg py-6"
                  maxLength={13}
                  required
                />
                <p className="text-xs text-gray-500">
                  견적서 신청 시 입력하신 전화번호를 입력하세요
                </p>
              </div>

              {/* 오류 메시지 */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-red-800">조회 실패</h4>
                      <p className="text-sm text-red-700 whitespace-pre-line">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 제출 버튼 */}
              <Button 
                type="submit" 
                className="w-full py-6 text-lg" 
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    조회 중...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    견적서 확인하기
                  </>
                )}
              </Button>

              {/* 안내 문구 */}
              <div className="text-center text-sm text-gray-500 space-y-2">
                <p>📱 카카오톡으로 받은 링크를 통해서도 접근 가능합니다</p>
                <p>🔒 입력하신 정보는 안전하게 보호됩니다</p>
                
                <div className="mt-4 pt-4 border-t">
                  <p className="font-medium text-gray-700 mb-2">📞 고객센터</p>
                  <p>전화: 1588-1234</p>
                  <p>운영시간: 평일 09:00-18:00</p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 하단 안내 */}
        <div className="mt-6 text-center">
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <FileText className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <p className="font-medium">견적서 확인</p>
              <p>패키지 정보 및 요금</p>
            </div>
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <Building className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <p className="font-medium">서비스 현황</p>
              <p>이용 중인 서비스</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}