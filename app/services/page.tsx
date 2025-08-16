"use client"

import { useState } from "react"
import { PackageSelector } from "@/components/services/package-selector"
import { ServiceGrid } from "@/components/services/service-grid"
import { ServiceHero } from "@/components/services/service-hero"

export type PackageType = "basic" | "pro" | "premium"

export default function ServicesPage() {
  const [selectedPackage, setSelectedPackage] = useState<PackageType>("basic")

  return (
    <main className="min-h-screen bg-white">
      <ServiceHero />
      
      <div className="sticky top-0 z-40 ios-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PackageSelector 
            selected={selectedPackage} 
            onSelect={setSelectedPackage} 
          />
        </div>
      </div>

      <ServiceGrid selectedPackage={selectedPackage} />
    </main>
  )
}