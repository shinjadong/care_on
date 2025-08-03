"use client"

import { motion } from "framer-motion"

export interface Review {
  id: string
  category: string
  business: string
  content: string
  highlight?: string
  rating?: number
  period?: string
}

interface ReviewCardProps {
  review: Review
}

// 카테고리별 색상 테마
const categoryColors = {
  "창업 준비": "bg-blue-100 text-blue-700 border-blue-200",
  "첫 1년": "bg-[#148777]/10 text-[#148777] border-[#148777]/20",
  "성장기": "bg-green-100 text-green-700 border-green-200",
  "안정기": "bg-purple-100 text-purple-700 border-purple-200",
  "전체": "bg-gray-100 text-gray-700 border-gray-200"
}

export function ReviewCard({ review }: ReviewCardProps) {
  const categoryStyle = categoryColors[review.category as keyof typeof categoryColors] || categoryColors["전체"]

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300"
      whileHover={{ 
        y: -2,
        transition: { duration: 0.2 }
      }}
    >
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        
        {/* 카테고리 배지와 업종 정보 */}
        <div className="flex-shrink-0">
          <motion.div 
            className={`inline-block px-3 py-1 rounded-full text-xs md:text-sm font-medium border ${categoryStyle}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {review.category}
          </motion.div>
          
          <motion.div 
            className="mt-2 text-sm font-semibold text-gray-800"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
          >
            {review.business}
          </motion.div>
          
          {/* 기간 정보 (있는 경우) */}
          {review.period && (
            <motion.div 
              className="mt-1 text-xs text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
            >
              📅 {review.period}
            </motion.div>
          )}
        </div>

        {/* 후기 내용 */}
        <motion.div 
          className="flex-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        >
          <blockquote className="text-gray-700 leading-relaxed">
            <span className="text-[#148777] text-lg">"</span>
            {review.highlight ? (
              <span>
                {review.content.split(review.highlight)[0]}
                <span className="bg-yellow-200 px-1 rounded font-medium">
                  {review.highlight}
                </span>
                {review.content.split(review.highlight)[1]}
              </span>
            ) : (
              review.content
            )}
            <span className="text-[#148777] text-lg">"</span>
          </blockquote>

          {/* 평점 (있는 경우) */}
          {review.rating && (
            <motion.div 
              className="mt-3 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3, ease: "easeOut" }}
            >
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < review.rating! ? "★" : "☆"}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {review.rating}/5
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* 케어온 로고 워터마크 */}
        <motion.div 
          className="hidden md:block flex-shrink-0 opacity-10"
          initial={{ opacity: 0, rotate: -10 }}
          animate={{ opacity: 0.1, rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <div className="w-12 h-12 bg-[#148777] rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}