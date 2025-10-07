"use client"

import { useState } from "react"
import { useEnrollmentDetail } from "@/hooks/useEnrollmentData"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  FileText,
  CreditCard,
  Phone,
  Building,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

interface EnrollmentQuickViewProps {
  enrollmentId: string | null
  isOpen: boolean
  onClose: () => void
}

export function EnrollmentQuickView({
  enrollmentId,
  isOpen,
  onClose
}: EnrollmentQuickViewProps) {
  const { enrollment, loading, error } = useEnrollmentDetail({
    id: enrollmentId || undefined,
    redirectOnError: false
  })

  if (!enrollmentId) return null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle>가입 신청 상세 정보</SheetTitle>
          <SheetDescription>
            빠른 미리보기 - 전체 정보를 보려면 상세 페이지로 이동하세요
          </SheetDescription>
        </SheetHeader>

        <div className="h-[calc(100vh-120px)] mt-6 overflow-y-auto">
          {loading ? (
            <div className="space-y-4">
              <div className="h-20 w-full bg-gray-200 animate-pulse rounded" />
              <div className="h-20 w-full bg-gray-200 animate-pulse rounded" />
              <div className="h-20 w-full bg-gray-200 animate-pulse rounded" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600">{error}</p>
            </div>
          ) : enrollment ? (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">상태</h3>
                <Badge variant={
                  enrollment.status === 'approved' ? 'success' :
                  enrollment.status === 'rejected' ? 'destructive' :
                  enrollment.status === 'reviewing' ? 'default' :
                  'secondary'
                }>
                  {enrollment.status}
                </Badge>
              </div>

              {/* Basic Info */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  사업자 정보
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">사업자명</p>
                    <p className="font-medium">{enrollment.business_name || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">대표자명</p>
                    <p className="font-medium">{enrollment.representative_name || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">연락처</p>
                    <p className="font-medium">{enrollment.phone_number || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">사업자번호</p>
                    <p className="font-medium">{enrollment.business_number || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Card Companies */}
              {(enrollment.kb_card || enrollment.bc_card || enrollment.samsung_card ||
                enrollment.woori_card || enrollment.hana_card) && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    카드사 신청
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {enrollment.kb_card && <Badge>KB카드</Badge>}
                    {enrollment.bc_card && <Badge>BC카드</Badge>}
                    {enrollment.samsung_card && <Badge>삼성카드</Badge>}
                    {enrollment.woori_card && <Badge>우리카드</Badge>}
                    {enrollment.hana_card && <Badge>하나카드</Badge>}
                  </div>
                </div>
              )}

              {/* Equipment */}
              {(enrollment.has_pos || enrollment.has_kiosk || enrollment.has_cctv) && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">장비 신청</h3>
                  <div className="flex flex-wrap gap-2">
                    {enrollment.has_pos && <Badge variant="outline">POS</Badge>}
                    {enrollment.has_kiosk && <Badge variant="outline">키오스크</Badge>}
                    {enrollment.has_cctv && <Badge variant="outline">CCTV</Badge>}
                  </div>
                </div>
              )}

              {/* Documents */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  서류 제출 상태
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>사업자등록증</span>
                    {enrollment.business_registration_url ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>신분증 앞면</span>
                    {enrollment.id_card_front_url ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>신분증 뒷면</span>
                    {enrollment.id_card_back_url ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>통장사본</span>
                    {enrollment.bankbook_url ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">신청일:</span>
                  <span>{format(new Date(enrollment.created_at), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })}</span>
                </div>
                {enrollment.submitted_at && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">제출일:</span>
                    <span>{format(new Date(enrollment.submitted_at), 'yyyy년 MM월 dd일 HH:mm', { locale: ko })}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button
                  className="flex-1"
                  onClick={() => window.location.href = `/admin/enrollments/${enrollment.id}`}
                >
                  상세 페이지로 이동
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                >
                  닫기
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}
