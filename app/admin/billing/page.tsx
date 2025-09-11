'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Send,
  Filter
} from 'lucide-react'

export default function BillingPage() {
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)

  const handleGenerateMonthlyBilling = async () => {
    const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
    
    if (!confirm(`${currentMonth} 월 청구서를 생성하시겠습니까?`)) {
      return
    }

    try {
      setGenerating(true)
      const response = await fetch('/api/billing/auto-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_month: currentMonth,
          action: 'both' // 청구서 + 송금 모두 생성
        })
      })

      if (response.ok) {
        const result = await response.json()
        alert(`성공적으로 생성되었습니다!\n청구서: ${result.generated.invoices}건\n송금: ${result.generated.remittances}건`)
      } else {
        const errorData = await response.json()
        alert(`생성에 실패했습니다: ${errorData.error}`)
      }
    } catch (error) {
      console.error('월별 청구 생성 오류:', error)
      alert('네트워크 오류가 발생했습니다.')
    } finally {
      setGenerating(false)
    }
  }

  const getInvoiceStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">미납</Badge>
      case 'paid':
        return <Badge variant="default">납부완료</Badge>
      case 'overdue':
        return <Badge variant="destructive">연체</Badge>
      case 'void':
        return <Badge variant="secondary">무효</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getRemittanceStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline">예약됨</Badge>
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800">처리중</Badge>
      case 'sent':
        return <Badge variant="default">송금완료</Badge>
      case 'failed':
        return <Badge variant="destructive">실패</Badge>
      case 'canceled':
        return <Badge variant="secondary">취소</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const stats = {
    total_monthly: 12450000,
    pending_invoices: 23,
    overdue_count: 5,
    upcoming_remittances: 12
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">청구/정산 관리</h1>
          <p className="text-gray-600">월별 청구 및 송금을 관리합니다</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            보고서 다운로드
          </Button>
          <Button>
            <Send className="h-4 w-4 mr-2" />
            일괄 송금
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">월 총 청구액</p>
                <p className="text-2xl font-bold">{stats.total_monthly.toLocaleString()}원</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">미납 건수</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending_invoices}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">연체 건수</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue_count}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">예정 송금</p>
                <p className="text-2xl font-bold text-green-600">{stats.upcoming_remittances}</p>
              </div>
              <Send className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>청구/정산 시스템</CardTitle>
          <CardDescription>자동화된 청구 및 정산 시스템이 준비되었습니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-600" />
            <h3 className="text-lg font-semibold mb-2">시스템 구축 완료</h3>
            <p className="text-gray-600 mb-6">
              청구서 및 송금 관리를 위한 데이터베이스 구조가 성공적으로 구축되었습니다.<br/>
              이제 월별 자동 청구서 생성 및 송금 스케줄링이 가능합니다.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
              <Button 
                className="w-full" 
                onClick={handleGenerateMonthlyBilling}
                disabled={generating}
              >
                <Calendar className="h-4 w-4 mr-2" />
                {generating ? '생성 중...' : '월간 청구서 생성'}
              </Button>
              <Button variant="outline" className="w-full">
                <TrendingUp className="h-4 w-4 mr-2" />
                정산 보고서
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}