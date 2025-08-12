"use client"
import type React from "react"
import Link from "next/link"
import { ChevronLeft, Check } from "lucide-react"
import { StreamingText } from "./streaming-text-ui"
import { useCCTVQuoteChat, FORM_STEPS, type Message, type DynamicLoadingContent } from "./use-cctv-quote-chat"

const MessageContent = ({ message }: { message: Message }) => {
  switch (message.type) {
    case "user":
      return (
        <div className="bg-primary text-white rounded-lg p-3 shadow-sm max-w-[80%] break-words">
          <p>{message.content as string}</p>
        </div>
      )
    case "dynamic-loading":
      const content = message.content as DynamicLoadingContent
      return (
        <div className="bg-gray-800 text-white rounded-lg p-4 shadow-lg max-w-[85%] w-full">
          <div className="flex items-center space-x-3 mb-4">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-white"></div>
            <p className="font-medium">{content.text}</p>
          </div>
          <div className="space-y-2">
            {content.items.map((item, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 transition-opacity duration-500 ${item.done ? "opacity-100" : "opacity-50"}`}
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  {item.done ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      )
    case "quote":
      return (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 shadow-md max-w-[90%] break-words border border-green-200">
          <div className="prose prose-sm max-w-none">
            {(message.content as string).split("\n").map((line, index) => {
              if (line.startsWith("🎉 **"))
                return (
                  <h3 key={index} className="text-lg font-bold text-green-700 mb-3">
                    {line.replace(/\*\*/g, "")}
                  </h3>
                )
              if (
                line.startsWith("📋 **") ||
                line.startsWith("💰 **") ||
                line.startsWith("✨ **") ||
                line.startsWith("⚡ **")
              )
                return (
                  <h4 key={index} className="text-md font-semibold text-gray-800 mt-4 mb-2">
                    {line.replace(/\*\*/g, "")}
                  </h4>
                )
              if (line.startsWith("• **"))
                return (
                  <p key={index} className="text-primary font-bold text-lg my-1">
                    {line.replace(/\*\*/g, "")}
                  </p>
                )
              if (line.startsWith("•"))
                return (
                  <p key={index} className="text-gray-700 my-1">
                    {line}
                  </p>
                )
              if (line.trim())
                return (
                  <p key={index} className="text-gray-700 my-1">
                    {line}
                  </p>
                )
              return <br key={index} />
            })}
          </div>
        </div>
      )
    default:
      return null
  }
}

const SystemMessage = ({
  message,
  isLast,
  isStreaming,
  onStreamFinish,
  selectedMultiples,
  onOptionSelect,
  onMultipleSubmit,
  onTextInput,
}: {
  message: Message
  isLast: boolean
  isStreaming: boolean
  onStreamFinish: () => void
  selectedMultiples: string[]
  onOptionSelect: (option: string, field?: string) => void
  onMultipleSubmit: (field: string) => void
  onTextInput: (e: React.FormEvent<HTMLFormElement>, field?: string) => void
}) => {
  const currentStepInfo = FORM_STEPS.find((s) => s.field === message.field)
  const showOptions = message.options && message.options.length > 0 && (!isLast || !isStreaming)
  const showTextInput = message.field && !message.options?.length && (!isLast || !isStreaming)

  return (
    <div className="bg-white rounded-lg p-3 shadow-sm max-w-[80%] break-words">
      {isLast && isStreaming ? (
        <StreamingText text={message.content as string} speed={20} onFinished={onStreamFinish} />
      ) : (
        <div dangerouslySetInnerHTML={{ __html: message.content as string }} />
      )}
      {showOptions && (
        <div className="mt-3 space-y-2">
          {message.options!.map((option, index) => {
            const isMultiple = currentStepInfo?.multiple
            const isSelected = selectedMultiples.includes(option)
            return (
              <button
                key={`${message.id}-opt-${index}`}
                onClick={() => onOptionSelect(option, message.field)}
                className={`block w-full text-left p-2 rounded-lg transition-colors ${isMultiple ? (isSelected ? "bg-primary text-white" : "bg-gray-100 hover:bg-gray-200") : "bg-gray-100 hover:bg-gray-200"}`}
              >
                {isMultiple && <span className="mr-2">{isSelected ? "✅" : "☐"}</span>}
                {option}
              </button>
            )
          })}
          {currentStepInfo?.multiple && selectedMultiples.length > 0 && (
            <button
              onClick={() => onMultipleSubmit(message.field!)}
              className="w-full bg-primary text-white p-3 rounded-lg hover:bg-primary/90 font-medium"
            >
              선택 완료 ({selectedMultiples.length}개)
            </button>
          )}
        </div>
      )}
      {showTextInput && (
        <form onSubmit={(e) => onTextInput(e, message.field)} className="mt-3">
          <input
            type={currentStepInfo?.inputType || "text"}
            className="w-full p-2 border rounded-lg"
            placeholder={currentStepInfo?.placeholder || "내용을 입력해주세요"}
            required
            autoFocus
          />
          <button type="submit" className="mt-2 w-full bg-primary text-white p-2 rounded-lg hover:bg-primary/90">
            다음
          </button>
        </form>
      )}
    </div>
  )
}

const CCTVRentalQuote = () => {
  const {
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
  } = useCCTVQuoteChat()

  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center space-x-2 justify-center mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-white">C</span>
            </div>
            <span className="text-xl font-bold text-gray-900">케어온</span>
          </div>
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-6 text-primary">견적 요청이 완료되었습니다!</h1>
          {formData.installationQuantities && (
            <div className="bg-blue-50 rounded-lg p-4 mb-4 text-left">
              <h3 className="font-semibold text-gray-800 mb-2">📹 선택하신 CCTV 설치 정보</h3>
              <div className="space-y-1 text-sm text-gray-600">
                {Object.entries(formData.installationQuantities).map(([location, quantity]) => (
                  <div key={location} className="flex justify-between">
                    <span>{location}</span>
                    <span className="font-medium text-primary">{quantity}대</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2 flex justify-between font-semibold text-primary">
                  <span>총 설치 수량</span>
                  <span>{Object.values(formData.installationQuantities).reduce((sum, qty) => sum + qty, 0)}대</span>
                </div>
              </div>
            </div>
          )}
          {formData.calculatedPrice && (
            <div className="bg-green-50 rounded-lg p-4 mb-4 text-left">
              <h3 className="font-semibold text-gray-800 mb-2">💰 견적 정보</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>월 렌탈비</span>
                  <span className="font-bold text-green-600 text-lg">
                    {formData.calculatedPrice.toLocaleString()}원
                  </span>
                </div>
                {formData.finalQuoteMethod && (
                  <div className="border-t pt-2 mt-2">
                    <div className="font-medium text-gray-700">선택하신 진행 방식:</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {formData.finalQuoteMethod.includes("다이렉트")
                        ? "💻 다이렉트 접수 - 온라인 바로 가입"
                        : "🏠 상세 실사 견적 - 전문가 방문 상담"}
                    </div>
                  </div>
                )}
                {formData.contactMethod && (
                  <div className="border-t pt-2 mt-2">
                    <div className="font-medium text-gray-700">연락 방법:</div>
                    <div className="text-sm text-gray-600 mt-1">{formData.contactMethod}</div>
                  </div>
                )}
              </div>
            </div>
          )}
          <p className="text-lg mb-4">
            CCTV 렌탈 전문 상담사가 <strong>24시간 이내</strong>에 연락드립니다.
          </p>
          <p className="text-sm text-gray-600 mb-8">
            • 맞춤형 렌탈 플랜 제안
            <br />• 현장 방문 상담 일정 조율
            <br />• 설치 및 관리 서비스 안내
          </p>
          <div className="space-y-3">
            <Link
              href="/products/cctv"
              className="block bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-8 rounded-lg transition duration-300"
            >
              CCTV 상품 더보기
            </Link>
            <Link
              href="/"
              className="block bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-gray-50">
      <header className="bg-white p-4 flex items-center border-b sticky top-0 z-10">
        <Link href="/" className="mr-2">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div className="flex items-center space-x-2 flex-1 justify-center">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
            <span className="text-xs font-bold text-white">C</span>
          </div>
          <h1 className="text-lg font-semibold">CCTV 무료 설치</h1>
        </div>
        <div className="w-6"></div>
      </header>
      <div className="bg-white px-4 py-2 border-b">
        <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
          <div
            className="bg-primary h-full rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-right text-xs text-primary mt-1">{progress}%</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollBehavior: "smooth" }}>
        {messages.map((message, index) => (
          <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
            {message.type === "system" ? (
              <SystemMessage
                message={message}
                isLast={index === messages.length - 1}
                isStreaming={isLastMessageStreaming}
                onStreamFinish={() => setIsLastMessageStreaming(false)}
                selectedMultiples={selectedMultiples}
                onOptionSelect={handleOptionSelect}
                onMultipleSubmit={handleMultipleSubmit}
                onTextInput={handleTextInput}
              />
            ) : (
              <MessageContent message={message} />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {!isSubmitting && !isSubmitted && FORM_STEPS[FORM_STEPS.length - 1].field === 'agreeTerms' && (
        <div className="bg-white p-4 border-t sticky bottom-0 z-10">
          <button
            onClick={() => handleSubmit()}
            className="w-full bg-primary text-white p-3 rounded-lg font-medium hover:bg-primary/90 disabled:bg-gray-300"
            disabled={isSubmitting || !formData.contactName || !formData.phone}
          >
            {isSubmitting ? "처리 중..." : "무료 견적 요청하기"}
          </button>
        </div>
      )}
    </div>
  )
}

export default CCTVRentalQuote
