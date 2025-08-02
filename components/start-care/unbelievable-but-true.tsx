import Image from "next/image"

export function UnbelievableButTrue() {
  return (
    <section className="bg-[#171514] py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-point text-2xl md:text-3xl font-serif italic mb-4">"1년 내 폐업 이라구요?"</p>
          <h2 className="text-white text-4xl md:text-5xl font-bold">믿기지 않겠지만, 사실입니다.</h2>
        </div>
        <div className="mt-12 flex justify-center">
          <Image
            src="https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%EC%9E%90%EC%98%81%EC%97%85%EC%9E%90-%ED%8F%90%EC%97%85.gif"
            alt="자영업자 폐업 관련 통계 그래프 GIF"
            width={700}
            height={400}
            unoptimized={true}
            className="max-w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  )
}
