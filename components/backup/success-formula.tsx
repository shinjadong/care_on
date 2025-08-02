import Image from "next/image"

const formulas = [
  {
    title: "전문성을 '뾰족하게' 정의하라",
    description:
      '"모든 것을 잘합니다"라는 말은 고객의 뇌리에 남지 않습니다. 구체적이고 명확한 전문성으로 틈새를 파고드세요:',
    imgSrc: "/placeholder.svg?height=506&width=912",
    imgAlt:
      "피부과 전문의 여드름 흉터시술 1,000건 이상 경험의 흉터 개선 전문의 / 치과 전문의 턱관절 장애 치료 800건 이상의 턱관절 전문의",
  },
  {
    title: "고객의 ‘행복한 미래’를 상상시켜라",
    description: "고객들은 제품/서비스가 궁금한 것이 아닙니다. 자신의 문제가 해결될 수 있는지 알고 싶은 것입니다:",
    imgSrc: "/placeholder.svg?height=506&width=912",
    imgAlt: "임플란트 시술 음식을 마음껏 씹는 일상의 즐거움 회복 / 보톡스 시술 주름이 사라진 순간, 젊어진 얼굴의 변화",
  },
  {
    title: "고객 여정 전체에 일관된 전문성을 증명하라",
    description:
      "한 채널에서만 잘하는 것은 충분하지 않습니다. 고객의 정보 탐색 여정 전체에 같은 메시지를 심어야 합니다. 고객은 평균 3-7개 접점을 거친 후에야 구매를 결정합니다",
    imgSrc: "/placeholder.svg?height=624&width=912",
    imgAlt: "네이버/구글 검색 블로그/지도 검색 유튜브/인스타그램 검색 홈페이지 검색 예약",
  },
]

export function SuccessFormula() {
  return (
    <section className="py-16 md:py-24 bg-teal-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            2025년 사업 마케팅
            <br />
            <strong className="text-teal-600">성공 3단계 공식</strong>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            더 이상 이런 문제들에 시간과 비용을 낭비하지 마세요. <br />
            이미 검증된 해결책이 있습니다.
          </p>
        </div>
        <ul className="space-y-16 max-w-5xl mx-auto">
          {formulas.map((formula, index) => (
            <li key={index} className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-left mb-6">
                <em className="text-teal-600 font-semibold not-italic">성공 공식 {index + 1}</em>
                <h3 className="text-2xl font-bold mt-1">{formula.title}</h3>
                <p className="mt-2 text-gray-600">{formula.description}</p>
              </div>
              <Image
                src={formula.imgSrc || "/placeholder.svg"}
                alt={formula.imgAlt}
                width={912}
                height={624}
                className="w-full h-auto rounded-md"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
