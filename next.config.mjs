/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aet4p1ka2mfpbmiq.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'pkehcfbjotctvneordob.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
  },
  // 루트 경로에서 /what으로 리다이렉트 (SEO 최적화)
  async redirects() {
    return [
      {
        source: '/',
        destination: '/what',
        permanent: false, // 임시 리다이렉트 (302)
      },
    ]
  },
  experimental: {
    // Framer Motion과 App Router 호환성 개선
    optimizePackageImports: ['framer-motion'],
  },
  transpilePackages: ['framer-motion'],
}

export default nextConfig
