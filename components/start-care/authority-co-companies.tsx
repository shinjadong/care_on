import Image from "next/image"

const Marquee = ({ images, reverse = false }: { images: string[]; reverse?: boolean }) => {
  const animationClass = reverse ? "animate-marquee-reverse-medium" : "animate-marquee-medium"
  return (
    <div className="relative flex w-full overflow-hidden">
      <div className={`flex w-max ${animationClass}`}>
        {[...images, ...images].map((src, index) => (
          <div key={index} className="relative w-[400px] h-12 mx-4 flex-shrink-0">
            <Image
              src={src || "/placeholder.svg"}
              alt={`Partner logo ${index + 1}`}
              layout="fill"
              objectFit="contain"
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
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <em className="text-point text-xl md:text-2xl font-serif italic">신뢰의 다른 이름 '케어온'</em>
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
