"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useEnrollmentDetail } from "@/hooks/useEnrollmentData"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, AlertCircle, Check } from "lucide-react"

export default function EnrollmentEditPage() {
  const params = useParams()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [localData, setLocalData] = useState<any>(null)

  const {
    enrollment,
    loading,
    error,
    updateEnrollment
  } = useEnrollmentDetail({
    id: params.id as string,
    redirectOnError: false
  })

  // Initialize local data when enrollment loads
  useEffect(() => {
    if (enrollment && !localData) {
      setLocalData({ ...enrollment })
    }
  }, [enrollment, localData])

  const handleSubmit = async () => {
    if (!localData) return

    setSaving(true)

    const success = await updateEnrollment(localData)

    if (success) {
      alert("저장되었습니다.")
      router.push(`/admin/enrollments/${params.id}`)
    } else {
      alert("저장에 실패했습니다.")
    }

    setSaving(false)
  }

  const updateField = (field: string, value: any) => {
    setLocalData((prev: any) => ({
      ...prev,
      [field]: value
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !localData) {
    return (
      <div className="text-center py-8">
        <p>{error || "신청 정보를 찾을 수 없습니다."}</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/admin/enrollments/${localData.id}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            돌아가기
          </Button>
          <div>
            <h1 className="text-2xl font-bold">신청서 전체 편집</h1>
            <p className="text-gray-600">ID: {localData.id.slice(0, 8)}</p>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "저장 중..." : "저장"}
        </Button>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="basic">기본 정보</TabsTrigger>
          <TabsTrigger value="business">사업 정보</TabsTrigger>
          <TabsTrigger value="store">매장 정보</TabsTrigger>
          <TabsTrigger value="sales">매출 정보</TabsTrigger>
          <TabsTrigger value="settlement">정산 정보</TabsTrigger>
          <TabsTrigger value="cards">카드사</TabsTrigger>
          <TabsTrigger value="equipment">장비</TabsTrigger>
          <TabsTrigger value="documents">서류</TabsTrigger>
          <TabsTrigger value="agreements">동의</TabsTrigger>
          <TabsTrigger value="status">상태</TabsTrigger>
          <TabsTrigger value="system">시스템</TabsTrigger>
        </TabsList>

        {/* 기본 정보 */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
              <CardDescription>대표자 및 연락처 정보</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="representative_name">대표자명</Label>
                  <Input
                    id="representative_name"
                    value={localData.representative_name || ''}
                    onChange={(e) => updateField('representative_name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone_number">전화번호</Label>
                  <Input
                    id="phone_number"
                    value={localData.phone_number || ''}
                    onChange={(e) => updateField('phone_number', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    value={localData.email || ''}
                    onChange={(e) => updateField('email', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="mobile_carrier">통신사</Label>
                  <Select
                    value={localData.mobile_carrier || ''}
                    onValueChange={(value) => updateField('mobile_carrier', value)}
                  >
                    <SelectTrigger id="mobile_carrier">
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SKT">SKT</SelectItem>
                      <SelectItem value="KT">KT</SelectItem>
                      <SelectItem value="LGU+">LGU+</SelectItem>
                      <SelectItem value="알뜰폰">알뜰폰</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 사업 정보 */}
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>사업 정보</CardTitle>
              <CardDescription>사업자 정보</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="business_type">사업자 유형</Label>
                  <Select
                    value={localData.business_type || ''}
                    onValueChange={(value) => updateField('business_type', value)}
                  >
                    <SelectTrigger id="business_type">
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="개인사업자">개인사업자</SelectItem>
                      <SelectItem value="법인사업자">법인사업자</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="business_number">사업자번호</Label>
                  <Input
                    id="business_number"
                    value={localData.business_number || ''}
                    onChange={(e) => updateField('business_number', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="business_name">사업자명/상호</Label>
                  <Input
                    id="business_name"
                    value={localData.business_name || ''}
                    onChange={(e) => updateField('business_name', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="business_address">사업장 주소</Label>
                  <Input
                    id="business_address"
                    value={localData.business_address || ''}
                    onChange={(e) => updateField('business_address', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="business_address_detail">상세 주소</Label>
                  <Input
                    id="business_address_detail"
                    value={localData.business_address_detail || ''}
                    onChange={(e) => updateField('business_address_detail', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 매장 정보 */}
        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle>매장 정보</CardTitle>
              <CardDescription>매장 운영 정보</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="store_type">매장 유형</Label>
                  <Select
                    value={localData.store_type || ''}
                    onValueChange={(value) => updateField('store_type', value)}
                  >
                    <SelectTrigger id="store_type">
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="단독매장">단독매장</SelectItem>
                      <SelectItem value="복합매장">복합매장</SelectItem>
                      <SelectItem value="백화점">백화점</SelectItem>
                      <SelectItem value="아울렛">아울렛</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="store_area">매장 면적 (평)</Label>
                  <Input
                    id="store_area"
                    value={localData.store_area || ''}
                    onChange={(e) => updateField('store_area', e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="need_local_data"
                    checked={localData.need_local_data || false}
                    onCheckedChange={(checked) => updateField('need_local_data', checked)}
                  />
                  <Label htmlFor="need_local_data">상권 데이터 필요</Label>
                </div>
                <div>
                  <Label htmlFor="employee_count">직원 수</Label>
                  <Input
                    id="employee_count"
                    type="number"
                    value={localData.employee_count || ''}
                    onChange={(e) => updateField('employee_count', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="business_hours">영업 시간</Label>
                <Input
                  id="business_hours"
                  value={localData.business_hours || ''}
                  onChange={(e) => updateField('business_hours', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="business_category">업종 카테고리</Label>
                <Input
                  id="business_category"
                  value={localData.business_category || ''}
                  onChange={(e) => updateField('business_category', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="business_subcategory">세부 업종</Label>
                <Input
                  id="business_subcategory"
                  value={localData.business_subcategory || ''}
                  onChange={(e) => updateField('business_subcategory', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 매출 정보 */}
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>매출 정보</CardTitle>
              <CardDescription>예상 매출 정보</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monthly_sales">월 예상 매출</Label>
                  <Input
                    id="monthly_sales"
                    value={localData.monthly_sales || ''}
                    onChange={(e) => updateField('monthly_sales', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="card_sales_ratio">카드 결제 비율 (%)</Label>
                  <Input
                    id="card_sales_ratio"
                    type="number"
                    min="0"
                    max="100"
                    value={localData.card_sales_ratio || ''}
                    onChange={(e) => updateField('card_sales_ratio', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="main_product">주력 상품</Label>
                  <Input
                    id="main_product"
                    value={localData.main_product || ''}
                    onChange={(e) => updateField('main_product', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="unit_price">평균 단가</Label>
                  <Input
                    id="unit_price"
                    value={localData.unit_price || ''}
                    onChange={(e) => updateField('unit_price', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 정산 정보 */}
        <TabsContent value="settlement">
          <Card>
            <CardHeader>
              <CardTitle>정산 정보</CardTitle>
              <CardDescription>정산 계좌 정보</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="settlement_bank">은행명</Label>
                  <Input
                    id="settlement_bank"
                    value={localData.settlement_bank || ''}
                    onChange={(e) => updateField('settlement_bank', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="settlement_holder">예금주</Label>
                  <Input
                    id="settlement_holder"
                    value={localData.settlement_holder || ''}
                    onChange={(e) => updateField('settlement_holder', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="settlement_account">계좌번호</Label>
                  <Input
                    id="settlement_account"
                    value={localData.settlement_account || ''}
                    onChange={(e) => updateField('settlement_account', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 카드사 */}
        <TabsContent value="cards">
          <Card>
            <CardHeader>
              <CardTitle>카드사 가맹</CardTitle>
              <CardDescription>카드사별 가맹 신청 및 상태</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {/* KB카드 */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="kb_card"
                        checked={localData.kb_card || false}
                        onCheckedChange={(checked) => updateField('kb_card', checked)}
                      />
                      <Label htmlFor="kb_card" className="font-medium">KB국민카드</Label>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor="kb_card_status" className="text-sm">상태</Label>
                      <Select
                        value={localData.kb_card_status || ''}
                        onValueChange={(value) => updateField('kb_card_status', value)}
                      >
                        <SelectTrigger id="kb_card_status">
                          <SelectValue placeholder="선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">대기</SelectItem>
                          <SelectItem value="submitted">심사중</SelectItem>
                          <SelectItem value="approved">승인</SelectItem>
                          <SelectItem value="rejected">거절</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="kb_merchant_number" className="text-sm">가맹점 번호</Label>
                      <Input
                        id="kb_merchant_number"
                        value={localData.kb_merchant_number || ''}
                        onChange={(e) => updateField('kb_merchant_number', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* BC카드 */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="bc_card"
                        checked={localData.bc_card || false}
                        onCheckedChange={(checked) => updateField('bc_card', checked)}
                      />
                      <Label htmlFor="bc_card" className="font-medium">BC카드</Label>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor="bc_card_status" className="text-sm">상태</Label>
                      <Select
                        value={localData.bc_card_status || ''}
                        onValueChange={(value) => updateField('bc_card_status', value)}
                      >
                        <SelectTrigger id="bc_card_status">
                          <SelectValue placeholder="선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">대기</SelectItem>
                          <SelectItem value="submitted">심사중</SelectItem>
                          <SelectItem value="approved">승인</SelectItem>
                          <SelectItem value="rejected">거절</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="bc_merchant_number" className="text-sm">가맹점 번호</Label>
                      <Input
                        id="bc_merchant_number"
                        value={localData.bc_merchant_number || ''}
                        onChange={(e) => updateField('bc_merchant_number', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* 삼성카드 */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="samsung_card"
                        checked={localData.samsung_card || false}
                        onCheckedChange={(checked) => updateField('samsung_card', checked)}
                      />
                      <Label htmlFor="samsung_card" className="font-medium">삼성카드</Label>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor="samsung_card_status" className="text-sm">상태</Label>
                      <Select
                        value={localData.samsung_card_status || ''}
                        onValueChange={(value) => updateField('samsung_card_status', value)}
                      >
                        <SelectTrigger id="samsung_card_status">
                          <SelectValue placeholder="선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">대기</SelectItem>
                          <SelectItem value="submitted">심사중</SelectItem>
                          <SelectItem value="approved">승인</SelectItem>
                          <SelectItem value="rejected">거절</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="samsung_merchant_number" className="text-sm">가맹점 번호</Label>
                      <Input
                        id="samsung_merchant_number"
                        value={localData.samsung_merchant_number || ''}
                        onChange={(e) => updateField('samsung_merchant_number', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* 우리카드 */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="woori_card"
                        checked={localData.woori_card || false}
                        onCheckedChange={(checked) => updateField('woori_card', checked)}
                      />
                      <Label htmlFor="woori_card" className="font-medium">우리카드</Label>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor="woori_card_status" className="text-sm">상태</Label>
                      <Select
                        value={localData.woori_card_status || ''}
                        onValueChange={(value) => updateField('woori_card_status', value)}
                      >
                        <SelectTrigger id="woori_card_status">
                          <SelectValue placeholder="선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">대기</SelectItem>
                          <SelectItem value="submitted">심사중</SelectItem>
                          <SelectItem value="approved">승인</SelectItem>
                          <SelectItem value="rejected">거절</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="woori_merchant_number" className="text-sm">가맹점 번호</Label>
                      <Input
                        id="woori_merchant_number"
                        value={localData.woori_merchant_number || ''}
                        onChange={(e) => updateField('woori_merchant_number', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* 하나카드 */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hana_card"
                        checked={localData.hana_card || false}
                        onCheckedChange={(checked) => updateField('hana_card', checked)}
                      />
                      <Label htmlFor="hana_card" className="font-medium">하나카드</Label>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor="hana_card_status" className="text-sm">상태</Label>
                      <Select
                        value={localData.hana_card_status || ''}
                        onValueChange={(value) => updateField('hana_card_status', value)}
                      >
                        <SelectTrigger id="hana_card_status">
                          <SelectValue placeholder="선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">대기</SelectItem>
                          <SelectItem value="submitted">심사중</SelectItem>
                          <SelectItem value="approved">승인</SelectItem>
                          <SelectItem value="rejected">거절</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="hana_merchant_number" className="text-sm">가맹점 번호</Label>
                      <Input
                        id="hana_merchant_number"
                        value={localData.hana_merchant_number || ''}
                        onChange={(e) => updateField('hana_merchant_number', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 장비 */}
        <TabsContent value="equipment">
          <Card>
            <CardHeader>
              <CardTitle>장비 요구사항</CardTitle>
              <CardDescription>필요 장비 선택</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_pos"
                    checked={localData.has_pos || false}
                    onCheckedChange={(checked) => updateField('has_pos', checked)}
                  />
                  <Label htmlFor="has_pos">POS 시스템</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_kiosk"
                    checked={localData.has_kiosk || false}
                    onCheckedChange={(checked) => updateField('has_kiosk', checked)}
                  />
                  <Label htmlFor="has_kiosk">키오스크</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has_cctv"
                    checked={localData.has_cctv || false}
                    onCheckedChange={(checked) => updateField('has_cctv', checked)}
                  />
                  <Label htmlFor="has_cctv">CCTV</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 서류 */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>서류 URL</CardTitle>
              <CardDescription>업로드된 서류 URL 관리</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="business_registration_url">사업자등록증</Label>
                  <Input
                    id="business_registration_url"
                    value={localData.business_registration_url || ''}
                    onChange={(e) => updateField('business_registration_url', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="id_card_front_url">신분증 앞면</Label>
                  <Input
                    id="id_card_front_url"
                    value={localData.id_card_front_url || ''}
                    onChange={(e) => updateField('id_card_front_url', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="id_card_back_url">신분증 뒷면</Label>
                  <Input
                    id="id_card_back_url"
                    value={localData.id_card_back_url || ''}
                    onChange={(e) => updateField('id_card_back_url', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="bankbook_url">통장 사본</Label>
                  <Input
                    id="bankbook_url"
                    value={localData.bankbook_url || ''}
                    onChange={(e) => updateField('bankbook_url', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="business_license_url">영업신고증</Label>
                  <Input
                    id="business_license_url"
                    value={localData.business_license_url || ''}
                    onChange={(e) => updateField('business_license_url', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="sign_photo_url">간판 사진</Label>
                  <Input
                    id="sign_photo_url"
                    value={localData.sign_photo_url || ''}
                    onChange={(e) => updateField('sign_photo_url', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="interior_url">내부 사진</Label>
                  <Input
                    id="interior_url"
                    value={localData.interior_url || ''}
                    onChange={(e) => updateField('interior_url', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="product_url">상품 사진</Label>
                  <Input
                    id="product_url"
                    value={localData.product_url || ''}
                    onChange={(e) => updateField('product_url', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 동의 */}
        <TabsContent value="agreements">
          <Card>
            <CardHeader>
              <CardTitle>동의 현황</CardTitle>
              <CardDescription>약관 동의 상태</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agree_terms"
                    checked={localData.agree_terms || false}
                    onCheckedChange={(checked) => updateField('agree_terms', checked)}
                  />
                  <Label htmlFor="agree_terms">이용약관 동의</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agree_privacy"
                    checked={localData.agree_privacy || false}
                    onCheckedChange={(checked) => updateField('agree_privacy', checked)}
                  />
                  <Label htmlFor="agree_privacy">개인정보처리방침 동의</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agree_marketing"
                    checked={localData.agree_marketing || false}
                    onCheckedChange={(checked) => updateField('agree_marketing', checked)}
                  />
                  <Label htmlFor="agree_marketing">마케팅 정보 수신 동의</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="agree_tosspay"
                    checked={localData.agree_tosspay || false}
                    onCheckedChange={(checked) => updateField('agree_tosspay', checked)}
                  />
                  <Label htmlFor="agree_tosspay">토스페이 약관 동의</Label>
                </div>
              </div>
              <div>
                <Label htmlFor="agreed_card_companies">동의한 카드사 목록</Label>
                <Input
                  id="agreed_card_companies"
                  value={localData.agreed_card_companies || ''}
                  onChange={(e) => updateField('agreed_card_companies', e.target.value)}
                  placeholder="KB, BC, 삼성, 우리, 하나"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 상태 */}
        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>신청 상태</CardTitle>
              <CardDescription>처리 상태 및 메모</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">상태</Label>
                <Select
                  value={localData.status || ''}
                  onValueChange={(value) => updateField('status', value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">작성중</SelectItem>
                    <SelectItem value="submitted">제출됨</SelectItem>
                    <SelectItem value="reviewing">검토중</SelectItem>
                    <SelectItem value="approved">승인</SelectItem>
                    <SelectItem value="rejected">반려</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="reviewer_notes">검토자 메모</Label>
                <Textarea
                  id="reviewer_notes"
                  value={localData.reviewer_notes || ''}
                  onChange={(e) => updateField('reviewer_notes', e.target.value)}
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="additional_requests">추가 요청사항</Label>
                <Textarea
                  id="additional_requests"
                  value={localData.additional_requests || ''}
                  onChange={(e) => updateField('additional_requests', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 시스템 */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>시스템 정보</CardTitle>
              <CardDescription>자동 생성 필드 (읽기 전용)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>ID</Label>
                  <p className="text-sm text-gray-600">{localData.id}</p>
                </div>
                <div>
                  <Label>생성일시</Label>
                  <p className="text-sm text-gray-600">
                    {localData.created_at ? new Date(localData.created_at).toLocaleString() : '-'}
                  </p>
                </div>
                <div>
                  <Label>수정일시</Label>
                  <p className="text-sm text-gray-600">
                    {localData.updated_at ? new Date(localData.updated_at).toLocaleString() : '-'}
                  </p>
                </div>
                <div>
                  <Label>제출일시</Label>
                  <p className="text-sm text-gray-600">
                    {localData.submitted_at ? new Date(localData.submitted_at).toLocaleString() : '-'}
                  </p>
                </div>
                <div>
                  <Label>검토일시</Label>
                  <p className="text-sm text-gray-600">
                    {localData.reviewed_at ? new Date(localData.reviewed_at).toLocaleString() : '-'}
                  </p>
                </div>
                <div>
                  <Label>IP 주소</Label>
                  <p className="text-sm text-gray-600">{localData.ip_address || '-'}</p>
                </div>
                <div className="col-span-2">
                  <Label>User Agent</Label>
                  <p className="text-sm text-gray-600 break-all">{localData.user_agent || '-'}</p>
                </div>
                <div className="col-span-2">
                  <Label>온보딩 상태</Label>
                  <pre className="text-xs bg-gray-100 p-2 rounded">
                    {localData.onboarding_status ? JSON.stringify(localData.onboarding_status, null, 2) : '-'}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}