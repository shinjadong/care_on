import ServicePage from "@/components/services/service-page";

// 🚀 실시간 업데이트를 위한 캐시 설정
export const revalidate = 0;
export const dynamic = 'force-dynamic';

/**
 * KT CCTV 서비스 페이지 - 페이지 빌더 기반
 */
export default async function KTCCTVPage() {
  return (
    <ServicePage
      slug="services-cctv-kt"
      title="KT CCTV"
      description="KT CCTV 보안 서비스"
      editPath="/services/cctv/kt/edit"
    />
  );
}