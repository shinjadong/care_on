import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "마케팅 경험이 전혀 없어도 신청할 수 있나요?",
    answer:
      "네, 오히려 마케팅 경험이 없으신 분들이 더 빠르게 성장합니다. 잘못된 방향으로 굳어진 습관이 없기 때문입니다. 기초부터 차근차근 알려드리며, 사장님의 전문성을 효과적으로 표현하는 방법을 중점적으로 가르칩니다. 단, 기존 경험이 없는 만큼 다른 사장님들에 비해 2배, 3배 이상의 노력을 해주셔야만 합니다.",
  },
  {
    question: "사업으로 너무 바쁜데 시간 투자가 많이 필요한가요?",
    answer:
      "이 과정은 시간을 투자해야 하는 것이 사실입니다. 그러나 평생 마케팅 업체에 계속 비용을 지출하며 현상을 유지하시겠습니까? 혹은 혼자 수많은 정보 속에서 몇 년간 시행착오를 겪으며 해결책을 찾아보시겠습니까? 케어온 아카데미는 전문직 마케팅 대행을 통해 검증된 노하우를 바탕으로 마케팅 대행사에 지불할 비용을 아끼고 평생 써먹을 수 있는 스킬을 갖게 해드립니다. 이를 위해서는 어느정도의 시간을 투자해 주셔야합니다.",
  },
  {
    question: "케어온의 아카데미는 어떤 사업장에 적합한가요?",
    answer:
      "신규 창업 준비부터 경쟁 심화로 고객이 감소한 사업장, 대행사 성과에 불만족한 사업장까지 마케팅에 어려움을 겪고 계신 모든 사업장에 적합합니다.",
  },
  {
    question: "환불 정책은 어떻게 되나요?",
    answer:
      "케어온 아카데미 수업이 불만족스러우셨다면 환불해 드립니다. 단 아카데미 수업은 대행이 아닌 교육 서비스입니다. 수강생이 성실하게 커리큘럼을 따라오고 꾸준히 실행해 주셔야 효과를 볼 수 있는 시스템입니다. 대행과 같이 편안하지는 않을 것입니다. 지금의 내 상황을 적극적으로 바꾸고자 하시는 분만 신청해 주세요. 온 힘을 다해 도울 것을 약속합니다.",
  },
]

export function FaqSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
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