// 마케팅의 '해결책 제시' 단계 = 문제 인식 후 구체적 솔루션 제공하는 기법
// 마치 의사가 진단 후 처방전을 주는 것과 같음

import Image from "next/image"

const solutions = [
  {
    number: "Solution 1",
    title: "비용을",
    subtitle: "제거하세요",
    description: "대한민국 1등 기업들의\n프리미엄 서비스를\n가장 합리적인 가격으로.",
  },
  {
    number: "Solution 2", 
    title: "매출에만",
    subtitle: "집중하세요",
    description: "\"CCTV 고장났는데... 어디 전화해야하지?\"\n.\n매출에만 집중하세요.\n귀찮은 일은 위임하세요.",
  },
  {
    number: "Solution 3",
    title: "만약의 위험에,",
    subtitle: "대비하세요",
    description: "\n1년 내 폐업 시,\n100% 환급해드립니다.",
  }
]

export function ThreeNoFailSecrets() {
  return (
    <section className="py-16 md:py-24 bg-gray-100">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* 헤더 섹션 */}
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {/* 왼쪽 월계수 */}
            <div className="w-16 md:w-24 h-20 md:h-28 flex items-center justify-center">
              <div className="w-full h-full relative">
                <Image
                  src="https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/laurel_left_clean.png"
                  alt="왼쪽 월계수"
                  fill
                  className="object-contain"
                  sizes="96px"
                />
              </div>
            </div>
            
            {/* 메인 제목 */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight" style={{fontFamily: 'Noto Serif KR, serif'}}>
              실패하지 않는
              <br />
              <span className="text-[#b8860b]">비밀 3가지</span>
            </h2>
            
            {/* 오른쪽 월계수 */}
            <div className="w-16 md:w-24 h-20 md:h-28 flex items-center justify-center">
              <div className="w-full h-full relative">
                <Image
                  src="https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/laurel_right_clean.png"
                  alt="오른쪽 월계수"
                  fill
                  className="object-contain"
                  sizes="96px"
                />
              </div>
            </div>
          </div>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            불안해하지 마세요,
            <br />
            <span className="text-gray-900 font-semibold">해결책이 있습니다.</span>
          </p>
        </div>

        {/* 통합된 솔루션 카드 */}
        <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg max-w-5xl mx-auto">
          <div className="space-y-10 md:space-y-12">
            {solutions.map((solution, index) => (
              <div key={index} className="text-center">
                {/* 텍스트 영역 - 중앙 정렬 */}
                <div className="max-w-2xl mx-auto">
                  <div className="mb-4">
                    <div className="text-gray-500 font-medium text-xs mb-2">
                      {solution.number}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                      {solution.title}
                      <br />
                      <span className="font-extrabold">{solution.subtitle}</span>
                    </h3>
                  </div>
                  <div className="text-gray-700 text-base leading-relaxed">
                    {solution.description.split('\n').map((line, lineIndex) => (
                      <div key={lineIndex}>
                        {line}
                        {lineIndex < solution.description.split('\n').length - 1 && <br />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
