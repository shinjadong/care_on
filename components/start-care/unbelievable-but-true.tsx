"use client"

import { motion } from "framer-motion"
import Image from "next/image"

// 여론을 보여주는 카드 데이터 (뉴스, 통계, 여론조사 등) - 14개
const opinionCards = [
  // 첫 번째 줄 (7개)
  {
    id: 1,
    title: "창업 실패율 통계",
    content: "1년 내 폐업률 60%",
    image: "https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%EC%8A%AC%EB%9D%BC%EC%9D%B4%EB%94%A9%20%EC%B9%B4%EB%93%9C01",
    row: 0,
    position: 0
  },
  {
    id: 2,
    title: "뉴스 헤드라인",
    content: "자영업자 생존율 최악",
    image: "https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%EC%8A%AC%EB%9D%BC%EC%9D%B4%EB%94%A9%20%EC%B9%B4%EB%93%9C02",
    row: 0,
    position: 1
  },
  {
    id: 3,
    title: "여론조사 결과",
    content: "창업 두려움 80%",
    image: "https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%EC%8A%AC%EB%9D%BC%EC%9D%B4%EB%94%A9%20%EC%B9%B4%EB%93%9C03",
    row: 0,
    position: 2
  },
  {
    id: 4,
    title: "경제 분석",
    content: "소상공인 위기 심화",
    image: "https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%EC%8A%AC%EB%9D%BC%EC%9D%B4%EB%94%A9%20%EC%B9%B4%EB%93%9C04",
    row: 0,
    position: 3
  },
  {
    id: 5,
    title: "업계 동향",
    content: "신규 창업 급감",
    image: "https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%EC%8A%AC%EB%9D%BC%EC%9D%B4%EB%94%A9%20%EC%B9%B4%EB%93%9C05",
    row: 0,
    position: 4
  },
  {
    id: 6,
    title: "금융기관 발표",
    content: "대출 심사 강화",
    image: "https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%EC%8A%AC%EB%9D%BC%EC%9D%B4%EB%94%A9%20%EC%B9%B4%EB%93%9C06",
    row: 0,
    position: 5
  },
  {
    id: 7,
    title: "시장 전망",
    content: "경기 침체 장기화",
    image: "https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%EC%8A%AC%EB%9D%BC%EC%9D%B4%EB%94%A9%20%EC%B9%B4%EB%93%9C07",
    row: 0,
    position: 6
  },
  // 두 번째 줄 (7개)
  {
    id: 8,
    title: "정부 발표",
    content: "자영업 지원 부족",
    image: "https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%EC%8A%AC%EB%9D%BC%EC%9D%B4%EB%94%A9%20%EC%B9%B4%EB%93%9C08",
    row: 1,
    position: 0
  },
  {
    id: 9,
    title: "전문가 의견",
    content: "준비 없는 창업 위험",
    image: "https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%EC%8A%AC%EB%9D%BC%EC%9D%B4%EB%94%A9%20%EC%B9%B4%EB%93%9C09",
    row: 1,
    position: 1
  },
  {
    id: 10,
    title: "실제 사례",
    content: "90% 예상보다 빨리 실패",
    image: "https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%EC%8A%AC%EB%9D%BC%EC%9D%B4%EB%94%A9%20%EC%B9%B4%EB%93%9C10",
    row: 1,
    position: 2
  },
  {
    id: 11,
    title: "통계청 자료",
    content: "소상공인 감소율 증가",
    image: "https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%EC%8A%AC%EB%9D%BC%EC%9D%B4%EB%94%A9%20%EC%B9%B4%EB%93%9C11",
    row: 1,
    position: 3
  },
  {
    id: 12,
    title: "업계 보고서",
    content: "자금난으로 인한 폐업",
    image: "https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%EC%8A%AC%EB%9D%BC%EC%9D%B4%EB%94%A9%20%EC%B9%B4%EB%93%9C12",
    row: 1,
    position: 4
  },
  {
    id: 13,
    title: "언론 보도",
    content: "창업 성공률 최저치",
    image: "https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%EC%8A%AC%EB%9D%BC%EC%9D%B4%EB%94%A9%20%EC%B9%B4%EB%93%9C13",
    row: 1,
    position: 5
  },
  {
    id: 14,
    title: "조사 결과",
    content: "창업 후회 비율 급증",
    image: "https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%EC%8A%AC%EB%9D%BC%EC%9D%B4%EB%94%A9%20%EC%B9%B4%EB%93%9C14",
    row: 1,
    position: 6
  }
]

