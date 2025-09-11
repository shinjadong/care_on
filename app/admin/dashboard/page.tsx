'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { 
  Users, 
  FileText, 
  Package, 
  Ticket, 
  DollarSign, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar
} from 'lucide-react'

interface DashboardStats {
  customers: {
    total: number
    active: number
    new_this_month: number
  }
  contracts: {
    total: number
    pending: number
    active: number
    completed: number
  }
  cs_tickets: {
    total: number
    open: number
    urgent: number
    resolved_today: number
  }
  billing: {
    total_monthly: number
    pending_invoices: number
    overdue_count: number
    upcoming_remittances: number
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      // 실제 API에서 통계 데이터 가져오기
      const response = await fetch('/api/dashboard/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      } else {
        // API 실패 시 기본값 사용
        setStats({
          customers: {
            total: 1,
            active: 1,
            new_this_month: 1
          },
          contracts: {
            total: 1,
            pending: 1,
            active: 0,
            completed: 0
          },
          cs_tickets: {
            total: 0,
            open: 0,
            urgent: 0,
            resolved_today: 0
          },
          billing: {
            total_monthly: 0,
            pending_invoices: 0,
            overdue_count: 0,
            upcoming_remittances: 0
          }
        })
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">대시보드 로딩 중...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
          <p className="text-gray-600">CareOn 시스템 전체 현황을 한눈에 확인하세요</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            보고서 생성
          </Button>
          <Button size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            분석 보기
          </Button>
        </div>
      </div>

      {/* 주요 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 고객</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.customers.total}</div>
            <p className="text-xs text-muted-foreground">
              활성 고객: {stats?.customers.active}명
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                +{stats?.customers.new_this_month} 이번 달
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">계약 현황</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.contracts.total}</div>
            <p className="text-xs text-muted-foreground">
              활성: {stats?.contracts.active} | 대기: {stats?.contracts.pending}
            </p>
            <div className="flex items-center space-x-2 mt-2">
              {stats?.contracts.pending ? (
                <Badge variant="destructive" className="text-xs">
                  {stats.contracts.pending}건 승인 대기
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  승인 대기 없음
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CS 티켓</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.cs_tickets.open}</div>
            <p className="text-xs text-muted-foreground">
              전체: {stats?.cs_tickets.total} | 오늘 처리: {stats?.cs_tickets.resolved_today}
            </p>
            <div className="flex items-center space-x-2 mt-2">
              {stats?.cs_tickets.urgent ? (
                <Badge variant="destructive" className="text-xs">
                  긴급 {stats.cs_tickets.urgent}건
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  긴급 티켓 없음
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">청구/정산</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.billing.total_monthly.toLocaleString()}원
            </div>
            <p className="text-xs text-muted-foreground">월 총 청구액</p>
            <div className="flex items-center space-x-2 mt-2">
              {stats?.billing.overdue_count ? (
                <Badge variant="destructive" className="text-xs">
                  연체 {stats.billing.overdue_count}건
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  연체 없음
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 상세 정보 탭 */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">전체 현황</TabsTrigger>
          <TabsTrigger value="customers">고객 관리</TabsTrigger>
          <TabsTrigger value="contracts">계약 관리</TabsTrigger>
          <TabsTrigger value="cs">CS 관리</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 최근 활동 */}
            <Card>
              <CardHeader>
                <CardTitle>최근 활동</CardTitle>
                <CardDescription>오늘의 주요 활동 내역</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">신규 계약 3건 승인 완료</p>
                    <p className="text-xs text-gray-500">오전 10:30</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">긴급 CS 티켓 1건 발생</p>
                    <p className="text-xs text-gray-500">오후 2:15</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">월간 정산 준비 중</p>
                    <p className="text-xs text-gray-500">오후 3:00</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 빠른 액션 */}
            <Card>
              <CardHeader>
                <CardTitle>빠른 액션</CardTitle>
                <CardDescription>자주 사용하는 기능들</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/admin/customers" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    고객 관리
                  </Button>
                </Link>
                <Link href="/admin/contracts" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    계약 관리
                  </Button>
                </Link>
                <Link href="/admin/products" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="h-4 w-4 mr-2" />
                    상품 관리
                  </Button>
                </Link>
                <Link href="/admin/cs-tickets" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Ticket className="h-4 w-4 mr-2" />
                    CS 티켓 관리
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>고객 관리 요약</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">고객 관리 페이지로 이동하여 상세 정보를 확인하세요</p>
                <Link href="/admin/customers">
                  <Button>고객 관리 페이지로 이동</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts">
          <Card>
            <CardHeader>
              <CardTitle>계약 관리 요약</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">계약 관리 페이지로 이동하여 상세 정보를 확인하세요</p>
                <Link href="/admin/contracts">
                  <Button>계약 관리 페이지로 이동</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cs">
          <Card>
            <CardHeader>
              <CardTitle>CS 관리 요약</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Ticket className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">CS 티켓 관리 페이지로 이동하여 상세 정보를 확인하세요</p>
                <Link href="/admin/cs-tickets">
                  <Button>CS 관리 페이지로 이동</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}