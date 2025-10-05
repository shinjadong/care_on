/**
 * CareOn Glassmorphic UI Components
 *
 * A complete set of glassmorphic UI components integrated with CareOn's design system.
 * These components provide a modern, translucent aesthetic with backdrop blur effects.
 *
 * @example
 * ```tsx
 * import { GlassCard, GlassButton, GlassNav } from "@/components/ui/glass"
 *
 * function MyComponent() {
 *   return (
 *     <GlassCard>
 *       <GlassCard.Header>
 *         <h2>Glassmorphic Card</h2>
 *       </GlassCard.Header>
 *       <GlassCard.Body>
 *         <p>Beautiful translucent design</p>
 *         <GlassButton>Click me</GlassButton>
 *       </GlassCard.Body>
 *     </GlassCard>
 *   )
 * }
 * ```
 */

// Navigation Components
export { GlassNav } from "./glass-nav"

// Layout Components
export { GlassCard, GlassCardHeader, GlassCardBody, GlassCardFooter } from "./glass-card"
export { GlassSidebar, GlassSidebarNav, GlassSidebarItem } from "./glass-sidebar"

// Form Components
export { GlassButton } from "./glass-button"
export { GlassInput, GlassTextarea } from "./glass-input"

// Overlay Components
export { GlassModal, GlassModalContent } from "./glass-modal"

// Re-export with shorter names for convenience
export { GlassCard as Glass } from "./glass-card"
export { GlassButton as GBtn } from "./glass-button"
export { GlassInput as GInput } from "./glass-input"