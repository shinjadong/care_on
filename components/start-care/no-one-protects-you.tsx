// 마케팅의 '공포 어필' 전략 = 현실적 위험을 직시하게 만드는 기법
// 마치 의사가 환자에게 병의 심각성을 알려주는 것과 같음

export function NoOneProtectsYou() {
  return (
    <section className="py-16 md:py-24 bg-black">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col items-center">
          {/* 메인 질문 제시 */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-semibold text-white leading-tight mb-2">
              가장 높은 확률의 <span className="font-extrabold">위험,</span>
            </h2>
            <h3 className="text-2xl md:text-4xl font-semibold text-white leading-tight mb-3">
              가장 무방비한 대한민국에서의
            </h3>
            <h4 className="text-3xl md:text-5xl font-bold text-white mb-8 md:mb-12">
              창업?
            </h4>
          </div>

          {/* 첫 번째 불안감 조성 텍스트 */}
          <div className="text-center mb-12 md:mb-16 max-w-3xl">
            <p className="text-base md:text-lg text-gray-400 leading-relaxed">
              너무도 불안한 세상입니다.
            </p>
          </div>

          {/* 폐업률 통계 이미지 영역 */}
          <div className="w-full max-w-2xl mb-12 md:mb-16">
            <div className="aspect-video bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center">
              <span className="text-gray-400 text-lg font-medium">폐업률 통계 이미지 자료</span>
            </div>
          </div>

          {/* 나머지 불안감 조성 텍스트 */}
          <div className="text-center mb-12 md:mb-16 max-w-3xl">
            <p className="text-base md:text-lg text-gray-400 leading-relaxed">
              실력이 있다고 창업에 성공하는 시대는 지났습니다.
              <br />
              생각지도 못한 위험이 너무 많습니다. 치열한 경쟁 속에서,
              <br />
              <br />
              <span className="text-white font-semibold" style={{fontFamily: 'Garamond, serif'}}>새로 시작하는 우리, 괜찮을까요?</span>
            </p>
          </div>


          {/* 최종 메시지 */}
          <div className="text-center pt-8 md:pt-12 max-w-4xl">
            <p className="text-2xl md:text-4xl font-bold text-[#148777] leading-tight" style={{fontFamily: 'Garamond, serif'}}>
              아무도 당신을 <span className="text-[#148777]">지켜주지 않는데요...</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
