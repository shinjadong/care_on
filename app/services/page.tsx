"use client"

import { useState } from "react"
import { ServicesHero } from "@/components/services/hero"
import { PackageForMe, PackageType } from "@/components/services/packageforme"
import { ServiceGrid } from "@/components/services/service-grid"

export default function ServicesPage() {
  const [selectedPackage, setSelectedPackage] = useState<PackageType>("standard")

  return (
    <main className="min-h-screen bg-white">
      {/* Apple Music Style Hero Section */}
      <ServicesHero />

      {/* Package For Me - Apple Music Devices Style */}
      <PackageForMe 
        selected={selectedPackage} 
        onSelect={setSelectedPackage} 
      />

      {/* Service Grid with real data */}
      <ServiceGrid selectedPackage={selectedPackage} />
    </main>
  )
}