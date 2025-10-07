"use client"

import Link from "next/link"
import { LucideIcon, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"

interface ServiceCardProps {
  service: {
    id: string
    title: string
    subtitle: string
    description: string
    icon: LucideIcon
    color: string
    features: string[]
    price: string
    href: string
  }
  index: number
}

export function ServiceCard({ service, index }: ServiceCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const Icon = service.icon

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, index * 100)

    return () => clearTimeout(timer)
  }, [index])

  return (
    <Link href={service.href}>
      <div
        className={`
          group relative bg-white rounded-3xl overflow-hidden border border-gray-100
          apple-card cursor-pointer
          transition-all duration-500
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        `}
      >
        {/* Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

        <div className="relative p-8">
          {/* Icon */}
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-8 h-8 text-white" />
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-500 mb-2">{service.subtitle}</p>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
            <p className="text-gray-600 leading-relaxed">{service.description}</p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {service.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-brand rounded-full" />
                <span className="text-sm text-gray-600">{feature}</span>
              </div>
            ))}
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
            <div>
              <p className="text-sm text-gray-500 mb-1">월 요금</p>
              <p className="text-xl font-bold text-gray-900">{service.price}</p>
            </div>
            <div className="flex items-center gap-2 text-brand font-medium group-hover:gap-3 transition-all">
              자세히 보기
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
