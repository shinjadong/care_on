'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Loader2, Send, Users, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react'

interface AlimtalkTemplate {
  key: string
  code: string
  name: string
  content: string
}

export default function AlimtalkPage() {
  const [loading, setLoading] = useState(false)
  const [sendingType, setSendingType] = useState('')
  const [templates, setTemplates] = useState<AlimtalkTemplate[]>([])

  // 개별 발송 상태
  const [individualForm, setIndividualForm] = useState({
    phoneNumber: '',
    templateType: 'enrollment',
    name: '',
    businessType: '',
    storeName: '',
    content: '',
  })

  // 대량 발송 상태
  const [bulkForm, setBulkForm] = useState({
    phoneNumbers: '',
    templateType: 'notice',
    content: '',
  })

  // 템플릿 목록 로드
  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      const res = await fetch('/api/kakao/alimtalk/send')
      const data = await res.json()
      if (data.success) {
        setTemplates(data.templates)
      }
    } catch (error) {
      console.error('템플릿 로드 실패:', error)
    }
  }

  // 개별 발송 처리
  const handleIndividualSend = async () => {
    if (!individualForm.phoneNumber) {
      toast.error('수신번호를 입력해주세요.')
      return
    }

    setLoading(true)
    setSendingType('individual')

    try {
      const payload: any = {
        type: individualForm.templateType,
        to: individualForm.phoneNumber,
        name: individualForm.name,
      }

      // 템플릿 타입별 추가 데이터
      if (individualForm.templateType === 'enrollment') {
        payload.businessType = individualForm.businessType || '기타'
      } else if (individualForm.templateType === 'approval') {
        payload.storeName = individualForm.storeName || individualForm.name + '님의 가맹점'
      } else if (individualForm.templateType === 'notice') {
        payload.content = individualForm.content
      }

      const res = await fetch('/api/kakao/alimtalk/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (data.success) {
        toast.success(`알림톡이 성공적으로 발송되었습니다. (Key: ${data.messageKey})`)

        // 폼 초기화
        setIndividualForm({
          phoneNumber: '',
          templateType: 'enrollment',
          name: '',
          businessType: '',
          storeName: '',
          content: '',
        })
      } else {
        toast.error(data.error || '알림톡 발송에 실패했습니다.')
      }
    } catch (error) {
      console.error('발송 오류:', error)
      toast.error('알림톡 발송 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
      setSendingType('')
    }
  }

  // 대량 발송 처리
  const handleBulkSend = async () => {
    const phoneNumbers = bulkForm.phoneNumbers
      .split(/[\n,]/)
      .map(p => p.trim())
      .filter(p => p)

    if (phoneNumbers.length === 0) {
      toast.error('수신번호를 입력해주세요.')
      return
    }

    if (!bulkForm.content) {
      toast.error('공지 내용을 입력해주세요.')
      return
    }

    setLoading(true)
    setSendingType('bulk')

    try {
      const res = await fetch('/api/kakao/alimtalk/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'notice',
          to: phoneNumbers,
          content: bulkForm.content,
        }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success(`${phoneNumbers.length}명에게 알림톡이 발송되었습니다.`)

        // 폼 초기화
        setBulkForm({
          phoneNumbers: '',
          templateType: 'notice',
          content: '',
        })
      } else {
        toast.error(data.error || '알림톡 발송에 실패했습니다.')
      }
    } catch (error) {
      console.error('대량 발송 오류:', error)
      toast.error('알림톡 발송 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
      setSendingType('')
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">카카오 알림톡 발송</h1>
        <p className="text-muted-foreground mt-2">
          고객에게 카카오 알림톡을 발송하고 관리합니다.
        </p>
      </div>

      <Tabs defaultValue="individual" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="individual">
            <MessageSquare className="mr-2 h-4 w-4" />
            개별 발송
          </TabsTrigger>
          <TabsTrigger value="bulk">
            <Users className="mr-2 h-4 w-4" />
            대량 발송
          </TabsTrigger>
          <TabsTrigger value="templates">
            <CheckCircle className="mr-2 h-4 w-4" />
            템플릿 관리
          </TabsTrigger>
        </TabsList>

        {/* 개별 발송 탭 */}
        <TabsContent value="individual">
          <Card>
            <CardHeader>
              <CardTitle>개별 알림톡 발송</CardTitle>
              <CardDescription>
                특정 고객에게 알림톡을 발송합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">수신번호 *</Label>
                  <Input
                    id="phone"
                    placeholder="010-0000-0000"
                    value={individualForm.phoneNumber}
                    onChange={(e) => setIndividualForm({
                      ...individualForm,
                      phoneNumber: e.target.value
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template">템플릿 유형 *</Label>
                  <Select
                    value={individualForm.templateType}
                    onValueChange={(value) => setIndividualForm({
                      ...individualForm,
                      templateType: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enrollment">가입 완료</SelectItem>
                      <SelectItem value="approval">승인 완료</SelectItem>
                      <SelectItem value="notice">고객 공지</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">고객명 *</Label>
                  <Input
                    id="name"
                    placeholder="홍길동"
                    value={individualForm.name}
                    onChange={(e) => setIndividualForm({
                      ...individualForm,
                      name: e.target.value
                    })}
                  />
                </div>

                {individualForm.templateType === 'enrollment' && (
                  <div className="space-y-2">
                    <Label htmlFor="businessType">업종</Label>
                    <Input
                      id="businessType"
                      placeholder="요식업"
                      value={individualForm.businessType}
                      onChange={(e) => setIndividualForm({
                        ...individualForm,
                        businessType: e.target.value
                      })}
                    />
                  </div>
                )}

                {individualForm.templateType === 'approval' && (
                  <div className="space-y-2">
                    <Label htmlFor="storeName">가맹점명</Label>
                    <Input
                      id="storeName"
                      placeholder="○○카페"
                      value={individualForm.storeName}
                      onChange={(e) => setIndividualForm({
                        ...individualForm,
                        storeName: e.target.value
                      })}
                    />
                  </div>
                )}

                {individualForm.templateType === 'notice' && (
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="content">공지 내용</Label>
                    <Textarea
                      id="content"
                      placeholder="공지 내용을 입력하세요..."
                      value={individualForm.content}
                      onChange={(e) => setIndividualForm({
                        ...individualForm,
                        content: e.target.value
                      })}
                      rows={4}
                    />
                  </div>
                )}
              </div>

              <Button
                onClick={handleIndividualSend}
                disabled={loading}
                className="w-full md:w-auto"
              >
                {loading && sendingType === 'individual' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    발송 중...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    알림톡 발송
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 대량 발송 탭 */}
        <TabsContent value="bulk">
          <Card>
            <CardHeader>
              <CardTitle>대량 알림톡 발송</CardTitle>
              <CardDescription>
                여러 고객에게 동시에 알림톡을 발송합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bulk-phones">수신번호 목록 *</Label>
                <Textarea
                  id="bulk-phones"
                  placeholder="010-0000-0000&#10;010-1111-1111&#10;010-2222-2222"
                  value={bulkForm.phoneNumbers}
                  onChange={(e) => setBulkForm({
                    ...bulkForm,
                    phoneNumbers: e.target.value
                  })}
                  rows={6}
                />
                <p className="text-sm text-muted-foreground">
                  한 줄에 하나씩 또는 콤마(,)로 구분하여 입력하세요.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bulk-content">공지 내용 *</Label>
                <Textarea
                  id="bulk-content"
                  placeholder="공지 내용을 입력하세요..."
                  value={bulkForm.content}
                  onChange={(e) => setBulkForm({
                    ...bulkForm,
                    content: e.target.value
                  })}
                  rows={4}
                />
              </div>

              <Button
                onClick={handleBulkSend}
                disabled={loading}
                className="w-full md:w-auto"
              >
                {loading && sendingType === 'bulk' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    발송 중...
                  </>
                ) : (
                  <>
                    <Users className="mr-2 h-4 w-4" />
                    대량 발송
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 템플릿 관리 탭 */}
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>등록된 템플릿</CardTitle>
              <CardDescription>
                카카오 비즈니스에 등록된 알림톡 템플릿 목록입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map((template) => (
                  <Card key={template.key}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <Badge variant="secondary">{template.code}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {template.content}
                      </pre>
                    </CardContent>
                  </Card>
                ))}

                {templates.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="mx-auto h-8 w-8 mb-2" />
                    <p>등록된 템플릿이 없습니다.</p>
                    <p className="text-sm mt-1">
                      카카오 비즈니스 채널에서 템플릿을 등록해주세요.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}