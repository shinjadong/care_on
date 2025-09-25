"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileText,
  CreditCard,
  Package,
  GraduationCap,
  Settings,
  Smartphone,
  AlertCircle,
  Send
} from "lucide-react"

interface OnboardingTask {
  id: string
  label: string
  description: string
  icon: any
  completed: boolean
  required: boolean
  category: 'contract' | 'payment' | 'equipment' | 'training' | 'service'
}

interface EnrollmentData {
  id: string
  business_name: string
  representative_name: string
  phone_number: string
  status: string
  has_pos: boolean
  has_kiosk: boolean
  has_cctv: boolean
  kb_card: boolean
  bc_card: boolean
  samsung_card: boolean
  woori_card: boolean
  hana_card: boolean
  onboarding_status?: {
    tasks?: Record<string, boolean>
    notes?: string
    completed_at?: string
  }
}

export default function OnboardingPage() {
  const params = useParams()
  const router = useRouter()
  const [enrollment, setEnrollment] = useState<EnrollmentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notes, setNotes] = useState("")
  const [tasks, setTasks] = useState<OnboardingTask[]>([])

  useEffect(() => {
    if (params.id) {
      fetchEnrollmentData(params.id as string)
    }
  }, [params.id])

  const fetchEnrollmentData = async (id: string) => {
    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from('enrollment_applications')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      setEnrollment(data)

      // Initialize tasks based on enrollment data
      const initialTasks: OnboardingTask[] = [
        {
          id: 'contract_created',
          label: '계약서 생성',
          description: '초기 계약서가 자동 생성되었는지 확인',
          icon: FileText,
          completed: data.onboarding_status?.tasks?.contract_created || false,
          required: true,
          category: 'contract'
        },
        {
          id: 'contract_sent',
          label: '계약서 발송',
          description: '고객에게 계약서 발송 완료',
          icon: Send,
          completed: data.onboarding_status?.tasks?.contract_sent || false,
          required: true,
          category: 'contract'
        },
        {
          id: 'contract_signed',
          label: '계약서 서명',
          description: '고객이 계약서에 서명 완료',
          icon: FileText,
          completed: data.onboarding_status?.tasks?.contract_signed || false,
          required: true,
          category: 'contract'
        },
        {
          id: 'payment_setup',
          label: '정산 계좌 확인',
          description: '정산 계좌 유효성 검증 완료',
          icon: CreditCard,
          completed: data.onboarding_status?.tasks?.payment_setup || false,
          required: true,
          category: 'payment'
        }
      ]

      // Add card company tasks if applicable
      if (data.kb_card) {
        initialTasks.push({
          id: 'kb_card_status',
          label: 'KB카드 가맹 승인',
          description: 'KB국민카드 가맹점 승인 완료',
          icon: CreditCard,
          completed: data.onboarding_status?.tasks?.kb_card_status || false,
          required: false,
          category: 'payment'
        })
      }

      if (data.bc_card) {
        initialTasks.push({
          id: 'bc_card_status',
          label: 'BC카드 가맹 승인',
          description: 'BC카드 가맹점 승인 완료',
          icon: CreditCard,
          completed: data.onboarding_status?.tasks?.bc_card_status || false,
          required: false,
          category: 'payment'
        })
      }

      if (data.samsung_card) {
        initialTasks.push({
          id: 'samsung_card_status',
          label: '삼성카드 가맹 승인',
          description: '삼성카드 가맹점 승인 완료',
          icon: CreditCard,
          completed: data.onboarding_status?.tasks?.samsung_card_status || false,
          required: false,
          category: 'payment'
        })
      }

      // Add equipment tasks
      if (data.has_pos) {
        initialTasks.push({
          id: 'pos_setup',
          label: 'POS 설치',
          description: 'POS 시스템 설치 및 설정 완료',
          icon: Package,
          completed: data.onboarding_status?.tasks?.pos_setup || false,
          required: true,
          category: 'equipment'
        })
      }

      if (data.has_kiosk) {
        initialTasks.push({
          id: 'kiosk_setup',
          label: '키오스크 설치',
          description: '키오스크 설치 및 설정 완료',
          icon: Smartphone,
          completed: data.onboarding_status?.tasks?.kiosk_setup || false,
          required: true,
          category: 'equipment'
        })
      }

      if (data.has_cctv) {
        initialTasks.push({
          id: 'cctv_setup',
          label: 'CCTV 설치',
          description: 'CCTV 시스템 설치 완료',
          icon: Settings,
          completed: data.onboarding_status?.tasks?.cctv_setup || false,
          required: true,
          category: 'equipment'
        })
      }

      // Add training tasks
      initialTasks.push(
        {
          id: 'training_scheduled',
          label: '교육 일정 확정',
          description: '운영 교육 일정 확정',
          icon: GraduationCap,
          completed: data.onboarding_status?.tasks?.training_scheduled || false,
          required: true,
          category: 'training'
        },
        {
          id: 'training_completed',
          label: '교육 완료',
          description: '필수 운영 교육 이수 완료',
          icon: GraduationCap,
          completed: data.onboarding_status?.tasks?.training_completed || false,
          required: true,
          category: 'training'
        }
      )

      // Add service activation
      initialTasks.push({
        id: 'service_activated',
        label: '서비스 활성화',
        description: '모든 서비스 활성화 완료',
        icon: CheckCircle2,
        completed: data.onboarding_status?.tasks?.service_activated || false,
        required: true,
        category: 'service'
      })

      setTasks(initialTasks)
      setNotes(data.onboarding_status?.notes || "")
    } catch (error) {
      console.error('Error fetching enrollment:', error)
      alert("데이터를 불러오는데 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ))
  }

  const saveOnboardingStatus = async () => {
    if (!enrollment) return

    setSaving(true)
    const supabase = createClient()

    const taskStatus = tasks.reduce((acc, task) => {
      acc[task.id] = task.completed
      return acc
    }, {} as Record<string, boolean>)

    const allRequiredComplete = tasks
      .filter(t => t.required)
      .every(t => t.completed)

    try {
      const { error } = await supabase
        .from('enrollment_applications')
        .update({
          onboarding_status: {
            tasks: taskStatus,
            notes: notes,
            completed_at: allRequiredComplete ? new Date().toISOString() : null
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', enrollment.id)

      if (error) throw error

      alert("온보딩 상태가 업데이트되었습니다.")

      // If all required tasks are complete, optionally update status
      if (allRequiredComplete) {
        alert("모든 필수 작업이 완료되었습니다! 🎉")
      }
    } catch (error) {
      console.error('Error saving onboarding status:', error)
      alert("저장에 실패했습니다.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!enrollment) {
    return (
      <div className="text-center py-8">
        <p>신청 정보를 찾을 수 없습니다.</p>
      </div>
    )
  }

  const completedTasks = tasks.filter(t => t.completed).length
  const totalTasks = tasks.length
  const requiredTasks = tasks.filter(t => t.required).length
  const completedRequiredTasks = tasks.filter(t => t.required && t.completed).length
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const tasksByCategory = {
    contract: tasks.filter(t => t.category === 'contract'),
    payment: tasks.filter(t => t.category === 'payment'),
    equipment: tasks.filter(t => t.category === 'equipment'),
    training: tasks.filter(t => t.category === 'training'),
    service: tasks.filter(t => t.category === 'service')
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/admin/enrollments/${enrollment.id}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            돌아가기
          </Button>
          <div>
            <h1 className="text-2xl font-bold">온보딩 체크리스트</h1>
            <p className="text-gray-600">
              {enrollment.business_name} - {enrollment.representative_name}
            </p>
          </div>
        </div>
        <Badge variant={enrollment.status === 'approved' ? 'success' : 'secondary'}>
          {enrollment.status}
        </Badge>
      </div>

      {/* Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle>진행 상황</CardTitle>
          <CardDescription>
            전체 {totalTasks}개 작업 중 {completedTasks}개 완료
            (필수: {completedRequiredTasks}/{requiredTasks})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>{Math.round(progress)}% 완료</span>
            {completedRequiredTasks === requiredTasks ? (
              <span className="text-green-600 font-medium">✅ 모든 필수 작업 완료</span>
            ) : (
              <span className="text-orange-600">
                필수 작업 {requiredTasks - completedRequiredTasks}개 남음
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Task Categories */}
      <div className="grid gap-6">
        {/* Contract Tasks */}
        {tasksByCategory.contract.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                계약 관리
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasksByCategory.contract.map(task => (
                <TaskItem key={task.id} task={task} onToggle={toggleTask} />
              ))}
            </CardContent>
          </Card>
        )}

        {/* Payment Tasks */}
        {tasksByCategory.payment.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                결제 및 정산
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasksByCategory.payment.map(task => (
                <TaskItem key={task.id} task={task} onToggle={toggleTask} />
              ))}
            </CardContent>
          </Card>
        )}

        {/* Equipment Tasks */}
        {tasksByCategory.equipment.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                장비 설치
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasksByCategory.equipment.map(task => (
                <TaskItem key={task.id} task={task} onToggle={toggleTask} />
              ))}
            </CardContent>
          </Card>
        )}

        {/* Training Tasks */}
        {tasksByCategory.training.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                교육
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasksByCategory.training.map(task => (
                <TaskItem key={task.id} task={task} onToggle={toggleTask} />
              ))}
            </CardContent>
          </Card>
        )}

        {/* Service Activation */}
        {tasksByCategory.service.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                서비스 활성화
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasksByCategory.service.map(task => (
                <TaskItem key={task.id} task={task} onToggle={toggleTask} />
              ))}
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>관리자 노트</CardTitle>
            <CardDescription>
              온보딩 과정에서 필요한 메모나 특이사항을 기록하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="온보딩 관련 메모..."
              rows={4}
              className="w-full"
            />
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          size="lg"
          onClick={saveOnboardingStatus}
          disabled={saving}
        >
          {saving ? "저장 중..." : "상태 저장"}
        </Button>
      </div>
    </div>
  )
}

// Task Item Component
function TaskItem({
  task,
  onToggle
}: {
  task: OnboardingTask
  onToggle: (id: string) => void
}) {
  const Icon = task.icon

  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <Checkbox
        id={task.id}
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
        className="mt-1"
      />
      <div className="flex-1">
        <Label
          htmlFor={task.id}
          className={`flex items-center gap-2 cursor-pointer ${
            task.completed ? 'line-through text-gray-500' : ''
          }`}
        >
          <Icon className="w-4 h-4" />
          <span className="font-medium">{task.label}</span>
          {task.required && (
            <Badge variant="outline" className="text-xs">
              필수
            </Badge>
          )}
        </Label>
        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
      </div>
      <div className="mt-1">
        {task.completed ? (
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        ) : task.required ? (
          <AlertCircle className="w-5 h-5 text-orange-500" />
        ) : (
          <Clock className="w-5 h-5 text-gray-400" />
        )}
      </div>
    </div>
  )
}