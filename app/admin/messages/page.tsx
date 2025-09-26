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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from 'sonner'
import {
  Loader2,
  Send,
  Users,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Phone,
  MessageCircle,
  Bell
} from 'lucide-react'

interface AlimtalkTemplate {
  key: string
  code: string
  name: string
  content: string
}

export default function MessagesPage() {
  const [loading, setLoading] = useState(false)
  const [sendingType, setSendingType] = useState('')
  const [templates, setTemplates] = useState<AlimtalkTemplate[]>([])

  // SMS 개별 발송 상태
  const [smsForm, setSmsForm] = useState({
    phoneNumber: '',
    message: '',
    messageType: 'auto', // auto, SMS, LMS
  })

  // SMS 대량 발송 상태
  const [smsBulkForm, setSmsBulkForm] = useState({
    phoneNumbers: '',
    message: '',
    messageType: 'auto',
  })

  // 알림톡 개별 발송 상태
  const [alimtalkForm, setAlimtalkForm] = useState({
    phoneNumber: '',
    templateType: 'enrollment',
    name: '',
    businessType: '',
    storeName: '',
    content: '',
  })

  // 알림톡 대량 발송 상태
  const [alimtalkBulkForm, setAlimtalkBulkForm] = useState({
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

  // 메시지 바이트 계산 (한글 2바이트, 영문 1바이트)
  const getByteLength = (text: string) => {
    let bytes = 0
    for (let i = 0; i < text.length; i++) {
      bytes += text.charCodeAt(i) > 127 ? 2 : 1
    }
    return bytes
  }

  // SMS 개별 발송 처리
  const handleSmsSend = async () => {
    if (!smsForm.phoneNumber) {
      toast.error('수신번호를 입력해주세요.')
      return
    }
    if (!smsForm.message) {
      toast.error('메시지를 입력해주세요.')
      return
    }

    setLoading(true)
    setSendingType('sms')

    try {
      const res = await fetch('/api/sms/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: smsForm.phoneNumber,
          text: smsForm.message,
          type: smsForm.messageType === 'auto' ? undefined : smsForm.messageType,
        }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success(`SMS가 성공적으로 발송되었습니다.`)

        // 폼 초기화
        setSmsForm({
          phoneNumber: '',
          message: '',
          messageType: 'auto',
        })
      } else {
        toast.error(data.error || 'SMS 발송에 실패했습니다.')
      }
    } catch (error) {
      console.error('SMS 발송 오류:', error)
      toast.error('SMS 발송 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
      setSendingType('')
    }
  }

  // SMS 대량 발송 처리
  const handleSmsBulkSend = async () => {
    const phoneNumbers = smsBulkForm.phoneNumbers
      .split(/[\n,]/)
      .map(p => p.trim())
      .filter(p => p)

    if (phoneNumbers.length === 0) {
      toast.error('수신번호를 입력해주세요.')
      return
    }

    if (!smsBulkForm.message) {
      toast.error('메시지를 입력해주세요.')
      return
    }

    setLoading(true)
    setSendingType('sms-bulk')

    try {
      // 각 번호에 대해 개별 발송 (실제로는 대량 API 사용하는 것이 좋음)
      let successCount = 0
      let failCount = 0

      for (const phoneNumber of phoneNumbers) {
        try {
          const res = await fetch('/api/sms/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: phoneNumber,
              text: smsBulkForm.message,
              type: smsBulkForm.messageType === 'auto' ? undefined : smsBulkForm.messageType,
            }),
          })

          const data = await res.json()
          if (data.success) {
            successCount++
          } else {
            failCount++
          }
        } catch (error) {
          failCount++
        }
      }

      if (successCount > 0) {
        toast.success(`${successCount}명에게 SMS를 발송했습니다.${failCount > 0 ? ` (실패: ${failCount}명)` : ''}`)
      } else {
        toast.error('모든 SMS 발송에 실패했습니다.')
      }

      // 폼 초기화
      if (successCount > 0) {
        setSmsBulkForm({
          phoneNumbers: '',
          message: '',
          messageType: 'auto',
        })
      }
    } catch (error) {
      console.error('대량 SMS 발송 오류:', error)
      toast.error('SMS 발송 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
      setSendingType('')
    }
  }

  // 알림톡 개별 발송 처리
  const handleAlimtalkSend = async () => {
    if (!alimtalkForm.phoneNumber) {
      toast.error('수신번호를 입력해주세요.')
      return
    }

    setLoading(true)
    setSendingType('alimtalk')

    try {
      const payload: any = {
        type: alimtalkForm.templateType,
        to: alimtalkForm.phoneNumber,
        name: alimtalkForm.name,
      }

      if (alimtalkForm.templateType === 'enrollment') {
        payload.businessType = alimtalkForm.businessType || '기타'
      } else if (alimtalkForm.templateType === 'approval') {
        payload.storeName = alimtalkForm.storeName || alimtalkForm.name + '님의 가맹점'
      } else if (alimtalkForm.templateType === 'notice') {
        payload.content = alimtalkForm.content
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
        toast.success(`알림톡이 성공적으로 발송되었습니다.`)

        // 폼 초기화
        setAlimtalkForm({
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
      console.error('알림톡 발송 오류:', error)
      toast.error('알림톡 발송 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
      setSendingType('')
    }
  }

  // 알림톡 대량 발송 처리
  const handleAlimtalkBulkSend = async () => {
    const phoneNumbers = alimtalkBulkForm.phoneNumbers
      .split(/[\n,]/)
      .map(p => p.trim())
      .filter(p => p)

    if (phoneNumbers.length === 0) {
      toast.error('수신번호를 입력해주세요.')
      return
    }

    if (!alimtalkBulkForm.content) {
      toast.error('공지 내용을 입력해주세요.')
      return
    }

    setLoading(true)
    setSendingType('alimtalk-bulk')

    try {
      const res = await fetch('/api/kakao/alimtalk/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'notice',
          to: phoneNumbers,
          content: alimtalkBulkForm.content,
        }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success(`${phoneNumbers.length}명에게 알림톡이 발송되었습니다.`)

        // 폼 초기화
        setAlimtalkBulkForm({
          phoneNumbers: '',
          templateType: 'notice',
          content: '',
        })
      } else {
        toast.error(data.error || '알림톡 발송에 실패했습니다.')
      }
    } catch (error) {
      console.error('대량 알림톡 발송 오류:', error)
      toast.error('알림톡 발송 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
      setSendingType('')
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">메시지 발송 관리</h1>
        <p className="text-muted-foreground mt-2">
          SMS와 카카오 알림톡을 발송하고 관리합니다.
        </p>
      </div>

      <Tabs defaultValue="sms" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sms">
            <MessageCircle className="mr-2 h-4 w-4" />
            SMS 문자
          </TabsTrigger>
          <TabsTrigger value="alimtalk">
            <Bell className="mr-2 h-4 w-4" />
            카카오 알림톡
          </TabsTrigger>
        </TabsList>

        {/* SMS 탭 */}
        <TabsContent value="sms" className="space-y-4">
          <Tabs defaultValue="individual" className="space-y-4">
            <TabsList>
              <TabsTrigger value="individual">개별 발송</TabsTrigger>
              <TabsTrigger value="bulk">대량 발송</TabsTrigger>
            </TabsList>

            {/* SMS 개별 발송 */}
            <TabsContent value="individual">
              <Card>
                <CardHeader>
                  <CardTitle>SMS 개별 발송</CardTitle>
                  <CardDescription>
                    특정 고객에게 SMS를 발송합니다.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="sms-phone">수신번호 *</Label>
                      <Input
                        id="sms-phone"
                        placeholder="010-0000-0000"
                        value={smsForm.phoneNumber}
                        onChange={(e) => setSmsForm({
                          ...smsForm,
                          phoneNumber: e.target.value
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sms-type">메시지 타입</Label>
                      <RadioGroup
                        value={smsForm.messageType}
                        onValueChange={(value) => setSmsForm({
                          ...smsForm,
                          messageType: value
                        })}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="auto" id="auto" />
                          <Label htmlFor="auto">자동</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="SMS" id="sms-radio" />
                          <Label htmlFor="sms-radio">SMS</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="LMS" id="lms" />
                          <Label htmlFor="lms">LMS</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="sms-message">메시지 내용 *</Label>
                      <span className="text-sm text-muted-foreground">
                        {getByteLength(smsForm.message)} bytes / {smsForm.messageType === 'SMS' ? '90' : '2000'} bytes
                      </span>
                    </div>
                    <Textarea
                      id="sms-message"
                      placeholder="메시지 내용을 입력하세요..."
                      value={smsForm.message}
                      onChange={(e) => setSmsForm({
                        ...smsForm,
                        message: e.target.value
                      })}
                      rows={6}
                    />
                    <p className="text-sm text-muted-foreground">
                      SMS: 90 bytes (한글 45자) / LMS: 2000 bytes (한글 1000자)
                    </p>
                  </div>

                  <Button
                    onClick={handleSmsSend}
                    disabled={loading}
                    className="w-full md:w-auto"
                  >
                    {loading && sendingType === 'sms' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        발송 중...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        SMS 발송
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SMS 대량 발송 */}
            <TabsContent value="bulk">
              <Card>
                <CardHeader>
                  <CardTitle>SMS 대량 발송</CardTitle>
                  <CardDescription>
                    여러 고객에게 동시에 SMS를 발송합니다.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sms-bulk-phones">수신번호 목록 *</Label>
                    <Textarea
                      id="sms-bulk-phones"
                      placeholder="010-0000-0000&#10;010-1111-1111&#10;010-2222-2222"
                      value={smsBulkForm.phoneNumbers}
                      onChange={(e) => setSmsBulkForm({
                        ...smsBulkForm,
                        phoneNumbers: e.target.value
                      })}
                      rows={6}
                    />
                    <p className="text-sm text-muted-foreground">
                      한 줄에 하나씩 또는 콤마(,)로 구분하여 입력하세요.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="sms-bulk-message">메시지 내용 *</Label>
                      <span className="text-sm text-muted-foreground">
                        {getByteLength(smsBulkForm.message)} bytes
                      </span>
                    </div>
                    <Textarea
                      id="sms-bulk-message"
                      placeholder="메시지 내용을 입력하세요..."
                      value={smsBulkForm.message}
                      onChange={(e) => setSmsBulkForm({
                        ...smsBulkForm,
                        message: e.target.value
                      })}
                      rows={6}
                    />
                  </div>

                  <Button
                    onClick={handleSmsBulkSend}
                    disabled={loading}
                    className="w-full md:w-auto"
                  >
                    {loading && sendingType === 'sms-bulk' ? (
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
          </Tabs>
        </TabsContent>

        {/* 알림톡 탭 */}
        <TabsContent value="alimtalk" className="space-y-4">
          <Tabs defaultValue="individual" className="space-y-4">
            <TabsList>
              <TabsTrigger value="individual">개별 발송</TabsTrigger>
              <TabsTrigger value="bulk">대량 발송</TabsTrigger>
              <TabsTrigger value="templates">템플릿 관리</TabsTrigger>
            </TabsList>

            {/* 알림톡 개별 발송 */}
            <TabsContent value="individual">
              <Card>
                <CardHeader>
                  <CardTitle>알림톡 개별 발송</CardTitle>
                  <CardDescription>
                    특정 고객에게 카카오 알림톡을 발송합니다.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="alim-phone">수신번호 *</Label>
                      <Input
                        id="alim-phone"
                        placeholder="010-0000-0000"
                        value={alimtalkForm.phoneNumber}
                        onChange={(e) => setAlimtalkForm({
                          ...alimtalkForm,
                          phoneNumber: e.target.value
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="alim-template">템플릿 유형 *</Label>
                      <Select
                        value={alimtalkForm.templateType}
                        onValueChange={(value) => setAlimtalkForm({
                          ...alimtalkForm,
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
                      <Label htmlFor="alim-name">고객명 *</Label>
                      <Input
                        id="alim-name"
                        placeholder="홍길동"
                        value={alimtalkForm.name}
                        onChange={(e) => setAlimtalkForm({
                          ...alimtalkForm,
                          name: e.target.value
                        })}
                      />
                    </div>

                    {alimtalkForm.templateType === 'enrollment' && (
                      <div className="space-y-2">
                        <Label htmlFor="alim-businessType">업종</Label>
                        <Input
                          id="alim-businessType"
                          placeholder="요식업"
                          value={alimtalkForm.businessType}
                          onChange={(e) => setAlimtalkForm({
                            ...alimtalkForm,
                            businessType: e.target.value
                          })}
                        />
                      </div>
                    )}

                    {alimtalkForm.templateType === 'approval' && (
                      <div className="space-y-2">
                        <Label htmlFor="alim-storeName">가맹점명</Label>
                        <Input
                          id="alim-storeName"
                          placeholder="○○카페"
                          value={alimtalkForm.storeName}
                          onChange={(e) => setAlimtalkForm({
                            ...alimtalkForm,
                            storeName: e.target.value
                          })}
                        />
                      </div>
                    )}

                    {alimtalkForm.templateType === 'notice' && (
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="alim-content">공지 내용</Label>
                        <Textarea
                          id="alim-content"
                          placeholder="공지 내용을 입력하세요..."
                          value={alimtalkForm.content}
                          onChange={(e) => setAlimtalkForm({
                            ...alimtalkForm,
                            content: e.target.value
                          })}
                          rows={4}
                        />
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleAlimtalkSend}
                    disabled={loading}
                    className="w-full md:w-auto"
                  >
                    {loading && sendingType === 'alimtalk' ? (
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

            {/* 알림톡 대량 발송 */}
            <TabsContent value="bulk">
              <Card>
                <CardHeader>
                  <CardTitle>알림톡 대량 발송</CardTitle>
                  <CardDescription>
                    여러 고객에게 동시에 알림톡을 발송합니다.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="alim-bulk-phones">수신번호 목록 *</Label>
                    <Textarea
                      id="alim-bulk-phones"
                      placeholder="010-0000-0000&#10;010-1111-1111&#10;010-2222-2222"
                      value={alimtalkBulkForm.phoneNumbers}
                      onChange={(e) => setAlimtalkBulkForm({
                        ...alimtalkBulkForm,
                        phoneNumbers: e.target.value
                      })}
                      rows={6}
                    />
                    <p className="text-sm text-muted-foreground">
                      한 줄에 하나씩 또는 콤마(,)로 구분하여 입력하세요.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alim-bulk-content">공지 내용 *</Label>
                    <Textarea
                      id="alim-bulk-content"
                      placeholder="공지 내용을 입력하세요..."
                      value={alimtalkBulkForm.content}
                      onChange={(e) => setAlimtalkBulkForm({
                        ...alimtalkBulkForm,
                        content: e.target.value
                      })}
                      rows={4}
                    />
                  </div>

                  <Button
                    onClick={handleAlimtalkBulkSend}
                    disabled={loading}
                    className="w-full md:w-auto"
                  >
                    {loading && sendingType === 'alimtalk-bulk' ? (
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

            {/* 템플릿 관리 */}
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
        </TabsContent>
      </Tabs>
    </div>
  )
}