import ServicePage from "@/components/services/service-page";

// 🚀 실시간 업데이트를 위한 캐시 설정
export const revalidate = 0; // 항상 최신 데이터 사용
export const dynamic = 'force-dynamic'; // 동적 렌더링 강제

/**
 * CCTV 서비스 메인 페이지 - 페이지 빌더 기반
 */
export default async function CCTVPage() {
  return (
    <ServicePage
      slug="services-cctv"
      title="CCTV 서비스"
      description="CCTV 보안 서비스"
      editPath="/services/cctv/edit"
    />
  );
}