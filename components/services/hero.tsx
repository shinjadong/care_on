"use client"

export function ServicesHero() {
  return (
    <section className="section section-hero">
      <div className="hero-sticky-container">
        <div className="hero-sticky-content">
          {/* Background gradient */}
          <div className="hero-background-gradient"></div>
        </div>
        <div className="hero-content-container fade-in">
          <div className="hero-content-lockup section-content">
            <div className="hero-content">
              <h1 className="hero-content-eyebrow">
                <span className="visuallyhidden">케어온</span>
                <div className="text-4xl font-bold text-white mb-2">
                  케어온
                </div>
              </h1>
              <h2 className="hero-content-headline typography-hero-headline swipe-up-reveal animate">
                <span className="line">
                  <span className="words">비즈니스를 사랑하는</span>
                </span>
                <span className="line">
                  <span className="words">마음 그대로.</span>
                </span>
              </h2>
              <p className="hero-content-copy typography-hero-intro">
                언제나 안전하게 즐기는 전문 서비스. 한 차원 높은 보안을 선사하는 CCTV 모니터링<sup className="footnote footnote-number"><a href="#footnote-3" aria-label="Footnote 1" data-modal-close="">1</a></sup> 및 24시간 지원 서비스.<sup className="footnote footnote-number"><a href="#footnote-4" aria-label="Footnote 2" data-modal-close="">2</a></sup> 성공한 사업가가 된 듯한 기분을 느끼게 해주는 케어온 컨설팅. 독점 컨설팅과 라이브 지원. 그리고 온라인에서든 오프라인에서든, 당신의 모든 비즈니스에서 즐기는 자유까지. <br className="large" /><br className="medium" />여기 사업가를 위한 진정한 '비즈니스' 솔루션을 소개합니다.
              </p>
              <div className="hero-content-cta-wrapper">
                <a href="#services" className="icon-wrapper hero-cta button-super button button-music" data-analytics-title="try 1 month free">
                  <span className="icon-copy">1개월 무료 체험하기<span className="footnote footnote-supglyph">*</span></span>
                </a>
              </div>
            </div>
          </div>
          
          {/* Offers Container - Apple Music Style */}
          <div className="section-content-responsive offers-container">
            <div className="hero-offers-content">
              <div className="offers-wrapper">
                <div className="offers-container">
                  <div className="offer-item theme-dark">
                    <p className="typography-offer-eyebrow offer-eyebrow">
                      신규 가입자는<br />최대 1개월 무료
                    </p>
                    <p className="offer-item-copy typography-offer-item-copy">
                      신규 가입자는 케어온<br className="small-hide" /> 최대 1개월 무료 이용 후<br className="small-hide" /> 월 89,000원의 요금 결제.
                    </p>
                    <a href="#trial" className="icon-wrapper button button-elevated button-music" data-analytics-title="try it free">
                      <span className="icon-copy">무료 체험하기<span className="footnote footnote-supglyph">*</span></span>
                    </a>
                  </div>
                  <div className="offer-item theme-dark">
                    <p className="typography-offer-eyebrow offer-eyebrow">케어온 비즈니스 구독 시<br />1개월 무료</p>
                    <p className="offer-item-copy typography-offer-item-copy">
                      케어온 비즈니스를 <br className="medium" />3가지 다른 훌륭한 서비스들과 묶어 하나의 저렴한 <br className="large" />월간 요금제로 이용. <a href="/services/business" className="icon-wrapper offer-item-cta" data-analytics-title="learn more">
                        <span className="icon-copy">더 알아보기</span>⁠<span className="icon icon-after more"></span>
                      </a>
                    </p>
                    <a href="#business" className="icon-wrapper button button-elevated button-music" data-analytics-title="try business package free">
                      <span className="icon-copy">비즈니스 패키지 무료 체험하기<sup className="footnote footnote-number">3</sup></span>
                    </a>
                  </div>
                </div>
                <div className="compare-link typography-hero-cta">
                  <a href="#plans" className="icon-wrapper" data-analytics-title="jumplink - compare plans">
                    <span className="icon-copy">요금제 비교하기</span>⁠<span className="icon icon-after icon-chevrondown"></span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Devices Banner - Apple Music Style */}
          <div className="devices-banner theme-dark">
            <div className="devices-banner-content section-content-responsive">
              <p className="devices-banner-label typography-eyebrow-reduced">
                <span className="opaque">적용 대상 비즈니스를 시작하면 케어온이 3개월 무료.<sup className="footnote footnote-diamond"><a href="#footnote-2" aria-label="Footnote ◊ 기호" data-modal-close="">◊</a></sup></span>
                <a href="#eligibility" className="icon-wrapper devices-banner-cta" data-analytics-title="check eligibility">
                  <span className="icon-copy">적용 대상 확인하기</span>⁠<span className="icon icon-after more"></span>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
