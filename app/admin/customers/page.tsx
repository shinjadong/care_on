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
import { Switch } from '@/components/ui/switch'
import { 
  Search, 
  Plus, 
  Edit, 
  Eye, 
  Phone, 
  Mail, 
  Building, 
  User,
  Filter,
  MoreHorizontal,
  FileText,
  Ticket
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
  status: 'active' | 'inactive' | 'suspended'
  account_manager_employee_id: number | null
  care_status: 'onboarding' | 'active' | 'paused' | 'offboarded'
  created_at: string
  contracts?: { count: number }[]
  cs_tickets?: { count: number }[]
  // 기존 확장 필드들
  tags?: string[]
  grade?: 'A' | 'B' | 'C'
  importance?: number
  last_contact_at?: string
  next_followup_at?: string
  lifetime_value?: number
  satisfaction_score?: number
  notes?: string
  // 새로 추가된 필드들
  franchise_code?: string
  business_registration_date?: string
  gender?: 'male' | 'female' | 'other' | 'unknown'
  birth_date?: string
  age?: number
  current_services?: {
    internet?: { active: boolean, plan: string, monthly_fee: number, start_date?: string }
    cctv?: { active: boolean, count: number, monthly_fee: number, start_date?: string }
    pos?: { active: boolean, type: string, monthly_fee: number, start_date?: string }
    insurance?: { active: boolean, type: string, monthly_fee: number, start_date?: string }
    phone?: { active: boolean, type: string, monthly_fee: number, start_date?: string }
    others?: Array<{ name: string, monthly_fee: number, start_date?: string }>
  }
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [gradeFilter, setGradeFilter] = useState('all')
  const [tagFilter, setTagFilter] = useState('all')
  const [importanceFilter, setImportanceFilter] = useState('all')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [editingField, setEditingField] = useState<{customer_id: string, field: string} | null>(null)
  const [editingValue, setEditingValue] = useState('')
  
  // 태그 관리
  const [isTagModalOpen, setIsTagModalOpen] = useState(false)
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null)
  const [newTag, setNewTag] = useState('')
  
  // 벌크 액션
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState('')
  
  // 서비스 관리
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)
  const [serviceCustomer, setServiceCustomer] = useState<Customer | null>(null)
  const [serviceForm, setServiceForm] = useState({
    internet: { active: false, plan: '', monthly_fee: 0 },
    cctv: { active: false, count: 0, monthly_fee: 0 },
    pos: { active: false, type: '', monthly_fee: 0 },
    insurance: { active: false, type: '', monthly_fee: 0 },
    phone: { active: false, type: '', monthly_fee: 0 }
  })
  const [newCustomerForm, setNewCustomerForm] = useState({
    business_name: '',
    owner_name: '',
    business_registration: '',
    phone: '',
    email: '',
    address: '',
    industry: ''
  })

  const handleAddCustomer = async () => {
    try {
      if (!newCustomerForm.business_name || !newCustomerForm.owner_name) {
        alert('사업체명과 대표자명은 필수입니다.')
        return
      }

      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomerForm)
      })

      if (response.ok) {
        alert('고객이 성공적으로 추가되었습니다.')
        setIsNewCustomerOpen(false)
        setNewCustomerForm({
          business_name: '',
          owner_name: '',
          business_registration: '',
          phone: '',
          email: '',
          address: '',
          industry: ''
        })
        fetchCustomers() // 목록 새로고침
      } else {
        const errorData = await response.json()
        alert(`고객 추가에 실패했습니다: ${errorData.error}`)
      }
    } catch (error) {
      console.error('고객 추가 오류:', error)
      alert('네트워크 오류가 발생했습니다.')
    }
  }

  // 인라인 편집 함수들
  const startEditing = (customer_id: string, field: string, currentValue: string) => {
    setEditingField({ customer_id, field })
    setEditingValue(currentValue || '')
  }

  const cancelEditing = () => {
    setEditingField(null)
    setEditingValue('')
  }

  const saveFieldEdit = async (customer_id: string, field: string, value: string) => {
    try {
      const response = await fetch(`/api/customers/${customer_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value })
      })

      if (response.ok) {
        // 성공 시 고객 목록에서 해당 필드 업데이트
        setCustomers(customers.map(customer => 
          customer.customer_id === customer_id 
            ? { ...customer, [field]: value }
            : customer
        ))
        setEditingField(null)
        setEditingValue('')
      } else {
        alert('수정에 실패했습니다.')
      }
    } catch (error) {
      console.error('필드 수정 오류:', error)
      alert('네트워크 오류가 발생했습니다.')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent, customer_id: string, field: string) => {
    if (e.key === 'Enter') {
      saveFieldEdit(customer_id, field, editingValue)
    } else if (e.key === 'Escape') {
      cancelEditing()
    }
  }

  const isEditing = (customer_id: string, field: string) => {
    return editingField?.customer_id === customer_id && editingField?.field === field
  }

  // 태그 관리 함수들
  const handleAddTag = async (customer_id: string, tag: string) => {
    try {
      const customer = customers.find(c => c.customer_id === customer_id)
      if (!customer) return

      const newTags = [...(customer.tags || []), tag.trim()]
      
      const response = await fetch(`/api/customers/${customer_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: newTags })
      })

      if (response.ok) {
        setCustomers(customers.map(c => 
          c.customer_id === customer_id 
            ? { ...c, tags: newTags }
            : c
        ))
        setNewTag('')
      }
    } catch (error) {
      console.error('태그 추가 오류:', error)
    }
  }

  const handleRemoveTag = async (customer_id: string, tagToRemove: string) => {
    try {
      const customer = customers.find(c => c.customer_id === customer_id)
      if (!customer) return

      const newTags = (customer.tags || []).filter(tag => tag !== tagToRemove)
      
      const response = await fetch(`/api/customers/${customer_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: newTags })
      })

      if (response.ok) {
        setCustomers(customers.map(c => 
          c.customer_id === customer_id 
            ? { ...c, tags: newTags }
            : c
        ))
      }
    } catch (error) {
      console.error('태그 제거 오류:', error)
    }
  }

  const handleGradeChange = async (customer_id: string, grade: string) => {
    try {
      const response = await fetch(`/api/customers/${customer_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade })
      })

      if (response.ok) {
        setCustomers(customers.map(c => 
          c.customer_id === customer_id 
            ? { ...c, grade: grade as 'A' | 'B' | 'C' }
            : c
        ))
      }
    } catch (error) {
      console.error('등급 변경 오류:', error)
    }
  }

  // 체크박스 관리
  const handleSelectCustomer = (customer_id: string, checked: boolean) => {
    if (checked) {
      setSelectedCustomers([...selectedCustomers, customer_id])
    } else {
      setSelectedCustomers(selectedCustomers.filter(id => id !== customer_id))
    }
  }

  const handleSelectAllCustomers = (checked: boolean) => {
    if (checked) {
      setSelectedCustomers(filteredCustomers.map(c => c.customer_id))
    } else {
      setSelectedCustomers([])
    }
  }

  const getGradeBadge = (grade?: string) => {
    switch (grade) {
      case 'A':
        return <Badge className="bg-yellow-100 text-yellow-800">A급</Badge>
      case 'B':
        return <Badge className="bg-blue-100 text-blue-800">B급</Badge>
      case 'C':
        return <Badge className="bg-gray-100 text-gray-800">C급</Badge>
      default:
        return <Badge variant="outline">미분류</Badge>
    }
  }

  const getTagBadge = (tag: string, customer_id: string) => (
    <Badge 
      key={tag}
      variant="secondary" 
      className="mr-1 mb-1 cursor-pointer hover:bg-red-100"
      onClick={() => handleRemoveTag(customer_id, tag)}
      title="클릭하여 제거"
    >
      {tag} ×
    </Badge>
  )

  // 서비스 관리 함수들
  const openServiceModal = (customer: Customer) => {
    setServiceCustomer(customer)
    setServiceForm(customer.current_services || {
      internet: { active: false, plan: '', monthly_fee: 0 },
      cctv: { active: false, count: 0, monthly_fee: 0 },
      pos: { active: false, type: '', monthly_fee: 0 },
      insurance: { active: false, type: '', monthly_fee: 0 },
      phone: { active: false, type: '', monthly_fee: 0 }
    })
    setIsServiceModalOpen(true)
  }

  const handleSaveServices = async () => {
    if (!serviceCustomer) return

    try {
      const response = await fetch(`/api/customers/${serviceCustomer.customer_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_services: serviceForm })
      })

      if (response.ok) {
        setCustomers(customers.map(c => 
          c.customer_id === serviceCustomer.customer_id 
            ? { ...c, current_services: serviceForm }
            : c
        ))
        setIsServiceModalOpen(false)
        alert('서비스 정보가 성공적으로 업데이트되었습니다.')
      } else {
        alert('서비스 정보 업데이트에 실패했습니다.')
      }
    } catch (error) {
      console.error('서비스 업데이트 오류:', error)
      alert('네트워크 오류가 발생했습니다.')
    }
  }

  // 벌크 액션 함수들
  const handleBulkAction = async (action: string) => {
    if (selectedCustomers.length === 0) {
      alert('고객을 선택해주세요.')
      return
    }

    try {
      switch (action) {
        case 'grade_a':
        case 'grade_b':
        case 'grade_c':
          const grade = action.split('_')[1].toUpperCase()
          await Promise.all(selectedCustomers.map(id => handleGradeChange(id, grade)))
          alert(`${selectedCustomers.length}명의 고객을 ${grade}급으로 변경했습니다.`)
          break
          
        case 'status_active':
        case 'status_inactive':
          const status = action.split('_')[1]
          const promises = selectedCustomers.map(id => 
            fetch(`/api/customers/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status })
            })
          )
          await Promise.all(promises)
          alert(`${selectedCustomers.length}명의 고객 상태를 ${status}로 변경했습니다.`)
          fetchCustomers()
          break
          
        case 'export':
          handleExportCustomers(selectedCustomers)
          break
      }
      
      setSelectedCustomers([])
      setBulkAction('')
    } catch (error) {
      console.error('벌크 액션 오류:', error)
      alert('일괄 작업에 실패했습니다.')
    }
  }

  const handleBulkTagAdd = async (tag: string) => {
    if (selectedCustomers.length === 0) return

    try {
      const promises = selectedCustomers.map(async customer_id => {
        const customer = customers.find(c => c.customer_id === customer_id)
        if (customer && !customer.tags?.includes(tag)) {
          return fetch(`/api/customers/${customer_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              tags: [...(customer.tags || []), tag] 
            })
          })
        }
      })

      await Promise.all(promises.filter(Boolean))
      alert(`${selectedCustomers.length}명의 고객에 "${tag}" 태그를 추가했습니다.`)
      fetchCustomers()
      setSelectedCustomers([])
    } catch (error) {
      console.error('일괄 태그 추가 오류:', error)
      alert('태그 추가에 실패했습니다.')
    }
  }

  const handleExportCustomers = (customerIds: string[]) => {
    const exportData = customers
      .filter(c => customerIds.includes(c.customer_id))
      .map(c => ({
        고객코드: c.customer_code,
        사업체명: c.business_name,
        대표자명: c.owner_name,
        전화번호: c.phone,
        이메일: c.email,
        주소: c.address,
        업종: c.industry,
        등급: c.grade,
        태그: c.tags?.join(', '),
        상태: c.status,
        케어상태: c.care_status,
        등록일: new Date(c.created_at).toLocaleDateString()
      }))

    const csvContent = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map(row => Object.values(row).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `고객목록_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // 벌크 액션 적용 (useEffect 감지)
  useEffect(() => {
    if (bulkAction) {
      handleBulkAction(bulkAction)
    }
  }, [bulkAction])

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/customers')
      if (response.ok) {
        const data = await response.json()
        setCustomers(data.customers || [])
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customer_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter
    const matchesGrade = gradeFilter === 'all' || customer.grade === gradeFilter
    const matchesTag = tagFilter === 'all' || customer.tags?.includes(tagFilter)
    const matchesImportance = importanceFilter === 'all' || 
      (importanceFilter === 'high' && (customer.importance || 3) >= 4) ||
      (importanceFilter === 'medium' && (customer.importance || 3) === 3) ||
      (importanceFilter === 'low' && (customer.importance || 3) <= 2)

    return matchesSearch && matchesStatus && matchesGrade && matchesTag && matchesImportance
  })

  // 모든 태그 목록 추출
  const allTags = [...new Set(customers.flatMap(c => c.tags || []))]

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

  const getCareStatusBadge = (status: string) => {
    switch (status) {
      case 'onboarding':
        return <Badge variant="outline">온보딩 중</Badge>
      case 'active':
        return <Badge variant="default">케어 중</Badge>
      case 'paused':
        return <Badge variant="secondary">일시 중지</Badge>
      case 'offboarded':
        return <Badge variant="destructive">케어 종료</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">고객 관리</h1>
          <p className="text-gray-600">전체 고객 정보를 관리합니다</p>
          {selectedCustomers.length > 0 && (
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="outline">{selectedCustomers.length}명 선택됨</Badge>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  const emails = customers
                    .filter(c => selectedCustomers.includes(c.customer_id))
                    .map(c => c.email)
                    .filter(Boolean)
                  if (emails.length > 0) {
                    window.location.href = `mailto:${emails.join(',')}`
                  } else {
                    alert('선택된 고객 중 이메일이 있는 고객이 없습니다.')
                  }
                }}
              >
                <Mail className="h-4 w-4 mr-1" />
                일괄 이메일
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    태그 일괄 추가
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[400px]">
                  <DialogHeader>
                    <DialogTitle>일괄 태그 추가</DialogTitle>
                    <DialogDescription>
                      선택된 {selectedCustomers.length}명의 고객에 태그를 추가합니다
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>추가할 태그</Label>
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="태그명 입력"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newTag.trim()) {
                            handleBulkTagAdd(newTag.trim())
                            setNewTag('')
                          }
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>빠른 태그 선택</Label>
                      <div className="flex flex-wrap gap-2">
                        {['VIP', '신규고객', '재계약대상', '위험군', '프리미엄'].map(tag => (
                          <Badge 
                            key={tag}
                            variant="outline"
                            className="cursor-pointer hover:bg-blue-100"
                            onClick={() => {
                              handleBulkTagAdd(tag)
                              setNewTag('')
                            }}
                          >
                            + {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">취소</Button>
                    <Button 
                      onClick={() => {
                        if (newTag.trim()) {
                          handleBulkTagAdd(newTag.trim())
                          setNewTag('')
                        }
                      }}
                      disabled={!newTag.trim()}
                    >
                      태그 추가
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Select value={bulkAction} onValueChange={setBulkAction}>
                <SelectTrigger className="w-32 h-8">
                  <SelectValue placeholder="일괄 작업" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grade_a">A급으로 변경</SelectItem>
                  <SelectItem value="grade_b">B급으로 변경</SelectItem>
                  <SelectItem value="grade_c">C급으로 변경</SelectItem>
                  <SelectItem value="status_active">활성으로 변경</SelectItem>
                  <SelectItem value="status_inactive">비활성으로 변경</SelectItem>
                  <SelectItem value="export">선택 고객 내보내기</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <Dialog open={isNewCustomerOpen} onOpenChange={setIsNewCustomerOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              새 고객 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>새 고객 추가</DialogTitle>
              <DialogDescription>새로운 고객 정보를 입력해주세요</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business_name">사업체명 *</Label>
                  <Input 
                    id="business_name" 
                    value={newCustomerForm.business_name}
                    onChange={(e) => setNewCustomerForm({...newCustomerForm, business_name: e.target.value})}
                    placeholder="사업체명을 입력하세요" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="owner_name">대표자명 *</Label>
                  <Input 
                    id="owner_name" 
                    value={newCustomerForm.owner_name}
                    onChange={(e) => setNewCustomerForm({...newCustomerForm, owner_name: e.target.value})}
                    placeholder="대표자명을 입력하세요" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">전화번호</Label>
                  <Input 
                    id="phone" 
                    value={newCustomerForm.phone}
                    onChange={(e) => setNewCustomerForm({...newCustomerForm, phone: e.target.value})}
                    placeholder="010-0000-0000" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={newCustomerForm.email}
                    onChange={(e) => setNewCustomerForm({...newCustomerForm, email: e.target.value})}
                    placeholder="email@example.com" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="business_registration">사업자등록번호</Label>
                <Input 
                  id="business_registration" 
                  value={newCustomerForm.business_registration}
                  onChange={(e) => setNewCustomerForm({...newCustomerForm, business_registration: e.target.value})}
                  placeholder="000-00-00000" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">주소</Label>
                <Input 
                  id="address" 
                  value={newCustomerForm.address}
                  onChange={(e) => setNewCustomerForm({...newCustomerForm, address: e.target.value})}
                  placeholder="주소를 입력하세요" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">업종</Label>
                <Input 
                  id="industry" 
                  value={newCustomerForm.industry}
                  onChange={(e) => setNewCustomerForm({...newCustomerForm, industry: e.target.value})}
                  placeholder="예: 요식업, 서비스업" 
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewCustomerOpen(false)}>
                취소
              </Button>
              <Button onClick={handleAddCustomer}>고객 추가</Button>
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
                <p className="text-sm font-medium text-gray-600">전체 고객</p>
                <p className="text-2xl font-bold">{customers.length}</p>
              </div>
              <User className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">활성 고객</p>
                <p className="text-2xl font-bold">
                  {customers.filter(c => c.status === 'active').length}
                </p>
              </div>
              <Building className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">케어 중</p>
                <p className="text-2xl font-bold">
                  {customers.filter(c => c.care_status === 'active').length}
                </p>
              </div>
              <Ticket className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">온보딩 중</p>
                <p className="text-2xl font-bold">
                  {customers.filter(c => c.care_status === 'onboarding').length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardHeader>
          <CardTitle>고객 목록</CardTitle>
          <CardDescription>등록된 모든 고객을 확인하고 관리할 수 있습니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            {/* 기본 검색 바 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="고객명, 사업체명, 전화번호, 태그로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                고급 필터 {showAdvancedFilters ? '숨기기' : '표시'}
              </Button>
            </div>

            {/* 고급 필터 (토글) */}
            {showAdvancedFilters && (
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
                {/* 상태 필터 */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">상태</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="active">활성</SelectItem>
                      <SelectItem value="inactive">비활성</SelectItem>
                      <SelectItem value="suspended">일시정지</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 등급 필터 */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">등급</Label>
                  <Select value={gradeFilter} onValueChange={setGradeFilter}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="A">A급</SelectItem>
                      <SelectItem value="B">B급</SelectItem>
                      <SelectItem value="C">C급</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 태그 필터 */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">태그</Label>
                  <Select value={tagFilter} onValueChange={setTagFilter}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체 태그</SelectItem>
                      {allTags.map(tag => (
                        <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 중요도 필터 */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">중요도</Label>
                  <Select value={importanceFilter} onValueChange={setImportanceFilter}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="high">높음 (4-5)</SelectItem>
                      <SelectItem value="medium">보통 (3)</SelectItem>
                      <SelectItem value="low">낮음 (1-2)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 필터 리셋 */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">초기화</Label>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 w-full"
                    onClick={() => {
                      setStatusFilter('all')
                      setGradeFilter('all')
                      setTagFilter('all')
                      setImportanceFilter('all')
                      setSearchTerm('')
                    }}
                  >
                    필터 초기화
                  </Button>
                </div>
              </div>
            )}

            {/* 활성 필터 표시 */}
            <div className="flex flex-wrap gap-2">
              {statusFilter !== 'all' && (
                <Badge variant="outline" className="bg-blue-50">
                  상태: {statusFilter}
                  <button 
                    onClick={() => setStatusFilter('all')}
                    className="ml-1 hover:bg-red-100 rounded"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {gradeFilter !== 'all' && (
                <Badge variant="outline" className="bg-yellow-50">
                  등급: {gradeFilter}
                  <button onClick={() => setGradeFilter('all')} className="ml-1">×</button>
                </Badge>
              )}
              {tagFilter !== 'all' && (
                <Badge variant="outline" className="bg-green-50">
                  태그: {tagFilter}
                  <button onClick={() => setTagFilter('all')} className="ml-1">×</button>
                </Badge>
              )}
              {importanceFilter !== 'all' && (
                <Badge variant="outline" className="bg-purple-50">
                  중요도: {importanceFilter}
                  <button onClick={() => setImportanceFilter('all')} className="ml-1">×</button>
                </Badge>
              )}
            </div>
          </div>

          {/* 고객 테이블 */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">고객 정보를 불러오는 중...</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                        onChange={(e) => handleSelectAllCustomers(e.target.checked)}
                        className="rounded"
                      />
                    </TableHead>
                    <TableHead>고객/가맹점 코드</TableHead>
                    <TableHead>사업체명</TableHead>
                    <TableHead>대표자</TableHead>
                    <TableHead>연락처</TableHead>
                    <TableHead>사업자정보</TableHead>
                    <TableHead>등급/태그</TableHead>
                    <TableHead>서비스</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>등록일</TableHead>
                    <TableHead className="w-[100px]">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.customer_id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedCustomers.includes(customer.customer_id)}
                          onChange={(e) => handleSelectCustomer(customer.customer_id, e.target.checked)}
                          className="rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-600">{customer.customer_code}</span>
                          </div>
                          {/* 가맹점 코드 인라인 편집 */}
                          {isEditing(customer.customer_id, 'franchise_code') ? (
                            <Input
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              onKeyDown={(e) => handleKeyPress(e, customer.customer_id, 'franchise_code')}
                              onBlur={() => saveFieldEdit(customer.customer_id, 'franchise_code', editingValue)}
                              className="text-sm h-6 w-24"
                              placeholder="FC000001"
                              autoFocus
                            />
                          ) : (
                            <div 
                              className="text-sm text-gray-600 cursor-pointer hover:bg-gray-100 px-1 rounded"
                              onClick={() => startEditing(customer.customer_id, 'franchise_code', customer.franchise_code || '')}
                              title="클릭하여 가맹점 코드 수정"
                            >
                              {customer.franchise_code || '가맹점코드 추가'}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          {/* 사업체명 인라인 편집 */}
                          {isEditing(customer.customer_id, 'business_name') ? (
                            <Input
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              onKeyDown={(e) => handleKeyPress(e, customer.customer_id, 'business_name')}
                              onBlur={() => saveFieldEdit(customer.customer_id, 'business_name', editingValue)}
                              className="font-medium h-8"
                              autoFocus
                            />
                          ) : (
                            <div 
                              className="font-medium cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                              onClick={() => startEditing(customer.customer_id, 'business_name', customer.business_name)}
                              title="클릭하여 수정"
                            >
                              {customer.business_name}
                            </div>
                          )}
                          
                          {/* 업종 인라인 편집 */}
                          {isEditing(customer.customer_id, 'industry') ? (
                            <Input
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              onKeyDown={(e) => handleKeyPress(e, customer.customer_id, 'industry')}
                              onBlur={() => saveFieldEdit(customer.customer_id, 'industry', editingValue)}
                              className="text-sm mt-1 h-6"
                              placeholder="업종 입력"
                              autoFocus
                            />
                          ) : (
                            <div 
                              className="text-sm text-gray-500 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded mt-1"
                              onClick={() => startEditing(customer.customer_id, 'industry', customer.industry || '')}
                              title="클릭하여 수정"
                            >
                              {customer.industry || '업종 추가'}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      {/* 대표자명 + 성별/나이 */}
                      <TableCell>
                        <div className="space-y-1">
                          {/* 대표자명 인라인 편집 */}
                          {isEditing(customer.customer_id, 'owner_name') ? (
                            <Input
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              onKeyDown={(e) => handleKeyPress(e, customer.customer_id, 'owner_name')}
                              onBlur={() => saveFieldEdit(customer.customer_id, 'owner_name', editingValue)}
                              className="h-8"
                              autoFocus
                            />
                          ) : (
                            <div 
                              className="font-medium cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                              onClick={() => startEditing(customer.customer_id, 'owner_name', customer.owner_name)}
                              title="클릭하여 수정"
                            >
                              {customer.owner_name}
                            </div>
                          )}
                          
                          {/* 성별/나이 */}
                          <div className="flex items-center space-x-2 text-sm">
                            {/* 성별 선택 */}
                            <Select 
                              value={customer.gender || 'unknown'} 
                              onValueChange={(value) => saveFieldEdit(customer.customer_id, 'gender', value)}
                            >
                              <SelectTrigger className="w-16 h-6 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">남</SelectItem>
                                <SelectItem value="female">여</SelectItem>
                                <SelectItem value="unknown">미지정</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            {/* 나이 표시 및 생년월일 편집 */}
                            {isEditing(customer.customer_id, 'birth_date') ? (
                              <Input
                                type="date"
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                onKeyDown={(e) => handleKeyPress(e, customer.customer_id, 'birth_date')}
                                onBlur={() => saveFieldEdit(customer.customer_id, 'birth_date', editingValue)}
                                className="h-6 w-32 text-xs"
                                autoFocus
                              />
                            ) : (
                              <span 
                                className="cursor-pointer hover:bg-gray-100 px-1 rounded text-xs text-gray-600"
                                onClick={() => startEditing(customer.customer_id, 'birth_date', customer.birth_date || '')}
                                title="클릭하여 생년월일 수정"
                              >
                                {customer.age ? `${customer.age}세` : '나이 추가'}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {/* 전화번호 인라인 편집 */}
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1" />
                            {isEditing(customer.customer_id, 'phone') ? (
                              <Input
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                onKeyDown={(e) => handleKeyPress(e, customer.customer_id, 'phone')}
                                onBlur={() => saveFieldEdit(customer.customer_id, 'phone', editingValue)}
                                className="text-sm h-6 w-32"
                                placeholder="전화번호"
                                autoFocus
                              />
                            ) : (
                              <span 
                                className="cursor-pointer hover:bg-gray-100 px-1 rounded"
                                onClick={() => startEditing(customer.customer_id, 'phone', customer.phone || '')}
                                title="클릭하여 수정"
                              >
                                {customer.phone || '전화번호 추가'}
                              </span>
                            )}
                          </div>
                          
                          {/* 이메일 인라인 편집 */}
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1" />
                            {isEditing(customer.customer_id, 'email') ? (
                              <Input
                                type="email"
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                onKeyDown={(e) => handleKeyPress(e, customer.customer_id, 'email')}
                                onBlur={() => saveFieldEdit(customer.customer_id, 'email', editingValue)}
                                className="text-sm h-6 w-40"
                                placeholder="이메일"
                                autoFocus
                              />
                            ) : (
                              <span 
                                className="cursor-pointer hover:bg-gray-100 px-1 rounded"
                                onClick={() => startEditing(customer.customer_id, 'email', customer.email || '')}
                                title="클릭하여 수정"
                              >
                                {customer.email || '이메일 추가'}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      
                      {/* 사업자 정보 */}
                      <TableCell>
                        <div className="space-y-1">
                          {/* 사업자등록번호 */}
                          <div className="text-sm">
                            {isEditing(customer.customer_id, 'business_registration') ? (
                              <Input
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                onKeyDown={(e) => handleKeyPress(e, customer.customer_id, 'business_registration')}
                                onBlur={() => saveFieldEdit(customer.customer_id, 'business_registration', editingValue)}
                                className="h-6 w-32 text-xs"
                                placeholder="000-00-00000"
                                autoFocus
                              />
                            ) : (
                              <div 
                                className="cursor-pointer hover:bg-gray-100 px-1 rounded text-xs"
                                onClick={() => startEditing(customer.customer_id, 'business_registration', customer.business_registration || '')}
                                title="클릭하여 사업자번호 수정"
                              >
                                {customer.business_registration || '사업자번호 추가'}
                              </div>
                            )}
                          </div>
                          
                          {/* 사업자등록일 */}
                          <div className="text-sm">
                            {isEditing(customer.customer_id, 'business_registration_date') ? (
                              <Input
                                type="date"
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                onKeyDown={(e) => handleKeyPress(e, customer.customer_id, 'business_registration_date')}
                                onBlur={() => saveFieldEdit(customer.customer_id, 'business_registration_date', editingValue)}
                                className="h-6 w-32 text-xs"
                                autoFocus
                              />
                            ) : (
                              <div 
                                className="cursor-pointer hover:bg-gray-100 px-1 rounded text-xs text-gray-500"
                                onClick={() => startEditing(customer.customer_id, 'business_registration_date', customer.business_registration_date || '')}
                                title="클릭하여 등록일 수정"
                              >
                                {customer.business_registration_date ? 
                                  new Date(customer.business_registration_date).toLocaleDateString() : 
                                  '등록일 추가'
                                }
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      
                      {/* 등급/태그 관리 */}
                      <TableCell>
                        <div className="space-y-2">
                          {/* 등급 선택 */}
                          <div className="flex items-center space-x-2">
                            {getGradeBadge(customer.grade)}
                            <Select 
                              value={customer.grade || 'B'} 
                              onValueChange={(value) => handleGradeChange(customer.customer_id, value)}
                            >
                              <SelectTrigger className="w-20 h-6 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="A">A급</SelectItem>
                                <SelectItem value="B">B급</SelectItem>
                                <SelectItem value="C">C급</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {/* 태그 표시 및 관리 */}
                          <div className="flex flex-wrap">
                            {customer.tags?.map((tag, index) => (
                              <Badge 
                                key={`${customer.customer_id}-${tag}-${index}`}
                                variant="secondary" 
                                className="mr-1 mb-1 cursor-pointer hover:bg-red-100"
                                onClick={() => handleRemoveTag(customer.customer_id, tag)}
                                title="클릭하여 제거"
                              >
                                {tag} ×
                              </Badge>
                            ))}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-xs"
                              onClick={() => {
                                setCurrentCustomer(customer)
                                setIsTagModalOpen(true)
                              }}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                      
                      {/* 이용중 서비스 정보 */}
                      <TableCell>
                        <div className="space-y-1">
                          {customer.current_services ? (
                            <div className="space-y-1">
                              {customer.current_services.internet?.active && (
                                <Badge key={`${customer.customer_id}-internet`} variant="outline" className="text-xs">
                                  📶 {customer.current_services.internet.plan || '인터넷'}
                                </Badge>
                              )}
                              {customer.current_services.cctv?.active && (
                                <Badge key={`${customer.customer_id}-cctv`} variant="outline" className="text-xs">
                                  📹 CCTV {customer.current_services.cctv.count || 0}대
                                </Badge>
                              )}
                              {customer.current_services.pos?.active && (
                                <Badge key={`${customer.customer_id}-pos`} variant="outline" className="text-xs">
                                  💳 POS
                                </Badge>
                              )}
                              {customer.current_services.insurance?.active && (
                                <Badge key={`${customer.customer_id}-insurance`} variant="outline" className="text-xs">
                                  🛡️ 보험
                                </Badge>
                              )}
                              {customer.current_services.phone?.active && (
                                <Badge key={`${customer.customer_id}-phone`} variant="outline" className="text-xs">
                                  ☎️ 전화
                                </Badge>
                              )}
                              {!Object.values(customer.current_services).some((service: any) => service?.active) && (
                                <span className="text-xs text-gray-400">서비스 없음</span>
                              )}
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 text-xs"
                              onClick={() => openServiceModal(customer)}
                            >
                              + 서비스 설정
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          {getStatusBadge(customer.status)}
                          {getCareStatusBadge(customer.care_status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {customer.contracts?.[0]?.count || 0}건
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(customer.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Link href={`/admin/customers/${customer.customer_id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedCustomer(customer)
                              setIsDetailOpen(true)
                            }}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 고객 상세 정보 모달 */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>고객 상세 정보</DialogTitle>
            <DialogDescription>
              {selectedCustomer?.customer_code} - {selectedCustomer?.business_name}
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">고객코드</Label>
                  <p className="text-sm">{selectedCustomer.customer_code}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">상태</Label>
                  <div className="flex space-x-2">
                    {getStatusBadge(selectedCustomer.status)}
                    {getCareStatusBadge(selectedCustomer.care_status)}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">사업체명</Label>
                  <p className="text-sm">{selectedCustomer.business_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">대표자명</Label>
                  <p className="text-sm">{selectedCustomer.owner_name}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">전화번호</Label>
                  <p className="text-sm">{selectedCustomer.phone || '-'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">이메일</Label>
                  <p className="text-sm">{selectedCustomer.email || '-'}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">주소</Label>
                <p className="text-sm">{selectedCustomer.address || '-'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">사업자등록번호</Label>
                  <p className="text-sm">{selectedCustomer.business_registration || '-'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">업종</Label>
                  <p className="text-sm">{selectedCustomer.industry || '-'}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">등록일</Label>
                <p className="text-sm">
                  {new Date(selectedCustomer.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              닫기
            </Button>
            <Button>수정</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 태그 관리 모달 */}
      <Dialog open={isTagModalOpen} onOpenChange={setIsTagModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>고객 태그 관리</DialogTitle>
            <DialogDescription>
              {currentCustomer?.business_name}의 태그를 관리합니다
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* 기존 태그들 */}
            <div className="space-y-2">
              <Label>현재 태그</Label>
              <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border rounded-lg">
                {currentCustomer?.tags?.length ? (
                  currentCustomer.tags.map(tag => (
                    <Badge 
                      key={tag}
                      variant="secondary" 
                      className="cursor-pointer hover:bg-red-100"
                      onClick={() => currentCustomer && handleRemoveTag(currentCustomer.customer_id, tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">태그가 없습니다</span>
                )}
              </div>
            </div>
            
            {/* 새 태그 추가 */}
            <div className="space-y-2">
              <Label>새 태그 추가</Label>
              <div className="flex space-x-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="태그 입력 (예: VIP, 신규고객, 위험군)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newTag.trim() && currentCustomer) {
                      handleAddTag(currentCustomer.customer_id, newTag.trim())
                    }
                  }}
                />
                <Button 
                  size="sm"
                  onClick={() => {
                    if (newTag.trim() && currentCustomer) {
                      handleAddTag(currentCustomer.customer_id, newTag.trim())
                    }
                  }}
                  disabled={!newTag.trim()}
                >
                  추가
                </Button>
              </div>
            </div>

            {/* 추천 태그들 */}
            <div className="space-y-2">
              <Label>추천 태그</Label>
              <div className="flex flex-wrap gap-2">
                {['VIP', '신규고객', '재계약대상', '위험군', '만족고객', '불만족고객', '프리미엄'].map(tag => (
                  <Badge 
                    key={tag}
                    variant="outline" 
                    className="cursor-pointer hover:bg-blue-100"
                    onClick={() => {
                      if (currentCustomer && !currentCustomer.tags?.includes(tag)) {
                        handleAddTag(currentCustomer.customer_id, tag)
                      }
                    }}
                  >
                    + {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTagModalOpen(false)}>
              완료
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 서비스 설정 모달 */}
      <Dialog open={isServiceModalOpen} onOpenChange={setIsServiceModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>서비스 설정</DialogTitle>
            <DialogDescription>
              {serviceCustomer?.business_name}의 이용중인 서비스를 설정합니다
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* 인터넷 서비스 */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium flex items-center">
                  📶 인터넷 서비스
                </h4>
                <Switch
                  checked={serviceForm.internet.active}
                  onCheckedChange={(checked) => setServiceForm({
                    ...serviceForm,
                    internet: { ...serviceForm.internet, active: checked }
                  })}
                />
              </div>
              {serviceForm.internet.active && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">요금제</Label>
                    <Input
                      value={serviceForm.internet.plan}
                      onChange={(e) => setServiceForm({
                        ...serviceForm,
                        internet: { ...serviceForm.internet, plan: e.target.value }
                      })}
                      placeholder="예: KT 기가인터넷 1GB"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">월 요금 (원)</Label>
                    <Input
                      type="number"
                      value={serviceForm.internet.monthly_fee}
                      onChange={(e) => setServiceForm({
                        ...serviceForm,
                        internet: { ...serviceForm.internet, monthly_fee: parseInt(e.target.value) || 0 }
                      })}
                      placeholder="45000"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* CCTV 서비스 */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium flex items-center">
                  📹 CCTV 서비스
                </h4>
                <Switch
                  checked={serviceForm.cctv.active}
                  onCheckedChange={(checked) => setServiceForm({
                    ...serviceForm,
                    cctv: { ...serviceForm.cctv, active: checked }
                  })}
                />
              </div>
              {serviceForm.cctv.active && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">설치 대수</Label>
                    <Input
                      type="number"
                      value={serviceForm.cctv.count}
                      onChange={(e) => setServiceForm({
                        ...serviceForm,
                        cctv: { ...serviceForm.cctv, count: parseInt(e.target.value) || 0 }
                      })}
                      placeholder="6"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">월 요금 (원)</Label>
                    <Input
                      type="number"
                      value={serviceForm.cctv.monthly_fee}
                      onChange={(e) => setServiceForm({
                        ...serviceForm,
                        cctv: { ...serviceForm.cctv, monthly_fee: parseInt(e.target.value) || 0 }
                      })}
                      placeholder="200000"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* POS 서비스 */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium flex items-center">
                  💳 POS 서비스
                </h4>
                <Switch
                  checked={serviceForm.pos.active}
                  onCheckedChange={(checked) => setServiceForm({
                    ...serviceForm,
                    pos: { ...serviceForm.pos, active: checked }
                  })}
                />
              </div>
              {serviceForm.pos.active && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">POS 종류</Label>
                    <Input
                      value={serviceForm.pos.type}
                      onChange={(e) => setServiceForm({
                        ...serviceForm,
                        pos: { ...serviceForm.pos, type: e.target.value }
                      })}
                      placeholder="예: 토스 POS"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">월 요금 (원)</Label>
                    <Input
                      type="number"
                      value={serviceForm.pos.monthly_fee}
                      onChange={(e) => setServiceForm({
                        ...serviceForm,
                        pos: { ...serviceForm.pos, monthly_fee: parseInt(e.target.value) || 0 }
                      })}
                      placeholder="0"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 보험 서비스 */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium flex items-center">
                  🛡️ 보험 서비스
                </h4>
                <Switch
                  checked={serviceForm.insurance.active}
                  onCheckedChange={(checked) => setServiceForm({
                    ...serviceForm,
                    insurance: { ...serviceForm.insurance, active: checked }
                  })}
                />
              </div>
              {serviceForm.insurance.active && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">보험 종류</Label>
                    <Input
                      value={serviceForm.insurance.type}
                      onChange={(e) => setServiceForm({
                        ...serviceForm,
                        insurance: { ...serviceForm.insurance, type: e.target.value }
                      })}
                      placeholder="예: 한화 안심커버1000"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">월 요금 (원)</Label>
                    <Input
                      type="number"
                      value={serviceForm.insurance.monthly_fee}
                      onChange={(e) => setServiceForm({
                        ...serviceForm,
                        insurance: { ...serviceForm.insurance, monthly_fee: parseInt(e.target.value) || 0 }
                      })}
                      placeholder="35000"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 전화 서비스 */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium flex items-center">
                  ☎️ 전화 서비스
                </h4>
                <Switch
                  checked={serviceForm.phone.active}
                  onCheckedChange={(checked) => setServiceForm({
                    ...serviceForm,
                    phone: { ...serviceForm.phone, active: checked }
                  })}
                />
              </div>
              {serviceForm.phone.active && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">전화 종류</Label>
                    <Input
                      value={serviceForm.phone.type}
                      onChange={(e) => setServiceForm({
                        ...serviceForm,
                        phone: { ...serviceForm.phone, type: e.target.value }
                      })}
                      placeholder="예: 매장 인터넷전화"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">월 요금 (원)</Label>
                    <Input
                      type="number"
                      value={serviceForm.phone.monthly_fee}
                      onChange={(e) => setServiceForm({
                        ...serviceForm,
                        phone: { ...serviceForm.phone, monthly_fee: parseInt(e.target.value) || 0 }
                      })}
                      placeholder="15000"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 총 월 이용료 */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">총 월 이용료:</span>
                <span className="text-xl font-bold text-blue-600">
                  {(
                    (serviceForm.internet.active ? serviceForm.internet.monthly_fee : 0) +
                    (serviceForm.cctv.active ? serviceForm.cctv.monthly_fee : 0) +
                    (serviceForm.pos.active ? serviceForm.pos.monthly_fee : 0) +
                    (serviceForm.insurance.active ? serviceForm.insurance.monthly_fee : 0) +
                    (serviceForm.phone.active ? serviceForm.phone.monthly_fee : 0)
                  ).toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsServiceModalOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSaveServices}>
              서비스 정보 저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
