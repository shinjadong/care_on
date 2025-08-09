import Image from "next/image"

const Marquee = ({ images, reverse = false }: { images: string[]; reverse?: boolean }) => {
  const animationClass = reverse ? "animate-marquee-slow" : "animate-marquee-slow"
  // 끊김 없는 연속성을 위해 16배 복제 - 더 부드러운 무한 스크롤 효과를 위해 배율 증가
  const repeatedImages = Array(16).fill(images).flat()
  
  return (
    <div className="relative flex w-full overflow-hidden">
      <div className={`flex w-max ${animationClass}`}>
        {repeatedImages.map((src, index) => (
          <div key={index} className="relative w-[400px] h-12 mx-1 flex-shrink-0">
            <Image
              src={src || "/placeholder.svg"}
              alt={`Partner logo ${index + 1}`}
              fill
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export function AuthorityCoCompanies() {
  const partnerLogos1 = ["https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/1.png"]
  const partnerLogos2 = ["https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/2.png"]
  const partnerLogos3 = ["https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/3.png"]
  const partnerLogos4 = ["https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/4.png"]
  const partnerLogos5 = ["https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/5.png"]

  return (
    <section className="py-12 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <em className="text-[#b8860b] text-xl md:text-2xl text-bold font-serif italic">신뢰의 다른 이름 '케어온'</em>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">국내 최고의 파트너사와 함께 합니다.</h3>
        </div>
        <div className="space-y-4">
          <Marquee images={partnerLogos1} />
          <Marquee images={partnerLogos2} reverse={true} />
          <Marquee images={partnerLogos3} />
          <Marquee images={partnerLogos4} reverse={true} />
          <Marquee images={partnerLogos5} />
        </div>
      </div>
    </section>
  )
}
