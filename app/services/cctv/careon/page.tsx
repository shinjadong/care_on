import ServicePage from "@/components/services/service-page";

// 🚀 실시간 업데이트를 위한 캐시 설정
export const revalidate = 0;
export const dynamic = 'force-dynamic';

/**
 * 케어온 CCTV 서비스 페이지 - 페이지 빌더 기반
 */
export default async function CareonCCTVPage() {
  return (
    <ServicePage
      slug="services-cctv-careon"
      title="케어온 CCTV"
      description="케어온 자체 CCTV 보안 서비스"
      editPath="/services/cctv/careon/edit"
    />
  );
}