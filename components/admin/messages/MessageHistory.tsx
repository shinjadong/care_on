'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import {
  CheckCircle,
  XCircle,
  Clock,
  Send,
  MessageCircle,
  Bell,
  Search,
  RefreshCw
} from 'lucide-react'

interface MessageHistoryItem {
  id: number
  message_type: string
  recipient_phone: string
  recipient_name: string
  message_content: string
  status: string
  error_message?: string
  sent_at: string
  created_at: string
  customer?: {
    id: number
    name: string
    business_name: string
  }
  enrollment?: {
    id: number
    applicant_name: string
    store_name: string
  }
}

export default function MessageHistory() {
  const [history, setHistory] = useState<MessageHistoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [stats, setStats] = useState({
    total: 0,
    sent: 0,
    delivered: 0,
    failed: 0
  })

  // 필터 상태
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    phone: '',
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    loadHistory()
  }, [page, filters])

  const loadHistory = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(filters.type && { type: filters.type }),
        ...(filters.status && { status: filters.status }),
        ...(filters.phone && { phone: filters.phone }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      })

      const res = await fetch(`/api/admin/messages/history?${params}`)
      const data = await res.json()

      if (data.success) {
        setHistory(data.data)
        setTotalPages(data.pagination.totalPages)
        if (data.stats) {
          setStats(data.stats)
        }
      }
    } catch (error) {
      console.error('이력 로드 실패:', error)
      toast.error('메시지 이력을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Send className="mr-1 h-3 w-3" />
            발송됨
          </Badge>
        )
      case 'delivered':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" />
            전달됨
          </Badge>
        )
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="mr-1 h-3 w-3" />
            실패
          </Badge>
        )
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="mr-1 h-3 w-3" />
            대기중
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'SMS':
      case 'LMS':
        return <MessageCircle className="h-4 w-4" />
      case 'ALIMTALK':
        return <Bell className="h-4 w-4 text-yellow-600" />
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const truncateMessage = (message: string, maxLength = 50) => {
    if (message.length <= maxLength) return message
    return message.substring(0, maxLength) + '...'
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>메시지 발송 이력</CardTitle>
            <CardDescription>
              SMS 및 카카오 알림톡 발송 이력을 확인합니다.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadHistory}
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            새로고침
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 통계 */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-muted-foreground">전체 발송</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.sent}</div>
              <p className="text-sm text-muted-foreground">발송됨</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
              <p className="text-sm text-muted-foreground">전달됨</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
              <p className="text-sm text-muted-foreground">실패</p>
            </CardContent>
          </Card>
        </div>

        {/* 필터 */}
        <div className="flex gap-2">
          <Select
            value={filters.type}
            onValueChange={(value) => setFilters({ ...filters, type: value })}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="메시지 유형" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">전체</SelectItem>
              <SelectItem value="SMS">SMS</SelectItem>
              <SelectItem value="LMS">LMS</SelectItem>
              <SelectItem value="ALIMTALK">알림톡</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.status}
            onValueChange={(value) => setFilters({ ...filters, status: value })}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="상태" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">전체</SelectItem>
              <SelectItem value="sent">발송됨</SelectItem>
              <SelectItem value="delivered">전달됨</SelectItem>
              <SelectItem value="failed">실패</SelectItem>
              <SelectItem value="pending">대기중</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="전화번호 검색..."
              value={filters.phone}
              onChange={(e) => setFilters({ ...filters, phone: e.target.value })}
              className="pl-10"
            />
          </div>

          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="w-[150px]"
          />

          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            className="w-[150px]"
          />
        </div>

        {/* 테이블 */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>유형</TableHead>
                <TableHead>수신자</TableHead>
                <TableHead>메시지</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>발송일시</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getMessageTypeIcon(item.message_type)}
                      <span className="text-sm font-medium">{item.message_type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.recipient_name || '이름 없음'}</p>
                      <p className="text-sm text-muted-foreground">{item.recipient_phone}</p>
                      {item.customer && (
                        <p className="text-xs text-muted-foreground">{item.customer.business_name}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm" title={item.message_content}>
                      {truncateMessage(item.message_content)}
                    </p>
                    {item.error_message && (
                      <p className="text-xs text-red-600 mt-1">오류: {item.error_message}</p>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-sm">
                    {formatDate(item.sent_at || item.created_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            페이지 {page} / {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              이전
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              다음
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