// Helper to create a duplicated array for seamless looping
const createLoopedArray = (arr: typeof opinionCards, row: number) => {
  const filtered = arr.filter(card => card.row === row);
  return [...filtered, ...filtered];
};

export function UnbelievableButTrue() {
  // Card width and gap settings.
  // Using a fixed value for calculation simplicity.
  // w-80 is 320px, gap-3 is 12px. Total = 332px.
  // md:w-96 is 384px, md:gap-4 is 16px. Total = 400px.
  // We'll use an average or a base value. The original code used 336. Let's stick with that.
  const cardStep = 336;

  const topRowCards = createLoopedArray(opinionCards, 0);
  const bottomRowCards = createLoopedArray(opinionCards, 1);

  // Calculate the total width of the original set of cards (not the doubled one)
  const topRowWidth = cardStep * (topRowCards.length / 2);
  const bottomRowWidth = cardStep * (bottomRowCards.length / 2);

  // Animation duration: 3 seconds per card
  const topRowDuration = (topRowCards.length / 2) * 3; // 7 * 3 = 21 seconds
  const bottomRowDuration = (bottomRowCards.length / 2) * 3; // 7 * 3 = 21 seconds

  return (
    <section className="bg-gradient-to-b from-gray-100 to-gray-300 py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto">
        {/* Main Title */}
        <div className="text-center mb-16 px-4">
          <p 
            className="font-black text-3xl md:text-4xl lg:text-5xl leading-tight bg-gradient-to-b from-red-600 via-red-700 to-red-900 bg-clip-text text-transparent"
            style={{fontFamily: 'Noto Serif KR, serif'}}
          >
            "1년 내 폐업이라구요?"
            <br />
            <br />
          </p>
        </div>

        {/* Card Slider Container */}
        <div className="relative flex flex-col gap-6">
          {/* First Row - moves left */}
          <motion.div
            className="flex gap-3 md:gap-4"
            animate={{ x: [0, -topRowWidth] }}
            transition={{
              duration: topRowDuration,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {topRowCards.map((card, index) => (
              <motion.div
                key={`${card.id}-${index}`}
                className="flex-shrink-0 w-80 md:w-96"
                whileHover={{
                  scale: 1.02,
                  y: -5,
                  transition: { duration: 0.2 },
                }}
              >
                <div className="h-56 md:h-72 rounded-lg shadow-lg overflow-hidden bg-gray-800">
                  <div className="relative w-full h-full">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(max-width: 768px) 320px, 384px"
                      className="object-cover"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Second Row - moves right */}
          <motion.div
            className="flex gap-3 md:gap-4"
            // To make it move right, we start from a negatively offset position
            // and animate to the end of the original set.
            // We need to shift the whole container left by the width of the card set.
            // A simpler way is to animate from a negative value to 0.
            animate={{ x: [-bottomRowWidth, 0] }}
            transition={{
              duration: bottomRowDuration,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {bottomRowCards.map((card, index) => (
              <motion.div
                key={`${card.id}-${index}`}
                className="flex-shrink-0 w-80 md:w-96"
                whileHover={{
                  scale: 1.02,
                  y: -5,
                  transition: { duration: 0.2 },
                }}
              >
                <div className="h-56 md:h-72 rounded-lg shadow-lg overflow-hidden bg-gray-800">
                  <div className="relative w-full h-full">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(max-width: 768px) 320px, 384px"
                      className="object-cover"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom Message */}
        <motion.div
          className="text-center mt-16 px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <p className="text-gray-800 text-lg md:text-xl font-bold">
            <br />
            <br />
            믿기지 않지만, 이것이 <span className="text-red-800 font-bold">현실</span>입니다.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
