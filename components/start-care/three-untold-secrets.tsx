// 마케팅에서 '호기심 갭' 전략 = 궁금증을 극대화시켜 다음 내용을 보게 만드는 기법
// 마치 영화 예고편이 스포일러 없이 궁금증만 유발하는 것과 같음

export function ThreeUntoldSecrets() {
  return (
    <section className="pt-16 md:pt-24 pb-4 md:pb-6 bg-black">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-left ml-3 md:ml-5">
          {/* 상단 후킹 문구 */}
          <p className="text-[#148777] font-semibold text-lg mb-4">
            해보기전엔...
          </p>
          
          {/* 메인 타이틀 */}
          <h2 className="text-3xl md:text-5xl font-semibold text-white leading-snug">
            절대 알 수 없는
            <br />
            비밀 3가지
          </h2>
        </div>
      </div>
    </section>
  )
}
