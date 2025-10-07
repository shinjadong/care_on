'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Search, Users, UserCheck, Loader2 } from 'lucide-react'

interface Customer {
  id: string
  name: string
  phone: string
  businessName?: string
  email?: string
  status?: string
  businessType?: string
  type: 'customer' | 'enrollment'
  customerId?: number
  enrollmentId?: number
}

interface CustomerSelectorProps {
  onSelectionChange: (customers: Customer[]) => void
  selectedCustomers: Customer[]
}

export default function CustomerSelector({
  onSelectionChange,
  selectedCustomers = []
}: CustomerSelectorProps) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [groupType, setGroupType] = useState('manual')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (groupType === 'manual') {
      loadCustomers()
    }
  }, [search, page])

  useEffect(() => {
    // 선택된 고객 ID 동기화
    const ids = new Set(selectedCustomers.map(c => c.id))
    setSelectedIds(ids)
  }, [selectedCustomers])

  const loadCustomers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50',
        ...(search && { search })
      })

      const res = await fetch(`/api/admin/messages/customers?${params}`)
      const data = await res.json()

      if (data.success) {
        setCustomers(data.customers)
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages)
        }
      }
    } catch (error) {
      console.error('고객 로드 실패:', error)
      toast.error('고객 목록을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const loadGroupCustomers = async () => {
    if (groupType === 'manual') return

    setLoading(true)
    try {
      const res = await fetch('/api/admin/messages/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupType,
          filters: {}
        })
      })

      const data = await res.json()

      if (data.success) {
        const formattedCustomers = data.recipients.map((r: any) => ({
          id: r.customerId ? `customer_${r.customerId}` : `enrollment_${r.enrollmentId}`,
          name: r.name,
          phone: r.phone,
          customerId: r.customerId,
          enrollmentId: r.enrollmentId,
          type: r.customerId ? 'customer' : 'enrollment'
        }))

        setCustomers(formattedCustomers)

        // 그룹 선택 시 자동으로 모두 선택
        const allIds = new Set(formattedCustomers.map((c: Customer) => c.id))
        setSelectedIds(allIds)
        onSelectionChange(formattedCustomers)

        toast.success(`${formattedCustomers.length}명의 고객을 선택했습니다.`)
      }
    } catch (error) {
      console.error('그룹 로드 실패:', error)
      toast.error('고객 그룹을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectCustomer = (customer: Customer, checked: boolean) => {
    const newSelectedIds = new Set(selectedIds)
    const newSelectedCustomers = [...selectedCustomers]

    if (checked) {
      newSelectedIds.add(customer.id)
      if (!selectedCustomers.find(c => c.id === customer.id)) {
        newSelectedCustomers.push(customer)
      }
    } else {
      newSelectedIds.delete(customer.id)
      const index = newSelectedCustomers.findIndex(c => c.id === customer.id)
      if (index > -1) {
        newSelectedCustomers.splice(index, 1)
      }
    }

    setSelectedIds(newSelectedIds)
    onSelectionChange(newSelectedCustomers)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(customers.map(c => c.id))
      setSelectedIds(allIds)
      onSelectionChange(customers)
    } else {
      setSelectedIds(new Set())
      onSelectionChange([])
    }
  }

  const getGroupLabel = (type: string) => {
    switch (type) {
      case 'manual': return '수동 선택'
      case 'all_customers': return '전체 고객'
      case 'active_customers': return '활성 고객'
      case 'pending_enrollments': return '승인 대기 신청자'
      case 'approved_enrollments': return '승인된 신청자'
      default: return type
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>수신자 선택</CardTitle>
        <CardDescription>
          메시지를 받을 고객을 선택하세요. ({selectedIds.size}명 선택됨)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 그룹 선택 */}
        <div className="flex gap-2">
          <Select
            value={groupType}
            onValueChange={(value) => {
              setGroupType(value)
              if (value !== 'manual') {
                loadGroupCustomers()
              }
            }}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">수동 선택</SelectItem>
              <SelectItem value="all_customers">전체 고객</SelectItem>
              <SelectItem value="active_customers">활성 고객</SelectItem>
              <SelectItem value="pending_enrollments">승인 대기 신청자</SelectItem>
              <SelectItem value="approved_enrollments">승인된 신청자</SelectItem>
            </SelectContent>
          </Select>

          {groupType !== 'manual' && (
            <Button onClick={loadGroupCustomers} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  로딩 중...
                </>
              ) : (
                <>
                  <Users className="mr-2 h-4 w-4" />
                  그룹 불러오기
                </>
              )}
            </Button>
          )}
        </div>

        {/* 수동 선택 모드일 때만 검색 표시 */}
        {groupType === 'manual' && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="이름, 전화번호, 업체명으로 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {/* 고객 목록 테이블 */}
        <div className="rounded-md border max-h-[400px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={customers.length > 0 && selectedIds.size === customers.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>이름</TableHead>
                <TableHead>전화번호</TableHead>
                <TableHead>업체명</TableHead>
                <TableHead>상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(customer.id)}
                      onCheckedChange={(checked) =>
                        handleSelectCustomer(customer, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.businessName || '-'}</TableCell>
                  <TableCell>
                    {customer.status && (
                      <Badge
                        variant={customer.status === 'active' ? 'default' : 'secondary'}
                      >
                        {customer.status}
                      </Badge>
                    )}
                    {customer.type === 'enrollment' && (
                      <Badge variant="outline">신청자</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* 페이지네이션 (수동 선택 모드일 때만) */}
        {groupType === 'manual' && totalPages > 1 && (
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              페이지 {page} / {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1 || loading}
              >
                이전
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages || loading}
              >
                다음
              </Button>
            </div>
          </div>
        )}

        {/* 선택된 고객 요약 */}
        {selectedIds.size > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-blue-600" />
                <span className="font-medium">{selectedIds.size}명 선택됨</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedIds(new Set())
                  onSelectionChange([])
                }}
              >
                선택 해제
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
