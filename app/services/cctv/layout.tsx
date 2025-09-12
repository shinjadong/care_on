import ServiceNavigation from "@/components/services/service-navigation";

const cctvSubServices = [
  {
    id: "kt",
    name: "KT CCTV",
    path: "/services/cctv/kt"
  },
  {
    id: "lgu",
    name: "LG U+ CCTV",
    path: "/services/cctv/lgu"
  },
  {
    id: "careon",
    name: "케어온 CCTV",
    path: "/services/cctv/careon"
  }
];

export default function CCTVLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <ServiceNavigation
        basePath="/services/cctv"
        title="CCTV"
        subServices={cctvSubServices}
      />
      {children}
    </div>
  );
}