import ServiceEditPage from "@/components/services/service-edit-page";

/**
 * CCTV 서비스 메인 페이지 편집
 */
export default function CCTVEditPage() {
  return (
    <ServiceEditPage
      slug="services-cctv"
      title="CCTV 서비스"
      description="CCTV 보안 서비스"
      backPath="/services/cctv"
    />
  );
}