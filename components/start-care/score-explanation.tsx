"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useIsMobile } from "@/hooks/use-mobile"

const scoreData = [
  {
    scoreRange: "80-100점",
    stage: "준비된 창업",
    description:
      "좋습니다! 창업 준비가 탄탄하게 되어 있네요.\n\n실패 위험이 낮고, 예상치 못한 상황에도 대처할 준비가 되어 있습니다.\n\n지금처럼만 하시면 됩니다!",
    isWarning: false,
  },
  {
    scoreRange: "60-79점",
    stage: "불안한 출발",
    description:
      "\"될까 말까\" 반반인 상태입니다.\n\n막연한 불안감은 있지만 아직 뭐가 문제인지 모르고 있어요.\n\n많은 초보 사장님들이 이 단계에서 실수를 합니다.\n\n지금 조금만 더 준비하면 안전하게 시작할 수 있습니다.",
    isWarning: true,
  },
  {
    scoreRange: "40-59점",
    stage: "위험한 도박",
    description:
      "지금 상태로 창업하면 \"10명 중 7명\"이 망하는 통계에 들어갑니다.\n\n특히 첫 3개월 안에 \"예상 못한 돈\"이 펑펑 나가서 당황하실 거예요.\n\n- 인테리어 추가 비용 폭탄\n- 생각보다 안 오는 손님\n- 갑자기 그만두는 알바\n\n이런 일이 동시에 터지면... 버티기 힘듭니다.",
    isWarning: true,
  },
  {
    scoreRange: "39점 이하",
    stage: "폐업 예약",
    description:
      "죄송하지만... 지금 상태로는 \"6개월 안에 문 닫을\" 확률이 90%입니다.\n\n창업하면 안 되는 상태인데 용기만으로 뛰어들려고 하시네요.\n\n\"내 전 재산 날리고 빚만 남는\"\n 최악의 시나리오가 기다리고 있습니다.\n\n지금 당장 안전장치부터 만드세요.",
    isWarning: true,
  },
]

