"use client"
import { useState, useRef, useEffect, useCallback } from "react"
import type React from "react"

import { nanoid } from "nanoid"

// Type Definitions
export type FormData = {
  installationPlace?: string
  businessType?: string
  businessTypeOther?: string
  businessSize?: string
  installationLocations?: string[]
  installationLocationOther?: string
  installationQuantities?: { [location: string]: number }
  businessLocation?: string
  quoteMethod?: string
  businessName?: string
  contactName?: string
  phone?: string
  agreeTerms?: string[]
  finalQuoteMethod?: string
  contactMethod?: string
  calculatedPrice?: number
}

export type MessageType = "system" | "user" | "option" | "loading" | "quote" | "dynamic-loading"

export type DynamicLoadingContent = {
  text: string
  items: { text: string; done: boolean }[]
}

export type Message = {
  id: string
  type: MessageType
  content: string | DynamicLoadingContent
  options?: string[]
  field?: string
}

export type QuantitySelectionState = {
  currentLocationIndex: number
  selectedQuantities: { [location: string]: number }
  locations: string[]
}

// Form Steps Configuration
export const FORM_STEPS = [
  {
    question: "안녕하세요! 케어온 CCTV 무료견적을 시작합니다. 🎥<br/>CCTV를 어디에 설치하실 예정인가요?",
    field: "installationPlace",
    options: ["🏪 매장", "🏠 주택", "🏢 오피스텔", "🎓 학교", "🏥 병원"],
  },
  {
    question: "매장의 업종을 선택해주세요.",
    field: "businessType",
    options: ["🛒 편의점", "🍕 음식점", "🤖 무인매장", "☕ 카페", "📝 기타 (직접입력)"],
    conditional: (data: FormData) => data.installationPlace === "🏪 매장",
  },
  {
    question: "기타 업종을 직접 입력해주세요.",
    field: "businessTypeOther",
    options: [],
    inputType: "text",
    placeholder: "예: 서점, 미용실, 세탁소 등",
    conditional: (data: FormData) => data.businessType === "📝 기타 (직접입력)",
  },
  {
    question: "사업장 규모를 선택해주세요. (평수 기준)",
    field: "businessSize",
    options: ["📐 10평 이하", "📏 10평~20평", "📋 20평~50평", "🏭 50평 이상"],
  },
  {
    question: "CCTV 설치가 필요한 위치를 모두 체크해주세요. (중복선택 가능)",
    field: "installationLocations",
    options: [
      "💰 카운터/계산대",
      "🚪 입구/출입구",
      "🌳 실외/주차장",
      "🍽️ 홀/고객석",
      "🍳 주방/작업장",
      "📦 창고/보관실",
      "🚻 화장실 앞",
      "📱 기타위치",
    ],
    multiple: true,
  },
  {
    question: "기타 설치 위치를 직접 입력해주세요.",
    field: "installationLocationOther",
    options: [],
    inputType: "text",
    placeholder: "예: 복도, 계단, 사무실 등",
    conditional: (data: FormData) => data.installationLocations?.includes("📱 기타위치"),
  },
  {
    question: "", // 동적으로 설정됨
    field: "installationQuantities",
    options: ["1대", "2대", "3대", "4대 이상"],
    quantitySelection: true,
    conditional: (data: FormData) => (data.installationLocations?.length || 0) > 0,
  },
  {
    question: "사업장 지역을 알려주세요.",
    field: "businessLocation",
    options: [
      "서울특별시",
      "부산광역시",
      "대구광역시",
      "인천광역시",
      "광주광역시",
      "대전광역시",
      "울산광역시",
      "세종특별자치시",
      "경기도",
      "강원특별자치도",
      "충청북도",
      "충청남도",
      "전북특별자치도",
      "전라남도",
      "경상북도",
      "경상남도",
      "제주특별자치도",
    ],
    conditional: (data: FormData) => !!data.installationQuantities,
  },
  {
    question: "", // 동적으로 설정됨
    field: "quoteCalculation",
    isQuoteCalculation: true,
    conditional: (data: FormData) => !!data.businessLocation,
  },
  {
    question: "어떤 방식으로 진행하시겠어요?",
    field: "finalQuoteMethod",
    options: [
      "💻 다이렉트 접수 요청 - 온라인으로 바로 가입",
      "🏠 상세 실사 견적 요청 - 전문가 방문 (현재 무료 이벤트 중!)",
    ],
    conditional: (data: FormData) => !!data.calculatedPrice,
  },
  {
    question: "어떤 방법으로 연락받으시겠어요?",
    field: "contactMethod",
    options: [
      "📱 문자 (SMS) - 빠른 연락",
      "💬 카카오톡 - 편리한 상담",
      "📞 전화로 받기 - 자세한 상담",
      "☎️ 직접 전화걸기 - 즉시 상담",
    ],
    conditional: (data: FormData) => !!data.finalQuoteMethod,
  },
  { question: "성함을 알려주세요.", field: "contactName", options: [], inputType: "text", placeholder: "홍길동" },
  { question: "연락처를 알려주세요.", field: "phone", options: [], inputType: "tel", placeholder: "010-1234-5678" },
  {
    question: "개인정보 처리방침 및 마케팅 활용에 동의해주세요.",
    field: "agreeTerms",
    options: ["✅ 개인정보 처리방침 동의 (필수)", "📧 마케팅 정보 수신 동의 (선택)"],
    multiple: true,
  },
]

