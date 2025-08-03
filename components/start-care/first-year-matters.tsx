// 마케팅의 '보장과 신뢰' 단계 = 최종적으로 안전망을 제시하여 결정을 돕는 기법
// 마치 보험이 위험을 보장해주는 것과 같음

import Image from "next/image"

export function FirstYearMatters() {
  return (
    <section className="bg-black">
      {/* 메인 제목 - 이미지 위에 배치 */}
      <div className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight" style={{fontFamily: 'Noto Serif KR, serif'}}>
              가장 큰 고비는,
              <span className="text-red-800"> 첫 1년</span>
            </h2>
          </div>
        </div>
      </div>

      {/* 이미지 영역 - 모바일: 와이드, 데스크탑: 중앙 정렬 */}
      <div className="w-full md:flex md:justify-center">
        <div className="relative w-full md:max-w-4xl aspect-square">
          {/* 국세청 자료 이미지 */}
          <Image
            src="https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%EA%B5%AD%EC%84%B8%EC%B2%AD%EC%9E%90%EB%A3%8C"
            alt="국세청 첫 1년 창업 통계 자료"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 896px"
            priority
          />
          
          {/* 아래로 갈수록 희미해지는 그라데이션 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black"></div>
        </div>
      </div>

      {/* 통계 문구 - 이미지 아래 */}
      <div className="py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <p className="text-xl md:text-2xl text-gray-200 font-semibold">
              4명 중 한명은, 1년을 못 버팁니다.
            </p>
          </div>
        </div>
      </div>

      {/* 나머지 카피라이팅 섹션 */}
      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* 결심 섹션 */}
          <div className="text-center mb-12 md:mb-16">
            <p className="text-lg md:text-xl text-white mb-6">
              그래서 우리가 결심했습니다
            </p>
            <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              가장 위험한 그 1년,
              <br />
              <span className="text-[#148777] font-extrabold">케어온이 함께 걷겠습니다.</span>
            </h3>
          </div>

          {/* 성공 메시지 */}
          <div className="text-center mb-12 md:mb-16">
            <p className="text-2xl md:text-3xl font-bold text-white mb-4" style={{fontFamily: 'Garamond, serif'}}>
              "해냈다!"
              <br />
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              1년 후, 당신도 이렇게 말할 겁니다.
              <br />
              그런데 만약...
              <br />
              정말 만약에 그렇지 못하더라도
            </p>
          </div>

          {/* 재시작 메시지 */}
          <div className="text-center mb-16 md:mb-20">
            <p className="text-xl md:text-2xl font-bold text-white mb-4" style={{fontFamily: 'Garamond, serif'}}>
              처음부터 다시 시작할 수 있습니다
            </p>
            <p className="text-lg text-gray-300">
              빚 없이. 부담 없이. 깨끗하게.
            </p>
          </div>

          {/* 케어온의 약속 */}
          <div className="text-center mb-12 md:mb-16 p-8 md:p-12 bg-gray-800/50 rounded-lg border border-gray-700">
            <h4 className="text-xl md:text-2xl font-bold text-[#e5ce9f] mb-4" style={{fontFamily: 'Noto Serif KR, serif'}}>
              케어온의 약속
            </h4>
            <p className="text-2xl md:text-3xl font-bold text-white mb-6" style={{fontFamily: 'Garamond, serif'}}>
              "1년 내 폐업 시, 100% 환급"
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              이것은 단순한 환급 정책이 아닙니다.
              <br />
              <br />
              <span className="text-white font-semibold">당신의 도전을 지켜주는 안전망입니다.</span>
            </p>
          </div>

          {/* 비전 메시지 */}
          <div className="text-center mb-12 md:mb-16">
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
              실패가 두렵지 않은 세상.
              <br />
              다시 일어설 수 있는 세상.
            </p>
            <p className="text-xl md:text-2xl font-bold text-white">
              그 세상을 <span className="text-[#148777] font-extrabold">케어온이 만들어갑니다.</span>
            </p>
          </div>

          {/* 최종 메시지 */}
          <div className="text-center">
            <p className="text-xl md:text-2xl font-medium text-white leading-relaxed" style={{fontFamily: 'Noto Serif KR, serif'}}>
              두려워하지 마세요.
              <br />
              최악의 순간에도,
              <br />
              <br />
              <br />
              <span className="text-white font-bold">우리가 있으니까요.</span>
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
