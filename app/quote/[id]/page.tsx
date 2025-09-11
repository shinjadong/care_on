'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Building, Loader2 } from 'lucide-react'

// 카카오톡 링크로 바로 접속할 수 있는 간편 페이지
// URL: /quote/CO000001 또는 /quote/CT240901001
export default function QuickQuotePage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const id = params.id as string

  useEffect(() => {
    if (id) {
      // ID가 CO로 시작하면 customer_number, CT로 시작하면 contract_number
      const isCustomerNumber = id.startsWith('CO')
      const isContractNumber = id.startsWith('CT')
      
      if (isCustomerNumber) {
        // 고객번호로 바로 견적/서비스 페이지로 리다이렉트
        setTimeout(() => {
          router.replace(`/my/quotes?c=${id}`)
        }, 1000)
      } else if (isContractNumber) {
        // 계약번호로 바로 견적 페이지로 리다이렉트  
        setTimeout(() => {
          router.replace(`/my/quotes?contract=${id}`)
        }, 1000)
      } else {
        // 잘못된 형태면 일반 고객 페이지로
        setTimeout(() => {
          router.replace('/my')
        }, 1000)
      }
    } else {
      router.replace('/my')
    }
  }, [id, router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardContent className="text-center py-12">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building className="h-8 w-8 text-white" />
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            CareOn
          </h2>
          
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>견적서를 불러오는 중...</span>
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>곧 견적서 페이지로 이동됩니다</p>
            <p className="mt-2 font-medium text-blue-600">
              고객번호: {id}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}