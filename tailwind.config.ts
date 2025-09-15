import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["'Spoqa Han Sans Neo'", "sans-serif"],
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        md: "1rem",
        lg: "1.25rem",
        xl: "1.5rem",
        h1: "2.5rem",
        h2: "2rem",
        h3: "1.75rem",
        // CareOn specific font sizes - replacing hardcoded values
        "hero": "clamp(3rem, 8vw, 6rem)", // Replaces Apple Music hero font size
        "hero-mobile": "clamp(2.5rem, 6vw, 5rem)", // Mobile hero
        "display": "clamp(2.5rem, 5vw, 4rem)", // Display text
      },
      spacing: {
        "1": "0.25rem",
        "2": "0.5rem",
        "3": "0.75rem",
        "4": "1rem",
        "5": "1.25rem",
        "6": "1.5rem",
        "8": "2rem",
        "10": "2.5rem",
        "12": "3rem",
        // CareOn specific spacing - replacing hardcoded values
        "phone-w": "260px", // Mobile phone width
        "phone-w-sm": "280px", // Small mobile phone width
        "phone-h": "530px", // Mobile phone height
        "phone-h-sm": "570px", // Small mobile phone height
        "section": "80px", // Section padding
        "section-sm": "60px", // Small section padding
        "hero-padding": "60px", // Hero section padding
        "hero-padding-mobile": "40px", // Mobile hero padding
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "16px",
        circle: "50%",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--primary-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        /* CareOn 브랜드 색상 시스템 */
        brand: {
          DEFAULT: "hsl(var(--brand))",
          foreground: "hsl(var(--brand-foreground))",
        },
        /* Chart colors for admin dashboard */
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        /* Sidebar colors for admin panel */
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0%)" },
        },
        "pulse-soft": {
          "0%": { opacity: "0.9" },
          "66.67%": { opacity: "0.9" },
          "83.33%": { opacity: "0.85" },
          "100%": { opacity: "0.9" },
        },
        "slide-up-bounce": {
          "0%": {
            transform: "translateY(100px)",
            opacity: "0"
          },
          "60%": {
            transform: "translateY(-10px)",
            opacity: "1"
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1"
          },
        },
        // CareOn specific animations
        "slide-down": {
          from: { transform: "translateY(-20px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "bounce-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "slide-up-from-bottom": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "marquee-slow": "marquee 90s linear infinite",
        "marquee-medium": "marquee 40s linear infinite",
        "marquee-fast": "marquee 25s linear infinite",
        "marquee-reverse-slow": "marquee-reverse 60s linear infinite",
        "marquee-reverse-medium": "marquee-reverse 40s linear infinite",
        "marquee-reverse-fast": "marquee-reverse 25s linear infinite",
        "pulse-soft": "pulse-soft 7.5s ease-in-out infinite",
        "slide-up-bounce": "slide-up-bounce 0.6s ease-out forwards",
        // CareOn specific animations
        "slide-down": "slide-down 0.3s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "bounce-slow": "bounce-slow 2s ease-in-out infinite",
        "slide-up-from-bottom": "slide-up-from-bottom 0.4s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
