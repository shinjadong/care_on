import ServicePage from "@/components/services/service-page";

// 🚀 실시간 업데이트를 위한 캐시 설정
export const revalidate = 0;
export const dynamic = 'force-dynamic';

/**
 * LG U+ CCTV 서비스 페이지 - 페이지 빌더 기반
 */
export default async function LGUCCTVPage() {
  return (
    <ServicePage
      slug="services-cctv-lgu"
      title="LG U+ CCTV"
      description="LG U+ CCTV 보안 서비스"
      editPath="/services/cctv/lgu/edit"
    />
  );
}