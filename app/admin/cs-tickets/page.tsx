'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Ticket, 
  Plus, 
  Search,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  User,
  Calendar,
  Filter,
  Eye,
  Edit
} from 'lucide-react'

interface CSTicket {
  id: string
  customer_id: string
  contract_id: string | null
  subject: string
  category: 'install' | 'billing' | 'technical' | 'refund' | 'change_request' | 'other'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'pending_customer' | 'on_hold' | 'resolved' | 'closed'
  channel: 'phone' | 'email' | 'kakao' | 'web' | 'in_person' | null
  assigned_employee_id: number | null
  due_at: string | null
  resolved_at: string | null
  last_activity_at: string
  created_at: string
  customer?: {
    customer_code: string
    business_name: string
    owner_name: string
    phone: string
  }
  contract?: {
    contract_number: string
    status: string
  }
  assigned_employee?: {
    name: string
    department: string
  }
  comments?: { count: number }[]
}

export default function CSTicketsPage() {
  const [tickets, setTickets] = useState<CSTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<CSTicket | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [customerSearchTerm, setCustomerSearchTerm] = useState('')
  const [searchedCustomers, setSearchedCustomers] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [newTicketForm, setNewTicketForm] = useState({
    subject: '',
    category: '',
    priority: 'normal',
    initial_comment: '',
    due_date: ''
  })

  const handleCustomerSearch = async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setSearchedCustomers([])
      return
    }

    try {
      const response = await fetch(`/api/customers?search=${encodeURIComponent(searchTerm)}&limit=10`)
      if (response.ok) {
        const data = await response.json()
        setSearchedCustomers(data.customers || [])
      }
    } catch (error) {
      console.error('고객 검색 오류:', error)
    }
  }

  const handleCreateTicket = async () => {
    try {
      if (!selectedCustomer || !newTicketForm.subject || !newTicketForm.category) {
        alert('고객 선택, 제목, 카테고리는 필수입니다.')
        return
      }

      const response = await fetch('/api/cs-tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: selectedCustomer.customer_id,
          subject: newTicketForm.subject,
          category: newTicketForm.category,
          priority: newTicketForm.priority,
          initial_comment: newTicketForm.initial_comment,
          due_at: newTicketForm.due_date || null
        })
      })

      if (response.ok) {
        alert('CS 티켓이 성공적으로 생성되었습니다.')
        setIsNewTicketOpen(false)
        setSelectedCustomer(null)
        setCustomerSearchTerm('')
        setNewTicketForm({
          subject: '',
          category: '',
          priority: 'normal',
          initial_comment: '',
          due_date: ''
        })
        fetchTickets() // 목록 새로고침
      } else {
        const errorData = await response.json()
        alert(`티켓 생성에 실패했습니다: ${errorData.error}`)
      }
    } catch (error) {
      console.error('티켓 생성 오류:', error)
      alert('네트워크 오류가 발생했습니다.')
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/cs-tickets')
      if (response.ok) {
        const data = await response.json()
        setTickets(data.tickets || [])
      }
    } catch (error) {
      console.error('Failed to fetch CS tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer?.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer?.customer_code.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter  
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="destructive">열림</Badge>
      case 'in_progress':
        return <Badge variant="default">진행중</Badge>
      case 'pending_customer':
        return <Badge variant="secondary">고객 대기</Badge>
      case 'on_hold':
        return <Badge variant="outline">보류</Badge>
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800">해결됨</Badge>
      case 'closed':
        return <Badge variant="secondary">종료</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">긴급</Badge>
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">높음</Badge>
      case 'normal':
        return <Badge variant="outline">보통</Badge>
      case 'low':
        return <Badge variant="secondary">낮음</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'install':
        return <Clock className="h-4 w-4" />
      case 'billing':
        return <AlertCircle className="h-4 w-4" />
      case 'technical':
        return <XCircle className="h-4 w-4" />
      case 'refund':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Ticket className="h-4 w-4" />
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'install': return '설치'
      case 'billing': return '청구'
      case 'technical': return '기술지원'
      case 'refund': return '환불'
      case 'change_request': return '변경요청'
      case 'other': return '기타'
      default: return category
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CS 티켓 관리</h1>
          <p className="text-gray-600">고객 서비스 요청을 체계적으로 관리합니다</p>
        </div>
        <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              새 티켓 생성
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>새 CS 티켓 생성</DialogTitle>
              <DialogDescription>고객 서비스 요청을 등록합니다</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="customer_search">고객 검색 *</Label>
                <Input 
                  id="customer_search" 
                  value={customerSearchTerm}
                  onChange={(e) => {
                    setCustomerSearchTerm(e.target.value)
                    handleCustomerSearch(e.target.value)
                  }}
                  placeholder="고객명 또는 고객코드로 검색" 
                />
                {searchedCustomers.length > 0 && (
                  <div className="border rounded-md max-h-40 overflow-y-auto">
                    {searchedCustomers.map((customer: any) => (
                      <div 
                        key={customer.customer_id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSelectedCustomer(customer)
                          setCustomerSearchTerm(customer.business_name)
                          setSearchedCustomers([])
                        }}
                      >
                        <div className="font-medium">{customer.business_name}</div>
                        <div className="text-sm text-gray-500">
                          {customer.customer_code} | {customer.owner_name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {selectedCustomer && (
                  <div className="p-3 bg-green-50 rounded-md">
                    <div className="font-medium text-green-800">선택된 고객:</div>
                    <div className="text-sm text-green-600">
                      {selectedCustomer.business_name} ({selectedCustomer.customer_code})
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="ticket_subject">제목 *</Label>
                <Input 
                  id="ticket_subject" 
                  value={newTicketForm.subject}
                  onChange={(e) => setNewTicketForm({...newTicketForm, subject: e.target.value})}
                  placeholder="티켓 제목을 입력하세요" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ticket_category">카테고리 *</Label>
                  <Select value={newTicketForm.category} onValueChange={(value) => setNewTicketForm({...newTicketForm, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="install">설치</SelectItem>
                      <SelectItem value="billing">청구</SelectItem>
                      <SelectItem value="technical">기술지원</SelectItem>
                      <SelectItem value="refund">환불</SelectItem>
                      <SelectItem value="change_request">변경요청</SelectItem>
                      <SelectItem value="other">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ticket_priority">우선순위</Label>
                  <Select value={newTicketForm.priority} onValueChange={(value) => setNewTicketForm({...newTicketForm, priority: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="우선순위 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">낮음</SelectItem>
                      <SelectItem value="normal">보통</SelectItem>
                      <SelectItem value="high">높음</SelectItem>
                      <SelectItem value="urgent">긴급</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="initial_comment">초기 내용</Label>
                <Textarea 
                  id="initial_comment" 
                  value={newTicketForm.initial_comment}
                  onChange={(e) => setNewTicketForm({...newTicketForm, initial_comment: e.target.value})}
                  placeholder="고객 요청 내용을 입력하세요"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="due_date">처리 예정일</Label>
                <Input 
                  id="due_date" 
                  type="date" 
                  value={newTicketForm.due_date}
                  onChange={(e) => setNewTicketForm({...newTicketForm, due_date: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewTicketOpen(false)}>
                취소
              </Button>
              <Button onClick={handleCreateTicket}>티켓 생성</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">전체 티켓</p>
                <p className="text-2xl font-bold">{tickets.length}</p>
              </div>
              <Ticket className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">미처리</p>
                <p className="text-2xl font-bold text-red-600">
                  {tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">긴급</p>
                <p className="text-2xl font-bold text-orange-600">
                  {tickets.filter(t => t.priority === 'urgent').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">해결됨</p>
                <p className="text-2xl font-bold text-green-600">
                  {tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CS 티켓 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>CS 티켓 목록</CardTitle>
          <CardDescription>모든 고객 서비스 요청을 확인하고 처리합니다</CardDescription>
        </CardHeader>
        <CardContent>
          {/* 검색 및 필터 */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="제목, 고객명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 상태</SelectItem>
                <SelectItem value="open">열림</SelectItem>
                <SelectItem value="in_progress">진행중</SelectItem>
                <SelectItem value="pending_customer">고객 대기</SelectItem>
                <SelectItem value="on_hold">보류</SelectItem>
                <SelectItem value="resolved">해결됨</SelectItem>
                <SelectItem value="closed">종료</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="우선순위" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 우선순위</SelectItem>
                <SelectItem value="urgent">긴급</SelectItem>
                <SelectItem value="high">높음</SelectItem>
                <SelectItem value="normal">보통</SelectItem>
                <SelectItem value="low">낮음</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="카테고리" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 카테고리</SelectItem>
                <SelectItem value="install">설치</SelectItem>
                <SelectItem value="billing">청구</SelectItem>
                <SelectItem value="technical">기술지원</SelectItem>
                <SelectItem value="refund">환불</SelectItem>
                <SelectItem value="change_request">변경요청</SelectItem>
                <SelectItem value="other">기타</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 티켓 테이블 */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">티켓 정보를 불러오는 중...</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>제목</TableHead>
                    <TableHead>고객</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead>우선순위</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>담당자</TableHead>
                    <TableHead>생성일</TableHead>
                    <TableHead>마감일</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {getCategoryIcon(ticket.category)}
                          <div>
                            <div className="font-medium">{ticket.subject}</div>
                            <div className="flex items-center space-x-2 mt-1">
                              {ticket.channel && (
                                <Badge variant="outline" className="text-xs">
                                  {ticket.channel}
                                </Badge>
                              )}
                              {ticket.comments && ticket.comments[0]?.count > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  {ticket.comments[0].count}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {ticket.customer?.business_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {ticket.customer?.customer_code}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getCategoryLabel(ticket.category)}
                        </Badge>
                      </TableCell>
                      <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                      <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                      <TableCell>
                        {ticket.assigned_employee ? (
                          <div>
                            <div className="font-medium text-sm">
                              {ticket.assigned_employee.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {ticket.assigned_employee.department}
                            </div>
                          </div>
                        ) : (
                          <Badge variant="outline">미배정</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {ticket.due_at ? (
                          <div className={`text-sm ${
                            new Date(ticket.due_at) < new Date() 
                              ? 'text-red-600 font-medium' 
                              : 'text-gray-600'
                          }`}>
                            {new Date(ticket.due_at).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedTicket(ticket)
                            setIsDetailOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 티켓 상세 정보 모달 */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>CS 티켓 상세 정보</DialogTitle>
            <DialogDescription>
              #{selectedTicket?.id.slice(0, 8)} - {selectedTicket?.subject}
            </DialogDescription>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">고객정보</Label>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {selectedTicket.customer?.business_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedTicket.customer?.customer_code} | {selectedTicket.customer?.owner_name}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">상태 정보</Label>
                  <div className="flex space-x-2 mt-1">
                    {getStatusBadge(selectedTicket.status)}
                    {getPriorityBadge(selectedTicket.priority)}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">카테고리</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    {getCategoryIcon(selectedTicket.category)}
                    <span className="text-sm">{getCategoryLabel(selectedTicket.category)}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">접수 채널</Label>
                  <p className="text-sm mt-1">
                    {selectedTicket.channel || '미지정'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">생성일</Label>
                  <p className="text-sm mt-1">
                    {new Date(selectedTicket.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">마감일</Label>
                  <p className="text-sm mt-1">
                    {selectedTicket.due_at 
                      ? new Date(selectedTicket.due_at).toLocaleDateString()
                      : '미설정'
                    }
                  </p>
                </div>
              </div>
              {selectedTicket.assigned_employee && (
                <div>
                  <Label className="text-sm font-medium">담당자</Label>
                  <p className="text-sm mt-1">
                    {selectedTicket.assigned_employee.name} ({selectedTicket.assigned_employee.department})
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              닫기
            </Button>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              수정
            </Button>
            <Button>
              <MessageSquare className="h-4 w-4 mr-2" />
              댓글 작성
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}