export const useCCTVQuoteChat = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [messages, setMessages] = useState<Message[]>([])
  const [formData, setFormData] = useState<FormData>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [selectedMultiples, setSelectedMultiples] = useState<string[]>([])
  const [quantitySelection, setQuantitySelection] = useState<QuantitySelectionState>({
    currentLocationIndex: 0,
    selectedQuantities: {},
    locations: [],
  })
  const [isLastMessageStreaming, setIsLastMessageStreaming] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const addMessage = useCallback(
    (type: MessageType, content: string | DynamicLoadingContent, options: string[] = [], field?: string): string => {
      const messageId = nanoid()
      const newMessage: Message = { id: messageId, type, content, options, field }
      if (type === "system" && typeof content === "string") {
        setIsLastMessageStreaming(true)
      }
      setMessages((prev) => [...prev, newMessage])
      return messageId
    },
    [],
  )

  const findNextValidStep = useCallback((currentStep: number, formData: FormData): number => {
    for (let i = currentStep + 1; i < FORM_STEPS.length; i++) {
      const step = FORM_STEPS[i]
      if (!step.conditional || step.conditional(formData)) {
        return i
      }
    }
    return FORM_STEPS.length
  }, [])

  const goToNextStep = useCallback(
    (data = formData) => {
      const nextStepIndex = findNextValidStep(currentStep, data)
      if (nextStepIndex < FORM_STEPS.length) {
        const step = FORM_STEPS[nextStepIndex]
        setCurrentStep(nextStepIndex)
        setProgress(Math.min(100, Math.round((nextStepIndex / FORM_STEPS.length) * 100)))

        if (step.quantitySelection) {
          const locations = data.installationLocations || []
          const filteredLocations = locations.filter((loc) => loc !== "📱 기타위치")
          if (filteredLocations.length > 0) {
            const newQuantitySelection = {
              currentLocationIndex: 0,
              selectedQuantities: {},
              locations: filteredLocations,
            }
            setQuantitySelection(newQuantitySelection)
            const question = `${filteredLocations[0]}에 몇 대의 CCTV를 설치하시겠어요?`
            addMessage("system", question, step.options || [], step.field)
            return
          }
        }

        if (step.isQuoteCalculation) {
          handleQuoteCalculationWithData(data)
          return
        }

        addMessage("system", step.question, step.options || [], step.field)
      } else {
        handleSubmit(data)
      }
    },
    [currentStep, formData, findNextValidStep, addMessage],
  )

  const handleQuoteCalculationWithData = useCallback(
    async (currentFormData: FormData) => {
      const totalCameras = Object.values(currentFormData.installationQuantities || {}).reduce(
        (sum, qty) => sum + qty,
        0,
      )
      const pricePerCamera = 8500
      const calculatedPrice = totalCameras * pricePerCamera

      const loadingTasks = [
        { text: `[${currentFormData.businessLocation}] 지역 설치 규정 분석`, done: false },
        { text: "CCTV 모델별 성능 및 가격 비교", done: false },
        { text: "KT/SK/LG 통신사 결합 할인 정보 조회", done: false },
        { text: "실시간 부품 재고 및 수급 현황 확인", done: false },
        { text: "가용 설치팀 스케줄 확인 및 매칭", done: false },
      ]

      const loadingMessageId = addMessage("dynamic-loading", {
        text: "최적의 견적을 위해 데이터를 분석 중입니다...",
        items: loadingTasks,
      })

      for (let i = 0; i < loadingTasks.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 500))
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === loadingMessageId) {
              const content = msg.content as DynamicLoadingContent
              const newItems = [...content.items]
              newItems[i].done = true
              return { ...msg, content: { ...content, items: newItems } }
            }
            return msg
          }),
        )
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))

      setMessages((prev) => prev.filter((msg) => msg.id !== loadingMessageId))

      const locationDetails = Object.entries(currentFormData.installationQuantities || {})
        .map(([location, qty]) => `${location}: ${qty}대`)
        .join("\n")

      const quoteMessage = `🎉 **맞춤 견적서가 완성되었습니다!**\n\n📋 **설치 상세 정보**\n${locationDetails}\n\n💰 **예상 견적**\n• CCTV 대수: ${totalCameras}대\n• 대당 렌탈비: ${pricePerCamera.toLocaleString()}원/월\n• **월 렌탈비: ${calculatedPrice.toLocaleString()}원**\n\n✨ **포함 서비스**\n• 전문 설치 및 설정\n• 24시간 모니터링\n• 정기 점검 및 AS\n• 무료 교체 서비스\n\n⚡ **특별 혜택**\n• 첫 달 50% 할인\n• 설치비 무료 (30만원 상당)`
      addMessage("quote", quoteMessage)

      setFormData((prev) => ({ ...prev, calculatedPrice }))

      setTimeout(() => goToNextStep({ ...currentFormData, calculatedPrice }), 2000)
    },
    [addMessage, goToNextStep],
  )

  const handleMultipleSelect = useCallback((option: string) => {
    setSelectedMultiples((prev) => (prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]))
  }, [])

  const handleMultipleSubmit = useCallback(
    (field: string) => {
      if (field === "agreeTerms" && !selectedMultiples.some((item) => item.includes("필수"))) {
        alert("개인정보 처리방침 동의(필수)를 선택해주세요.")
        return
      }
      const updatedFormData = { ...formData, [field]: selectedMultiples }
      setFormData(updatedFormData)
      addMessage("user", selectedMultiples.join(", "))
      setSelectedMultiples([])
      setTimeout(() => goToNextStep(updatedFormData), 500)
    },
    [addMessage, formData, goToNextStep, selectedMultiples],
  )

  const handleQuantitySelect = useCallback(
    (quantity: string) => {
      const filteredLocations = quantitySelection.locations
      const currentLocation = filteredLocations[quantitySelection.currentLocationIndex]
      if (!currentLocation) return

      const quantityNum = quantity === "4대 이상" ? 4 : Number.parseInt(quantity)
      const newSelectedQuantities = { ...quantitySelection.selectedQuantities, [currentLocation]: quantityNum }
      addMessage("user", `${currentLocation}: ${quantity}`)

      const nextLocationIndex = quantitySelection.currentLocationIndex + 1
      setQuantitySelection({
        ...quantitySelection,
        selectedQuantities: newSelectedQuantities,
        currentLocationIndex: nextLocationIndex,
      })

      if (nextLocationIndex < filteredLocations.length) {
        setTimeout(() => {
          const nextLocation = filteredLocations[nextLocationIndex]
          const question = `${nextLocation}에 몇 대의 CCTV를 설치하시겠어요?`
          addMessage("system", question, ["1대", "2대", "3대", "4대 이상"], "installationQuantities")
        }, 500)
      } else {
        const totalQuantity = Object.values(newSelectedQuantities).reduce((sum, qty) => sum + qty, 0)
        const updatedFormData = { ...formData, installationQuantities: newSelectedQuantities }
        setFormData(updatedFormData)
        setTimeout(() => {
          addMessage("user", `✅ 총 ${totalQuantity}대 선택 완료!`)
          setTimeout(() => goToNextStep(updatedFormData), 500)
        }, 500)
      }
    },
    [addMessage, formData, goToNextStep, quantitySelection],
  )

  const handleOptionSelect = useCallback(
    (option: string, field?: string) => {
      if (!field) return
      const currentStepInfo = FORM_STEPS.find((step) => step.field === field)
      if (currentStepInfo?.quantitySelection) {
        handleQuantitySelect(option)
        return
      }
      if (currentStepInfo?.multiple) {
        handleMultipleSelect(option)
        return
      }
      addMessage("user", option)
      const updatedFormData = { ...formData, [field]: option }
      setFormData(updatedFormData)
      setTimeout(() => goToNextStep(updatedFormData), 500)
    },
    [addMessage, formData, goToNextStep, handleMultipleSelect, handleQuantitySelect],
  )

  const handleTextInput = useCallback(
    (e: React.FormEvent<HTMLFormElement>, field?: string) => {
      e.preventDefault()
      const inputElement = (e.target as HTMLFormElement).elements[0] as HTMLInputElement
      const value = inputElement.value.trim()
      if (value && field) {
        const updatedFormData = { ...formData, [field]: value }
        setFormData(updatedFormData)
        addMessage("user", value)
        inputElement.value = ""
        goToNextStep(updatedFormData)
      }
    },
    [addMessage, formData, goToNextStep],
  )

  const handleSubmit = useCallback(
    async (data = formData) => {
      setIsSubmitting(true)
      try {
        const response = await fetch("/api/cctv-quotes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
        const result = await response.json()
        if (!response.ok || !result.success) throw new Error(result.error || "견적 요청 처리 중 오류가 발생했습니다.")
        setIsSubmitted(true)
      } catch (error: any) {
        addMessage("system", `❌ 견적 요청 처리 중 오류가 발생했습니다: ${error.message}\n\n다시 시도해주세요.`)
      } finally {
        setIsSubmitting(false)
      }
    },
    [addMessage, formData],
  )

  useEffect(() => {
    const firstQuestion = {
      id: nanoid(),
      type: "system" as MessageType,
      content: FORM_STEPS[0].question,
      options: FORM_STEPS[0].options,
      field: FORM_STEPS[0].field,
    }
    setMessages([firstQuestion])
    setProgress(Math.min(100, Math.round((0 / FORM_STEPS.length) * 100)))
  }, [])

  return {
    messages,
    formData,
    isSubmitting,
    isSubmitted,
    progress,
    selectedMultiples,
    isLastMessageStreaming,
    messagesEndRef,
    setIsLastMessageStreaming,
    handleOptionSelect,
    handleMultipleSubmit,
    handleTextInput,
    handleSubmit,
  }
}
