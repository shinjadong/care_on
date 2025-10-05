'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft,
  User,
  Building,
  Phone,
  Mail,
  MapPin,
  Edit,
  Plus,
  FileText,
  Calculator,
  Ticket,
  DollarSign,
  Package,
  Eye,
  Trash2
} from 'lucide-react'
import Link from 'next/link'

interface Customer {
  customer_id: string
  customer_code: string
  business_name: string
  owner_name: string
  business_registration: string | null
  phone: string | null
  email: string | null
  address: string | null
  industry: string | null
  status: string
  care_status: string
  account_manager_employee_id: number | null
  created_at: string
}

interface Contract {
  id: string
  contract_number: string
  status: string
  total_monthly_fee: number
  package?: {
    name: string
    monthly_fee: number
  }
  created_at: string
}

interface CSTicket {
  id: string
  subject: string
  category: string
  priority: string
  status: string
  created_at: string
}

export default function CustomerDetailPage() {
  const params = useParams()
  const customer_id = params.id as string

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [contracts, setContracts] = useState<Contract[]>([])
  const [csTickets, setCSTickets] = useState<CSTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<Customer>>({})

  // 새 계약 생성
  const [isNewContractOpen, setIsNewContractOpen] = useState(false)
  const [packages, setPackages] = useState([])
  const [selectedPackage, setSelectedPackage] = useState<any>(null)

  // 견적서 생성
  const [isNewQuoteOpen, setIsNewQuoteOpen] = useState(false)

  useEffect(() => {
    if (customer_id) {
      fetchCustomerDetails()
      fetchCustomerContracts()
      fetchCustomerCSTickets()
      fetchPackages()
    }
  }, [customer_id])

  const fetchCustomerDetails = async () => {
    try {
      const response = await fetch(`/api/customers/${customer_id}`)
      if (response.ok) {
        const data = await response.json()
        setCustomer(data.customer)
        setEditForm(data.customer)
      }
    } catch (error) {
      console.error('Failed to fetch customer details:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomerContracts = async () => {
    try {
      const response = await fetch(`/api/customers/${customer_id}/contracts`)
      if (response.ok) {
        const data = await response.json()
        setContracts(data.contracts || [])
      }
    } catch (error) {
      console.error('Failed to fetch customer contracts:', error)
    }
  }

  const fetchCustomerCSTickets = async () => {
    try {
      const response = await fetch(`/api/cs-tickets?customer_id=${customer_id}`)
      if (response.ok) {
        const data = await response.json()
        setCSTickets(data.tickets || [])
      }
    } catch (error) {
      console.error('Failed to fetch CS tickets:', error)
    }
  }

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/packages?active_only=true')
      if (response.ok) {
        const data = await response.json()
        setPackages(data.packages || [])
      }
    } catch (error) {
      console.error('Failed to fetch packages:', error)
    }
  }

  const handleUpdateCustomer = async () => {
    try {
      const response = await fetch(`/api/customers/${customer_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })

      if (response.ok) {
        alert('고객 정보가 성공적으로 수정되었습니다.')
        setEditing(false)
        fetchCustomerDetails()
      } else {
        alert('고객 정보 수정에 실패했습니다.')
      }
    } catch (error) {
      console.error('고객 수정 오류:', error)
      alert('네트워크 오류가 발생했습니다.')
    }
  }

  const handleCreateContract = async () => {
    try {
      if (!customer || !selectedPackage) {
        alert('고객과 패키지 정보가 필요합니다.')
        return
      }

      const response = await fetch('/api/contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: customer.business_name,
          owner_name: customer.owner_name,
          phone: customer.phone,
          email: customer.email || '',
          address: customer.address || '',
          business_registration: customer.business_registration || '',
          internet_plan: selectedPackage.name,
          cctv_count: '패키지 포함',
          installation_address: customer.address || '',
          bank_name: '미입력',
          account_number: '미입력',
          account_holder: customer.owner_name,
          terms_agreed: true,
          info_agreed: true
        })
      })

      if (response.ok) {
        const contractData = await response.json()
        
        // 패키지 기반 견적 생성
        await fetch('/api/quotes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contract_id: contractData.id,
            customer_id: customer.customer_id,
            package_id: selectedPackage.package_id,
            manager_name: '관리자'
          })
        })

        alert('계약 및 견적서가 성공적으로 생성되었습니다!')
        setIsNewContractOpen(false)
        setSelectedPackage(null)
        fetchCustomerContracts()
      } else {
        alert('계약 생성에 실패했습니다.')
      }
    } catch (error) {
      console.error('계약 생성 오류:', error)
      alert('네트워크 오류가 발생했습니다.')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">활성</Badge>
      case 'inactive':
        return <Badge variant="secondary">비활성</Badge>
      case 'suspended':
        return <Badge variant="destructive">일시정지</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getContractStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">대기</Badge>
      case 'quoted':
        return <Badge className="bg-blue-100 text-blue-800">견적완료</Badge>
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">승인</Badge>
      case 'active':
        return <Badge variant="default">활성</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">고객 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <User className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">고객을 찾을 수 없습니다</h3>
          <p className="text-gray-600 mb-4">요청하신 고객 정보가 존재하지 않습니다.</p>
          <Link href="/admin/customers">
            <Button>고객 목록으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/customers">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              뒤로가기
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {customer.business_name}
            </h1>
            <p className="text-gray-600">
              {customer.customer_code} | {customer.owner_name}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          {editing ? (
            <>
              <Button variant="outline" onClick={() => setEditing(false)}>
                취소
              </Button>
              <Button onClick={handleUpdateCustomer}>
                저장
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              정보 수정
            </Button>
          )}
        </div>
      </div>

      {/* 고객 기본 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="h-5 w-5 mr-2" />
            기본 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          {editing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>사업체명 *</Label>
                <Input 
                  value={editForm.business_name || ''}
                  onChange={(e) => setEditForm({...editForm, business_name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>대표자명 *</Label>
                <Input 
                  value={editForm.owner_name || ''}
                  onChange={(e) => setEditForm({...editForm, owner_name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>전화번호</Label>
                <Input 
                  value={editForm.phone || ''}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>이메일</Label>
                <Input 
                  value={editForm.email || ''}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>주소</Label>
                <Input 
                  value={editForm.address || ''}
                  onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>사업자등록번호</Label>
                <Input 
                  value={editForm.business_registration || ''}
                  onChange={(e) => setEditForm({...editForm, business_registration: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>업종</Label>
                <Input 
                  value={editForm.industry || ''}
                  onChange={(e) => setEditForm({...editForm, industry: e.target.value})}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Building className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">사업체명</p>
                    <p className="font-medium">{customer.business_name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">대표자</p>
                    <p className="font-medium">{customer.owner_name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">전화번호</p>
                    <p className="font-medium">{customer.phone || '-'}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">이메일</p>
                    <p className="font-medium">{customer.email || '-'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">주소</p>
                    <p className="font-medium">{customer.address || '-'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">상태</p>
                  <div className="flex space-x-2">
                    {getStatusBadge(customer.status)}
                    <Badge variant="outline">{customer.care_status}</Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 탭 메뉴 */}
      <Tabs defaultValue="contracts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="contracts">계약 관리</TabsTrigger>
          <TabsTrigger value="cs-tickets">CS 내역</TabsTrigger>
          <TabsTrigger value="billing">청구 내역</TabsTrigger>
        </TabsList>

        {/* 계약 관리 탭 */}
        <TabsContent value="contracts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>계약 목록</CardTitle>
                <div className="flex space-x-2">
                  <Dialog open={isNewQuoteOpen} onOpenChange={setIsNewQuoteOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Calculator className="h-4 w-4 mr-2" />
                        견적서 생성
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>견적서 생성</DialogTitle>
                        <DialogDescription>
                          {customer.business_name}에 대한 새 견적서를 생성합니다
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>패키지 선택</Label>
                          <div className="grid gap-2">
                            {packages.map((pkg: any) => (
                              <div 
                                key={pkg.package_id}
                                className={`p-3 border rounded-lg cursor-pointer ${
                                  selectedPackage?.package_id === pkg.package_id 
                                    ? 'border-blue-500 bg-blue-50' 
                                    : 'border-gray-200'
                                }`}
                                onClick={() => setSelectedPackage(pkg)}
                              >
                                <div className="flex justify-between">
                                  <span className="font-medium">{pkg.name}</span>
                                  <span className="font-bold">{pkg.monthly_fee.toLocaleString()}원/월</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsNewQuoteOpen(false)}>
                          취소
                        </Button>
                        <Button onClick={handleCreateContract}>견적서 생성</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isNewContractOpen} onOpenChange={setIsNewContractOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        새 계약
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>새 계약 생성</DialogTitle>
                      </DialogHeader>
                      <p>계약 생성 폼이 여기에 들어갑니다.</p>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {contracts.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">등록된 계약이 없습니다</p>
                  <Button onClick={() => setIsNewQuoteOpen(true)}>
                    <Calculator className="h-4 w-4 mr-2" />
                    첫 견적서 생성
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>계약번호</TableHead>
                      <TableHead>패키지</TableHead>
                      <TableHead>월 요금</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>생성일</TableHead>
                      <TableHead className="w-[100px]">작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contracts.map((contract) => (
                      <TableRow key={contract.id}>
                        <TableCell className="font-medium">
                          {contract.contract_number}
                        </TableCell>
                        <TableCell>
                          {contract.package ? (
                            <div>
                              <div className="font-medium">{contract.package.name}</div>
                              <div className="text-sm text-gray-500">
                                패키지 요금: {contract.package.monthly_fee.toLocaleString()}원/월
                              </div>
                            </div>
                          ) : (
                            <Badge variant="outline">맞춤형</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-bold">
                            {contract.total_monthly_fee.toLocaleString()}원
                          </div>
                        </TableCell>
                        <TableCell>{getContractStatusBadge(contract.status)}</TableCell>
                        <TableCell>
                          {new Date(contract.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* CS 내역 탭 */}
        <TabsContent value="cs-tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CS 처리 내역</CardTitle>
            </CardHeader>
            <CardContent>
              {csTickets.length === 0 ? (
                <div className="text-center py-8">
                  <Ticket className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">CS 내역이 없습니다</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {csTickets.map((ticket) => (
                    <div key={ticket.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{ticket.subject}</h4>
                          <div className="flex space-x-2 mt-2">
                            <Badge variant="outline">{ticket.category}</Badge>
                            <Badge variant="outline">{ticket.priority}</Badge>
                            <Badge variant="outline">{ticket.status}</Badge>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(ticket.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 청구 내역 탭 */}
        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>청구 내역</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">청구 내역 기능 구현 예정</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}