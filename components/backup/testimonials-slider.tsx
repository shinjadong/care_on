"use client"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

const testimonials = [
  { before: "/before-image-1.png", after: "/futuristic-city-street-evening.png" },
  { before: "/before-image-2.png", after: "/cozy-reading-nook-3.png" },
  { before: "/preceding-image-three.png", after: "/placeholder.svg?height=1302&width=760" },
  { before: "/placeholder.svg?height=1302&width=760", after: "/placeholder.svg?height=1302&width=760" },
  { before: "/placeholder.svg?height=1302&width=760", after: "/placeholder.svg?height=1302&width=760" },
  { before: "/placeholder.svg?height=1302&width=760", after: "/placeholder.svg?height=1302&width=760" },
]

export function TestimonialsSlider() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 text-center">
        <p className="text-teal-600 font-semibold">케어온 1:1 맞춤 교육</p>
        <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-12">
          검증된 방법, 검증된 결과, <br />
          이제는 당신차례입니다.
        </h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((item, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-2 space-y-2">
                      <div className="w-full">
                        <Image
                          src={item.before || "/placeholder.svg"}
                          alt="Before"
                          width={380}
                          height={651}
                          className="w-full h-auto rounded-t-lg"
                        />
                      </div>
                      <div className="w-full">
                        <Image
                          src={item.after || "/placeholder.svg"}
                          alt="After"
                          width={380}
                          height={651}
                          className="w-full h-auto rounded-b-lg"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  )
}
