import Image from "next/image"
import { Button } from "@/components/ui/button"

const reviews = [
  {
    imgSrc: "/placeholder.svg?height=576&width=978",
    title: "적자로 폐업 위기였던 피부과 사장님",
    quote: '"1년간 적자로, 가게 문을 닫아야 할 지경이었죠. 컨설팅 이후 9개월 만에 매출이 2배 상승했습니다."',
    link: "#",
  },
  {
    imgSrc: "/placeholder.svg?height=576&width=978",
    title: "경쟁 심화로 고객 감소한 치과 사장님",
    quote: '"혼자서 7-8년 할 때는 아무런 효과가 없었는데 6개월 만에 덤핑 업체를 이기고 신규 고객이 2배 늘었습니다."',
    link: "#",
  },
  {
    imgSrc: "/placeholder.svg?height=576&width=978",
    title: "시장 상황으로 인해 고객이 감소한 한의원 사장님",
    quote: '"경제가 어려워지며 고객 수가 많이 줄었는데, 몇 개의 콘텐츠만으로 매출의 앞자리가 바뀌었습니다."',
    link: "#",
  },
  {
    imgSrc: "/placeholder.svg?height=576&width=978",
    title: "전국 7개 지점 한의원 대표 사장님",
    quote:
      '"경쟁에서 이기려면 마케팅을 놓치면 안 된다 생각했습니다. 이제는, ‘아 내가 여기서 더 내려가진 않겠다.’라는 자신감이 생겼습니다."',
    link: "#",
  },
]

export function RealReviews() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-teal-600 font-semibold">사장님들의 실제 후기</p>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            같은 지역, 같은 진료과임에도 <br />
            환자 수가 10배씩 차이 나는 이유입니다.
          </h2>
        </div>
        <ul className="grid md:grid-cols-1 gap-8 max-w-4xl mx-auto">
          {reviews.map((review, index) => (
            <li key={index} className="bg-gray-50 rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
              <div className="md:w-1/2">
                <Image
                  src={review.imgSrc || "/placeholder.svg"}
                  alt={review.title}
                  width={489}
                  height={288}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8 flex flex-col justify-center">
                <strong className="text-xl font-bold">{review.title}</strong>
                <p className="mt-4 text-gray-600 flex-grow">"{review.quote}"</p>
                <Button asChild className="mt-6 w-full md:w-auto bg-teal-600 hover:bg-teal-700 self-start">
                  <a href={review.link}>후기 보러 가기</a>
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-teal-600 text-teal-600 hover:bg-teal-50 hover:text-teal-700 bg-transparent"
          >
            더 많은 후기 보러 가기
          </Button>
        </div>
      </div>
    </section>
  )
}
