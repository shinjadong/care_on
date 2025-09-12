import ServiceEditPage from "@/components/services/service-edit-page";

/**
 * 케어온 CCTV 서비스 페이지 편집
 */
export default function CareonCCTVEditPage() {
  return (
    <ServiceEditPage
      slug="services-cctv-careon"
      title="케어온 CCTV"
      description="케어온 자체 CCTV 보안 서비스"
      backPath="/services/cctv/careon"
    />
  );
}