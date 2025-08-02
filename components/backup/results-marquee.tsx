const results1 = [
  { location: "청담 피부과", text: "전년 동월 매출,", highlight: "3일 만에 달성" },
  { location: "고양 마취통증의학과", text: "블로그 만으로", highlight: "40% 매출 상승" },
  { location: "남양주 치과", text: "덤핑 업체 제치고", highlight: "신환 2배 상승" },
  { location: "안양 요양병원", text: "1개월 만에", highlight: "환자 수 20% 증가" },
  { location: "수원 한의원", text: "매출 3억 →", highlight: "4.9억 원 달성" },
  { location: "서울 비뇨기과", text: "전주에서 서울까지 방문,", highlight: "고단가 수술 문의 증가" },
  { location: "부산 가정의학과", text: "초진 2배 증가", highlight: "매출 70% 상승" },
]

const results2 = [
  { location: "김포 치과", text: "4개월간 꾸준히", highlight: "1억 5천 매출 유지" },
  { location: "수원 치과", text: "개원 전 수강 →", highlight: "개원 4달 만에 월 7천 달성" },
  { location: "강남 정신건강의학과", text: "문의량 / 신환수", highlight: "2배 증가" },
  { location: "청담 피부과", text: "9개월 만에", highlight: "매출 1억 상승" },
  { location: "광주 한의원", text: "글 4-5개 만에", highlight: "매출 앞자리 상승" },
  { location: "수원 정형외과", text: "올해 최고 매출,", highlight: "신환 달성" },
  { location: "부산 한의원", text: "매출 2,800만 원 →", highlight: "매출 1억 2천만 원 달성" },
]

const ResultCard = ({ location, text, highlight }: { location: string; text: string; highlight: string }) => (
  <div className="bg-white shadow-lg rounded-lg p-6 w-64 h-48 flex flex-col justify-between flex-shrink-0 mx-4">
    <em className="text-teal-600 font-bold not-italic">{location}</em>
    <div>
      <p className="text-lg">
        {text} <br />
        <strong className="text-xl font-bold text-gray-900">{highlight}</strong>
      </p>
    </div>
  </div>
)

export function ResultsMarquee() {
  return (
    <section className="py-16 md:py-24 bg-gray-50 overflow-hidden">
      <div className="text-center mb-12">
        <h3 className="text-3xl md:text-4xl font-bold">
          어떤 진료과든 어떤 상황이든 <br />
          <strong className="text-teal-600">상관없습니다.</strong>
        </h3>
        <h4 className="text-xl mt-4 text-gray-600">저희와 함께한 그 결과들입니다</h4>
      </div>
      <div className="space-y-8">
        <div className="relative flex overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...results1, ...results1].map((r, i) => (
              <ResultCard key={i} {...r} />
            ))}
          </div>
        </div>
        <div className="relative flex overflow-hidden">
          <div className="flex animate-marquee-reverse whitespace-nowrap">
            {[...results2, ...results2].map((r, i) => (
              <ResultCard key={i} {...r} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
