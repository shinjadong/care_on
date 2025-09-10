"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, FileCheck, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
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
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchContracts()
  }, [])

  useEffect(() => {
    filterContracts()
  }, [contracts, searchTerm, statusFilter])

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

    setFilteredContracts(filtered)
  }

  const calculateTotalMonthlyFee = (contract: Contract) => {
    return (contract.internet_monthly_fee || 0) + (contract.cctv_monthly_fee || 0)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">계약 관리</h1>
          <p className="text-gray-600">전체 계약 현황을 확인하고 관리하세요</p>
        </div>

        {/* 필터 및 검색 */}
        <Card className="p-6 mb-6">
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
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => setStatusFilter("all")}
                size="sm"
              >
                전체
              </Button>
              {Object.entries(statusConfig).map(([status, config]) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  onClick={() => setStatusFilter(status)}
                  size="sm"
                >
                  {config.label}
                </Button>
              ))}
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
            <p className="text-gray-500">검색 결과가 없습니다</p>
          </Card>
        ) : (
          <div className="space-y-4">
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
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <p><strong>고객번호:</strong> <span className="font-mono text-[#148777]">{contract.customer_number}</span></p>
                          <p><strong>대표자:</strong> {contract.owner_name}</p>
                          <p><strong>연락처:</strong> {contract.phone}</p>
                        </div>
                        <div>
                          <p><strong>주소:</strong> {contract.address}</p>
                          <p><strong>신청일:</strong> {new Date(contract.created_at).toLocaleDateString()}</p>
                          {contract.processed_at && (
                            <p><strong>처리일:</strong> {new Date(contract.processed_at).toLocaleDateString()}</p>
                          )}
                        </div>
                        <div>
                          {contract.internet_plan && (
                            <p><strong>인터넷:</strong> {contract.internet_plan} ({contract.internet_monthly_fee?.toLocaleString()}원)</p>
                          )}
                          {contract.cctv_count && (
                            <p><strong>CCTV:</strong> {contract.cctv_count} ({contract.cctv_monthly_fee?.toLocaleString()}원)</p>
                          )}
                          {(contract.internet_monthly_fee || contract.cctv_monthly_fee) && (
                            <p className="font-bold text-[#148777] mt-1">
                              월 총액: {calculateTotalMonthlyFee(contract).toLocaleString()}원
                            </p>
                          )}
                        </div>
                      </div>
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