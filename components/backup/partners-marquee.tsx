import Image from "next/image"

const logos = [
  "/partner-logos-1.png",
  "/placeholder-x8zcb.png",
  "/partner-logos-collage.png",
  "/partner-logos-grid.png",
  "/partner-logos-5.png",
]

export function PartnersMarquee() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <p className="text-teal-600 font-semibold">케어온의 실력</p>
        <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-12">
          이미 200여 곳의 사업장이 <br />
          아카데미와 함께했습니다
        </h2>
        <div className="relative overflow-hidden space-y-4 [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
          {logos.map((logo, index) => (
            <div key={index} className="flex animate-marquee">
              <Image
                src={logo || "/placeholder.svg"}
                alt={`Partner logos ${index + 1}`}
                width={2880}
                height={50}
                className="max-w-none flex-shrink-0"
              />
              <Image
                src={logo || "/placeholder.svg"}
                alt={`Partner logos ${index + 1}`}
                width={2880}
                height={50}
                className="max-w-none flex-shrink-0"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
