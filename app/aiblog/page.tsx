'use client';

import { Suspense, lazy } from 'react';
import { Skeleton } from "@/components/ui/skeleton";

// 동적 임포트로 컴포넌트 레이지 로딩
const Hero = lazy(() => import("@/components/aiblog-landing/hero"));
const SparklesCore = lazy(() => import("@/components/aiblog-landing/sparkles").then(mod => ({ default: mod.SparklesCore })));

// 스켈레톤 로딩 컴포넌트
const HeroSkeleton = () => (
  <div className="w-full max-w-7xl mx-auto px-4 mt-24">
    <Skeleton className="h-24 w-3/4 mb-8" />
    <Skeleton className="h-12 w-1/2 mb-4" />
    <Skeleton className="h-12 w-2/3 mb-12" />
    <div className="flex gap-4">
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-10 w-32" />
    </div>
  </div>
);

export default function AIBlogPage() {
  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      {/* Ambient background with moving particles */}
      <div className="h-full w-full absolute inset-0 z-0">
        <Suspense fallback={<div className="animate-pulse bg-black/90 w-full h-full"></div>}>
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={100}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />
        </Suspense>
      </div>

      <div className="relative z-10">
        <Suspense fallback={<HeroSkeleton />}>
          <Hero />
        </Suspense>
      </div>
    </main>
  );
}
