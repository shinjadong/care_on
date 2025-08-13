export function HeroSection() {
  return (
    <div className="relative h-screen min-h-[600px] text-white">
      <video autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover">
        <source
          src="https://isanghanacademy.co.kr/wp-content/themes/academy/images/isanghan_video/video_hs_visual.mp4"
          type="video/mp4"
        />
      </video>
      <div className="absolute top-0 left-0 w-full h-full bg-black/50" />
      <div className="relative z-10 flex flex-col justify-center h-full">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl text-left">
            <span className="text-lg font-semibold">세이프 스타트 패키지</span>
            <h1 className="text-4xl md:text-6xl font-extrabold my-4 leading-tight">
              예비창업자를 위한
              <br />
              1:1 맞춤 세팅
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              떨리는 첫 사업,
              <br />
              실패하지 않게
              <br />
              다- 케어해드릴게요
              <br />
              *7월 접수는 조기마감 되었습니다.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <ul className="grid grid-cols-2 md:grid-cols-4 text-center py-6 gap-4">
              <li>
                <span className="block text-sm text-gray-300">모집 마감</span>
                <strong className="block text-lg font-bold">
                  07/30(수) <br className="sm:hidden" />
                  자정까지
                </strong>
              </li>
              <li>
                <span className="block text-sm text-gray-300">진행 일정</span>
                <strong className="block text-lg font-bold">
                  08/04(월) <br className="sm:hidden" />
                  오픈 예정
                </strong>
              </li>
              <li>
                <span className="block text-sm text-gray-300">견적 시간</span>
                <strong className="block text-lg font-bold">
                  월~금 <br className="sm:hidden" />약 1~2시간
                </strong>
              </li>
              <li>
                <span className="block text-sm text-gray-300">진행 방식</span>
                <strong className="block text-lg font-bold">
                  1:1 맞춤 <br className="sm:hidden" />
                  무료견적
                </strong>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
