"use client"

import { useState, useMemo } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useIsMobile } from "@/hooks/use-mobile"

// 창업 안전지수 진단 문항
const questions = [
  { 
    id: "cost_awareness", 
    text: "창업 준비하면서 \"내가 얼마를 쓰고 있는지\" 정확히 알고 계신가요?",
    lowLabel: "전혀 모른다",
    highLabel: "정확히 안다"
  },
  { 
    id: "failure_fear", 
    text: "주변에서 \"장사 안 돼서 망했다\"는 얘기 들을 때마다 \"나도 그럴까봐\" 무서운가요?",
    lowLabel: "매우 무섭다",
    highLabel: "전혀 안 무섭다"
  },
  { 
    id: "price_verification", 
    text: "인테리어 견적이나 장비 가격 볼 때 \"이게 맞는 가격인가?\" 의심 될 때, 확인할 방법이 있으신가요?",
    lowLabel: "전혀 모른다",
    highLabel: "확인 가능하다"
  },
  { 
    id: "staff_concern", 
    text: "\"알바 구하기 힘들다\"는 얘기에 \"나는 어떻게 하지?\" 막막한가요?",
    lowLabel: "매우 막막하다",
    highLabel: "대책이 있다"
  },
  { 
    id: "support_system", 
    text: "창업 준비하면서 \"이거 물어볼 사람이 없네\" 하고 혼자 끙끙 앓은 적이 있나요?",
    lowLabel: "완전 혼자다",
    highLabel: "도움받을 곳 많다"
  },
]

