const problems = [
  {
    title: "비용 대비 효과 의문",
    description:
      '매달 수백만 원이 빠져나가지만, 그 효과를 정확히 측정할 수 없습니다. “정말 이 비용이 필요한가?"라는 의문이 계속됩니다.',
  },
  {
    title: "온라인에서의 '투명 인간' 현상",
    description: "사장님의 사업장이 온라인에서 제대로 검색되지 않으면, 고객에게는 존재하지 않는 것과 같습니다.",
  },
  {
    title: "'모든 진료를 잘합니다' = '아무것도 잘하지 못합니다'",
    description:
      '모든 것을 잘한다고 말하는 순간, 환자들에게는 전문성 없는 병원으로 인식됩니다. 강남역 10개 성형외과가 모두 "성형 전문"이라고 합니다.',
  },
  {
    title: "'저가 환자'만 유입되는 악순환",
    description:
      "온라인에서 전문성이 제대로 전달되지 않으면 고가 치료를 신뢰하지 못하는 환자만 유입됩니다. 이는 점점 낮은 수익성으로 이어집니다.",
  },
  {
    title: "직원/대행사 의존",
    description:
      '"담당자가 퇴사했습니다"라는 말에 모든 마케팅이 중단됩니다. 마케팅 회사 교체 시 처음부터 다시 시작해야 합니다.',
  },
]

export function CommonProblems() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-red-600 font-semibold">충격적인 사실은...</p>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">대부분의 병원이 18점 이하입니다</h2>
          <p className="mt-4 text-lg text-gray-600">5가지 치명적인 문제를 똑같이 겪고 있기 때문입니다.</p>
        </div>
        <ul className="space-y-8">
          {problems.map((problem, index) => (
            <li key={index} className="bg-gray-50 p-6 rounded-lg flex flex-col md:flex-row items-start">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <em className="flex items-center justify-center w-12 h-12 bg-teal-600 text-white font-bold text-xl rounded-full not-italic">
                  {index + 1}
                </em>
              </div>
              <div>
                <strong className="text-xl font-bold">{problem.title}</strong>
                <p className="mt-2 text-gray-600">{problem.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
