// 마케팅 심리학에서 '문제 인식' 단계 = 고객이 자신의 문제를 깨닫게 하는 구간
// 이는 마치 의사가 환자에게 증상을 설명해주는 것과 같음

const secrets = [
  {
    number: "SECRET 1",
    title: "손님이 와도 적자입니다.",
    description: [
      "하루매출 50만원!",
      "나쁘지 않죠?",
      "그런데 왜...",
      "",
      "통장엔 0원일까요?"
    ]
  },
  {
    number: "SECRET 2", 
    title: "열심히 할 수록, 가난해집니다.",
    description: [
      "새벽부터 자정까지.",
      "쉬는 날도 반납하고,",
      "",
      "그런데 왜 시급은 3,500원일까요?"
    ]
  },
  {
    number: "SECRET 3",
    title: "안전장치가 없습니다.",
    description: [
      "화재? 화재보험이 있죠.",
      "도난? 도난보험 있습니다.",
      "",
      "그런데 왜 폐업의 위험은 보장해주는 곳이 없을까요?"
    ]
  }
]

export function Secrets1to3() {
  return (
    <section className="pt-4 md:pt-6 pb-16 md:pb-24 bg-black">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* 비밀 리스트 - 각 비밀을 카드 형태로 표현 */}
        <div className="space-y-8">
          {secrets.map((secret, index) => (
            <div key={index} className="bg-gray-800 rounded-lg hover:shadow-2xl hover:bg-gray-700 transition-all duration-300 border border-gray-700 overflow-hidden">
              {/* 데스크탑: 좌우 배치 */}
              <div className="hidden md:flex h-64">
                {/* 텍스트 콘텐츠 영역 */}
                <div className="flex-1 p-8 flex flex-col justify-center relative z-10">
                  {/* 번호와 SECRET 라벨 */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center justify-center w-6 h-6 bg-[#148777] rounded-full">
                      <em className="text-black font-bold text-sm not-italic">
                        {index + 1}
                      </em>
                    </div>
                    <div className="text-white font-bold text-xs">
                      SECRET
                    </div>
                  </div>
                  
                  {/* 제목 - 임팩트 있는 문제 제기 */}
                  <h3 className="text-2xl font-bold text-white mb-4 leading-tight">
                    {secret.title}
                  </h3>
                  
                  {/* 설명 - 공감대 형성을 위한 리듬감 있는 문장 구조 */}
                  <div className="text-gray-300 leading-snug">
                    {secret.description.map((line, lineIndex) => (
                      <p key={lineIndex} className={`${line === "" ? "mt-2" : ""} ${lineIndex === secret.description.length - 1 ? "font-bold text-white" : ""}`}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>

                {/* 이미지 영역 - 데스크탑: 오른쪽 */}
                <div className="w-80 h-full relative bg-gray-700">
                  {/* 이미지 플레이스홀더 */}
                  <div className="absolute inset-0 bg-gray-600 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">이미지 영역</span>
                  </div>
                  
                  {/* 그라데이션 오버레이 - 텍스트 쪽에서 이미지 쪽으로 투명해짐 */}
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-800/70 to-gray-800"></div>
                </div>
              </div>

              {/* 모바일: 정사각형 컨테이너에 이미지 배경 + 텍스트 오버레이 */}
              <div className="md:hidden aspect-square relative">
                {/* 배경 이미지 영역 */}
                <div className="absolute inset-0 bg-gray-600">
                  {/* 이미지 플레이스홀더 */}
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">이미지 영역</span>
                  </div>
                </div>
                
                {/* 그라데이션 오버레이 - 위에서 아래로 텍스트 가독성 확보 */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-800/70 to-transparent"></div>
                
                {/* 텍스트 콘텐츠 오버레이 */}
                <div className="absolute inset-0 p-6 flex flex-col justify-start">
                  {/* 번호와 SECRET 라벨 */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center justify-center w-6 h-6 bg-[#148777] rounded-full">
                      <em className="text-white font-bold text-sm not-italic">
                        {index + 1}
                      </em>
                    </div>
                    <div className="text-white font-bold text-xs">
                      SECRET
                    </div>
                  </div>
                  
                  {/* 제목 - 임팩트 있는 문제 제기 */}
                  <h3 className="text-xl font-bold text-white mb-4 leading-tight">
                    {secret.title}
                  </h3>
                  
                  {/* 설명 - 공감대 형성을 위한 리듬감 있는 문장 구조 */}
                  <div className="text-gray-200 leading-snug">
                    {secret.description.map((line, lineIndex) => (
                      <p key={lineIndex} className={`${line === "" ? "mt-2" : ""} ${lineIndex === secret.description.length - 1 ? "font-bold text-white" : ""}`}>
                        {line}
                      </p>
                    ))}
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
