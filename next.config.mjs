/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    // Framer Motion과 App Router 호환성 개선
    optimizePackageImports: ['framer-motion'],
  },
  transpilePackages: ['framer-motion'],
}

export default nextConfig
