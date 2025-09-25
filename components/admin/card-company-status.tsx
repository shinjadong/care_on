"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Check, X, Clock, AlertCircle } from "lucide-react"

interface CardCompanyStatusProps {
  enrollmentId: string
  cardCompanies: {
    kb_card: boolean
    bc_card: boolean
    samsung_card: boolean
    woori_card: boolean
    hana_card: boolean
    kb_card_status?: string
    bc_card_status?: string
    samsung_card_status?: string
    woori_card_status?: string
    hana_card_status?: string
    kb_merchant_number?: string
    bc_merchant_number?: string
    samsung_merchant_number?: string
    woori_merchant_number?: string
    hana_merchant_number?: string
  }
  onUpdate?: () => void
}

const cardCompanyInfo = {
  kb: { name: "KB국민카드", color: "bg-orange-500" },
  bc: { name: "BC카드", color: "bg-red-500" },
  samsung: { name: "삼성카드", color: "bg-blue-600" },
  woori: { name: "우리카드", color: "bg-blue-500" },
  hana: { name: "하나카드", color: "bg-green-600" }
}

export default function CardCompanyStatus({
  enrollmentId,
  cardCompanies,
  onUpdate
}: CardCompanyStatusProps) {
  const [statuses, setStatuses] = useState({
    kb_card_status: cardCompanies.kb_card_status || (cardCompanies.kb_card ? 'pending' : null),
    bc_card_status: cardCompanies.bc_card_status || (cardCompanies.bc_card ? 'pending' : null),
    samsung_card_status: cardCompanies.samsung_card_status || (cardCompanies.samsung_card ? 'pending' : null),
    woori_card_status: cardCompanies.woori_card_status || (cardCompanies.woori_card ? 'pending' : null),
    hana_card_status: cardCompanies.hana_card_status || (cardCompanies.hana_card ? 'pending' : null)
  })

  const [merchantNumbers, setMerchantNumbers] = useState({
    kb_merchant_number: cardCompanies.kb_merchant_number || '',
    bc_merchant_number: cardCompanies.bc_merchant_number || '',
    samsung_merchant_number: cardCompanies.samsung_merchant_number || '',
    woori_merchant_number: cardCompanies.woori_merchant_number || '',
    hana_merchant_number: cardCompanies.hana_merchant_number || ''
  })

  const [saving, setSaving] = useState(false)

  const getStatusBadge = (status: string | null) => {
    if (!status) return null

    const statusConfig = {
      pending: { label: '대기', icon: Clock, variant: 'secondary' as const },
      submitted: { label: '심사중', icon: AlertCircle, variant: 'default' as const },
      approved: { label: '승인', icon: Check, variant: 'success' as const },
      rejected: { label: '거절', icon: X, variant: 'destructive' as const }
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    if (!config) return null

    const Icon = config.icon
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const updateCardStatus = async () => {
    setSaving(true)
    const supabase = createClient()

    try {
      const updateData: any = {
        ...statuses,
        ...merchantNumbers,
        updated_at: new Date().toISOString()
      }

      // Add approval timestamps for approved cards
      Object.entries(statuses).forEach(([key, value]) => {
        if (value === 'approved') {
          const cardPrefix = key.replace('_status', '')
          const timestampKey = `${cardPrefix}_approved_at`
          if (!cardCompanies[timestampKey as keyof typeof cardCompanies]) {
            updateData[timestampKey] = new Date().toISOString()
          }
        }
      })

      const { error } = await supabase
        .from('enrollment_applications')
        .update(updateData)
        .eq('id', enrollmentId)

      if (error) throw error

      alert("카드사 상태가 업데이트되었습니다.")

      if (onUpdate) onUpdate()
    } catch (error) {
      console.error('Error updating card status:', error)
      alert("상태 업데이트에 실패했습니다.")
    } finally {
      setSaving(false)
    }
  }

  const cardList = [
    { key: 'kb', requested: cardCompanies.kb_card },
    { key: 'bc', requested: cardCompanies.bc_card },
    { key: 'samsung', requested: cardCompanies.samsung_card },
    { key: 'woori', requested: cardCompanies.woori_card },
    { key: 'hana', requested: cardCompanies.hana_card }
  ].filter(card => card.requested)

  if (cardList.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            카드사 가맹 상태
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">신청된 카드사가 없습니다.</p>
        </CardContent>
      </Card>
    )
  }

  // Calculate progress
  const totalCards = cardList.length
  const approvedCards = cardList.filter(
    card => statuses[`${card.key}_card_status` as keyof typeof statuses] === 'approved'
  ).length
  const progressPercentage = Math.round((approvedCards / totalCards) * 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          카드사 가맹 상태
        </CardTitle>
        <CardDescription>
          전체 {totalCards}개 카드사 중 {approvedCards}개 승인 완료 ({progressPercentage}%)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Card Company List */}
        <div className="space-y-4">
          {cardList.map(({ key }) => {
            const info = cardCompanyInfo[key as keyof typeof cardCompanyInfo]
            const statusKey = `${key}_card_status` as keyof typeof statuses
            const merchantKey = `${key}_merchant_number` as keyof typeof merchantNumbers

            return (
              <div key={key} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-8 rounded ${info.color}`} />
                    <div>
                      <h4 className="font-medium">{info.name}</h4>
                      <p className="text-sm text-gray-600">
                        {statuses[statusKey] === 'approved' && merchantNumbers[merchantKey]
                          ? `가맹점 번호: ${merchantNumbers[merchantKey]}`
                          : '가맹점 번호 미등록'}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(statuses[statusKey])}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={statusKey} className="text-sm">상태</Label>
                    <Select
                      value={statuses[statusKey] || 'pending'}
                      onValueChange={(value) =>
                        setStatuses(prev => ({ ...prev, [statusKey]: value }))
                      }
                    >
                      <SelectTrigger id={statusKey}>
                        <SelectValue />
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
                    <Label htmlFor={merchantKey} className="text-sm">가맹점 번호</Label>
                    <Input
                      id={merchantKey}
                      value={merchantNumbers[merchantKey]}
                      onChange={(e) =>
                        setMerchantNumbers(prev => ({
                          ...prev,
                          [merchantKey]: e.target.value
                        }))
                      }
                      placeholder="가맹점 번호 입력"
                      disabled={statuses[statusKey] !== 'approved'}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={updateCardStatus} disabled={saving}>
            {saving ? "저장 중..." : "변경사항 저장"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}