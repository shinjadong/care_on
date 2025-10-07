import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI 블로그 생성기 | CareOn",
  description: "AI가 고품질 블로그 포스트를 자동으로 작성해주는 서비스입니다. 주제만 입력하면 SEO에 최적화된 블로그 콘텐츠가 생성됩니다.",
  keywords: ["AI 블로그", "블로그 생성기", "자동 블로그 작성", "SEO 최적화", "콘텐츠 생성"],
};

export default function AIBlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
