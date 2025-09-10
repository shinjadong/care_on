"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, FileCheck, Clock, CheckCircle, XCircle, AlertCircle, Calendar, TrendingUp, Users, DollarSign } from "lucide-react"
import Link from "next/link"

interface Contract {
  id: string
  customer_number: string
  contract_number: string
  business_name: string
  owner_name: string
  phone: string
  email?: string
  address: string
  status: string
  internet_plan?: string
  internet_monthly_fee?: number
  cctv_count?: string
  cctv_monthly_fee?: number
  total_monthly_fee?: number
  created_at: string
  processed_at?: string
  processed_by?: string
}

const statusConfig = {
  pending: { label: "신청접수", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  quoted: { label: "견적완료", color: "bg-blue-100 text-blue-800", icon: FileCheck },
  approved: { label: "승인", color: "bg-green-100 text-green-800", icon: CheckCircle },
  active: { label: "활성", color: "bg-green-500 text-white", icon: CheckCircle },
  suspended: { label: "일시중지", color: "bg-orange-100 text-orange-800", icon: AlertCircle },
  terminated: { label: "해지", color: "bg-red-100 text-red-800", icon: XCircle },
  completed: { label: "완료", color: "bg-gray-100 text-gray-800", icon: CheckCircle }
}

export default function ManagerContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all") // all, today, week, month
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchContracts()
  }, [])

  useEffect(() => {
    filterContracts()
  }, [contracts, searchTerm, statusFilter, dateFilter])

  const fetchContracts = async () => {
    try {
      const response = await fetch('/api/manager/contracts')
      if (response.ok) {
        const data = await response.json()
        setContracts(data.contracts)
      }
    } catch (error) {
      console.error('계약 목록 조회 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterContracts = () => {
    let filtered = [...contracts]

    // 검색어 필터
    if (searchTerm) {
      filtered = filtered.filter(contract => 
        contract.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.phone.includes(searchTerm) ||
        contract.customer_number.includes(searchTerm)
      )
    }

    // 상태 필터
    if (statusFilter !== "all") {
      filtered = filtered.filter(contract => contract.status === statusFilter)
    }

    // 날짜 필터
    if (dateFilter !== "all") {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      filtered = filtered.filter(contract => {
        const contractDate = new Date(contract.created_at)
        
        switch (dateFilter) {
          case "today":
            return contractDate >= today
          case "week":
            const weekAgo = new Date(today)
            weekAgo.setDate(weekAgo.getDate() - 7)
            return contractDate >= weekAgo
          case "month":
            const monthAgo = new Date(today)
            monthAgo.setMonth(monthAgo.getMonth() - 1)
            return contractDate >= monthAgo
          default:
            return true
        }
      })
    }

    setFilteredContracts(filtered)
  }

  const calculateTotalMonthlyFee = (contract: Contract) => {
    return contract.total_monthly_fee || 
           ((contract.internet_monthly_fee || 0) + (contract.cctv_monthly_fee || 0))
  }

  // 통계 계산
  const getStatistics = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayContracts = contracts.filter(c => 
      new Date(c.created_at) >= today
    )
    
    const pendingContracts = contracts.filter(c => c.status === 'pending')
    const quotedContracts = contracts.filter(c => c.status === 'quoted')
    const activeContracts = contracts.filter(c => c.status === 'active')
    
    const totalRevenue = activeContracts.reduce((sum, c) => 
      sum + calculateTotalMonthlyFee(c), 0
    )
    
    return {
      today: todayContracts.length,
      pending: pendingContracts.length,
      quoted: quotedContracts.length,
      active: activeContracts.length,
      totalRevenue
    }
  }

  const stats = getStatistics()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">계약 관리 대시보드</h1>
          <p className="text-gray-600">전체 계약 현황을 확인하고 관리하세요</p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">오늘 신청</p>
                <p className="text-2xl font-bold text-gray-900">{stats.today}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">대기 중</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">활성 계약</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">월 수익</p>
                <p className="text-2xl font-bold text-[#148777]">
                  {stats.totalRevenue.toLocaleString()}원
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-[#148777]" />
            </div>
          </Card>
        </div>

        {/* 필터 및 검색 */}
        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="사업체명, 대표자명, 전화번호, 고객번호로 검색"
                    className="pl-10"
                  />
                </div>
              </div>
              
              {/* 날짜 필터 */}
              <div className="flex gap-2">
                <Button
                  variant={dateFilter === "all" ? "default" : "outline"}
                  onClick={() => setDateFilter("all")}
                  size="sm"
                >
                  전체
                </Button>
                <Button
                  variant={dateFilter === "today" ? "default" : "outline"}
                  onClick={() => setDateFilter("today")}
                  size="sm"
                >
                  오늘
                </Button>
                <Button
                  variant={dateFilter === "week" ? "default" : "outline"}
                  onClick={() => setDateFilter("week")}
                  size="sm"
                >
                  일주일
                </Button>
                <Button
                  variant={dateFilter === "month" ? "default" : "outline"}
                  onClick={() => setDateFilter("month")}
                  size="sm"
                >
                  한달
                </Button>
              </div>
            </div>
            
            {/* 상태 필터 */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => setStatusFilter("all")}
                size="sm"
              >
                전체 ({contracts.length})
              </Button>
              {Object.entries(statusConfig).map(([status, config]) => {
                const count = contracts.filter(c => c.status === status).length
                return (
                  <Button
                    key={status}
                    variant={statusFilter === status ? "default" : "outline"}
                    onClick={() => setStatusFilter(status)}
                    size="sm"
                  >
                    {config.label} ({count})
                  </Button>
                )
              })}
            </div>
          </div>
        </Card>

        {/* 계약 목록 */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#148777] mx-auto mb-4" />
            <p className="text-gray-600">계약 목록을 불러오는 중...</p>
          </div>
        ) : filteredContracts.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all" || dateFilter !== "all" 
                ? "검색 결과가 없습니다" 
                : "아직 등록된 계약이 없습니다"}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-2">
              총 {filteredContracts.length}건의 계약
            </div>
            
            {filteredContracts.map((contract) => {
              const StatusIcon = statusConfig[contract.status as keyof typeof statusConfig]?.icon || Clock
              const statusInfo = statusConfig[contract.status as keyof typeof statusConfig] || statusConfig.pending

              return (
                <Card key={contract.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{contract.business_name}</h3>
                        <Badge className={statusInfo.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                        {/* 오늘 신청건 표시 */}
                        {new Date(contract.created_at).toDateString() === new Date().toDateString() && (
                          <Badge className="bg-blue-100 text-blue-800">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            오늘
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <p><strong>고객번호:</strong> <span className="font-mono text-[#148777]">{contract.customer_number}</span></p>
                          <p><strong>대표자:</strong> {contract.owner_name}</p>
                          <p><strong>연락처:</strong> {contract.phone}</p>
                        </div>
                        <div>
                          <p><strong>주소:</strong> {contract.address}</p>
                          <p><strong>신청일:</strong> {new Date(contract.created_at).toLocaleDateString('ko-KR')}</p>
                          {contract.processed_at && (
                            <p><strong>처리일:</strong> {new Date(contract.processed_at).toLocaleDateString('ko-KR')}</p>
                          )}
                        </div>
                        <div>
                          {contract.internet_plan && (
                            <p><strong>인터넷:</strong> {contract.internet_plan} ({contract.internet_monthly_fee?.toLocaleString()}원)</p>
                          )}
                          {contract.cctv_count && (
                            <p><strong>CCTV:</strong> {contract.cctv_count} ({contract.cctv_monthly_fee?.toLocaleString()}원)</p>
                          )}
                          {(contract.internet_monthly_fee || contract.cctv_monthly_fee) ? (
                            <p className="font-bold text-[#148777] mt-1">
                              월 총액: {calculateTotalMonthlyFee(contract).toLocaleString()}원
                            </p>
                          ) : (
                            <p className="text-gray-400 italic">견적 대기</p>
                          )}
                        </div>
                      </div>
                      
                      {/* 처리자 정보 */}
                      {contract.processed_by && (
                        <div className="mt-2 text-xs text-gray-500">
                          처리: {contract.processed_by} 
                          {contract.processed_at && ` (${new Date(contract.processed_at).toLocaleString('ko-KR')})`}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      {contract.status === 'pending' && (
                        <Link href={`/manager/quote?customer_number=${contract.customer_number}`}>
                          <Button size="sm" className="bg-[#148777] hover:bg-[#0f6b5c]">
                            <FileCheck className="w-4 h-4 mr-1" />
                            견적 작성
                          </Button>
                        </Link>
                      )}
                      {contract.status === 'quoted' && (
                        <Link href={`/manager/quote?customer_number=${contract.customer_number}`}>
                          <Button size="sm" variant="outline" className="border-[#148777] text-[#148777] hover:bg-[#148777] hover:text-white">
                            <Eye className="w-4 h-4 mr-1" />
                            견적 수정
                          </Button>
                        </Link>
                      )}
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        상세 보기
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}