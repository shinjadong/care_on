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
  experimental: {
    // Framer Motion과 App Router 호환성 개선
    optimizePackageImports: ['framer-motion'],
  },
  transpilePackages: ['framer-motion'],
  async redirects() {
    return [
      {
        source: '/',
        destination: 'https://careon.ai.kr/what',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
