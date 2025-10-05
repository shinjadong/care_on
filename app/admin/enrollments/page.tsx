"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useEnrollmentList } from "@/hooks/useEnrollmentData"
import { useDebounce } from "@/lib/hooks/useDebounce"
import { EnrollmentQuickView } from "@/components/admin/enrollments/EnrollmentQuickView"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Search,
  Filter,
  Eye,
  Check,
  X,
  Download,
  RefreshCw,
  Users,
  Clock,
  AlertCircle,
  CheckCircle
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

interface EnrollmentApplication {
  id: string
  created_at: string
  updated_at: string
  business_name: string | null
  representative_name: string | null
  phone_number: string | null
  business_type: '개인사업자' | '법인사업자' | null
  status: 'draft' | 'submitted' | 'reviewing' | 'approved' | 'rejected' | null
  business_number: string | null
  submitted_at: string | null
  reviewed_at: string | null
  reviewer_notes: string | null
  // Document status calculation
  business_registration_url: string | null
  id_card_front_url: string | null
  id_card_back_url: string | null
  bankbook_url: string | null
}

export default function EnrollmentManagementPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [quickViewId, setQuickViewId] = useState<string | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const {
    applications,
    loading,
    error,
    stats,
    totalCount,
    totalPages,
    pageSize,
    refetch
  } = useEnrollmentList({
    statusFilter,
    searchTerm: debouncedSearchTerm,
    page: currentPage,
    pageSize: 50,
    minimalFields: true
  })

  const updateStatus = async (id: string, newStatus: string, notes?: string) => {
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from('enrollment_applications')
        .update({
          status: newStatus,
          reviewed_at: new Date().toISOString(),
          reviewer_notes: notes
        })
        .eq('id', id)

      if (error) throw error

      // Refresh the list
      refetch()
      alert(`신청이 ${newStatus === 'approved' ? '승인' : '반려'}되었습니다.`)
    } catch (error) {
      console.error('Error updating status:', error)
      alert('상태 업데이트에 실패했습니다.')
    }
  }

  const getStatusBadge = (status: string | null) => {
    const statusConfig = {
      draft: { label: '작성중', variant: 'outline' as const },
      submitted: { label: '제출됨', variant: 'secondary' as const },
      reviewing: { label: '검토중', variant: 'default' as const },
      approved: { label: '승인됨', variant: 'success' as const },
      rejected: { label: '반려됨', variant: 'destructive' as const }
    }

    const config = statusConfig[status as keyof typeof statusConfig] ||
                  { label: '알 수 없음', variant: 'outline' as const }

    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const checkDocumentStatus = (app: EnrollmentApplication) => {
    const requiredDocs = [
      app.business_registration_url,
      app.id_card_front_url,
      app.id_card_back_url,
      app.bankbook_url
    ]

    const completed = requiredDocs.filter(doc => doc !== null).length
    const total = requiredDocs.length

    if (completed === total) {
      return <Badge variant="success">완료</Badge>
    } else if (completed > 0) {
      return <Badge variant="secondary">{completed}/{total}</Badge>
    } else {
      return <Badge variant="destructive">미제출</Badge>
    }
  }

  // Filtering is now handled by the hook

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">가입 신청 관리</h1>
          <p className="text-gray-600 mt-1">
            Enrollment를 통해 접수된 가입 신청을 관리합니다
          </p>
        </div>
        <Button onClick={refetch} variant="outline" disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          새로고침
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">전체 신청</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <Users className="w-8 h-8 text-gray-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">검토 대기</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">검토중</p>
              <p className="text-2xl font-bold text-blue-600">{stats.reviewing}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-blue-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">승인됨</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">반려됨</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <X className="w-8 h-8 text-red-400" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="사업자명, 대표자명, 전화번호, 사업자번호로 검색"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1) // Reset to first page on search
              }}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="상태 필터" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="submitted">제출됨</SelectItem>
            <SelectItem value="reviewing">검토중</SelectItem>
            <SelectItem value="approved">승인됨</SelectItem>
            <SelectItem value="rejected">반려됨</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          엑셀 다운로드
        </Button>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>신청일시</TableHead>
              <TableHead>사업자명</TableHead>
              <TableHead>대표자명</TableHead>
              <TableHead>연락처</TableHead>
              <TableHead>사업자유형</TableHead>
              <TableHead>서류상태</TableHead>
              <TableHead>신청상태</TableHead>
              <TableHead>작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                  로딩 중...
                </TableCell>
              </TableRow>
            ) : applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  신청 내역이 없습니다
                </TableCell>
              </TableRow>
            ) : (
              applications.map((app) => (
                <TableRow
                  key={app.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    setQuickViewId(app.id)
                    setIsQuickViewOpen(true)
                  }}>
                  <TableCell className="text-sm">
                    {app.submitted_at
                      ? format(new Date(app.submitted_at), 'MM/dd HH:mm', { locale: ko })
                      : format(new Date(app.created_at), 'MM/dd HH:mm', { locale: ko })
                    }
                  </TableCell>
                  <TableCell className="font-medium">
                    {app.business_name || '-'}
                  </TableCell>
                  <TableCell>{app.representative_name || '-'}</TableCell>
                  <TableCell className="text-sm">
                    {app.phone_number || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {app.business_type || '미정'}
                    </Badge>
                  </TableCell>
                  <TableCell>{checkDocumentStatus(app)}</TableCell>
                  <TableCell>{getStatusBadge(app.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      <Link href={`/admin/enrollments/${app.id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      {app.status === 'submitted' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600"
                            onClick={() => updateStatus(app.id, 'approved')}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            onClick={() => updateStatus(app.id, 'rejected')}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            전체 {totalCount}개 중 {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalCount)}개 표시
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              이전
            </Button>
            <span className="flex items-center px-3 text-sm">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              다음
            </Button>
          </div>
        </div>
      )}

      {/* Quick View Sheet */}
      <EnrollmentQuickView
        enrollmentId={quickViewId}
        isOpen={isQuickViewOpen}
        onClose={() => {
          setIsQuickViewOpen(false)
          setQuickViewId(null)
        }}
      />
    </div>
  )
}