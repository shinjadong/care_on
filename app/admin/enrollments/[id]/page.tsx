"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import CardCompanyStatus from "@/components/admin/card-company-status"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  ArrowLeft,
  Check,
  X,
  Download,
  Phone,
  Mail,
  Building,
  User,
  FileText,
  CreditCard,
  Banknote,
  Calendar,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Clock,
  ListChecks,
  Edit
} from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import Link from "next/link"

interface EnrollmentDetail {
  id: string
  created_at: string
  updated_at: string

  // Agreement
  agree_terms: boolean | null
  agree_privacy: boolean | null
  agree_marketing: boolean | null
  agree_tosspay: boolean | null
  agreed_card_companies: string | null

  // Business info
  business_type: '개인사업자' | '법인사업자' | null
  representative_name: string | null
  phone_number: string | null
  birth_date: string | null
  gender: 'male' | 'female' | null

  business_name: string | null
  business_number: string | null
  business_address: string | null
  business_detail_address: string | null

  // Store info
  store_area: string | null
  need_local_data: boolean | null

  // Category
  business_category: string | null
  business_subcategory: string | null
  business_keywords: string[] | null

  // Sales info
  monthly_sales: string | null
  card_sales_ratio: number | null
  main_product: string | null
  unit_price: string | null

  // Settlement
  bank_name: string | null
  account_holder: string | null
  account_number: string | null

  // Documents
  business_registration_url: string | null
  id_card_front_url: string | null
  id_card_back_url: string | null
  bankbook_url: string | null
  business_license_url: string | null
  sign_photo_url: string | null
  door_closed_url: string | null
  door_open_url: string | null
  interior_url: string | null
  product_url: string | null
  business_card_url: string | null

  // Corporate documents
  corporate_registration_url: string | null
  shareholder_list_url: string | null
  seal_certificate_url: string | null
  seal_usage_url: string | null

  // Status
  status: 'draft' | 'submitted' | 'reviewing' | 'approved' | 'rejected' | null
  submitted_at: string | null
  reviewed_at: string | null
  reviewer_notes: string | null

  // Card companies
  kb_card: boolean | null
  bc_card: boolean | null
  samsung_card: boolean | null
  woori_card: boolean | null
  hana_card: boolean | null

  // Card company status
  kb_card_status?: string | null
  bc_card_status?: string | null
  samsung_card_status?: string | null
  woori_card_status?: string | null
  hana_card_status?: string | null

  // Card merchant numbers
  kb_merchant_number?: string | null
  bc_merchant_number?: string | null
  samsung_merchant_number?: string | null
  woori_merchant_number?: string | null
  hana_merchant_number?: string | null
}