export function TestSafety() {
  const isMobile = useIsMobile()
  
  // 상태 관리 - 마치 TV 리모컨으로 채널을 바꾸듯 즉시 전환
  const [scores, setScores] = useState<Record<string, number>>({})
  const [currentQuestion, setCurrentQuestion] = useState(0) // 현재 질문 번호
  const [isCompleted, setIsCompleted] = useState(false) // 테스트 완료 여부

  // 총점 계산 - 100점 만점으로 변환 (5-25점 → 0-100점)
  const totalScore = useMemo(() => {
    const values = Object.values(scores)
    if (values.length !== questions.length) return null
    const rawTotal = values.reduce((sum, score) => sum + score, 0)
    // 5점~25점을 0점~100점으로 변환: (현재점수 - 5) / 20 * 100
    return Math.round(((rawTotal - 5) / 20) * 100)
  }, [scores])

  // 점수 변경 및 즉시 다음 질문으로 이동 - 마치 엘리베이터 버튼을 누르면 바로 이동하듯
  const handleScoreChange = (value: string) => {
    const questionId = questions[currentQuestion].id
    const newScores = { ...scores, [questionId]: Number(value) }
    setScores(newScores)

    // 500ms 후 자동으로 다음 질문으로 이동 (사용자에게 선택 확인 시간 제공)
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
      } else {
        // 마지막 질문이면 완료 상태로 변경
        setIsCompleted(true)
      }
    }, 500)
  }

  // 처음부터 다시 시작
  const restartTest = () => {
    setScores({})
    setCurrentQuestion(0)
    setIsCompleted(false)
  }

  const currentQ = questions[currentQuestion]

  return (
    <motion.section 
      className="py-12 md:py-16 bg-gray-50"
      initial={{ opacity: 0, y: 50 }} // 초기상태: 투명하고 아래쪽에 위치 (마치 땅속에서 싹이 돋기 전처럼)
      whileInView={{ opacity: 1, y: 0 }} // 스크롤 시: 선명하게 나타나며 제자리로 (새싹이 자라나는 것처럼)
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }} // 30% 보이면 트리거
    >
      <div className="container mx-auto px-4 max-w-2xl">
        {/* 상단 카피 영역 */}
        <motion.div 
          className="text-left mb-12 ml-4"
          initial={{ opacity: 0, x: -30 }} // 왼쪽에서 슬라이드 인 (문이 열리는 것처럼)
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.8 }}
        >
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
            하나라도 해당 한다면<br />대비 하셔야 합니다.
          </h2>
          <div className="flex justify-between items-center mb-6">
            <p className="text-red-800">안전지수 테스트</p>
            <p className="text-sm text-gray-500 mr-4">직접 체크해보세요.</p>
          </div>
        </motion.div>

        {!isCompleted ? (
          <div className="space-y-8">
            {/* 현재 질문 - 질문이 바뀔 때마다 플롯 애니메이션 */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentQuestion} // 질문번호가 키로 사용되어 질문이 바뀔 때마다 새로운 애니메이션 실행
                className="text-left space-y-8 ml-4"
                initial={{ opacity: 0, y: 30, scale: 0.95 }} // 초기: 투명하고 아래쪽에서 살짝 작게 (마치 선물상자에서 나오는 것처럼)
                animate={{ opacity: 1, y: 0, scale: 1 }} // 등장: 선명해지며 원래 크기로 (선물상자가 열리는 것처럼)
                exit={{ opacity: 0, y: -20, scale: 0.95 }} // 퇴장: 투명해지며 위로 사라짐 (구름처럼 사라지는 것처럼)
                transition={{ 
                  duration: isMobile ? 0.3 : 0.5, // 모바일: 빠르게, 데스크탑: 부드럽게
                  ease: "easeOut",
                  scale: { duration: isMobile ? 0.2 : 0.3 } // 모바일에서 크기 변화도 더 빠르게
                }}
              >
                <h3 className="text-base font-semibold leading-relaxed text-gray-800">
                  {currentQuestion + 1}. {currentQ.text}
                </h3>

                {/* 가로 배치 선택지 - 둥근 직사각형 디자인 */}
                                  <motion.div 
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }} // 선택지는 질문보다 조금 늦게 등장
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: isMobile ? 0.2 : 0.4, // 모바일: 빠르게, 데스크탑: 부드럽게
                      delay: isMobile ? 0.1 : 0.2, // 모바일에서 더 빠른 등장
                      ease: "easeOut" 
                    }}
                  >
                  <RadioGroup
                    onValueChange={handleScoreChange}
                    className="flex justify-center space-x-2 px-4"
                  >
                    {[1, 2, 3, 4, 5].map((score, index) => (
                      <motion.div 
                        key={score} 
                        className="relative"
                        initial={{ opacity: 0, scale: 0.8 }} // 각 버튼이 작게 시작해서 커짐 (팝콘이 터지는 것처럼)
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          duration: isMobile ? 0.2 : 0.3, // 모바일: 빠르게, 데스크탑: 부드럽게
                          delay: isMobile ? 0.15 + (index * 0.05) : 0.3 + (index * 0.1), // 모바일에서 더 빠르고 간격 좁게
                          ease: "easeOut" 
                        }}
                      >
                        <RadioGroupItem 
                          value={score.toString()} 
                          id={`q${currentQuestion}-score-${score}`}
                          className="sr-only"
                        />
                        <Label 
                          htmlFor={`q${currentQuestion}-score-${score}`}
                          className="flex items-center justify-center w-12 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer transition-all duration-200 border-2 border-transparent hover:border-gray-300"
                        >
                          <span className="text-sm font-medium text-gray-700">
                            {score}
                          </span>
                        </Label>
                      </motion.div>
                    ))}
                  </RadioGroup>
                  
                  {/* 양쪽 끝 라벨 */}
                  <div className="flex items-center justify-between text-xs text-gray-500 px-4">
                    <span>{currentQ.lowLabel}</span>
                    <div className="flex-1 h-px bg-gray-300 mx-4"></div>
                    <span>{currentQ.highLabel}</span>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* 진행률 표시 - 하단에 작게 */}
            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }} // 진행률은 마지막에 등장
            >
              <span className="text-xs text-gray-400">{currentQuestion + 1} / {questions.length}</span>
            </motion.div>
          </div>
        ) : (
          // 결과 표시 - 점수와 버튼을 세로로 배치, 드라마틱한 등장 애니메이션
          <motion.div 
            className="flex flex-col items-center gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="px-8 py-6 rounded-2xl"
              style={{ backgroundColor: '#148777' }}
              initial={{ opacity: 0, scale: 0.3, y: 50 }} // 작고 투명한 상태에서 아래쪽에 위치 (마치 보물상자에서 나오는 보석처럼)
              animate={{ opacity: 1, scale: 1, y: 0 }} // 크고 선명하게 제자리로 (보석이 반짝이며 등장하는 것처럼)
              transition={{ 
                duration: isMobile ? 0.4 : 0.8, // 모바일: 빠르게, 데스크탑: 부드럽게
                delay: isMobile ? 0.1 : 0.3, // 모바일에서 더 빠른 등장
                ease: "easeOut",
                scale: { 
                  type: "spring", // 스프링 애니메이션으로 통통 튀는 느낌
                  stiffness: isMobile ? 300 : 200, // 모바일에서 더 빠른 스프링
                  damping: 15
                }
              }}
            >
              <motion.div 
                className="text-5xl font-bold text-white"
                initial={{ opacity: 0, scale: 0.5 }} // 점수 숫자는 별도로 애니메이션
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: isMobile ? 0.3 : 0.5, // 모바일: 빠르게, 데스크탑: 부드럽게
                  delay: isMobile ? 0.3 : 0.8, // 모바일에서 더 빠른 등장
                  ease: "easeOut"
                }}
              >
                {totalScore}점
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }} // 버튼은 마지막에 아래에서 등장 (커튼콜처럼)
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: isMobile ? 0.3 : 0.5, // 모바일: 빠르게, 데스크탑: 부드럽게
                delay: isMobile ? 0.5 : 1.2, // 모바일에서 훨씬 빠른 등장
                ease: "easeOut"
              }}
            >
              <Button 
                onClick={restartTest} 
                variant="outline"
                className="text-sm"
              >
                다시 테스트하기
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.section>
  )
}
