"use client"

import { useState } from "react"
import { Home, Search, BarChart3, Bell, Settings, Plus, X } from "lucide-react"
import {
  GlassNav,
  GlassCard,
  GlassButton,
  GlassInput,
  GlassTextarea,
  GlassModal,
  GlassSidebar
} from "@/components/ui/glass"

export default function GlassDemoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const menuItems = [
    {
      icon: Home,
      label: "Dashboard",
      isActive: true,
    },
    {
      icon: Search,
      label: "Search",
    },
    {
      icon: BarChart3,
      label: "Analytics",
    },
    {
      icon: Bell,
      label: "Notifications",
    },
    {
      icon: Settings,
      label: "Settings",
    },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)
          `
        }}
      />

      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              CareOn Glassmorphic UI Demo
            </h1>
            <p className="text-white/80 text-lg">
              Beautiful translucent components with backdrop blur effects
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Navigation Demo */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">Navigation</h2>
              <GlassNav menuItems={menuItems} />
            </div>

            {/* Cards Demo */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">Cards & Forms</h2>

              <GlassCard>
                <GlassCard.Header>
                  <h3 className="text-xl font-semibold text-white">Contact Form</h3>
                  <p className="text-white/70 text-sm">Send us a message</p>
                </GlassCard.Header>
                <GlassCard.Body>
                  <div className="space-y-4">
                    <GlassInput placeholder="Your name" />
                    <GlassInput type="email" placeholder="Email address" />
                    <GlassTextarea
                      placeholder="Your message"
                      rows={4}
                    />
                  </div>
                </GlassCard.Body>
                <GlassCard.Footer>
                  <div className="flex gap-3">
                    <GlassButton variant="strong" size="md">
                      Send Message
                    </GlassButton>
                    <GlassButton
                      variant="default"
                      size="md"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Open Modal
                    </GlassButton>
                  </div>
                </GlassCard.Footer>
              </GlassCard>

              {/* Status Cards */}
              <div className="grid grid-cols-2 gap-4">
                <GlassCard className="glass-bg-primary">
                  <GlassCard.Body>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">1,234</div>
                      <div className="text-white/70 text-sm">Total Users</div>
                    </div>
                  </GlassCard.Body>
                </GlassCard>

                <GlassCard className="glass-bg-secondary">
                  <GlassCard.Body>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">89.5%</div>
                      <div className="text-white/70 text-sm">Uptime</div>
                    </div>
                  </GlassCard.Body>
                </GlassCard>
              </div>
            </div>

            {/* Sidebar Demo */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">Sidebar</h2>

              <GlassSidebar className="h-80">
                <div className="p-4 glass-border-medium border-b">
                  <h3 className="text-lg font-semibold text-white">Admin Panel</h3>
                  <p className="text-white/70 text-sm">Manage your app</p>
                </div>

                <GlassSidebar.Nav>
                  <GlassSidebar.Item
                    icon={Home}
                    label="Dashboard"
                    isActive={true}
                  />
                  <GlassSidebar.Item
                    icon={BarChart3}
                    label="Analytics"
                  />
                  <GlassSidebar.Item
                    icon={Bell}
                    label="Notifications"
                  />
                  <GlassSidebar.Item
                    icon={Settings}
                    label="Settings"
                  />
                </GlassSidebar.Nav>

                <div className="p-4 mt-auto glass-border-medium border-t">
                  <GlassButton size="sm" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                  </GlassButton>
                </div>
              </GlassSidebar>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard>
              <GlassCard.Body>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Beautiful Design</h3>
                  <p className="text-white/70 text-sm">Modern glassmorphic aesthetic with smooth animations</p>
                </div>
              </GlassCard.Body>
            </GlassCard>

            <GlassCard>
              <GlassCard.Body>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Fully Responsive</h3>
                  <p className="text-white/70 text-sm">Works perfectly on all devices and screen sizes</p>
                </div>
              </GlassCard.Body>
            </GlassCard>

            <GlassCard>
              <GlassCard.Body>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Easy to Use</h3>
                  <p className="text-white/70 text-sm">Simple API with TypeScript support and great DX</p>
                </div>
              </GlassCard.Body>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Modal Demo */}
      <GlassModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <GlassModal.Content>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Modal Dialog</h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-white/80 mb-6">
            This is a glassmorphic modal dialog with backdrop blur effects.
            It includes smooth animations and keyboard support.
          </p>

          <div className="flex gap-3">
            <GlassButton
              variant="strong"
              onClick={() => setIsModalOpen(false)}
            >
              Confirm
            </GlassButton>
            <GlassButton onClick={() => setIsModalOpen(false)}>
              Cancel
            </GlassButton>
          </div>
        </GlassModal.Content>
      </GlassModal>
    </div>
  )
}