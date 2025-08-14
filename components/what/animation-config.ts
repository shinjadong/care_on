export const animationConfig = {
  // 모바일 최적화 애니메이션 지속 시간
  mobile: {
    fast: 0.2,
    normal: 0.3,
    slow: 0.4,
  },
  desktop: {
    fast: 0.3,
    normal: 0.5,
    slow: 0.7,
  },
  // 이징 함수
  easing: {
    smooth: [0.25, 0.46, 0.45, 0.94],
    spring: { type: "spring" as const, bounce: 0.15 },
    springMobile: { type: "spring" as const, bounce: 0.1 },
  },
  // 스크롤 애니메이션 딜레이
  scrollDelay: {
    mobile: 100,
    desktop: 150,
  }
}
