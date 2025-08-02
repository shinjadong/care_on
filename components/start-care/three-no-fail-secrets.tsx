// 마케팅의 '해결책 제시' 단계 = 문제 인식 후 구체적 솔루션 제공하는 기법
// 마치 의사가 진단 후 처방전을 주는 것과 같음

const solutions = [
  {
    number: "Solution 1",
    title: "제거하세요",
    subtitle: "비용을",
    description: "대한민국 1등 기업들의\n프리미엄 서비스를\n가장 합리적인 가격으로.",
  },
  {
    number: "Solution 2", 
    title: "잊지 마세요",
    subtitle: "내 몸은 하나라는 걸",
    description: "\"CCTV 고장났는데... 어디 업체더라?\"\n더 이상 헤매지 마세요.\n사장님은 장사만 하세요.\n나머지는 케어온이 합니다.",
  },
  {
    number: "Solution 3",
    title: "그럼에도 불구하고,",
    subtitle: "보장받으세요",
    description: "대한민국 최초\n1년 내 폐업 시,\n100% 환급해드립니다.",
  }
]

export function ThreeNoFailSecrets() {
  return (
    <section className="py-16 md:py-24 bg-black">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* 헤더 섹션 */}
        <div className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {/* 왼쪽 월계수 */}
            <div className="w-12 md:w-16 h-16 md:h-20 flex items-center justify-center">
              <div className="w-full h-full bg-gray-700 rounded flex items-center justify-center">
                <span className="text-xs text-gray-400">왼쪽 월계수</span>
              </div>
            </div>
            
            {/* 메인 제목 */}
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight" style={{fontFamily: 'Noto Serif KR, serif'}}>
              실패하지 않는
              <br />
              <span className="text-[#e5ce9f]">비밀 3가지</span>
            </h2>
            
            {/* 오른쪽 월계수 */}
            <div className="w-12 md:w-16 h-16 md:h-20 flex items-center justify-center">
              <div className="w-full h-full bg-gray-700 rounded flex items-center justify-center">
                <span className="text-xs text-gray-400">오른쪽 월계수</span>
              </div>
            </div>
          </div>
          <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            불안해하지 마세요,
            <br />
            오직,
            <br />
            <span className="text-white font-semibold">당신을 위한 해결책이 있습니다.</span>
          </p>
        </div>

        {/* 솔루션 리스트 */}
        <div className="space-y-12 md:space-y-16">
          {solutions.map((solution, index) => (
            <div key={index} className="bg-gray-800 p-8 md:p-12 rounded-lg border border-gray-700">
              <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
                {/* 텍스트 영역 */}
                <div className="flex-1">
                  <div className="mb-6">
                    <div className="text-white/60 font-medium text-xs mb-2">
                      {solution.number}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
                      {solution.title}
                      <br />
                      <span className="font-extrabold">{solution.subtitle}</span>
                    </h3>
                  </div>
                  <div className="text-white text-base leading-relaxed">
                    {solution.description.split('\n').map((line, lineIndex) => (
                      <div key={lineIndex}>
                        {line}
                        {lineIndex < solution.description.split('\n').length - 1 && <br />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 구성 설명 이미지 영역 */}
                <div className="w-full lg:w-96 flex justify-center">
                  <div className="aspect-square md:aspect-video bg-gray-700 rounded-lg border border-gray-600 flex items-center justify-center h-48 md:h-auto md:min-h-[240px] w-full max-w-sm md:max-w-none">
                    <span className="text-gray-400 text-sm md:text-base font-medium">구성 설명 이미지</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
