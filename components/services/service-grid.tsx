"use client"

import Link from "next/link"
import { PackageType } from "./packageforme"
// Icons removed - using Apple Music tile system

// 실제 케어온 서비스 데이터 (PDF 문서 기반)
const services = {
  mini: [
    {
      id: "cctv-basic",
      title: "KT AI CCTV",
      eyebrow: "보안",
      headline: "지능형 보안의<br/>새로운 기준.",
      description: "AI 기반 지능형 CCTV로 매장 보안을 24시간 책임집니다",
      backgroundImage: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&h=600&fit=crop",
      backgroundVideo: null,
      features: ["KT AI CCTV 1대", "클라우드 저장", "모바일 모니터링", "셀프 설치"],
      href: "/services/cctv",
      size: "large", // large, medium, small
    },
    {
      id: "pos-basic",
      title: "갤럭시탭 POS",
      eyebrow: "결제",
      headline: "간편한 결제와<br/>매출 관리의 만남.",
      description: "토스 프론트로 간편 결제부터 매출 분석까지 한번에",
      backgroundImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=600&fit=crop",
      backgroundVideo: null,
      features: ["갤럭시탭", "토스 프론트", "QR결제", "매출분석"],
      href: "/services/pos",
      size: "medium",
    },
    {
      id: "internet-basic",
      title: "초고속 인터넷",
      eyebrow: "인터넷",
      headline: "끊김 없는<br/>연결의 힘.",
      description: "매장 운영에 필요한 안정적인 인터넷 서비스",
      backgroundImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=600&fit=crop",
      backgroundVideo: null,
      features: ["100M 속도", "매장 인터넷전화", "24시간 A/S", "무료 설치"],
      href: "/services/internet",
      size: "medium",
    },
  ],
  standard: [
    {
      id: "cctv-standard",
      title: "KT AI CCTV",
      eyebrow: "보안",
      headline: "전방위 보안<br/>모니터링의 완성.",
      description: "4대 CCTV로 매장을 완벽하게 보호하는 지능형 보안 시스템",
      backgroundImage: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&h=600&fit=crop",
      backgroundVideo: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
      features: ["KT AI CCTV 4대", "AI 이상감지", "클라우드 저장", "출장 무료설치"],
      href: "/services/cctv",
      size: "large",
    },
    {
      id: "pos-standard",
      title: "프리미엄 POS",
      eyebrow: "결제",
      headline: "배달앱 연동까지<br/>한번에 해결.",
      description: "토스 프론트와 배달의민족, 네이버까지 완벽 연동",
      backgroundImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=600&fit=crop",
      backgroundVideo: null,
      features: ["갤럭시탭+토스터미널", "배달의민족 연동", "네이버 세팅", "매출분석"],
      href: "/services/pos",
      size: "medium",
    },
    {
      id: "internet-standard",
      title: "SK 기가라이트",
      eyebrow: "인터넷",
      headline: "500M 초고속으로<br/>모든 업무가 빨라진다.",
      description: "빠르고 안정적인 프리미엄 인터넷 서비스",
      backgroundImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=600&fit=crop",
      backgroundVideo: null,
      features: ["500M 초고속", "매장 인터넷전화", "24시간 A/S", "출장 설치"],
      href: "/services/internet",
      size: "medium",
    },
    {
      id: "insurance-standard",
      title: "한화시큐리티보험",
      eyebrow: "보험",
      headline: "안심커버 300으로<br/>모든 위험을 차단.",
      description: "사업장 종합보험으로 화재부터 도난까지 완벽 보장",
      backgroundImage: null,
      backgroundVideo: "https://pkehcfbjotctvneordob.supabase.co/storage/v1/object/public/care-on/small_2x.mp4",
      features: ["화재보장", "도난보장", "배상책임", "90% 환급율"],
      href: "/services/insurance",
      size: "small",
    },
  ],
  pro: [
    {
      id: "cctv-pro",
      title: "KT AI CCTV",
      eyebrow: "보안",
      headline: "6대 프리미엄으로<br/>사각지대 제로.",
      description: "최고급 보안 시스템으로 완벽한 매장 보안을 실현합니다",
      backgroundImage: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&h=600&fit=crop",
      backgroundVideo: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
      features: ["KT AI CCTV 6대", "AI 이상감지", "클라우드 저장", "출장 무료설치"],
      href: "/services/cctv",
      size: "large",
    },
    {
      id: "internet-pro",
      title: "SK 기가",
      eyebrow: "인터넷",
      headline: "1G 초고속의<br/>무한한 가능성.",
      description: "최고 속도의 프리미엄 인터넷으로 모든 업무를 원활하게",
      backgroundImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=600&fit=crop",
      backgroundVideo: null,
      features: ["1G 초고속", "매장 인터넷전화", "24시간 A/S", "프리미엄 지원"],
      href: "/services/internet",
      size: "medium",
    },
    {
      id: "iptv-pro",
      title: "삼탠바이미 IPTV",
      eyebrow: "엔터테인먼트",
      headline: "프리미엄 채널로<br/>매장이 더 특별해진다.",
      description: "최고급 IPTV 서비스로 매장 분위기를 업그레이드",
      backgroundImage: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&h=600&fit=crop",
      backgroundVideo: null,
      features: ["프리미엄 채널", "4K 화질", "스포츠 전용", "음악 채널"],
      href: "/services/iptv",
      size: "medium",
    },
    {
      id: "pos-pro",
      title: "프리미엄 POS",
      eyebrow: "결제",
      headline: "모든 배달앱과<br/>완벽한 연동.",
      description: "갤럭시탭과 토스터미널로 모든 결제를 한번에",
      backgroundImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=600&fit=crop",
      backgroundVideo: null,
      features: ["갤럭시탭+토스터미널", "배달의민족 연동", "네이버 세팅", "고급 분석"],
      href: "/services/pos",
      size: "small",
    },
    {
      id: "insurance-pro",
      title: "한화시큐리티보험",
      eyebrow: "보험",
      headline: "안심커버 1000으로<br/>완벽한 보호.",
      description: "최고 수준의 보장으로 모든 리스크를 완벽 차단",
      backgroundImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=600&fit=crop",
      backgroundVideo: null,
      features: ["화재보장", "도난보장", "배상책임", "100% 환급율"],
      href: "/services/insurance",
      size: "small",
    },
  ],
}

