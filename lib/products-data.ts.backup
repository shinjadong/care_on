import {
  FileCheck,
  Users,
  CreditCard,
  TrendingUp,
  Shield,
  Package,
  Briefcase,
  Settings,
  Headphones,
  ShoppingCart,
  CheckCircle,
  Zap,
  Clock,
  Award,
  Lock,
  Cloud,
  Smartphone,
  BarChart,
  LucideIcon
} from 'lucide-react'

export interface Product {
  id: number
  name: string
  category: string
  price: number
  originalPrice?: number
  badge?: {
    text: string
    color: string
  }
  rating: number
  reviews: number
  description: string
  longDescription: string
  inStock: boolean
  image: string
  features: string[]
  keyFeatures: {
    icon: LucideIcon
    title: string
    description: string
  }[]
  specifications?: {
    label: string
    value: string
  }[]
}

export const products: Product[] = [
  {
    id: 1,
    name: '케어온 올인원 패키지',
    category: '종합솔루션',
    price: 299000,
    originalPrice: 399000,
    badge: { text: 'SALE', color: 'bg-red-500' },
    rating: 4.8,
    reviews: 1234,
    description: '창업부터 운영까지 모든 것을 한 번에 해결하는 통합 솔루션',
    longDescription: '케어온 올인원 패키지는 창업자를 위한 완벽한 비즈니스 솔루션입니다. CCTV 보안, POS 시스템, 계약 관리, 고객 리뷰 관리까지 사업 운영에 필요한 모든 기능을 하나의 패키지로 제공합니다. 95% 생존율을 자랑하는 검증된 시스템으로 성공적인 창업을 시작하세요.',
    inStock: true,
    image: '/api/placeholder/800/600',
    features: ['CCTV 보안', 'POS 시스템', '계약 관리', '고객 리뷰'],
    keyFeatures: [
      {
        icon: Shield,
        title: 'AI 보안 시스템',
        description: '24시간 AI가 감시하는 최첨단 CCTV 보안 시스템'
      },
      {
        icon: CreditCard,
        title: '통합 결제 시스템',
        description: '토스페이, 카드결제 등 모든 결제수단 지원'
      },
      {
        icon: FileCheck,
        title: '전자 계약 관리',
        description: '종이 없는 스마트한 계약 관리 시스템'
      },
      {
        icon: Users,
        title: '고객 관리 CRM',
        description: '체계적인 고객 관리와 마케팅 자동화'
      }
    ],
    specifications: [
      { label: '서비스 기간', value: '월 단위 구독' },
      { label: '설치 지원', value: '무료 방문 설치' },
      { label: '고객 지원', value: '24/7 고객센터' },
      { label: '데이터 백업', value: '일일 자동 백업' }
    ]
  },
  {
    id: 2,
    name: 'AI CCTV 보안 시스템',
    category: '보안',
    price: 89000,
    badge: { text: 'NEW', color: 'bg-green-500' },
    rating: 4.9,
    reviews: 567,
    description: 'AI가 24시간 감시하는 스마트 보안 시스템',
    longDescription: '최신 AI 기술을 적용한 스마트 CCTV 시스템입니다. 실시간 객체 인식, 이상 행동 감지, 침입 알림 등 고급 보안 기능을 제공합니다. 클라우드 저장소와 모바일 앱을 통해 언제 어디서나 매장을 모니터링할 수 있습니다.',
    inStock: true,
    image: '/api/placeholder/800/600',
    features: ['실시간 감지', '클라우드 저장', '모바일 알림'],
    keyFeatures: [
      {
        icon: Zap,
        title: 'AI 객체 인식',
        description: '사람, 차량, 물체를 실시간으로 인식하고 분류'
      },
      {
        icon: Cloud,
        title: '클라우드 저장',
        description: '30일간 영상 자동 저장 및 백업'
      },
      {
        icon: Smartphone,
        title: '모바일 모니터링',
        description: '스마트폰으로 실시간 영상 확인 및 알림 수신'
      },
      {
        icon: Lock,
        title: '보안 암호화',
        description: '군사급 암호화로 영상 데이터 보호'
      }
    ],
    specifications: [
      { label: '해상도', value: '4K UHD' },
      { label: '야간 촬영', value: '적외선 야간 모드' },
      { label: '저장 기간', value: '30일' },
      { label: '카메라 수', value: '최대 16대' }
    ]
  },
  {
    id: 3,
    name: '토스페이 POS 시스템',
    category: '결제',
    price: 49900,
    badge: { text: 'BESTSELLER', color: 'bg-purple-500' },
    rating: 4.6,
    reviews: 892,
    description: '간편한 결제와 정산을 위한 스마트 POS',
    longDescription: '토스페이와 완벽하게 연동되는 차세대 POS 시스템입니다. QR 결제, 카드 결제, 현금 결제를 모두 지원하며, 실시간 매출 분석과 재고 관리 기능을 제공합니다. 간편한 정산 시스템으로 매일의 매출을 체계적으로 관리하세요.',
    inStock: true,
    image: '/api/placeholder/800/600',
    features: ['토스페이 연동', 'QR 결제', '매출 분석'],
    keyFeatures: [
      {
        icon: CreditCard,
        title: '모든 결제 수단 지원',
        description: '카드, 현금, QR, 간편결제 모두 가능'
      },
      {
        icon: BarChart,
        title: '실시간 매출 분석',
        description: '시간대별, 메뉴별 매출 통계 제공'
      },
      {
        icon: Clock,
        title: '빠른 정산',
        description: 'D+1 정산으로 빠른 현금 흐름'
      },
      {
        icon: Award,
        title: '포인트/쿠폰 관리',
        description: '고객 포인트 및 쿠폰 통합 관리'
      }
    ],
    specifications: [
      { label: '정산 주기', value: 'D+1' },
      { label: '수수료', value: '1.8% (VAT 별도)' },
      { label: '지원 카드', value: '모든 신용/체크카드' },
      { label: '연동 서비스', value: '토스페이, 네이버페이, 카카오페이' }
    ]
  },
  {
    id: 4,
    name: '전자 계약 시스템',
    category: '계약관리',
    price: 39000,
    originalPrice: 59000,
    badge: { text: 'SALE', color: 'bg-red-500' },
    rating: 4.7,
    reviews: 2103,
    description: '종이 없는 스마트한 계약 관리',
    longDescription: '전자서명 기반의 스마트 계약 관리 시스템입니다. 법적 효력이 있는 전자계약서를 쉽고 빠르게 작성하고 관리할 수 있습니다. 계약서 템플릿, 자동 알림, 계약 만료 관리 등 편리한 기능을 제공합니다.',
    inStock: true,
    image: '/api/placeholder/800/600',
    features: ['전자서명', '자동 보관', '법적 효력'],
    keyFeatures: [
      {
        icon: FileCheck,
        title: '법적 효력 보장',
        description: '전자서명법에 따른 완벽한 법적 효력'
      },
      {
        icon: Lock,
        title: '블록체인 보안',
        description: '위변조 불가능한 블록체인 기술 적용'
      },
      {
        icon: Clock,
        title: '자동 만료 알림',
        description: '계약 만료 30일 전 자동 알림'
      },
      {
        icon: Cloud,
        title: '클라우드 보관',
        description: '영구 보관 및 언제든 다운로드 가능'
      }
    ],
    specifications: [
      { label: '저장 용량', value: '무제한' },
      { label: '보관 기간', value: '영구 보관' },
      { label: '템플릿', value: '100개 이상 제공' },
      { label: '동시 계약', value: '무제한' }
    ]
  },
  {
    id: 5,
    name: '고객 리뷰 관리 시스템',
    category: '마케팅',
    price: 29000,
    rating: 4.9,
    reviews: 445,
    description: '고객 리뷰를 체계적으로 관리하는 시스템',
    longDescription: '네이버, 구글, 인스타그램 등 모든 채널의 리뷰를 한 곳에서 관리하세요. AI가 긍정/부정 리뷰를 자동 분류하고, 템플릿 기반의 빠른 응대가 가능합니다. 리뷰 분석을 통해 서비스 개선 포인트를 찾아보세요.',
    inStock: true,
    image: '/api/placeholder/800/600',
    features: ['자동 수집', '분석 리포트', '응대 템플릿'],
    keyFeatures: [
      {
        icon: Users,
        title: '통합 리뷰 수집',
        description: '모든 플랫폼의 리뷰를 자동 수집'
      },
      {
        icon: BarChart,
        title: '감성 분석',
        description: 'AI가 리뷰의 긍정/부정을 자동 분석'
      },
      {
        icon: Zap,
        title: '빠른 응대',
        description: '템플릿 기반의 신속한 리뷰 응대'
      },
      {
        icon: TrendingUp,
        title: '개선점 도출',
        description: '리뷰 분석을 통한 서비스 개선 제안'
      }
    ],
    specifications: [
      { label: '연동 플랫폼', value: '네이버, 구글, 인스타그램 등 10개+' },
      { label: '분석 주기', value: '실시간' },
      { label: '응대 템플릿', value: '50개 제공' },
      { label: '리포트', value: '일간/주간/월간' }
    ]
  },
  {
    id: 6,
    name: '창업 컨설팅 패키지',
    category: '컨설팅',
    price: 199000,
    badge: { text: 'PREMIUM', color: 'bg-yellow-500' },
    rating: 4.8,
    reviews: 334,
    description: '95% 생존율의 비밀, 전문가 1:1 컨설팅',
    longDescription: '10년 이상 경력의 창업 전문가가 1:1로 컨설팅을 제공합니다. 시장 분석부터 사업 계획, 마케팅 전략, 자금 계획까지 창업의 모든 과정을 함께합니다. 95% 생존율을 자랑하는 검증된 컨설팅 프로그램입니다.',
    inStock: false,
    image: '/api/placeholder/800/600',
    features: ['시장 분석', '사업 계획', '1:1 멘토링'],
    keyFeatures: [
      {
        icon: Award,
        title: '전문가 1:1 컨설팅',
        description: '10년 이상 경력의 창업 전문가'
      },
      {
        icon: BarChart,
        title: '시장 분석',
        description: '상권 분석 및 경쟁사 분석 제공'
      },
      {
        icon: FileCheck,
        title: '사업계획서 작성',
        description: '투자 유치용 사업계획서 작성 지원'
      },
      {
        icon: Users,
        title: '네트워킹 지원',
        description: '창업자 커뮤니티 및 네트워킹 기회'
      }
    ],
    specifications: [
      { label: '컨설팅 기간', value: '3개월' },
      { label: '상담 횟수', value: '주 1회 (총 12회)' },
      { label: '상담 시간', value: '회당 2시간' },
      { label: '사후 관리', value: '6개월간 무료 팔로우업' }
    ]
  },
  {
    id: 7,
    name: '재고 관리 시스템',
    category: '운영',
    price: 59000,
    rating: 4.5,
    reviews: 1567,
    description: '실시간 재고 관리와 자동 발주 시스템',
    longDescription: '바코드 스캔 기반의 정확한 재고 관리 시스템입니다. 실시간 재고 추적, 자동 발주, 유통기한 관리 등 재고 관리에 필요한 모든 기능을 제공합니다. 재고 부족이나 과잉을 방지하여 효율적인 운영이 가능합니다.',
    inStock: true,
    image: '/api/placeholder/800/600',
    features: ['실시간 추적', '자동 발주', '바코드 스캔'],
    keyFeatures: [
      {
        icon: Package,
        title: '실시간 재고 추적',
        description: '입출고 시 실시간 재고 업데이트'
      },
      {
        icon: Zap,
        title: '자동 발주 시스템',
        description: '안전재고 이하 시 자동 발주'
      },
      {
        icon: Clock,
        title: '유통기한 관리',
        description: '유통기한 임박 상품 자동 알림'
      },
      {
        icon: BarChart,
        title: '재고 분석',
        description: '재고 회전율 및 ABC 분석 제공'
      }
    ],
    specifications: [
      { label: '관리 가능 SKU', value: '무제한' },
      { label: '바코드 스캐너', value: '무료 제공' },
      { label: '멀티 창고', value: '최대 10개' },
      { label: '발주서 자동화', value: '지원' }
    ]
  },
  {
    id: 8,
    name: '직원 관리 시스템',
    category: '인사',
    price: 35000,
    badge: { text: 'HOT', color: 'bg-orange-500' },
    rating: 4.7,
    reviews: 789,
    description: '근태부터 급여까지 한 번에 관리',
    longDescription: '직원의 근태, 급여, 스케줄을 통합 관리하는 인사 관리 시스템입니다. 지문 인식 출퇴근, 자동 급여 계산, 스케줄 관리 등 편리한 기능을 제공합니다. 노동법에 맞춘 정확한 급여 계산으로 분쟁을 예방하세요.',
    inStock: true,
    image: '/api/placeholder/800/600',
    features: ['근태 관리', '급여 계산', '스케줄링'],
    keyFeatures: [
      {
        icon: Clock,
        title: '스마트 근태 관리',
        description: '지문/얼굴 인식 출퇴근 시스템'
      },
      {
        icon: CreditCard,
        title: '자동 급여 계산',
        description: '4대보험, 세금 자동 계산'
      },
      {
        icon: Users,
        title: '스케줄 관리',
        description: '직원별 근무 스케줄 자동 배치'
      },
      {
        icon: FileCheck,
        title: '전자 근로계약서',
        description: '온라인 근로계약서 작성 및 관리'
      }
    ],
    specifications: [
      { label: '직원 수', value: '무제한' },
      { label: '급여 명세서', value: '자동 발송' },
      { label: '연차 관리', value: '자동 계산' },
      { label: '4대보험', value: '자동 신고' }
    ]
  },
  {
    id: 9,
    name: '온라인 주문 시스템',
    category: '주문',
    price: 69000,
    originalPrice: 89000,
    badge: { text: 'SALE', color: 'bg-red-500' },
    rating: 4.6,
    reviews: 234,
    description: '온라인 주문부터 배달까지 통합 관리',
    longDescription: '배달앱, 자체 홈페이지, SNS 등 모든 채널의 주문을 통합 관리합니다. 실시간 주문 접수, 배달 관리, 메뉴 관리까지 온라인 비즈니스에 필요한 모든 기능을 제공합니다.',
    inStock: true,
    image: '/api/placeholder/800/600',
    features: ['주문 접수', '배달 관리', '메뉴 관리'],
    keyFeatures: [
      {
        icon: ShoppingCart,
        title: '통합 주문 관리',
        description: '모든 채널의 주문을 한 곳에서'
      },
      {
        icon: Smartphone,
        title: '모바일 주문 페이지',
        description: '자체 모바일 주문 사이트 제공'
      },
      {
        icon: TrendingUp,
        title: '주문 분석',
        description: '인기 메뉴 및 주문 패턴 분석'
      },
      {
        icon: Users,
        title: '배달 관리',
        description: '배달 현황 실시간 추적'
      }
    ],
    specifications: [
      { label: '연동 배달앱', value: '배민, 쿠팡이츠, 요기요' },
      { label: '주문 수', value: '무제한' },
      { label: '메뉴 등록', value: '무제한' },
      { label: '배달 지역', value: '자유 설정' }
    ]
  }
]

export function getProductById(id: number): Product | undefined {
  return products.find(p => p.id === id)
}