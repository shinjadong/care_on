const trends = [
  {
    before: "더 이상 가깝다고\n선택하지 않습니다",
    after: "평균 7곳 이상의 업체를\n온라인에서 철저히 비교합니다",
  },
  {
    before: "간판을 보고\n들어오지 않습니다",
    after: "특정 분야에 대한 전문성을\n증명할 수 있는 곳을 찾습니다",
  },
  {
    before: "지인 추천만으로\n결정하지 않습니다",
    after: "대표의 실력과 전문성이 온라인에서\n얼마나 명확히 드러나는지 확인합니다",
  },
]

const tools = [
  "당근마켓",
  "대행사 컨트롤",
  "네이버 블로그",
  "네이버 플레이스",
  "유튜브",
  "릴스",
  "브랜드 인스타그램",
  "CS 및 컴플레인",
  "AI",
  "쓰레드",
  "파워링크 / 파워컨텐츠",
  "상세페이지",
  "메타광고",
]

export function MarketingTrends() {
  return (
    <section className="py-16 md:py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          2025년, 고객들의 선택 방식이
          <br />
          완전히 바뀌었습니다
        </h2>
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {trends.map((trend, index) => (
            <div key={index} className="text-center">
              <div className="bg-red-100 text-red-700 p-6 rounded-lg mb-4 h-32 flex items-center justify-center">
                <p className="whitespace-pre-line">{trend.before}</p>
              </div>
              <div className="bg-teal-100 text-teal-800 p-6 rounded-lg h-32 flex items-center justify-center">
                <p className="font-semibold whitespace-pre-line">{trend.after}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-lg font-semibold mb-8">97% 이상이 인터넷을 사용하는 시대,</p>
        <div className="relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
          <div className="flex animate-marquee-fast whitespace-nowrap">
            {tools.map((tool, index) => (
              <div key={index} className="mx-4 px-6 py-3 bg-white rounded-full shadow-md">
                {tool}
              </div>
            ))}
          </div>
          <div className="absolute top-0 flex animate-marquee-fast2 whitespace-nowrap">
            {tools.map((tool, index) => (
              <div key={index} className="mx-4 px-6 py-3 bg-white rounded-full shadow-md">
                {tool}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-16 text-center">
          <p className="text-lg">
            사장님의 사업장이 <br /> 위 어디에도 보이지 않는다면,
          </p>
          <strong className="text-2xl md:text-3xl font-bold mt-2 block">
            고객은 사장님이 존재하는지조차 <br />
            모르는 세상입니다.
          </strong>
        </div>
      </div>
    </section>
  )
}
