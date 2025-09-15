// 동적 렌더링 강제
export const dynamic = 'force-dynamic';

import ServiceEditPage from "@/components/services/service-edit-page";

/**
 * KT CCTV 서비스 페이지 편집
 */
export default function KTCCTVEditPage() {
  return (
    <ServiceEditPage
      slug="services-cctv-kt"
      title="KT CCTV"
      description="KT CCTV 보안 서비스"
      backPath="/services/cctv/kt"
    />
  );
}