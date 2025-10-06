import { redirect } from 'next/navigation'

// 서버 사이드 리다이렉트 - 더 빠르고 SEO 친화적
export default function MainPage() {
  // 서버에서 즉시 리다이렉트 (클라이언트 렌더링 없음)
  redirect('/products')
}
