import Image from "next/image"

export function ThreeOneOff() {
  return (
    <section className="bg-[#171514] text-white pt-16 pb-12 md:pt-24">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-12">
          <h3 className="inline-block bg-red-600 text-white text-2xl md:text-3xl font-bold px-4 py-2 mb-4">
            한국 자영업자 3분의 1은
          </h3>
          <h2 className="text-4xl md:text-6xl font-bold mb-2">1년도 안돼 폐업합니다</h2>
          <p className="text-gray-400 text-sm">출처: SBS, MBC, YTN</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Image
            src="https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%EB%B6%88%EC%95%88.png"
            alt="자영업자들의 불안함을 나타내는 온라인 커뮤니티 게시글 모음"
            width={600}
            height={800}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  )
}