export default function EnrollmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [enrollment, setEnrollment] = useState<EnrollmentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [reviewNotes, setReviewNotes] = useState("")
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchEnrollmentDetail()
  }, [params.id])

  const fetchEnrollmentDetail = async () => {
    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from('enrollment_applications')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error

      setEnrollment(data)
      setReviewNotes(data.reviewer_notes || "")
    } catch (error) {
      console.error('Error fetching enrollment:', error)
      alert('신청 정보를 불러올 수 없습니다.')
      router.push('/admin/enrollments')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (newStatus: 'reviewing' | 'approved' | 'rejected') => {
    if (!enrollment) return

    setUpdating(true)
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from('enrollment_applications')
        .update({
          status: newStatus,
          reviewed_at: new Date().toISOString(),
          reviewer_notes: reviewNotes
        })
        .eq('id', enrollment.id)

      if (error) throw error

      alert(`신청이 ${
        newStatus === 'approved' ? '승인' :
        newStatus === 'rejected' ? '반려' : '검토 중으로 변경'
      }되었습니다.`)

      fetchEnrollmentDetail()
    } catch (error) {
      console.error('Error updating status:', error)
      alert('상태 업데이트에 실패했습니다.')
    } finally {
      setUpdating(false)
    }
  }

  const getStatusBadge = (status: string | null) => {
    const statusConfig = {
      draft: { label: '작성중', variant: 'outline' as const, icon: Clock },
      submitted: { label: '제출됨', variant: 'secondary' as const, icon: FileText },
      reviewing: { label: '검토중', variant: 'default' as const, icon: AlertCircle },
      approved: { label: '승인됨', variant: 'success' as const, icon: CheckCircle },
      rejected: { label: '반려됨', variant: 'destructive' as const, icon: X }
    }

    const config = statusConfig[status as keyof typeof statusConfig] ||
                  { label: '알 수 없음', variant: 'outline' as const, icon: AlertCircle }

    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!enrollment) {
    return <div>신청 정보를 찾을 수 없습니다.</div>
  }

  const documentSections = [
    {
      title: "기본 서류",
      documents: [
        { name: "사업자등록증", url: enrollment.business_registration_url, required: true },
        { name: "신분증 앞면", url: enrollment.id_card_front_url, required: true },
        { name: "신분증 뒷면", url: enrollment.id_card_back_url, required: true },
        { name: "통장 사본", url: enrollment.bankbook_url, required: true },
        { name: "영업신고증", url: enrollment.business_license_url, required: false },
      ]
    },
    {
      title: "사업장 사진",
      documents: [
        { name: "간판 사진", url: enrollment.sign_photo_url, required: true },
        { name: "출입문(닫힌)", url: enrollment.door_closed_url, required: true },
        { name: "출입문(열린)", url: enrollment.door_open_url, required: true },
        { name: "내부 전경", url: enrollment.interior_url, required: true },
        { name: "제품 사진", url: enrollment.product_url, required: true },
        { name: "명함/팜플렛", url: enrollment.business_card_url, required: false },
      ]
    }
  ]

  if (enrollment.business_type === '법인사업자') {
    documentSections.push({
      title: "법인 서류",
      documents: [
        { name: "법인등기부등본", url: enrollment.corporate_registration_url, required: true },
        { name: "주주명부", url: enrollment.shareholder_list_url, required: true },
        { name: "인감증명서", url: enrollment.seal_certificate_url, required: true },
        { name: "사용인감계", url: enrollment.seal_usage_url, required: false },
      ]
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/admin/enrollments')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            목록으로
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {enrollment.business_name || '신청 상세'}
            </h1>
            <p className="text-gray-600 mt-1">
              신청 ID: {enrollment.id.slice(0, 8)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(enrollment.status)}
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/enrollments/${enrollment.id}/edit`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            전체 편집
          </Button>
          {enrollment.status === 'approved' && (
            <Button
              variant="outline"
              onClick={() => router.push(`/admin/enrollments/${enrollment.id}/onboarding`)}
            >
              <ListChecks className="w-4 h-4 mr-2" />
              온보딩 체크리스트
            </Button>
          )}
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            PDF 다운로드
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      {enrollment.status !== 'approved' && enrollment.status !== 'rejected' && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">빠른 작업</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">검토 메모</label>
              <Textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="검토 사항을 입력하세요..."
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => updateStatus('reviewing')}
                variant="outline"
                disabled={updating}
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                검토중으로 변경
              </Button>
              <Button
                onClick={() => updateStatus('approved')}
                className="bg-green-600 hover:bg-green-700"
                disabled={updating}
              >
                <Check className="w-4 h-4 mr-2" />
                승인
              </Button>
              <Button
                onClick={() => updateStatus('rejected')}
                variant="destructive"
                disabled={updating}
              >
                <X className="w-4 h-4 mr-2" />
                반려
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Detail Tabs */}
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">기본 정보</TabsTrigger>
          <TabsTrigger value="business">사업 정보</TabsTrigger>
          <TabsTrigger value="sales">매출 정보</TabsTrigger>
          <TabsTrigger value="settlement">정산 정보</TabsTrigger>
          <TabsTrigger value="documents">제출 서류</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              대표자 정보
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">대표자명</p>
                <p className="font-medium">{enrollment.representative_name || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">연락처</p>
                <p className="font-medium flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {enrollment.phone_number || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">생년월일</p>
                <p className="font-medium">{enrollment.birth_date || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">성별</p>
                <p className="font-medium">
                  {enrollment.gender === 'male' ? '남성' :
                   enrollment.gender === 'female' ? '여성' : '-'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">동의 현황</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {enrollment.agree_terms ?
                  <CheckCircle className="w-4 h-4 text-green-600" /> :
                  <X className="w-4 h-4 text-red-600" />
                }
                <span>이용약관 동의</span>
              </div>
              <div className="flex items-center gap-2">
                {enrollment.agree_privacy ?
                  <CheckCircle className="w-4 h-4 text-green-600" /> :
                  <X className="w-4 h-4 text-red-600" />
                }
                <span>개인정보처리방침 동의</span>
              </div>
              <div className="flex items-center gap-2">
                {enrollment.agree_marketing ?
                  <CheckCircle className="w-4 h-4 text-green-600" /> :
                  <X className="w-4 h-4 text-red-600" />
                }
                <span>마케팅 정보 수신 동의</span>
              </div>
              <div className="flex items-center gap-2">
                {enrollment.agree_tosspay ?
                  <CheckCircle className="w-4 h-4 text-green-600" /> :
                  <X className="w-4 h-4 text-red-600" />
                }
                <span>토스페이 약관 동의</span>
              </div>
            </div>
            {enrollment.agreed_card_companies && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">동의한 카드사</p>
                <div className="flex flex-wrap gap-2">
                  {enrollment.agreed_card_companies.split(',').map((company) => (
                    <Badge key={company} variant="outline">{company}</Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Building className="w-5 h-5" />
              사업자 정보
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">사업자 유형</p>
                <Badge variant="outline">{enrollment.business_type || '-'}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">사업자번호</p>
                <p className="font-medium">{enrollment.business_number || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">사업자명</p>
                <p className="font-medium">{enrollment.business_name || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">매장 면적</p>
                <p className="font-medium">
                  {enrollment.need_local_data ? '정보 필요' : enrollment.store_area || '-'}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">사업장 주소</p>
                <p className="font-medium">
                  {enrollment.business_address} {enrollment.business_detail_address}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">업종 정보</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">업종 대분류</p>
                <p className="font-medium">{enrollment.business_category || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">업종 소분류</p>
                <p className="font-medium">{enrollment.business_subcategory || '-'}</p>
              </div>
              {enrollment.business_keywords && enrollment.business_keywords.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">키워드</p>
                  <div className="flex flex-wrap gap-2">
                    {enrollment.business_keywords.map((keyword) => (
                      <Badge key={keyword} variant="secondary">{keyword}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              매출 정보
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">월평균 매출</p>
                <p className="font-medium">{enrollment.monthly_sales || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">카드매출 비율</p>
                <p className="font-medium">
                  {enrollment.card_sales_ratio ? `${enrollment.card_sales_ratio}%` : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">주력 상품/서비스</p>
                <p className="font-medium">{enrollment.main_product || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">평균 단가</p>
                <p className="font-medium">
                  {enrollment.unit_price ? `${parseInt(enrollment.unit_price).toLocaleString()}원` : '-'}
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settlement" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Banknote className="w-5 h-5" />
              정산 계좌 정보
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">은행명</p>
                <p className="font-medium">{enrollment.bank_name || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">예금주</p>
                <p className="font-medium">{enrollment.account_holder || '-'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">계좌번호</p>
                <p className="font-medium">{enrollment.account_number || '-'}</p>
              </div>
            </div>
          </Card>

          {/* Card Company Status */}
          <CardCompanyStatus
            enrollmentId={enrollment.id}
            cardCompanies={{
              kb_card: enrollment.kb_card,
              bc_card: enrollment.bc_card,
              samsung_card: enrollment.samsung_card,
              woori_card: enrollment.woori_card,
              hana_card: enrollment.hana_card,
              kb_card_status: enrollment.kb_card_status,
              bc_card_status: enrollment.bc_card_status,
              samsung_card_status: enrollment.samsung_card_status,
              woori_card_status: enrollment.woori_card_status,
              hana_card_status: enrollment.hana_card_status,
              kb_merchant_number: enrollment.kb_merchant_number,
              bc_merchant_number: enrollment.bc_merchant_number,
              samsung_merchant_number: enrollment.samsung_merchant_number,
              woori_merchant_number: enrollment.woori_merchant_number,
              hana_merchant_number: enrollment.hana_merchant_number
            }}
            onUpdate={() => fetchEnrollment(params.id as string)}
          />
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          {documentSections.map((section) => (
            <Card key={section.title} className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {section.title}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {section.documents.map((doc) => (
                  <div key={doc.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      {doc.url ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <X className="w-4 h-4 text-gray-400" />
                      )}
                      <span className={doc.url ? '' : 'text-gray-400'}>
                        {doc.name}
                        {doc.required && <span className="text-red-500 ml-1">*</span>}
                      </span>
                    </div>
                    {doc.url && (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Timeline */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          처리 이력
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className="flex-1">
              <p className="font-medium">신청서 작성 시작</p>
              <p className="text-sm text-gray-600">
                {format(new Date(enrollment.created_at), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })}
              </p>
            </div>
          </div>
          {enrollment.submitted_at && (
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">신청서 제출</p>
                <p className="text-sm text-gray-600">
                  {format(new Date(enrollment.submitted_at), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })}
                </p>
              </div>
            </div>
          )}
          {enrollment.reviewed_at && (
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 ${
                enrollment.status === 'approved' ? 'bg-green-400' :
                enrollment.status === 'rejected' ? 'bg-red-400' : 'bg-yellow-400'
              } rounded-full`}></div>
              <div className="flex-1">
                <p className="font-medium">
                  {enrollment.status === 'approved' ? '승인됨' :
                   enrollment.status === 'rejected' ? '반려됨' : '검토중'}
                </p>
                <p className="text-sm text-gray-600">
                  {format(new Date(enrollment.reviewed_at), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })}
                </p>
                {enrollment.reviewer_notes && (
                  <p className="text-sm mt-1 p-2 bg-gray-50 rounded">
                    {enrollment.reviewer_notes}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}