interface ServiceGridProps {
  selectedPackage: PackageType
}

export function ServiceGrid({ selectedPackage }: ServiceGridProps) {
  const currentServices = services[selectedPackage] || []
  
  return (
    <section className="section section-cards">
      <div className="section-content">
        <div className="cards-header fade-in">
          <h2 className="typography-hero-headline">
            {selectedPackage === "mini" ? "스타트케어 패키지 미니" : 
             selectedPackage === "standard" ? "스타트케어 패키지" : 
             "스타트케어 패키지 PRO"}
          </h2>
          <p className="typography-hero-intro">
            {selectedPackage === "mini" ? "기본 필수 서비스로 안전하게 시작하는 스마트한 선택" :
             selectedPackage === "standard" ? "1년 무료 체험단 이벤트로 더 많은 혜택을 경험하세요" :
             "올인원 프리미엄 패키지로 완벽한 비즈니스 환경을 구축하세요"}
          </p>
        </div>

        {/* Apple Music Cards Container - 완전한 구조 */}
        <div className="cards-container">
          {currentServices.map((service) => {
            const getTileClass = (size: string) => {
              switch(size) {
                case "large": return "tile-large"
                case "medium": return "tile-medium" 
                case "small": return "tile-small"
                default: return "tile-medium"
              }
            }

            return (
              <div 
                key={service.id}
                className={`tile ${getTileClass(service.size)} tile-rounded theme-dark media-full-bleed near-card`}
                data-component-list="TileOverlay"
                data-analytics-section-engagement={`name:${service.id}`}
              >
                <div className="tile-foc">
                  <div className="tile-content">
                    <div className="tile-copy">
                      <h3 className="tile-eyebrow typography-eyebrow-super fade-in">
                        {service.eyebrow}
                      </h3>
                      <h4 
                        className="tile-headline typography-headline-super text-gradient animate"
                        dangerouslySetInnerHTML={{ __html: service.headline }}
                      />
                    </div>
                  </div>
                  
                  {/* Background Media */}
                  <div className="tile-media">
                    {service.backgroundVideo ? (
                      <video
                        className="tile-background-video"
                        autoPlay
                        muted
                        loop
                        playsInline
                      >
                        <source src={service.backgroundVideo || ""} type="video/mp4" />
                      </video>
                    ) : (
                      <picture className="tile-background-picture loaded">
                        <img 
                          src={service.backgroundImage} 
                          alt={service.title}
                          className="tile-background-img"
                        />
                      </picture>
                    )}
                  </div>
                </div>

                {/* Tile Overlay Button */}
                <input type="checkbox" id={`tile-boc-toggle-${service.id}`} className="tile-boc-toggle" />
                <label 
                  htmlFor={`tile-boc-toggle-${service.id}`}
                  className="tile-boc-trigger" 
                  role="button" 
                  aria-expanded="false"
                  aria-label={`${service.title}에 대해 더 알아보기`}
                  data-analytics-title={`open | ${service.id}`}
                >
                  <span className="tile-button">
                    <svg className="tile-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M17.25,8.51H11.5V2.75A1.5,1.5,0,0,0,10,1.25h0a1.5,1.5,0,0,0-1.5,1.5V8.5H2.75a1.5,1.5,0,0,0,0,3H8.5v5.75a1.5,1.5,0,0,0,1.5,1.5h0a1.5,1.5,0,0,0,1.5-1.5V11.5h5.75a1.5,1.5,0,0,0,0-3Z"></path>
                    </svg>
                  </span>
                </label>

                {/* Expanded Content */}
                <div className="tile-boc">
                  <div className="tile-boc-content" role="group" aria-label={`${service.title}에 대한 더 많은 콘텐츠`}>
                    <div className="tile-boc-body">
                      <div className="tile-boc-copy typography-body-elevated">
                        <p>
                          {service.description}
                        </p>
                        <div className="features-list">
                          {service.features.map((feature, idx) => (
                            <div key={idx} className="feature-item">
                              <span className="feature-check">✓</span>
                              <span className="feature-text">{feature}</span>
                            </div>
                          ))}
                        </div>
                        <Link href={service.href} className="tile-cta-link">
                          자세히 알아보기 →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}