export function ScoreExplanation() {
  const isMobile = useIsMobile()
  
  // 모바일: 빠른 애니메이션 (팟!), 데스크탑: 부드러운 애니메이션
  const getTransition = (mobileDuration: number, desktopDuration: number, mobileDelay: number, desktopDelay: number) => ({
    duration: isMobile ? mobileDuration : desktopDuration,
    delay: isMobile ? mobileDelay : desktopDelay,
    ease: "easeOut" as const
  })

  return (
    <motion.section 
      className="bg-gray-100 pt-12 pb-6 text-center"
      initial={{ opacity: 0, y: 50 }} // 전체 섹션이 투명하고 아래쪽에서 시작 (지하에서 솟아오르는 것처럼)
      whileInView={{ opacity: 1, y: 0 }} // 스크롤 시 선명하게 나타나며 제자리로 (신전이 드러나는 것처럼)
      transition={{ duration: 0.4, ease: "easeOut" }} // 0.8초 → 0.4초로 더 빠르게
      viewport={{ once: true, amount: 0.2 }} // 0.3 → 0.2로 더 일찍 트리거
    >
      <div className="container mx-auto px-4">
        <motion.p 
          className="text-2xl font-semibold text-red-800 md:text-4xl"
          initial={{ opacity: 0, y: 30 }} // 경고 메시지가 아래에서 올라옴 (땅에서 솟아오르는 경고처럼)
          whileInView={{ opacity: 1, y: 0 }}
          transition={getTransition(0.15, 0.6, 0.05, 0.2)} // 모바일: 빠르게, 데스크탑: 부드럽게
          viewport={{ once: true, amount: 0.5 }} // 0.8→0.5로 더 일찍 트리거
        >
          60점 이하라면,
        </motion.p>
        <motion.strong 
          className="my-4 block text-4xl font-bold text-gray-900 md:my-6 md:text-7xl"
          initial={{ opacity: 0, y: 30, scale: 0.8 }} // 중요한 문구가 아래에서 올라오며 작게 시작해서 커짐 (땅속에서 보물이 솟아오르는 것처럼)
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            ...getTransition(0.2, 0.7, 0.1, 0.4), // 모바일: 빠르게, 데스크탑: 부드럽게
            scale: { 
              type: "spring", 
              stiffness: isMobile ? 400 : 200, // 모바일에서만 빠른 스프링
              damping: isMobile ? 10 : 12 
            }
          }}
          viewport={{ once: true, amount: 0.5 }} // 0.8→0.5로 더 일찍 트리거
        >
          1년 내 폐업
        </motion.strong>
        <motion.p 
          className="text-3xl font-medium text-gray-600 md:text-4xl"
          initial={{ opacity: 0, y: 20 }} // 마지막 설명이 아래에서 등장 (결론이 드러나는 것처럼)
          whileInView={{ opacity: 1, y: 0 }}
          transition={getTransition(0.15, 0.6, 0.15, 0.7)} // 모바일: 빠르게, 데스크탑: 부드럽게
          viewport={{ once: true, amount: 0.5 }} // 0.8→0.5로 더 일찍 트리거
        >
          <span className="font-bold text-gray-900">위험</span>에 <span className="font-bold text-gray-900">대비</span>해야
          합니다.
        </motion.p>
      </div>
      <motion.div 
        className="container mx-auto px-4 mt-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={getTransition(0.15, 1.0, 0.2, 1.3)} // 모바일: 빠르게, 데스크탑: 부드럽게
        viewport={{ once: true, amount: 0.2 }} // 0.3 → 0.2로 더 일찍 트리거
      >
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {scoreData.map((item, index) => {
            // 위험한 도박(3번째)과 폐업 예약(4번째) 박스인지 확인
            const isDangerousBox = index >= 2;
            
            return (
              <motion.li
                key={index}
                className={cn(
                  "rounded-xl p-8 shadow-md transition-shadow hover:shadow-xl text-left",
                  isDangerousBox 
                    ? "bg-gradient-to-br from-red-900 via-red-800 to-red-900" 
                    : "bg-white"
                )}
                initial={{ 
                  opacity: 0, 
                  y: 80, 
                  scale: 0.9,
                  rotateX: isDangerousBox ? -15 : 0 // 위험한 박스는 살짝 기울어져서 등장 (경고판이 세워지는 것처럼)
                }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  rotateX: 0 
                }}
                transition={{ 
                  duration: isMobile ? (isDangerousBox ? 0.2 : 0.15) : (isDangerousBox ? 0.8 : 0.6), // 모바일: 빠르게, 데스크탑: 부드럽게
                  delay: isMobile ? 0.1 + (index * 0.03) : 1.3 + (index * 0.15), // 모바일: 거의 동시, 데스크탑: 순차적
                  ease: "easeOut",
                  scale: isDangerousBox ? { 
                    type: "spring", 
                    stiffness: isMobile ? 400 : 250, // 모바일에서만 빠른 스프링
                    damping: isMobile ? 12 : 15 
                  } : undefined // 위험한 박스는 스프링 효과로 더 강조
                }}
                whileHover={{ 
                  scale: 1.02, // 호버 시 살짝 확대 (종이가 떠오르는 것처럼)
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                viewport={{ once: true, amount: 0.1 }} // 0.3 → 0.1로 더 일찍 트리거 (스크롤 시 즉각 반응)
              >
                <div className="mb-6">
                  <strong className={cn(
                    "block text-2xl font-bold",
                    isDangerousBox ? "text-white" : "text-[#916C1E]"
                  )}>
                    {item.scoreRange}
                  </strong>
                  <p className={cn(
                    "text-lg font-semibold mt-1",
                    isDangerousBox ? "text-gray-100" : "text-gray-800"
                  )}>
                    {item.stage}
                  </p>
                </div>
                <div>
                  <p className={cn(
                    "whitespace-pre-line leading-relaxed",
                    isDangerousBox ? "text-gray-100" : "text-gray-600"
                  )}>
                    {item.description}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </motion.div>
    </motion.section>
  )
}
