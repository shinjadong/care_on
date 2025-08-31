"use client"

import { useState } from "react"

interface Product {
  id: string
  name: string
  category: string
  description: string
  price: string
  image: string
  features: string[]
}

const products: Product[] = [
  {
    id: "pos-1",
    name: "스마트 POS 시스템",
    category: "POS",
    description: "매장 운영을 위한 올인원 POS 솔루션",
    price: "월 19,900원부터",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["매출 관리", "재고 관리", "고객 관리", "리포트 분석"]
  },
  {
    id: "cctv-1", 
    name: "AI CCTV 시스템",
    category: "보안",
    description: "인공지능 기반 스마트 보안 솔루션",
    price: "월 29,900원부터",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["24시간 모니터링", "모바일 알림", "클라우드 저장", "AI 분석"]
  },
  {
    id: "kiosk-1",
    name: "셀프 키오스크",
    category: "키오스크",
    description: "무인 주문 및 결제 시스템",
    price: "월 39,900원부터", 
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["터치스크린", "결제 연동", "메뉴 관리", "주문 알림"]
  },
  {
    id: "tablet-1",
    name: "주문용 태블릿",
    category: "태블릿",
    description: "테이블 오더 및 서빙 관리 시스템",
    price: "월 14,900원부터",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    features: ["무선 주문", "실시간 연동", "테이블 관리", "서빙 알림"]
  }
]

const categories = ["전체", "POS", "보안", "키오스크", "태블릿"]

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체")
  
  const filteredProducts = selectedCategory === "전체" 
    ? products 
    : products.filter(product => product.category === selectedCategory)

  const handleQuoteRequest = (productName: string) => {
    alert(`${productName}에 대한 견적 요청이 접수되었습니다.`)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">제품 & 서비스</h1>
          <p className="text-xl opacity-90">
            사업 성공을 위한 다양한 솔루션을 만나보세요
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* 카테고리 필터 */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 제품 그리드 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {product.name}
                  </h3>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {product.category}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{product.description}</p>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">주요 기능</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-lg font-bold text-blue-600">
                    {product.price}
                  </div>
                  <button
                    onClick={() => handleQuoteRequest(product.name)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors"
                  >
                    견적 요청
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA 섹션 */}
        <div className="text-center mt-16 bg-gray-50 py-16 rounded-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            맞춤형 솔루션이 필요하신가요?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            전문 컨설턴트가 업종별 최적의 솔루션을 제안해드립니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/landing#contact-form'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              무료 견적 받기
            </button>
            <button 
              onClick={() => window.location.href = '/cctv-quote-chat'}
              className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              AI 견적 서비스
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}