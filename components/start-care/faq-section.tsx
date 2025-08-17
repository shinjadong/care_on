import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "케어온은 어떤 서비스인가요?",
    answer:
      "케어온은 창업자를 위한 통합 지원 서비스입니다. CCTV, 인터넷, 화재보험 등 사업에 필요한 모든 것을 한 번에 해결해드립니다.",
  },
  {
    question: "비용은 얼마나 되나요?",
    answer:
      "업종과 규모에 따라 다르지만, 개별 가입 대비 평균 30-40% 절감됩니다. 무료 상담을 통해 정확한 견적을 받아보세요.",
  },
  {
    question: "설치 기간은 얼마나 걸리나요?",
    answer:
      "신청 후 3-5일 이내 설치 완료됩니다. 긴급한 경우 당일 설치도 가능합니다.",
  },
  {
    question: "폐업 시 위약금이 있나요?",
    answer:
      "케어온은 폐업 시 위약금이 없습니다. 100% 환급 보장 프로그램을 운영하고 있습니다.",
  },
  {
    question: "A/S는 어떻게 받나요?",
    answer:
      "24시간 콜센터 운영으로 즉시 대응합니다. 평균 2시간 이내 현장 출동이 가능합니다.",
  },
  {
    question: "다른 지역도 가능한가요?",
    answer:
      "전국 모든 지역에서 서비스 이용이 가능합니다. 도서산간 지역도 추가 비용 없이 동일하게 제공됩니다.",
  },
]

export function FaqSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#f7f3ed] to-gray-100">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-teal-600 font-semibold">자주 묻는 질문</p>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">궁금증? 모두 해결해드릴게요.</h2>
          <p className="mt-4 text-sm text-gray-500">
            * 아래 내용 이외에 궁금한 점은 케어온 채널톡으로 문의하시면 보다 자세한 설명 도와드리겠습니다 :)
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg font-semibold">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-base text-gray-600">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
